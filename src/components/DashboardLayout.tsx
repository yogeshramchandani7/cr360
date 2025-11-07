import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { User } from 'lucide-react';
import FilterBar from './FilterBar';
import AlertBell from './AlertBell';

export default function DashboardLayout() {
  const location = useLocation();
  const isCompanyPage = location.pathname.startsWith('/company/');

  // Show FilterBar only on Customer View and Company Profile pages (not on Dashboard)
  const showFilterBar = location.pathname === '/customer' || isCompanyPage;

  return (
    <div className="min-h-screen bg-oracle-bg">
      {/* Header */}
      <header className="bg-oracle-navy border-b border-oracle-darkNavy">
        {/* Top Bar */}
        <div className="px-6 py-3 flex items-center justify-between">
          {/* Left side: Logo + Title */}
          <div className="flex items-center gap-4">
            <img src="/favicon.png" alt="Oracle" className="h-8" />
            <h1 className="text-lg font-semibold text-white">
              CR360 - Credit Risk Analytics
            </h1>
          </div>

          {/* Right side: Alerts + User Profile */}
          <div className="flex items-center gap-3">
            <AlertBell />
            <span className="text-sm text-gray-300">GUEST</span>
            <div className="w-8 h-8 rounded-full bg-oracle-red flex items-center justify-center text-white">
              <User className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-t border-oracle-darkNavy">
          <nav className="flex space-x-8">
            <NavLink
              to="/agent"
              className={({ isActive }) =>
                `py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  isActive
                    ? 'border-white text-white'
                    : 'border-transparent text-gray-300 hover:text-white hover:border-gray-500'
                }`
              }
            >
              Agent
            </NavLink>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  isActive
                    ? 'border-white text-white'
                    : 'border-transparent text-gray-300 hover:text-white hover:border-gray-500'
                }`
              }
            >
              Portfolio
            </NavLink>
            <NavLink
              to="/customer"
              className={({ isActive }) =>
                `py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  isActive
                    ? 'border-white text-white'
                    : 'border-transparent text-gray-300 hover:text-white hover:border-gray-500'
                }`
              }
            >
              Customer View
            </NavLink>
            {isCompanyPage && (
              <NavLink
                to={location.pathname}
                className="py-4 px-1 border-b-2 border-white text-white font-medium text-sm transition-colors"
              >
                Company Profile
              </NavLink>
            )}
          </nav>
        </div>
      </header>

      {/* Filter Bar - Only show on Customer View and Company Profile pages */}
      {showFilterBar && <FilterBar />}

      {/* Main Content */}
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
