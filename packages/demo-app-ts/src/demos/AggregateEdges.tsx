import { useEffect, useLayoutEffect, useState, FunctionComponent, MouseEvent } from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import { ToolbarGroup, ToolbarItem, Checkbox } from '@patternfly/react-core';
import {
  ColaLayout,
  createAggregateEdges,
  DefaultEdge,
  DefaultNode,
  Edge,
  EdgeModel,
  EdgeTerminalType,
  Graph,
  GraphComponent,
  GraphElement,
  isEdge,
  Layout,
  LayoutFactory,
  Model,
  ModelKind,
  NodeModel,
  NodeShape,
  SELECTION_EVENT,
  SELECTION_STATE,
  SelectionEventListener,
  TopologyView,
  Visualization,
  VisualizationProvider,
  VisualizationSurface,
  withDragNode,
  withPanZoom,
  withSelection,
  useEventListener,
  WithSelectionProps
} from '@patternfly/react-topology';
import DemoControlBar from './DemoControlBar';
import DemoDefaultGroup from '../components/DemoDefaultGroup';

const layoutFactory: LayoutFactory = (_type: string, graph: Graph): Layout | undefined =>
  new ColaLayout(graph, { layoutOnDrag: false, nodeDistance: 80 });

type AggregateEdgeProps = {
  element: GraphElement;
} & WithSelectionProps;

const findRelatedBridge = (stub: Edge): Edge | undefined => {
  const bridgeKey = stub.getData()?.bridgeKey as string | undefined;
  if (!bridgeKey) {
    return undefined;
  }

  return stub
    .getGraph()
    .getEdges()
    .find((e) => isEdge(e) && e.getData()?.role === 'bridge' && e.getData()?.bridgeKey === bridgeKey);
};

/**
 * Select related aggregate segments via shared original leaf edge ids.
 * Clicking an exit/entry selects only that connection's path; clicking a bridge
 * (which carries every leaf on that merge) selects all stubs that use it.
 */
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

