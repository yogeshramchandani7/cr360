import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import type { PortfolioCompany } from '../types';
import {
  getRiskDetails,
  getExposureDetails,
  getGroupExposureDetails,
  getProfitabilityDetails,
  getClimateRiskDetails,
  getKYCComplianceDetails,
} from './mockData';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: typeof autoTable;
    lastAutoTable?: { finalY: number };
  }
}

// PDF Configuration
const CONFIG = {
  colors: {
    primary: '#FF0000', // Oracle Red
    text: '#333333',
    lightText: '#666666',
    border: '#E5E7EB',
    background: '#F9FAFB',
  },
  margins: {
    left: 20,
    right: 20,
    top: 30,
    bottom: 25,
  },
  fontSize: {
    title: 24,
    heading1: 18,
    heading2: 14,
    heading3: 12,
    body: 10,
    small: 8,
  },
  pageWidth: 210, // A4 width in mm
  pageHeight: 297, // A4 height in mm
};

interface PDFContext {
  doc: jsPDF;
  currentPage: number;
  yPosition: number;
  tocEntries: Array<{ title: string; page: number; level: number }>;
}

// ============= UTILITY FUNCTIONS =============

/**
 * Format currency in Indian Rupees
 */
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Format currency values that are stored in millions
 * Multiplies by 1,000,000 before formatting
 */
const formatCurrencyInMillions = (valueInMillions: number): string => {
  return formatCurrency(valueInMillions * 1000000);
};

/**
 * Format date
 */
const formatDate = (dateString?: string): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Get current timestamp for filename
 */
const getTimestamp = (): string => {
  const now = new Date();
  return now.toISOString().split('T')[0].replace(/-/g, '');
};

/**
 * Check if we need a new page
 */
const checkPageBreak = (ctx: PDFContext, requiredSpace: number): void => {
  if (ctx.yPosition + requiredSpace > CONFIG.pageHeight - CONFIG.margins.bottom) {
    ctx.doc.addPage();
    ctx.currentPage++;
    ctx.yPosition = CONFIG.margins.top;
    addPageHeader(ctx);
  }
};

/**
 * Add page header to every page
 */
const addPageHeader = (ctx: PDFContext): void => {
  const doc = ctx.doc;

  // Header line
  doc.setDrawColor(CONFIG.colors.primary);
  doc.setLineWidth(0.5);
  doc.line(CONFIG.margins.left, 15, CONFIG.pageWidth - CONFIG.margins.right, 15);

  // CR360 logo text
  doc.setFontSize(CONFIG.fontSize.heading2);
  doc.setTextColor(CONFIG.colors.primary);
  doc.setFont('helvetica', 'bold');
  doc.text('CR360', CONFIG.margins.left, 12);

  // Credit Risk Analytics subtitle
  doc.setFontSize(CONFIG.fontSize.small);
  doc.setTextColor(CONFIG.colors.lightText);
  doc.setFont('helvetica', 'normal');
  doc.text('Credit Risk Analytics', CONFIG.margins.left + 25, 12);
};

/**
 * Add page footer with page numbers
 */
const addPageFooter = (ctx: PDFContext, companyName: string): void => {
  const doc = ctx.doc;
  const pageCount = ctx.currentPage;

  // Footer line
  doc.setDrawColor(CONFIG.colors.border);
  doc.setLineWidth(0.3);
  doc.line(
    CONFIG.margins.left,
    CONFIG.pageHeight - 15,
    CONFIG.pageWidth - CONFIG.margins.right,
    CONFIG.pageHeight - 15
  );

  // Company name on left
  doc.setFontSize(CONFIG.fontSize.small);
  doc.setTextColor(CONFIG.colors.lightText);
  doc.setFont('helvetica', 'italic');
  doc.text(
    `${companyName} - Credit Report`,
    CONFIG.margins.left,
    CONFIG.pageHeight - 10
  );

  // Page number on right
  doc.text(
    `Page ${pageCount}`,
    CONFIG.pageWidth - CONFIG.margins.right - 15,
    CONFIG.pageHeight - 10
  );

  // Generation timestamp in center
  doc.text(
    `Generated: ${new Date().toLocaleString('en-IN')}`,
    CONFIG.pageWidth / 2,
    CONFIG.pageHeight - 10,
    { align: 'center' }
  );
};

