import React from 'react';
import { AutoLinkHeader, Example, Link as PatternflyThemeLink } from '@patternfly/documentation-framework/components';
import {
  ColaLayout,
  ContextMenuItem,
  ContextMenuSeparator,
  DefaultEdge,
  DefaultGroup,
  DefaultNode,
  EdgeStyle,
  GraphComponent,
  ModelKind,
  NodeShape,
  SELECTION_EVENT,
  Visualization,
  VisualizationProvider,
  VisualizationSurface,
  withContextMenu
} from '@patternfly/react-topology';
import Icon1 from '@patternfly/react-icons/dist/esm/icons/regions-icon';
import '../../../content/examples/./topology-example.css';
const pageData = {
  "id": "Context Menu",
  "section": "topology",
  "subsection": "",
  "source": "extensions",
  "tabName": null,
  "slug": "/topology/context-menu/extensions",
  "sourceLink": "https://github.com/patternfly/patternfly-react/blob/main/packages/react-topology/src/components/TopologyView/examples/TopologyContextMenuDemo.tsx",
  "relPath": "packages/module/patternfly-docs/content/examples/TopologyContextMenu.md",
  "sortValue": 23,
  "examples": [
    "Topology with context menus"
  ]
};
pageData.liveContext = {
  ColaLayout,
  ContextMenuItem,
  ContextMenuSeparator,
  DefaultEdge,
  DefaultGroup,
  DefaultNode,
  EdgeStyle,
  GraphComponent,
  ModelKind,
  NodeShape,
  SELECTION_EVENT,
  Visualization,
  VisualizationProvider,
  VisualizationSurface,
  withContextMenu,
  Icon1
};
pageData.relativeImports = {
  
};
pageData.examples = {
  'Topology with context menus': props => 
    <Example {...pageData} {...props} {...{"code":"import * as React from 'react';\n\n// eslint-disable-next-line patternfly-react/import-tokens-icons\nimport { RegionsIcon as Icon1 } from '@patternfly/react-icons';\n\nimport {\n  ColaLayout,\n  ComponentFactory,\n  DefaultEdge,\n  DefaultGroup,\n  DefaultNode,\n  EdgeStyle,\n  Graph,\n  GraphComponent,\n  Layout,\n  LayoutFactory,\n  Model,\n  ModelKind,\n  Node,\n  NodeModel,\n  NodeShape,\n  Visualization,\n  VisualizationProvider,\n  VisualizationSurface,\n  withContextMenu,\n  WithContextMenuProps,\n  ContextMenuSeparator,\n  ContextMenuItem\n} from '@patternfly/react-topology';\n\ninterface CustomNodeProps {\n  element: Node;\n}\n\nconst CustomNode: React.FC<CustomNodeProps & WithContextMenuProps> = ({ element, onContextMenu, contextMenuOpen }) => {\n  const Icon = Icon1;\n\n  return (\n    <DefaultNode element={element} onContextMenu={onContextMenu} contextMenuOpen={contextMenuOpen}>\n      <g transform={`translate(25, 25)`}>\n        <Icon style={{ color: '#393F44' }} width={25} height={25} />\n      </g>\n    </DefaultNode>\n  );\n};\n\nconst customLayoutFactory: LayoutFactory = (type: string, graph: Graph): Layout | undefined => {\n  switch (type) {\n    case 'Cola':\n      return new ColaLayout(graph);\n    default:\n      return new ColaLayout(graph, { layoutOnDrag: false });\n  }\n};\n\nconst customComponentFactory: ComponentFactory = (kind: ModelKind, type: string) => {\n  const contextMenuItem = (label: string, i: number): React.ReactElement => {\n    if (label === '-') {\n      return <ContextMenuSeparator key={`separator:${i.toString()}`} />;\n    }\n    return (\n      // eslint-disable-next-line no-alert\n      <ContextMenuItem key={label} onClick={() => alert(`Selected: ${label}`)}>\n        {label}\n      </ContextMenuItem>\n    );\n  };\n\n  const createContextMenuItems = (...labels: string[]): React.ReactElement[] => labels.map(contextMenuItem);\n\n  const contextMenu = createContextMenuItems('First', 'Second', 'Third', '-', 'Fourth');\n  switch (type) {\n    case 'group':\n      return DefaultGroup;\n    default:\n      switch (kind) {\n        case ModelKind.graph:\n          return withContextMenu(() => contextMenu)(GraphComponent);\n        case ModelKind.node:\n          return withContextMenu(() => contextMenu)(CustomNode);\n        case ModelKind.edge:\n          return withContextMenu(() => contextMenu)(DefaultEdge);\n        default:\n          return undefined;\n      }\n  }\n};\n\nconst NODE_DIAMETER = 75;\n\nconst NODES: NodeModel[] = [\n  {\n    id: 'node-0',\n    type: 'node',\n    label: 'Node 0',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NodeShape.ellipse\n  },\n  {\n    id: 'node-1',\n    type: 'node',\n    label: 'Node 1',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NodeShape.hexagon\n  },\n  {\n    id: 'node-2',\n    type: 'node',\n    label: 'Node 2',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NodeShape.octagon\n  },\n  {\n    id: 'node-3',\n    type: 'node',\n    label: 'Node 3',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NodeShape.rhombus\n  },\n  {\n    id: 'node-4',\n    type: 'node',\n    label: 'Node 4',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NodeShape.hexagon\n  },\n  {\n    id: 'node-5',\n    type: 'node',\n    label: 'Node 5',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NodeShape.rect\n  },\n  {\n    id: 'Group-1',\n    children: ['node-0', 'node-1', 'node-2'],\n    type: 'group',\n    group: true,\n    label: 'Group-1',\n    style: {\n      padding: 40\n    }\n  }\n];\n\nconst EDGES = [\n  {\n    id: 'edge-node-4-node-5',\n    type: 'edge',\n    source: 'node-4',\n    target: 'node-5',\n    edgeStyle: EdgeStyle.default\n  },\n  {\n    id: 'edge-node-0-node-2',\n    type: 'edge',\n    source: 'node-0',\n    target: 'node-2',\n    edgeStyle: EdgeStyle.default\n  }\n];\n\nexport const TopologyContextMenuDemo: React.FC = () => {\n  const controller = React.useMemo(() => {\n    const model: Model = {\n      nodes: NODES,\n      edges: EDGES,\n      graph: {\n        id: 'g1',\n        type: 'graph',\n        layout: 'Cola'\n      }\n    };\n\n    const newController = new Visualization();\n    newController.registerLayoutFactory(customLayoutFactory);\n    newController.registerComponentFactory(customComponentFactory);\n\n    newController.fromModel(model, false);\n\n    return newController;\n  }, []);\n\n  return (\n    <VisualizationProvider controller={controller}>\n      <VisualizationSurface />\n    </VisualizationProvider>\n  );\n};\n","title":"Topology with context menus","lang":"ts"}}>
      
      <p {...{"className":"ws-p"}}>
        {`Context menus can be used to show a menu of actions or links related to a graph element that will trigger a process or navigate to a new location. The menus are shown when right clicking on elements in the graph. Nodes, edges, and the graph itself can have context menus.`}
      </p>
      
      <p {...{"className":"ws-p"}}>
        {`To add context menus to an element, you can use the `}
        
        <code {...{"className":"ws-code"}}>
          {`withContextMenu`}
        </code>
        {` utility when returning the component in the componentFactory, e.g.: `}
        
        <code {...{"className":"ws-code"}}>
          {`withContextMenu(() => contextMenu)(MyCustomNode)`}
        </code>
        {`.`}
      </p>
      
      <p {...{"className":"ws-p"}}>
        {`The component should accept two parameters, `}
        
        <code {...{"className":"ws-code"}}>
          {`onContextMenu`}
        </code>
        {` and `}
        
        <code {...{"className":"ws-code"}}>
          {`contextMenuOpen`}
        </code>
        {` (you can simply extend `}
        
        <code {...{"className":"ws-code"}}>
          {`WithContextMenuProps`}
        </code>
        {`).`}
      </p>
      
      <ul {...{"className":"ws-ul"}}>
        

        
        <li {...{"className":"ws-li"}}>
          
          <code {...{"className":"ws-code"}}>
            {`onContextMenu`}
          </code>
          {`: function to call upon node selection. Typically the outer container for the component would call onContextMenu when clicked.`}
        </li>
        

        
        <li {...{"className":"ws-li"}}>
          
          <code {...{"className":"ws-code"}}>
            {`contextMenuOpen`}
          </code>
          {`: indicates if the menu is currently open. Updates the drawing of the component to indicate its toggle status.`}
        </li>
        

      </ul>
      
      <p {...{"className":"ws-p"}}>
        {`If you are using `}
        
        <code {...{"className":"ws-code"}}>
          {`DefaultNode`}
        </code>
        {`, these props can be passed along and will be handled appropriately.`}
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
    {React.createElement(pageData.examples["Topology with context menus"])}
  </React.Fragment>
);
Component.displayName = 'TopologyContextMenuExtensionsDocs';
Component.pageData = pageData;

export default Component;
