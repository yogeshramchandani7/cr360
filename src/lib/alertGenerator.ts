import { useAlertStore } from '../stores/alertStore';
import type { AlertType, AlertSeverity } from '../stores/alertStore';
import { mockPortfolioCompanies } from './mockData';

// Alert thresholds and rules
const ALERT_RULES = {
  credit_limit: {
    critical: 0.95, // 95% utilization
    high: 0.90,
    medium: 0.85,
  },
  delinquency: {
    critical: 90, // DPD
    high: 60,
    medium: 30,
  },
  rating_downgrade: {
    critical: 3, // notches
    high: 2,
    medium: 1,
  },
  concentration: {
    critical: 0.25, // 25% of portfolio
    high: 0.20,
    medium: 0.15,
  },
};

export interface AlertTrigger {
  type: AlertType;
  severity: AlertSeverity;
  companyId: string;
  companyName: string;
  title: string;
  message: string;
  metadata: any;
}

/**
 * Scan portfolio for alert conditions
 */
export function scanPortfolioForAlerts(): AlertTrigger[] {
  const triggers: AlertTrigger[] = [];
  const totalExposure = mockPortfolioCompanies.reduce(
    (sum, company) => sum + company.creditExposure,
    0
  );

  mockPortfolioCompanies.forEach((company) => {
    // Check credit limit utilization
    if (company.creditExposure && company.grossCreditExposure) {
      const utilization = company.creditExposure / company.grossCreditExposure;

      if (utilization >= ALERT_RULES.credit_limit.critical) {
        triggers.push({
          type: 'credit_limit',
          severity: 'critical',
          companyId: company.id,
          companyName: company.customerName,
          title: `Critical: Credit Limit Breach - ${company.customerName}`,
          message: `Credit utilization at ${(utilization * 100).toFixed(1)}%, exceeding the critical threshold of ${(ALERT_RULES.credit_limit.critical * 100).toFixed(0)}%`,
          metadata: {
            utilization,
            exposure: company.creditExposure,
            limit: company.grossCreditExposure,
            threshold: ALERT_RULES.credit_limit.critical,
          },
        });
      } else if (utilization >= ALERT_RULES.credit_limit.high) {
        triggers.push({
          type: 'credit_limit',
          severity: 'high',
          companyId: company.id,
          companyName: company.customerName,
          title: `High Utilization Alert - ${company.customerName}`,
          message: `Credit utilization at ${(utilization * 100).toFixed(1)}%, approaching limit`,
          metadata: {
            utilization,
            exposure: company.creditExposure,
            limit: company.grossCreditExposure,
            threshold: ALERT_RULES.credit_limit.high,
          },
        });
      }
    }

    // Check delinquency (using a mock DPD field - you might need to adjust based on actual data)
    const mockDPD = Math.random() > 0.9 ? Math.floor(Math.random() * 120) : 0; // 10% chance of delinquency
    if (mockDPD >= ALERT_RULES.delinquency.critical) {
      triggers.push({
        type: 'delinquency',
        severity: 'critical',
        companyId: company.id,
        companyName: company.customerName,
        title: `Critical Delinquency - ${company.customerName}`,
        message: `Account is ${mockDPD} days past due. Immediate action required.`,
        metadata: {
          dpd: mockDPD,
          exposure: company.creditExposure,
          bucket: mockDPD >= 90 ? '90+' : '60-90',
        },
      });
    } else if (mockDPD >= ALERT_RULES.delinquency.high) {
      triggers.push({
        type: 'delinquency',
        severity: 'high',
        companyId: company.id,
        companyName: company.customerName,
        title: `Delinquency Alert - ${company.customerName}`,
        message: `Account is ${mockDPD} days past due. Escalation recommended.`,
        metadata: {
          dpd: mockDPD,
          exposure: company.creditExposure,
          bucket: '60-90',
        },
      });
    }

    // Check rating changes (mock - comparing internal vs external ratings)
    const internalRatingMap: { [key: string]: number } = {
      'AAA': 1, 'AA': 2, 'A': 3, 'BBB': 4, 'BB': 5, 'B': 6, 'CCC': 7, 'CC': 8, 'C': 9, 'D': 10
    };

    const internalRating = company.borrowerInternalRating?.split(/[+-]/)[0] || 'BBB';
    const externalRating = company.borrowerExternalRating?.split(/[+-]/)[0] || 'BBB';

    const internalScore = internalRatingMap[internalRating] || 4;
    const externalScore = internalRatingMap[externalRating] || 4;
    const ratingDelta = Math.abs(internalScore - externalScore);

    if (ratingDelta >= ALERT_RULES.rating_downgrade.high && internalScore > externalScore) {
      triggers.push({
        type: 'rating_change',
        severity: internalScore >= 7 ? 'critical' : 'high',
        companyId: company.id,
        companyName: company.customerName,
        title: `Rating Divergence - ${company.customerName}`,
        message: `Internal rating (${company.borrowerInternalRating}) is ${ratingDelta} notches below external rating (${company.borrowerExternalRating})`,
        metadata: {
          internalRating: company.borrowerInternalRating,
          externalRating: company.borrowerExternalRating,
          delta: ratingDelta,
          exposure: company.creditExposure,
        },
      });
    }

    // Check concentration risk
    const concentration = company.creditExposure / totalExposure;
    if (concentration >= ALERT_RULES.concentration.critical) {
      triggers.push({
        type: 'concentration',
        severity: 'critical',
        companyId: company.id,
        companyName: company.customerName,
        title: `Critical Concentration Risk - ${company.customerName}`,
        message: `Exposure represents ${(concentration * 100).toFixed(1)}% of total portfolio, exceeding concentration limits`,
        metadata: {
          concentration,
          exposure: company.creditExposure,
          portfolioExposure: totalExposure,
          percentage: concentration * 100,
        },
      });
    } else if (concentration >= ALERT_RULES.concentration.high) {
      triggers.push({
        type: 'concentration',
        severity: 'high',
        companyId: company.id,
        companyName: company.customerName,
        title: `Concentration Alert - ${company.customerName}`,
        message: `Exposure represents ${(concentration * 100).toFixed(1)}% of total portfolio`,
        metadata: {
          concentration,
          exposure: company.creditExposure,
          portfolioExposure: totalExposure,
          percentage: concentration * 100,
        },
      });
    }
  });

  return triggers;
}

