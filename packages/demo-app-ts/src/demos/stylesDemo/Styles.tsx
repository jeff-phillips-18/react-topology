import { useMemo, useState } from 'react';
import { Tab, Tabs, TabTitleText } from '@patternfly/react-core';
import {
  BadgeLocation,
  EdgeModel,
  EdgeStyle,
  EdgeTerminalType,
  LabelPosition,
  Model,
  NodeModel,
  NodeShape,
  NodeStatus,
  useComponentFactory,
  useModel
} from '@patternfly/react-topology';
import withTopologySetup from '../../utils/withTopologySetup';
import defaultComponentFactory from '../../components/defaultComponentFactory';
import stylesComponentFactory from './stylesComponentFactory';
import { logos } from '../../utils/logos';
import {
  AlternateTerminalTypes,
  createBadgeNodes,
  createGroupedGroupNodes,
  createGroupNodes,
  createNode,
  createStatusNodeShapes,
  createUnGroupedGroupNodes,
  EDGE_ANIMATION_SPEED_COUNT,
  EDGE_ANIMATION_SPEEDS,
  EDGE_STYLE_COUNT,
  EDGE_STYLES,
  EDGE_TERMINAL_TYPES,
  EDGE_TERMINAL_TYPES_COUNT,
  RIGHT_LABEL_COLUMN_WIDTH,
  STATUS_VALUES
} from './styleUtils';
import { DataTypes } from './StyleNode';

export const NodeStyles = withTopologySetup(() => {
  useComponentFactory(defaultComponentFactory);
  useComponentFactory(stylesComponentFactory);
  useModel(
    useMemo(
      (): Model => ({
        graph: {
          id: 'g1',
          type: 'graph'
        },
        nodes: createStatusNodeShapes()
      }),
      []
    )
  );
  return null;
});

export const NodeHoverStyles = withTopologySetup(() => {
  useComponentFactory(defaultComponentFactory);
  useComponentFactory(stylesComponentFactory);
  useModel(
    useMemo(
      (): Model => ({
        graph: {
          id: 'g1',
          type: 'graph'
        },
        nodes: createStatusNodeShapes(1, '', undefined, true)
      }),
      []
    )
  );
  return null;
});

export const NodeSelectedStyles = withTopologySetup(() => {
  useComponentFactory(defaultComponentFactory);
  useComponentFactory(stylesComponentFactory);
  useModel(
    useMemo(
      (): Model => ({
        graph: {
          id: 'g1',
          type: 'graph'
        },
        nodes: createStatusNodeShapes(1, '', true)
      }),
      []
    )
  );
  return null;
});

export const NodeStatusDecoratorStyles = withTopologySetup(() => {
  useComponentFactory(defaultComponentFactory);
  useComponentFactory(stylesComponentFactory);
  useModel(
    useMemo(
      (): Model => ({
        graph: {
          id: 'g1',
          type: 'graph'
        },
        nodes: createStatusNodeShapes(1, '', undefined, undefined, LabelPosition.bottom, true, 'Tooltip Text')
      }),
      []
    )
  );
  return null;
});

export const NodeDecoratorStyles = withTopologySetup(() => {
  useComponentFactory(defaultComponentFactory);
  useComponentFactory(stylesComponentFactory);
  const nodes: NodeModel[] = createGroupNodes();
  const nodes2: NodeModel[] = createGroupNodes('2', 600);

  nodes.forEach((n) => (n.data.showDecorators = true));
  nodes.forEach((n) => (n.data.labelPosition = LabelPosition.bottom));
  nodes2.forEach((n) => (n.data.showDecorators = true));
  useModel(
    useMemo(
      (): Model => ({
        graph: {
          id: 'g1',
          type: 'graph'
        },
        nodes: [...nodes, ...nodes2]
      }),
      [nodes, nodes2]
    )
  );
  return null;
});

export const NodeLabelStyles = withTopologySetup(() => {
  useComponentFactory(defaultComponentFactory);
  useComponentFactory(stylesComponentFactory);
  useModel(
    useMemo(
      (): Model => ({
        graph: {
          id: 'g1',
          type: 'graph'
        },
        nodes: createStatusNodeShapes(1, 'Node Title')
      }),
      []
    )
  );
  return null;
});

