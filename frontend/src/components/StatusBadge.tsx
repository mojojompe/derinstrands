import React from 'react';

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const s = status.toLowerCase();
  
  let colorClass = 'bg-gray-100 text-gray-600';
  let dotClass = 'bg-gray-500';

  if (s === 'paid' || s === 'delivered' || s === 'in stock') {
    colorClass = 'bg-green-100 text-green-800';
    dotClass = 'bg-green-700';
  } else if (s === 'pending' || s === 'low stock') {
    colorClass = 'bg-orange-100 text-orange-800';
    dotClass = 'bg-orange-700';
  } else if (s === 'out of stock') {
    colorClass = 'bg-red-100 text-red-800';
    dotClass = 'bg-red-700';
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${colorClass}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
      {status}
    </span>
  );
};

export default StatusBadge;
