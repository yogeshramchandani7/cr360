/**
 * GroupHierarchyModal Component
 * Full-screen modal displaying interactive hierarchical tree visualization
 * of connected counterparties within a corporate group
 */

import { useEffect, useMemo } from 'react';
import ReactFlow, { Background, Controls, MiniMap, NodeTypes } from 'reactflow';
import { X } from 'lucide-react';
import { mockPortfolioCompanies } from '../lib/mockData';
import { useGroupHierarchy } from '../hooks/useGroupHierarchy';
import CompanyTreeNode from './CompanyTreeNode';
import 'reactflow/dist/style.css';

interface GroupHierarchyModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupName: string;
  currentCompanyId: string;
}

// Define custom node types for React Flow
const nodeTypes: NodeTypes = {
  companyNode: CompanyTreeNode,
};

export default function GroupHierarchyModal({
  isOpen,
  onClose,
  groupName,
  currentCompanyId,
}: GroupHierarchyModalProps) {
  // Build hierarchy structure using custom hook
  const { nodes, edges, rootNode } = useGroupHierarchy(mockPortfolioCompanies, groupName);

  // Get current company info for title
  const currentCompany = useMemo(
    () => mockPortfolioCompanies.find((c) => c.id === currentCompanyId),
    [currentCompanyId]
  );

  // ESC key handler to close modal
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-[95vw] h-[90vh] bg-white rounded-lg shadow-xl flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-oracle-border">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Group Hierarchy</h2>
              <p className="text-sm text-gray-600">
                {groupName} - Connected Counterparties Network
              </p>
              {currentCompany && (
                <p className="text-xs text-gray-500 mt-1">
                  Current Company: <span className="font-semibold">{currentCompany.customerName}</span>
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded hover:bg-gray-100"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Tree Visualization */}
          <div className="flex-1 p-4 bg-oracle-bg overflow-hidden">
            {nodes.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-gray-500 text-lg mb-2">No hierarchy data available</p>
                  <p className="text-gray-400 text-sm">This company may be part of an independent group</p>
                </div>
              </div>
            ) : (
              <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{
                  padding: 0.2,
                  minZoom: 0.5,
                  maxZoom: 1.5,
                }}
                minZoom={0.1}
                maxZoom={2}
                defaultEdgeOptions={{
                  type: 'smoothstep',
                  animated: false,
                }}
                proOptions={{ hideAttribution: true }}
              >
                {/* Background grid */}
                <Background color="#E8E6E5" gap={16} />

                {/* Controls (zoom, fit view, etc.) */}
                <Controls className="bg-white border border-oracle-border rounded shadow-md" />

                {/* Mini map for navigation */}
                <MiniMap
                  className="bg-white border border-oracle-border rounded shadow-md"
                  nodeColor={(node) => {
                    const company = node.data as any;
                    if (company.creditStatus === 'Delinquent') return '#ef4444';
                    if (company.creditStatus === 'Watchlist') return '#f59e0b';
                    return '#10b981';
                  }}
                  maskColor="rgba(0, 0, 0, 0.05)"
                />
              </ReactFlow>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-oracle-border bg-oracle-bgAlt">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-gray-600">Standard</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="text-gray-600">Watchlist</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-gray-600">Delinquent</span>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                {rootNode && (
                  <span>
                    Total Companies: <span className="font-semibold">{nodes.length}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
