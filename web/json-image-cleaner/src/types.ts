export interface ImageStatus {
  status: 'loading' | 'valid' | 'broken';
  error?: string;
}

export interface ProcessedItem {
  id: number;
  raw: unknown;
  imageCandidates: string[];
  imageStatuses: Record<string, ImageStatus>;
  totalImages: number;
  validCount: number;
  brokenCount: number;
  status: 'all_valid' | 'any_valid' | 'some_broken' | 'all_broken' | 'no_images';
}

export type FilterTab = 'all' | 'all_valid' | 'any_valid' | 'some_broken' | 'all_broken' | 'no_images' | 'selected';

export interface AppState {
  items: ProcessedItem[];
  activeTab: FilterTab;
  selected: number[];
  isValidating: boolean;
  validationProgress: { current: number; total: number };
  metrics: {
    total: number;
    noImages: number;
    anyValid: number;
    allValid: number;
    someBroken: number;
    allBroken: number;
    selectedCount: number;
  };
}