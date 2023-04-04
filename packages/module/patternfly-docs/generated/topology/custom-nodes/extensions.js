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
  Visualization,
  VisualizationProvider,
  VisualizationSurface
} from '@patternfly/react-topology';
import Icon1 from '@patternfly/react-icons/dist/esm/icons/regions-icon';
import Icon2 from '@patternfly/react-icons/dist/esm/icons/folder-open-icon';
import '../../../content/examples/./topology-example.css';
const pageData = {
  "id": "Custom Nodes",
  "section": "topology",
  "subsection": "",
  "source": "extensions",
  "tabName": null,
  "slug": "/topology/custom-nodes/extensions",
  "sourceLink": "https://github.com/patternfly/patternfly-react/blob/main/packages/react-topology/src/components/TopologyView/examples/TopologyCustomNodesDemo.tsx",
  "relPath": "packages/module/patternfly-docs/content/examples/TopologyCustomNodes.md",
  "propComponents": [
    {
      "name": "DefaultNode",
      "description": "",
      "props": [
        {
          "name": "attachments",
          "type": "React.ReactNode",
          "description": "Additional items to add to the node, typically decorators"
        },
        {
          "name": "badge",
          "type": "string",
          "description": "Text for the label's badge"
        },
        {
          "name": "badgeBorderColor",
          "type": "string",
          "description": "Color to use for the label's badge border"
        },
        {
          "name": "badgeClassName",
          "type": "string",
          "description": "Additional classes to use for the label's badge"
        },
        {
          "name": "badgeColor",
          "type": "string",
          "description": "Color to use for the label's badge background"
        },
        {
          "name": "badgeLocation",
          "type": "BadgeLocation",
          "description": "Location of the badge relative to the label's text, inner or below"
        },
        {
          "name": "badgeTextColor",
          "type": "string",
          "description": "Color to use for the label's badge text"
        },
        {
          "name": "canDrop",
          "type": "boolean",
          "description": "Flag if the current drag operation can be dropped on the node"
        },
        {
          "name": "children",
          "type": "React.ReactNode",
          "description": "Additional content added to the node"
        },
        {
          "name": "className",
          "type": "string",
          "description": "Additional classes added to the node"
        },
        {
          "name": "contextMenuOpen",
          "type": "boolean",
          "description": "Flag indicating that the context menu for the node is currently open"
        },
        {
          "name": "dndDragRef",
          "type": "ConnectDragSource",
          "description": "A ref to add to the node for drag and drop. Part of WithDndDragProps"
        },
        {
          "name": "dndDropRef",
          "type": "ConnectDropTarget",
          "description": "A ref to add to the node for dropping. Part of WithDndDropProps"
        },
        {
          "name": "dragging",
          "type": "boolean",
          "description": "Flag if the user is dragging the node"
        },
        {
          "name": "dragNodeRef",
          "type": "WithDndDragProps['dndDragRef']",
          "description": "A ref to add to the node for dragging. Part of WithDragNodeProps"
        },
        {
          "name": "droppable",
          "type": "boolean",
          "description": "Flag if the node accepts drop operations"
        },
        {
          "name": "dropTarget",
          "type": "boolean",
          "description": "Flag if the node is the current drop target"
        },
        {
          "name": "edgeDragging",
          "type": "boolean",
          "description": "Flag if the user is dragging an edge connected to the node"
        },
        {
          "name": "element",
          "type": "Node",
          "description": "The graph node element to represent",
          "required": true
        },
        {
          "name": "getCustomShape",
          "type": "(node: Node) => React.FunctionComponent<ShapeProps>",
          "description": "Function to return a custom shape component for the element"
        },
        {
          "name": "getShapeDecoratorCenter",
          "type": "(quadrant: TopologyQuadrant, node: Node) => { x: number; y: number }",
          "description": "Function to return the center for a decorator for the quadrant"
        },
        {
          "name": "hover",
          "type": "boolean",
          "description": "Flag if the user is hovering on the node"
        },
        {
          "name": "label",
          "type": "string",
          "description": "Label for the node. Defaults to element.getLabel()"
        },
        {
          "name": "labelClassName",
          "type": "string",
          "description": "Additional classes to add to the label"
        },
        {
          "name": "labelIcon",
          "type": "React.ReactNode",
          "description": "The label icon component to show in the label, takes precedence over labelIconClass"
        },
        {
          "name": "labelIconClass",
          "type": "string",
          "description": "The Icon class to show in the label, ignored when labelIcon is specified"
        },
        {
          "name": "labelIconPadding",
          "type": "number",
          "description": "Padding for the label's icon"
        },
        {
          "name": "labelPosition",
          "type": "LabelPosition",
          "description": "Position of the label, bottom or left. Defaults to element.getLabelPosition() or bottom"
        },
        {
          "name": "nodeStatus",
          "type": "NodeStatus",
          "description": "Status of the node, Defaults to element.getNodeStatus()"
        },
        {
          "name": "onContextMenu",
          "type": "(e: React.MouseEvent) => void",
          "description": "Function to call to show a context menu for the node"
        },
        {
          "name": "onHideCreateConnector",
          "type": "() => void",
          "description": "Function to call to hide the connector creation indicator. Part of WithCreateConnectorProps"
        },
        {
          "name": "onSelect",
          "type": "OnSelect",
          "description": "Function to call when the element should become selected (or deselected). Part of WithSelectionProps"
        },
        {
          "name": "onShowCreateConnector",
          "type": "() => void",
          "description": "Function to call for showing a connector creation indicator. Part of WithCreateConnectorProps"
        },
        {
          "name": "onStatusDecoratorClick",
          "type": "(event: React.MouseEvent<SVGGElement, MouseEvent>, element: GraphElement) => void",
          "description": "Callback when the status decorator is clicked"
        },
        {
          "name": "scaleLabel",
          "type": "boolean",
          "description": "Flag to scale the label, best on hover of the node at lowest scale level"
        },
        {
          "name": "scaleNode",
          "type": "boolean",
          "description": "Flag indicating the node should be scaled, best on hover of the node at lowest scale level"
        },
        {
          "name": "secondaryLabel",
          "type": "string",
          "description": "Secondary label for the node"
        },
        {
          "name": "selected",
          "type": "boolean",
          "description": "Flag if the element selected. Part of WithSelectionProps"
        },
        {
          "name": "showLabel",
          "type": "boolean",
          "description": "Flag to show the label",
          "defaultValue": "true"
        },
        {
          "name": "showStatusBackground",
          "type": "boolean",
          "description": "Flag indicating whether the node's background color should indicate node status"
        },
        {
          "name": "showStatusDecorator",
          "type": "boolean",
          "description": "Flag which displays the status decorator for the node",
          "defaultValue": "false"
        },
        {
          "name": "statusDecoratorTooltip",
          "type": "React.ReactNode",
          "description": "Contents of a tooltip to show on the status decorator"
        },
        {
          "name": "truncateLength",
          "type": "number",
          "description": "The maximum length of the label before truncation"
        }
      ]
    }
  ],
  "sortValue": 11,
  "examples": [
    "Using custom nodes"
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
  Visualization,
  VisualizationProvider,
  VisualizationSurface,
  Icon1,
  Icon2
};
pageData.relativeImports = {
  
};
pageData.examples = {
  'Using custom nodes': props => 
    <Example {...pageData} {...props} {...{"code":"import * as React from 'react';\n\n// eslint-disable-next-line patternfly-react/import-tokens-icons\nimport { RegionsIcon as Icon1 } from '@patternfly/react-icons';\n// eslint-disable-next-line patternfly-react/import-tokens-icons\nimport { FolderOpenIcon as Icon2 } from '@patternfly/react-icons';\n\nimport {\n  ColaLayout,\n  ComponentFactory,\n  DefaultEdge,\n  DefaultGroup,\n  DefaultNode,\n  EdgeStyle,\n  Graph,\n  GraphComponent,\n  Layout,\n  LayoutFactory,\n  Model,\n  ModelKind,\n  Node,\n  NodeModel,\n  NodeShape,\n  NodeStatus,\n  SELECTION_EVENT,\n  Visualization,\n  VisualizationProvider,\n  VisualizationSurface\n} from '@patternfly/react-topology';\n\ninterface CustomNodeProps {\n  element: Node;\n}\n\nconst BadgeColors = [\n  {\n    name: 'A',\n    badgeColor: '#ace12e',\n    badgeTextColor: '#0f280d',\n    badgeBorderColor: '#486b00'\n  },\n  {\n    name: 'B',\n    badgeColor: '#F2F0FC',\n    badgeTextColor: '#5752d1',\n    badgeBorderColor: '#CBC1FF'\n  }\n];\n\nconst CustomNode: React.FC<CustomNodeProps> = ({ element }) => {\n  const data = element.getData();\n  const Icon = data.isAlternate ? Icon2 : Icon1;\n  const badgeColors = BadgeColors.find(badgeColor => badgeColor.name === data.badge);\n\n  return (\n    <DefaultNode\n      element={element}\n      showStatusDecorator\n      badge={data.badge}\n      badgeColor={badgeColors?.badgeColor}\n      badgeTextColor={badgeColors?.badgeTextColor}\n      badgeBorderColor={badgeColors?.badgeBorderColor}\n    >\n      <g transform={`translate(25, 25)`}>\n        <Icon style={{ color: '#393F44' }} width={25} height={25} />\n      </g>\n    </DefaultNode>\n  );\n};\n\nconst customLayoutFactory: LayoutFactory = (type: string, graph: Graph): Layout | undefined => {\n  switch (type) {\n    case 'Cola':\n      return new ColaLayout(graph);\n    default:\n      return new ColaLayout(graph, { layoutOnDrag: false });\n  }\n};\n\nconst customComponentFactory: ComponentFactory = (kind: ModelKind, type: string) => {\n  switch (type) {\n    case 'group':\n      return DefaultGroup;\n    default:\n      switch (kind) {\n        case ModelKind.graph:\n          return GraphComponent;\n        case ModelKind.node:\n          return CustomNode;\n        case ModelKind.edge:\n          return DefaultEdge;\n        default:\n          return undefined;\n      }\n  }\n};\n\nconst NODE_DIAMETER = 75;\n\nconst NODES: NodeModel[] = [\n  {\n    id: 'node-0',\n    type: 'node',\n    label: 'Node 0',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NodeShape.ellipse,\n    status: NodeStatus.danger,\n    data: {\n      badge: 'B',\n      isAlternate: false\n    }\n  },\n  {\n    id: 'node-1',\n    type: 'node',\n    label: 'Node 1',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NodeShape.hexagon,\n    status: NodeStatus.warning,\n    data: {\n      badge: 'B',\n      isAlternate: false\n    }\n  },\n  {\n    id: 'node-2',\n    type: 'node',\n    label: 'Node 2',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NodeShape.octagon,\n    status: NodeStatus.success,\n    data: {\n      badge: 'A',\n      isAlternate: true\n    }\n  },\n  {\n    id: 'node-3',\n    type: 'node',\n    label: 'Node 3',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NodeShape.rhombus,\n    status: NodeStatus.info,\n    data: {\n      badge: 'A',\n      isAlternate: false\n    }\n  },\n  {\n    id: 'node-4',\n    type: 'node',\n    label: 'Node 4',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NodeShape.hexagon,\n    status: NodeStatus.default,\n    data: {\n      badge: 'C',\n      isAlternate: false\n    }\n  },\n  {\n    id: 'node-5',\n    type: 'node',\n    label: 'Node 5',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NodeShape.rect,\n    data: {\n      badge: 'C',\n      isAlternate: true\n    }\n  },\n  {\n    id: 'Group-1',\n    children: ['node-0', 'node-1', 'node-2'],\n    type: 'group',\n    group: true,\n    label: 'Group-1',\n    style: {\n      padding: 40\n    }\n  }\n];\n\nconst EDGES = [\n  {\n    id: 'edge-node-4-node-5',\n    type: 'edge',\n    source: 'node-4',\n    target: 'node-5',\n    edgeStyle: EdgeStyle.default\n  },\n  {\n    id: 'edge-node-0-node-2',\n    type: 'edge',\n    source: 'node-0',\n    target: 'node-2',\n    edgeStyle: EdgeStyle.default\n  }\n];\n\nexport const TopologyCustomNodeDemo: React.FC = () => {\n  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);\n\n  const controller = React.useMemo(() => {\n    const model: Model = {\n      nodes: NODES,\n      edges: EDGES,\n      graph: {\n        id: 'g1',\n        type: 'graph',\n        layout: 'Cola'\n      }\n    };\n\n    const newController = new Visualization();\n    newController.registerLayoutFactory(customLayoutFactory);\n    newController.registerComponentFactory(customComponentFactory);\n\n    newController.addEventListener(SELECTION_EVENT, setSelectedIds);\n\n    newController.fromModel(model, false);\n\n    return newController;\n  }, []);\n\n  return (\n    <VisualizationProvider controller={controller}>\n      <VisualizationSurface state={{ selectedIds }} />\n    </VisualizationProvider>\n  );\n};\n","title":"Using custom nodes","lang":"ts"}}>
      
      <p {...{"className":"ws-p"}}>
        {`To create nodes with custom styling, you will need to create a custom node component, which your `}
        
        <code {...{"className":"ws-code"}}>
          {`customComponentFactory`}
        </code>
        {` will return.`}
      </p>
      
      <p {...{"className":"ws-p"}}>
        {`To do this, you will need:`}
      </p>
      
      <ul {...{"className":"ws-ul"}}>
        

        
        <li {...{"className":"ws-li"}}>
          {`A `}
          
          <code {...{"className":"ws-code"}}>
            {`CustomNode`}
          </code>
          {` component, with `}
          
          <code {...{"className":"ws-code"}}>
            {`CustomNodeProps`}
          </code>
          {` as the generic type, and the destructured `}
          
          <code {...{"className":"ws-code"}}>
            {`element`}
          </code>
          {` as the parameter. The code in the example shows how you can get data from `}
          
          <code {...{"className":"ws-code"}}>
            {`element`}
          </code>
          {` and apply it to the attributes of `}
          
          <code {...{"className":"ws-code"}}>
            {`DefaultNode`}
          </code>
          {`.`}
        </li>
        

      </ul>
      
      <p {...{"className":"ws-p"}}>
        {`Within each node in your `}
        
        <code {...{"className":"ws-code"}}>
          {`NODES`}
        </code>
        {` array, you can set `}
        
        <code {...{"className":"ws-code"}}>
          {`data`}
        </code>
        {` to include additional custom attributes.`}
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
    {React.createElement(pageData.examples["Using custom nodes"])}
  </React.Fragment>
);
Component.displayName = 'TopologyCustomNodesExtensionsDocs';
Component.pageData = pageData;

export default Component;
