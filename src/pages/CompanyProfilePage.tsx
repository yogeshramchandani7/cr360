import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Network, Download, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { mockPortfolioCompanies, type PortfolioCompany } from '../lib/mockData';
import SectionHeader from '../components/SectionHeader';
import GroupHierarchyModal from '../components/GroupHierarchyModal';
import { generateCompanyProfilePDF } from '../lib/pdfExport';

interface CompanyProfileData {
  company: PortfolioCompany;
  connectedCounterparties: Array<{ id: string; name: string }>;
  profileSummary: {
    relationshipGroup: string;
    memberId: string;
    standardAsset: string;
    groupCompany: string;
    constitutionGender: string;
    dateOfBirth: string;
    code1: string;
    code2: string;
  };
  riskSummary: {
    externalRating: string;
    internalRating: string;
    creditScore: number;
    creditOutlook: string;
    creditWatch: string;
    assetClassification: string;
    stageClassification: string;
    delinquentFlag: string;
    watchlist: string;
    riskWeight: number;
  };
  exposureSummary: {
    creditLimit: number;
    totalExposure: number;
    fundBasedLimit: number;
    nonFundBasedLimit: number;
    totalCreditOutstanding: number;
    undrawnExposure: number;
    proportionOfTotalExposure: number;
    maxOverdues: number;
    totalOverdues: number;
  };
  groupExposures: Array<{
    group: string;
    noOfObligors: number;
    creditLimit: number;
    totalGrossCreditExposure: number;
    totalCreditExposure: number;
    totalOverdues: number;
    maxDaysInDefault: number;
  }>;
  covenants: {
    financial: string[];
    nonFinancial: string[];
  };
  profitability: {
    netInterestMargin: number;
    returnOnAssets: number;
    returnOnCapital: number;
    riskAdjustedReturn: number;
    customerLifetimeValue: number;
  };
  compliance: {
    profileRisk: string;
    riskScore: number;
    behaviouralRisk: string;
    top3RiskFactors: string[];
  };
  climateRisk: {
    uniqueId: string;
    emissionNumbers: string;
    climateSectorFinancedEmission: string;
    intensityNumbers: string;
  };
  approvalsHistory: {
    lastApprovalActivity: string;
    lastApprovalDate: string;
  };
  accountSummary: {
    totalAccounts: number;
    accountsWithOutstandingDues: number;
    accountsWithOverdraft: number;
    accountsAtDeliquent: number;
  };
}

