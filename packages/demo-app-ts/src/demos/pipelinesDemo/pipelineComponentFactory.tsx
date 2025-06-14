import {
  GraphElement,
  ComponentFactory,
  ModelKind,
  SpacerNode,
  DefaultTaskGroup,
  DEFAULT_TASK_NODE_TYPE,
  DEFAULT_SPACER_NODE_TYPE,
  DEFAULT_EDGE_TYPE,
  DEFAULT_FINALLY_NODE_TYPE,
  ContextMenuSeparator,
  ContextMenuItem,
  withContextMenu,
  withSelection,
  withPanZoom,
  GraphComponent,
  DEFAULT_FINALLY_EDGE_TYPE,
  TaskEdge
} from '@patternfly/react-topology';
import DemoTaskNode from './DemoTaskNode';
import DemoFinallyNode from './DemoFinallyNode';
import DemoTaskGroupEdge from './DemoTaskGroupEdge';
import DemoTaskEdge from './DemoTaskEdge';
import DemoPipelinesGroup from './DemoPipelinesGroup';

export const GROUPED_EDGE_TYPE = 'GROUPED_EDGE';
export const SPACER_EDGE_TYPE = 'spacer-edge';

const contextMenuItem = (label: string, i: number): React.ReactElement => {
  if (label === '-') {
    return <ContextMenuSeparator component="li" key={`separator:${i.toString()}`} />;
  }
  return (
    // eslint-disable-next-line no-alert
    <ContextMenuItem key={label} onClick={() => alert(`Selected: ${label}`)}>
      {label}
    </ContextMenuItem>
  );
};

const createContextMenuItems = (...labels: string[]): React.ReactElement[] => labels.map(contextMenuItem);

const defaultMenu = createContextMenuItems('First', 'Second', 'Third', '-', 'Fourth');

const pipelineComponentFactory: ComponentFactory = (
  kind: ModelKind,
  type: string
): React.ComponentType<{ element: GraphElement }> | undefined => {
  if (kind === ModelKind.graph) {
    return withPanZoom()(GraphComponent);
  }
  switch (type) {
    case DEFAULT_TASK_NODE_TYPE:
      return withContextMenu(() => defaultMenu)(withSelection()(DemoTaskNode));
    case DEFAULT_FINALLY_NODE_TYPE:
      return withContextMenu(() => defaultMenu)(withSelection()(DemoFinallyNode));
    case 'task-group':
      return withSelection()(DemoPipelinesGroup);
    case 'finally-group':
      return DefaultTaskGroup;
    case DEFAULT_SPACER_NODE_TYPE:
      return SpacerNode;
    case SPACER_EDGE_TYPE:
      return TaskEdge;
    case DEFAULT_FINALLY_EDGE_TYPE:
    case DEFAULT_EDGE_TYPE:
      return DemoTaskEdge;
    case GROUPED_EDGE_TYPE:
      return DemoTaskGroupEdge;
    default:
      return undefined;
  }
};

export default pipelineComponentFactory;
