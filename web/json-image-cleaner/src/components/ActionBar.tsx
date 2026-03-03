'use client';

import { useAppStore } from '@/store';

export function ActionBar() {
  const isValidating = useAppStore((s) => s.isValidating);
  const startValidation = useAppStore((s) => s.startValidation);
  const selectAllInTab = useAppStore((s) => s.selectAllInTab);
  const selectedCount = useAppStore((s) => s.metrics.selectedCount);

  return (
    <div className="flex gap-2 p-4 bg-white border-t border-gray-200">
      <button 
        onClick={selectAllInTab}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
      >
        Select all in tab
      </button>
      <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
        Select all any valid
      </button>
      <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
        Select all valid only
      </button>
      <button className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100">
        Deselect all
      </button>
      <button 
        disabled={selectedCount === 0}
        className="px-4 py-2 text-sm font-bold text-white bg-teal-600 rounded-lg hover:bg-teal-700 disabled:opacity-50"
      >
        Export selected ({selectedCount})
      </button>
      {isValidating && (
        <button onClick={startValidation} className="px-4 py-2 text-sm font-medium text-teal-600 bg-teal-50 rounded-lg">
          Re-scan
        </button>
      )}
    </div>
  );
}
