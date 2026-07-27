import { FunctionComponent, MouseEvent, useEffect, useRef } from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import {
  AnchorEnd,
  DefaultEdge,
  Edge,
  EdgeTerminalType,
  GraphElement,
  isNode,
  Node,
  NodeStyle,
  Point,
  SELECTION_EVENT,
  SELECTION_STATE,
  WithSelectionProps
} from '@patternfly/react-topology';

type AggregateEdgeProps = {
  element: GraphElement;
} & WithSelectionProps;

interface XY {
  x: number;
  y: number;
}

const MOVE_SNAP_THRESHOLD = 3;
const HULL_SNAP_THRESHOLD = 2;
const HULL_SETTLE_MS = 100;

const findRelatedBridge = (stub: Edge): Edge | undefined => {
  const bridgeId = stub.getData()?.bridgeId as string | undefined;
  if (bridgeId) {
    return stub.getController().getEdgeById(bridgeId);
  }

  const bridgeKey = stub.getData()?.bridgeKey as string | undefined;
  if (!bridgeKey) {
    return undefined;
  }

  return stub
    .getGraph()
    .getEdges()
    .find((e) => e.getData()?.role === 'bridge' && e.getData()?.bridgeKey === bridgeKey);
};

const readGroupPadding = (group: Node): number => {
  const padding = group.getStyle<NodeStyle>()?.padding;
  if (typeof padding === 'number') {
    return padding;
  }
  if (padding && typeof padding === 'object') {
    const box = padding as { top?: number; right?: number; bottom?: number; left?: number };
    return Math.max(box.top ?? 0, box.right ?? 0, box.bottom ?? 0, box.left ?? 0);
  }
  return 17;
};

const ellipseOnBounds = (group: Node, toward: Node): XY => {
  const b = group.getBounds();
  const cx = b.x + b.width / 2;
  const cy = b.y + b.height / 2;
  const reference = toward.getBounds().getCenter();
  const extra = Math.max(10, readGroupPadding(group) * 0.5);
  const width = b.width + extra * 2;
  const height = b.height + extra * 2;

  if (width === 0 || height === 0 || (cx === reference.x && cy === reference.y)) {
    return { x: cx, y: cy };
  }

  const dispX = (cx - reference.x) / (width / 2);
  const dispY = (cy - reference.y) / (height / 2);
  const len = Math.sqrt(dispX * dispX + dispY * dispY);
  if (len === 0) {
    return { x: cx, y: cy };
  }
  const lenProportion = (len - 1) / len;
  return {
    x: (cx - reference.x) * lenProportion + reference.x,
    y: (cy - reference.y) * lenProportion + reference.y
  };
};

interface AnchorWithSvg {
  svgElement?: SVGElement;
  getLocation: (reference: Point) => Point;
}

const getAnchorSvg = (group: Node, end: AnchorEnd): SVGElement | undefined => {
  const anchor = group.getAnchor(end) as AnchorWithSvg | undefined;
  return anchor?.svgElement;
};

/** Motion-time outline snap: coarse hull path sample, or O(1) for rect/ellipse. */
const approxBorderFacing = (group: Node, toward: Node, end: AnchorEnd = AnchorEnd.both): XY => {
  const reference = toward.getBounds().getCenter();
  const svg = getAnchorSvg(group, end);

  if (svg instanceof SVGRectElement || svg instanceof SVGEllipseElement || svg instanceof SVGCircleElement) {
    const loc = group.getAnchor(end).getLocation(reference);
    return { x: loc.x, y: loc.y };
  }

  if (svg instanceof SVGPathElement && svg.viewportElement) {
    try {
      const localRef = reference.clone();
      group.translateFromParent(localRef);

      const pathLength = svg.getTotalLength();
      if (pathLength > 0) {
        const box = svg.getBBox();
        const cx = box.x + box.width / 2;
        const cy = box.y + box.height / 2;
        const vx = localRef.x - cx;
        const vy = localRef.y - cy;
        const vLen = Math.hypot(vx, vy) || 1;

        const samples = 16;
        let best: XY | undefined;
        let bestScore = Infinity;
        for (let i = 0; i < samples; i++) {
          const p = svg.getPointAtLength((pathLength * i) / samples);
          const wx = p.x - cx;
          const wy = p.y - cy;
          const dot = vx * wx + vy * wy;
          if (dot <= 0) {
            continue;
          }
          const cross = Math.abs(vx * wy - vy * wx) / vLen;
          if (cross < bestScore) {
            bestScore = cross;
            best = { x: p.x, y: p.y };
          }
        }

        if (best) {
          const pt = new Point(best.x, best.y);
          group.translateToParent(pt);
          return { x: pt.x, y: pt.y };
        }
      }
    } catch {
      // fall through
    }
  }

  return ellipseOnBounds(group, toward);
};

