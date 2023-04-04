import React from 'react';
import { AutoLinkHeader, Example, Link as PatternflyThemeLink } from '@patternfly/documentation-framework/components';
import {
  TopologyView,
  Visualization,
  VisualizationProvider,
  VisualizationSurface,
  useVisualizationController,
  DefaultTaskGroup,
  GraphComponent,
  ModelKind,
  SpacerNode,
  TaskEdge,
  FinallyNode,
  DEFAULT_FINALLY_NODE_TYPE,
  DEFAULT_TASK_NODE_TYPE,
  DEFAULT_EDGE_TYPE,
  DEFAULT_SPACER_NODE_TYPE,
  DEFAULT_WHEN_OFFSET,
  TaskNode,
  WhenDecorator,
  RunStatus,
  getEdgesFromNodes,
  getSpacerNodes,
  PipelineDagreLayout
} from '@patternfly/react-topology';
import '../../../content/examples/./topology-pipelines-example.css';
const pageData = {
  "id": "Pipelines",
  "section": "topology",
  "subsection": "",
  "source": "extensions",
  "tabName": null,
  "slug": "/topology/pipelines/extensions",
  "sourceLink": "https://github.com/patternfly/patternfly-react/blob/main/packages/react-topology/src/components/TopologyView/examples/TopologyPipelinesGettingStartedDemo.tsx",
  "relPath": "packages/module/patternfly-docs/content/examples/TopologyPipelinesGettingStarted.md",
  "propComponents": [
    {
      "name": "TaskEdge",
      "description": "",
      "props": [
        {
          "name": "className",
          "type": "string",
          "description": "Additional classes added to the edge"
        },
        {
          "name": "element",
          "type": "Edge",
          "description": "The graph edge element to represent",
          "required": true
        },
        {
          "name": "nodeSeparation",
          "type": "number",
          "description": "Offset for integral shape path"
        }
      ]
    },
    {
      "name": "WhenDecorator",
      "description": "",
      "props": [
        {
          "name": "className",
          "type": "string",
          "description": "Additional classes added to the node"
        },
        {
          "name": "disableTooltip",
          "type": "boolean",
          "description": "Flag if the tooltip is disabled",
          "defaultValue": "false"
        },
        {
          "name": "edgeLength",
          "type": "number",
          "description": "Length of the edge between the when decorator and the node",
          "defaultValue": "12"
        },
        {
          "name": "element",
          "type": "Node",
          "description": "The graph node element to represent",
          "required": true
        },
        {
          "name": "height",
          "type": "number",
          "description": "Height of the when decorator",
          "defaultValue": "12"
        },
        {
          "name": "leftOffset",
          "type": "number",
          "description": "Offest distance from the start of the node area",
          "defaultValue": "12"
        },
        {
          "name": "nameLabelClass",
          "type": "string",
          "description": "Additional classes added to the label"
        },
        {
          "name": "onSelect",
          "type": "OnSelect",
          "description": "Function to call when the element should become selected (or deselected). Part of WithSelectionProps"
        },
        {
          "name": "selected",
          "type": "boolean",
          "description": "Flag if the element selected. Part of WithSelectionProps"
        },
        {
          "name": "showStatusState",
          "type": "boolean",
          "description": "Flag indicating the status indicator"
        },
        {
          "name": "status",
          "type": "WhenStatus",
          "description": "WhenStatus to depict"
        },
        {
          "name": "toolTip",
          "type": "React.ReactNode",
          "description": "Tooltip to show on decorator hover"
        },
        {
          "name": "width",
          "type": "number",
          "description": "Width of the when decorator",
          "defaultValue": "12"
        }
      ]
    }
  ],
  "sortValue": 71,
  "examples": [
    "Getting Started with Topology Pipelines"
  ]
};
pageData.liveContext = {
  TopologyView,
  Visualization,
  VisualizationProvider,
  VisualizationSurface,
  useVisualizationController,
  DefaultTaskGroup,
  GraphComponent,
  ModelKind,
  SpacerNode,
  TaskEdge,
  FinallyNode,
  DEFAULT_FINALLY_NODE_TYPE,
  DEFAULT_TASK_NODE_TYPE,
  DEFAULT_EDGE_TYPE,
  DEFAULT_SPACER_NODE_TYPE,
  DEFAULT_WHEN_OFFSET,
  TaskNode,
  WhenDecorator,
  RunStatus,
  getEdgesFromNodes,
  getSpacerNodes,
  PipelineDagreLayout
};
pageData.relativeImports = {
  
};
pageData.examples = {
  'Getting Started with Topology Pipelines': props => 
    <Example {...pageData} {...props} {...{"code":"import * as React from 'react';\nimport {\n  TopologyView,\n  Visualization,\n  VisualizationProvider,\n  VisualizationSurface,\n  useVisualizationController,\n  DefaultTaskGroup,\n  GraphComponent,\n  ModelKind,\n  TaskNode,\n  SpacerNode,\n  TaskEdge,\n  FinallyNode,\n  DEFAULT_FINALLY_NODE_TYPE,\n  DEFAULT_TASK_NODE_TYPE,\n  DEFAULT_EDGE_TYPE,\n  DEFAULT_SPACER_NODE_TYPE,\n  DEFAULT_WHEN_OFFSET,\n  Node,\n  WhenDecorator,\n  RunStatus,\n  Graph,\n  Layout,\n  Model,\n  PipelineNodeModel,\n  getEdgesFromNodes,\n  getSpacerNodes,\n  PipelineDagreLayout\n} from '@patternfly/react-topology';\nimport './topology-example.css';\n\nconst TASK_NODES: PipelineNodeModel[] = [\n  {\n    id: 'task-undefined',\n    type: 'DEFAULT_TASK_NODE',\n    label: 'No status Task',\n    width: 180,\n    height: 32,\n    style: {\n      padding: [45, 15]\n    }\n  },\n  {\n    id: 'task-Succeeded',\n    type: 'DEFAULT_TASK_NODE',\n    label: 'Succeeded Task',\n    width: 180,\n    height: 32,\n    style: {\n      padding: [45, 15]\n    },\n    runAfterTasks: ['task-undefined'],\n    data: {\n      status: RunStatus.Succeeded\n    }\n  },\n  {\n    id: 'finally-0',\n    type: 'DEFAULT_FINALLY_NODE',\n    label: 'Finally task 0',\n    width: 156,\n    height: 32,\n    style: {\n      paddingLeft: 24\n    }\n  },\n  {\n    id: 'finally-1',\n    type: 'DEFAULT_FINALLY_NODE',\n    label: 'Finally task 1',\n    width: 156,\n    height: 32,\n    style: {\n      paddingLeft: 24\n    }\n  }\n];\ninterface DemoTaskNodeProps {\n  element: Node;\n}\n\nconst DemoTaskNode: React.FunctionComponent<DemoTaskNodeProps> = ({ element }) => {\n  const data = element.getData();\n\n  const whenDecorator = data?.whenStatus ? (\n    <WhenDecorator element={element} status={data.whenStatus} leftOffset={DEFAULT_WHEN_OFFSET} />\n  ) : null;\n\n  return (\n    <TaskNode element={element} status={data?.status}>\n      {whenDecorator}\n    </TaskNode>\n  );\n};\n\nconst pipelineComponentFactory = (kind: ModelKind, type: string) => {\n  if (kind === ModelKind.graph) {\n    return GraphComponent;\n  }\n  switch (type) {\n    case DEFAULT_TASK_NODE_TYPE:\n      return DemoTaskNode;\n    case DEFAULT_FINALLY_NODE_TYPE:\n      return FinallyNode;\n    case 'task-group':\n      return DefaultTaskGroup;\n    case 'finally-group':\n      return DefaultTaskGroup;\n    case DEFAULT_SPACER_NODE_TYPE:\n      return SpacerNode;\n    case 'finally-spacer-edge':\n    case DEFAULT_EDGE_TYPE:\n      return TaskEdge;\n    default:\n      return undefined;\n  }\n};\n\nexport const PipelineTasks: React.FC = () => {\n  const controller = useVisualizationController();\n  React.useEffect(() => {\n    controller.fromModel(\n      {\n        graph: {\n          id: 'g1',\n          type: 'graph'\n        },\n        nodes: TASK_NODES\n      },\n      false\n    );\n  }, [controller]);\n\n  return (\n    <TopologyView>\n      <VisualizationSurface />\n    </TopologyView>\n  );\n};\n\nPipelineTasks.displayName = 'PipelineTasks';\n\nexport const TopologyPipelinesGettingStartedDemo: React.FC = () => {\n  const controller = new Visualization();\n  controller.setFitToScreenOnLayout(true);\n  controller.registerComponentFactory(pipelineComponentFactory);\n  controller.registerLayoutFactory((type: string, graph: Graph): Layout | undefined => new PipelineDagreLayout(graph));\n  const spacerNodes = getSpacerNodes(TASK_NODES);\n  const nodes = [...TASK_NODES, ...spacerNodes];\n  const edges = getEdgesFromNodes(nodes);\n\n  const model: Model = {\n    nodes,\n    edges,\n    graph: {\n      id: 'g1',\n      type: 'graph',\n      layout: 'pipelineLayout'\n    }\n  };\n\n  controller.fromModel(model, false);\n\n  return (\n    <VisualizationProvider controller={controller}>\n      <VisualizationSurface />\n    </VisualizationProvider>\n  );\n};\n","title":"Getting Started with Topology Pipelines","lang":"ts"}}>
      
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
                {`: This method sets the layout of your topology view. For topology pipelines, this shouls use the `}
                
                <code {...{"className":"ws-code"}}>
                  {`PipleineDagreLayout`}
                </code>
                {` layout or an extension of it.`}
              </p>
              

            </li>
            

            
            <li {...{"className":"ws-li"}}>
              

              
              <p {...{"className":"ws-p"}}>
                
                <code {...{"className":"ws-code"}}>
                  {`registerComponentFactory`}
                </code>
                {`: This method lets you customize the components in your topology view (e.g. nodes, groups, and edges).
For topology pipelines, nodes and edges should use the elements with a `}
                
                <code {...{"className":"ws-code"}}>
                  {`PipelineNodeModel`}
                </code>
                {`, which adds the model field `}
                
                <code {...{"className":"ws-code"}}>
                  {`runAfterTasks`}
                </code>
                {`.`}
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
        

        
        <li {...{"className":"ws-li"}}>
          

          
          <p {...{"className":"ws-p"}}>
            {`Set the task nodes and their relationships using the `}
            
            <code {...{"className":"ws-code"}}>
              {`runAfterTasks`}
            </code>
            {` field.`}
          </p>
          

        </li>
        

        
        <li {...{"className":"ws-li"}}>
          

          
          <p {...{"className":"ws-p"}}>
            {`Use the `}
            
            <code {...{"className":"ws-code"}}>
              {`getSpacerNodes`}
            </code>
            {` function to determine the necessary spacer nodes. Spacer nodes are used to aggregate edges to/from multiple task nodes.`}
          </p>
          

        </li>
        

        
        <li {...{"className":"ws-li"}}>
          

          
          <p {...{"className":"ws-p"}}>
            {`Determine the edges in your model by calling the `}
            
            <code {...{"className":"ws-code"}}>
              {`getEdgesFromNodes`}
            </code>
            {` function, passing it all the nodes including the spacer nodes.`}
          </p>
          

        </li>
        

        
        <li {...{"className":"ws-li"}}>
          

          
          <p {...{"className":"ws-p"}}>
            {`The `}
            
            <code {...{"className":"ws-code"}}>
              {`fromModel`}
            </code>
            {` method can then be called, passing along all nodes and determined edges. Your data model should include a `}
            
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
    {React.createElement(pageData.examples["Getting Started with Topology Pipelines"])}
    <AutoLinkHeader {...{"id":"functions","size":"h2","className":"ws-title ws-h2"}}>
      {`Functions`}
    </AutoLinkHeader>
    <AutoLinkHeader {...{"id":"getspacernodes","size":"h3","className":"ws-title ws-h3"}}>
      {`getSpacerNodes`}
    </AutoLinkHeader>
    <Example {...{"code":"/**\n * parameters:\n *   nodes: PipelineNodeModel[] - List of task and finally nodes in the model\n *   spacerNodeType: string     - Type to use for Spacer nodes\n *   finallyNodeTypes: string[] - Types to consider as finally nodes on incoming nodes\n *\n * Returns:\n *   PipelineNodeModel[]: a list of spacer nodes required to layout the pipeline view\n **/\n \nconst getSpacerNodes = (\n  nodes: PipelineNodeModel[],\n  spacerNodeType = DEFAULT_SPACER_NODE_TYPE,\n  finallyNodeTypes: string[] = [DEFAULT_FINALLY_NODE_TYPE]\n): PipelineNodeModel[]","lang":"noLive"}}>
    </Example>
    <AutoLinkHeader {...{"id":"getedgesfromnodes","size":"h3","className":"ws-title ws-h3"}}>
      {`getEdgesFromNodes`}
    </AutoLinkHeader>
    <Example {...{"code":"/**\n * parameters:\n *   nodes: PipelineNodeModel[] - List of all nodes in the model\n *   spacerNodeType: string     - Type set on spacer nodes\n *   edgeType:                  - Type to set on created edges\n *   spacerEdgeType:            - Type to set on edges between spacer nodes\n *   finallyNodeTypes: string[] - Types to consider as finally nodes on incoming nodes\n *   finallyEdgeType: string[]  - Type to set on edges to finally nodes\n *\n * Returns:\n *   EdgeModel[]: a list edges required to layout the pipeline view\n **/\nconst getEdgesFromNodes = (\n  nodes: PipelineNodeModel[],\n  spacerNodeType = DEFAULT_SPACER_NODE_TYPE,\n  edgeType = DEFAULT_EDGE_TYPE,\n  spacerEdgeType = DEFAULT_EDGE_TYPE,\n  finallyNodeTypes: string[] = [DEFAULT_FINALLY_NODE_TYPE],\n  finallyEdgeType = DEFAULT_EDGE_TYPE\n): EdgeModel[]","lang":"noLive"}}>
    </Example>
  </React.Fragment>
);
Component.displayName = 'TopologyPipelinesExtensionsDocs';
Component.pageData = pageData;

export default Component;
