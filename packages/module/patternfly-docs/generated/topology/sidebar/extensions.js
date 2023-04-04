import React from 'react';
import { AutoLinkHeader, Example, Link as PatternflyThemeLink } from '@patternfly/documentation-framework/components';
import {
  ColaLayout,
  DefaultEdge,
  DefaultGroup,
  DefaultNode,
  EdgeStyle,
  GraphComponent,
  ModelKind,
  NodeShape,
  NodeStatus,
  SELECTION_EVENT,
  TopologySideBar,
  TopologyView,
  Visualization,
  VisualizationProvider,
  VisualizationSurface,
  withSelection
} from '@patternfly/react-topology';
import Icon1 from '@patternfly/react-icons/dist/esm/icons/regions-icon';
import Icon2 from '@patternfly/react-icons/dist/esm/icons/folder-open-icon';
import '../../../content/examples/./topology-example.css';
const pageData = {
  "id": "Sidebar",
  "section": "topology",
  "subsection": "",
  "source": "extensions",
  "tabName": null,
  "slug": "/topology/sidebar/extensions",
  "sourceLink": "https://github.com/patternfly/patternfly-react/blob/main/packages/react-topology/src/components/TopologyView/examples/TopologySidebarDemo.tsx",
  "relPath": "packages/module/patternfly-docs/content/examples/TopologySidebar.md",
  "propComponents": [
    {
      "name": "TopologySideBar",
      "description": "",
      "props": [
        {
          "name": "children",
          "type": "React.ReactNode",
          "description": "Contents for the sidebar",
          "defaultValue": "null"
        },
        {
          "name": "className",
          "type": "string",
          "description": "Additional classes added to the sidebar",
          "defaultValue": "''"
        },
        {
          "name": "header",
          "type": "React.ReactNode",
          "description": "Component to place in the header of the sidebar"
        },
        {
          "name": "onClose",
          "type": "() => void",
          "description": "A callback for closing the sidebar, if provided the close button will be displayed in the sidebar",
          "defaultValue": "null"
        },
        {
          "name": "resizable",
          "type": "boolean",
          "description": "Flag if sidebar is being used in a resizable drawer (default false)",
          "defaultValue": "false"
        },
        {
          "name": "show",
          "type": "boolean",
          "description": "Not used for resizeable side bars"
        }
      ]
    },
    {
      "name": "TopologyView",
      "description": "",
      "props": [
        {
          "name": "children",
          "type": "React.ReactNode",
          "description": "Topology inner container (canvas)",
          "defaultValue": "null"
        },
        {
          "name": "className",
          "type": "string",
          "description": "Additional classes added to the view",
          "defaultValue": "''"
        },
        {
          "name": "contextToolbar",
          "type": "React.ReactNode",
          "description": "Context toolbar to be displayed at the top of the view, should contain components for changing context",
          "defaultValue": "null"
        },
        {
          "name": "controlBar",
          "type": "React.ReactNode",
          "description": "Topology control bar (typically a TopologyControlBar), used to manipulate the graph layout",
          "defaultValue": "null"
        },
        {
          "name": "defaultSideBarSize",
          "type": "string",
          "description": "The starting size of the side bar, in either pixels or percentage, only used if resizable.",
          "defaultValue": "'500px'"
        },
        {
          "name": "maxSideBarSize",
          "type": "string",
          "description": "The maximum size of the side bar, in either pixels or percentage.",
          "defaultValue": "'100%'"
        },
        {
          "name": "minSideBarSize",
          "type": "string",
          "description": "The minimum size of the side bar, in either pixels or percentage.",
          "defaultValue": "'150px'"
        },
        {
          "name": "onSideBarResize",
          "type": "(width: number, id: string) => void",
          "description": "Callback for side bar resize end."
        },
        {
          "name": "sideBar",
          "type": "React.ReactNode",
          "description": "Topology side bar (typically a TopologySideBar), used to display information for elements in graph",
          "defaultValue": "null"
        },
        {
          "name": "sideBarOpen",
          "type": "boolean",
          "description": "Flag if side bar is open",
          "defaultValue": "false"
        },
        {
          "name": "sideBarResizable",
          "type": "boolean",
          "description": "Flag if side bar is resizable, default false",
          "defaultValue": "false"
        },
        {
          "name": "viewToolbar",
          "type": "React.ReactNode",
          "description": "View toolbar to be displayed below the context toolbar, should contain components for changing view contents",
          "defaultValue": "null"
        }
      ]
    }
  ],
  "sortValue": 33,
  "examples": [
    "Topology with a side bar"
  ]
};
pageData.liveContext = {
  ColaLayout,
  DefaultEdge,
  DefaultGroup,
  DefaultNode,
  EdgeStyle,
  GraphComponent,
  ModelKind,
  NodeShape,
  NodeStatus,
  SELECTION_EVENT,
  TopologySideBar,
  TopologyView,
  Visualization,
  VisualizationProvider,
  VisualizationSurface,
  withSelection,
  Icon1,
  Icon2
};
pageData.relativeImports = {
  
};
pageData.examples = {
  'Topology with a side bar': props => 
    <Example {...pageData} {...props} {...{"code":"import * as React from 'react';\n\n// eslint-disable-next-line patternfly-react/import-tokens-icons\nimport { RegionsIcon as Icon1 } from '@patternfly/react-icons';\n// eslint-disable-next-line patternfly-react/import-tokens-icons\nimport { FolderOpenIcon as Icon2 } from '@patternfly/react-icons';\n\nimport {\n  ColaLayout,\n  DefaultEdge,\n  DefaultGroup,\n  DefaultNode,\n  EdgeStyle,\n  GraphComponent,\n  ModelKind,\n  NodeModel,\n  NodeShape,\n  SELECTION_EVENT,\n  TopologySideBar,\n  TopologyView,\n  Visualization,\n  VisualizationProvider,\n  VisualizationSurface,\n  withSelection,\n  WithSelectionProps\n} from '@patternfly/react-topology';\nimport { ComponentFactory, Graph, Layout, LayoutFactory, Model, Node, NodeStatus } from '@patternfly/react-topology';\n\ninterface CustomNodeProps {\n  element: Node;\n}\n\nconst BadgeColors = [\n  {\n    name: 'A',\n    badgeColor: '#ace12e',\n    badgeTextColor: '#0f280d',\n    badgeBorderColor: '#486b00'\n  },\n  {\n    name: 'B',\n    badgeColor: '#F2F0FC',\n    badgeTextColor: '#5752d1',\n    badgeBorderColor: '#CBC1FF'\n  }\n];\n\nconst CustomNode: React.FC<CustomNodeProps & WithSelectionProps> = ({ element, onSelect, selected }) => {\n  const data = element.getData();\n  const Icon = data.isAlternate ? Icon2 : Icon1;\n  const badgeColors = BadgeColors.find(badgeColor => badgeColor.name === data.badge);\n\n  return (\n    <DefaultNode\n      element={element}\n      showStatusDecorator\n      badge={data.badge}\n      badgeColor={badgeColors?.badgeColor}\n      badgeTextColor={badgeColors?.badgeTextColor}\n      badgeBorderColor={badgeColors?.badgeBorderColor}\n      onSelect={onSelect}\n      selected={selected}\n    >\n      <g transform={`translate(25, 25)`}>\n        <Icon style={{ color: '#393F44' }} width={25} height={25} />\n      </g>\n    </DefaultNode>\n  );\n};\n\nconst customLayoutFactory: LayoutFactory = (type: string, graph: Graph): Layout | undefined => {\n  switch (type) {\n    case 'Cola':\n      return new ColaLayout(graph);\n    default:\n      return new ColaLayout(graph, { layoutOnDrag: false });\n  }\n};\n\nconst customComponentFactory: ComponentFactory = (kind: ModelKind, type: string) => {\n  switch (type) {\n    case 'group':\n      return DefaultGroup;\n    default:\n      switch (kind) {\n        case ModelKind.graph:\n          return GraphComponent;\n        case ModelKind.node:\n          return withSelection()(CustomNode);\n        case ModelKind.edge:\n          return withSelection()(DefaultEdge);\n        default:\n          return undefined;\n      }\n  }\n};\n\nconst NODE_DIAMETER = 75;\n\nconst NODES: NodeModel[] = [\n  {\n    id: 'node-0',\n    type: 'node',\n    label: 'Node 0',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NodeShape.ellipse,\n    status: NodeStatus.danger,\n    data: {\n      badge: 'B',\n      isAlternate: false\n    }\n  },\n  {\n    id: 'node-1',\n    type: 'node',\n    label: 'Node 1',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NodeShape.hexagon,\n    status: NodeStatus.warning,\n    data: {\n      badge: 'B',\n      isAlternate: false\n    }\n  },\n  {\n    id: 'node-2',\n    type: 'node',\n    label: 'Node 2',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NodeShape.octagon,\n    status: NodeStatus.success,\n    data: {\n      badge: 'A',\n      isAlternate: true\n    }\n  },\n  {\n    id: 'node-3',\n    type: 'node',\n    label: 'Node 3',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NodeShape.rhombus,\n    status: NodeStatus.info,\n    data: {\n      badge: 'A',\n      isAlternate: false\n    }\n  },\n  {\n    id: 'node-4',\n    type: 'node',\n    label: 'Node 4',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NodeShape.hexagon,\n    status: NodeStatus.default,\n    data: {\n      badge: 'C',\n      isAlternate: false\n    }\n  },\n  {\n    id: 'node-5',\n    type: 'node',\n    label: 'Node 5',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NodeShape.rect,\n    data: {\n      badge: 'C',\n      isAlternate: true\n    }\n  },\n  {\n    id: 'Group-1',\n    children: ['node-0', 'node-1', 'node-2'],\n    type: 'group',\n    group: true,\n    label: 'Group-1',\n    style: {\n      padding: 40\n    }\n  }\n];\n\nconst EDGES = [\n  {\n    id: 'edge-node-4-node-5',\n    type: 'edge',\n    source: 'node-4',\n    target: 'node-5',\n    edgeStyle: EdgeStyle.default\n  },\n  {\n    id: 'edge-node-0-node-2',\n    type: 'edge',\n    source: 'node-0',\n    target: 'node-2',\n    edgeStyle: EdgeStyle.default\n  }\n];\n\nexport const TopologySidebarDemo: React.FC = () => {\n  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);\n\n  const controller = React.useMemo(() => {\n    const model: Model = {\n      nodes: NODES,\n      edges: EDGES,\n      graph: {\n        id: 'g1',\n        type: 'graph',\n        layout: 'Cola'\n      }\n    };\n\n    const newController = new Visualization();\n    newController.registerLayoutFactory(customLayoutFactory);\n    newController.registerComponentFactory(customComponentFactory);\n\n    newController.addEventListener(SELECTION_EVENT, setSelectedIds);\n\n    newController.fromModel(model, false);\n\n    return newController;\n  }, []);\n\n  const topologySideBar = (\n    <TopologySideBar\n      className=\"topology-example-sidebar\"\n      show={selectedIds.length > 0}\n      onClose={() => setSelectedIds([])}\n    >\n      <div style={{ marginTop: 27, marginLeft: 20, height: '800px' }}>{selectedIds[0]}</div>\n    </TopologySideBar>\n  );\n\n  return (\n    <TopologyView sideBar={topologySideBar}>\n      <VisualizationProvider controller={controller}>\n        <VisualizationSurface state={{ selectedIds }} />\n      </VisualizationProvider>\n    </TopologyView>\n  );\n};\n","title":"Topology with a side bar","lang":"ts"}}>
      
      <p {...{"className":"ws-p"}}>
        {`To add a sidebar, wrap your `}
        
        <code {...{"className":"ws-code"}}>
          {`VisualizationProvider`}
        </code>
        {` with the `}
        
        <code {...{"className":"ws-code"}}>
          {`TopologyView`}
        </code>
        {` component, which accepts `}
        
        <code {...{"className":"ws-code"}}>
          {`sideBar`}
        </code>
        {` as a prop.`}
      </p>
      
      <p {...{"className":"ws-p"}}>
        {`Pass the `}
        
        <code {...{"className":"ws-code"}}>
          {`TopologySideBar`}
        </code>
        {` component to the `}
        
        <code {...{"className":"ws-code"}}>
          {`sideBar`}
        </code>
        {` prop. `}
        
        <code {...{"className":"ws-code"}}>
          {`TopologySideBar`}
        </code>
        {` should accept the following props:`}
      </p>
      
      <ul {...{"className":"ws-ul"}}>
        

        
        <li {...{"className":"ws-li"}}>
          
          <code {...{"className":"ws-code"}}>
            {`show`}
          </code>
          {`: logic to show the sidebar, e.g. if a node is selected`}
        </li>
        

        
        <li {...{"className":"ws-li"}}>
          
          <code {...{"className":"ws-code"}}>
            {`onClose`}
          </code>
          {`: handle the user closing the window, e.g. unselect the current selection`}
        </li>
        

      </ul>
    </Example>
};

const Component = () => (
  <React.Fragment>
    {React.createElement(pageData.examples["Topology with a side bar"])}
  </React.Fragment>
);
Component.displayName = 'TopologySidebarExtensionsDocs';
Component.pageData = pageData;

export default Component;
