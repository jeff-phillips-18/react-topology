import React from 'react';
import { AutoLinkHeader, Example, Link as PatternflyThemeLink } from '@patternfly/documentation-framework/components';
import {
  action,
  createTopologyControlButtons,
  defaultControlButtonsOptions,
  BreadthFirstLayout,
  ColaLayout,
  ColaGroupsLayout,
  ConcentricLayout,
  DagreLayout,
  DefaultEdge,
  DefaultGroup,
  DefaultNode,
  ForceLayout,
  GridLayout,
  GraphComponent,
  ModelKind,
  NodeShape,
  NodeStatus,
  observer,
  GRAPH_LAYOUT_END_EVENT,
  TopologyControlBar,
  TopologyView,
  Visualization,
  VisualizationProvider,
  VisualizationSurface,
  withDragNode,
  withPanZoom
} from '@patternfly/react-topology';
import { Select, SelectOption, SelectVariant, ToolbarItem } from '@patternfly/react-core';
import Icon1 from '@patternfly/react-icons/dist/esm/icons/regions-icon';
import Icon2 from '@patternfly/react-icons/dist/esm/icons/folder-open-icon';
import '../../../content/examples/./topology-example.css';
const pageData = {
  "id": "Layouts",
  "section": "topology",
  "subsection": "",
  "source": "extensions",
  "tabName": null,
  "slug": "/topology/layouts/extensions",
  "sourceLink": "https://github.com/patternfly/patternfly-org/blob/main/packages/module/patternfly-docs/content/examples/TopologyLayouts.md",
  "relPath": "packages/module/patternfly-docs/content/examples/TopologyLayouts.md",
  "examples": [
    "Examples"
  ]
};
pageData.liveContext = {
  action,
  createTopologyControlButtons,
  defaultControlButtonsOptions,
  BreadthFirstLayout,
  ColaLayout,
  ColaGroupsLayout,
  ConcentricLayout,
  DagreLayout,
  DefaultEdge,
  DefaultGroup,
  DefaultNode,
  ForceLayout,
  GridLayout,
  GraphComponent,
  ModelKind,
  NodeShape,
  NodeStatus,
  observer,
  GRAPH_LAYOUT_END_EVENT,
  TopologyControlBar,
  TopologyView,
  Visualization,
  VisualizationProvider,
  VisualizationSurface,
  withDragNode,
  withPanZoom,
  Select,
  SelectOption,
  SelectVariant,
  ToolbarItem,
  Icon1,
  Icon2
};
pageData.relativeImports = {
  
};
pageData.examples = {
  'Examples': props => 
    <Example {...pageData} {...props} {...{"code":"import * as React from 'react';\nimport {\n  Dropdown,\n  DropdownItem,\n  DropdownPosition,\n  DropdownToggle,\n  Split,\n  SplitItem,\n  ToolbarItem\n} from '@patternfly/react-core';\n// eslint-disable-next-line patternfly-react/import-tokens-icons\nimport { RegionsIcon as Icon1, FolderOpenIcon as Icon2 } from '@patternfly/react-icons';\nimport {\n  action,\n  createTopologyControlButtons,\n  defaultControlButtonsOptions,\n  DefaultEdge,\n  DefaultGroup,\n  DefaultNode,\n  GraphComponent,\n  GRAPH_LAYOUT_END_EVENT,\n  ModelKind,\n  NodeModel,\n  NodeShape,\n  observer,\n  TopologyView,\n  TopologyControlBar,\n  Visualization,\n  VisualizationProvider,\n  VisualizationSurface,\n  ComponentFactory,\n  Model,\n  Node,\n  NodeStatus,\n  Graph,\n  Layout,\n  LayoutFactory,\n  ForceLayout,\n  ColaLayout,\n  ConcentricLayout,\n  DagreLayout,\n  GridLayout,\n  BreadthFirstLayout,\n  ColaGroupsLayout,\n  withDragNode,\n  WithDragNodeProps,\n  withPanZoom\n} from '@patternfly/react-topology';\n\nconst NODE_DIAMETER = 75;\nconst NODE_SHAPE = NodeShape.ellipse;\n\nconst NODES: NodeModel[] = [\n  {\n    id: 'node-0',\n    type: 'node',\n    label: 'Node 0',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NODE_SHAPE,\n    status: NodeStatus.danger,\n    data: {\n      isAlternate: false\n    }\n  },\n  {\n    id: 'node-1',\n    type: 'node',\n    label: 'Node 1',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NODE_SHAPE,\n    status: NodeStatus.success,\n    data: {\n      isAlternate: false\n    }\n  },\n  {\n    id: 'node-2',\n    type: 'node',\n    label: 'Node 2',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NODE_SHAPE,\n    status: NodeStatus.warning,\n    data: {\n      isAlternate: true\n    }\n  },\n  {\n    id: 'node-3',\n    type: 'node',\n    label: 'Node 3',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NODE_SHAPE,\n    status: NodeStatus.info,\n    data: {\n      isAlternate: false\n    }\n  },\n  {\n    id: 'node-4',\n    type: 'node',\n    label: 'Node 4',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NODE_SHAPE,\n    status: NodeStatus.default,\n    data: {\n      isAlternate: true\n    }\n  },\n  {\n    id: 'node-5',\n    type: 'node',\n    label: 'Node 5',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NODE_SHAPE,\n    data: {\n      isAlternate: false\n    }\n  },\n  {\n    id: 'Group-1',\n    children: ['node-0', 'node-1', 'node-2'],\n    type: 'group',\n    group: true,\n    label: 'Group-1',\n    style: {\n      padding: 40\n    }\n  }\n];\n\nconst EDGES = [\n  {\n    id: 'edge-node-4-node-5',\n    type: 'edge',\n    source: 'node-4',\n    target: 'node-5'\n  },\n  {\n    id: 'edge-node-0-node-2',\n    type: 'edge',\n    source: 'node-0',\n    target: 'node-2'\n  }\n];\n\nconst customLayoutFactory: LayoutFactory = (type: string, graph: Graph): Layout | undefined => {\n  switch (type) {\n    case 'BreadthFirst':\n      return new BreadthFirstLayout(graph);\n    case 'Cola':\n      return new ColaLayout(graph);\n    case 'ColaNoForce':\n      return new ColaLayout(graph, { layoutOnDrag: false });\n    case 'Concentric':\n      return new ConcentricLayout(graph);\n    case 'Dagre':\n      return new DagreLayout(graph);\n    case 'Force':\n      return new ForceLayout(graph);\n    case 'Grid':\n      return new GridLayout(graph);\n    case 'ColaGroups':\n      return new ColaGroupsLayout(graph, { layoutOnDrag: false });\n    default:\n      return new ColaLayout(graph, { layoutOnDrag: false });\n  }\n};\n\ntype CustomNodeProps = {\n  element: Node;\n} & WithDragNodeProps;\n\nconst CustomNode: React.FC<CustomNodeProps> = observer(({ element, ...rest }) => {\n  const data = element.getData();\n  const Icon = data.isAlternate ? Icon2 : Icon1;\n\n  return (\n    <DefaultNode element={element} {...rest}>\n      <g transform={`translate(25, 25)`}>\n        <Icon style={{ color: '#393F44' }} width={25} height={25} />\n      </g>\n    </DefaultNode>\n  );\n});\n\nconst customComponentFactory: ComponentFactory = (kind: ModelKind, type: string) => {\n  switch (type) {\n    case 'group':\n      return DefaultGroup;\n    default:\n      switch (kind) {\n        case ModelKind.graph:\n          return withPanZoom()(GraphComponent);\n        case ModelKind.node:\n          return withDragNode()(CustomNode);\n        case ModelKind.edge:\n          return DefaultEdge;\n        default:\n          return undefined;\n      }\n  }\n};\n\nexport const LayoutsDemo: React.FC = () => {\n  const [layoutDropdownOpen, setLayoutDropdownOpen] = React.useState(false);\n  const [layout, setLayout] = React.useState<string>('ColaNoForce');\n\n  const controller = React.useMemo(() => {\n    const model: Model = {\n      nodes: NODES,\n      edges: EDGES,\n      graph: {\n        id: 'g1',\n        type: 'graph',\n        layout: 'ColaNoForce'\n      }\n    };\n\n    const newController = new Visualization();\n    newController.registerLayoutFactory(customLayoutFactory);\n    newController.registerComponentFactory(customComponentFactory);\n\n    newController.addEventListener(GRAPH_LAYOUT_END_EVENT, () => {\n      newController.getGraph().fit(80);\n    });\n\n    newController.fromModel(model, false);\n    return newController;\n  }, []);\n\n  const updateLayout = (newLayout: string) => {\n    setLayout(newLayout);\n    setLayoutDropdownOpen(false);\n  };\n\n  React.useEffect(() => {\n    if (controller && controller.getGraph().getLayout() !== layout) {\n      const model: Model = {\n        nodes: NODES,\n        edges: EDGES,\n        graph: {\n          id: 'g1',\n          type: 'graph',\n          layout\n        }\n      };\n\n      controller.fromModel(model, false);\n    }\n  }, [controller, layout]);\n\n  const layoutDropdown = (\n    <Split>\n      <SplitItem>\n        <label className=\"pf-u-display-inline-block pf-u-mr-md pf-u-mt-sm\">Layout</label>\n      </SplitItem>\n      <SplitItem>\n        <Dropdown\n          position={DropdownPosition.right}\n          toggle={<DropdownToggle onToggle={() => setLayoutDropdownOpen(!layoutDropdownOpen)}>{layout}</DropdownToggle>}\n          isOpen={layoutDropdownOpen}\n          dropdownItems={[\n            <DropdownItem\n              key={1}\n              onClick={() => {\n                updateLayout('Force');\n              }}\n            >\n              Force\n            </DropdownItem>,\n            <DropdownItem\n              key={2}\n              onClick={() => {\n                updateLayout('Dagre');\n              }}\n            >\n              Dagre\n            </DropdownItem>,\n            <DropdownItem\n              key={3}\n              onClick={() => {\n                updateLayout('Cola');\n              }}\n            >\n              Cola\n            </DropdownItem>,\n            <DropdownItem\n              key={8}\n              onClick={() => {\n                updateLayout('ColaGroups');\n              }}\n            >\n              ColaGroups\n            </DropdownItem>,\n            <DropdownItem key={4} onClick={() => updateLayout('ColaNoForce')}>\n              ColaNoForce\n            </DropdownItem>,\n            <DropdownItem key={5} onClick={() => updateLayout('Grid')}>\n              Grid\n            </DropdownItem>,\n            <DropdownItem key={6} onClick={() => updateLayout('Concentric')}>\n              Concentric\n            </DropdownItem>,\n            <DropdownItem key={7} onClick={() => updateLayout('BreadthFirst')}>\n              BreadthFirst\n            </DropdownItem>\n          ]}\n        />\n      </SplitItem>\n    </Split>\n  );\n\n  return (\n    <TopologyView\n      viewToolbar={<ToolbarItem>{layoutDropdown}</ToolbarItem>}\n      controlBar={\n        <TopologyControlBar\n          controlButtons={createTopologyControlButtons({\n            ...defaultControlButtonsOptions,\n            zoomInCallback: action(() => {\n              controller.getGraph().scaleBy(4 / 3);\n            }),\n            zoomOutCallback: action(() => {\n              controller.getGraph().scaleBy(0.75);\n            }),\n            fitToScreenCallback: action(() => {\n              controller.getGraph().fit(80);\n            }),\n            resetViewCallback: action(() => {\n              controller.getGraph().reset();\n              controller.getGraph().layout();\n            }),\n            legend: false\n          })}\n        />\n      }\n    >\n      <VisualizationProvider controller={controller}>\n        <VisualizationSurface />\n      </VisualizationProvider>\n    </TopologyView>\n  );\n};\n","title":"Examples","lang":"ts"}}>
      
    </Example>
};

