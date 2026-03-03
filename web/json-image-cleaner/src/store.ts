import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { AppState, ProcessedItem, FilterTab } from '@/types';
import { calculateItemStatus, calculateMetrics, getFilteredItems } from '@/utils/state';
import { validateImage } from '@/utils/image';
import { pLimit } from '@/utils/p-limit';
import { format } from 'date-fns';

const useAppStoreInternal = create<AppState & {
  setActiveTab: (tab: FilterTab) => void;
  toggleSelect: (id: number) => void;
  selectAllInTab: () => void;
  deselectAll: () => void;
  uploadJSON: (items: ProcessedItem[]) => void;
  startValidation: () => Promise<void>;
  updateImageStatus: (id: number, url: string, statusStr: 'valid' | 'broken') => void;
  exportSelected: () => void;
}>()(
  devtools(
    persist(
      (set, get) => ({
        items: [],
        activeTab: 'all',
        selected: [],
        isValidating: false,
        validationProgress: { current: 0, total: 0 },
        metrics: { total: 0, noImages: 0, anyValid: 0, allValid: 0, someBroken: 0, allBroken: 0, selectedCount: 0 },
        setActiveTab: (tab) => set({ activeTab: tab }),
        toggleSelect: (id) => {
          const state = get();
          const newSelected = state.selected.includes(id)
            ? state.selected.filter((x) => x !== id)
            : [...state.selected, id];
          set({ selected: newSelected });
        },
        selectAllInTab: () => {
          const state = get();
          const filtered = getFilteredItems(state.items, state.activeTab, state.selected);
          const newSelected = [...new Set([...state.selected, ...filtered.map((i) => i.id)])];
          set({ selected: newSelected });
        },
        deselectAll: () => set({ selected: [] }),
        uploadJSON: (items: ProcessedItem[]) => {
          const metrics = calculateMetrics(items, []);
          set({
            items,
            selected: [],
            activeTab: 'all',
            metrics,
            isValidating: false,
            validationProgress: { current: 0, total: 0 },
          });
        },
        updateImageStatus: (id: number, url: string, statusStr: 'valid' | 'broken') => {
          const state = get();
          const newItems = state.items.map((i) => {
            if (i.id !== id) return i;
            const newStatuses = {
              ...i.imageStatuses,
              [url]: { status: statusStr },
            };
            const validCount = Object.values(newStatuses).filter((s: any) => s.status === 'valid').length;
            const brokenCount = Object.values(newStatuses).filter((s: any) => s.status === 'broken').length;
            const status = calculateItemStatus({
              ...i,
              imageStatuses: newStatuses,
              validCount,
              brokenCount,
            });
            return {
              ...i,
              imageStatuses: newStatuses,
              validCount,
              brokenCount,
              status,
            };
          });
          const newMetrics = calculateMetrics(newItems, state.selected);
          const newProgress = {
            ...state.validationProgress,
            current: state.validationProgress.current + 1,
          };
          set({
            items: newItems,
            metrics: newMetrics,
            validationProgress: newProgress,
          });
          if (newProgress.current >= state.validationProgress.total) {
            set({ isValidating: false });
          }
        },
        startValidation: async () => {
          const state = get();
          const pending: Array<{id: number; url: string}> = [];
          let total = 0;
          for (const item of state.items) {
            for (const url of item.imageCandidates) {
              const st = item.imageStatuses[url];
              if (st === undefined || st.status === 'loading') {
                pending.push({ id: item.id, url });
                total++;
              }
            }
          }
          if (total === 0) return;
          set({
            isValidating: true,
            validationProgress: { current: 0, total },
          });
          const limit = pLimit(8);
          await Promise.all(
            pending.map(({ id, url }) =>
              limit(async () => {
                const statusStr = await validateImage(url);
                useAppStoreInternal.getState().updateImageStatus(id, url, statusStr);
              })
            )
          );
        },
        exportSelected: () => {
          const state = get();
          const selectedRaws = state.selected
            .map((id) => state.items.find((i) => i.id === id)?.raw)
            .filter(Boolean) as unknown[];
          const jsonStr = JSON.stringify(selectedRaws, null, 2);
          const filename = `json-image-cleaner-${format(new Date(), 'yyyyMMdd-HHmmss')}.json`;
          const blob = new Blob([jsonStr], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        },
      }),
      { name: 'json-image-cleaner-v2' }
    ),
    { name: 'json-image-cleaner' }
  )
);

export const useAppStore = useAppStoreInternal;
