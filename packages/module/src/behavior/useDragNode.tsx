import { useContext, useRef, useMemo } from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import ElementContext from '../utils/ElementContext';
import { Controller, EventListener, isNode, Node } from '../types';
import { useDndDrag, WithDndDragProps, Modifiers } from './useDndDrag';
import {
  DragSourceSpec,
  DragEvent,
  ConnectDragSource,
  DragObjectWithType,
  DragSpecOperationType,
  DragOperationWithType,
  DragSourceMonitor
} from './dnd-types';
import { useDndManager } from './useDndManager';

export const DRAG_NODE_EVENT = 'drag_node';
export const DRAG_NODE_START_EVENT = `${DRAG_NODE_EVENT}_start`;
export const DRAG_NODE_END_EVENT = `${DRAG_NODE_EVENT}_end`;

export type DragNodeEventListener = EventListener<[Node, DragEvent, DragOperationWithType]>;

export const DRAG_MOVE_OPERATION = 'move.useDragNode';

const defaultOperation = {
  [Modifiers.DEFAULT]: { type: DRAG_MOVE_OPERATION }
};

export const useDragNode = <
  DragObject extends DragObjectWithType = DragObjectWithType,
  DropResult = any,
  CollectedProps extends {} = {},
  Props extends {} = {}
>(
  spec?: Omit<
    DragSourceSpec<DragObject, DragSpecOperationType<DragOperationWithType>, DropResult, CollectedProps, Props>,
    'item'
  > & {
    item?: DragObject;
  },
  props?: Props
): [CollectedProps, ConnectDragSource] => {
  const element = useContext(ElementContext);
  if (!isNode(element)) {
    throw new Error('useDragNode must be used within the scope of a Node');
  }
  const elementRef = useRef(element);
  elementRef.current = element;

  const dndManager = useDndManager();

  return useDndDrag(
    useMemo(() => {
      const sourceSpec: DragSourceSpec<any, any, any, any, Props> = {
        item: (spec && spec.item) || { type: '#useDragNode#' },
        operation: (monitor: DragSourceMonitor, p: Props) => {
          if (spec) {
            const operation = typeof spec.operation === 'function' ? spec.operation(monitor, p) : spec.operation;
            if (typeof operation === 'object' && Object.keys(operation).length > 0) {
              return {
                ...defaultOperation,
                ...operation
              };
            }
          }
          return defaultOperation;
        },
        begin: (monitor, p) => {
          elementRef.current.raise();
          if (elementRef.current.isGroup()) {
            elementRef.current.getChildren().forEach((c) => {
              c.raise();
            });
          }

          const result = spec && spec.begin && spec.begin(monitor, p);

          elementRef.current
            .getController()
            .fireEvent(DRAG_NODE_START_EVENT, elementRef.current, monitor.getDragEvent(), monitor.getOperation());

          return result || elementRef.current;
        },
        drag: (event, monitor, p) => {
          const { dx, dy } = event;

          /**
           * @param e
           */
          function moveElement(e: Node) {
            let moved = true;
            if (e.isGroup()) {
              const nodeChildren = e.getChildren().filter(isNode);
              if (nodeChildren.length) {
                moved = false;
                nodeChildren.forEach(moveElement);
              }
            }
            if (moved) {
              e.setPosition(e.getPosition().clone().translate(dx, dy));
            }
          }

          moveElement(elementRef.current);

          spec && spec.drag && spec.drag(event, monitor, p);

          elementRef.current
            .getController()
            .fireEvent(DRAG_NODE_EVENT, elementRef.current, event, monitor.getOperation());
        },
        canDrag: spec ? spec.canDrag : undefined,
        end: async (dropResult, monitor, p) => {
          // FIXME: Get the controller up front due it issues with model updates during dnd operations
          let controller: Controller;
          try {
            controller = elementRef.current.getController();
          } catch (e) {
            return;
          }

          if (spec && spec.end) {
            try {
              await spec.end(dropResult, monitor, p);
            } catch {
              dndManager.cancel();
            }
          }

          action(() => {
            controller.fireEvent(
              DRAG_NODE_END_EVENT,
              elementRef.current,
              monitor.getDragEvent(),
              monitor.getOperation()
            );
          })();
        },
        collect: spec ? spec.collect : undefined,
        canCancel: spec ? spec.canCancel : true
      };
      return sourceSpec;
    }, [spec, dndManager]),
    props
  );
};

export interface WithDragNodeProps {
  dragNodeRef?: WithDndDragProps['dndDragRef'];
}

export const withDragNode =
  <
    DragObject extends DragObjectWithType = DragObjectWithType,
    DropResult = any,
    CollectedProps extends {} = {},
    Props extends {} = {}
  >(
    spec?: Omit<
      DragSourceSpec<DragObject, DragSpecOperationType<DragOperationWithType>, DropResult, CollectedProps, Props>,
      'item'
    > & {
      item?: DragObject;
    }
  ) =>
  <P extends WithDragNodeProps & CollectedProps & Props>(WrappedComponent: React.ComponentType<P>) => {
    const Component: React.FunctionComponent<Omit<P, keyof WithDragNodeProps>> = (props) => {
      // TODO fix cast to any
      const [dragNodeProps, dragNodeRef] = useDragNode(spec, props as any);
      return <WrappedComponent {...(props as any)} dragNodeRef={dragNodeRef} {...dragNodeProps} />;
    };
    Component.displayName = `withDragNode(${WrappedComponent.displayName || WrappedComponent.name})`;
    return observer(Component);
  };
