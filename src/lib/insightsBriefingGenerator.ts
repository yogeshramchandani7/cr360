import type { KPIInsight, MacroInsight } from '../types';

export interface BriefingData {
  timestamp: Date;
  overview: {
    totalInsights: number;
    criticalCount: number;
    warningCount: number;
    infoCount: number;
    kpiInsightCount: number;
    macroInsightCount: number;
  };
  criticalIssues: Array<{
    source: 'kpi' | 'macro';
    theme: string;
    implication: string;
    kpiName?: string;
  }>;
  warnings: Array<{
    source: 'kpi' | 'macro';
    theme: string;
    implication: string;
    kpiName?: string;
  }>;
  observations: Array<{
    source: 'kpi' | 'macro';
    theme: string;
    implication: string;
    kpiName?: string;
  }>;
  riskAssessment: string;
}

/**
 * Generate executive briefing from KPI and Macro insights
 */
export function generateInsightsBriefing(
  kpiInsights: KPIInsight[],
  macroInsights: MacroInsight[]
): BriefingData {
  // Count by severity
  const criticalCount =
    kpiInsights.filter(i => i.severity === 'critical').length +
    macroInsights.filter(i => i.severity === 'critical').length;

  const warningCount =
    kpiInsights.filter(i => i.severity === 'warning').length +
    macroInsights.filter(i => i.severity === 'warning').length;

  const infoCount =
    kpiInsights.filter(i => i.severity === 'info').length +
    macroInsights.filter(i => i.severity === 'info').length;

  // Organize critical issues
  const criticalIssues = [
    ...kpiInsights
      .filter(i => i.severity === 'critical')
      .map(i => ({
        source: 'kpi' as const,
        theme: i.theme,
        implication: i.implication,
        kpiName: getKPIDisplayName(i.kpiId)
      })),
    ...macroInsights
      .filter(i => i.severity === 'critical')
      .map(i => ({
        source: 'macro' as const,
        theme: i.theme,
        implication: i.implication
      }))
  ];

  // Organize warnings
  const warnings = [
    ...kpiInsights
      .filter(i => i.severity === 'warning')
      .map(i => ({
        source: 'kpi' as const,
        theme: i.theme,
        implication: i.implication,
        kpiName: getKPIDisplayName(i.kpiId)
      })),
    ...macroInsights
      .filter(i => i.severity === 'warning')
      .map(i => ({
        source: 'macro' as const,
        theme: i.theme,
        implication: i.implication
      }))
  ];

  // Organize observations
  const observations = [
    ...kpiInsights
      .filter(i => i.severity === 'info')
      .map(i => ({
        source: 'kpi' as const,
        theme: i.theme,
        implication: i.implication,
        kpiName: getKPIDisplayName(i.kpiId)
      })),
    ...macroInsights
      .filter(i => i.severity === 'info')
      .map(i => ({
        source: 'macro' as const,
        theme: i.theme,
        implication: i.implication
      }))
  ];

  // Generate risk assessment
  const riskAssessment = generateRiskAssessment(criticalCount, warningCount, infoCount);

  return {
    timestamp: new Date(),
    overview: {
      totalInsights: kpiInsights.length + macroInsights.length,
      criticalCount,
      warningCount,
      infoCount,
      kpiInsightCount: kpiInsights.length,
      macroInsightCount: macroInsights.length
    },
    criticalIssues,
    warnings,
    observations,
    riskAssessment
  };
}

/**
 * Generate risk assessment statement based on severity distribution
 */
