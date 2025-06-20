import { observer } from 'mobx-react';
import { Edge, vecSum, vecScale, unitNormal, GraphElement } from '@patternfly/react-topology';

interface MultiEdgeProps {
  element: GraphElement;
  dragging?: boolean;
}

// TODO create utiles to support this
const MultiEdge: React.FunctionComponent<MultiEdgeProps> = ({ element }) => {
  const edgeElement = element as Edge;
  let idx = 0;
  let sum = 0;
  element
    .getGraph()
    .getEdges()
    .forEach((e) => {
      if (e === element) {
        idx = sum;
        sum++;
      } else if (e.getSource() === edgeElement.getSource() && e.getTarget() === edgeElement.getTarget()) {
        sum++;
      }
    });
  let d: string;
  const startPoint = edgeElement.getStartPoint();
  const endPoint = edgeElement.getEndPoint();
  if (idx === sum - 1 && sum % 2 === 1) {
    d = `M${startPoint.x} ${startPoint.y} L${endPoint.x} ${endPoint.y}`;
  } else {
    const pm = vecSum(
      [startPoint.x + (endPoint.x - startPoint.x) / 2, startPoint.y + (endPoint.y - startPoint.y) / 2],
      vecScale(
        (idx % 2 === 1 ? 25 : -25) * Math.ceil((idx + 1) / 2),
        unitNormal([startPoint.x, startPoint.y], [endPoint.x, endPoint.y])
      )
    );
    d = `M${startPoint.x} ${startPoint.y} Q${pm[0]} ${pm[1]} ${endPoint.x} ${endPoint.y}`;
  }

  return <path strokeWidth={2} stroke="#8d8d8d" d={d} fill="none" />;
};

export default observer(MultiEdge) as React.FunctionComponent<MultiEdgeProps>;
