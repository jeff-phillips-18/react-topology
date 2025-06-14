import { useState, useCallback } from 'react';
import { observer } from 'mobx-react';
import { Edge } from '../types';
import DefaultRemoveConnector from '../components/DefaultRemoveConnector';

interface ElementProps {
  element: Edge;
}

export interface WithRemoveConnectorProps {
  onShowRemoveConnector?: () => void;
  onHideRemoveConnector?: () => void;
}

type RemoveRenderer = (edge: Edge, onRemove: (e: Edge) => void, size?: number) => React.ReactElement;

const defaultRenderRemove: RemoveRenderer = (edge: Edge, onRemove: (e: Edge) => void) => {
  const removeEdge = () => {
    onRemove(edge);
  };

  return (
    <DefaultRemoveConnector startPoint={edge.getStartPoint()} endPoint={edge.getEndPoint()} onRemove={removeEdge} />
  );
};

export const withRemoveConnector =
  <P extends WithRemoveConnectorProps & ElementProps>(
    onRemove: (edge: Edge) => void,
    renderRemove: RemoveRenderer = defaultRenderRemove
  ) =>
  (WrappedComponent: React.ComponentType<P>) => {
    const Component: React.FunctionComponent<Omit<P, keyof WithRemoveConnectorProps>> = (props) => {
      const [show, setShow] = useState(false);
      const onShowRemoveConnector = useCallback(() => setShow(true), []);
      const onHideRemoveConnector = useCallback(() => setShow(false), []);

      return (
        <WrappedComponent
          {...(props as any)}
          onShowRemoveConnector={onShowRemoveConnector}
          onHideRemoveConnector={onHideRemoveConnector}
        >
          {show && renderRemove(props.element, onRemove)}
        </WrappedComponent>
      );
    };
    Component.displayName = `withRemoveConnector(${WrappedComponent.displayName || WrappedComponent.name})`;
    return observer(Component);
  };