/**
 * Add section heading
 */
const addSectionHeading = (ctx: PDFContext, title: string, level: number = 1): void => {
  checkPageBreak(ctx, 20);

  const doc = ctx.doc;
  const fontSize = level === 1 ? CONFIG.fontSize.heading1 : CONFIG.fontSize.heading2;

  // Add to TOC
  ctx.tocEntries.push({ title, page: ctx.currentPage, level });

  // Add spacing before heading
  ctx.yPosition += level === 1 ? 10 : 5;

  // Draw heading background
  if (level === 1) {
    doc.setFillColor(CONFIG.colors.primary);
    doc.rect(CONFIG.margins.left, ctx.yPosition - 5, CONFIG.pageWidth - CONFIG.margins.left - CONFIG.margins.right, 10, 'F');
    doc.setTextColor(255, 255, 255);
  } else {
    doc.setTextColor(CONFIG.colors.primary);
  }

  doc.setFontSize(fontSize);
  doc.setFont('helvetica', 'bold');
  doc.text(title, CONFIG.margins.left + 2, ctx.yPosition);

  ctx.yPosition += level === 1 ? 12 : 8;
  doc.setTextColor(CONFIG.colors.text);
};

/**
 * Add key-value pair
 */
const addKeyValue = (ctx: PDFContext, key: string, value: string): void => {
  checkPageBreak(ctx, 8);

  const doc = ctx.doc;
  doc.setFontSize(CONFIG.fontSize.body);

  // Key (bold)
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(CONFIG.colors.text);
  doc.text(key + ':', CONFIG.margins.left + 5, ctx.yPosition);

  // Value (normal)
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(CONFIG.colors.lightText);
  doc.text(value, CONFIG.margins.left + 60, ctx.yPosition);

  ctx.yPosition += 6;
};

/**
 * Capture chart as image
 */
export const captureChartAsImage = async (chartId: string): Promise<string | null> => {
  try {
    const chartElement = document.getElementById(chartId);
    if (!chartElement) return null;

    const canvas = await html2canvas(chartElement, {
      scale: 2,
      backgroundColor: '#ffffff',
      logging: false,
    });

    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error(`Error capturing chart ${chartId}:`, error);
    return null;
  }
};

// ============= SECTION GENERATORS =============

/**
 * Generate cover page
 */
const generateCoverPage = (ctx: PDFContext, company: PortfolioCompany): void => {
  const doc = ctx.doc;

  // Large company name
  doc.setFontSize(CONFIG.fontSize.title + 4);
  doc.setTextColor(CONFIG.colors.primary);
  doc.setFont('helvetica', 'bold');
  doc.text(company.customerName, CONFIG.pageWidth / 2, 80, { align: 'center' });

  // Report title
  doc.setFontSize(CONFIG.fontSize.heading1);
  doc.setTextColor(CONFIG.colors.text);
  doc.text('Comprehensive Credit Risk Report', CONFIG.pageWidth / 2, 100, { align: 'center' });

  // Horizontal line
  doc.setDrawColor(CONFIG.colors.primary);
  doc.setLineWidth(1);
  doc.line(40, 110, CONFIG.pageWidth - 40, 110);

  // Company details box
  const boxY = 130;
  doc.setFillColor(CONFIG.colors.background);
  doc.roundedRect(40, boxY, CONFIG.pageWidth - 80, 60, 3, 3, 'F');

  doc.setFontSize(CONFIG.fontSize.body);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(CONFIG.colors.text);

  let detailY = boxY + 12;
  doc.text(`Industry: ${company.industry}`, 50, detailY);
  detailY += 8;
  doc.text(`Rating: ${company.borrowerExternalRating}`, 50, detailY);
  detailY += 8;
  doc.text(`Asset Classification: ${company.assetClass}`, 50, detailY);
  detailY += 8;
  doc.text(`Total Exposure: ${formatCurrencyInMillions(company.creditExposure)}`, 50, detailY);
  detailY += 8;
  doc.text(`Member ID: LCB${company.custId}`, 50, detailY);

  // Report metadata
  doc.setFontSize(CONFIG.fontSize.small);
  doc.setTextColor(CONFIG.colors.lightText);
  doc.text(`Report Generated: ${new Date().toLocaleString('en-IN')}`, CONFIG.pageWidth / 2, 220, { align: 'center' });
  doc.text('Confidential - For Internal Use Only', CONFIG.pageWidth / 2, 230, { align: 'center' });

  // CR360 branding footer
  doc.setFontSize(CONFIG.fontSize.heading2);
  doc.setTextColor(CONFIG.colors.primary);
  doc.setFont('helvetica', 'bold');
  doc.text('CR360 Credit Risk Analytics', CONFIG.pageWidth / 2, CONFIG.pageHeight - 30, { align: 'center' });

  ctx.currentPage++;
  doc.addPage();
  ctx.yPosition = CONFIG.margins.top;
};

