import _isPlainObject from 'lodash-es/isPlainObject';
import _isArray from 'lodash-es/isArray';

export function extractImageCandidates(obj: unknown): string[] {
  const candidates: string[] = [];

  function recurse(current: unknown, path: string): void {
    if (typeof current === 'string') {
      if (isLikelyImageUrl(current)) {
        candidates.push(current);
      }
    } else if (_isPlainObject(current)) {
      for (const [key, value] of Object.entries(current as Record<string, unknown>)) {
        recurse(value, `${path ? path + '.' : ''}${key}`);
      }
    } else if (_isArray(current)) {
      (current as unknown[]).forEach((item, index) => {
        recurse(item, `${path ? path + '[' : ''}${index}${path ? ']' : ''}`);
      });
    }
  }

  recurse(obj, '');
  return [...new Set(candidates)]; // dedupe
}

export function isLikelyImageUrl(url: string): boolean {
  const hasHttp = /^https?:\/\//i.test(url);
  if (!hasHttp) return false;
  const hasImageExt = /\.(jpe?g|png|gif|webp|avif|bmp)(\?.*)?$/i.test(url);
  return hasImageExt || url.length < 200; // attempt short URLs
}

const imageCache = new Map<string, Promise<'valid' | 'broken'>>();

export async function validateImage(url: string, timeoutMs = 8000): Promise<'valid' | 'broken'> {
  if (imageCache.has(url)) {
    return await imageCache.get(url)!;
  }

  const promise = new Promise<'valid' | 'broken'>((resolve) => {
    const img = new Image();
    let done = false;

    const timer = setTimeout(() => {
      if (!done) {
        done = true;
        resolve('broken');
      }
    }, timeoutMs);

    img.onload = () => {
      if (!done) {
        done = true;
        clearTimeout(timer);
        resolve('valid');
      }
    };

    img.onerror = () => {
      if (!done) {
        done = true;
        clearTimeout(timer);
        resolve('broken');
      }
    };

    img.src = url;
  });

  imageCache.set(url, promise);
  return await promise;
}
