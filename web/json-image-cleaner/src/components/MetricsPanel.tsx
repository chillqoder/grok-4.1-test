'use client';

import { useAppStore } from '@/store';
import { TabsBar } from './TabsBar';

export function MetricsPanel() {
  const metrics = useAppStore((s) => s.metrics);
  const setActiveTab = useAppStore((s) => s.setActiveTab);

  const tabMap = {
    all: metrics.total,
    'all_valid': metrics.allValid,
    any_valid: metrics.anyValid,
    some_broken: metrics.someBroken,
    all_broken: metrics.allBroken,
    no_images: metrics.noImages,
    selected: metrics.selectedCount,
  } as const;

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
      <div className="flex gap-6 text-sm">
        <button onClick={() => setActiveTab('no_images')} className="text-gray-600 hover:text-teal-600">
          No images: {metrics.noImages}
        </button>
        <button onClick={() => setActiveTab('any_valid')} className="text-gray-600 hover:text-teal-600">
          Any valid: {metrics.anyValid}
        </button>
        <button onClick={() => setActiveTab('all_valid')} className="text-teal-600 font-medium">
          All valid: {metrics.allValid}
        </button>
        <button onClick={() => setActiveTab('some_broken')} className="text-gray-600 hover:text-teal-600">
          Some broken: {metrics.someBroken}
        </button>
        <button onClick={() => setActiveTab('all_broken')} className="text-red-600 font-medium">
          All broken: {metrics.allBroken}
        </button>
        <span>Selected: {metrics.selectedCount}</span>
      </div>
    </div>
  );
}
