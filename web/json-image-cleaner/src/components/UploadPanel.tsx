'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAppStore } from '@/store';
import { extractImageCandidates } from '@/utils/image';
import type { ProcessedItem } from '@/types';
interface UploadPanelProps {}

export function UploadPanel() {
  const uploadJSON = useAppStore((state) => state.uploadJSON);
  const items = useAppStore((state) => state.items.length);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file || !file.name.endsWith('.json')) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (!Array.isArray(data)) {
          alert('Root must be an array');
          return;
        }
        // Process to ProcessedItems
        const processed: ProcessedItem[] = data.map((raw: unknown, id: number) => ({
          id,
          raw,
          imageCandidates: extractImageCandidates(raw),
          imageStatuses: {},
          totalImages: 0,
          validCount: 0,
          brokenCount: 0,
          status: 'no_images' as const,
        }));
        processed.forEach(item => {
          item.totalImages = item.imageCandidates.length;
          item.status = item.totalImages === 0 ? 'no_images' : 'some_broken';
          item.imageCandidates.forEach(url => {
            item.imageStatuses[url] = { status: 'loading' };
          });
        });
        uploadJSON(processed);
        // Auto start validation
        setTimeout(() => {
          useAppStore.getState().startValidation();
        }, 100);
      } catch (err) {
        alert('Invalid JSON');
      }
    };
    reader.readAsText(file);
  }, [uploadJSON]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/json': ['.json'] },
    multiple: false,
  });

  if (items > 0) return null; // hide after upload

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-teal-400 transition-colors"
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop JSON here...</p>
      ) : (
        <p>Drag & drop JSON file or click to select (.json only)</p>
      )}
    </div>
  );
}
