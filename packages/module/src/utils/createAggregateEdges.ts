import { EdgeModel, NodeModel } from '../types';

export type AggregateEdgeRole = 'exit' | 'bridge' | 'entry';

export interface AggregateEdgesOptions {
  /**
   * Remap edge endpoints to their topmost collapsed ancestor and merge
   * parallel remapped edges into aggregate edges.
   * Defaults to `true`.
   */
  collapsedGroups?: boolean;
  /**
   * Split cross-group edges into an exit stub (node → parent group), a bridge
   * between parent groups (merged across leaf edges), and an entry stub
   * (parent group → node). Defaults to `false`.
   */
  groupEdges?: boolean;
}

interface PathSegment {
  source: string;
  target: string;
  role: AggregateEdgeRole;
  /** When true, merge undirected (A→B same as B→A). Exit/entry stay directed. */
  undirected: boolean;
  /**
   * Stable key for the bridge this segment belongs to (sorted endpoint pair).
   * Exit/entry stubs are scoped to a bridge so paths to different peers stay separate.
   */
  bridgeKey: string;
}

const getNodeParent = (nodeId: string, nodes: NodeModel[]): NodeModel | undefined =>
  nodes.find((n) => n.children?.includes(nodeId));

const getAncestorChain = (nodeId: string, nodes: NodeModel[]): string[] => {
  const chain: string[] = [];
  let current: string | undefined = nodeId;
  while (current) {
    chain.push(current);
    current = getNodeParent(current, nodes)?.id;
  }
  return chain;
};

const isAncestorOf = (ancestorId: string, nodeId: string, nodes: NodeModel[]): boolean =>
  getAncestorChain(nodeId, nodes).includes(ancestorId);

const makeBridgeKey = (a: string, b: string): string => [a, b].sort((x, y) => x.localeCompare(y)).join('__');

/**
 * Walk up to the topmost collapsed ancestor (or the node itself if none).
 * Mirrors runtime `getTopCollapsedParent` against the declarative model.
 */
const getCollapsedDisplayedNode = (nodeId: string, nodes: NodeModel[]): string => {
  let displayedNodeId = nodeId;
  let parent = getNodeParent(nodeId, nodes);
  while (parent) {
    if (parent.collapsed) {
      displayedNodeId = parent.id;
    }
    parent = getNodeParent(parent.id, nodes);
  }
  return displayedNodeId;
};

/**
 * Decompose a cross-group leaf edge into exit / bridge / entry segments.
 *
 * Example (2-1 in Group2 → 3-1 in Subgroup3):
 *   exit:   2-1 → Group2
 *   bridge: Group2 → Subgroup3
 *   entry:  Subgroup3 → 3-1
 *
 * When an endpoint is already a group, that group is the bridge terminus
 * (no exit/entry stub beyond it).
 */
const getGroupPathSegments = (sourceId: string, targetId: string, nodes: NodeModel[]): PathSegment[] | null => {
  if (sourceId === targetId) {
    return null;
  }

  if (isAncestorOf(sourceId, targetId, nodes) || isAncestorOf(targetId, sourceId, nodes)) {
    return null; // node ↔ ancestor: hide, no segments
  }

  const sourceModel = nodes.find((n) => n.id === sourceId);
  const targetModel = nodes.find((n) => n.id === targetId);
  const sourceIsGroup = !!sourceModel?.group;
  const targetIsGroup = !!targetModel?.group;

  const sourceParent = getNodeParent(sourceId, nodes)?.id;
  const targetParent = getNodeParent(targetId, nodes)?.id;

  // Same immediate parent (siblings) or both graph-level non-nested ends — keep the original edge.
  if (sourceParent === targetParent) {
    return [];
  }

  // Groups are terminals: do not step past them into a parent stub.
  const bridgeSource = sourceIsGroup ? sourceId : sourceParent || sourceId;
  const bridgeTarget = targetIsGroup ? targetId : targetParent || targetId;
  const bridgeKey = makeBridgeKey(bridgeSource, bridgeTarget);
  const segments: PathSegment[] = [];

  if (!sourceIsGroup && sourceParent && sourceParent !== targetId) {
    segments.push({ source: sourceId, target: sourceParent, role: 'exit', undirected: false, bridgeKey });
  }

  if (bridgeSource !== bridgeTarget) {
    segments.push({ source: bridgeSource, target: bridgeTarget, role: 'bridge', undirected: true, bridgeKey });
  }

  if (!targetIsGroup && targetParent && targetParent !== sourceId) {
    segments.push({ source: targetParent, target: targetId, role: 'entry', undirected: false, bridgeKey });
  }

  return segments;
};