/**
 * Generate table of contents
 */
const generateTableOfContents = (ctx: PDFContext): void => {
  const doc = ctx.doc;
  const tocPageStart = ctx.currentPage;

  doc.setFontSize(CONFIG.fontSize.heading1);
  doc.setTextColor(CONFIG.colors.primary);
  doc.setFont('helvetica', 'bold');
  doc.text('Table of Contents', CONFIG.margins.left, ctx.yPosition);
  ctx.yPosition += 15;

  doc.setFontSize(CONFIG.fontSize.body);
  doc.setTextColor(CONFIG.colors.text);

  ctx.tocEntries.forEach((entry) => {
    checkPageBreak(ctx, 8);

    const indent = entry.level === 1 ? 5 : 15;
    const font = entry.level === 1 ? 'bold' : 'normal';

    doc.setFont('helvetica', font);
    doc.text(entry.title, CONFIG.margins.left + indent, ctx.yPosition);
    doc.text(entry.page.toString(), CONFIG.pageWidth - CONFIG.margins.right - 10, ctx.yPosition);

    // Dotted line
    doc.setDrawColor(CONFIG.colors.border);
    const titleWidth = doc.getTextWidth(entry.title);
    const pageNumWidth = doc.getTextWidth(entry.page.toString());
    const dotsStart = CONFIG.margins.left + indent + titleWidth + 2;
    const dotsEnd = CONFIG.pageWidth - CONFIG.margins.right - pageNumWidth - 12;

    for (let x = dotsStart; x < dotsEnd; x += 3) {
      doc.circle(x, ctx.yPosition - 1, 0.3, 'F');
    }

    ctx.yPosition += 7;
  });

  ctx.currentPage++;
  doc.addPage();
  ctx.yPosition = CONFIG.margins.top;

  // Update TOC page numbers (they were placeholders)
  // In a real implementation, you'd need a second pass to fill in actual page numbers
};

/**
 * Generate Profile Summary section
 */
const generateProfileSummary = (ctx: PDFContext, company: PortfolioCompany): void => {
  addSectionHeading(ctx, '1. Profile Summary', 1);

  ctx.yPosition += 5;

  // Company Information subsection
  addSectionHeading(ctx, '1.1 Company Information', 2);
  addKeyValue(ctx, 'Company Name', company.customerName);
  addKeyValue(ctx, 'Member ID', `LCB${company.custId}`);
  addKeyValue(ctx, 'Relationship Group', company.group);
  addKeyValue(ctx, 'Constitution/Gender', company.partyType);
  addKeyValue(ctx, 'Industry', company.industry);
  addKeyValue(ctx, 'Line of Business', company.lineOfBusiness || 'N/A');

  ctx.yPosition += 5;

  // Risk & Classification subsection
  addSectionHeading(ctx, '1.2 Risk Classification', 2);
  addKeyValue(ctx, 'Asset Classification', company.assetClass);
  addKeyValue(ctx, 'External Rating', company.borrowerExternalRating);
  addKeyValue(ctx, 'Credit Score', company.borrowerCreditScore?.toString() || 'N/A');
  addKeyValue(ctx, 'Risk Grade', company.riskGrade || 'N/A');

  ctx.yPosition += 5;

  // Exposure Overview subsection
  addSectionHeading(ctx, '1.3 Exposure Overview', 2);
  addKeyValue(ctx, 'Total Exposure', formatCurrencyInMillions(company.creditExposure));
  addKeyValue(ctx, 'Credit Limit', formatCurrencyInMillions(company.creditLimit));
  addKeyValue(ctx, 'Utilization', `${((company.creditExposure / company.creditLimit) * 100).toFixed(1)}%`);
  addKeyValue(ctx, 'Overdue Days', company.overdues.toString());
};

