import { createContext, useContext } from 'react';
import { Node } from '@patternfly/react-topology';

export interface AggregateEdgesDemoContextValue {
  onCollapseChange: (group: Node, collapsed: boolean) => void;
}

const AggregateEdgesDemoContext = createContext<AggregateEdgesDemoContextValue>({
  onCollapseChange: () => undefined
});

export const AggregateEdgesDemoProvider = AggregateEdgesDemoContext.Provider;

export const useAggregateEdgesDemo = (): AggregateEdgesDemoContextValue => useContext(AggregateEdgesDemoContext);
