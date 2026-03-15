
export const SummarySkeleton = () => (
  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="bg-white border border-gray-100 p-6 rounded-2xl flex items-center space-x-4 shadow-sm">
        <div className="skeleton-circle" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-20 skeleton" />
          <div className="h-6 w-24 skeleton" />
        </div>
      </div>
    ))}
  </div>
);

export const TableSkeleton = () => (
  <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
    <div className="h-12 bg-gray-50 border-b border-gray-100 flex items-center px-6">
      <div className="h-4 w-full skeleton opacity-50" />
    </div>
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="h-16 border-b border-gray-50 flex items-center px-6 space-x-4">
        <div className="h-4 w-1/6 skeleton" />
        <div className="h-4 w-2/6 skeleton" />
        <div className="h-4 w-1/6 skeleton" />
        <div className="h-4 w-1/6 skeleton" />
        <div className="h-4 w-1/6 skeleton" />
      </div>
    ))}
  </div>
);

export const ChartSkeleton = () => (
  <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm h-[400px] flex flex-col justify-end space-y-4">
    <div className="flex justify-between items-end h-full px-4 space-x-4">
      {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
        <div key={i} style={{ height: `${h}%` }} className="flex-1 skeleton opacity-20 rounded-t-lg" />
      ))}
    </div>
    <div className="h-4 w-full skeleton opacity-30" />
  </div>
);
