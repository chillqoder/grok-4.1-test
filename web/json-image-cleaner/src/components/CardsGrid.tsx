'use client';

import { useMemo } from 'react';
import { useAppStore } from '@/store';
import { CardItem } from './CardItem';
import type { ProcessedItem, FilterTab } from '@/types';

export function CardsGrid() {
  const items = useAppStore((s) => s.items);
  const activeTab = useAppStore((s) => s.activeTab);
  const selected = useAppStore((s) => s.selected);

  const filteredItems = useMemo(() => {
    const f: ProcessedItem[] = [];
    for (const item of items) {
      let match = false;
      switch (activeTab) {
        case 'all':
          match = true;
          break;
        case 'all_valid':
          match = item.status === 'all_valid';
          break;
        case 'any_valid':
          match = item.status === 'any_valid' || item.status === 'all_valid';
          break;
        case 'some_broken':
          match = item.status === 'some_broken';
          break;
        case 'all_broken':
          match = item.status === 'all_broken';
          break;
        case 'no_images':
          match = item.status === 'no_images';
          break;
        case 'selected':
          match = selected.includes(item.id);
          break;
      }
      if (match) f.push(item);
    }
    return f;
  }, [items, activeTab, selected]);

  if (filteredItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
        <p className="text-xl mb-2">No items match this filter</p>
        <p>Try another tab</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredItems.map((item) => (
        <CardItem key={item.id} item={item} />
      ))}
    </div>
  );
}