/**
 * Generate Risk Details section
 */
const generateRiskDetails = (ctx: PDFContext, companyId: string): void => {
  const riskDetails = getRiskDetails(companyId);
  if (!riskDetails) {
    addSectionHeading(ctx, '2. Risk Details', 1);
    ctx.yPosition += 5;
    ctx.doc.text('Risk details not available.', CONFIG.margins.left + 5, ctx.yPosition);
    return;
  }

  addSectionHeading(ctx, '2. Risk Details', 1);

  // Risk Classification
  addSectionHeading(ctx, '2.1 Risk Classification', 2);
  const latestRating = riskDetails.creditRatingHistory[0];
  const latestScore = riskDetails.creditScoringHistory[0];

  addKeyValue(ctx, 'External Rating', latestRating?.creditRating || 'N/A');
  addKeyValue(ctx, 'Rating Agency', latestRating?.ratingSource || 'N/A');
  addKeyValue(ctx, 'Last Updated', formatDate(latestRating?.date));
  addKeyValue(ctx, 'Credit Score', latestScore?.score?.toString() || 'N/A');
  addKeyValue(ctx, 'Credit Outlook', latestRating?.creditOutlook || 'N/A');
  addKeyValue(ctx, 'Asset Classification', riskDetails.borrowerRiskClassification.assetClassification);
  addKeyValue(ctx, 'Credit Status', riskDetails.borrowerRiskClassification.creditStatus);
  addKeyValue(ctx, 'Risk Level', riskDetails.creditRiskRepo.riskLevel);

  ctx.yPosition += 10;

  // Credit Rating History Table
  if (riskDetails.creditRatingHistory && riskDetails.creditRatingHistory.length > 0) {
    addSectionHeading(ctx, '2.2 Credit Rating History', 2);

    autoTable(ctx.doc, {
      startY: ctx.yPosition,
      head: [['Date', 'Type', 'Rating', 'Agency', 'Outlook']],
      body: riskDetails.creditRatingHistory.map(r => [
        formatDate(r.date),
        r.ratingType,
        r.creditRating,
        r.ratingSource,
        r.creditOutlook,
      ]),
      theme: 'grid',
      styles: { fontSize: CONFIG.fontSize.small, cellPadding: 2 },
      headStyles: { fillColor: CONFIG.colors.primary, textColor: [255, 255, 255], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: CONFIG.colors.background },
      margin: { left: CONFIG.margins.left, right: CONFIG.margins.right },
    });

    ctx.yPosition = (ctx.doc as any).lastAutoTable.finalY + 10;
  }

  // Credit Scoring History Table
  if (riskDetails.creditScoringHistory && riskDetails.creditScoringHistory.length > 0) {
    checkPageBreak(ctx, 40);
    addSectionHeading(ctx, '2.3 Credit Scoring History', 2);

    autoTable(ctx.doc, {
      startY: ctx.yPosition,
      head: [['Date', 'Type', 'Source', 'Score', 'Outlook']],
      body: riskDetails.creditScoringHistory.map(s => [
        formatDate(s.date),
        s.scoringType,
        s.scoringSource,
        s.score.toString(),
        s.outlook,
      ]),
      theme: 'grid',
      styles: { fontSize: CONFIG.fontSize.small, cellPadding: 2 },
      headStyles: { fillColor: CONFIG.colors.primary, textColor: [255, 255, 255], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: CONFIG.colors.background },
      margin: { left: CONFIG.margins.left, right: CONFIG.margins.right },
    });

    ctx.yPosition = (ctx.doc as any).lastAutoTable.finalY + 10;
  }
};

/**
 * Generate Exposure Details section
 */
