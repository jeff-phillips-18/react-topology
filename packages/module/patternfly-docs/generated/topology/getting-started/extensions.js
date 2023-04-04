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
  SELECTION_EVENT,
  Visualization,
  VisualizationProvider,
  VisualizationSurface
} from '@patternfly/react-topology';
import Icon1 from '@patternfly/react-icons/dist/esm/icons/regions-icon';
import Icon2 from '@patternfly/react-icons/dist/esm/icons/folder-open-icon';
import '../../../content/examples/./topology-example.css';
const pageData = {
  "id": "Getting started",
  "section": "topology",
  "subsection": "",
  "source": "extensions",
  "tabName": null,
  "slug": "/topology/getting-started/extensions",
  "sourceLink": "https://github.com/patternfly/patternfly-react/blob/main/packages/react-topology/src/components/TopologyView/examples/TopologyGettingStartedDemo.tsx",
  "relPath": "packages/module/patternfly-docs/content/examples/TopologyGettingStarted.md",
  "propComponents": [
    {
      "name": "VisualizationProvider",
      "description": "",
      "props": [
        {
          "name": "children",
          "type": "React.ReactNode",
          "description": "Content rendered inside the surface"
        },
        {
          "name": "controller",
          "type": "Controller",
          "description": "The graph controller to store in context"
        }
      ]
    },
    {
      "name": "VisualizationSurface",
      "description": "",
      "props": [
        {
          "name": "children",
          "type": "React.ReactNode",
          "description": "Additional content rendered inside the surface"
        },
        {
          "name": "state",
          "type": "State",
          "description": "State to be passed to the controller"
        }
      ]
    }
  ],
  "sortValue": 1,
  "examples": [
    "Getting started with react-topology"
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
  'Getting started with react-topology': props => 
    <Example {...pageData} {...props} {...{"code":"import * as React from 'react';\nimport {\n  ColaLayout,\n  ComponentFactory,\n  DefaultEdge,\n  DefaultGroup,\n  DefaultNode,\n  EdgeStyle,\n  Graph,\n  GraphComponent,\n  Layout,\n  LayoutFactory,\n  Model,\n  ModelKind,\n  NodeShape,\n  SELECTION_EVENT,\n  Visualization,\n  VisualizationProvider,\n  VisualizationSurface\n} from '@patternfly/react-topology';\n\nconst baselineLayoutFactory: LayoutFactory = (type: string, graph: Graph): Layout | undefined => {\n  switch (type) {\n    case 'Cola':\n      return new ColaLayout(graph);\n    default:\n      return new ColaLayout(graph, { layoutOnDrag: false });\n  }\n};\n\nconst baselineComponentFactory: ComponentFactory = (kind: ModelKind, type: string) => {\n  switch (type) {\n    case 'group':\n      return DefaultGroup;\n    default:\n      switch (kind) {\n        case ModelKind.graph:\n          return GraphComponent;\n        case ModelKind.node:\n          return DefaultNode;\n        case ModelKind.edge:\n          return DefaultEdge;\n        default:\n          return undefined;\n      }\n  }\n};\n\nconst NODE_SHAPE = NodeShape.ellipse;\nconst NODE_DIAMETER = 75;\n\nconst NODES = [\n  {\n    id: 'node-0',\n    type: 'node',\n    label: 'Node 0',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NODE_SHAPE\n  },\n  {\n    id: 'node-1',\n    type: 'node',\n    label: 'Node 1',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NODE_SHAPE\n  },\n  {\n    id: 'node-2',\n    type: 'node',\n    label: 'Node 2',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NODE_SHAPE\n  },\n  {\n    id: 'node-3',\n    type: 'node',\n    label: 'Node 3',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NODE_SHAPE\n  },\n  {\n    id: 'node-4',\n    type: 'node',\n    label: 'Node 4',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NODE_SHAPE\n  },\n  {\n    id: 'node-5',\n    type: 'node',\n    label: 'Node 5',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NODE_SHAPE\n  },\n  {\n    id: 'Group-1',\n    children: ['node-0', 'node-1', 'node-2'],\n    type: 'group',\n    group: true,\n    label: 'Group-1',\n    style: {\n      padding: 40\n    }\n  }\n];\n\nconst EDGES = [\n  {\n    id: 'edge-node-4-node-5',\n    type: 'edge',\n    source: 'node-4',\n    target: 'node-5',\n    edgeStyle: EdgeStyle.default\n  },\n  {\n    id: 'edge-node-0-node-2',\n    type: 'edge',\n    source: 'node-0',\n    target: 'node-2',\n    edgeStyle: EdgeStyle.default\n  }\n];\n\nexport const TopologyGettingStartedDemo: React.FC = () => {\n  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);\n\n  const controller = React.useMemo(() => {\n    const model: Model = {\n      nodes: NODES,\n      edges: EDGES,\n      graph: {\n        id: 'g1',\n        type: 'graph',\n        layout: 'Cola'\n      }\n    };\n\n    const newController = new Visualization();\n    newController.registerLayoutFactory(baselineLayoutFactory);\n    newController.registerComponentFactory(baselineComponentFactory);\n\n    newController.addEventListener(SELECTION_EVENT, setSelectedIds);\n\n    newController.fromModel(model, false);\n\n    return newController;\n  }, []);\n\n  return (\n    <VisualizationProvider controller={controller}>\n      <VisualizationSurface state={{ selectedIds }} />\n    </VisualizationProvider>\n  );\n};\n","title":"Getting started with react-topology","lang":"ts"}}>
      
      <ol {...{"className":"ws-ol"}}>
        

        
        <li {...{"className":"ws-li"}}>
          

          
          <p {...{"className":"ws-p"}}>
            {`Create a new Controller which can be done using the default `}
            
            <code {...{"className":"ws-code"}}>
              {`Visualization`}
            </code>
            {` class.`}
          </p>
          

          
          <p {...{"className":"ws-p"}}>
            {`It is important to note that three `}
            
            <code {...{"className":"ws-code"}}>
              {`register`}
            </code>
            {` methods are accessed by the controller.`}
          </p>
          

          
          <p {...{"className":"ws-p"}}>
            {`The following two must be declared explicitly:`}
          </p>
          

          
          <ul {...{"className":"ws-ul"}}>
            

            
            <li {...{"className":"ws-li"}}>
              

              
              <p {...{"className":"ws-p"}}>
                
                <code {...{"className":"ws-code"}}>
                  {`registerLayoutFactory`}
                </code>
                {`: This method sets the layout of your topology view (e.g. Force, Dagre, Cola, etc.). If your application supports all layouts, use `}
                
                <code {...{"className":"ws-code"}}>
                  {`defaultLayoutFactory`}
                </code>
                {` as a parameter. If you only want to support a subset of the available layout options, update `}
                
                <code {...{"className":"ws-code"}}>
                  {`defaultLayout`}
                </code>
                {` to a custom implementation .`}
              </p>
              

            </li>
            

            
            <li {...{"className":"ws-li"}}>
              

              
              <p {...{"className":"ws-p"}}>
                
                <code {...{"className":"ws-code"}}>
                  {`registerComponentFactory`}
                </code>
                {`: This method lets you customize the components in your topology view (e.g. nodes, groups, and edges). You can use `}
                
                <code {...{"className":"ws-code"}}>
                  {`defaultComponentFactory`}
                </code>
                {` as a parameter.`}
              </p>
              

            </li>
            

          </ul>
          

          
          <p {...{"className":"ws-p"}}>
            {`The register method below is initialized in `}
            
            <code {...{"className":"ws-code"}}>
              {`Visualization.ts`}
            </code>
            {`. It doesn't need to be declared unless you support a custom implementation which modifies the types.`}
          </p>
          

          
          <ul {...{"className":"ws-ul"}}>
            

            
            <li {...{"className":"ws-li"}}>
              
              <code {...{"className":"ws-code"}}>
                {`registerElementFactory`}
              </code>
              {`: This method sets the types of the elements being used (e.g. graphs, nodes, edges). `}
              
              <code {...{"className":"ws-code"}}>
                {`defaultElementFactory`}
              </code>
              {` uses types from `}
              
              <code {...{"className":"ws-code"}}>
                {`ModelKind`}
              </code>
              {` and is exported in `}
              
              <code {...{"className":"ws-code"}}>
                {`index.ts`}
              </code>
              {`.`}
            </li>
            

          </ul>
          

        </li>
        

      </ol>
      
      <ol {...{"start":2,"className":"ws-ol"}}>
        

        
        <li {...{"className":"ws-li"}}>
          

          
          <p {...{"className":"ws-p"}}>
            {`The `}
            
            <code {...{"className":"ws-code"}}>
              {`fromModel`}
            </code>
            {` method must be called on the controller to create the nodes. `}
            
            <code {...{"className":"ws-code"}}>
              {`fromModel`}
            </code>
            {` will take your data model as a parameter. Your data model should include a `}
            
            <code {...{"className":"ws-code"}}>
              {`graph`}
            </code>
            {` object, on which you will need to set `}
            
            <code {...{"className":"ws-code"}}>
              {`id`}
            </code>
            {` , `}
            
            <code {...{"className":"ws-code"}}>
              {`type`}
            </code>
            {` and `}
            
            <code {...{"className":"ws-code"}}>
              {`layout`}
            </code>
            {`.`}
          </p>
          

        </li>
        

        
        <li {...{"className":"ws-li"}}>
          

          
          <p {...{"className":"ws-p"}}>
            {`To create your topology view component, add a `}
            
            <code {...{"className":"ws-code"}}>
              {`VisualizationProvider`}
            </code>
            {`, which is a useful context provider. It allows access to the created Controller and is required when using the `}
            
            <code {...{"className":"ws-code"}}>
              {`VisualizationSurface`}
            </code>
            {` component.`}
          </p>
          

        </li>
        

        
        <li {...{"className":"ws-li"}}>
          

          
          <p {...{"className":"ws-p"}}>
            {`You can use the provided `}
            
            <code {...{"className":"ws-code"}}>
              {`VisualizationSurface`}
            </code>
            {` to provide the SVG component required for the topology components. The `}
            
            <code {...{"className":"ws-code"}}>
              {`VisualizationSurface`}
            </code>
            {` can take a state parameter that will allow you to pass your state settings along to the Controller.`}
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
    <p {...{"className":"ws-p"}}>
      {`To use React Topology out-of-the-box, you will first need to transform your back-end data into a `}
      <PatternflyThemeLink {...{"to":"https://github.com/patternfly/patternfly-react/blob/main/packages/react-topology/src/types.ts#L16-L20"}}>
        {`Model`}
      </PatternflyThemeLink>
      {`. These model objects contain the information needed to display the nodes and edges. Each node and edge has a set of properties used by PF Topology as well as a data field which can be used to customize the nodes and edges by the application.`}
    </p>
    {React.createElement(pageData.examples["Getting started with react-topology"])}
  </React.Fragment>
);
Component.displayName = 'TopologyGettingStartedExtensionsDocs';
Component.pageData = pageData;

export default Component;
