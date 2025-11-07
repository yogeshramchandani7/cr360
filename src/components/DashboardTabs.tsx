import { useSearchParams } from 'react-router-dom';
import { BarChart3 } from 'lucide-react';

export type DashboardTab = 'dashboard';

interface Tab {
  id: DashboardTab;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const tabs: Tab[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <BarChart3 className="w-5 h-5" />,
    description: 'Portfolio health, exposures, and risk metrics',
  },
];

interface DashboardTabsProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
}

export default function DashboardTabs({ activeTab, onTabChange }: DashboardTabsProps) {
  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="flex space-x-1 px-6">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex items-center gap-2 px-6 py-4 border-b-2 transition-all duration-200
                ${
                  isActive
                    ? 'border-blue-600 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }
              `}
            >
              <span className={isActive ? 'text-blue-600' : 'text-gray-500'}>
                {tab.icon}
              </span>
              <div className="flex flex-col items-start">
                <span className="font-semibold text-sm">{tab.label}</span>
                <span className="text-xs text-gray-500">{tab.description}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Custom hook to manage tab state with URL persistence
export function useDashboardTab(): [DashboardTab, (tab: DashboardTab) => void] {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = (searchParams.get('tab') as DashboardTab) || 'dashboard';

  const setActiveTab = (tab: DashboardTab) => {
    setSearchParams({ tab });
  };

  return [activeTab, setActiveTab];
}