function generateRiskAssessment(critical: number, warning: number, info: number): string {
  if (critical >= 5) {
    return 'ELEVATED RISK: Multiple critical issues require immediate management attention and remediation. Portfolio exhibits significant credit quality deterioration and elevated exposure to systemic risks.';
  } else if (critical >= 3) {
    return 'MODERATE-HIGH RISK: Several critical concerns identified requiring prompt action. Proactive risk management and enhanced monitoring protocols recommended.';
  } else if (critical >= 1) {
    return 'MODERATE RISK: Critical issues present but manageable with focused intervention. Continue monitoring warning-level indicators closely.';
  } else if (warning >= 5) {
    return 'MODERATE RISK: While no critical issues identified, multiple warnings suggest potential deterioration. Enhanced monitoring and preventive measures advised.';
  } else if (warning >= 1) {
    return 'LOW-MODERATE RISK: Limited warnings present. Portfolio generally stable with normal monitoring protocols sufficient.';
  } else {
    return 'LOW RISK: No critical or warning-level issues identified. Portfolio exhibits stable credit characteristics. Maintain standard monitoring practices.';
  }
}

/**
 * Helper function to get KPI display names
 */
function getKPIDisplayName(kpiId: string): string {
  const kpiNames: Record<string, string> = {
    'quick_mortality': 'Quick Mortality',
    'pphs': 'Pre-Provision Hit Score',
    'forward_delinquency': 'Forward Delinquency Forecast',
    'pbi': 'Pre-Delinquency Behavior Index',
    'vdi': 'Vintage Deterioration Index',
    'net_pd_migration': 'Net PD Migration',
    'concentration': 'Concentration Risk',
    'utilization_stress': 'Utilization Stress',
    'reversion_rate': 'Restructure Reversion Rate',
    'ecl_sensitivity': 'ECL Sensitivity',
    'qm_rwa_intensity': 'Credit Migration Index'
  };

  return kpiNames[kpiId] || kpiId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Format briefing as markdown text for export
 */
export function formatBriefingAsMarkdown(briefing: BriefingData): string {
  const lines: string[] = [];

  lines.push('# CREDIT RISK INSIGHTS BRIEFING');
  lines.push(`Generated: ${briefing.timestamp.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}`);
  lines.push('');

  // Overview
  lines.push('## OVERVIEW');
  lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  lines.push(`• Total Insights: ${briefing.overview.totalInsights} (${briefing.overview.kpiInsightCount} KPI + ${briefing.overview.macroInsightCount} Macro)`);
  lines.push(`• Critical: ${briefing.overview.criticalCount} issues requiring immediate attention`);
  lines.push(`• Warning: ${briefing.overview.warningCount} issues requiring monitoring`);
  lines.push(`• Informational: ${briefing.overview.infoCount} observations`);
  lines.push('');

  // Critical Issues
  if (briefing.criticalIssues.length > 0) {
    lines.push('## CRITICAL ISSUES');
    lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    briefing.criticalIssues.forEach((issue, idx) => {
      const source = issue.source === 'kpi' ? `[KPI: ${issue.kpiName}]` : '[Macro]';
      lines.push(`${idx + 1}. ${source} ${issue.theme}`);
      lines.push(`   ${issue.implication}`);
      lines.push('');
    });
  }

  // Warnings
  if (briefing.warnings.length > 0) {
    lines.push('## WARNINGS');
    lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    briefing.warnings.forEach((warning, idx) => {
      const source = warning.source === 'kpi' ? `[KPI: ${warning.kpiName}]` : '[Macro]';
      lines.push(`${idx + 1}. ${source} ${warning.theme}`);
      lines.push(`   ${warning.implication}`);
      lines.push('');
    });
  }

  // Observations
  if (briefing.observations.length > 0) {
    lines.push('## KEY OBSERVATIONS');
    lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    briefing.observations.forEach((obs, idx) => {
      const source = obs.source === 'kpi' ? `[KPI: ${obs.kpiName}]` : '[Macro]';
      lines.push(`${idx + 1}. ${source} ${obs.theme}`);
      lines.push(`   ${obs.implication}`);
      lines.push('');
    });
  }

  // Risk Assessment
  lines.push('## RISK ASSESSMENT');
  lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  lines.push(briefing.riskAssessment);

  return lines.join('\n');
}