/**
 * Initialize alert monitoring system
 * This would normally run as a background service/worker
 */
export function initializeAlertMonitoring() {
  // Request notification permission
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }

  // Initial scan
  const initialTriggers = scanPortfolioForAlerts();
  const addAlert = useAlertStore.getState().addAlert;

  // Add high/critical alerts to store
  initialTriggers
    .filter((trigger) => trigger.severity === 'critical' || trigger.severity === 'high')
    .forEach((trigger) => {
      addAlert({
        type: trigger.type,
        severity: trigger.severity,
        title: trigger.title,
        message: trigger.message,
        companyId: trigger.companyId,
        companyName: trigger.companyName,
        metadata: trigger.metadata,
      });
    });

  console.log(`✅ Alert monitoring initialized. Found ${initialTriggers.length} alerts.`);

  // Return cleanup function for effect cleanup
  return () => {
    console.log('Alert monitoring stopped');
  };
}

/**
 * Simulate real-time alert generation (for demo purposes)
 */
export function simulateRealtimeAlerts() {
  const alertScenarios = [
    {
      type: 'credit_limit' as AlertType,
      severity: 'critical' as AlertSeverity,
      title: 'Credit Limit Breach Detected',
      message: 'Reliance Industries has exceeded 95% of approved credit limit',
      companyName: 'Reliance Industries',
      metadata: { utilization: 0.97, exposure: 48500000, limit: 50000000 },
    },
    {
      type: 'rating_change' as AlertType,
      severity: 'high' as AlertSeverity,
      title: 'Rating Downgrade Alert',
      message: 'Adani Ports downgraded from A to BBB by external rating agency',
      companyName: 'Adani Ports',
      metadata: { previousRating: 'A', newRating: 'BBB', agency: 'CRISIL' },
    },
    {
      type: 'delinquency' as AlertType,
      severity: 'medium' as AlertSeverity,
      title: 'Early Delinquency Warning',
      message: 'Bharti Airtel payment is 35 days overdue',
      companyName: 'Bharti Airtel',
      metadata: { dpd: 35, exposure: 32000000, bucket: '30-60' },
    },
    {
      type: 'anomaly' as AlertType,
      severity: 'medium' as AlertSeverity,
      title: 'Unusual Transaction Pattern',
      message: 'Tata Motors showing 45% increase in credit utilization over 7 days',
      companyName: 'Tata Motors',
      metadata: { percentChange: 45, timeframe: '7 days', currentUtilization: 0.82 },
    },
    {
      type: 'covenant' as AlertType,
      severity: 'high' as AlertSeverity,
      title: 'Covenant Breach Imminent',
      message: 'ICICI Bank approaching debt-to-equity covenant threshold',
      companyName: 'ICICI Bank',
      metadata: { covenant: 'debt-to-equity', current: 3.8, threshold: 4.0, margin: 0.2 },
    },
  ];

  const addAlert = useAlertStore.getState().addAlert;

  // Pick a random scenario
  const scenario = alertScenarios[Math.floor(Math.random() * alertScenarios.length)];

  // Find matching company or use mock data
  const company = mockPortfolioCompanies.find((c) =>
    c.customerName.toLowerCase().includes(scenario.companyName.toLowerCase().split(' ')[0])
  );

  addAlert({
    type: scenario.type,
    severity: scenario.severity,
    title: scenario.title,
    message: scenario.message,
    companyId: company?.id || 'demo-company',
    companyName: scenario.companyName,
    metadata: scenario.metadata,
  });

  console.log(`🔔 Simulated alert: ${scenario.title}`);
}
