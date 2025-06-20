import { useMemo, useCallback, useState } from 'react';
import {
  DefaultNode,
  Model,
  ModelKind,
  withDragNode,
  useComponentFactory,
  useModel,
  ComponentFactory
} from '@patternfly/react-topology';
import defaultComponentFactory from '../components/defaultComponentFactory';
import withTopologySetup from '../utils/withTopologySetup';
import CustomCircleNode from '../components/CustomCircleNode';
import CustomRectNode from '../components/CustomRectNode';
import { Tab, Tabs, TabTitleText } from '@patternfly/react-core';

export const SingleNode = withTopologySetup(() => {
  useComponentFactory(defaultComponentFactory);
  useModel(
    useMemo(
      (): Model => ({
        graph: {
          id: 'g1',
          type: 'graph'
        },
        nodes: [
          {
            id: 'n1',
            type: 'node',
            x: 50,
            y: 50,
            width: 20,
            height: 20
          }
        ]
      }),
      []
    )
  );
  return null;
});

export const SingleEdge = withTopologySetup(() => {
  useComponentFactory(defaultComponentFactory);
  useModel(
    useMemo(
      (): Model => ({
        graph: {
          id: 'g1',
          type: 'graph'
        },
        nodes: [
          {
            id: 'n1',
            type: 'node',
            x: 20,
            y: 20,
            width: 20,
            height: 20
          },
          {
            id: 'n2',
            type: 'node',
            x: 200,
            y: 50,
            width: 100,
            height: 30
          }
        ],
        edges: [
          {
            id: 'e1',
            type: 'edge',
            source: 'n1',
            target: 'n2',
            bendpoints: [
              [80, 30],
              [110, 10]
            ]
          }
        ]
      }),
      []
    )
  );
  return null;
});

export const MultiEdge = withTopologySetup(() => {
  useComponentFactory(defaultComponentFactory);
  useComponentFactory(
    useCallback<ComponentFactory>((kind) => {
      if (kind === ModelKind.node) {
        return withDragNode()(DefaultNode);
      }
      return undefined;
    }, [])
  );
  useModel(
    useMemo(
      (): Model => ({
        graph: {
          id: 'g1',
          type: 'graph'
        },
        nodes: [
          {
            id: 'n1',
            type: 'node',
            x: 50,
            y: 50,
            width: 100,
            height: 100
          },
          {
            id: 'n2',
            type: 'node',
            x: 400,
            y: 50,
            width: 100,
            height: 100
          },
          {
            id: 'n3',
            type: 'node',
            x: 50,
            y: 200,
            width: 100,
            height: 100
          },
          {
            id: 'n4',
            type: 'node',
            x: 400,
            y: 200,
            width: 100,
            height: 100
          }
        ],
        edges: [
          {
            id: 'e1',
            type: 'multi-edge',
            source: 'n1',
            target: 'n2'
          },
          {
            id: 'e2',
            type: 'multi-edge',
            source: 'n1',
            target: 'n2'
          },
          {
            id: 'e3',
            type: 'multi-edge',
            source: 'n3',
            target: 'n4'
          },
          {
            id: 'e4',
            type: 'multi-edge',
            source: 'n3',
            target: 'n4'
          },
          {
            id: 'e5',
            type: 'multi-edge',
            source: 'n3',
            target: 'n4'
          },
          {
            id: 'e6',
            type: 'multi-edge',
            source: 'n3',
            target: 'n4'
          },
          {
            id: 'e7',
            type: 'multi-edge',
            source: 'n3',
            target: 'n4'
          }
        ]
      }),
      []
    )
  );
  return null;
});

const groupStory =
  (groupType: string): React.FunctionComponent =>
  () => {
    useComponentFactory(defaultComponentFactory);
    useModel(
      useMemo(
        (): Model => ({
          graph: {
            id: 'g1',
            type: 'graph'
          },
          nodes: [
            {
              id: 'gr1',
              type: groupType,
              group: true,
              children: ['n1', 'n2', 'n3'],
              style: {
                padding: 10
              }
            },
            {
              id: 'n1',
              type: 'node',
              x: 50,
              y: 50,
              width: 30,
              height: 30
            },
            {
              id: 'n2',
              type: 'node',
              x: 200,
              y: 20,
              width: 10,
              height: 10
            },
            {
              id: 'n3',
              type: 'node',
              x: 150,
              y: 100,
              width: 20,
              height: 20
            }
          ]
        }),
        []
      )
    );
    return null;
  };

export const Group = withTopologySetup(groupStory('group'));
export const GroupHull = withTopologySetup(groupStory('group-hull'));

export const AutoSizeNode = withTopologySetup(() => {
  useComponentFactory(defaultComponentFactory);
  useComponentFactory(
    useCallback<ComponentFactory>((kind, type) => {
      if (type === 'autoSize-circle') {
        return CustomCircleNode;
      }
      if (type === 'autoSize-rect') {
        return CustomRectNode;
      }
      return undefined;
    }, [])
  );
  useModel(
    useMemo(
      (): Model => ({
        graph: {
          id: 'g1',
          type: 'graph'
        },
        nodes: [
          {
            id: 'n1',
            type: 'autoSize-rect',
            x: 50,
            y: 50
          },

          {
            id: 'n2',
            type: 'autoSize-circle',
            x: 250,
            y: 200
          },

          {
            id: 'n3',
            type: 'autoSize-rect',
            x: 300,
            y: 70
          },
          {
            id: 'gr1',
            type: 'group',
            group: true,
            children: ['n1', 'n3'],
            style: {
              padding: 10
            }
          }
        ],
        edges: [
          {
            id: 'e1',
            type: 'edge',
            source: 'n1',
            target: 'n2'
          },
          {
            id: 'e2',
            type: 'edge',
            source: 'gr1',
            target: 'n2'
          }
        ]
      }),
      []
    )
  );
  return null;
});

export const Basics: React.FunctionComponent = () => {
  const [activeKey, setActiveKey] = useState<string | number>(0);

  const handleTabClick = (_event: React.MouseEvent<HTMLElement, MouseEvent>, tabIndex: string | number) => {
    setActiveKey(tabIndex);
  };

  return (
    <div className="pf-ri__topology-demo">
      <Tabs unmountOnExit activeKey={activeKey} onSelect={handleTabClick}>
        <Tab eventKey={0} title={<TabTitleText>Single Node</TabTitleText>}>
          <SingleNode />
        </Tab>
        <Tab eventKey={1} title={<TabTitleText>Single Edge</TabTitleText>}>
          <SingleEdge />
        </Tab>
        <Tab eventKey={2} title={<TabTitleText>Multi Edge</TabTitleText>}>
          <MultiEdge />
        </Tab>
        <Tab eventKey={3} title={<TabTitleText>Group</TabTitleText>}>
          <Group />
        </Tab>
        <Tab eventKey={4} title={<TabTitleText>Group Hull</TabTitleText>}>
          <GroupHull />
        </Tab>
        <Tab eventKey={5} title={<TabTitleText>Auto Size Node</TabTitleText>}>
          <AutoSizeNode />
        </Tab>
      </Tabs>
    </div>
  );
};