const hullBorderFacing = (group: Node, toward: Node, end: AnchorEnd = AnchorEnd.both): XY => {
  const reference = toward.getBounds().getCenter();
  const anchor = group.getAnchor(end);
  if (anchor) {
    const loc = anchor.getLocation(reference);
    return { x: loc.x, y: loc.y };
  }
  return approxBorderFacing(group, toward, end);
};

const getPathPeer = (stub: Edge, role: 'exit' | 'entry', bridge: Edge): Node | undefined => {
  const bridgeSource = bridge.getSource();
  const bridgeTarget = bridge.getTarget();
  if (!isNode(bridgeSource) || !isNode(bridgeTarget)) {
    return undefined;
  }

  const endIds = new Set([stub.getSource().getId(), stub.getTarget().getId()]);
  if (endIds.has(bridgeSource.getId())) {
    return bridgeTarget;
  }
  if (endIds.has(bridgeTarget.getId())) {
    return bridgeSource;
  }

  const groupNode = role === 'exit' ? stub.getTarget() : stub.getSource();
  if (!isNode(groupNode)) {
    return undefined;
  }
  const center = groupNode.getBounds().getCenter();
  const sc = bridgeSource.getBounds().getCenter();
  const tc = bridgeTarget.getBounds().getCenter();
  const dSource = (sc.x - center.x) ** 2 + (sc.y - center.y) ** 2;
  const dTarget = (tc.x - center.x) ** 2 + (tc.y - center.y) ** 2;
  return dSource <= dTarget ? bridgeTarget : bridgeSource;
};

const getRelatedSegmentIds = (edge: Edge): string[] => {
  const leafIds = (edge.getData()?.aggregatedEdgeIds as string[] | undefined) || [];
  if (!leafIds.length) {
    return [edge.getId()];
  }

  const leafSet = new Set(leafIds);
  return edge
    .getGraph()
    .getEdges()
    .filter((e) => {
      const ids = (e.getData()?.aggregatedEdgeIds as string[] | undefined) || [];
      return ids.some((id) => leafSet.has(id));
    })
    .map((e) => e.getId());
};

const significantlyMoved = (a: Point, x: number, y: number, threshold: number): boolean =>
  Math.abs(a.x - x) > threshold || Math.abs(a.y - y) > threshold;

const boundsKey = (node: Node): string => {
  const b = node.getBounds();
  return `${Math.round(b.x)},${Math.round(b.y)},${Math.round(b.width)},${Math.round(b.height)}`;
};

interface SnapPlan {
  start?: XY;
  end?: XY;
}

const applySnapPlan = (edge: Edge, plan: SnapPlan, threshold: number, clearUnset: boolean) => {
  action(() => {
    const startFixed = plan.start != null;
    const endFixed = plan.end != null;
    if (!startFixed && !endFixed) {
      return;
    }
    const startMoved = startFixed
      ? significantlyMoved(edge.getStartPoint(), plan.start!.x, plan.start!.y, threshold)
      : false;
    const endMoved = endFixed ? significantlyMoved(edge.getEndPoint(), plan.end!.x, plan.end!.y, threshold) : false;
    if (!startMoved && !endMoved) {
      return;
    }
    if (startFixed) {
      edge.setStartPoint(Math.round(plan.start!.x), Math.round(plan.start!.y));
    } else if (clearUnset) {
      edge.setStartPoint();
    }
    if (endFixed) {
      edge.setEndPoint(Math.round(plan.end!.x), Math.round(plan.end!.y));
    } else if (clearUnset) {
      edge.setEndPoint();
    }
  })();
};