export const NodeLabelHoverStyles = withTopologySetup(() => {
  useComponentFactory(defaultComponentFactory);
  useComponentFactory(stylesComponentFactory);
  useModel(
    useMemo(
      (): Model => ({
        graph: {
          id: 'g1',
          type: 'graph'
        },
        nodes: createStatusNodeShapes(1, 'Node Title', undefined, true)
      }),
      []
    )
  );
  return null;
});

export const NodeLabelSelectedStyles = withTopologySetup(() => {
  useComponentFactory(defaultComponentFactory);
  useComponentFactory(stylesComponentFactory);
  useModel(
    useMemo(
      (): Model => ({
        graph: {
          id: 'g1',
          type: 'graph'
        },
        nodes: createStatusNodeShapes(1, 'Node Title', true)
      }),
      []
    )
  );
  return null;
});

export const NodeHorizontalLabelStyles = withTopologySetup(() => {
  useComponentFactory(defaultComponentFactory);
  useComponentFactory(stylesComponentFactory);
  useModel(
    useMemo(
      (): Model => ({
        graph: {
          id: 'g1',
          type: 'graph'
        },
        nodes: createStatusNodeShapes(1, 'Node Title', undefined, undefined, LabelPosition.right)
      }),
      []
    )
  );
  return null;
});

export const NodeBadgedLabelStyles = withTopologySetup(() => {
  useComponentFactory(defaultComponentFactory);
  useComponentFactory(stylesComponentFactory);
  useModel(
    useMemo(
      (): Model => ({
        graph: {
          id: 'g1',
          type: 'graph'
        },
        nodes: [
          ...createBadgeNodes({ row: 1, badge: 'C' }),
          ...createBadgeNodes({ row: 2, badge: 'CS', hover: true }),
          ...createBadgeNodes({ row: 3, badge: 'CSN', selected: true }),
          ...createBadgeNodes({ row: 4, badge: 'CSNY', badgeLocation: BadgeLocation.below })
        ]
      }),
      []
    )
  );
  return null;
});

export const NodeContextMenuLabelStyles = withTopologySetup(() => {
  useComponentFactory(defaultComponentFactory);
  useComponentFactory(stylesComponentFactory);
  useModel(
    useMemo(
      (): Model => ({
        graph: {
          id: 'g1',
          type: 'graph'
        },
        nodes: [
          ...createBadgeNodes({ row: 1, badge: 'C', showContextMenu: true }),
          ...createBadgeNodes({ row: 2, badge: 'CS', hover: true, showContextMenu: true }),
          ...createBadgeNodes({ row: 3, badge: 'CSN', selected: true, showContextMenu: true })
        ]
      }),
      []
    )
  );
  return null;
});

export const NodeIconLabelStyles = withTopologySetup(() => {
  useComponentFactory(defaultComponentFactory);
  useComponentFactory(stylesComponentFactory);
  useModel(
    useMemo(
      (): Model => ({
        graph: {
          id: 'g1',
          type: 'graph'
        },
        nodes: [
          ...createBadgeNodes({
            row: 1,
            badge: 'C',
            showContextMenu: true,
            showIconClass: true,
            marginX: 100
          }),
          ...createBadgeNodes({
            row: 2,
            badge: 'CS',
            hover: true,
            showContextMenu: true,
            showIconClass: true,
            marginX: 100
          }),
          ...createBadgeNodes({
            row: 3,
            badge: 'CSN',
            selected: true,
            showContextMenu: true,
            showIconClass: true,
            marginX: 100
          })
        ]
      }),
      []
    )
  );
  return null;
});

