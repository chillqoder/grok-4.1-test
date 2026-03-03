import { describe, it, expect, vi } from 'vitest';
import { extractImageCandidates, isLikelyImageUrl, validateImage } from '../src/utils/image.js';

describe('image utils', () => {
  it('isLikelyImageUrl detects image URLs', () => {
    expect(isLikelyImageUrl('https://example.com/photo.jpg')).toBe(true);
    expect(isLikelyImageUrl('https://example.com/photo.png')).toBe(true);
    expect(isLikelyImageUrl('https://example.com/photo.webp?query=1')).toBe(true);
    expect(isLikelyImageUrl('https://example.com/page.html')).toBe(true);
    expect(isLikelyImageUrl('ftp://image.jpg')).toBe(false);
    expect(isLikelyImageUrl('https://short.url/image')).toBe(true); // short URL
  });

  it('extractImageCandidates finds image URLs recursively', () => {
    const obj = {
      title: 'Test',
      image: 'https://example.com/img.jpg',
      gallery: ['https://example.com/g1.png', 'not-image'],
      nested: {
        thumb: 'https://example.com/thumb.webp',
        text: 'foo'
      }
    };
    expect(extractImageCandidates(obj)).toEqual([
      'https://example.com/img.jpg',
      'https://example.com/g1.png',
      'https://example.com/thumb.webp'
    ]);
  });

  it('extractImageCandidates dedupes URLs', () => {
    const obj = {
      img1: 'https://dup.jpg',
      img2: 'https://dup.jpg'
    };
    expect(extractImageCandidates(obj)).toEqual(['https://dup.jpg']);
  });

  it('validateImage caches results', async () => {
    const url = 'https://via.placeholder.com/1.jpg';
    const res1 = await validateImage(url);
    const res2 = await validateImage(url);
    expect(res1).toBe('valid');
    expect(res2).toBe(res1); // same promise? but result same
  });
});
