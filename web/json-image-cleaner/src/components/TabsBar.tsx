'use client';

import { useAppStore } from '@/store';
import type { FilterTab } from '@/types';

const tabs: { label: string; value: FilterTab }[] = [
  { label: 'All', value: 'all' },
  { label: 'All valid', value: 'all_valid' },
  { label: 'Any valid', value: 'any_valid' },
  { label: 'Some broken', value: 'some_broken' },
  { label: 'All broken', value: 'all_broken' },
  { label: 'No images', value: 'no_images' },
  { label: 'Selected', value: 'selected' },
];

export function TabsBar() {
  const activeTab = useAppStore((s) => s.activeTab);
  const setActiveTab = useAppStore((s) => s.setActiveTab);

  return (
    <div className="flex border-b border-gray-200 bg-white">
      {tabs.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => setActiveTab(value)}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === value
              ? 'border-b-2 border-teal-500 text-teal-600'
              : 'text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