export const NodeSecondaryLabelStyles = withTopologySetup(() => {
  useComponentFactory(defaultComponentFactory);
  useComponentFactory(stylesComponentFactory);
  const nodes = Object.values(NodeStatus).reduce((nodes: NodeModel[], status: NodeStatus, index) => {
    nodes.push(
      createNode({
        id: `${status}-secondary`,
        status,
        label: 'Primary Label',
        secondaryLabel: 'Secondary Label',
        labelPosition: LabelPosition.bottom,
        row: 1,
        column: index + 1,
        x: index * RIGHT_LABEL_COLUMN_WIDTH,
        truncateLength: 13
      })
    );
    nodes.push(
      createNode({
        id: `${status}-secondary-selected`,
        status,
        label: 'Primary Label',
        selected: true,
        secondaryLabel: 'Selected Label',
        labelPosition: LabelPosition.bottom,
        row: 2,
        column: index + 1,
        x: index * RIGHT_LABEL_COLUMN_WIDTH,
        truncateLength: 13
      })
    );
    nodes.push(
      createNode({
        id: `${status}-secondary-long`,
        status,
        label: 'Primary Label',
        secondaryLabel: 'Very Long Secondary Label',
        labelPosition: LabelPosition.bottom,
        row: 3,
        column: index + 1,
        x: index * RIGHT_LABEL_COLUMN_WIDTH,
        truncateLength: 13
      })
    );
    nodes.push(
      createNode({
        id: `${status}-secondary-long-badged`,
        label: 'Label Bottom',
        secondaryLabel: 'Very Long Secondary Label',
        status,
        row: 4,
        column: index + 1,
        x: index * (RIGHT_LABEL_COLUMN_WIDTH + 45),
        labelIconClass: logos.get('icon-java'),
        truncateLength: 13,
        badge: 'CS',
        hover: true,
        showContextMenu: true,
        badgeColor: '#ace12e',
        badgeTextColor: '#486b00',
        badgeBorderColor: '#486b00',
        marginX: 100
      })
    );
    return nodes;
  }, []);

  useModel({
    graph: {
      id: 'g1',
      type: 'graph'
    },
    nodes
  });
  return null;
});

export const GroupStyles = withTopologySetup(() => {
  useComponentFactory(defaultComponentFactory);
  useComponentFactory(stylesComponentFactory);
  const nodes: NodeModel[] = createGroupNodes();

  const groupNode = {
    id: 'Group 1',
    type: 'group',
    label: 'Node Group Title',
    children: nodes.map((n) => n.id),
    group: true,
    style: { padding: 17 },
    data: {
      badge: 'Label',
      badgeColor: '#F2F0FC',
      badgeTextColor: '#5752d1',
      badgeBorderColor: '#CBC1FF',
      labelIconClass: logos.get('icon-java'),
      collapsedWidth: 75,
      collapsedHeight: 75,
      showContextMenu: true
    }
  };

  useModel({
    graph: {
      id: 'g1',
      type: 'graph'
    },
    nodes: [...nodes, groupNode]
  });
  return null;
});

export const GroupHoverStyles = withTopologySetup(() => {
  useComponentFactory(defaultComponentFactory);
  useComponentFactory(stylesComponentFactory);
  const nodes: NodeModel[] = createGroupNodes();

  const groupNode = {
    id: 'Group 1',
    type: 'group',
    label: 'Node Group Title',
    children: nodes.map((n) => n.id),
    group: true,
    style: { padding: 17 },
    data: {
      badge: 'Label',
      badgeColor: '#F2F0FC',
      badgeTextColor: '#5752d1',
      badgeBorderColor: '#CBC1FF',
      labelIconClass: logos.get('icon-java'),
      collapsedWidth: 75,
      collapsedHeight: 75,
      hover: true
    }
  };

  useModel({
    graph: {
      id: 'g1',
      type: 'graph'
    },
    nodes: [...nodes, groupNode]
  });
  return null;
});

export const GroupSelectedStyles = withTopologySetup(() => {
  useComponentFactory(defaultComponentFactory);
  useComponentFactory(stylesComponentFactory);
  const nodes: NodeModel[] = createGroupNodes();

  const groupNode = {
    id: 'Group 1',
    type: 'group',
    label: 'Node Group Title',
    children: nodes.map((n) => n.id),
    group: true,
    style: { padding: 17 },
    data: {
      badge: 'Label',
      badgeColor: '#F2F0FC',
      badgeTextColor: '#5752d1',
      badgeBorderColor: '#CBC1FF',
      labelIconClass: logos.get('icon-java'),
      collapsedWidth: 75,
      collapsedHeight: 75,
      selected: true
    }
  };

  useModel({
    graph: {
      id: 'g1',
      type: 'graph'
    },
    nodes: [...nodes, groupNode]
  });
  return null;
});

