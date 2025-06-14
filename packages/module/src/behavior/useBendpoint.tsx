import { useContext, useRef, useMemo, useCallback } from 'react';
import { action } from 'mobx';
import * as d3 from 'd3';
import { observer } from 'mobx-react';
import Point from '../geom/Point';
import ElementContext from '../utils/ElementContext';
import { isEdge } from '../types';
import {
  ConnectDragSource,
  DragSourceSpec,
  DragObjectWithType,
  DragSpecOperationType,
  DragOperationWithType
} from './dnd-types';
import { useDndDrag, WithDndDragProps } from './useDndDrag';

export const useBendpoint = <DropResult, CollectedProps, Props = {}>(
  point: Point,
  spec?: Omit<
    DragSourceSpec<DragObjectWithType, DragSpecOperationType<DragOperationWithType>, DropResult, CollectedProps>,
    'type'
  >,
  props?: Props
): [CollectedProps, ConnectDragSource] => {
  const element = useContext(ElementContext);
  if (!isEdge(element)) {
    throw new Error('useBendpoint must be used within the scope of an Edge');
  }
  const elementRef = useRef(element);
  elementRef.current = element;
  const pointRef = useRef(point);
  pointRef.current = point;

  const [connect, dragRef] = useDndDrag(
    useMemo(() => {
      const sourceSpec: DragSourceSpec<any, any, any, any, Props> = {
        item: { type: '#useBendpoint#' },
        begin: (monitor, p) => (spec && spec.begin ? spec.begin(monitor, p) : undefined),
        drag: (event, monitor, p) => {
          // assumes the edge is in absolute coordinate space
          pointRef.current.translate(event.dx, event.dy);
          elementRef.current.raise();
          spec && spec.drag && spec.drag(event, monitor, p);
        },
        canDrag: spec ? spec.canDrag : undefined,
        end: spec ? spec.end : undefined,
        collect: spec ? spec.collect : undefined
      };
      return sourceSpec;
    }, [spec]),
    props
  );

  // argh react events don't play nice with d3 pan zoom double click event
  const ref = useCallback<ConnectDragSource>(
    (node) => {
      d3.select(node).on(
        'click',
        action((event: MouseEvent) => {
          if (event.shiftKey) {
            event.stopPropagation();
            elementRef.current.removeBendpoint(pointRef.current);
          }
        })
      );
      dragRef(node);
    },
    [dragRef]
  );
  return [connect, ref];
};

interface HocProps {
  point: Point;
}

export interface WithBendpointProps {
  dragNodeRef: WithDndDragProps['dndDragRef'];
}

export const withBendpoint =
  <DropResult, CollectedProps, Props = {}>(
    spec?: Omit<
      DragSourceSpec<
        DragObjectWithType,
        DragSpecOperationType<DragOperationWithType>,
        DropResult,
        CollectedProps,
        Props
      >,
      'type'
    >
  ) =>
  <P extends WithBendpointProps & CollectedProps & Props>(WrappedComponent: React.ComponentType<P>) => {
    const Component: React.FunctionComponent<Omit<P, keyof WithBendpointProps> & HocProps> = (props) => {
      const [dragProps, bendpointRef] = useBendpoint(props.point, spec as any, props);
      return <WrappedComponent {...(props as any)} bendpointRef={bendpointRef} {...(dragProps as object)} />;
    };
    Component.displayName = `withBendpoint(${WrappedComponent.displayName || WrappedComponent.name})`;
    return observer(Component);
  };
