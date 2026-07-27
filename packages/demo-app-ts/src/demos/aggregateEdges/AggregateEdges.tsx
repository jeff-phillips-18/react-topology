import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { action } from 'mobx';
import { ToolbarGroup, ToolbarItem, Checkbox } from '@patternfly/react-core';
import {
  ColaLayout,
  DefaultNode,
  Graph,
  GraphComponent,
  GraphElement,
  isEdge,
  isNode,
  Layout,
  LayoutFactory,
  ModelKind,
  Node,
  SELECTION_EVENT,
  SelectionEventListener,
  TopologyView,
  Visualization,
  VisualizationProvider,
  VisualizationSurface,
  withDragNode,
  withPanZoom,
  withSelection,
  useEventListener
} from '@patternfly/react-topology';
import DemoControlBar from '../DemoControlBar';
import AggregateEdge from './AggregateEdge';
import AggregateGroup from './AggregateGroup';
import { AggregateEdgesDemoProvider } from './DemoContext';
import LabeledDefaultEdge from './LabeledDefaultEdge';
import { getModel } from './model';

const layoutFactory: LayoutFactory = (_type: string, graph: Graph): Layout | undefined =>
  new ColaLayout(graph, {
    layoutOnDrag: false,
    nodeDistance: 80,
    // Demo-sized graph: fewer ticks keeps aggregate edge snapping responsive.
    maxTicks: 200,
    initialUnconstrainedIterations: 50,
    initialUserConstraintIterations: 25,
    initialAllConstraintsIterations: 50
  });

/** Read collapse from live nodes — NodeModel.collapsed is the source of truth. */
const collectCollapsedIds = (controller: Visualization): Set<string> => {
  const ids = new Set<string>();
  controller.getElements().forEach((element: GraphElement) => {
    if (isNode(element) && element.isGroup() && element.isCollapsed()) {
      ids.add(element.getId());
    }
  });
  return ids;
};

/**
 * Reused bridge/stub elements keep setStartPoint/setEndPoint overrides across collapse.
 * Clear them so anchors recompute against the new collapsed bounds.
 */
const clearAggregateEdgeEndpoints = (controller: Visualization) => {
  controller.getElements().forEach((element) => {
    if (!isEdge(element) || element.getType() !== 'aggregate-edge') {
      return;
    }
    element.setStartPoint();
    element.setEndPoint();
  });
};

interface DemoDisplayOptions {
  groupEdges: boolean;
  showEdgeLabels: boolean;
  showMetricTags: boolean;
}

const applyDemoModel = (
  controller: Visualization,
  options: DemoDisplayOptions,
  opts: { layout?: boolean; merge?: boolean } = {}
) => {
  const { layout = false, merge = true } = opts;
  action(() => {
    const model = getModel({
      ...options,
      collapsedIds: collectCollapsedIds(controller)
    });
    controller.fromModel(model, merge);
    clearAggregateEdgeEndpoints(controller);
    if (layout) {
      controller.getGraph().layout();
      controller.getGraph().fit(80);
    }
  })();
};

const AggregateEdgesView: React.FunctionComponent<{ controller: Visualization }> = ({ controller }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [groupEdges, setGroupEdges] = useState(true);
  const [showEdgeLabels, setShowEdgeLabels] = useState(false);
  const [showMetricTags, setShowMetricTags] = useState(false);
  const fittedRef = useRef(false);
  const optionsRef = useRef<DemoDisplayOptions>({ groupEdges, showEdgeLabels, showMetricTags });
  optionsRef.current = { groupEdges, showEdgeLabels, showMetricTags };

  useEventListener<SelectionEventListener>(SELECTION_EVENT, (ids) => {
    setSelectedIds(ids);
  });

  useEffect(() => {
    const isFirstLoad = !fittedRef.current;
    applyDemoModel(
      controller,
      { groupEdges, showEdgeLabels, showMetricTags },
      {
        merge: !isFirstLoad,
        layout: isFirstLoad
      }
    );
    if (isFirstLoad) {
      fittedRef.current = true;
    }
  }, [controller, groupEdges, showEdgeLabels, showMetricTags]);

  const onCollapseChange = useCallback(
    (_group: Node, _collapsed: boolean) => {
      // Collapse is already applied on the Node by DefaultGroup; rebuild aggregates only.
      applyDemoModel(controller, optionsRef.current, { merge: true, layout: false });
    },
    [controller]
  );

  const demoContext = useMemo(() => ({ onCollapseChange }), [onCollapseChange]);

  const viewToolbar = (
    <ToolbarGroup>
      <ToolbarItem>
        <Checkbox
          id="group-edges"
          label="Aggregate edges between groups"
          isChecked={groupEdges}
          onChange={(_event, checked) => {
            // Full graph shape change — re-layout + fit.
            fittedRef.current = false;
            setGroupEdges(checked);
          }}
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
    <AggregateEdgesDemoProvider value={demoContext}>
      <TopologyView controlBar={<DemoControlBar />} viewToolbar={viewToolbar}>
        <VisualizationSurface state={{ selectedIds }} />
      </TopologyView>
    </AggregateEdgesDemoProvider>
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
        return withDragNode({ canCancel: false })(withSelection()(AggregateGroup));
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
      getModel({
        groupEdges: true,
        collapsedIds: new Set(),
        showEdgeLabels: false,
        showMetricTags: false
      }),
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