const generateExposureDetails = (ctx: PDFContext, companyId: string): void => {
  const exposureDetails = getExposureDetails(companyId);
  if (!exposureDetails) {
    addSectionHeading(ctx, '3. Exposure Details', 1);
    ctx.yPosition += 5;
    ctx.doc.text('Exposure details not available.', CONFIG.margins.left + 5, ctx.yPosition);
    return;
  }

  addSectionHeading(ctx, '3. Exposure Details', 1);

  // Exposure Summary
  addSectionHeading(ctx, '3.1 Exposure Summary', 2);
  addKeyValue(ctx, 'Credit Limit', formatCurrencyInMillions(exposureDetails.exposureSummary.creditLimit));
  addKeyValue(ctx, 'Total Exposure', formatCurrencyInMillions(exposureDetails.exposureSummary.totalExposure));
  addKeyValue(ctx, 'Credit Exposure', formatCurrencyInMillions(exposureDetails.exposureSummary.creditExposure));
  addKeyValue(ctx, 'Gross Credit Exposure', formatCurrencyInMillions(exposureDetails.exposureSummary.grossCreditExposure));
  addKeyValue(ctx, 'Undrawn Exposure', formatCurrencyInMillions(exposureDetails.exposureSummary.undrawnExposure));
  addKeyValue(ctx, 'Drawing Limit', formatCurrencyInMillions(exposureDetails.exposureSummary.drawingLimit));
  addKeyValue(ctx, 'Overdue Days', exposureDetails.exposureSummary.dpd.toString());
  addKeyValue(ctx, 'Credit Status', exposureDetails.exposureSummary.creditStatus);
  addKeyValue(ctx, 'Asset Classification', exposureDetails.exposureSummary.assetClassification);

  ctx.yPosition += 10;

  // Account Details Table
  if (exposureDetails.accounts && exposureDetails.accounts.length > 0) {
    checkPageBreak(ctx, 40);
    addSectionHeading(ctx, '3.2 Account Details', 2);

    autoTable(ctx.doc, {
      startY: ctx.yPosition,
      head: [['Account ID', 'Product', 'Credit Limit', 'Outstanding', 'Status']],
      body: exposureDetails.accounts.map(acc => [
        acc.accountId,
        acc.product,
        formatCurrencyInMillions(acc.creditLimit),
        formatCurrencyInMillions(acc.outstandingBalance),
        acc.accountStatus,
      ]),
      theme: 'grid',
      styles: { fontSize: CONFIG.fontSize.small, cellPadding: 2 },
      headStyles: { fillColor: CONFIG.colors.primary, textColor: [255, 255, 255], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: CONFIG.colors.background },
      margin: { left: CONFIG.margins.left, right: CONFIG.margins.right },
    });

    ctx.yPosition = (ctx.doc as any).lastAutoTable.finalY + 10;
  }
};

/**
 * Generate Group Exposures section
 */
const generateGroupExposures = (ctx: PDFContext, companyId: string): void => {
  const groupDetails = getGroupExposureDetails(companyId);
  if (!groupDetails) {
    addSectionHeading(ctx, '4. Group Exposures', 1);
    ctx.yPosition += 5;
    ctx.doc.text('Group exposure details not available.', CONFIG.margins.left + 5, ctx.yPosition);
    return;
  }

  addSectionHeading(ctx, '4. Group Exposures', 1);

  // Group Summary
  addSectionHeading(ctx, '4.1 Group Summary', 2);
  addKeyValue(ctx, 'Group Name', groupDetails.groupInfo.groupName);
  addKeyValue(ctx, 'Parent Entity', groupDetails.groupInfo.parentEntity);
  addKeyValue(ctx, 'Total Group Exposure', formatCurrencyInMillions(groupDetails.groupExposureSummary.totalExposure));
  addKeyValue(ctx, 'Number of Group Members', groupDetails.memberCompanies.length.toString());

  ctx.yPosition += 10;

  // Group Members Table
  if (groupDetails.memberCompanies && groupDetails.memberCompanies.length > 0) {
    checkPageBreak(ctx, 40);
    addSectionHeading(ctx, '4.2 Group Member Exposures', 2);

    autoTable(ctx.doc, {
      startY: ctx.yPosition,
      head: [['Member Name', 'Entity ID', 'Exposure', 'Rating', 'Status']],
      body: groupDetails.memberCompanies.map(member => [
        member.entityName,
        member.entityId,
        formatCurrencyInMillions(member.exposure),
        member.externalRating,
        member.assetClassification,
      ]),
      theme: 'grid',
      styles: { fontSize: CONFIG.fontSize.small, cellPadding: 2 },
      headStyles: { fillColor: CONFIG.colors.primary, textColor: [255, 255, 255], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: CONFIG.colors.background },
      margin: { left: CONFIG.margins.left, right: CONFIG.margins.right },
    });

    ctx.yPosition = (ctx.doc as any).lastAutoTable.finalY + 10;
  }
};

/**
 * Generate Profitability section
 */