const AggregateEdge: FunctionComponent<AggregateEdgeProps> = observer(({ element, selected, ...rest }) => {
  const edge = element as Edge;
  const data = edge.getData() || {};
  const role = data.role as string | undefined;
  const count = data.count as number | undefined;
  const bidirectional = !!data.bidirectional;

  // Observe endpoint geometry so this component re-renders when nodes/groups move.
  edge.getSource().getBounds();
  edge.getTarget().getBounds();

  let snapX: number | undefined;
  let snapY: number | undefined;
  if (role === 'exit' || role === 'entry') {
    const bridge = findRelatedBridge(edge);
    if (bridge) {
      // Track both bridge ends so the stub updates when either side moves.
      const bridgeStart = bridge.getStartPoint();
      const bridgeEnd = bridge.getEndPoint();
      const groupNode = role === 'exit' ? edge.getTarget() : edge.getSource();
      const pointOnGroup = bridge.getSource() === groupNode ? bridgeStart : bridgeEnd;
      snapX = pointOnGroup.x;
      snapY = pointOnGroup.y;
    }
  }

  useLayoutEffect(() => {
    action(() => {
      if ((role === 'exit' || role === 'entry') && snapX != null && snapY != null) {
        if (role === 'exit') {
          edge.setStartPoint();
          edge.setEndPoint(snapX, snapY);
        } else {
          edge.setStartPoint(snapX, snapY);
          edge.setEndPoint();
        }
      } else {
        edge.setStartPoint();
        edge.setEndPoint();
      }
    })();
  }, [edge, role, snapX, snapY]);

  const handleSelect = (e: MouseEvent) => {
    e.stopPropagation();
    const relatedIds = getRelatedSegmentIds(edge);
    const state = edge.getController().getState<{ [SELECTION_STATE]?: string[] }>();
    const allSelected = relatedIds.every((id) => state[SELECTION_STATE]?.includes(id));
    const selectedIds = allSelected ? [] : relatedIds;
    action(() => {
      state[SELECTION_STATE] = selectedIds;
    })();
    edge.getController().fireEvent(SELECTION_EVENT, selectedIds);
  };

  const startTerminalType = role === 'bridge' && bidirectional ? EdgeTerminalType.directional : EdgeTerminalType.none;
  const endTerminalType = role === 'bridge' || role === 'entry' ? EdgeTerminalType.directional : EdgeTerminalType.none;

  // Prefer custom label, then summed metric tag, then merge count.
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

const LabeledDefaultEdge: FunctionComponent<AggregateEdgeProps> = observer(({ element, ...rest }) => {
  const label = element.getLabel();
  const metricTag = element.getData()?.tag as string | undefined;
  return <DefaultEdge element={element} {...rest} tag={label || metricTag || undefined} />;
});

const leaf = (id: string, label: string): NodeModel => ({
  id,
  type: 'node',
  label,
  width: 40,
  height: 40,
  shape: NodeShape.ellipse
});

const COLLAPSED_SIZE = 60;

const groupNode = (
  id: string,
  label: string,
  children: string[],
  options: { collapsed?: boolean; background?: string } = {}
): NodeModel => ({
  id,
  type: 'group',
  label,
  group: true,
  children,
  collapsed: options.collapsed,
  // Collapsed groups need explicit size so edge anchors have a real target.
  ...(options.collapsed ? { width: COLLAPSED_SIZE, height: COLLAPSED_SIZE } : {}),
  style: { padding: 20 },
  data: {
    background: options.background ?? '#f0f0f0',
    collapsedWidth: COLLAPSED_SIZE,
    collapsedHeight: COLLAPSED_SIZE,
    collapsible: true
  }
});

/** Demo byte-rate formatter (NetObserv-style: scale then append unit). */
const formatBps = (bps: number): string => {
  if (bps >= 1_000_000) {
    return `${(bps / 1_000_000).toFixed(1)} MBps`;
  }
  if (bps >= 1_000) {
    return `${(bps / 1_000).toFixed(1)} kBps`;
  }
  return `${Math.round(bps)} Bps`;
};

/**
 * After structural aggregation, sum leaf metrics onto the label-bearing bridge
 * and format a single tag — mirrors how NetObserv should merge byte rates.
 */
const applyMetricTags = (edges: EdgeModel[]): EdgeModel[] => {
  const byId = new Map(edges.map((e) => [e.id, e]));

  edges.forEach((edge) => {
    const role = edge.data?.role as string | undefined;
    const leafIds: string[] = edge.data?.aggregatedEdgeIds || [];
    if (!leafIds.length) {
      // Non-aggregate leaf: format its own bps if present.
      if (typeof edge.data?.bps === 'number' && edge.data.bps > 0) {
        edge.data = { ...edge.data, tag: formatBps(edge.data.bps) };
      }
      return;
    }

    // Put the summed metric on the bridge only (one tag along a multi-part path).
    if (role && role !== 'bridge') {
      return;
    }

    const bps = leafIds.reduce((sum, id) => sum + (byId.get(id)?.data?.bps || 0), 0);
    if (bps > 0) {
      edge.data = { ...edge.data, bps, tag: formatBps(bps) };
    }
  });

  return edges;
};

const link = (source: string, target: string, options: { label?: string; bps?: number } = {}): EdgeModel => ({
  id: `${source}_${target}`,
  type: 'edge',
  source,
  target,
  ...(options.label ? { label: options.label } : {}),
  ...(options.bps != null ? { data: { bps: options.bps } } : {})
});

interface DemoOptions {
  groupEdges: boolean;
  collapsedGroups: boolean;
  showEdgeLabels: boolean;
  showMetricTags: boolean;
}

const getModel = ({ groupEdges, collapsedGroups, showEdgeLabels, showMetricTags }: DemoOptions): Model => {
  const group1Nodes = [leaf('11', '1-1'), leaf('12', '1-2'), leaf('13', '1-3')];
  const group2Nodes = [leaf('21', '2-1'), leaf('22', '2-2'), leaf('23', '2-3'), leaf('24', '2-4'), leaf('25', '2-5')];
  const subGroup1Nodes = [leaf('14', '1-4'), leaf('15', '1-5')];
  const subGroup3Nodes = [leaf('31', '3-1'), leaf('32', '3-2'), leaf('33', '3-3')];

  const subGroup1 = groupNode(
    'Subgroup 1',
    'Subgroup 1',
    subGroup1Nodes.map((n) => n.id),
    { background: '#fce8e8' }
  );
  const subGroup3 = groupNode(
    'Subgroup 3',
    'Subgroup 3',
    subGroup3Nodes.map((n) => n.id),
    { collapsed: collapsedGroups, background: '#e8f4fc' }
  );
  const group1 = groupNode('Group 1', 'Group 1', [...group1Nodes.map((n) => n.id), subGroup1.id], {
    background: '#f5f0e6'
  });
  const group2 = groupNode(
    'Group 2',
    'Group 2',
    group2Nodes.map((n) => n.id),
    { collapsed: collapsedGroups, background: '#eaf5ea' }
  );
  const group3 = groupNode('Group 3', 'Group 3', [subGroup3.id], { background: '#f5eaf2' });

  const ungrouped = [leaf('1', 'One'), leaf('2', 'Two')];

  const nodes: NodeModel[] = [
    ...ungrouped,
    ...group1Nodes,
    ...subGroup1Nodes,
    ...group2Nodes,
    ...subGroup3Nodes,
    group1,
    group2,
    subGroup1,
    subGroup3,
    group3
  ];

  const label = (text: string) => (showEdgeLabels ? text : undefined);
  const bps = (value: number) => (showMetricTags ? value : undefined);

  const edges: EdgeModel[] = [
    // Intra-group edges (should stay visible when aggregating between groups)
    link('11', '12', { label: label('local'), bps: bps(120) }),
    link('12', '13', { bps: bps(80) }),
    link('14', '15', { bps: bps(40) }),
    link('21', '22', { bps: bps(60) }),
    link('22', '23', { bps: bps(90) }),
    link('24', '25', { bps: bps(50) }),
    link('31', '32', { bps: bps(70) }),
    link('32', '33', { bps: bps(30) }),
    // Group 1 → Group 2  (bridge should sum these rates)
    link('11', '21', { label: label('traffic'), bps: bps(400) }),
    link('12', '21', { bps: bps(500) }),
    link('13', '21', { bps: bps(300) }),
    // Ungrouped → Subgroup 3 members
    link('1', '31', { label: label('ingress'), bps: bps(250) }),
    link('1', '32', { bps: bps(150) }),
    link('2', '31', { bps: bps(200) }),
    // Node → group id (ungrouped node targets the group itself)
    link('2', 'Group 2', { label: label('attach'), bps: bps(180) }),
    link('1', 'Subgroup 3', { bps: bps(100) }),
    // Group 2 ↔ Subgroup 3 (bidirectional mix)
    link('21', '31', { label: label('mesh'), bps: bps(350) }),
    link('32', '21', { bps: bps(220) }),
    link('21', '32', { bps: bps(180) }),
    link('22', '31', { bps: bps(140) }),
    link('22', '32', { bps: bps(160) }),
    // Subgroup ↔ subgroup under different parents
    link('14', '31', { label: label('peer'), bps: bps(90) }),
    link('15', '32', { bps: bps(110) }),
    link('33', '14', { bps: bps(75) }),
    // Cross nest: Group 2 member → Group 1
    link('23', '11', { label: label('sync'), bps: bps(450) })
  ];

  let resultEdges = createAggregateEdges('aggregate-edge', edges, nodes, {
    groupEdges,
    // Always honor `collapsed` on nodes; when none are collapsed this is a no-op.
    collapsedGroups: true
  });

  if (showMetricTags) {
    resultEdges = applyMetricTags(resultEdges);
  }

  return {
    graph: {
      id: 'g1',
      type: 'graph',
      layout: 'Cola'
    },
    nodes,
    edges: resultEdges
  };
};

const AggregateEdgesView: React.FunctionComponent<{ controller: Visualization }> = ({ controller }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [groupEdges, setGroupEdges] = useState(true);
  const [collapsedGroups, setCollapsedGroups] = useState(false);
  const [showEdgeLabels, setShowEdgeLabels] = useState(false);
  const [showMetricTags, setShowMetricTags] = useState(false);

  useEventListener<SelectionEventListener>(SELECTION_EVENT, (ids) => {
    setSelectedIds(ids);
  });

  useEffect(() => {
    action(() => {
      controller.fromModel(getModel({ groupEdges, collapsedGroups, showEdgeLabels, showMetricTags }), false);
      controller.getGraph().layout();
      controller.getGraph().fit(80);
    })();
  }, [controller, groupEdges, collapsedGroups, showEdgeLabels, showMetricTags]);

  const viewToolbar = (
    <ToolbarGroup>
      <ToolbarItem>
        <Checkbox
          id="group-edges"
          label="Aggregate edges between groups"
          isChecked={groupEdges}
          onChange={(_event, checked) => setGroupEdges(checked)}
        />
      </ToolbarItem>
      <ToolbarItem>
        <Checkbox
          id="collapsed-groups"
          label="Collapse Group 2 & Subgroup 3"
          isChecked={collapsedGroups}
          onChange={(_event, checked) => setCollapsedGroups(checked)}
        />
      </ToolbarItem>
      <ToolbarItem>
        <Checkbox
          id="edge-labels"
          label="Show custom edge labels"
          isChecked={showEdgeLabels}
          onChange={(_event, checked) => setShowEdgeLabels(checked)}
        />
      </ToolbarItem>
      <ToolbarItem>
        <Checkbox
          id="metric-tags"
          label="Show metric tags (summed Bps)"
          isChecked={showMetricTags}
          onChange={(_event, checked) => setShowMetricTags(checked)}
        />
      </ToolbarItem>
    </ToolbarGroup>
  );

  return (
    <TopologyView controlBar={<DemoControlBar />} viewToolbar={viewToolbar}>
      <VisualizationSurface state={{ selectedIds }} />
    </TopologyView>
  );
};

export const AggregateEdges = () => {
  const [controller] = useState(() => {
    const vis = new Visualization();
    vis.registerLayoutFactory(layoutFactory);
    vis.registerComponentFactory((kind, type) => {
      if (kind === ModelKind.graph) {
        return withPanZoom()(GraphComponent);
      }
      if (type === 'group') {
        return withDragNode({ canCancel: false })(withSelection()(DemoDefaultGroup));
      }
      if (type === 'aggregate-edge') {
        return withSelection()(AggregateEdge);
      }
      if (kind === ModelKind.node) {
        return withDragNode({ canCancel: false })(withSelection()(DefaultNode));
      }
      if (kind === ModelKind.edge) {
        return withSelection()(LabeledDefaultEdge);
      }
      return undefined;
    });
    vis.fromModel(
      getModel({ groupEdges: true, collapsedGroups: false, showEdgeLabels: false, showMetricTags: false }),
      false
    );
    return vis;
  });

  return (
    <VisualizationProvider controller={controller}>
      <AggregateEdgesView controller={controller} />
    </VisualizationProvider>
  );
};
