import { FunctionComponent } from 'react';
import { observer } from 'mobx-react';
import { DefaultEdge, GraphElement, WithSelectionProps } from '@patternfly/react-topology';

type LabeledDefaultEdgeProps = {
  element: GraphElement;
} & WithSelectionProps;

/**
 * Leaf (non-aggregate) edge that shows a custom label or metric tag when present.
 */
const LabeledDefaultEdge: FunctionComponent<LabeledDefaultEdgeProps> = observer(({ element, ...rest }) => {
  const label = element.getLabel();
  const metricTag = element.getData()?.tag as string | undefined;
  return <DefaultEdge element={element} {...rest} tag={label || metricTag || undefined} />;
});

export default LabeledDefaultEdge;