const generateProfitability = (ctx: PDFContext, companyId: string): void => {
  const profitDetails = getProfitabilityDetails(companyId);
  if (!profitDetails) {
    addSectionHeading(ctx, '5. Profitability Analysis', 1);
    ctx.yPosition += 5;
    ctx.doc.text('Profitability details not available.', CONFIG.margins.left + 5, ctx.yPosition);
    return;
  }

  addSectionHeading(ctx, '5. Profitability Analysis', 1);

  // Profitability Metrics
  addSectionHeading(ctx, '5.1 Profitability Metrics', 2);
  addKeyValue(ctx, 'Net Interest Margin (NIM)', profitDetails.profitabilityMetrics.netInterestMargin.toFixed(2) + '%');
  addKeyValue(ctx, 'Return on Assets (ROA)', profitDetails.profitabilityMetrics.returnOnTotalAssets.toFixed(2) + '%');
  addKeyValue(ctx, 'Return on Equity (ROE)', profitDetails.profitabilityMetrics.returnOnEquity.toFixed(2) + '%');
  addKeyValue(ctx, 'Risk-Adjusted Return (RAROC)', profitDetails.profitabilityMetrics.riskAdjustedReturnOnCapital.toFixed(2) + '%');
  addKeyValue(ctx, 'Total Income', formatCurrencyInMillions(profitDetails.profitabilityMetrics.totalIncome));
  addKeyValue(ctx, 'Net Income', formatCurrencyInMillions(profitDetails.profitabilityMetrics.netIncome));

  ctx.yPosition += 10;

  // Income Statement Table
  if (profitDetails.incomeStatement && profitDetails.incomeStatement.length > 0) {
    checkPageBreak(ctx, 40);
    addSectionHeading(ctx, '5.2 Income Statement', 2);

    // Show top-level income statement items
    const topLevelItems = profitDetails.incomeStatement.filter(item => item.level <= 2);
    autoTable(ctx.doc, {
      startY: ctx.yPosition,
      head: [['Item', 'Amount (₹ Cr)']],
      body: topLevelItems.map(item => [
        item.lineItemLeafName,
        item.amount >= 0 ? formatCurrencyInMillions(item.amount) : `(${formatCurrencyInMillions(Math.abs(item.amount))})`,
      ]),
      theme: 'grid',
      styles: { fontSize: CONFIG.fontSize.small, cellPadding: 2 },
      headStyles: { fillColor: CONFIG.colors.primary, textColor: [255, 255, 255], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: CONFIG.colors.background },
      margin: { left: CONFIG.margins.left, right: CONFIG.margins.right },
    });

    ctx.yPosition = (ctx.doc as any).lastAutoTable.finalY + 10;
  }
};

/**
 * Generate Climate Risk section
 */
const generateClimateRisk = (ctx: PDFContext, companyId: string): void => {
  const climateDetails = getClimateRiskDetails(companyId);
  if (!climateDetails) {
    addSectionHeading(ctx, '6. Climate Risk Analysis', 1);
    ctx.yPosition += 5;
    ctx.doc.text('Climate risk details not available.', CONFIG.margins.left + 5, ctx.yPosition);
    return;
  }

  addSectionHeading(ctx, '6. Climate Risk Analysis', 1);

  // Climate Risk Summary
  addSectionHeading(ctx, '6.1 Emissions Summary', 2);
  addKeyValue(ctx, 'Total Emissions', climateDetails.emissionsSummary.totalEmissions.toFixed(0) + ' tCO2e');
  addKeyValue(ctx, 'Scope 1 Emissions', climateDetails.emissionsSummary.scope1.toFixed(0) + ' tCO2e');
  addKeyValue(ctx, 'Scope 2 Emissions', climateDetails.emissionsSummary.scope2.toFixed(0) + ' tCO2e');
  addKeyValue(ctx, 'Scope 3 Emissions', climateDetails.emissionsSummary.scope3.toFixed(0) + ' tCO2e');
  addKeyValue(ctx, 'Financed Emissions', climateDetails.emissionsSummary.financedEmissions.toFixed(0) + ' tCO2e');
  addKeyValue(ctx, 'WACI', climateDetails.emissionsSummary.waci.toFixed(2) + ' tCO2e/₹M');
  addKeyValue(ctx, 'Climate Risk Score', climateDetails.climateRiskScore.climateRiskScore.toFixed(1) + '/5');
  addKeyValue(ctx, 'Climate Risk Rating', climateDetails.climateRiskScore.climateRating);

  ctx.yPosition += 5;
};

