import { useContext, useCallback } from 'react';
import { action } from 'mobx';
import { isNode, AnchorEnd } from '../types';
import ElementContext from '../utils/ElementContext';
import SVGAnchor from '../anchors/SVGAnchor';

export type SvgAnchorRef = (node: SVGElement | null) => void;

export const useSvgAnchor = (
  end: AnchorEnd = AnchorEnd.both,
  type: string = ''
): ((node: SVGElement | null) => void) => {
  const element = useContext(ElementContext);
  if (!isNode(element)) {
    throw new Error('useSvgAnchor must be used within the scope of a Node');
  }

  return useCallback<SvgAnchorRef>(
    (node: SVGElement | null) => {
      const actionFn = action((node: SVGElement | null) => {
        if (node) {
          const anchor = new SVGAnchor(element);
          anchor.setSVGElement(node);
          element.setAnchor(anchor, end, type);
        }
      });
      actionFn(node);
    },
    [element, type, end]
  );
};

export interface WithSvgAnchorProps {
  svgAnchorRef: SvgAnchorRef;
}

export const withSvgAnchor =
  (end?: AnchorEnd, type?: string) =>
  <P extends WithSvgAnchorProps>() =>
  (WrappedComponent: React.ComponentType<P>) => {
    const Component: React.FunctionComponent<Omit<P, keyof WithSvgAnchorProps>> = (props) => {
      const svgAnchorRef = useSvgAnchor(end, type);
      return <WrappedComponent {...(props as any)} svgAnchorRef={svgAnchorRef} />;
    };
    Component.displayName = `withSvgAnchor(${WrappedComponent.displayName || WrappedComponent.name})`;
    return Component;
  };