export const GroupDropTargetStyles = withTopologySetup(() => {
  useComponentFactory(defaultComponentFactory);
  useComponentFactory(stylesComponentFactory);
  const nodes: NodeModel[] = createGroupNodes();

  const groupNode = {
    id: 'Group 1',
    type: 'group',
    label: 'Node Group Title',
    children: nodes.map((n) => n.id),
    group: true,
    style: { padding: 17 },
    data: {
      badge: 'Label',
      badgeColor: '#F2F0FC',
      badgeTextColor: '#5752d1',
      badgeBorderColor: '#CBC1FF',
      labelIconClass: logos.get('icon-java'),
      collapsedWidth: 75,
      collapsedHeight: 75,
      canDrop: true,
      dropTarget: true
    }
  };

  useModel({
    graph: {
      id: 'g1',
      type: 'graph'
    },
    nodes: [...nodes, groupNode]
  });
  return null;
});

export const GroupedGroupsStyles = withTopologySetup(() => {
  useComponentFactory(defaultComponentFactory);
  useComponentFactory(stylesComponentFactory);
  const groupedGroupNodes: NodeModel[] = createGroupedGroupNodes('GroupedGroup');
  const ungroupedGroupNodes: NodeModel[] = createUnGroupedGroupNodes('Group 1');

  const groupNode = {
    id: 'Group 1',
    type: 'group',
    label: 'Node Group Title',
    children: ['GroupedGroup', ...ungroupedGroupNodes.map((n) => n.id)],
    group: true,
    style: { padding: 17 },
    data: {
      badge: 'Label',
      badgeColor: '#F2F0FC',
      badgeTextColor: '#5752d1',
      badgeBorderColor: '#CBC1FF',
      collapsedWidth: 75,
      collapsedHeight: 75,
      showContextMenu: true,
      labelIconClass: logos.get('icon-java')
    }
  };

  const groupedGroupNodes2: NodeModel[] = createGroupedGroupNodes('GroupedGroup2', 500);
  const ungroupedGroupNodes2: NodeModel[] = createUnGroupedGroupNodes('Group 2', 500);

  const groupNode2 = {
    id: 'Group 2',
    type: 'group',
    label: 'Node Group Title',
    children: ['GroupedGroup2', ...ungroupedGroupNodes2.map((n) => n.id)],
    group: true,
    style: { padding: 17 },
    data: {
      badge: 'Label',
      badgeColor: '#F2F0FC',
      badgeTextColor: '#5752d1',
      badgeBorderColor: '#CBC1FF',
      collapsedWidth: 75,
      collapsedHeight: 75,
      selected: true,
      showContextMenu: true,
      labelIconClass: logos.get('icon-jenkins')
    }
  };

  useModel({
    graph: {
      id: 'g1',
      type: 'graph'
    },
    nodes: [
      ...groupedGroupNodes,
      ...ungroupedGroupNodes,
      groupNode,
      ...groupedGroupNodes2,
      ...ungroupedGroupNodes2,
      groupNode2
    ]
  });
  return null;
});

export const CollapsibleGroupStyles = withTopologySetup(() => {
  useComponentFactory(defaultComponentFactory);
  useComponentFactory(stylesComponentFactory);
  const nodes: NodeModel[] = createGroupNodes('Group 1');
  const nodes2: NodeModel[] = createGroupNodes('Group 2', 600);

  const groupNode = {
    id: 'Group 1',
    type: 'group',
    label: 'Node Group Title',
    children: nodes.map((n) => n.id),
    group: true,
    style: { padding: 17 },
    data: {
      badge: 'Label',
      badgeColor: '#F2F0FC',
      badgeTextColor: '#5752d1',
      badgeBorderColor: '#CBC1FF',
      labelIconClass: logos.get('icon-jenkins'),
      collapsedWidth: 75,
      collapsedHeight: 75,
      showContextMenu: true,
      collapsible: true
    }
  };

  const groupNode2: NodeModel = {
    id: 'Group 2',
    type: 'group',
    label: 'Node Group Title',
    children: nodes2.map((n) => n.id),
    group: true,
    style: { padding: 17 },
    collapsed: true,
    data: {
      badge: 'Label',
      badgeColor: '#F2F0FC',
      badgeTextColor: '#5752d1',
      badgeBorderColor: '#CBC1FF',
      labelIconClass: logos.get('icon-java'),
      collapsedWidth: 75,
      collapsedHeight: 75,
      showContextMenu: true,
      collapsible: true
    }
  };

  useModel({
    graph: {
      id: 'g1',
      type: 'graph'
    },
    nodes: [...nodes, groupNode, ...nodes2, groupNode2]
  });
  return null;
});

