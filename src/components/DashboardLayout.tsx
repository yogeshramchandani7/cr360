import { Outlet, NavLink, useLocation } from 'react-router-dom';
import FilterBar from './FilterBar';
import ChatWidget from './chat/ChatWidget';

export default function DashboardLayout() {
  const location = useLocation();
  const isCompanyPage = location.pathname.startsWith('/company/');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">CR360</h1>
          <p className="text-sm text-gray-600">Credit Risk Dashboard</p>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-t border-gray-200">
          <nav className="flex space-x-8">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/portfolio"
              className={({ isActive }) =>
                `py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`
              }
            >
              Portfolio View
            </NavLink>
            {isCompanyPage && (
              <NavLink
                to={location.pathname}
                className="py-4 px-1 border-b-2 border-primary text-primary font-medium text-sm transition-colors"
              >
                Company Profile
              </NavLink>
            )}
          </nav>
        </div>
      </header>

      {/* Filter Bar */}
      <FilterBar />

      {/* Main Content */}
      <main className="p-6">
        <Outlet />
      </main>

      {/* AI Chatbot Widget */}
      <ChatWidget />
    </div>
  );
}
