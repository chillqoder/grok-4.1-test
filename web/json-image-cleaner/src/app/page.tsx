'use client';

import { UploadPanel } from '@/components/UploadPanel';
import { TabsBar } from '@/components/TabsBar';
import { MetricsPanel } from '@/components/MetricsPanel';
import { ActionBar } from '@/components/ActionBar';
import { CardsGrid } from '@/components/CardsGrid';
import { useAppStore } from '@/store';

export default function Home() {
  const items = useAppStore((state) => state.items);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">JSON Image Cleaner</h1>
        {items.length === 0 ? (
          <div className="flex justify-center">
            <UploadPanel />
          </div>
        ) : (
          <div className="space-y-0">
            <TabsBar />
            <MetricsPanel />
            <CardsGrid />
            <ActionBar />
          </div>
        )}
      </div>
    </main>
  );
}
