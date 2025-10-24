import { useCallback, useMemo } from 'react';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  BackgroundVariant,
} from 'reactflow';
import type { Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import { mockGroupContagionNetwork } from '../lib/mockData';
import { formatCurrency } from '../lib/utils';

// Custom node component for better styling
const CustomNode = ({ data }: { data: any }) => {
  const isGroup = data.type === 'group';
  const riskLevel = data.pd > 0.025 ? 'high' : data.pd > 0.018 ? 'medium' : 'low';

  const borderColor = {
    high: 'border-red-500',
    medium: 'border-orange-500',
    low: 'border-green-500',
  }[riskLevel];

  const bgColor = {
    high: 'bg-red-50',
    medium: 'bg-orange-50',
    low: 'bg-green-50',
  }[riskLevel];

  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 ${borderColor} ${bgColor} shadow-md min-w-[180px] ${
        isGroup ? 'font-bold' : ''
      }`}
    >
      <div className="text-sm font-semibold text-gray-900 mb-1">{data.label}</div>
      <div className="text-xs text-gray-600 space-y-0.5">
        <div>Exposure: {formatCurrency(data.exposure * 1000000)}</div>
        <div>PD: {(data.pd * 100).toFixed(2)}%</div>
        <div>LGD: {(data.lgd * 100).toFixed(0)}%</div>
        <div className="font-medium text-gray-800">
          EL: {formatCurrency(data.exposure * data.pd * data.lgd * 1000000)}
        </div>
      </div>
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

export default function GroupContagionGraph() {
  // Convert mock data to ReactFlow format
  const initialNodes: Node[] = useMemo(() => {
    // Create a hierarchical layout
    const groups = mockGroupContagionNetwork.nodes.filter((n) => n.type === 'group');
    const borrowers = mockGroupContagionNetwork.nodes.filter((n) => n.type === 'borrower');

    const nodes: Node[] = [];

    // Position groups in a row at the top
    groups.forEach((group, index) => {
      const nodeSize = Math.sqrt(group.exposure) * 2; // Size based on exposure
      nodes.push({
        id: group.id,
        type: 'custom',
        position: { x: index * 350, y: 0 },
        data: {
          label: group.name,
          exposure: group.exposure,
          type: group.type,
          pd: group.pd,
          lgd: group.lgd,
        },
        style: {
          width: Math.max(nodeSize, 180),
        },
      });
    });

    // Position borrowers below their parent groups or independently
    let xOffset = 0;
    let independentX = 0;

    borrowers.forEach((borrower) => {
      // Find parent group
      const parentLink = mockGroupContagionNetwork.links.find(
        (link) => link.target === borrower.id && link.relationship === 'parent'
      );

      let x, y;
      if (parentLink) {
        // Position under parent group
        const parentNode = nodes.find((n) => n.id === parentLink.source);
        if (parentNode) {
          const childrenCount = mockGroupContagionNetwork.links.filter(
            (l) => l.source === parentLink.source && l.relationship === 'parent'
          ).length;
          const childIndex = mockGroupContagionNetwork.links
            .filter((l) => l.source === parentLink.source && l.relationship === 'parent')
            .findIndex((l) => l.target === borrower.id);

          x = parentNode.position.x - ((childrenCount - 1) * 120) / 2 + childIndex * 120;
          y = 250;
        } else {
          x = xOffset;
          y = 250;
          xOffset += 200;
        }
      } else {
        // Independent borrower
        x = independentX;
        y = 500;
        independentX += 250;
      }

      const nodeSize = Math.sqrt(borrower.exposure) * 1.8;
      nodes.push({
        id: borrower.id,
        type: 'custom',
        position: { x, y },
        data: {
          label: borrower.name,
          exposure: borrower.exposure,
          type: borrower.type,
          pd: borrower.pd,
          lgd: borrower.lgd,
        },
        style: {
          width: Math.max(nodeSize, 160),
        },
      });
    });

    return nodes;
  }, []);

  const initialEdges: Edge[] = useMemo(() => {
    return mockGroupContagionNetwork.links.map((link, index) => {
      const edgeStyle =
        link.relationship === 'parent'
          ? { stroke: '#3b82f6', strokeWidth: 2 }
          : { stroke: '#f59e0b', strokeWidth: 2, strokeDasharray: '5,5' };

      return {
        id: `edge-${index}`,
        source: link.source,
        target: link.target,
        type: 'smoothstep',
        animated: link.relationship === 'common_promoter',
        style: edgeStyle,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: link.relationship === 'parent' ? '#3b82f6' : '#f59e0b',
        },
        label: link.relationship === 'common_promoter' ? 'Common Promoter' : '',
        labelStyle: { fontSize: 10, fill: '#6b7280' },
        labelBgStyle: { fill: '#fff', fillOpacity: 0.8 },
      };
    });
  }, []);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    console.log('Node clicked:', node.data.label);
    // TODO: Navigate to company profile or show details modal
  }, []);

  // Calculate portfolio-level metrics
  const totalExposure = mockGroupContagionNetwork.nodes.reduce((sum, node) => sum + node.exposure, 0);
  const totalEL = mockGroupContagionNetwork.nodes.reduce(
    (sum, node) => sum + node.exposure * node.pd * node.lgd,
    0
  );
  const groupExposure = mockGroupContagionNetwork.nodes
    .filter((n) => n.type === 'group')
    .reduce((sum, node) => sum + node.exposure, 0);

  return (
    <div className="bg-white rounded-lg p-6 border border-oracle-border">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Group Contagion Risk Network
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Visualizing interconnected exposures and group relationships. Node size represents
          exposure; color indicates risk level (green=low, orange=medium, red=high).
        </p>

        {/* Summary Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="text-xs text-blue-700 font-medium mb-1">Total Exposure</div>
            <div className="text-lg font-bold text-blue-900">
              {formatCurrency(totalExposure * 1000000)}
            </div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <div className="text-xs text-purple-700 font-medium mb-1">Group Exposure</div>
            <div className="text-lg font-bold text-purple-900">
              {formatCurrency(groupExposure * 1000000)}
            </div>
            <div className="text-xs text-purple-600">
              {((groupExposure / totalExposure) * 100).toFixed(1)}% of total
            </div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <div className="text-xs text-orange-700 font-medium mb-1">Expected Loss</div>
            <div className="text-lg font-bold text-orange-900">
              {formatCurrency(totalEL * 1000000)}
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="text-xs text-green-700 font-medium mb-1">Concentration Index</div>
            <div className="text-lg font-bold text-green-900">
              {mockGroupContagionNetwork.concentrationIndex.toFixed(3)}
            </div>
            <div className="text-xs text-green-600">HHI Score</div>
          </div>
        </div>
      </div>

      {/* ReactFlow Graph */}
      <div style={{ height: '600px' }} className="border border-gray-200 rounded-lg">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-left"
        >
          <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#e5e7eb" />
          <Controls />
        </ReactFlow>
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-between text-xs">
        <div className="flex items-center gap-6">
          <span className="font-medium text-gray-700">Node Colors:</span>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 border-green-500 bg-green-50"></div>
            <span className="text-gray-600">Low Risk (PD &lt; 1.8%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 border-orange-500 bg-orange-50"></div>
            <span className="text-gray-600">Medium Risk (PD 1.8-2.5%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 border-red-500 bg-red-50"></div>
            <span className="text-gray-600">High Risk (PD &gt; 2.5%)</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <span className="font-medium text-gray-700">Connections:</span>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-blue-500"></div>
            <span className="text-gray-600">Parent-Subsidiary</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-orange-500" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #f59e0b, #f59e0b 5px, transparent 5px, transparent 10px)' }}></div>
            <span className="text-gray-600">Common Promoter</span>
          </div>
        </div>
      </div>

      {/* Key Insights */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="text-sm font-semibold text-yellow-900 mb-2">Contagion Risk Insights</h4>
        <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
          <li>
            <strong>Tata Group</strong> has highest group exposure at {formatCurrency(5000 * 1000000)} with 3 subsidiaries
          </li>
          <li>
            <strong>Adani Group</strong> shows elevated risk with average PD of 2.77% across entities
          </li>
          <li>
            <strong>Cross-holdings detected</strong> between Reliance-Bharti and Tata-Birla creating potential contagion paths
          </li>
          <li>
            <strong>Concentration concern</strong>: Top 5 groups represent{' '}
            {((groupExposure / totalExposure) * 100).toFixed(1)}% of portfolio exposure
          </li>
        </ul>
      </div>
    </div>
  );
}
