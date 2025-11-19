import type { RiskItem, EvidenceChart } from '../types';
import { differenceInDays } from 'date-fns';

/**
 * Generate updated agent recommendations based on risk item status and context
 */
export function generateUpdatedRecommendations(riskItem: RiskItem) {
  const daysUntilDue = differenceInDays(new Date(riskItem.dueDate), new Date());
  const isOverdue = daysUntilDue < 0;
  const daysOverdue = Math.abs(daysUntilDue);

  const recommendations = {
    title: '',
    description: '',
    actionItems: [] as string[],
    priority: riskItem.priority,
    estimatedImpact: '',
    ctas: [] as Array<{ label: string; action: string; variant: 'primary' | 'secondary' }>,
  };

  switch (riskItem.status) {
    case 'open':
      recommendations.title = 'Action Required: Start Work';
      recommendations.description = `This risk action item has been created but work hasn't started yet. ${
        isOverdue
          ? `It's ${daysOverdue} day${daysOverdue > 1 ? 's' : ''} overdue.`
          : `It's due in ${daysUntilDue} day${daysUntilDue > 1 ? 's' : ''}.`
      }`;
      recommendations.actionItems = [
        'Review the action description and understand the requirements',
        'Assign necessary resources and team members',
        'Set up tracking mechanisms for progress monitoring',
        'Begin initial investigation and planning',
        isOverdue ? 'Escalate to management due to overdue status' : 'Start work to meet the deadline',
      ];
      recommendations.estimatedImpact =
        'Starting this action promptly will help mitigate the identified risks and prevent potential credit quality deterioration.';
      recommendations.ctas = [
        { label: 'Mark as In Progress', action: 'update_status_in_progress', variant: 'primary' },
        { label: 'Edit Details', action: 'edit', variant: 'secondary' },
      ];
      break;

    case 'in_progress':
      recommendations.title = 'In Progress: Monitor and Complete';
      recommendations.description = `This action is currently being worked on. ${
        isOverdue
          ? `Attention: This item is ${daysOverdue} day${daysOverdue > 1 ? 's' : ''} overdue.`
          : `Target completion: ${daysUntilDue} day${daysUntilDue > 1 ? 's' : ''} remaining.`
      }`;
      recommendations.actionItems = [
        'Review current progress against planned milestones',
        'Identify and resolve any blockers or dependencies',
        'Update stakeholders on status and expected completion',
        'Ensure all deliverables meet quality standards',
        isOverdue
          ? 'Prioritize completion and communicate revised timeline'
          : 'Maintain momentum to complete by due date',
      ];
      recommendations.estimatedImpact =
        'Timely completion of this action will address the underlying credit risk and demonstrate effective risk management capabilities.';
      recommendations.ctas = [
        { label: 'Mark as Completed', action: 'update_status_completed', variant: 'primary' },
        { label: 'Update Progress', action: 'edit', variant: 'secondary' },
      ];
      break;

    case 'completed':
      recommendations.title = 'Completed: Review and Close';
      recommendations.description =
        'This action has been marked as completed. Review the outcomes and verify effectiveness before closing.';
      recommendations.actionItems = [
        'Verify that all action items have been completed',
        'Review the effectiveness of implemented controls',
        'Document lessons learned and best practices',
        'Update relevant policies or procedures if needed',
        'Close the action item once verification is complete',
      ];
      recommendations.estimatedImpact =
        'Proper closure ensures the risk has been adequately addressed and provides valuable insights for future risk management.';
      recommendations.ctas = [
        { label: 'Mark as Closed', action: 'update_status_closed', variant: 'primary' },
        { label: 'Reopen', action: 'update_status_open', variant: 'secondary' },
      ];
      break;

    case 'closed':
      recommendations.title = 'Closed: Archive and Learn';
      recommendations.description =
        'This action item has been closed. The work is complete and outcomes have been verified.';
      recommendations.actionItems = [
        'Archive relevant documentation for future reference',
        'Share outcomes with the credit risk team',
        'Update risk registers and control frameworks',
        'Consider similar risks across the portfolio',
        'Use insights to improve future risk assessment',
      ];
      recommendations.estimatedImpact =
        'Analyzing completed actions helps improve risk management processes and prevents similar issues in the future.';
      recommendations.ctas = [
        { label: 'Download Report', action: 'download', variant: 'primary' },
        { label: 'Reopen if Needed', action: 'update_status_open', variant: 'secondary' },
      ];
      break;
  }

  return recommendations;
}

/**
 * Get available status actions based on current status
 */
export function getStatusActions(currentStatus: RiskItem['status']) {
  const actions: Array<{ label: string; value: RiskItem['status']; description: string }> = [];

  switch (currentStatus) {
    case 'open':
      actions.push({
        label: 'Start Work',
        value: 'in_progress',
        description: 'Mark as in progress when work begins',
      });
      break;

    case 'in_progress':
      actions.push(
        {
          label: 'Mark Complete',
          value: 'completed',
          description: 'Mark as completed when work is done',
        },
        {
          label: 'Revert to Open',
          value: 'open',
          description: 'Move back to open if work has not started',
        }
      );
      break;

    case 'completed':
      actions.push(
        {
          label: 'Close Item',
          value: 'closed',
          description: 'Close after verification',
        },
        {
          label: 'Reopen',
          value: 'open',
          description: 'Reopen if more work is needed',
        }
      );
      break;

    case 'closed':
      actions.push({
        label: 'Reopen',
        value: 'open',
        description: 'Reopen if issue resurfaces',
      });
      break;
  }

  return actions;
}

/**
 * Generate mock evidence charts when no source insight exists
 */
export function getMockEvidenceCharts(riskItem: RiskItem): EvidenceChart[] {
  const charts: EvidenceChart[] = [];

  // Chart 1: Status Timeline
  charts.push({
    id: `timeline_${riskItem.id}`,
    title: 'Action Item Timeline',
    keyHighlight: `Created on ${new Date(riskItem.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })}, due ${new Date(riskItem.dueDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })}`,
    chartType: 'bar' as const,
    data: [
      { label: 'Days Elapsed', value: differenceInDays(new Date(), new Date(riskItem.createdAt)) },
      {
        label: 'Days Until Due',
        value: Math.max(0, differenceInDays(new Date(riskItem.dueDate), new Date())),
      },
      {
        label: 'Total Duration',
        value: differenceInDays(new Date(riskItem.dueDate), new Date(riskItem.createdAt)),
      },
    ],
    config: {
      xAxis: { key: 'label' },
      yAxis: { key: 'value', format: 'number', label: 'Days' },
      series: [{ key: 'value', name: 'Days', color: '#0D9488' }],
      showLegend: false,
    },
  });

  // Chart 2: Priority Distribution
  charts.push({
    id: `priority_${riskItem.id}`,
    title: 'Priority Level Analysis',
    keyHighlight: `This is a ${riskItem.priority}-priority action requiring ${
      riskItem.priority === 'high' ? 'immediate' : riskItem.priority === 'medium' ? 'timely' : 'standard'
    } attention`,
    chartType: 'pie' as const,
    data: [
      { name: 'High Priority', value: riskItem.priority === 'high' ? 100 : 0 },
      { name: 'Medium Priority', value: riskItem.priority === 'medium' ? 100 : 0 },
      { name: 'Low Priority', value: riskItem.priority === 'low' ? 100 : 0 },
    ].filter((d) => d.value > 0),
    config: {
      xAxis: { key: 'name' },
      series: [{ key: 'value', name: 'Priority' }],
      colors: ['#EF4444', '#F59E0B', '#10B981'],
    },
  });

  return charts;
}

/**
 * Check if chart type supports timeline markers
 */
function isTimeSeriesChart(chartType: EvidenceChart['chartType']): boolean {
  return ['line', 'area', 'bar', 'dual-axis'].includes(chartType);
}

/**
 * Generate post-action evidence charts with updated titles, comparison highlights, timeline markers, and improved data
 */
export function generatePostActionCharts(
  preActionCharts: EvidenceChart[],
  riskItem: RiskItem
): EvidenceChart[] {
  return preActionCharts.map((chart) => {
    // Clone the chart with new ID and Post Implementation title
    const postChart: EvidenceChart = {
      ...chart,
      id: `${chart.id}_post`,
      title: `${chart.title} - Post Implementation`,
      keyHighlight: generateComparisonKeyHighlight(chart.keyHighlight),
      data: transformChartDataForImprovement(chart.data, chart.chartType),
    };

    // Add timeline marker for time-series charts if completedAt exists
    if (riskItem.completedAt && isTimeSeriesChart(chart.chartType)) {
      postChart.timelineMarker = {
        date: riskItem.completedAt,
        label: 'Action Completed',
      };
    }

    return postChart;
  });
}

/**
 * Transform chart data to show improvement (28% change in metrics)
 */
function transformChartDataForImprovement(data: any[], chartType: EvidenceChart['chartType']): any[] {
  const REDUCTION_FACTOR = 0.72; // 28% reduction for negative metrics
  const INCREASE_FACTOR = 1.28; // 28% increase for positive metrics

  // Fields that should DECREASE (negative metrics - lower is better)
  const fieldsToDecrease = [
    'defaultRate',
    'delinquencyRate',
    'rate',
    'percentage',
    'value',
    'count',
    'amount',
    'riskScore',
    'exposureAmount',
    'lossRate',
    'nplRatio',
    'pdRate',
    'volume',
    'indexed',
    'delinquentVolume',
    'm1',
    'm3',
    'm6',
    'm9',
    'm12',
    'm18',
    'm24',
    'exceptionDefaultRate',
    'standardDefaultRate',
  ];

  // Fields that should INCREASE (positive metrics - higher is better)
  const fieldsToIncrease = [
    'raroc',
    'currentICR',
    'stressedICR',
    'currentDSCR',
    'stressedDSCR',
    'icr',
    'dscr',
  ];

  // Fields to exclude from transformation (identifiers, labels, dates)
  const fieldsToExclude = [
    'borrower',
    'company',
    'name',
    'label',
    'month',
    'quarter',
    'vintage',
    'date',
    'sector',
    'region',
    'underwriter',
    'id',
  ];

  return data.map((dataPoint) => {
    const transformedPoint = { ...dataPoint };

    // Apply reduction to negative metrics
    fieldsToDecrease.forEach((field) => {
      if (field in transformedPoint && typeof transformedPoint[field] === 'number') {
        transformedPoint[field] = parseFloat((transformedPoint[field] * REDUCTION_FACTOR).toFixed(2));
      }
    });

    // Apply increase to positive metrics
    fieldsToIncrease.forEach((field) => {
      if (field in transformedPoint && typeof transformedPoint[field] === 'number') {
        transformedPoint[field] = parseFloat((transformedPoint[field] * INCREASE_FACTOR).toFixed(2));
      }
    });

    // For time series data with multiple data points (e.g., line charts with monthly data)
    if ('data' in transformedPoint && Array.isArray(transformedPoint.data)) {
      transformedPoint.data = transformedPoint.data.map((nestedPoint: any) => {
        const transformedNested = { ...nestedPoint };

        // Apply reduction to negative metrics
        fieldsToDecrease.forEach((field) => {
          if (field in transformedNested && typeof transformedNested[field] === 'number') {
            transformedNested[field] = parseFloat((transformedNested[field] * REDUCTION_FACTOR).toFixed(2));
          }
        });

        // Apply increase to positive metrics
        fieldsToIncrease.forEach((field) => {
          if (field in transformedNested && typeof transformedNested[field] === 'number') {
            transformedNested[field] = parseFloat((transformedNested[field] * INCREASE_FACTOR).toFixed(2));
          }
        });

        return transformedNested;
      });
    }

    return transformedPoint;
  });
}

/**
 * Generate comparison-based key highlight text for post-action charts
 */
function generateComparisonKeyHighlight(originalHighlight: string): string {
  // Check for percentage (e.g., "8.7%")
  const percentageMatch = originalHighlight.match(/(\d+\.?\d*)%/);
  if (percentageMatch) {
    const originalPercent = parseFloat(percentageMatch[1]);
    const improvedPercent = (originalPercent * 0.72).toFixed(1);
    const reduction = ((originalPercent - parseFloat(improvedPercent)) / originalPercent * 100).toFixed(0);
    return `After intervention, metrics improved: ${improvedPercent}% (down from ${originalPercent}%) - a ${reduction}% reduction`;
  }

  // Check for currency (e.g., "$58.4M", "$2.3B")
  const currencyMatch = originalHighlight.match(/\$(\d+\.?\d*)(M|B|K)?/);
  if (currencyMatch) {
    const originalAmount = parseFloat(currencyMatch[1]);
    const unit = currencyMatch[2] || '';
    const improvedAmount = (originalAmount * 0.72).toFixed(1);
    return `After intervention, exposure reduced: $${improvedAmount}${unit} (down from $${originalAmount}${unit}) - a 28% reduction`;
  }

  // Check for count format (e.g., "342 accounts", "125 loans")
  const countMatch = originalHighlight.match(/(\d+)\s+(accounts|loans|borrowers|customers|entities)/i);
  if (countMatch) {
    const originalCount = parseInt(countMatch[1]);
    const unit = countMatch[2];
    const improvedCount = Math.round(originalCount * 0.72);
    return `After intervention, ${unit} reduced: ${improvedCount} ${unit} (down from ${originalCount}) - a 28% reduction`;
  }

  // Check for ratio format for positive metrics (e.g., "2.5x", "1.8x ICR")
  const ratioMatch = originalHighlight.match(/(\d+\.?\d*)x/i);
  if (ratioMatch) {
    const originalRatio = parseFloat(ratioMatch[1]);
    const improvedRatio = (originalRatio * 1.28).toFixed(1);
    const increase = ((parseFloat(improvedRatio) - originalRatio) / originalRatio * 100).toFixed(0);
    return `After intervention, coverage ratio improved: ${improvedRatio}x (up from ${originalRatio}x) - a ${increase}% increase`;
  }

  // Check for RAROC or return metrics (positive metrics that should increase)
  if (originalHighlight.toLowerCase().includes('raroc') || originalHighlight.toLowerCase().includes('return')) {
    const numberMatch = originalHighlight.match(/(\d+\.?\d*)/);
    if (numberMatch) {
      const originalValue = parseFloat(numberMatch[1]);
      const improvedValue = (originalValue * 1.28).toFixed(1);
      return `After intervention, returns improved: ${improvedValue}% (up from ${originalValue}%) - a 28% increase`;
    }
  }

  // Generic comparison message if no specific numbers found
  return `Post-action analysis shows improvement compared to pre-intervention levels`;
}
