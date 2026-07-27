import { FunctionComponent } from 'react';
import { observer } from 'mobx-react';
import { DefaultGroup, GraphElement, WithDragNodeProps, WithSelectionProps } from '@patternfly/react-topology';
import { useAggregateEdgesDemo } from './DemoContext';

type AggregateGroupProps = {
  element: GraphElement;
} & WithDragNodeProps &
  WithSelectionProps;

const COLLAPSED_SIZE = 60;

/**
 * Collapsible group built on DefaultGroup so expand/collapse uses the built-in
 * chrome (rather than external toolbar toggles). Collapse notifies the demo so
 * aggregate edges can be rebuilt from leaf edges.
 */
const AggregateGroup: FunctionComponent<AggregateGroupProps> = observer(({ element, ...rest }) => {
  const { onCollapseChange } = useAggregateEdgesDemo();
  const data = element.getData() || {};
  // Omit demo-only / DefaultGroup-managed keys from the data spread.
  const groupData = { ...data };
  delete groupData.background;
  delete groupData.collapsible;
  return (
    <DefaultGroup
      element={element}
      collapsible
      // Rect outline → RectAnchor (O(1)). Hull SVG sampling is too expensive under Cola ticks.
      hulledOutline={false}
      collapsedWidth={data.collapsedWidth ?? COLLAPSED_SIZE}
      collapsedHeight={data.collapsedHeight ?? COLLAPSED_SIZE}
      onCollapseChange={onCollapseChange}
      {...rest}
      {...groupData}
    />
  );
});

export default AggregateGroup;