const Component = () => (
  <React.Fragment>
    <p {...{"className":"ws-p"}}>
      {`Note: Topology lives in its own package at `}
      <PatternflyThemeLink {...{"to":"https://www.npmjs.com/package/@patternfly/react-topology"}}>
        <code {...{"className":"ws-code"}}>
          {`@patternfly/react-topology`}
        </code>
      </PatternflyThemeLink>
    </p>
    <AutoLinkHeader {...{"id":"layouts","size":"h3","className":"ws-title ws-h3"}}>
      {`Layouts`}
    </AutoLinkHeader>
    <p {...{"className":"ws-p"}}>
      {`Layouts will help to position the nodes on the graph in some manner as defined by the chosen layout. There are many algorithms
for positioning nodes based on many factors (side of nodes, distance between nodes, edges, etc). Patternfy react-topology provides
some layouts that you can choose to customize your topology graph with:`}
    </p>
    <AutoLinkHeader {...{"id":"force","size":"h5","className":"ws-title ws-h5"}}>
      {`Force:`}
    </AutoLinkHeader>
    <p {...{"className":"ws-p"}}>
      {`This layout is built on top of the d3-force layout provided by `}
      <PatternflyThemeLink {...{"to":"https://github.com/d3/d3-force"}}>
        {`d3/d3-force`}
      </PatternflyThemeLink>
      {`.`}
    </p>
    <AutoLinkHeader {...{"id":"dagre","size":"h5","className":"ws-title ws-h5"}}>
      {`Dagre:`}
    </AutoLinkHeader>
    <p {...{"className":"ws-p"}}>
      {`This layout is built on top of the dagrejs dagre layout provided by `}
      <PatternflyThemeLink {...{"to":"https://github.com/dagrejs/dagre"}}>
        {`dagrejs/dagre`}
      </PatternflyThemeLink>
      {`.`}
    </p>
    <AutoLinkHeader {...{"id":"cola","size":"h5","className":"ws-title ws-h5"}}>
      {`Cola:`}
    </AutoLinkHeader>
    <p {...{"className":"ws-p"}}>
      {`This layout is built on top of the WebCola layout provided by `}
      <PatternflyThemeLink {...{"to":"://github.com/tgdwyer/WebCola"}}>
        {`tgdwyer/WebCola`}
      </PatternflyThemeLink>
      {`. This layout uses `}
      <code {...{"className":"ws-code"}}>
        {`force simulation`}
      </code>
      {`
by default, but can be turned off by setting the options `}
      <code {...{"className":"ws-code"}}>
        {`layoutOnDrag`}
      </code>
      {` flag to false.`}
    </p>
    <AutoLinkHeader {...{"id":"colagroups","size":"h5","className":"ws-title ws-h5"}}>
      {`ColaGroups:`}
    </AutoLinkHeader>
    <p {...{"className":"ws-p"}}>
      {`This layout uses the Cola layout recursively on each group such that the group's children locations are set before setting the group's location
relative to other groups/nodes at its level.`}
    </p>
    <AutoLinkHeader {...{"id":"grid","size":"h5","className":"ws-title ws-h5"}}>
      {`Grid:`}
    </AutoLinkHeader>
    <p {...{"className":"ws-p"}}>
      {`This is a basic grid layout. It orders the nodes in a grid making the grid as `}
      <code {...{"className":"ws-code"}}>
        {`square`}
      </code>
      {` as possible.
Grid layout works well to distribute nodes without taking into consideration edges`}
    </p>
    <AutoLinkHeader {...{"id":"concentric","size":"h5","className":"ws-title ws-h5"}}>
      {`Concentric:`}
    </AutoLinkHeader>
    <p {...{"className":"ws-p"}}>
      {`Concentric layouts have better results focused on high connectivity. It places the nodes in a circular pattern.`}
    </p>
    <AutoLinkHeader {...{"id":"breadthfirst","size":"h5","className":"ws-title ws-h5"}}>
      {`BreadthFirst:`}
    </AutoLinkHeader>
    <p {...{"className":"ws-p"}}>
      {`This layout uses a breadth first algorithm to place the nodes. A BreadthFirst layout may help in these cases, providing
a natural "levels" approach that can be combined with other algorithms to help users to identify the dependencies between elements.`}
    </p>
    <p {...{"className":"ws-p"}}>
      {`Note: this first version currently doesn't manage the overflow of a row`}
    </p>
    {React.createElement(pageData.examples["Examples"])}
  </React.Fragment>
);
Component.displayName = 'TopologyLayoutsExtensionsDocs';
Component.pageData = pageData;

export default Component;
