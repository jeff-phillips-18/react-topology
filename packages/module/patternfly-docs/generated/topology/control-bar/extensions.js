import React from 'react';
import { AutoLinkHeader, Example, Link as PatternflyThemeLink } from '@patternfly/documentation-framework/components';
import {
  action,
  ColaLayout,
  createTopologyControlButtons,
  defaultControlButtonsOptions,
  DefaultEdge,
  DefaultGroup,
  DefaultNode,
  EdgeStyle,
  GraphComponent,
  ModelKind,
  NodeShape,
  SELECTION_EVENT,
  TopologyControlBar,
  TopologyView,
  Visualization,
  VisualizationProvider,
  VisualizationSurface,
  withPanZoom,
  withSelection
  } from '@patternfly/react-topology';
import Icon1 from '@patternfly/react-icons/dist/esm/icons/regions-icon';
import Icon2 from '@patternfly/react-icons/dist/esm/icons/folder-open-icon';
import '../../../content/examples/./topology-example.css';
const pageData = {
  "id": "Control Bar",
  "section": "topology",
  "subsection": "",
  "source": "extensions",
  "tabName": null,
  "slug": "/topology/control-bar/extensions",
  "sourceLink": "https://github.com/patternfly/patternfly-react/blob/main/packages/react-topology/src/components/TopologyView/examples/TopologyControlBarDemo.tsx",
  "relPath": "packages/module/patternfly-docs/content/examples/TopologyControlBar.md",
  "propComponents": [
    {
      "name": "TopologyControlBar",
      "description": "",
      "props": [
        {
          "name": "children",
          "type": "React.ReactNode",
          "description": "Any extra child nodes (placed after the buttons)",
          "defaultValue": "null"
        },
        {
          "name": "className",
          "type": "string",
          "description": "Additional classes added to the control bar",
          "defaultValue": "null"
        },
        {
          "name": "controlButtons",
          "type": "TopologyControlButton[]",
          "description": "Buttons to be added to the bar",
          "defaultValue": "[]"
        },
        {
          "name": "onButtonClick",
          "type": "(id: any) => void",
          "description": "Callback when any button is clicked, id of the clicked button is passed",
          "defaultValue": "() => undefined"
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
  "sortValue": 31,
  "examples": [
    "Topology with a control bar"
  ]
};
pageData.liveContext = {
  action,
  ColaLayout,
  createTopologyControlButtons,
  defaultControlButtonsOptions,
  DefaultEdge,
  DefaultGroup,
  DefaultNode,
  EdgeStyle,
  GraphComponent,
  ModelKind,
  NodeShape,
  SELECTION_EVENT,
  TopologyControlBar,
  TopologyView,
  Visualization,
  VisualizationProvider,
  VisualizationSurface,
  withPanZoom,
  withSelection,
  Icon1,
  Icon2
};
pageData.relativeImports = {
  
};
pageData.examples = {
  'Topology with a control bar': props => 
    <Example {...pageData} {...props} {...{"code":"import * as React from 'react';\n// eslint-disable-next-line patternfly-react/import-tokens-icons\nimport { RegionsIcon as Icon1 } from '@patternfly/react-icons';\n\nimport {\n  action,\n  ColaLayout,\n  createTopologyControlButtons,\n  defaultControlButtonsOptions,\n  DefaultEdge,\n  DefaultGroup,\n  DefaultNode,\n  EdgeStyle,\n  GraphComponent,\n  ModelKind,\n  NodeModel,\n  NodeShape,\n  SELECTION_EVENT,\n  TopologyControlBar,\n  TopologyView,\n  Visualization,\n  VisualizationProvider,\n  VisualizationSurface,\n  withPanZoom,\n  withSelection,\n  WithSelectionProps\n} from '@patternfly/react-topology';\nimport { ComponentFactory, Graph, Layout, LayoutFactory, Model, Node } from '@patternfly/react-topology';\n\ninterface CustomNodeProps {\n  element: Node;\n}\n\nconst CustomNode: React.FC<CustomNodeProps & WithSelectionProps> = ({ element, onSelect, selected }) => {\n  const Icon = Icon1;\n\n  return (\n    <DefaultNode element={element} onSelect={onSelect} selected={selected}>\n      <g transform={`translate(25, 25)`}>\n        <Icon style={{ color: '#393F44' }} width={25} height={25} />\n      </g>\n    </DefaultNode>\n  );\n};\n\nconst customLayoutFactory: LayoutFactory = (type: string, graph: Graph): Layout | undefined => {\n  switch (type) {\n    case 'Cola':\n      return new ColaLayout(graph);\n    default:\n      return new ColaLayout(graph, { layoutOnDrag: false });\n  }\n};\n\nconst customComponentFactory: ComponentFactory = (kind: ModelKind, type: string) => {\n  switch (type) {\n    case 'group':\n      return DefaultGroup;\n    default:\n      switch (kind) {\n        case ModelKind.graph:\n          return withPanZoom()(GraphComponent);\n        case ModelKind.node:\n          return withSelection()(CustomNode);\n        case ModelKind.edge:\n          return withSelection()(DefaultEdge);\n        default:\n          return undefined;\n      }\n  }\n};\n\nconst NODE_DIAMETER = 75;\n\nconst NODES: NodeModel[] = [\n  {\n    id: 'node-0',\n    type: 'node',\n    label: 'Node 0',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER\n  },\n  {\n    id: 'node-1',\n    type: 'node',\n    label: 'Node 1',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER\n  },\n  {\n    id: 'node-2',\n    type: 'node',\n    label: 'Node 2',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER\n  },\n  {\n    id: 'node-3',\n    type: 'node',\n    label: 'Node 3',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER\n  },\n  {\n    id: 'node-4',\n    type: 'node',\n    label: 'Node 4',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER\n  },\n  {\n    id: 'node-5',\n    type: 'node',\n    label: 'Node 5',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NodeShape.rect\n  },\n  {\n    id: 'Group-1',\n    children: ['node-0', 'node-1', 'node-2'],\n    type: 'group',\n    group: true,\n    label: 'Group-1',\n    style: {\n      padding: 40\n    }\n  }\n];\n\nconst EDGES = [\n  {\n    id: 'edge-node-4-node-5',\n    type: 'edge',\n    source: 'node-4',\n    target: 'node-5',\n    edgeStyle: EdgeStyle.default\n  },\n  {\n    id: 'edge-node-0-node-2',\n    type: 'edge',\n    source: 'node-0',\n    target: 'node-2',\n    edgeStyle: EdgeStyle.default\n  }\n];\n\nexport const TopologyControlBarDemo: React.FC = () => {\n  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);\n\n  const controller = React.useMemo(() => {\n    const model: Model = {\n      nodes: NODES,\n      edges: EDGES,\n      graph: {\n        id: 'g1',\n        type: 'graph',\n        layout: 'Cola'\n      }\n    };\n\n    const newController = new Visualization();\n    newController.registerLayoutFactory(customLayoutFactory);\n    newController.registerComponentFactory(customComponentFactory);\n\n    newController.addEventListener(SELECTION_EVENT, setSelectedIds);\n\n    newController.fromModel(model, false);\n\n    return newController;\n  }, []);\n\n  return (\n    <TopologyView\n      controlBar={\n        <TopologyControlBar\n          controlButtons={createTopologyControlButtons({\n            ...defaultControlButtonsOptions,\n            zoomInCallback: action(() => {\n              controller.getGraph().scaleBy(4 / 3);\n            }),\n            zoomOutCallback: action(() => {\n              controller.getGraph().scaleBy(0.75);\n            }),\n            fitToScreenCallback: action(() => {\n              controller.getGraph().fit(80);\n            }),\n            resetViewCallback: action(() => {\n              controller.getGraph().reset();\n              controller.getGraph().layout();\n            }),\n            legend: false\n          })}\n        />\n      }\n    >\n      <VisualizationProvider controller={controller}>\n        <VisualizationSurface state={{ selectedIds }} />\n      </VisualizationProvider>\n    </TopologyView>\n  );\n};\n","title":"Topology with a control bar","lang":"ts"}}>
      
      <p {...{"className":"ws-p"}}>
        {`To add a control bar to the topology view, wrap your `}
        
        <code {...{"className":"ws-code"}}>
          {`VisualizationProvider`}
        </code>
        {` with the `}
        
        <code {...{"className":"ws-code"}}>
          {`TopologyView`}
        </code>
        {` component, which accepts `}
        
        <code {...{"className":"ws-code"}}>
          {`controlBar`}
        </code>
        {` as a prop.`}
      </p>
      
      <p {...{"className":"ws-p"}}>
        {`Pass the `}
        
        <code {...{"className":"ws-code"}}>
          {`TopologyControlBar`}
        </code>
        {` component to the `}
        
        <code {...{"className":"ws-code"}}>
          {`controlBar`}
        </code>
        {` prop, and pass the `}
        
        <code {...{"className":"ws-code"}}>
          {`controlButtons`}
        </code>
        {` prop into `}
        
        <code {...{"className":"ws-code"}}>
          {`TopologyControlBar`}
        </code>
        {`. Then call the function `}
        
        <code {...{"className":"ws-code"}}>
          {`createTopologyControlButtons`}
        </code>
        {`, which will create the common control buttons via several parameters listed below:`}
      </p>
      
      <ol {...{"className":"ws-ol"}}>
        

        
        <li {...{"className":"ws-li"}}>
          

          
          <p {...{"className":"ws-p"}}>
            {`To render the default control buttons, pass in `}
            
            <code {...{"className":"ws-code"}}>
              {`defaultControlButtonsOptions`}
            </code>
            {`. These default options include:`}
          </p>
          

          
          <ul {...{"className":"ws-ul"}}>
            

            
            <li {...{"className":"ws-li"}}>
              {`Zoom In`}
            </li>
            

            
            <li {...{"className":"ws-li"}}>
              {`Zoom Out`}
            </li>
            

            
            <li {...{"className":"ws-li"}}>
              {`Fit to Screen`}
            </li>
            

            
            <li {...{"className":"ws-li"}}>
              {`Reset View`}
            </li>
            

            
            <li {...{"className":"ws-li"}}>
              {`Legend`}
            </li>
            

          </ul>
          

          
          <p {...{"className":"ws-p"}}>
            {`You can override these defaults by passing in any of the `}
            
            <code {...{"className":"ws-code"}}>
              {`defaultControlButtonsOptions`}
            </code>
            {` as a parameter, with your updated boolean value of the default option.`}
          </p>
          

        </li>
        

        
        <li {...{"className":"ws-li"}}>
          

          
          <p {...{"className":"ws-p"}}>
            {`For each button, pass in each action callback method as parameter.`}
          </p>
          

        </li>
        

      </ol>
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
    {React.createElement(pageData.examples["Topology with a control bar"])}
  </React.Fragment>
);
Component.displayName = 'TopologyControlBarExtensionsDocs';
Component.pageData = pageData;

export default Component;
