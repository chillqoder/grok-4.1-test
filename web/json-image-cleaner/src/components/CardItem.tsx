'use client';

import { useState } from 'react';
import { useAppStore } from '@/store';
import type { ProcessedItem } from '@/types';

interface CardItemProps {
  item: ProcessedItem;
}

export function CardItem({ item }: CardItemProps) {
  const toggleSelect = useAppStore((s) => s.toggleSelect);
  const isSelected = useAppStore((s) => s.selected.includes(item.id));
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  const title = getTitle(item.raw) || `#${item.id}`;

  const firstImages = item.imageCandidates.slice(0, 4);
  const moreCount = item.imageCandidates.length - 4;

  const statusColor = {
    all_valid: 'bg-green-100 text-green-800',
    any_valid: 'bg-blue-100 text-blue-800',
    some_broken: 'bg-yellow-100 text-yellow-800',
    all_broken: 'bg-red-100 text-red-800',
    no_images: 'bg-gray-100 text-gray-600',
  }[item.status] || 'bg-gray-100 text-gray-600';

  return (
    <div className="bg-white rounded-xl shadow-md p-6 h-[320px] flex flex-col border hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg line-clamp-1">{title}</h3>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(item.id)} className="sr-only peer" />
          <div className="w-5 h-5 bg-gray-200 peer-checked:bg-teal-600 rounded-md flex items-center justify-center">
            <svg className="w-4 h-4 text-white hidden peer-checked:block" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </label>
      </div>

      {/* Status */}
      <div className={`px-3 py-1 rounded-full text-xs font-medium mb-4 w-fit ${statusColor}`}>
        {(() => {
          const loading = Object.values(item.imageStatuses).some((s: any) => s.status === 'loading');
          return item.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) + (loading ? ' (loading...)' : '');
        })()}
      </div>

      {/* Images */}
      <div className="flex-1 mb-4 overflow-hidden">
        <div className="grid grid-cols-2 gap-2 mb-2">
          {firstImages.map((url, i) => (
            <div key={i} className="relative w-full h-20 rounded-lg overflow-hidden bg-gray-100">
              <img 
                src={url} 
                alt={`Preview ${i+1}`}
                className="w-full h-full object-cover"
                onLoad={() => {/* valid */}}
                onError={(e) => e.currentTarget.style.display = 'none'}
              />
              <div className={`absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center text-xs ${item.imageStatuses[url]?.status === 'valid' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                ✓
              </div>
            </div>
          ))}
        </div>
        {moreCount > 0 && (
          <button onClick={() => setShowImageModal(true)} className="text-sm text-teal-600 hover:underline">
            +{moreCount} more images
          </button>
        )}
      </div>

      {/* JSON Preview */}
      <div className="flex-0 mb-4">
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{JSON.stringify(item.raw).slice(0,100)}...</p>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 pt-2 border-t border-gray-100">
        <button onClick={() => setShowJsonModal(true)} className="flex-1 px-3 py-2 text-xs text-teal-600 border border-teal-200 rounded-lg hover:bg-teal-50">
          View JSON
        </button>
      </div>

      {/* Modals */}
      {showJsonModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl max-h-[80vh] w-full overflow-auto">
            <div className="sticky top-0 bg-white p-6 border-b flex justify-between items-center">
              <h4>Full JSON</h4>
              <div className="flex gap-2">
                <button onClick={() => navigator.clipboard.writeText(JSON.stringify(item.raw, null, 2))}>Copy</button>
                <button onClick={() => setShowJsonModal(false)}>Close</button>
              </div>
            </div>
            <pre className="p-6 text-sm overflow-auto">{JSON.stringify(item.raw, null, 2)}</pre>
          </div>
        </div>
      )}

      {showImageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl max-h-[80vh] w-full overflow-auto">
            <div className="sticky top-0 bg-white p-6 border-b flex justify-between">
              <h4>Images ({item.imageCandidates.length})</h4>
              <button onClick={() => setShowImageModal(false)}>Close</button>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-6">
              {item.imageCandidates.map((url, i) => (
                <div key={i} className="relative">
                  <img src={url} alt="" className="w-full aspect-square object-cover rounded-lg" />
                  <div className="absolute top-1 right-1 text-xs">{item.imageStatuses[url]?.status || 'loading'}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getTitle(obj: unknown): string | null {
  if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
    const o = obj as Record<string, unknown>;
    if (typeof o.title === 'string') return o.title;
    if (typeof o.name === 'string') return o.name;
    if (typeof o.id === 'string') return o.id;
  }
  return null;
}
