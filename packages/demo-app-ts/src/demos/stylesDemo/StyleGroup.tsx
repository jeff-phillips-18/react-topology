import { useMemo } from 'react';
import {
  DefaultGroup,
  GraphElement,
  Node,
  observer,
  ScaleDetailsLevel,
  ShapeProps,
  WithContextMenuProps,
  WithDragNodeProps,
  WithSelectionProps
} from '@patternfly/react-topology';
import AlternateIcon from '@patternfly/react-icons/dist/esm/icons/regions-icon';
import DefaultIcon from '@patternfly/react-icons/dist/esm/icons/builder-image-icon';

const ICON_PADDING = 20;

export enum DataTypes {
  Default,
  Alternate
}

type StyleGroupProps = {
  element: GraphElement;
  collapsible?: boolean;
  collapsedWidth?: number;
  collapsedHeight?: number;
  onCollapseChange?: (group: Node, collapsed: boolean) => void;
  getCollapsedShape?: (node: Node) => React.FunctionComponent<ShapeProps>;
  collapsedShadowOffset?: number; // defaults to 10
} & WithContextMenuProps &
  WithDragNodeProps &
  WithSelectionProps;

const StyleGroup: React.FunctionComponent<StyleGroupProps> = ({
  element,
  onContextMenu,
  contextMenuOpen,
  collapsedWidth = 75,
  collapsedHeight = 75,
  ...rest
}) => {
  const groupElement = element as Node;
  const data = element.getData();
  const detailsLevel = element.getGraph().getDetailsLevel();

  const getTypeIcon = (dataType?: DataTypes): any => {
    switch (dataType) {
      case DataTypes.Alternate:
        return AlternateIcon;
      default:
        return DefaultIcon;
    }
  };

  const renderIcon = (): React.ReactNode => {
    const iconSize = Math.min(collapsedWidth, collapsedHeight) - ICON_PADDING * 2;
    const Component = getTypeIcon(data.dataType);

    return (
      <g transform={`translate(${(collapsedWidth - iconSize) / 2}, ${(collapsedHeight - iconSize) / 2})`}>
        <Component style={{ color: '#393F44' }} width={iconSize} height={iconSize} />
      </g>
    );
  };

  const passedData = useMemo(() => {
    const newData = { ...data };
    Object.keys(newData).forEach((key) => {
      if (newData[key] === undefined) {
        delete newData[key];
      }
    });
    return newData;
  }, [data]);

  return (
    <DefaultGroup
      onContextMenu={data.showContextMenu ? onContextMenu : undefined}
      contextMenuOpen={contextMenuOpen}
      element={element}
      collapsible
      collapsedWidth={collapsedWidth}
      collapsedHeight={collapsedHeight}
      showLabel={detailsLevel === ScaleDetailsLevel.high}
      {...rest}
      {...passedData}
    >
      {groupElement.isCollapsed() ? renderIcon() : null}
    </DefaultGroup>
  );
};

export default observer(StyleGroup);