/**
 * Generate KYC Compliance section
 */
const generateKYCCompliance = (ctx: PDFContext, companyId: string): void => {
  const kycDetails = getKYCComplianceDetails(companyId);
  if (!kycDetails) {
    addSectionHeading(ctx, '7. KYC & Compliance', 1);
    ctx.yPosition += 5;
    ctx.doc.text('KYC compliance details not available.', CONFIG.margins.left + 5, ctx.yPosition);
    return;
  }

  addSectionHeading(ctx, '7. KYC & Compliance', 1);

  // Compliance Summary
  addSectionHeading(ctx, '7.1 Compliance Summary', 2);
  addKeyValue(ctx, 'Profile Risk', kycDetails.riskSummary.profileRisk);
  addKeyValue(ctx, 'Risk Details', kycDetails.riskSummary.details);
  const latestRiskScore = kycDetails.riskScoreHistory[0];
  if (latestRiskScore) {
    addKeyValue(ctx, 'Latest Risk Score', latestRiskScore.score.toFixed(1));
    addKeyValue(ctx, 'Risk Level', latestRiskScore.risk);
    addKeyValue(ctx, 'Last Scored', formatDate(latestRiskScore.dateScored));
  }
  addKeyValue(ctx, 'Adverse Media Detected', kycDetails.adverseMediaScans.detected ? 'Yes' : 'No');

  ctx.yPosition += 10;

  // Risk Factors
  if (kycDetails.riskSummary.riskFactors && kycDetails.riskSummary.riskFactors.length > 0) {
    addSectionHeading(ctx, '7.2 Risk Factors', 2);
    kycDetails.riskSummary.riskFactors.forEach((factor, index) => {
      ctx.doc.setFontSize(CONFIG.fontSize.body);
      ctx.doc.setFont('helvetica', 'normal');
      ctx.doc.text(`${index + 1}. ${factor}`, CONFIG.margins.left + 10, ctx.yPosition);
      ctx.yPosition += 6;
    });
    ctx.yPosition += 5;
  }
};

// ============= MASTER ORCHESTRATOR =============

/**
 * Main function to generate comprehensive PDF report
 */
export const generateCompanyProfilePDF = async (
  company: PortfolioCompany,
  onProgress?: (progress: number, message: string) => void
): Promise<void> => {
  try {
    onProgress?.(0, 'Initializing PDF generation...');

    // Create new PDF document
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Initialize context
    const ctx: PDFContext = {
      doc,
      currentPage: 1,
      yPosition: CONFIG.margins.top,
      tocEntries: [],
    };

    onProgress?.(5, 'Generating cover page...');
    generateCoverPage(ctx, company);

    onProgress?.(10, 'Fetching company data...');
    // Note: TOC will be generated at the end after we know all page numbers

    onProgress?.(20, 'Generating profile summary...');
    generateProfileSummary(ctx, company);

    onProgress?.(35, 'Generating risk details...');
    generateRiskDetails(ctx, company.id);

    onProgress?.(50, 'Generating exposure details...');
    generateExposureDetails(ctx, company.id);

    onProgress?.(60, 'Generating group exposures...');
    generateGroupExposures(ctx, company.id);

    onProgress?.(70, 'Generating profitability analysis...');
    generateProfitability(ctx, company.id);

    onProgress?.(80, 'Generating climate risk analysis...');
    generateClimateRisk(ctx, company.id);

    onProgress?.(90, 'Generating KYC compliance...');
    generateKYCCompliance(ctx, company.id);

    onProgress?.(95, 'Adding headers and footers...');
    // Add headers and footers to all pages
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      if (i > 1) { // Skip cover page
        addPageHeader(ctx);
        addPageFooter({ ...ctx, currentPage: i }, company.customerName);
      }
    }

    onProgress?.(98, 'Finalizing PDF...');
    // Generate filename
    const filename = `${company.customerName.replace(/[^a-zA-Z0-9]/g, '_')}_Credit_Report_${getTimestamp()}.pdf`;

    onProgress?.(100, 'Downloading PDF...');
    // Save PDF
    doc.save(filename);

  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF report');
  }
};
