import { Bell } from 'lucide-react';
import { useAlertStore } from '../stores/alertStore';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

export default function AlertBell() {
  const navigate = useNavigate();
  const unreadCount = useAlertStore((state) => state.getUnreadCount());
  const criticalCount = useAlertStore((state) => state.getCriticalCount());

  const handleClick = () => {
    navigate('/alerts');
  };

  return (
    <button
      onClick={handleClick}
      className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
      title={`${unreadCount} unread alerts`}
    >
      <Bell
        className={cn('w-6 h-6', criticalCount > 0 ? 'text-red-600 animate-pulse' : 'text-gray-700')}
      />
      {unreadCount > 0 && (
        <span
          className={cn(
            'absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white rounded-full',
            criticalCount > 0 ? 'bg-red-600' : 'bg-blue-600'
          )}
        >
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </button>
  );
}
