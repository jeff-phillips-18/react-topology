import React from 'react';
import { AutoLinkHeader, Example, Link as PatternflyThemeLink } from '@patternfly/documentation-framework/components';
import {
  ColaLayout,
  CREATE_CONNECTOR_DROP_TYPE,
  DefaultEdge,
  DefaultGroup,
  DefaultNode,
  EdgeAnimationSpeed,
  EdgeStyle,
  EdgeTerminalType,
  GraphComponent,
  LabelPosition,
  ModelKind,
  nodeDragSourceSpec,
  nodeDropTargetSpec,
  NodeShape,
  SELECTION_EVENT,
  Visualization,
  VisualizationProvider,
  VisualizationSurface,
  withDndDrop,
  withDragNode,
  withSelection
} from '@patternfly/react-topology';
import Icon1 from '@patternfly/react-icons/dist/esm/icons/regions-icon';
import Icon2 from '@patternfly/react-icons/dist/esm/icons/folder-open-icon';
import '../../../content/examples/./topology-example.css';
const pageData = {
  "id": "Custom Edges",
  "section": "topology",
  "subsection": "",
  "source": "extensions",
  "tabName": null,
  "slug": "/topology/custom-edges/extensions",
  "sourceLink": "https://github.com/patternfly/patternfly-react/blob/main/packages/react-topology/src/components/TopologyView/examples/TopologyCustomEdgesDemo.tsx",
  "relPath": "packages/module/patternfly-docs/content/examples/TopologyCustomEdges.md",
  "propComponents": [
    {
      "name": "DefaultEdge",
      "description": "",
      "props": [
        {
          "name": "endTerminalSize",
          "type": "No type info",
          "defaultValue": "14"
        },
        {
          "name": "endTerminalType",
          "type": "No type info",
          "defaultValue": "EdgeTerminalType.directional"
        },
        {
          "name": "startTerminalSize",
          "type": "No type info",
          "defaultValue": "14"
        },
        {
          "name": "startTerminalType",
          "type": "No type info",
          "defaultValue": "EdgeTerminalType.none"
        }
      ]
    }
  ],
  "sortValue": 12,
  "examples": [
    "Using custom edges"
  ]
};
pageData.liveContext = {
  ColaLayout,
  CREATE_CONNECTOR_DROP_TYPE,
  DefaultEdge,
  DefaultGroup,
  DefaultNode,
  EdgeAnimationSpeed,
  EdgeStyle,
  EdgeTerminalType,
  GraphComponent,
  LabelPosition,
  ModelKind,
  nodeDragSourceSpec,
  nodeDropTargetSpec,
  NodeShape,
  SELECTION_EVENT,
  Visualization,
  VisualizationProvider,
  VisualizationSurface,
  withDndDrop,
  withDragNode,
  withSelection,
  Icon1,
  Icon2
};
pageData.relativeImports = {
  
};
pageData.examples = {
  'Using custom edges': props => 
    <Example {...pageData} {...props} {...{"code":"import * as React from 'react';\n\n// eslint-disable-next-line patternfly-react/import-tokens-icons\nimport { RegionsIcon as Icon1 } from '@patternfly/react-icons';\n\nimport {\n  ColaLayout,\n  ComponentFactory,\n  CREATE_CONNECTOR_DROP_TYPE,\n  DefaultEdge,\n  DefaultGroup,\n  DefaultNode,\n  Edge,\n  EdgeAnimationSpeed,\n  EdgeModel,\n  EdgeStyle,\n  EdgeTerminalType,\n  Graph,\n  GraphComponent,\n  LabelPosition,\n  Layout,\n  LayoutFactory,\n  Model,\n  ModelKind,\n  Node,\n  nodeDragSourceSpec,\n  nodeDropTargetSpec,\n  NodeModel,\n  NodeShape,\n  SELECTION_EVENT,\n  Visualization,\n  VisualizationProvider,\n  VisualizationSurface,\n  withDndDrop,\n  withDragNode,\n  WithDragNodeProps,\n  withSelection,\n  WithSelectionProps\n} from '@patternfly/react-topology';\n\ninterface CustomNodeProps {\n  element: Node;\n}\n\ninterface DataEdgeProps {\n  element: Edge;\n}\n\nconst CONNECTOR_SOURCE_DROP = 'connector-src-drop';\nconst CONNECTOR_TARGET_DROP = 'connector-target-drop';\n\nconst DataEdge: React.FC<DataEdgeProps> = ({ element, ...rest }) => (\n  <DefaultEdge\n    element={element}\n    startTerminalType={EdgeTerminalType.cross}\n    endTerminalType={EdgeTerminalType.directionalAlt}\n    {...rest}\n  />\n);\n\nconst CustomNode: React.FC<CustomNodeProps & WithSelectionProps & WithDragNodeProps> = ({\n  element,\n  selected,\n  onSelect,\n  ...rest\n}) => {\n  const Icon = Icon1;\n\n  return (\n    <DefaultNode\n      element={element}\n      showStatusDecorator\n      selected={selected}\n      onSelect={onSelect}\n      labelPosition={LabelPosition.right}\n      {...rest}\n    >\n      <g transform={`translate(25, 25)`}>\n        <Icon style={{ color: '#393F44' }} width={25} height={25} />\n      </g>\n    </DefaultNode>\n  );\n};\n\nconst customLayoutFactory: LayoutFactory = (type: string, graph: Graph): Layout | undefined =>\n  new ColaLayout(graph, { layoutOnDrag: false });\n\nconst customComponentFactory: ComponentFactory = (kind: ModelKind, type: string) => {\n  switch (type) {\n    case 'group':\n      return DefaultGroup;\n    case 'node':\n      return withDndDrop(\n        nodeDropTargetSpec([CONNECTOR_SOURCE_DROP, CONNECTOR_TARGET_DROP, CREATE_CONNECTOR_DROP_TYPE])\n      )(withDragNode(nodeDragSourceSpec('node', true, true))(withSelection()(CustomNode)));\n    case 'data-edge':\n      return DataEdge;\n    default:\n      switch (kind) {\n        case ModelKind.graph:\n          return GraphComponent;\n        case ModelKind.node:\n          return CustomNode;\n        case ModelKind.edge:\n          return DefaultEdge;\n        default:\n          return undefined;\n      }\n  }\n};\n\nconst NODE_DIAMETER = 75;\n\nconst NODES: NodeModel[] = [\n  {\n    id: 'node-0',\n    type: 'node',\n    label: 'Node 0',\n    labelPosition: LabelPosition.right,\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NodeShape.ellipse,\n    x: 350,\n    y: 50\n  },\n  {\n    id: 'node-1',\n    type: 'node',\n    label: 'Node 1',\n    labelPosition: LabelPosition.right,\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NodeShape.hexagon,\n    x: 150,\n    y: 150\n  },\n  {\n    id: 'node-2',\n    type: 'node',\n    label: 'Node 2',\n    labelPosition: LabelPosition.right,\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NodeShape.octagon,\n    x: 150,\n    y: 350\n  },\n  {\n    id: 'node-3',\n    type: 'node',\n    label: 'Node 3',\n    labelPosition: LabelPosition.right,\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NodeShape.rhombus,\n    x: 350,\n    y: 450\n  },\n  {\n    id: 'node-4',\n    type: 'node',\n    label: 'Node 4',\n    labelPosition: LabelPosition.right,\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NodeShape.hexagon,\n    x: 550,\n    y: 350\n  },\n  {\n    id: 'node-5',\n    type: 'node',\n    label: 'Node 5',\n    labelPosition: LabelPosition.right,\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NodeShape.rect,\n    x: 550,\n    y: 150\n  },\n  {\n    id: 'Group-1',\n    children: ['node-0', 'node-1', 'node-2'],\n    type: 'group',\n    group: true,\n    label: 'Group-1',\n    style: {\n      padding: 40\n    }\n  }\n];\n\nconst EDGES: EdgeModel[] = [\n  {\n    id: `edge-1`,\n    type: 'edge',\n    source: 'node-4',\n    target: 'node-5'\n  },\n  {\n    id: `edge-2`,\n    type: 'data-edge',\n    source: 'node-0',\n    target: 'node-1',\n    edgeStyle: EdgeStyle.dashedMd,\n    animationSpeed: EdgeAnimationSpeed.medium\n  }\n];\n\nexport const TopologyCustomEdgeDemo: React.FC = () => {\n  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);\n\n  const controller = React.useMemo(() => {\n    const model: Model = {\n      nodes: NODES,\n      edges: EDGES,\n      graph: {\n        id: 'g1',\n        type: 'graph',\n        layout: 'Cola'\n      }\n    };\n\n    const newController = new Visualization();\n    newController.registerLayoutFactory(customLayoutFactory);\n    newController.registerComponentFactory(customComponentFactory);\n\n    newController.addEventListener(SELECTION_EVENT, setSelectedIds);\n\n    newController.fromModel(model, false);\n\n    return newController;\n  }, []);\n\n  return (\n    <VisualizationProvider controller={controller}>\n      <VisualizationSurface state={{ selectedIds }} />\n    </VisualizationProvider>\n  );\n};\n","title":"Using custom edges","lang":"ts"}}>
      
      <p {...{"className":"ws-p"}}>
        {`Edges can be styled using properties on `}
        
        <code {...{"className":"ws-code"}}>
          {`EdgeModel`}
        </code>
        {`:`}
      </p>
      
      <ul {...{"className":"ws-ul"}}>
        

        
        <li {...{"className":"ws-li"}}>
          {`edgeStyle: choose from the `}
          
          <code {...{"className":"ws-code"}}>
            {`EdgeStyle`}
          </code>
          {` enumeration providing solid, dashed, or dotted`}
        </li>
        

        
        <li {...{"className":"ws-li"}}>
          {`animationSpeed: choose from the `}
          
          <code {...{"className":"ws-code"}}>
            {`EdgeAnimationSpeed`}
          </code>
          {` enumeration providing various speeds`}
        </li>
        

      </ul>
      
      <p {...{"className":"ws-p"}}>
        {`You can also customize your edges further by providing a custom Edge component. In the component you can specify a variety of parameters to pass to `}
        
        <code {...{"className":"ws-code"}}>
          {`DefaultEdge`}
        </code>
        {` or you can create the SVG elements to depict the edge.`}
      </p>
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
    {React.createElement(pageData.examples["Using custom edges"])}
  </React.Fragment>
);
Component.displayName = 'TopologyCustomEdgesExtensionsDocs';
Component.pageData = pageData;

export default Component;
