import { css } from '@patternfly/react-styles';
import styles from '../../../css/topology-components';
import { useMemo } from 'react';
import { getPathForSides, getPointsForSides, ShapeProps } from './shapeUtils';
import { usePolygonAnchor } from '../../../behavior';

type SidedProps = ShapeProps & {
  sides?: number;
  cornerRadius?: number;
};

const SidedShape: React.FunctionComponent<SidedProps> = ({
  className = css(styles.topologyNodeBackground),
  width,
  height,
  filter,
  sides = 6,
  cornerRadius = 0,
  dndDropRef
}) => {
  const [polygonPoints, points] = useMemo(() => {
    const polygonPoints = getPointsForSides(sides, Math.min(width, height));
    return [
      polygonPoints,
      cornerRadius
        ? getPathForSides(sides, Math.min(width, height), cornerRadius)
        : polygonPoints.map((p) => `${p[0]},${p[1]}`).join(' ')
    ];
  }, [cornerRadius, height, sides, width]);

  usePolygonAnchor(polygonPoints);

  return cornerRadius ? (
    <path className={className} ref={dndDropRef} d={points} filter={filter} />
  ) : (
    <polygon className={className} ref={dndDropRef} points={points} filter={filter} />
  );
};

export default SidedShape;
