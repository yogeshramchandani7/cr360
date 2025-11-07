import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/Dashboard';
import AgentPage from './pages/AgentPage';
import CustomerView from './pages/CustomerView';
import CompanyProfilePage from './pages/CompanyProfilePage';
import RiskDetailsPage from './pages/details/RiskDetailsPage';
import ExposureDetailsPage from './pages/details/ExposureDetailsPage';
import GroupExposuresPage from './pages/details/GroupExposuresPage';
import ProfitabilityPage from './pages/details/ProfitabilityPage';
import ClimateRiskPage from './pages/details/ClimateRiskPage';
import ApprovalsPage from './pages/details/ApprovalsPage';
import AlertDashboard from './pages/AlertDashboard';
import KPIDrilldownPage from './pages/KPIDrilldownPage';
import ChatWidget from './components/chat/ChatWidget';
import { initializeAlertMonitoring } from './lib/alertGenerator';

function App() {
  // Initialize alert monitoring system on app startup
  useEffect(() => {
    const cleanup = initializeAlertMonitoring();
    return cleanup;
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="agent" element={<AgentPage />} />
          <Route path="customer" element={<CustomerView />} />
          <Route path="alerts" element={<AlertDashboard />} />
          <Route path="company/:companyId" element={<CompanyProfilePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>

        {/* Detail pages - open in new tabs */}
        <Route path="/kpi/:kpiId" element={<KPIDrilldownPage />} />
        <Route path="/company/:companyId/risk-details" element={<RiskDetailsPage />} />
        <Route path="/company/:companyId/exposure-details" element={<ExposureDetailsPage />} />
        <Route path="/company/:companyId/group-exposures" element={<GroupExposuresPage />} />
        <Route path="/company/:companyId/profitability" element={<ProfitabilityPage />} />
        <Route path="/company/:companyId/climate-risk" element={<ClimateRiskPage />} />
        <Route path="/company/:companyId/approvals" element={<ApprovalsPage />} />
      </Routes>

      {/* AI Chatbot Widget - Available on all pages */}
      <ChatWidget />
    </BrowserRouter>
  );
}

export default App;