// Mock function to get company profile data
const getCompanyProfileData = (companyId: string): CompanyProfileData | null => {
  const company = mockPortfolioCompanies.find((c) => c.id === companyId);
  if (!company) return null;

  // Get related companies from the same group
  const connectedCounterparties = mockPortfolioCompanies
    .filter((c) => c.group === company.group && c.id !== company.id)
    .map((c) => ({ id: c.id, name: c.customerName }))
    .slice(0, 5);

  return {
    company,
    connectedCounterparties,
    profileSummary: {
      relationshipGroup: company.group,
      memberId: `LCB${company.custId}`,
      standardAsset: company.assetClass,
      groupCompany: company.group,
      constitutionGender: 'Limited/Co',
      dateOfBirth: '01/01/1990',
      code1: `${company.custId}`,
      code2: 'AADHM',
    },
    riskSummary: {
      externalRating: company.borrowerExternalRating,
      internalRating: company.borrowerInternalRating,
      creditScore: company.borrowerCreditScore,
      creditOutlook: 'Stable',
      creditWatch: 'None',
      assetClassification: company.assetClass,
      stageClassification: company.stageClassification.toString(),
      delinquentFlag: company.overdues > 0 ? 'Yes' : 'No',
      watchlist: company.creditStatus === 'Watchlist' ? 'Yes' : 'No',
      riskWeight: 75,
    },
    exposureSummary: {
      creditLimit: company.creditLimit,
      totalExposure: company.grossCreditExposure,
      fundBasedLimit: Math.floor(company.creditLimit * 0.7),
      nonFundBasedLimit: Math.floor(company.creditLimit * 0.3),
      totalCreditOutstanding: company.creditExposure,
      undrawnExposure: company.undrawnExposure,
      proportionOfTotalExposure: 2.5,
      maxOverdues: company.overdues,
      totalOverdues: company.overdues * 15000,
    },
    groupExposures: [
      {
        group: company.group,
        noOfObligors: 3,
        creditLimit: company.creditLimit * 2.5,
        totalGrossCreditExposure: company.grossCreditExposure * 2.5,
        totalCreditExposure: company.creditExposure * 2.5,
        totalOverdues: company.overdues * 25000,
        maxDaysInDefault: company.overdues,
      },
    ],
    covenants: {
      financial: ['DSCR > 1.5', 'Current Ratio > 1.2', 'Total Debt/EBITDA < 3.5'],
      nonFinancial: ['Quarterly Financial Statements', 'Annual Audit Report', 'No Disposal of Assets'],
    },
    profitability: {
      netInterestMargin: 3.5,
      returnOnAssets: 1.8,
      returnOnCapital: 15.2,
      riskAdjustedReturn: 18.5,
      customerLifetimeValue: 450000,
    },
    compliance: {
      profileRisk: 'Medium',
      riskScore: 65,
      behaviouralRisk: 'Low',
      top3RiskFactors: ['Late Payment History', 'High Utilization', 'Industry Volatility'],
    },
    climateRisk: {
      uniqueId: `CR${company.custId}`,
      emissionNumbers: '1250 tCO2e',
      climateSectorFinancedEmission: '850 tCO2e',
      intensityNumbers: '0.45 tCO2e/revenue',
    },
    approvalsHistory: {
      lastApprovalActivity: 'Credit Limit Increase',
      lastApprovalDate: '15/09/2025',
    },
    accountSummary: {
      totalAccounts: 5,
      accountsWithOutstandingDues: company.overdues > 0 ? 1 : 0,
      accountsWithOverdraft: 2,
      accountsAtDeliquent: company.creditStatus === 'Delinquent' ? 1 : 0,
    },
  };
};

