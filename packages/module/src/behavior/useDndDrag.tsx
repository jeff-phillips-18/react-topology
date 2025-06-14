import { useContext, useRef, useMemo, useCallback, useEffect } from 'react';
import * as d3 from 'd3';
import { action, computed, comparer, runInAction } from 'mobx';
import { observer } from 'mobx-react';
import { canUseDOM } from '@patternfly/react-core';
import ElementContext from '../utils/ElementContext';
import useCallbackRef from '../utils/useCallbackRef';
import {
  DragSourceSpec,
  ConnectDragSource,
  DragObjectWithType,
  DragSourceMonitor,
  Identifier,
  DragEvent,
  DragSpecOperationType,
  DragSource,
  DragOperationWithType,
  DragElementWrapper
} from './dnd-types';
import { useDndManager } from './useDndManager';

export const Modifiers = {
  DEFAULT: 0,
  ALT: 0x01,
  CTRL: 0x02,
  META: 0x04,
  SHIFT: 0x08
};

const getModifiers = (event: MouseEvent | TouchEvent | KeyboardEvent): number => {
  let modifiers = Modifiers.DEFAULT;
  if (event.altKey) {
    // eslint-disable-next-line no-bitwise
    modifiers |= Modifiers.ALT;
  }
  if (event.ctrlKey) {
    // eslint-disable-next-line no-bitwise
    modifiers |= Modifiers.CTRL;
  }
  if (event.metaKey) {
    // eslint-disable-next-line no-bitwise
    modifiers |= Modifiers.META;
  }
  if (event.shiftKey) {
    // eslint-disable-next-line no-bitwise
    modifiers |= Modifiers.SHIFT;
  }
  return modifiers;
};

const getOperation = (
  operation: DragSpecOperationType<DragOperationWithType> | undefined,
  event: MouseEvent | TouchEvent | KeyboardEvent
): DragOperationWithType | undefined => {
  if (!operation) {
    return undefined;
  }
  if (operation.hasOwnProperty('type')) {
    return operation as DragOperationWithType;
  }
  return operation[getModifiers(event)] || operation[Modifiers.DEFAULT];
};

const hasOperation = (operation: DragSpecOperationType<DragOperationWithType> | undefined): boolean =>
  !!(operation && (operation.hasOwnProperty('type') || Object.keys(operation).length > 0));

const EMPTY_PROPS = Object.freeze({});

export const useDndDrag = <
  DragObject extends DragObjectWithType = DragObjectWithType,
  DropResult = any,
  CollectedProps extends {} = {},
  Props extends {} = {}
