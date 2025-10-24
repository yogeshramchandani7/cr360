import { useState, useMemo } from 'react';
import { mockExposureFlowData } from '../lib/mockData';
import { formatCurrency } from '../lib/utils';

interface SankeyNode {
  id: string;
  name: string;
  category: 'product' | 'rating' | 'region';
  color: string;
  x: number;
  y: number;
  height: number;
  value: number;
}

interface SankeyLink {
  source: string;
  target: string;
  value: number;
  y0: number;
  y1: number;
}

export default function ExposureFlowSankey() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [hoveredLink, setHoveredLink] = useState<{ source: string; target: string } | null>(null);

  const width = 1000;
  const height = 600;
  const padding = { top: 40, right: 120, bottom: 40, left: 120 };
  const nodeWidth = 20;
  const nodePadding = 10;

  // Calculate node positions and dimensions
  const { nodes, links } = useMemo(() => {
    // Group nodes by category
    const productNodes = mockExposureFlowData.nodes.filter((n) => n.category === 'product');
    const ratingNodes = mockExposureFlowData.nodes.filter((n) => n.category === 'rating');
    const regionNodes = mockExposureFlowData.nodes.filter((n) => n.category === 'region');

    // Calculate total values for each node
    const nodeValues = new Map<string, number>();
    mockExposureFlowData.links.forEach((link) => {
      nodeValues.set(link.source, (nodeValues.get(link.source) || 0) + link.value);
      nodeValues.set(link.target, (nodeValues.get(link.target) || 0) + link.value);
    });

    // Calculate available height for nodes
    const availableHeight = height - padding.top - padding.bottom;
    const totalValue = Math.max(...Array.from(nodeValues.values()));

    // Position products at left
    const layoutNodes: SankeyNode[] = [];
    const columnWidth = (width - padding.left - padding.right - nodeWidth * 3) / 2;

    let yOffset = padding.top;
    productNodes.forEach((node) => {
      const nodeValue = nodeValues.get(node.id) || 0;
      const nodeHeight = (nodeValue / totalValue) * availableHeight * 0.8;
      layoutNodes.push({
        ...node,
        x: padding.left,
        y: yOffset,
        height: nodeHeight,
        value: nodeValue,
      });
      yOffset += nodeHeight + nodePadding;
    });

    // Position ratings in middle
    yOffset = padding.top;
    ratingNodes.forEach((node) => {
      const nodeValue = nodeValues.get(node.id) || 0;
      const nodeHeight = (nodeValue / totalValue) * availableHeight * 0.8;
      layoutNodes.push({
        ...node,
        x: padding.left + columnWidth + nodeWidth,
        y: yOffset,
        height: nodeHeight,
        value: nodeValue,
      });
      yOffset += nodeHeight + nodePadding;
    });

    // Position regions at right
    yOffset = padding.top;
    regionNodes.forEach((node) => {
      const nodeValue = nodeValues.get(node.id) || 0;
      const nodeHeight = (nodeValue / totalValue) * availableHeight * 0.8;
      layoutNodes.push({
        ...node,
        x: padding.left + columnWidth * 2 + nodeWidth * 2,
        y: yOffset,
        height: nodeHeight,
        value: nodeValue,
      });
      yOffset += nodeHeight + nodePadding;
    });

    // Calculate link paths with y-offsets for proper stacking
    const sourceOffsets = new Map<string, number>();
    const targetOffsets = new Map<string, number>();

    const layoutLinks: SankeyLink[] = mockExposureFlowData.links.map((link) => {
      const sourceNode = layoutNodes.find((n) => n.id === link.source)!;
      const targetNode = layoutNodes.find((n) => n.id === link.target)!;

      const sourceOffset = sourceOffsets.get(link.source) || 0;
      const targetOffset = targetOffsets.get(link.target) || 0;

      const linkHeight = (link.value / totalValue) * availableHeight * 0.8;

      sourceOffsets.set(link.source, sourceOffset + linkHeight);
      targetOffsets.set(link.target, targetOffset + linkHeight);

      return {
        source: link.source,
        target: link.target,
        value: link.value,
        y0: sourceNode.y + sourceOffset,
        y1: targetNode.y + targetOffset,
      };
    });

    return { nodes: layoutNodes, links: layoutLinks };
  }, []);

  // Generate link path (cubic bezier curve)
  const getLinkPath = (link: SankeyLink) => {
    const sourceNode = nodes.find((n) => n.id === link.source)!;
    const targetNode = nodes.find((n) => n.id === link.target)!;

    const linkHeight = (link.value / sourceNode.value) * sourceNode.height;

    const x0 = sourceNode.x + nodeWidth;
    const x1 = targetNode.x;
    const y0 = link.y0;
    const y1 = link.y1;

    const xi = (x0 + x1) / 2;

    return `
      M ${x0},${y0}
      C ${xi},${y0} ${xi},${y1} ${x1},${y1}
      L ${x1},${y1 + linkHeight}
      C ${xi},${y1 + linkHeight} ${xi},${y0 + linkHeight} ${x0},${y0 + linkHeight}
      Z
    `;
  };

  const isLinkHighlighted = (link: SankeyLink) => {
    if (!hoveredNode && !hoveredLink) return true;
    if (hoveredLink) {
      return hoveredLink.source === link.source && hoveredLink.target === link.target;
    }
    return link.source === hoveredNode || link.target === hoveredNode;
  };

  const isNodeHighlighted = (nodeId: string) => {
    if (!hoveredNode && !hoveredLink) return true;
    if (hoveredLink) {
      return nodeId === hoveredLink.source || nodeId === hoveredLink.target;
    }
    if (!hoveredNode) return true;

    // Highlight connected nodes
    const connectedLinks = links.filter(
      (l) => l.source === nodeId || l.target === nodeId
    );
    return (
      nodeId === hoveredNode ||
      connectedLinks.some((l) => l.source === hoveredNode || l.target === hoveredNode)
    );
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-oracle-border">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Exposure Flow Analysis
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Sankey diagram showing exposure flows: Product Types → Risk Ratings → Geographic Regions.
          Hover over nodes or links to highlight connections.
        </p>

        {/* Summary Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="text-xs text-blue-700 font-medium mb-1">Total Exposure</div>
            <div className="text-lg font-bold text-blue-900">
              {formatCurrency(mockExposureFlowData.summary.totalExposure)}
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="text-xs text-green-700 font-medium mb-1">Investment Grade</div>
            <div className="text-lg font-bold text-green-900">
              {(
                ((mockExposureFlowData.summary.ratingBreakdown.AAA +
                  mockExposureFlowData.summary.ratingBreakdown.AA +
                  mockExposureFlowData.summary.ratingBreakdown.A +
                  mockExposureFlowData.summary.ratingBreakdown.BBB) /
                  mockExposureFlowData.summary.totalExposure) *
                100
              ).toFixed(1)}
              %
            </div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <div className="text-xs text-purple-700 font-medium mb-1">Top Product</div>
            <div className="text-sm font-bold text-purple-900">Term Loan</div>
            <div className="text-xs text-purple-600">36.2% of portfolio</div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <div className="text-xs text-orange-700 font-medium mb-1">Top Region</div>
            <div className="text-sm font-bold text-orange-900">North</div>
            <div className="text-xs text-orange-600">29.0% of portfolio</div>
          </div>
        </div>
      </div>

      {/* Sankey Diagram */}
      <div className="overflow-x-auto">
        <svg width={width} height={height} className="mx-auto">
          {/* Links */}
          <g className="links">
            {links.map((link, index) => {
              const sourceNode = nodes.find((n) => n.id === link.source)!;
              const isHighlighted = isLinkHighlighted(link);

              return (
                <path
                  key={index}
                  d={getLinkPath(link)}
                  fill={sourceNode.color}
                  fillOpacity={isHighlighted ? 0.4 : 0.1}
                  stroke="none"
                  onMouseEnter={() => setHoveredLink({ source: link.source, target: link.target })}
                  onMouseLeave={() => setHoveredLink(null)}
                  className="cursor-pointer transition-all duration-200"
                >
                  <title>
                    {sourceNode.name} → {nodes.find((n) => n.id === link.target)?.name}:{' '}
                    {formatCurrency(link.value)}
                  </title>
                </path>
              );
            })}
          </g>

          {/* Nodes */}
          <g className="nodes">
            {nodes.map((node) => {
              const isHighlighted = isNodeHighlighted(node.id);
              return (
                <g key={node.id}>
                  <rect
                    x={node.x}
                    y={node.y}
                    width={nodeWidth}
                    height={node.height}
                    fill={node.color}
                    fillOpacity={isHighlighted ? 1 : 0.3}
                    stroke={isHighlighted ? '#1f2937' : 'none'}
                    strokeWidth={isHighlighted ? 2 : 0}
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    className="cursor-pointer transition-all duration-200"
                  >
                    <title>
                      {node.name}: {formatCurrency(node.value)}
                    </title>
                  </rect>
                  <text
                    x={node.category === 'region' ? node.x + nodeWidth + 8 : node.x - 8}
                    y={node.y + node.height / 2}
                    textAnchor={node.category === 'region' ? 'start' : 'end'}
                    dominantBaseline="middle"
                    className="text-xs font-medium fill-gray-900"
                    style={{ pointerEvents: 'none' }}
                  >
                    {node.name}
                  </text>
                </g>
              );
            })}
          </g>

          {/* Category Labels */}
          <text
            x={padding.left + nodeWidth / 2}
            y={padding.top - 15}
            textAnchor="middle"
            className="text-sm font-semibold fill-gray-700"
          >
            Product Type
          </text>
          <text
            x={padding.left + (width - padding.left - padding.right) / 2}
            y={padding.top - 15}
            textAnchor="middle"
            className="text-sm font-semibold fill-gray-700"
          >
            Risk Rating
          </text>
          <text
            x={width - padding.right - nodeWidth / 2}
            y={padding.top - 15}
            textAnchor="middle"
            className="text-sm font-semibold fill-gray-700"
          >
            Region
          </text>
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div>
          <div className="font-semibold text-gray-900 mb-2">Product Types</div>
          <div className="space-y-1">
            {Object.entries(mockExposureFlowData.summary.productBreakdown).map(([product, value]) => (
              <div key={product} className="flex items-center justify-between text-gray-700">
                <span>{product}</span>
                <span className="font-medium">{formatCurrency(value)}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="font-semibold text-gray-900 mb-2">Risk Ratings</div>
          <div className="space-y-1">
            {Object.entries(mockExposureFlowData.summary.ratingBreakdown).map(([rating, value]) => (
              <div key={rating} className="flex items-center justify-between text-gray-700">
                <span>{rating}</span>
                <span className="font-medium">{formatCurrency(value)}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="font-semibold text-gray-900 mb-2">Regions</div>
          <div className="space-y-1">
            {Object.entries(mockExposureFlowData.summary.regionBreakdown).map(([region, value]) => (
              <div key={region} className="flex items-center justify-between text-gray-700">
                <span>{region}</span>
                <span className="font-medium">{formatCurrency(value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Insights */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">Flow Analysis Insights</h4>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>
            <strong>Concentration Risk:</strong> Term Loans represent 36.2% of total exposure,
            indicating potential product concentration
          </li>
          <li>
            <strong>Credit Quality:</strong> 81.7% of exposure is Investment Grade (BBB and above),
            reflecting strong portfolio quality
          </li>
          <li>
            <strong>Geographic Spread:</strong> North region has highest exposure at ₹500M (29.0%),
            followed by South at ₹430M (24.9%)
          </li>
          <li>
            <strong>Risk Distribution:</strong> 'A' rated exposures dominate at ₹420M (24.4%),
            showing balanced risk appetite
          </li>
        </ul>
      </div>
    </div>
  );
}