export default function CompanyProfilePage() {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();
  const [isHierarchyModalOpen, setIsHierarchyModalOpen] = useState(false);

  // PDF Download states
  type PDFStatus = 'idle' | 'generating' | 'success' | 'error';
  const [pdfStatus, setPdfStatus] = useState<PDFStatus>('idle');
  const [pdfProgress, setPdfProgress] = useState(0);
  const [pdfMessage, setPdfMessage] = useState('');

  const profileData = companyId ? getCompanyProfileData(companyId) : null;

  // Handle PDF download
  const handleDownloadPDF = async () => {
    if (!profileData || pdfStatus === 'generating') return;

    try {
      setPdfStatus('generating');
      setPdfProgress(0);
      setPdfMessage('Starting PDF generation...');

      await generateCompanyProfilePDF(
        profileData.company,
        (progress, message) => {
          setPdfProgress(progress);
          setPdfMessage(message);
        }
      );

      setPdfStatus('success');
      setPdfMessage('PDF downloaded successfully!');

      // Reset to idle after 3 seconds
      setTimeout(() => {
        setPdfStatus('idle');
        setPdfProgress(0);
        setPdfMessage('');
      }, 3000);
    } catch (error) {
      console.error('PDF generation error:', error);
      setPdfStatus('error');
      setPdfMessage('Failed to generate PDF. Please try again.');

      // Reset to idle after 5 seconds
      setTimeout(() => {
        setPdfStatus('idle');
        setPdfProgress(0);
        setPdfMessage('');
      }, 5000);
    }
  };

  // Handle navigation to related company profiles
  const handleCompanyClick = (relatedCompanyId: string) => {
    navigate(`/company/${relatedCompanyId}`);
  };

  if (!companyId || !profileData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Company Not Found</h2>
        <p className="text-gray-600 mb-6">The requested company profile could not be found.</p>
        <button
          onClick={() => navigate('/portfolio')}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          Back to Portfolio
        </button>
      </div>
    );
  }

  const { company } = profileData;

  return (
    <div className="flex gap-6 min-h-screen">
      {/* Left Sidebar - Connected Counterparties */}
      <div className="w-64 bg-white border border-oracle-border rounded-lg p-4 h-fit sticky top-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-700">
            Group of Connected Counterparties
          </h3>
          {company.group !== 'Independent' && (
            <button
              onClick={() => setIsHierarchyModalOpen(true)}
              className="p-1.5 hover:bg-oracle-bg rounded-lg transition-colors"
              title="View Group Hierarchy"
              aria-label="View Group Hierarchy"
            >
              <Network className="w-4 h-4 text-oracle-navy" />
            </button>
          )}
        </div>
        <div className="space-y-2">
          {/* Current company highlighted */}
          <div className="p-3 bg-blue-100 border-l-4 border-blue-600 rounded">
            <p className="text-sm font-medium text-blue-900">{company.customerName}</p>
          </div>
          {/* Related companies */}
          {profileData.connectedCounterparties.map((company) => (
            <div
              key={company.id}
              onClick={() => handleCompanyClick(company.id)}
              className="p-3 bg-gray-50 border border-oracle-border rounded hover:bg-gray-100 cursor-pointer transition-colors"
            >
              <p className="text-sm text-gray-700">{company.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Header with Back Button and Download Report */}
        <div className="bg-white border border-oracle-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors"
              >
                <ArrowLeft size={16} />
                Back
              </button>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{company.customerName}</h2>
                <p className="text-sm text-gray-600 mt-1">{company.group}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    {company.assetClass}
                  </span>
                  <span className="text-xs text-gray-500">Member ID: LCB{company.custId}</span>
                </div>
              </div>
            </div>

            {/* Download Report Button */}
            <div className="flex flex-col items-end gap-2">
              <button
                onClick={handleDownloadPDF}
                disabled={pdfStatus === 'generating'}
                className={`
                  inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all
                  ${pdfStatus === 'generating'
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : pdfStatus === 'success'
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : pdfStatus === 'error'
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-oracle-primary text-white hover:bg-red-700'
                  }
                  disabled:opacity-50
                `}
              >
                {pdfStatus === 'generating' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating... {pdfProgress}%
                  </>
                ) : pdfStatus === 'success' ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Downloaded
                  </>
                ) : pdfStatus === 'error' ? (
                  <>
                    <XCircle className="w-4 h-4" />
                    Failed
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Download Report
                  </>
                )}
              </button>

              {/* Progress message */}
              {pdfMessage && pdfStatus === 'generating' && (
                <p className="text-xs text-gray-600 italic max-w-xs text-right">
                  {pdfMessage}
                </p>
              )}

              {/* Success/Error message */}
              {pdfMessage && (pdfStatus === 'success' || pdfStatus === 'error') && (
                <p className={`text-xs italic max-w-xs text-right ${
                  pdfStatus === 'success' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {pdfMessage}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Profile Summary */}
        <section className="bg-white border border-oracle-border rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Relationship Group</p>
              <p className="text-sm font-medium text-gray-900">{profileData.profileSummary.relationshipGroup}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Member ID</p>
              <p className="text-sm font-medium text-gray-900">{profileData.profileSummary.memberId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Group Company</p>
              <p className="text-sm font-medium text-gray-900">{profileData.profileSummary.groupCompany}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Constitution/Gender</p>
              <p className="text-sm font-medium text-gray-900">{profileData.profileSummary.constitutionGender}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Code 1 (PAN)</p>
              <p className="text-sm font-medium text-gray-900">{profileData.profileSummary.code1}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Code 2 (AADHM)</p>
              <p className="text-sm font-medium text-gray-900">{profileData.profileSummary.code2}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Onboarding Date</p>
              <p className="text-sm font-medium text-gray-900">01/01/2020</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Banking Arrangement</p>
              <p className="text-sm font-medium text-gray-900">{company.orgStructure}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Line of Business</p>
              <p className="text-sm font-medium text-gray-900">{company.lineOfBusiness}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Industry</p>
              <p className="text-sm font-medium text-gray-900">{company.industry}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Party Type</p>
              <p className="text-sm font-medium text-gray-900">{company.partyType}</p>
            </div>
          </div>
        </section>

        {/* Risk Summary */}
        <section className="bg-white border border-oracle-border rounded-lg p-4">
          <SectionHeader
            title="Risk Summary"
            detailsRoute="/company/:id/risk-details"
            companyId={companyId}
          />
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">External Rating</p>
              <p className="text-sm font-medium text-gray-900">{profileData.riskSummary.externalRating}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Internal Rating</p>
              <p className="text-sm font-medium text-gray-900">{profileData.riskSummary.internalRating}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Credit Score</p>
              <p className="text-sm font-medium text-gray-900">{profileData.riskSummary.creditScore}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Credit Outlook</p>
              <p className="text-sm font-medium text-gray-900">{profileData.riskSummary.creditOutlook}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Asset Classification</p>
              <p className="text-sm font-medium text-gray-900">{profileData.riskSummary.assetClassification}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Stage Classification</p>
              <p className="text-sm font-medium text-gray-900">Stage {profileData.riskSummary.stageClassification}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Delinquent Flag</p>
              <p className="text-sm font-medium text-gray-900">{profileData.riskSummary.delinquentFlag}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Watchlist</p>
              <p className="text-sm font-medium text-gray-900">{profileData.riskSummary.watchlist}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Risk Weight</p>
              <p className="text-sm font-medium text-gray-900">{profileData.riskSummary.riskWeight}%</p>
            </div>
          </div>
        </section>

        {/* Exposure Summary */}
        <section className="bg-white border border-oracle-border rounded-lg p-4">
          <SectionHeader
            title="Exposure Summary"
            detailsRoute="/company/:id/exposure-details"
            companyId={companyId}
          />
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Credit Limit</p>
              <p className="text-sm font-medium text-gray-900">
                ₹{(profileData.exposureSummary.creditLimit * 1000000).toLocaleString('en-IN')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Gross Credit Exposure</p>
              <p className="text-sm font-medium text-gray-900">
                ₹{(profileData.exposureSummary.totalExposure * 1000000).toLocaleString('en-IN')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Credit Outstanding</p>
              <p className="text-sm font-medium text-gray-900">
                ₹{(profileData.exposureSummary.totalCreditOutstanding * 1000000).toLocaleString('en-IN')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Fund Based Limit</p>
              <p className="text-sm font-medium text-gray-900">
                ₹{(profileData.exposureSummary.fundBasedLimit * 1000000).toLocaleString('en-IN')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Non-Fund Based Limit</p>
              <p className="text-sm font-medium text-gray-900">
                ₹{(profileData.exposureSummary.nonFundBasedLimit * 1000000).toLocaleString('en-IN')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Undrawn Exposure</p>
              <p className="text-sm font-medium text-gray-900">
                ₹{(profileData.exposureSummary.undrawnExposure * 1000000).toLocaleString('en-IN')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Max Overdues (Days)</p>
              <p className="text-sm font-medium text-gray-900">{profileData.exposureSummary.maxOverdues}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Overdues</p>
              <p className="text-sm font-medium text-gray-900">
                ₹{profileData.exposureSummary.totalOverdues.toLocaleString('en-IN')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">% of Total Portfolio</p>
              <p className="text-sm font-medium text-gray-900">{profileData.exposureSummary.proportionOfTotalExposure.toFixed(2)}%</p>
            </div>
          </div>
        </section>

        {/* Group/Related Party Exposures */}
        <section className="bg-white border border-oracle-border rounded-lg p-4">
          <SectionHeader
            title="Group/Related Party Exposures"
            detailsRoute="/company/:id/group-exposures"
            companyId={companyId}
          />
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-oracle-bgAlt">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Group</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">No of Obligors</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Credit Limit</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total Gross</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total Credit</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total Overdues</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Max Days</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {profileData.groupExposures.map((exposure, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-2 text-sm text-gray-900">{exposure.group}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{exposure.noOfObligors}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">₹{(exposure.creditLimit * 1000000).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">₹{(exposure.totalGrossCreditExposure * 1000000).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">₹{(exposure.totalCreditExposure * 1000000).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">₹{exposure.totalOverdues.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{exposure.maxDaysInDefault}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Covenants Summary */}
        <section className="bg-white border border-oracle-border rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Covenants Summary</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Financial Covenants</h4>
              <ul className="space-y-1">
                {profileData.covenants.financial.map((covenant, idx) => (
                  <li key={idx} className="text-sm text-gray-900 flex items-start">
                    <span className="mr-2">•</span>
                    <span>{covenant}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Non-Financial Covenants</h4>
              <ul className="space-y-1">
                {profileData.covenants.nonFinancial.map((covenant, idx) => (
                  <li key={idx} className="text-sm text-gray-900 flex items-start">
                    <span className="mr-2">•</span>
                    <span>{covenant}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Customer Profitability Summary */}
        <section className="bg-white border border-oracle-border rounded-lg p-4">
          <SectionHeader
            title="Customer Profitability Summary"
            detailsRoute="/company/:id/profitability"
            companyId={companyId}
          />
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Net Interest Margin</p>
              <p className="text-sm font-medium text-gray-900">{profileData.profitability.netInterestMargin}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Return on Assets</p>
              <p className="text-sm font-medium text-gray-900">{profileData.profitability.returnOnAssets}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Return on Capital</p>
              <p className="text-sm font-medium text-gray-900">{profileData.profitability.returnOnCapital}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Risk Adjusted Return</p>
              <p className="text-sm font-medium text-gray-900">{profileData.profitability.riskAdjustedReturn}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Customer Lifetime Value</p>
              <p className="text-sm font-medium text-gray-900">₹{profileData.profitability.customerLifetimeValue.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </section>

        {/* KYC & Compliance Summary */}
        <section className="bg-white border border-oracle-border rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">KYC & ALM Risk & Compliance Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Profile Risk</p>
              <p className="text-sm font-medium text-gray-900">{profileData.compliance.profileRisk}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Risk Score</p>
              <p className="text-sm font-medium text-gray-900">{profileData.compliance.riskScore}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Behavioural Risk</p>
              <p className="text-sm font-medium text-gray-900">{profileData.compliance.behaviouralRisk}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-600 mb-1">Top 3 Risk Factors</p>
              <ul className="space-y-1">
                {profileData.compliance.top3RiskFactors.map((factor, idx) => (
                  <li key={idx} className="text-sm text-gray-900 flex items-start">
                    <span className="mr-2">{idx + 1}.</span>
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Climate Risk Summary */}
        <section className="bg-white border border-oracle-border rounded-lg p-4">
          <SectionHeader
            title="Climate Risk Summary"
            detailsRoute="/company/:id/climate-risk"
            companyId={companyId}
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Unique ID</p>
              <p className="text-sm font-medium text-gray-900">{profileData.climateRisk.uniqueId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Emission Numbers</p>
              <p className="text-sm font-medium text-gray-900">{profileData.climateRisk.emissionNumbers}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Climate Sector Financed Emission</p>
              <p className="text-sm font-medium text-gray-900">{profileData.climateRisk.climateSectorFinancedEmission}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Intensity Numbers</p>
              <p className="text-sm font-medium text-gray-900">{profileData.climateRisk.intensityNumbers}</p>
            </div>
          </div>
        </section>

        {/* Approvals History */}
        <section className="bg-white border border-oracle-border rounded-lg p-4">
          <SectionHeader
            title="Approvals History"
            detailsRoute="/company/:id/approvals"
            companyId={companyId}
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Last Approval Activity</p>
              <p className="text-sm font-medium text-gray-900">{profileData.approvalsHistory.lastApprovalActivity}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Last Approval Date</p>
              <p className="text-sm font-medium text-gray-900">{profileData.approvalsHistory.lastApprovalDate}</p>
            </div>
          </div>
        </section>

        {/* Account Summary */}
        <section className="bg-white border border-oracle-border rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Summary</h3>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total Accounts</p>
              <p className="text-sm font-medium text-gray-900">{profileData.accountSummary.totalAccounts}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Accounts with Outstanding Dues</p>
              <p className="text-sm font-medium text-gray-900">{profileData.accountSummary.accountsWithOutstandingDues}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Accounts with Overdraft</p>
              <p className="text-sm font-medium text-gray-900">{profileData.accountSummary.accountsWithOverdraft}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Accounts at Delinquent</p>
              <p className="text-sm font-medium text-gray-900">{profileData.accountSummary.accountsAtDeliquent}</p>
            </div>
          </div>
        </section>
      </div>

      {/* Group Hierarchy Modal */}
      <GroupHierarchyModal
        isOpen={isHierarchyModalOpen}
        onClose={() => setIsHierarchyModalOpen(false)}
        groupName={company.group}
        currentCompanyId={companyId}
      />
    </div>
  );
}