const segmentId = (segment: PathSegment, legacyBridgeId = false): string => {
  if (segment.role === 'bridge') {
    if (legacyBridgeId) {
      return `aggregate_${segment.source}_${segment.target}`;
    }
    return `aggregate_bridge_${segment.bridgeKey}`;
  }
  // Scope stubs to their bridge so paths to different peers do not share selection/geometry.
  return `aggregate_${segment.role}_${segment.source}_${segment.target}_${segment.bridgeKey}`;
};

const undirectedMatch = (a: EdgeModel, source: string, target: string): boolean =>
  (a.source === source || a.source === target) && (a.target === target || a.target === source);

const directedMatch = (a: EdgeModel, source: string, target: string): boolean =>
  a.source === source && a.target === target;

const findExistingSegment = (
  edges: EdgeModel[],
  aggregateEdgeType: string,
  segment: PathSegment
): EdgeModel | undefined =>
  edges.find((e) => {
    if (e.type !== aggregateEdgeType || e.data?.role !== segment.role || e.data?.bridgeKey !== segment.bridgeKey) {
      return false;
    }
    return segment.undirected
      ? undirectedMatch(e, segment.source, segment.target)
      : directedMatch(e, segment.source, segment.target);
  });

/** Prefer the bridge for labels so multi-part paths show the label once along the path. */
const isLabelBearer = (segments: PathSegment[], segment: PathSegment): boolean => {
  const bearer = segments.find((s) => s.role === 'bridge') || segments[0];
  return (
    !!bearer && bearer.role === segment.role && bearer.source === segment.source && bearer.target === segment.target
  );
};

const applyLeafLabel = (aggregate: EdgeModel, leafLabel: string | undefined, carryLabel: boolean): void => {
  if (!carryLabel || !leafLabel) {
    return;
  }
  const labels: string[] = aggregate.data?.labels ? [...aggregate.data.labels] : [];
  if (!labels.includes(leafLabel)) {
    labels.push(leafLabel);
  }
  aggregate.data = { ...aggregate.data, labels };
  aggregate.label = labels.join(', ');
};

const createSegmentEdge = (
  aggregateEdgeType: string,
  segment: PathSegment,
  leafEdgeId: string,
  leafSource: string,
  legacyBridgeId = false,
  leafLabel?: string,
  carryLabel = false
): EdgeModel => {
  const model: EdgeModel = {
    id: segmentId(segment, legacyBridgeId),
    type: aggregateEdgeType,
    source: segment.source,
    target: segment.target,
    data: {
      role: segment.role,
      bridgeKey: segment.bridgeKey,
      bidirectional: false,
      count: 1,
      aggregatedEdgeIds: [leafEdgeId]
    }
  };
  applyLeafLabel(model, leafLabel, carryLabel);
  return model;
};

const mergeSegment = (
  existing: EdgeModel,
  leafEdgeId: string,
  leafSource: string,
  segment: PathSegment,
  allEdges: EdgeModel[],
  leafLabel?: string,
  carryLabel = false
): void => {
  const ids: string[] = existing.data?.aggregatedEdgeIds ? [...existing.data.aggregatedEdgeIds] : [];
  if (!ids.includes(leafEdgeId)) {
    ids.push(leafEdgeId);
  }
  existing.data = {
    ...existing.data,
    role: segment.role,
    bridgeKey: segment.bridgeKey,
    count: ids.length,
    aggregatedEdgeIds: ids,
    bidirectional:
      segment.role === 'bridge'
        ? existing.data?.bidirectional || existing.source !== leafSource
        : existing.data?.bidirectional || false
  };
  applyLeafLabel(existing, leafLabel, carryLabel);

  ids.forEach((id) => {
    const leaf = allEdges.find((e) => e.id === id);
    if (leaf) {
      leaf.visible = false;
    }
  });
};

/**
 * Collapse-only aggregation (historical behavior): remap endpoints to collapsed
 * ancestors and create a single aggregate when 2+ parallel remapped edges exist.
 */