export const EdgeStyles = withTopologySetup(() => {
  useComponentFactory(defaultComponentFactory);
  useComponentFactory(stylesComponentFactory);
  const nodes: NodeModel[] = createGroupNodes('edges-group');
  const edges: EdgeModel[] = [];

  const middleNodeIndex = nodes.length - 1;
  nodes.forEach((item, index) => {
    if (index === middleNodeIndex) {
      return;
    }
    const endIndex = index < nodes.length - 2 ? index + 1 : 0;
    edges.push({
      id: `edge-${index}-${endIndex}`,
      type: 'edge',
      source: nodes[index].id,
      target: nodes[endIndex].id,
      edgeStyle: EDGE_STYLES[index % EDGE_STYLE_COUNT]
    });
    edges.push({
      id: `edge-${middleNodeIndex}-${index}`,
      type: 'edge',
      source: nodes[middleNodeIndex].id,
      target: nodes[index].id,
      edgeStyle: EdgeStyle.default
    });
  });

  useModel({
    graph: {
      id: 'g1',
      type: 'graph'
    },
    nodes,
    edges
  });
  return null;
});

export const EdgeAnimationStyles = withTopologySetup(() => {
  useComponentFactory(defaultComponentFactory);
  useComponentFactory(stylesComponentFactory);
  const nodes: NodeModel[] = createGroupNodes('animation-edges-group');
  const edges: EdgeModel[] = [];

  const middleNodeIndex = nodes.length - 1;
  nodes.forEach((item, index) => {
    if (index === middleNodeIndex) {
      return;
    }
    const endIndex = index < nodes.length - 2 ? index + 1 : 0;
    edges.push({
      id: `animation-edge-${index}-${endIndex}`,
      type: 'edge',
      source: nodes[index].id,
      target: nodes[endIndex].id,
      edgeStyle: EdgeStyle.dashedMd,
      animationSpeed: EDGE_ANIMATION_SPEEDS[index % EDGE_ANIMATION_SPEED_COUNT]
    });
    edges.push({
      id: `animation-edge-${middleNodeIndex}-${index}`,
      type: 'edge',
      source: nodes[middleNodeIndex].id,
      target: nodes[index].id,
      edgeStyle: EdgeStyle.default
    });
  });

  useModel({
    graph: {
      id: 'g1',
      type: 'graph'
    },
    nodes,
    edges
  });
  return null;
});

export const EdgeTerminalStyles = withTopologySetup(() => {
  useComponentFactory(defaultComponentFactory);
  useComponentFactory(stylesComponentFactory);
  const nodes: NodeModel[] = createGroupNodes('animation-edges-group');
  const edges: EdgeModel[] = [];

  const middleNodeIndex = nodes.length - 1;
  nodes.forEach((item, index) => {
    if (index === middleNodeIndex) {
      return;
    }
    const endIndex = index < nodes.length - 2 ? index + 1 : 0;
    const endTerminalType = EDGE_TERMINAL_TYPES[(index + 1) % EDGE_TERMINAL_TYPES_COUNT];
    const startTerminalType = AlternateTerminalTypes.includes(endTerminalType)
      ? endTerminalType
      : EdgeTerminalType.none;
    edges.push({
      id: `animation-edge-${index}-${endIndex}`,
      type: 'edge',
      source: nodes[index].id,
      target: nodes[endIndex].id,
      edgeStyle: EdgeStyle.dashedMd,
      animationSpeed: EDGE_ANIMATION_SPEEDS[index % EDGE_ANIMATION_SPEED_COUNT],
      data: { startTerminalType, endTerminalType }
    });
    edges.push({
      id: `animation-edge-${middleNodeIndex}-${index}`,
      type: 'edge',
      source: nodes[middleNodeIndex].id,
      target: nodes[index].id,
      edgeStyle: EdgeStyle.default,
      data: {
        startTerminalType: endTerminalType,
        endTerminalType: EdgeTerminalType.directional
      }
    });
  });

  useModel({
    graph: {
      id: 'g1',
      type: 'graph'
    },
    nodes,
    edges
  });
  return null;
});

