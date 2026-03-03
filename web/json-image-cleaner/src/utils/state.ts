import type { ProcessedItem, FilterTab, AppState } from '@/types';

export function calculateItemStatus(item: ProcessedItem): ProcessedItem['status'] {
  if (item.totalImages === 0) return 'no_images';
  if (item.validCount === item.totalImages) return 'all_valid';
  if (item.validCount > 0) return 'any_valid';
  if (item.brokenCount === item.totalImages) return 'all_broken';
  return 'some_broken';
}

export function calculateMetrics(items: ProcessedItem[], selected: number[]): AppState['metrics'] {
  return {
    total: items.length,
    noImages: items.filter(i => i.status === 'no_images').length,
    anyValid: items.filter(i => i.status === 'any_valid' || i.status === 'all_valid').length,
    allValid: items.filter(i => i.status === 'all_valid').length,
    someBroken: items.filter(i => i.status === 'some_broken').length,
    allBroken: items.filter(i => i.status === 'all_broken').length,
    selectedCount: selected.size,
  };
}

export function getFilteredItems(items: ProcessedItem[], activeTab: FilterTab, selected: Set<number>): ProcessedItem[] {
  return items.filter(item => {
    switch (activeTab) {
      case 'all': return true;
      case 'all_valid': return item.status === 'all_valid';
      case 'any_valid': return item.status === 'any_valid' || item.status === 'all_valid';
      case 'some_broken': return item.status === 'some_broken';
      case 'all_broken': return item.status === 'all_broken';
      case 'no_images': return item.status === 'no_images';
      case 'selected': return selected.includes(item.id);
      default: return true;
    }
  });
}
