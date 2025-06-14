import { ShapeProps, useCombineRefs, useSvgAnchor } from '@patternfly/react-topology';

const Path: React.FunctionComponent<ShapeProps> = ({ className, width, height, filter, dndDropRef }) => {
  const anchorRef = useSvgAnchor();
  const refs = useCombineRefs<SVGPathElement>(dndDropRef, anchorRef);

  return (
    <path
      className={className}
      ref={refs}
      d={`M0 0 L${width / 2} ${height / 4} L${width} 0 L${width} ${height} L${width / 2} ${
        height - height / 4
      } L0 ${height} Z`}
      filter={filter}
    />
  );
};

export default Path;