export const EdgeTerminalStatusStyles = withTopologySetup(() => {
  useComponentFactory(defaultComponentFactory);
  useComponentFactory(stylesComponentFactory);
  const nodes: NodeModel[] = [];
  const edges: EdgeModel[] = [];

  STATUS_VALUES.forEach((status, statusIndex) => {
    if (status === NodeStatus.default) {
      return;
    }
    EDGE_TERMINAL_TYPES.forEach((terminalType, typeIndex) => {
      if (terminalType === EdgeTerminalType.none) {
        return;
      }
      const n1 = createNode({
        id: `${terminalType}--${status}-1`,
        shape: NodeShape.ellipse,
        label: 'Node 1',
        row: typeIndex,
        column: statusIndex * 3 - 2
      });
      const n2 = createNode({
        id: `${terminalType}-${status}-1`,
        shape: NodeShape.ellipse,
        dataType: DataTypes.Alternate,
        label: 'Node 1',
        row: typeIndex,
        column: statusIndex * 3
      });
      nodes.push(n1);
      nodes.push(n2);
      edges.push({
        id: `edge-${n1.id}-${n2.id}`,
        type: 'edge',
        source: n1.id,
        target: n2.id,
        edgeStyle: EdgeStyle.default,
        data: {
          startTerminalType: terminalType,
          startTerminalStatus: STATUS_VALUES[statusIndex],
          endTerminalType: terminalType,
          endTerminalStatus: STATUS_VALUES[statusIndex]
        }
      });
    });
  });

  useModel({
    graph: {
      id: 'g1',
      type: 'graph'
    },
    nodes,
    edges
  });
  return null;
});

export const EdgeTerminalTagStyles = withTopologySetup(() => {
  useComponentFactory(defaultComponentFactory);
  useComponentFactory(stylesComponentFactory);
  const nodes: NodeModel[] = [];
  const edges: EdgeModel[] = [];

  STATUS_VALUES.forEach((status, statusIndex) => {
    const n1 = createNode({
      id: `${status}-1`,
      shape: NodeShape.ellipse,
      label: 'Node 1',
      row: statusIndex + 1,
      column: 1
    });
    const n2 = createNode({
      id: `${status}-2`,
      shape: NodeShape.ellipse,
      dataType: DataTypes.Alternate,
      label: 'Node 1',
      row: statusIndex + 1,
      column: 4
    });
    nodes.push(n1);
    nodes.push(n2);
    edges.push({
      id: `edge-${n1.id}-${n2.id}`,
      type: 'edge',
      source: n1.id,
      target: n2.id,
      edgeStyle: EdgeStyle.default,
      data: {
        endTerminalType: EdgeTerminalType.directional,
        tag: '250 kbs',
        tagStatus: status
      }
    });
  });

  useModel({
    graph: {
      id: 'g1',
      type: 'graph'
    },
    nodes,
    edges
  });
  return null;
});

export const StyleNodes: React.FunctionComponent = () => {
  const [activeKey, setActiveKey] = useState<string | number>(0);

  const handleTabClick = (_event: React.MouseEvent<HTMLElement, MouseEvent>, tabIndex: string | number) => {
    setActiveKey(tabIndex);
  };

  return (
    <div className="pf-ri__topology-demo">
      <Tabs unmountOnExit activeKey={activeKey} onSelect={handleTabClick}>
        <Tab eventKey={0} title={<TabTitleText>Nodes</TabTitleText>}>
          <NodeStyles />
        </Tab>
        <Tab eventKey={1} title={<TabTitleText>Hover Nodes</TabTitleText>}>
          <NodeHoverStyles />
        </Tab>
        <Tab eventKey={2} title={<TabTitleText>Selected Nodes</TabTitleText>}>
          <NodeSelectedStyles />
        </Tab>
        <Tab eventKey={3} title={<TabTitleText>Status Decorators</TabTitleText>}>
          <NodeStatusDecoratorStyles />
        </Tab>
        <Tab eventKey={4} title={<TabTitleText>Decorators</TabTitleText>}>
          <NodeDecoratorStyles />
        </Tab>
      </Tabs>
    </div>
  );
};