const aggregateByCollapsedGroups = (aggregateEdgeType: string, edges: EdgeModel[], nodes: NodeModel[]): EdgeModel[] => {
  const pendingAggregates: EdgeModel[] = [];

  return edges.reduce((newEdges: EdgeModel[], edge: EdgeModel) => {
    edge.visible = 'visible' in edge ? edge.visible : true;

    const source = getCollapsedDisplayedNode(edge.source || '', nodes);
    const target = getCollapsedDisplayedNode(edge.target || '', nodes);
    const remapped = source !== edge.source || target !== edge.target;

    if (!remapped) {
      newEdges.push(edge);
      return newEdges;
    }

    if (source === target) {
      edge.visible = false;
      newEdges.push(edge);
      return newEdges;
    }

    const existing =
      pendingAggregates.find((e) => undirectedMatch(e, source, target)) ||
      newEdges.find((e) => e.type === aggregateEdgeType && undirectedMatch(e, source, target));

    if (existing) {
      mergeSegment(
        existing,
        edge.id,
        edge.source || '',
        { source, target, role: 'bridge', undirected: true, bridgeKey: makeBridgeKey(source, target) },
        newEdges,
        edge.label,
        true
      );
      // Keep children for backward compatibility with prior collapse aggregation.
      existing.children = existing.data.aggregatedEdgeIds;
      edge.visible = false;
      if (!newEdges.includes(existing)) {
        newEdges.push(existing);
      }
    } else {
      const aggregate = createSegmentEdge(
        aggregateEdgeType,
        { source, target, role: 'bridge', undirected: true, bridgeKey: makeBridgeKey(source, target) },
        edge.id,
        edge.source || '',
        true,
        edge.label,
        true
      );
      aggregate.children = [edge.id];
      pendingAggregates.push(aggregate);
    }

    newEdges.push(edge);
    return newEdges;
  }, [] as EdgeModel[]);
};

/**
 * Group-edge aggregation: split each cross-group leaf into exit / bridge / entry
 * segments and merge bridges (and stubs for the same bridge) across leaf edges.
 */
const aggregateByGroupEdges = (
  aggregateEdgeType: string,
  edges: EdgeModel[],
  nodes: NodeModel[],
  collapsedGroups: boolean
): EdgeModel[] => {
  const result: EdgeModel[] = [];

  edges.forEach((edge) => {
    edge.visible = 'visible' in edge ? edge.visible : true;

    let source = edge.source || '';
    let target = edge.target || '';

    if (collapsedGroups) {
      source = getCollapsedDisplayedNode(source, nodes);
      target = getCollapsedDisplayedNode(target, nodes);
    }

    if (source === target) {
      edge.visible = false;
      result.push(edge);
      return;
    }

    const segments = getGroupPathSegments(source, target, nodes);

    if (segments === null) {
      // Ancestor relationship — hide.
      edge.visible = false;
      result.push(edge);
      return;
    }

    if (segments.length === 0) {
      // Same group siblings / both ungrouped — keep leaf (unless collapse remapped).
      if (source !== edge.source || target !== edge.target) {
        // Collapsed remap with no further group split: treat like collapse-only single edge.
        edge.visible = true;
      }
      result.push(edge);
      return;
    }

    edge.visible = false;
    result.push(edge);

    segments.forEach((segment) => {
      const carryLabel = isLabelBearer(segments, segment);
      const existing = findExistingSegment(result, aggregateEdgeType, segment);
      if (existing) {
        mergeSegment(existing, edge.id, edge.source || '', segment, result, edge.label, carryLabel);
      } else {
        result.push(
          createSegmentEdge(aggregateEdgeType, segment, edge.id, edge.source || '', false, edge.label, carryLabel)
        );
      }
    });
  });

  return result;
};

/**
 * Create aggregate edges that replace sets of leaf edges with visible summary edges.
 *
 * @param aggregateEdgeType Type string for created aggregate edges (for component factories).
 * @param edges Leaf edges to process.
 * @param nodes Full node model (including groups) used to resolve parents and collapse.
 * @param options Aggregation modes. Defaults: `{ collapsedGroups: true, groupEdges: false }`.
 */
const createAggregateEdges = (
  aggregateEdgeType: string,
  edges: EdgeModel[] | undefined,
  nodes: NodeModel[] | undefined,
  options: AggregateEdgesOptions = {}
): EdgeModel[] => {
  if (!edges?.length) {
    return [];
  }
  if (!nodes?.length) {
    return edges;
  }

  const collapsedGroups = options.collapsedGroups ?? true;
  const groupEdges = options.groupEdges ?? false;

  if (groupEdges) {
    return aggregateByGroupEdges(aggregateEdgeType, edges, nodes, collapsedGroups);
  }

  if (collapsedGroups) {
    return aggregateByCollapsedGroups(aggregateEdgeType, edges, nodes);
  }

  return edges;
};

export { createAggregateEdges };
