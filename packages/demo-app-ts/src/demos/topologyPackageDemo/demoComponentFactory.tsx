import {
  GraphElement,
  ComponentFactory,
  withContextMenu,
  ContextMenuSeparator,
  ContextMenuItem,
  withDragNode,
  withSelection,
  ModelKind,
  DragObjectWithType,
  Node,
  GraphComponent,
  withPanZoom,
  withAreaSelection,
  withCreateConnector,
  Graph,
  isNode,
  withDndDrop,
  Edge,
  withTargetDrag,
  withSourceDrag,
  nodeDragSourceSpec,
  nodeDropTargetSpec,
  groupDropTargetSpec,
  graphDropTargetSpec,
  NODE_DRAG_TYPE,
  CREATE_CONNECTOR_DROP_TYPE,
  edgeDropTargetSpec,
  DragSourceSpec,
  DragSpecOperationType,
  EditableDragOperationType,
  GraphElementProps,
  isEdge,
  Model
} from '@patternfly/react-topology';
import CustomPathNode from '../../components/CustomPathNode';
import CustomPolygonNode from '../../components/CustomPolygonNode';
import DemoGroup from './DemoGroup';
import DemoNode from './DemoNode';
import DemoEdge from './DemoEdge';

const CONNECTOR_SOURCE_DROP = 'connector-src-drop';
const CONNECTOR_TARGET_DROP = 'connector-target-drop';

interface EdgeProps {
  element: Edge;
}

/* Extend the util 'nodeDragSourceSpec' to also handle dropping a node on an edge to split the edge */
const nodeDragSourceEdgeExtensionSpec = (
  type: string,
  allowRegroup: boolean = true,
  canEdit: boolean = false
): DragSourceSpec<
  DragObjectWithType,
  DragSpecOperationType<EditableDragOperationType>,
  GraphElement,
  {
    dragging?: boolean;
    regrouping?: boolean;
  },
  GraphElementProps & { canEdit?: boolean }
> => {
  const standardSpec = nodeDragSourceSpec(type, allowRegroup, canEdit);
  return {
    ...standardSpec,
    end: async (dropResult, monitor, props) => {
      if (!monitor.isCancelled() && isEdge(dropResult) && props && monitor.didDrop()) {
        const droppedEdge = dropResult as Edge;
        const model = droppedEdge.getController().toModel();

        const newEdge1 = {
          type: droppedEdge.getType(),
          id: `${droppedEdge.getSource().getId()}--${props.element.getId()}`,
          source: droppedEdge.getSource().getId(),
          target: props.element.getId(),
          data: droppedEdge.getData()
        };
        const newEdge2 = {
          type: droppedEdge.getType(),
          id: `${props.element.getId()}--${droppedEdge.getTarget().getId()}`,
          source: props.element.getId(),
          target: droppedEdge.getTarget().getId(),
          data: droppedEdge.getData()
        };
        const updateModel: Model = {
          edges: [...model.edges.filter((e) => e.id !== droppedEdge.getId()), newEdge1, newEdge2],
          nodes: model.nodes
        };
        droppedEdge.getController().fromModel(updateModel, true);
        return undefined;
      }
      return standardSpec.end(dropResult, monitor, props);
    }
  };
};

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

const demoComponentFactory: ComponentFactory = (
  kind: ModelKind,
  type: string
): React.ComponentType<{ element: GraphElement }> | undefined => {
  if (kind === ModelKind.graph) {
    return withDndDrop(graphDropTargetSpec([NODE_DRAG_TYPE]))(
      withPanZoom()(withAreaSelection(['ctrlKey', 'shiftKey'])(GraphComponent))
    );
  }
  switch (type) {
    case 'node':
      return withCreateConnector((source: Node, target: Node | Graph): void => {
        let targetId;
        const model = source.getController().toModel();
        if (isNode(target)) {
          targetId = target.getId();
        } else {
          return;
        }
        const id = `e${source.getGraph().getEdges().length + 1}`;
        if (!model.edges) {
          model.edges = [];
        }
        model.edges.push({
          id,
          type: 'edge',
          source: source.getId(),
          target: targetId
        });
        source.getController().fromModel(model);
      })(
        withDndDrop(nodeDropTargetSpec([CONNECTOR_SOURCE_DROP, CONNECTOR_TARGET_DROP, CREATE_CONNECTOR_DROP_TYPE]))(
          withContextMenu(() => defaultMenu)(
            withDragNode(nodeDragSourceEdgeExtensionSpec('node', true, true))(withSelection()(DemoNode))
          )
        )
      );
    case 'node-path':
      return CustomPathNode;
    case 'node-polygon':
      return CustomPolygonNode;
    case 'group':
      return withDndDrop(groupDropTargetSpec)(
        withContextMenu(() => defaultMenu)(withDragNode(nodeDragSourceSpec('group'))(withSelection()(DemoGroup)))
      );
    case 'edge':
      return withSourceDrag<DragObjectWithType, Node, any, EdgeProps>({
        item: { type: CONNECTOR_SOURCE_DROP },
        begin: (monitor, props) => {
          props.element.raise();
          return props.element;
        },
        drag: (event, monitor, props) => {
          props.element.setStartPoint(event.x, event.y);
        },
        end: (dropResult, monitor, props) => {
          if (monitor.didDrop() && dropResult && props) {
            props.element.setSource(dropResult);
          }
          props.element.setStartPoint();
        }
      })(
        withTargetDrag<DragObjectWithType, Node, { dragging?: boolean }, EdgeProps>({
          item: { type: CONNECTOR_TARGET_DROP },
          begin: (monitor, props) => {
            props.element.raise();
            return props.element;
          },
          drag: (event, monitor, props) => {
            props.element.setEndPoint(event.x, event.y);
          },
          end: (dropResult, monitor, props) => {
            if (monitor.didDrop() && dropResult && props) {
              props.element.setTarget(dropResult);
            }
            props.element.setEndPoint();
          },
          collect: (monitor) => ({
            dragging: monitor.isDragging()
          })
        })(
          withDndDrop<Node, any, { droppable?: boolean; hover?: boolean; canDrop?: boolean }, EdgeProps>(
            edgeDropTargetSpec
          )(withContextMenu(() => defaultMenu)(withSelection()(DemoEdge)))
        )
      );
    default:
      return undefined;
  }
};

export default demoComponentFactory;
