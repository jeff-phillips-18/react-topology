import { createContext, useContext } from 'react';
import { Node } from '@patternfly/react-topology';

export interface AggregateEdgesDemoContextValue {
  onCollapseChange: (group: Node, collapsed: boolean) => void;
  /** Bumped after layout end / collapse so AggregateEdge force-resnaps. */
  snapGeneration: number;
}

const AggregateEdgesDemoContext = createContext<AggregateEdgesDemoContextValue>({
  onCollapseChange: () => undefined,
  snapGeneration: 0
});

export const AggregateEdgesDemoProvider = AggregateEdgesDemoContext.Provider;

export const useAggregateEdgesDemo = (): AggregateEdgesDemoContextValue => useContext(AggregateEdgesDemoContext);
