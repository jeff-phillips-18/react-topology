import { useContext, useCallback, useEffect } from 'react';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react';
import { isNode, Anchor, Node, AnchorEnd } from '../types';
import ElementContext from '../utils/ElementContext';

type AnchorConstructor = new (element?: Node) => Anchor;

export const useAnchor = (
  anchorCallback: ((element: Node) => Anchor | undefined) | AnchorConstructor,
  end: AnchorEnd = AnchorEnd.both,
  type?: string
): void => {
  const element = useContext(ElementContext);
  if (!isNode(element)) {
    throw new Error('useAnchor must be used within the scope of a Node');
  }
  useEffect(() => {
    runInAction(() => {
      const anchor = anchorCallback.prototype ? new (anchorCallback as any)(element) : (anchorCallback as any)(element);
      if (anchor) {
        element.setAnchor(anchor, end, type);
      }
    });
  }, [anchorCallback, element, end, type]);
};

export const withAnchor =
  <P extends {} = {}>(anchor: Anchor, end?: AnchorEnd, type?: string) =>
  (WrappedComponent: React.ComponentType<P>) => {
    const Component: React.FunctionComponent<P> = (props) => {
      useAnchor(
        useCallback(() => anchor, []),
        end,
        type
      );
      return <WrappedComponent {...props} />;
    };
    Component.displayName = `withAnchor(${WrappedComponent.displayName || WrappedComponent.name})`;
    return observer(Component);
  };
