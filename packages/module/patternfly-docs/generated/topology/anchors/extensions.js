import React from 'react';
import { AutoLinkHeader, Example, Link as PatternflyThemeLink } from '@patternfly/documentation-framework/components';
import {
  AbstractAnchor,
  AnchorEnd,
  ColaLayout,
  DefaultEdge,
  DefaultNode,
  GraphComponent,
  Layer,
  ModelKind,
  NodeShape,
  Point,
  useAnchor,
  useSvgAnchor,
  Visualization,
  VisualizationProvider,
  VisualizationSurface,
  withDragNode,
} from '@patternfly/react-topology';
import '../../../content/examples/./topology-example.css';
const pageData = {
  "id": "Anchors",
  "section": "topology",
  "subsection": "",
  "source": "extensions",
  "tabName": null,
  "slug": "/topology/anchors/extensions",
  "sourceLink": "https://github.com/patternfly/patternfly-org/blob/main/packages/module/patternfly-docs/content/examples/TopologyAnchors.md",
  "relPath": "packages/module/patternfly-docs/content/examples/TopologyAnchors.md",
  "sortValue": 13,
  "examples": [
    "Using custom anchors"
  ]
};
pageData.liveContext = {
  AbstractAnchor,
  AnchorEnd,
  ColaLayout,
  DefaultEdge,
  DefaultNode,
  GraphComponent,
  Layer,
  ModelKind,
  NodeShape,
  Point,
  useAnchor,
  useSvgAnchor,
  Visualization,
  VisualizationProvider,
  VisualizationSurface,
  withDragNode
};
pageData.relativeImports = {
  
};
pageData.examples = {
  'Using custom anchors': props => 
    <Example {...pageData} {...props} {...{"code":"import * as React from 'react';\nimport {\n  AbstractAnchor,\n  AnchorEnd,\n  ColaLayout,\n  ComponentFactory,\n  DefaultEdge,\n  DefaultNode,\n  Graph,\n  GraphComponent,\n  Layer,\n  Layout,\n  LayoutFactory,\n  Model,\n  ModelKind,\n  Node,\n  NodeModel,\n  Point,\n  useAnchor,\n  useSvgAnchor,\n  Visualization,\n  VisualizationProvider,\n  VisualizationSurface,\n  withDragNode,\n  WithDragNodeProps\n} from '@patternfly/react-topology';\n\nclass RightAnchor extends AbstractAnchor {\n  getLocation(): Point {\n    return this.getReferencePoint();\n  }\n\n  getReferencePoint(): Point {\n    const bounds = this.owner.getBounds();\n    return new Point(bounds.right(), bounds.y + bounds.height / 2);\n  }\n}\n\ntype CustomNodeProps = {\n  element: Node;\n} & WithDragNodeProps;\n\nconst CustomNode: React.FC<CustomNodeProps> = ({ element, dragNodeRef }) => {\n  const targetRef = useSvgAnchor(AnchorEnd.target, 'edge-point'); // overrides anchor for end points\n  useAnchor(RightAnchor, AnchorEnd.source, 'edge-point'); // overrides anchor for end points\n  const { width, height } = element.getDimensions();\n\n  return (\n    <Layer id=\"bottom\">\n      <DefaultNode element={element} dragNodeRef={dragNodeRef}>\n        <circle ref={targetRef} fill=\"red\" r=\"5\" cx={width * 0.75} cy={height * 0.75} />\n      </DefaultNode>\n    </Layer>\n  );\n};\n\nconst customLayoutFactory: LayoutFactory = (type: string, graph: Graph): Layout | undefined =>\n  new ColaLayout(graph, { layoutOnDrag: false });\n\nconst customComponentFactory: ComponentFactory = (kind: ModelKind) => {\n  switch (kind) {\n    case ModelKind.graph:\n      return GraphComponent;\n    case ModelKind.node:\n      return withDragNode()(CustomNode);\n    case ModelKind.edge:\n      return DefaultEdge;\n    default:\n      return undefined;\n  }\n};\n\nconst NODE_DIAMETER = 75;\n\nconst NODES: NodeModel[] = [\n  {\n    id: 'node-0',\n    type: 'node',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    x: 250,\n    y: 120\n  },\n  {\n    id: 'node-1',\n    type: 'node',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    x: 350,\n    y: 120\n  },\n  {\n    id: 'node-2',\n    type: 'node',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    x: 450,\n    y: 120\n  },\n  {\n    id: 'node-3',\n    type: 'node',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    x: 250,\n    y: 320\n  },\n  {\n    id: 'node-4',\n    type: 'node',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    x: 350,\n    y: 320\n  },\n  {\n    id: 'node-5',\n    type: 'node',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    x: 450,\n    y: 320\n  }\n];\n\nconst EDGES = [\n  {\n    id: 'edge-node-0-node-1',\n    type: 'edge-point',\n    source: 'node-0',\n    target: 'node-1'\n  },\n  {\n    id: 'edge-node-1-node-2',\n    type: 'edge-point',\n    source: 'node-1',\n    target: 'node-2'\n  },\n  {\n    id: 'edge-node-3-node-4',\n    type: 'edge-point',\n    source: 'node-3',\n    target: 'node-4'\n  },\n  {\n    id: 'edge-node-4-node-5',\n    type: 'edge-point',\n    source: 'node-4',\n    target: 'node-5'\n  }\n];\n\nexport const TopologyCustomNodeDemo: React.FC = () => {\n  const controller = React.useMemo(() => {\n    const model: Model = {\n      nodes: NODES,\n      edges: EDGES,\n      graph: {\n        id: 'g1',\n        type: 'graph',\n        layout: 'Cola'\n      }\n    };\n\n    const newController = new Visualization();\n    newController.registerLayoutFactory(customLayoutFactory);\n    newController.registerComponentFactory(customComponentFactory);\n\n    newController.fromModel(model, false);\n\n    return newController;\n  }, []);\n\n  return (\n    <VisualizationProvider controller={controller}>\n      <VisualizationSurface />\n    </VisualizationProvider>\n  );\n};\n","title":"Using custom anchors","lang":"ts"}}>
      
      <p {...{"className":"ws-p"}}>
        {`By default, Nodes use a default anchor `}
        
        <code {...{"className":"ws-code"}}>
          {`CenterAnchor`}
        </code>
        {` which use the center of the bounds of the node. A variety of anchors are provided for different node shapes that will set the anchor locations to the edge of the node.`}
      </p>
      
      <p {...{"className":"ws-p"}}>
        {`You can customize the start and end locations for edges on a node by specifying the anchors to use on the node.`}
      </p>
      
      <p {...{"className":"ws-p"}}>
        {`Hooks are provided to enable you to specify the SVG element you wish to use for determining the edge locations: `}
        
        <code {...{"className":"ws-code"}}>
          {`usePolygonAnchor`}
        </code>
        {`, and `}
        
        <code {...{"className":"ws-code"}}>
          {`useSvgAnchor`}
        </code>
        {`
These hooks accept parameters allowing you to customize when to use the anchor:`}
      </p>
      
      <ul {...{"className":"ws-ul"}}>
        

        
        <li {...{"className":"ws-li"}}>
          
          <code {...{"className":"ws-code"}}>
            {`points`}
          </code>
          {` (usePolygonAnchor only) to specify the points for the polygon`}
        </li>
        

        
        <li {...{"className":"ws-li"}}>
          
          <code {...{"className":"ws-code"}}>
            {`AnchorEnd`}
          </code>
          {` to specify use for start, end or both`}
        </li>
        

        
        <li {...{"className":"ws-li"}}>
          
          <code {...{"className":"ws-code"}}>
            {`type`}
          </code>
          {` to specify which edge types to use the anchor for (optional)`}
        </li>
        

      </ul>
      
      <p {...{"className":"ws-p"}}>
        {`The `}
        
        <code {...{"className":"ws-code"}}>
          {`useAnchor`}
        </code>
        {` hook allows you to specify your own custom anchor or provide a function to return a specific anchor (useful for adjusting the anchor based on the node being displayed).`}
      </p>
      
      <p {...{"className":"ws-p"}}>
        {`A custom anchor must extend the `}
        
        <code {...{"className":"ws-code"}}>
          {`AbstractAnchor`}
        </code>
        {` class. There are two methods used for anchors:`}
      </p>
      
      <ul {...{"className":"ws-ul"}}>
        

        
        <li {...{"className":"ws-li"}}>
          
          <code {...{"className":"ws-code"}}>
            {`getLocation(reference: Point): Point`}
          </code>
          

          
          <ul {...{"className":"ws-ul"}}>
            

            
            <li {...{"className":"ws-li"}}>
              {`Should return the location of the anchor based on the incoming reference point. Default anchors use the point on the node border closest to the reference point.`}
            </li>
            

          </ul>
          

        </li>
        

        
        <li {...{"className":"ws-li"}}>
          
          <code {...{"className":"ws-code"}}>
            {`getReferencePoint(): Point`}
          </code>
          

          
          <ul {...{"className":"ws-ul"}}>
            

            
            <li {...{"className":"ws-li"}}>
              {`Should return the location where outgoing edges would initiate from`}
            </li>
            

          </ul>
          

        </li>
        

      </ul>
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
    {React.createElement(pageData.examples["Using custom anchors"])}
  </React.Fragment>
);
Component.displayName = 'TopologyAnchorsExtensionsDocs';
Component.pageData = pageData;

export default Component;