export const StyleLabels: React.FunctionComponent = () => {
  const [activeKey, setActiveKey] = useState<string | number>(0);

  const handleTabClick = (_event: React.MouseEvent<HTMLElement, MouseEvent>, tabIndex: string | number) => {
    setActiveKey(tabIndex);
  };

  return (
    <div className="pf-ri__topology-demo">
      <Tabs unmountOnExit activeKey={activeKey} onSelect={handleTabClick}>
        <Tab eventKey={0} title={<TabTitleText>Node Labels</TabTitleText>}>
          <NodeLabelStyles />
        </Tab>
        <Tab eventKey={1} title={<TabTitleText>Hover Labels</TabTitleText>}>
          <NodeLabelHoverStyles />
        </Tab>
        <Tab eventKey={2} title={<TabTitleText>Selected Labels</TabTitleText>}>
          <NodeLabelSelectedStyles />
        </Tab>
        <Tab eventKey={3} title={<TabTitleText>Horizontal Labels</TabTitleText>}>
          <NodeHorizontalLabelStyles />
        </Tab>
        <Tab eventKey={4} title={<TabTitleText>Badged Labels</TabTitleText>}>
          <NodeBadgedLabelStyles />
        </Tab>
        <Tab eventKey={5} title={<TabTitleText>Context Menu Labels</TabTitleText>}>
          <NodeContextMenuLabelStyles />
        </Tab>
        <Tab eventKey={6} title={<TabTitleText>Icon Labels</TabTitleText>}>
          <NodeIconLabelStyles />
        </Tab>
        <Tab eventKey={7} title={<TabTitleText>Secondary Labels</TabTitleText>}>
          <NodeSecondaryLabelStyles />
        </Tab>
      </Tabs>
    </div>
  );
};

export const StyleGroups: React.FunctionComponent = () => {
  const [activeKey, setActiveKey] = useState<string | number>(0);

  const handleTabClick = (_event: React.MouseEvent<HTMLElement, MouseEvent>, tabIndex: string | number) => {
    setActiveKey(tabIndex);
  };

  return (
    <div className="pf-ri__topology-demo">
      <Tabs unmountOnExit activeKey={activeKey} onSelect={handleTabClick}>
        <Tab eventKey={0} title={<TabTitleText>Group</TabTitleText>}>
          <GroupStyles />
        </Tab>
        <Tab eventKey={1} title={<TabTitleText>Hover Group</TabTitleText>}>
          <GroupHoverStyles />
        </Tab>
        <Tab eventKey={2} title={<TabTitleText>Selected Group</TabTitleText>}>
          <GroupSelectedStyles />
        </Tab>
        <Tab eventKey={3} title={<TabTitleText>Drop Target Group</TabTitleText>}>
          <GroupDropTargetStyles />
        </Tab>
        <Tab eventKey={4} title={<TabTitleText>Grouped Groups</TabTitleText>}>
          <GroupedGroupsStyles />
        </Tab>
        <Tab eventKey={5} title={<TabTitleText>Collapsible Groups</TabTitleText>}>
          <CollapsibleGroupStyles />
        </Tab>
      </Tabs>
    </div>
  );
};

export const StyleEdges: React.FunctionComponent = () => {
  const [activeKey, setActiveKey] = useState<string | number>(0);

  const handleTabClick = (_event: React.MouseEvent<HTMLElement, MouseEvent>, tabIndex: string | number) => {
    setActiveKey(tabIndex);
  };

  return (
    <div className="pf-ri__topology-demo">
      <Tabs unmountOnExit activeKey={activeKey} onSelect={handleTabClick}>
        <Tab eventKey={0} title={<TabTitleText>Edge Styles</TabTitleText>}>
          <EdgeStyles />
        </Tab>
        <Tab eventKey={1} title={<TabTitleText>Animated Edges</TabTitleText>}>
          <EdgeAnimationStyles />
        </Tab>
        <Tab eventKey={2} title={<TabTitleText>Edge Terminal Types</TabTitleText>}>
          <EdgeTerminalStyles />
        </Tab>
        <Tab eventKey={3} title={<TabTitleText>Edge Terminal Status</TabTitleText>}>
          <EdgeTerminalStatusStyles />
        </Tab>
        <Tab eventKey={4} title={<TabTitleText>Edge Terminal Tags</TabTitleText>}>
          <EdgeTerminalTagStyles />
        </Tab>
      </Tabs>
    </div>
  );
};
