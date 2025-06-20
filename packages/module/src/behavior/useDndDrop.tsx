import { useRef, useMemo, useContext, useEffect } from 'react';
import * as d3 from 'd3';
import { observer } from 'mobx-react';
import { pointInSvgPath } from 'point-in-svg-path';
import { comparer, computed } from 'mobx';
import ElementContext from '../utils/ElementContext';
import Point from '../geom/Point';
import { GraphElement } from '../types';
import {
  ConnectDropTarget,
  DropTargetSpec,
  DropTargetMonitor,
  Identifier,
  DragEvent,
  DropTarget,
  DragOperationWithType
} from './dnd-types';
import { useDndManager } from './useDndManager';

const EMPTY_PROPS = Object.freeze({});

export const useDndDrop = <
  DragObject,
  DropResult = GraphElement,
  CollectedProps extends {} = {},
  Props extends {} = {}
>(
  spec: DropTargetSpec<DragObject, DropResult, CollectedProps, Props>,
  props?: Props
): [CollectedProps, ConnectDropTarget] => {
  const specRef = useRef(spec);
  specRef.current = spec;

  const propsRef = useRef(props != null ? props : (EMPTY_PROPS as Props));
  propsRef.current = props != null ? props : (EMPTY_PROPS as Props);

  const dndManager = useDndManager();

  const nodeRef = useRef<SVGElement | null>(null);
  const idRef = useRef<string | null>(null);

  const monitor = useMemo((): DropTargetMonitor => {
    const targetMonitor: DropTargetMonitor = {
      getHandlerId: (): string | undefined => idRef.current,
      receiveHandlerId: (sourceId: string | undefined): void => {
        idRef.current = sourceId;
      },
      canDrop: (): boolean => dndManager.canDropOnTarget(idRef.current),
      isDragging: (): boolean => dndManager.isDragging(),
      hasDropTarget: (): boolean => dndManager.hasDropTarget(),
      getDropHints: (): string[] => dndManager.getDropHints(),
      isOver(options?: { shallow?: boolean }): boolean {
        return dndManager.isOverTarget(idRef.current, options);
      },
      getItemType: (): Identifier | undefined => dndManager.getItemType(),
      getItem: (): any => dndManager.getItem(),
      getDropResult: (): any => dndManager.getDropResult(),
      didDrop: (): boolean => dndManager.didDrop(),
      getDragEvent: (): DragEvent | undefined => dndManager.getDragEvent(),
      getOperation: (): DragOperationWithType | undefined => dndManager.getOperation(),
      isCancelled: (): boolean => dndManager.isCancelled()
    };
    return targetMonitor;
  }, [dndManager]);

  const element = useContext(ElementContext);
  const elementRef = useRef(element);
  elementRef.current = element;

  useEffect(() => {
    const dropTarget: DropTarget = {
      type: spec.accept,
      dropHint: () => {
        if (typeof specRef.current.dropHint === 'string') {
          return specRef.current.dropHint;
        }
        if (typeof specRef.current.dropHint === 'function') {
          return specRef.current.dropHint(monitor.getItem(), monitor, propsRef.current);
        }
        return elementRef.current.getType();
      },
      hitTest: (x: number, y: number) => {
        if (specRef.current.hitTest) {
          return specRef.current.hitTest(x, y, propsRef.current);
        }
        if (nodeRef.current) {
          if (!(nodeRef.current instanceof SVGGraphicsElement)) {
            return false;
          }

          // Rounding the coordinates due to an issue with `point-in-svg-path` returning false
          // when the coordinates clearly are within the path.
          const point = Point.singleUse(Math.round(x), Math.round(y));
          // Translate to this element's coordinates.
          // Assumes the node is not within an svg element containing another transform.
          elementRef.current.translateFromAbsolute(point);

          // perform a fast bounds check
          const { x: bboxx, y: bboxy, width, height } = nodeRef.current.getBBox();
          if (point.x < bboxx || point.x > bboxx + width || point.y < bboxy || point.y > bboxy + height) {
            return false;
          }

          if (nodeRef.current instanceof SVGPathElement) {
            const d = nodeRef.current.getAttribute('d');
            return pointInSvgPath(d, point.x, point.y);
          }
          if (nodeRef.current instanceof SVGCircleElement) {
            const { cx, cy, r } = nodeRef.current;
            return Math.sqrt((point.x - cx.animVal.value) ** 2 + (point.y - cy.animVal.value) ** 2) < r.animVal.value;
          }
          if (nodeRef.current instanceof SVGEllipseElement) {
            const { cx, cy, rx, ry } = nodeRef.current;
            return (
              (point.x - cx.animVal.value) ** 2 / rx.animVal.value ** 2 +
                (point.y - cy.animVal.value) ** 2 / ry.animVal.value ** 2 <=
              1
            );
          }
          if (nodeRef.current instanceof SVGPolygonElement) {
            const arr = (nodeRef.current.getAttribute('points') || '')
              .replace(/,/g, ' ')
              .split(' ')
              .map((s) => +s);
            const points: [number, number][] = [];
            for (let i = 0; i < arr.length; i += 2) {
              points.push(arr.slice(i, i + 2) as [number, number]);
            }
            return d3.polygonContains(points, [point.x, point.y]);
          }
          // TODO support round rect

          // already passed the bbox test
          return true;
        }
        return false;
      },
      hover: () => {
        specRef.current.hover && specRef.current.hover(monitor.getItem(), monitor, propsRef.current);
      },
      canDrop: () => {
        if (typeof specRef.current.canDrop === 'boolean') {
          return specRef.current.canDrop;
        }
        if (typeof specRef.current.canDrop === 'function') {
          return specRef.current.canDrop(monitor.getItem(), monitor, propsRef.current);
        }
        return true;
      },
      drop: () => {
        if (specRef.current.drop) {
          return specRef.current.drop(monitor.getItem(), monitor, propsRef.current);
        }
        if (!monitor.didDrop()) {
          return elementRef.current;
        }
        return undefined;
      }
    };
    const [targetId, unregister] = dndManager.registerTarget(dropTarget);
    monitor.receiveHandlerId(targetId);
    return unregister;
  }, [spec.accept, dndManager, monitor]);

  const collected = useMemo(
    () =>
      computed(() => (spec.collect ? spec.collect(monitor, propsRef.current) : ({} as any as CollectedProps)), {
        equals: comparer.shallow
      }),
    [monitor, spec]
  );

  return [collected.get(), nodeRef as any];
};

export interface WithDndDropProps {
  dndDropRef?: ConnectDropTarget;
}

export const withDndDrop =
  <DragObject, DropResult = GraphElement, CollectedProps extends {} = {}, Props extends {} = {}>(
    spec: DropTargetSpec<DragObject, DropResult, CollectedProps, Props>
  ) =>
  <P extends WithDndDropProps & CollectedProps & Props>(WrappedComponent: React.ComponentType<P>) => {
    const Component: React.FunctionComponent<Omit<P, keyof WithDndDropProps & CollectedProps>> = (props) => {
      // TODO fix cast to any
      const [dndDropProps, dndDropRef] = useDndDrop(spec, props as any);
      return <WrappedComponent {...(props as any)} {...dndDropProps} dndDropRef={dndDropRef} />;
    };
    Component.displayName = `withDndDrop(${WrappedComponent.displayName || WrappedComponent.name})`;
    return observer(Component);
  };
