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
  VisualizationSurface,
  withSelection
} from '@patternfly/react-topology';
import Icon1 from '@patternfly/react-icons/dist/esm/icons/regions-icon';
import Icon2 from '@patternfly/react-icons/dist/esm/icons/folder-open-icon';
import '../../../content/examples/./topology-example.css';
const pageData = {
  "id": "Selection",
  "section": "topology",
  "subsection": "",
  "source": "extensions",
  "tabName": null,
  "slug": "/topology/selection/extensions",
  "sourceLink": "https://github.com/patternfly/patternfly-react/blob/main/packages/react-topology/src/components/TopologyView/examples/TopologySelectableDemo.tsx",
  "relPath": "packages/module/patternfly-docs/content/examples/TopologySelectable.md",
  "sortValue": 21,
  "examples": [
    "Using selection"
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
  withSelection,
  Icon1,
  Icon2
};
pageData.relativeImports = {
  
};
pageData.examples = {
  'Using selection': props => 
    <Example {...pageData} {...props} {...{"code":"import * as React from 'react';\n\n// eslint-disable-next-line patternfly-react/import-tokens-icons\nimport { RegionsIcon as Icon1 } from '@patternfly/react-icons';\n// eslint-disable-next-line patternfly-react/import-tokens-icons\nimport { FolderOpenIcon as Icon2 } from '@patternfly/react-icons';\n\nimport {\n  ColaLayout,\n  ComponentFactory,\n  DefaultEdge,\n  DefaultGroup,\n  DefaultNode,\n  EdgeStyle,\n  Graph,\n  GraphComponent,\n  Layout,\n  LayoutFactory,\n  Model,\n  ModelKind,\n  Node,\n  NodeModel,\n  NodeShape,\n  NodeStatus,\n  SELECTION_EVENT,\n  Visualization,\n  VisualizationProvider,\n  VisualizationSurface,\n  withSelection,\n  WithSelectionProps\n} from '@patternfly/react-topology';\n\ninterface CustomNodeProps {\n  element: Node;\n}\n\nconst BadgeColors = [\n  {\n    name: 'A',\n    badgeColor: '#ace12e',\n    badgeTextColor: '#0f280d',\n    badgeBorderColor: '#486b00'\n  },\n  {\n    name: 'B',\n    badgeColor: '#F2F0FC',\n    badgeTextColor: '#5752d1',\n    badgeBorderColor: '#CBC1FF'\n  }\n];\n\nconst CustomNode: React.FC<CustomNodeProps & WithSelectionProps> = ({ element, onSelect, selected }) => {\n  const data = element.getData();\n  const Icon = data.isAlternate ? Icon2 : Icon1;\n  const badgeColors = BadgeColors.find(badgeColor => badgeColor.name === data.badge);\n\n  return (\n    <DefaultNode\n      element={element}\n      showStatusDecorator\n      badge={data.badge}\n      badgeColor={badgeColors?.badgeColor}\n      badgeTextColor={badgeColors?.badgeTextColor}\n      badgeBorderColor={badgeColors?.badgeBorderColor}\n      onSelect={onSelect}\n      selected={selected}\n    >\n      <g transform={`translate(25, 25)`}>\n        <Icon style={{ color: '#393F44' }} width={25} height={25} />\n      </g>\n    </DefaultNode>\n  );\n};\n\nconst customLayoutFactory: LayoutFactory = (type: string, graph: Graph): Layout | undefined => {\n  switch (type) {\n    case 'Cola':\n      return new ColaLayout(graph);\n    default:\n      return new ColaLayout(graph, { layoutOnDrag: false });\n  }\n};\n\nconst customComponentFactory: ComponentFactory = (kind: ModelKind, type: string) => {\n  switch (type) {\n    case 'group':\n      return DefaultGroup;\n    default:\n      switch (kind) {\n        case ModelKind.graph:\n          return GraphComponent;\n        case ModelKind.node:\n          return withSelection()(CustomNode);\n        case ModelKind.edge:\n          return withSelection()(DefaultEdge);\n        default:\n          return undefined;\n      }\n  }\n};\n\nconst NODE_DIAMETER = 75;\n\nconst NODES: NodeModel[] = [\n  {\n    id: 'node-0',\n    type: 'node',\n    label: 'Node 0',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NodeShape.ellipse,\n    status: NodeStatus.danger,\n    data: {\n      badge: 'B',\n      isAlternate: false\n    }\n  },\n  {\n    id: 'node-1',\n    type: 'node',\n    label: 'Node 1',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NodeShape.hexagon,\n    status: NodeStatus.warning,\n    data: {\n      badge: 'B',\n      isAlternate: false\n    }\n  },\n  {\n    id: 'node-2',\n    type: 'node',\n    label: 'Node 2',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NodeShape.octagon,\n    status: NodeStatus.success,\n    data: {\n      badge: 'A',\n      isAlternate: true\n    }\n  },\n  {\n    id: 'node-3',\n    type: 'node',\n    label: 'Node 3',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NodeShape.rhombus,\n    status: NodeStatus.info,\n    data: {\n      badge: 'A',\n      isAlternate: false\n    }\n  },\n  {\n    id: 'node-4',\n    type: 'node',\n    label: 'Node 4',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NodeShape.hexagon,\n    status: NodeStatus.default,\n    data: {\n      badge: 'C',\n      isAlternate: false\n    }\n  },\n  {\n    id: 'node-5',\n    type: 'node',\n    label: 'Node 5',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NodeShape.rect,\n    data: {\n      badge: 'C',\n      isAlternate: true\n    }\n  },\n  {\n    id: 'Group-1',\n    children: ['node-0', 'node-1', 'node-2'],\n    type: 'group',\n    group: true,\n    label: 'Group-1',\n    style: {\n      padding: 40\n    }\n  }\n];\n\nconst EDGES = [\n  {\n    id: 'edge-node-4-node-5',\n    type: 'edge',\n    source: 'node-4',\n    target: 'node-5',\n    edgeStyle: EdgeStyle.default\n  },\n  {\n    id: 'edge-node-0-node-2',\n    type: 'edge',\n    source: 'node-0',\n    target: 'node-2',\n    edgeStyle: EdgeStyle.default\n  }\n];\n\nexport const TopologySelectableDemo: React.FC = () => {\n  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);\n\n  const controller = React.useMemo(() => {\n    const model: Model = {\n      nodes: NODES,\n      edges: EDGES,\n      graph: {\n        id: 'g1',\n        type: 'graph',\n        layout: 'Cola'\n      }\n    };\n\n    const newController = new Visualization();\n    newController.registerLayoutFactory(customLayoutFactory);\n    newController.registerComponentFactory(customComponentFactory);\n\n    newController.addEventListener(SELECTION_EVENT, setSelectedIds);\n\n    newController.fromModel(model, false);\n\n    return newController;\n  }, []);\n\n  return (\n    <VisualizationProvider controller={controller}>\n      <VisualizationSurface state={{ selectedIds }} />\n    </VisualizationProvider>\n  );\n};\n","title":"Using selection","lang":"ts"}}>
      
      <p {...{"className":"ws-p"}}>
        {`To allow nodes/edges to be selectable, you can use the `}
        
        <code {...{"className":"ws-code"}}>
          {`withSelection`}
        </code>
        {` utility when returning the component in the componentFactory, e.g.: `}
        
        <code {...{"className":"ws-code"}}>
          {`withSelection()(MyCustomNode)`}
        </code>
        {`.`}
      </p>
      
      <p {...{"className":"ws-p"}}>
        {`The component should accept two parameters, `}
        
        <code {...{"className":"ws-code"}}>
          {`onSelect`}
        </code>
        {` and `}
        
        <code {...{"className":"ws-code"}}>
          {`selected`}
        </code>
        {` (you can simply extend `}
        
        <code {...{"className":"ws-code"}}>
          {`WithSelectionProps`}
        </code>
        {`).`}
      </p>
      
      <ul {...{"className":"ws-ul"}}>
        

        
        <li {...{"className":"ws-li"}}>
          
          <code {...{"className":"ws-code"}}>
            {`onSelect`}
          </code>
          {`: function to call upon node selection. Typically the outer container for the component would call onSelect when clicked.`}
        </li>
        

        
        <li {...{"className":"ws-li"}}>
          
          <code {...{"className":"ws-code"}}>
            {`selected`}
          </code>
          {`: indicates if the element is currently selected. Updates the drawing of the component to indicate its selection status.
Alternatively, you can use the `}
          
          <code {...{"className":"ws-code"}}>
            {`useSelection`}
          </code>
          {` hook within the component to retrieve the same two properties.`}
        </li>
        

      </ul>
      
      <p {...{"className":"ws-p"}}>
        {`If you are using `}
        
        <code {...{"className":"ws-code"}}>
          {`DefaultNode`}
        </code>
        {`, these props can be passed along and will be handled appropriately.`}
      </p>
      
      <p {...{"className":"ws-p"}}>
        {`By default, the application must control selection state. This can be done by adding a listener to the controller for a `}
        
        <code {...{"className":"ws-code"}}>
          {`SELECTION_EVENT`}
        </code>
        {`. The listener would then keep track of the selectedIds and maintain the ids in state and pass that state along to the `}
        
        <code {...{"className":"ws-code"}}>
          {`VisualizationSurface`}
        </code>
        {`.`}
      </p>
      
      <p {...{"className":"ws-p"}}>
        {`Alternatively, you can pass `}
        
        <code {...{"className":"ws-code"}}>
          {`{ controlled: true }`}
        </code>
        {` to the `}
        
        <code {...{"className":"ws-code"}}>
          {`withSelection`}
        </code>
        {` utility or to the `}
        
        <code {...{"className":"ws-code"}}>
          {`useSelection`}
        </code>
        {` hook.`}
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
    {React.createElement(pageData.examples["Using selection"])}
  </React.Fragment>
);
Component.displayName = 'TopologySelectionExtensionsDocs';
Component.pageData = pageData;

export default Component;
