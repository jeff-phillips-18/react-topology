import React from 'react';
import { AutoLinkHeader, Example, Link as PatternflyThemeLink } from '@patternfly/documentation-framework/components';
import {
  BadgeLocation,
  ColaLayout,
  DefaultEdge,
  DefaultGroup,
  DefaultNode,
  EdgeStyle,
  GraphComponent,
  LabelPosition,
  ModelKind,
  NodeShape,
  NodeStatus,
  observer,
  SELECTION_EVENT,
  TopologyView,
  Visualization,
  VisualizationProvider,
  VisualizationSurface
} from '@patternfly/react-topology';
import { Select, SelectOption, SelectVariant, ToolbarItem } from '@patternfly/react-core';
import Icon1 from '@patternfly/react-icons/dist/esm/icons/regions-icon';
import Icon2 from '@patternfly/react-icons/dist/esm/icons/folder-open-icon';
import '../../../content/examples/./topology-example.css';
const pageData = {
  "id": "Toolbar",
  "section": "topology",
  "subsection": "",
  "source": "extensions",
  "tabName": null,
  "slug": "/topology/toolbar/extensions",
  "sourceLink": "https://github.com/patternfly/patternfly-react/blob/main/packages/react-topology/src/components/TopologyView/examples/TopologyToolbarDemo.tsx",
  "relPath": "packages/module/patternfly-docs/content/examples/TopologyToolbar.md",
  "propComponents": [
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
  "sortValue": 32,
  "examples": [
    "Topology with a toolbar"
  ]
};
pageData.liveContext = {
  BadgeLocation,
  ColaLayout,
  DefaultEdge,
  DefaultGroup,
  DefaultNode,
  EdgeStyle,
  GraphComponent,
  LabelPosition,
  ModelKind,
  NodeShape,
  NodeStatus,
  observer,
  SELECTION_EVENT,
  TopologyView,
  Visualization,
  VisualizationProvider,
  VisualizationSurface,
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
  'Topology with a toolbar': props => 
    <Example {...pageData} {...props} {...{"code":"import * as React from 'react';\nimport { Select, SelectOption, SelectVariant, ToolbarItem } from '@patternfly/react-core';\n// eslint-disable-next-line patternfly-react/import-tokens-icons\nimport { RegionsIcon as Icon1, FolderOpenIcon as Icon2 } from '@patternfly/react-icons';\nimport {\n  ColaLayout,\n  DefaultEdge,\n  DefaultGroup,\n  DefaultNode,\n  EdgeStyle,\n  GraphComponent,\n  ModelKind,\n  NodeModel,\n  NodeShape,\n  observer,\n  SELECTION_EVENT,\n  TopologyView,\n  Visualization,\n  VisualizationProvider,\n  VisualizationSurface,\n  ComponentFactory,\n  Graph,\n  Layout,\n  LayoutFactory,\n  Model,\n  Node,\n  NodeStatus\n} from '@patternfly/react-topology';\n\nexport const NODE_STATUSES = [\n  NodeStatus.danger,\n  NodeStatus.success,\n  NodeStatus.warning,\n  NodeStatus.info,\n  NodeStatus.default\n];\n\nconst BadgeColors = [\n  {\n    name: 'A',\n    badgeColor: '#ace12e',\n    badgeTextColor: '#0f280d',\n    badgeBorderColor: '#486b00'\n  },\n  {\n    name: 'B',\n    badgeColor: '#F2F0FC',\n    badgeTextColor: '#5752d1',\n    badgeBorderColor: '#CBC1FF'\n  }\n];\n\nconst NODE_DIAMETER = 75;\n\nconst NODES: NodeModel[] = [\n  {\n    id: 'node-0',\n    type: 'node',\n    label: 'Node 0',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NodeShape.ellipse,\n    status: NODE_STATUSES[0],\n    data: {\n      badge: 'B',\n      isAlternate: false\n    }\n  },\n  {\n    id: 'node-1',\n    type: 'node',\n    label: 'Node 1',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NodeShape.hexagon,\n    status: NODE_STATUSES[1],\n    data: {\n      badge: 'B',\n      isAlternate: false\n    }\n  },\n  {\n    id: 'node-2',\n    type: 'node',\n    label: 'Node 2',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NodeShape.octagon,\n    status: NODE_STATUSES[2],\n    data: {\n      badge: 'A',\n      isAlternate: true\n    }\n  },\n  {\n    id: 'node-3',\n    type: 'node',\n    label: 'Node 3',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NodeShape.rhombus,\n    status: NODE_STATUSES[3],\n    data: {\n      badge: 'A',\n      isAlternate: false\n    }\n  },\n  {\n    id: 'node-4',\n    type: 'node',\n    label: 'Node 4',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NodeShape.hexagon,\n    status: NODE_STATUSES[4],\n    data: {\n      badge: 'C',\n      isAlternate: false\n    }\n  },\n  {\n    id: 'node-5',\n    type: 'node',\n    label: 'Node 5',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NodeShape.rect,\n    data: {\n      badge: 'C',\n      isAlternate: true\n    }\n  },\n  {\n    id: 'Group-1',\n    children: ['node-0', 'node-1', 'node-2'],\n    type: 'group',\n    group: true,\n    label: 'Group-1',\n    style: {\n      padding: 40\n    }\n  }\n];\n\nconst EDGES = [\n  {\n    id: 'edge-node-4-node-5',\n    type: 'edge',\n    source: 'node-4',\n    target: 'node-5',\n    edgeStyle: EdgeStyle.default\n  },\n  {\n    id: 'edge-node-0-node-2',\n    type: 'edge',\n    source: 'node-0',\n    target: 'node-2',\n    edgeStyle: EdgeStyle.default\n  }\n];\n\nconst customLayoutFactory: LayoutFactory = (type: string, graph: Graph): Layout | undefined => {\n  switch (type) {\n    case 'Cola':\n      return new ColaLayout(graph);\n    default:\n      return new ColaLayout(graph, { layoutOnDrag: false });\n  }\n};\n\ninterface ControllerState {\n  selectedIds: string[];\n  viewOptions: ViewOptions;\n}\n\ninterface CustomNodeProps {\n  element: Node;\n}\n\nconst CustomNode: React.FC<CustomNodeProps> = observer(({ element }) => {\n  const data = element.getData();\n  const Icon = data.isAlternate ? Icon2 : Icon1;\n  const badgeColors = BadgeColors.find(badgeColor => badgeColor.name === data.badge);\n  const { viewOptions } = element.getController().getState<ControllerState>();\n\n  return (\n    <DefaultNode\n      element={element}\n      showStatusBackground={viewOptions.showStatusBackground}\n      showStatusDecorator={viewOptions.showDecorators}\n      badge={viewOptions.showBadges ? data.badge : undefined}\n      badgeColor={viewOptions.showBadges ? badgeColors?.badgeColor : undefined}\n      badgeTextColor={viewOptions.showBadges ? badgeColors?.badgeTextColor : undefined}\n      badgeBorderColor={viewOptions.showBadges ? badgeColors?.badgeBorderColor : undefined}\n      showLabel={viewOptions.showLabels}\n    >\n      <g transform={`translate(25, 25)`}>\n        <Icon style={{ color: '#393F44' }} width={25} height={25} />\n      </g>\n    </DefaultNode>\n  );\n});\n\nconst customComponentFactory: ComponentFactory = (kind: ModelKind, type: string) => {\n  switch (type) {\n    case 'group':\n      return DefaultGroup;\n    default:\n      switch (kind) {\n        case ModelKind.graph:\n          return GraphComponent;\n        case ModelKind.node:\n          return CustomNode;\n        case ModelKind.edge:\n          return DefaultEdge;\n        default:\n          return undefined;\n      }\n  }\n};\n\ninterface ViewOptions {\n  showLabels: boolean;\n  showStatusBackground: boolean;\n  showDecorators: boolean;\n  showBadges: boolean;\n}\n\nexport const DefaultViewOptions: ViewOptions = {\n  showLabels: false,\n  showStatusBackground: false,\n  showDecorators: false,\n  showBadges: false\n};\nexport const ToolbarDemo: React.FC = () => {\n  const [viewOptionsOpen, setViewOptionsOpen] = React.useState<boolean>(false);\n  const [viewOptions, setViewOptions] = React.useState<ViewOptions>(DefaultViewOptions);\n  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);\n\n  const controller = React.useMemo(() => {\n    const model: Model = {\n      nodes: NODES,\n      edges: EDGES,\n      graph: {\n        id: 'g1',\n        type: 'graph',\n        layout: 'Cola'\n      }\n    };\n\n    const newController = new Visualization();\n    newController.registerLayoutFactory(customLayoutFactory);\n    newController.registerComponentFactory(customComponentFactory);\n\n    newController.addEventListener(SELECTION_EVENT, setSelectedIds);\n\n    newController.fromModel(model, false);\n    return newController;\n  }, []);\n\n  const contextToolbar = (\n    <ToolbarItem>\n      <Select\n        variant={SelectVariant.checkbox}\n        customContent={\n          <div>\n            <SelectOption\n              value=\"Labels\"\n              isChecked={viewOptions.showLabels}\n              onClick={() => setViewOptions(prev => ({ ...prev, showLabels: !prev.showLabels }))}\n            />\n            <SelectOption\n              value=\"Badges\"\n              isDisabled={!viewOptions.showLabels}\n              isChecked={viewOptions.showBadges}\n              onClick={() => setViewOptions(prev => ({ ...prev, showBadges: !prev.showBadges }))}\n            />\n            <SelectOption\n              value=\"Status background\"\n              isChecked={viewOptions.showStatusBackground}\n              onClick={() => setViewOptions(prev => ({ ...prev, showStatusBackground: !prev.showStatusBackground }))}\n            />\n            <SelectOption\n              value=\"Status decorators\"\n              isChecked={viewOptions.showDecorators}\n              onClick={() => setViewOptions(prev => ({ ...prev, showDecorators: !prev.showDecorators }))}\n            />\n          </div>\n        }\n        onToggle={() => setViewOptionsOpen(prev => !prev)}\n        onSelect={() => {}}\n        isCheckboxSelectionBadgeHidden\n        isOpen={viewOptionsOpen}\n        placeholderText=\"Node options\"\n      />\n    </ToolbarItem>\n  );\n\n  return (\n    <TopologyView contextToolbar={contextToolbar}>\n      <VisualizationProvider controller={controller}>\n        <VisualizationSurface state={{ selectedIds, viewOptions }} />\n      </VisualizationProvider>\n    </TopologyView>\n  );\n};\n","title":"Topology with a toolbar","lang":"ts"}}>
      
      <p {...{"className":"ws-p"}}>
        {`To add a toolbar to the topology view, wrap your `}
        
        <code {...{"className":"ws-code"}}>
          {`VisualizationProvider`}
        </code>
        {` with the `}
        
        <code {...{"className":"ws-code"}}>
          {`TopologyView`}
        </code>
        {` component, which will accept `}
        
        <code {...{"className":"ws-code"}}>
          {`viewToolbar`}
        </code>
        {` and/or `}
        
        <code {...{"className":"ws-code"}}>
          {`contextToolbar`}
        </code>
        {` as props.`}
      </p>
      
      <ul {...{"className":"ws-ul"}}>
        

        
        <li {...{"className":"ws-li"}}>
          
          <code {...{"className":"ws-code"}}>
            {`contextToolbar`}
          </code>
          {`: displayed at the top of the view, should contain components for changing context`}
        </li>
        

        
        <li {...{"className":"ws-li"}}>
          
          <code {...{"className":"ws-code"}}>
            {`viewToolbar`}
          </code>
          {`: displayed below the context toolbar, should contain components for changing view contents`}
        </li>
        

      </ul>
      
      <p {...{"className":"ws-p"}}>
        
        <strong>
          {`Note`}
        </strong>
        {`: You can set the state on the controller to track values such as the `}
        
        <code {...{"className":"ws-code"}}>
          {`viewOptions`}
        </code>
        {`.`}
      </p>
      
      <p {...{"className":"ws-p"}}>
        {`The GraphElement components can retrieve state from the controller via:
`}
        
        <code {...{"className":"ws-code"}}>
          {`element.getController().getState<ControllerState>();`}
        </code>
        {`
and react to that state accordingly.`}
      </p>
      
      <p {...{"className":"ws-p"}}>
        {`You will need to pass in the corresponding props and the related `}
        
        <code {...{"className":"ws-code"}}>
          {`viewOptions`}
        </code>
        {` state values into your custom `}
        
        <code {...{"className":"ws-code"}}>
          {`DefaultNode`}
        </code>
        {` component for all the view options you want to track.`}
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
    {React.createElement(pageData.examples["Topology with a toolbar"])}
  </React.Fragment>
);
Component.displayName = 'TopologyToolbarExtensionsDocs';
Component.pageData = pageData;

export default Component;
