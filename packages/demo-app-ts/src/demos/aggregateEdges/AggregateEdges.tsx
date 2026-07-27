import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { action } from 'mobx';
import { ToolbarGroup, ToolbarItem, Checkbox } from '@patternfly/react-core';
import {
  ColaLayout,
  DefaultNode,
  Graph,
  GraphComponent,
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

const AggregateEdgesView: React.FunctionComponent<{ controller: Visualization }> = ({ controller }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [groupEdges, setGroupEdges] = useState(true);
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(() => new Set());
  const [showEdgeLabels, setShowEdgeLabels] = useState(false);
  const [showMetricTags, setShowMetricTags] = useState(false);
  const fittedRef = useRef(false);

  useEventListener<SelectionEventListener>(SELECTION_EVENT, (ids) => {
    setSelectedIds(ids);
  });

  useEffect(() => {
    action(() => {
      const isFirstLoad = !fittedRef.current;
      // Merge after first load so collapse/option toggles keep node positions.
      controller.fromModel(
        getModel({
          groupEdges,
          collapsedIds,
          showEdgeLabels,
          showMetricTags
        }),
        !isFirstLoad
      );
      if (isFirstLoad) {
        controller.getGraph().layout();
        controller.getGraph().fit(80);
        fittedRef.current = true;
      }
      // Collapse / label toggles: skip Cola re-run — AggregateEdge snaps to outlines.
    })();
  }, [controller, collapsedIds, groupEdges, showEdgeLabels, showMetricTags]);

  const onCollapseChange = useCallback((group: Node, collapsed: boolean) => {
    setCollapsedIds((prev) => {
      const next = new Set(prev);
      if (collapsed) {
        next.add(group.getId());
      } else {
        next.delete(group.getId());
      }
      return next;
    });
  }, []);

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
