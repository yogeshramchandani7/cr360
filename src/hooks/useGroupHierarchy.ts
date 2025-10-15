/**
 * useGroupHierarchy Hook
 * Builds hierarchical tree structure from flat company data for React Flow visualization
 */

import { useMemo } from 'react';
import type { Node, Edge } from 'reactflow';
import type { PortfolioCompany } from '../lib/mockData';

export interface TreeNode {
  id: string;
  data: PortfolioCompany;
  children: TreeNode[];
}

export interface UseGroupHierarchyResult {
  nodes: Node[];
  edges: Edge[];
  rootNode: TreeNode | null;
}

/**
 * Builds tree structure from flat array of companies
 * @param companies - Flat array of portfolio companies
 * @param groupName - Name of the group to filter by
 * @returns Tree node structure
 */
function buildTree(companies: PortfolioCompany[], groupName: string): TreeNode | null {
  // Filter companies by group
  const groupCompanies = companies.filter((c) => c.group === groupName);

  if (groupCompanies.length === 0) return null;

  // Find root node (company with no parent)
  const rootCompany = groupCompanies.find((c) => c.parentId === null);

  if (!rootCompany) {
    // If no root found, use first company
    console.warn(`No root found for group ${groupName}, using first company`);
    return buildNode(groupCompanies[0], groupCompanies);
  }

  return buildNode(rootCompany, groupCompanies);
}

/**
 * Recursively builds tree node and its children
 */
function buildNode(company: PortfolioCompany, allCompanies: PortfolioCompany[]): TreeNode {
  const children = allCompanies
    .filter((c) => c.parentId === company.id)
    .map((child) => buildNode(child, allCompanies));

  return {
    id: company.id,
    data: company,
    children,
  };
}

/**
 * Converts tree structure to React Flow nodes with hierarchical layout
 */
function treeToReactFlowNodes(
  root: TreeNode | null,
  nodeWidth = 300,
  nodeHeight = 380,
  horizontalSpacing = 100,
  verticalSpacing = 150
): { nodes: Node[]; edges: Edge[] } {
  if (!root) return { nodes: [], edges: [] };

  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Calculate positions using hierarchical layout
  function layoutNode(
    node: TreeNode,
    level: number,
    xOffset: number,
    parentId?: string
  ): number {
    const nodeId = node.id;

    // Calculate subtree width to center parent over children
    const childrenCount = node.children.length;
    let subtreeWidth = 0;

    if (childrenCount > 0) {
      // Recursively layout children and calculate total width
      let childXOffset = xOffset;
      node.children.forEach((child) => {
        const childWidth = layoutNode(child, level + 1, childXOffset, nodeId);
        childXOffset += childWidth;
        subtreeWidth += childWidth;
      });
    } else {
      subtreeWidth = nodeWidth + horizontalSpacing;
    }

    // Center current node over its children
    const nodeX = xOffset + (subtreeWidth - nodeWidth) / 2;
    const nodeY = level * (nodeHeight + verticalSpacing);

    // Add node
    nodes.push({
      id: nodeId,
      type: 'companyNode',
      position: { x: nodeX, y: nodeY },
      data: node.data,
    });

    // Add edge from parent if exists
    if (parentId) {
      edges.push({
        id: `${parentId}-${nodeId}`,
        source: parentId,
        target: nodeId,
        type: 'smoothstep',
        animated: false,
        style: { stroke: '#9CA3AF', strokeWidth: 3 },
      });
    }

    return subtreeWidth;
  }

  layoutNode(root, 0, 0);

  return { nodes, edges };
}

/**
 * Custom hook to build hierarchical group structure for React Flow
 * @param companies - All portfolio companies
 * @param groupName - Name of the group to visualize
 * @returns React Flow nodes and edges for visualization
 */
export function useGroupHierarchy(
  companies: PortfolioCompany[],
  groupName: string
): UseGroupHierarchyResult {
  const result = useMemo(() => {
    // Build tree structure
    const rootNode = buildTree(companies, groupName);

    // Convert to React Flow format
    const { nodes, edges } = treeToReactFlowNodes(rootNode);

    return {
      nodes,
      edges,
      rootNode,
    };
  }, [companies, groupName]);

  return result;
}