const computeSnapPlan = (edge: Edge, role: string | undefined, precise: boolean): SnapPlan | undefined => {
  const sourceNode = edge.getSource();
  const targetNode = edge.getTarget();
  if (!isNode(sourceNode) || !isNode(targetNode)) {
    return undefined;
  }

  const borderFacing = precise
    ? (group: Node, toward: Node, end?: AnchorEnd) => hullBorderFacing(group, toward, end)
    : (group: Node, toward: Node, end?: AnchorEnd) => approxBorderFacing(group, toward, end ?? AnchorEnd.both);

  if (role === 'bridge') {
    return {
      start: borderFacing(sourceNode, targetNode, AnchorEnd.source),
      end: borderFacing(targetNode, sourceNode, AnchorEnd.target)
    };
  }

  if (role === 'exit' || role === 'entry') {
    const bridge = findRelatedBridge(edge);
    if (!bridge) {
      return undefined;
    }
    const peer = getPathPeer(edge, role, bridge);
    if (!peer) {
      return undefined;
    }
    const plan: SnapPlan = {};
    if (sourceNode.isGroup()) {
      plan.start = borderFacing(sourceNode, peer, AnchorEnd.source);
    }
    if (targetNode.isGroup()) {
      plan.end = borderFacing(targetNode, peer, AnchorEnd.target);
    }
    return plan;
  }

  return undefined;
};

/**
 * Aggregate edge: cheap AABB snaps while layout moves, hull refine after settle.
 */
const AggregateEdge: FunctionComponent<AggregateEdgeProps> = observer(({ element, selected, ...rest }) => {
  const edge = element as Edge;
  const data = edge.getData() || {};
  const role = data.role as string | undefined;
  const count = data.count as number | undefined;
  const bidirectional = !!data.bidirectional;

  const sourceNode = edge.getSource();
  const targetNode = edge.getTarget();
  let geoKey = `${boundsKey(sourceNode)}|${boundsKey(targetNode)}`;
  if (role === 'exit' || role === 'entry') {
    const bridge = findRelatedBridge(edge);
    if (bridge) {
      geoKey += `|${boundsKey(bridge.getSource())}|${boundsKey(bridge.getTarget())}`;
    }
  }

  const settleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    if (role !== 'bridge' && role !== 'exit' && role !== 'entry') {
      return undefined;
    }

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    rafRef.current = requestAnimationFrame(() => {
      const plan = computeSnapPlan(edge, role, false);
      if (plan) {
        applySnapPlan(edge, plan, MOVE_SNAP_THRESHOLD, true);
      }
    });

    if (settleTimerRef.current) {
      clearTimeout(settleTimerRef.current);
    }
    settleTimerRef.current = setTimeout(() => {
      const plan = computeSnapPlan(edge, role, true);
      if (plan) {
        applySnapPlan(edge, plan, HULL_SNAP_THRESHOLD, true);
      }
    }, HULL_SETTLE_MS);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      if (settleTimerRef.current) {
        clearTimeout(settleTimerRef.current);
      }
    };
  }, [edge, role, geoKey]);

  const handleSelect = (e: MouseEvent) => {
    e.stopPropagation();
    const relatedIds = getRelatedSegmentIds(edge);
    const ordered = [edge.getId(), ...relatedIds.filter((id) => id !== edge.getId())];
    const state = edge.getController().getState<{ [SELECTION_STATE]?: string[] }>();
    const allSelected = ordered.every((id) => state[SELECTION_STATE]?.includes(id));
    const selectedIds = allSelected ? [] : ordered;
    action(() => {
      state[SELECTION_STATE] = selectedIds;
    })();
    edge.getController().fireEvent(SELECTION_EVENT, selectedIds);
  };

  const startTerminalType = role === 'bridge' && bidirectional ? EdgeTerminalType.directional : EdgeTerminalType.none;
  let endTerminalType = EdgeTerminalType.none;
  if (role === 'bridge') {
    endTerminalType = EdgeTerminalType.directional;
  } else if (role === 'entry' && isNode(targetNode) && !targetNode.isGroup()) {
    endTerminalType = EdgeTerminalType.directional;
  }

  const customLabel = edge.getLabel();
  const metricTag = data.tag as string | undefined;
  const tag = customLabel || metricTag || (role === 'bridge' && count && count > 1 ? String(count) : undefined);

  return (
    <DefaultEdge
      element={element}
      {...rest}
      selected={selected}
      onSelect={handleSelect}
      tag={tag}
      startTerminalType={startTerminalType}
      endTerminalType={endTerminalType}
    />
  );
});

export default AggregateEdge;