>(
  spec: DragSourceSpec<DragObject, DragSpecOperationType<DragOperationWithType>, DropResult, CollectedProps, Props>,
  props?: Props
): [CollectedProps, ConnectDragSource] => {
  const specRef = useRef(spec);
  specRef.current = spec;

  const propsRef = useRef<Props>(props != null ? props : (EMPTY_PROPS as Props));
  propsRef.current = props != null ? props : (EMPTY_PROPS as Props);

  const dndManager = useDndManager();

  const element = useContext(ElementContext);
  const elementRef = useRef(element);
  elementRef.current = element;

  const idRef = useRef<string>(null);

  // source monitor
  const monitor = useMemo(() => {
    const sourceMonitor: DragSourceMonitor = {
      getHandlerId: (): string | undefined => idRef.current,
      receiveHandlerId: (sourceId: string | undefined): void => {
        idRef.current = sourceId;
      },
      getDropHints: (): string[] => dndManager.getDropHints(),
      canDrag: (): boolean => dndManager.canDragSource(idRef.current),
      isDragging: (): boolean => dndManager.isDraggingSource(idRef.current),
      getItemType: (): Identifier | undefined => dndManager.getItemType(),
      getItem: (): any => dndManager.getItem(),
      getDropResult: (): any => dndManager.getDropResult(),
      didDrop: (): boolean => dndManager.didDrop(),
      getDragEvent: (): DragEvent | undefined => dndManager.getDragEvent(),
      getOperation: (): DragOperationWithType | undefined => dndManager.getOperation(),
      isCancelled: (): boolean => dndManager.isCancelled()
    };
    return sourceMonitor;
  }, [dndManager]);

  const createKeyHandlerId = useCallback(
    (event: string = '') => `${event}.useDndDrag-${monitor.getHandlerId()}`,
    [monitor]
  );

  useEffect(
    () => () => {
      if (canUseDOM) {
        d3.select(document).on(createKeyHandlerId(), null);
      }
      if (dndManager.isDragging() && dndManager.getSourceId() === monitor.getHandlerId()) {
        dndManager.endDrag();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const refCallback: DragElementWrapper = useCallbackRef<DragElementWrapper>(
    useCallback(
      (node: SVGElement | Element | null) => {
        let ownerDocument: Document;
        if (node) {
          ownerDocument = node.ownerDocument;
          let operationChangeEvents:
            | {
                begin: [number, number, number, number];
                drag: [number, number, number, number];
              }
            | undefined;
          let operation: DragSpecOperationType<DragOperationWithType> | undefined;
          d3.select(node).call(
            d3
              .drag()
              .container(
                // TODO bridge the gap between scene tree and dom tree
                () => {
                  const selected =
                    node instanceof SVGElement ? d3.select(node.ownerSVGElement) : d3.select(ownerDocument);
                  return selected.select('[data-surface="true"]').node() as any;
                }
              )
              .on('start', function () {
                operation =
                  typeof specRef.current.operation === 'function'
                    ? specRef.current.operation(monitor, propsRef.current)
                    : specRef.current.operation;
                const updateOperation = action(async (event: KeyboardEvent) => {
                  if (operation && idRef.current) {
                    const op = getOperation(operation, event);
                    if (dndManager.getOperation() !== op) {
                      // restart the drag with the new operation
                      if (dndManager.isDragging()) {
                        // copy the event otherwise it will be mutated by #cancel()
                        const event = { ...dndManager.getDragEvent() };
                        const cancelled = dndManager.cancel();
                        operationChangeEvents = {
                          begin: [
                            cancelled ? event.initialX : event.x,
                            cancelled ? event.initialY : event.y,
                            cancelled ? event.initialPageX : event.pageX,
                            cancelled ? event.initialPageY : event.pageY
                          ],
                          drag: [event.x, event.y, event.pageX, event.pageY]
                        };
                        await dndManager.endDrag();
                      }
                      if (op && operationChangeEvents) {
                        runInAction(() => {
                          dndManager.beginDrag(idRef.current, op, ...operationChangeEvents.begin);
                          dndManager.drag(...operationChangeEvents.drag);
                          operationChangeEvents = undefined;
                        });
                      }
                    }
                  }
                });
                d3.select(ownerDocument)
                  .on(
                    createKeyHandlerId('keydown'),
                    action((event: KeyboardEvent) => {
                      if (event.key === 'Escape') {
                        if (dndManager.isDragging() && dndManager.cancel()) {
                          operationChangeEvents = undefined;
                          d3.select(event.view).on('.drag', null);
                          d3.select(ownerDocument).on(createKeyHandlerId(), null);
                          dndManager.endDrag();
                        }
                      } else {
                        updateOperation(event);
                      }
                    })
                  )
                  .on(createKeyHandlerId('keyup'), updateOperation);
              })
              .on(
                'drag',
                action((event: d3.D3DragEvent<Element, any, any>) => {
                  const { pageX, pageY } =
                    event.sourceEvent instanceof MouseEvent ? event.sourceEvent : { pageX: 0, pageY: 0 };
                  const { x, y } = event;
                  if (dndManager.isDragging()) {
                    dndManager.drag(x, y, pageX, pageY);
                  } else if (operationChangeEvents) {
                    operationChangeEvents.drag = [x, y, pageX, pageY];
                  } else {
                    const op = getOperation(operation, event.sourceEvent);
                    if (op || !hasOperation(operation)) {
                      if (idRef.current) {
                        dndManager.beginDrag(idRef.current, op, x, y, pageX, pageY);
                      }
                    } else {
                      operationChangeEvents = {
                        begin: [x, y, pageX, pageY],
                        drag: [x, y, pageX, pageY]
                      };
                    }
                  }
                })
              )
              .on(
                'end',
                action(() => {
                  operationChangeEvents = undefined;
                  operation = undefined;
                  d3.select(ownerDocument).on(createKeyHandlerId(), null);
                  if (dndManager.isDragging()) {
                    dndManager.drop();
                    dndManager.endDrag();
                  }
                })
              )
              .filter((event: MouseEvent) => !event.ctrlKey && !event.button && dndManager.canDragSource(idRef.current))
          );
        }
        return () => {
          if (node) {
            d3.select(node).on('.drag', null);
          }
        };
      },
      [dndManager, monitor, createKeyHandlerId]
    )
  );

  useEffect(() => {
    const dragSource: DragSource = {
      type: spec.item.type,
      canCancel: () => {
        if (typeof specRef.current.canCancel === 'boolean') {
          return specRef.current.canCancel;
        }
        if (typeof specRef.current.canCancel === 'function') {
          return specRef.current.canCancel(monitor, propsRef.current);
        }
        return true;
      },
      canDrag: () => {
        if (typeof specRef.current.canDrag === 'boolean') {
          return specRef.current.canDrag;
        }
        if (typeof specRef.current.canDrag === 'function') {
          return specRef.current.canDrag(monitor, propsRef.current);
        }
        return true;
      },
      beginDrag: () => (specRef.current.begin ? specRef.current.begin(monitor, propsRef.current) : undefined),
      drag: () => {
        if (specRef.current.drag) {
          const event = monitor.getDragEvent();
          if (event) {
            specRef.current.drag(event, monitor, propsRef.current);
          }
        }
      },
      endDrag: () =>
        specRef.current.end ? specRef.current.end(monitor.getDropResult(), monitor, propsRef.current) : undefined
    };
    const [sourceId, unregister] = dndManager.registerSource(dragSource);
    monitor.receiveHandlerId(sourceId);
    return unregister;
  }, [spec.item.type, dndManager, monitor]);

  const collected = useMemo(
    () =>
      computed(() => (spec.collect ? spec.collect(monitor, propsRef.current) : ({} as any as CollectedProps)), {
        equals: comparer.shallow
      }),
    [monitor, spec]
  );

  return [collected.get(), refCallback];
};

export interface WithDndDragProps {
  dndDragRef?: ConnectDragSource;
}

export const withDndDrag =
  <
    DragObject extends DragObjectWithType = DragObjectWithType,
    DropResult = any,
    CollectedProps extends {} = {},
    Props extends {} = {}
  >(
    spec: DragSourceSpec<DragObject, DragSpecOperationType<DragOperationWithType>, DropResult, CollectedProps, Props>
  ) =>
  <P extends WithDndDragProps & CollectedProps & Props>(WrappedComponent: React.ComponentType<P>) => {
    const Component: React.FunctionComponent<Omit<P, keyof WithDndDragProps & CollectedProps>> = (props) => {
      // TODO fix cast to any
      const [dndDragProps, dndDragRef] = useDndDrag(spec, props as any);
      return <WrappedComponent {...(props as any)} {...dndDragProps} dndDragRef={dndDragRef} />;
    };
    Component.displayName = `withDndDrag(${WrappedComponent.displayName || WrappedComponent.name})`;
    return observer(Component);
  };
