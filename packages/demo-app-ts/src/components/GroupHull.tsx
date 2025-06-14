import { useRef } from 'react';
import { observer } from 'mobx-react';
import { polygonHull } from 'd3-polygon';
import {
  WithDragNodeProps,
  WithSelectionProps,
  Layer,
  Node,
  PointTuple,
  NodeStyle,
  NodeShape,
  WithDndDragProps,
  WithDndDropProps,
  useCombineRefs,
  maxPadding,
  hullPath,
  useAnchor,
  RectAnchor,
  GraphElement
} from '@patternfly/react-topology';

type GroupHullProps = {
  children?: React.ReactNode;
  element: GraphElement;
  droppable?: boolean;
  hover?: boolean;
  canDrop?: boolean;
} & WithSelectionProps &
  WithDragNodeProps &
  WithDndDragProps &
  WithDndDropProps;

type PointWithSize = PointTuple | [number, number, number];

const GroupHull: React.FunctionComponent<GroupHullProps> = ({
  element,
  children,
  selected,
  onSelect,
  dragNodeRef,
  dndDragRef,
  dndDropRef,
  hover,
  droppable,
  canDrop
}) => {
  const nodeElement = element as Node;
  const pathRef = useRef<string | null>(null);
  const refs = useCombineRefs<SVGPathElement | SVGRectElement>(dragNodeRef, dndDragRef, dndDropRef);
  useAnchor(RectAnchor);

  let fill = '#ededed';
  if (canDrop && hover) {
    fill = 'lightgreen';
  } else if (canDrop && droppable) {
    fill = 'lightblue';
  } else if (element.getData()) {
    fill = element.getData().background;
  }

  if (nodeElement.isCollapsed()) {
    const { width, height } = nodeElement.getBounds();
    return (
      <g>
        <rect
          ref={refs}
          x={0}
          y={0}
          width={width}
          height={height}
          rx={5}
          ry={5}
          fill={fill}
          strokeWidth={2}
          stroke={selected ? 'blue' : '#cdcdcd'}
        />
      </g>
    );
  }

  if (!droppable || !pathRef.current) {
    const nodeChildren = nodeElement.getNodes();
    if (nodeChildren.length === 0) {
      return null;
    }
    const points: PointWithSize[] = [];
    nodeChildren.forEach((c) => {
      if (c.getNodeShape() === NodeShape.ellipse) {
        const { width, height } = c.getBounds();
        const { x, y } = c.getBounds().getCenter();
        const radius = Math.max(width, height) / 2;
        points.push([x, y, radius] as PointWithSize);
      } else {
        // add all 4 corners
        const { width, height, x, y } = c.getBounds();
        points.push([x, y, 0] as PointWithSize);
        points.push([x + width, y, 0] as PointWithSize);
        points.push([x, y + height, 0] as PointWithSize);
        points.push([x + width, y + height, 0] as PointWithSize);
      }
    });
    const hullPoints: PointTuple[] | null =
      points.length > 2 ? polygonHull(points as PointTuple[]) : (points as PointTuple[]);
    if (!hullPoints) {
      return null;
    }
    // cast to number and coerce
    const padding = maxPadding(element.getStyle<NodeStyle>().padding);
    const hullPadding = (point: PointWithSize) => (point[2] || 0) + padding;
    // change the box only when not dragging
    pathRef.current = hullPath(hullPoints, hullPadding);
  }

  return (
    <Layer id="groups">
      <path
        ref={refs}
        onClick={onSelect}
        d={pathRef.current}
        fill={fill}
        strokeWidth={2}
        stroke={selected ? 'blue' : '#cdcdcd'}
      />
      {children}
    </Layer>
  );
};

export default observer(GroupHull);
