/**
 * Utility functions for handling YouTube links and attachments
 */

export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const cleanUrl = url.trim();

  // Handle standard watch?v=
  if (cleanUrl.includes('youtube.com/watch')) {
    const match = cleanUrl.match(/[?&]v=([^&]+)/);
    if (match && match[1]) return match[1];
  }

  // Handle youtu.be/
  if (cleanUrl.includes('youtu.be/')) {
    const match = cleanUrl.match(/youtu\.be\/([^?&]+)/);
    if (match && match[1]) return match[1];
  }

  // Handle youtube.com/embed/
  if (cleanUrl.includes('youtube.com/embed/')) {
    const match = cleanUrl.match(/embed\/([^?&]+)/);
    if (match && match[1]) return match[1];
  }

  // Handle youtube.com/shorts/
  if (cleanUrl.includes('youtube.com/shorts/')) {
    const match = cleanUrl.match(/shorts\/([^?&]+)/);
    if (match && match[1]) return match[1];
  }

  return null;
}

export function getYouTubeThumbnail(url: string, quality: 'default' | 'hq' | 'max' = 'hq'): string | null {
  const id = extractYouTubeId(url);
  if (!id) return null;
  if (quality === 'max') return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
  if (quality === 'default') return `https://img.youtube.com/vi/${id}/default.jpg`;
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

export function getYouTubeEmbedUrl(url: string, autoplay: boolean = true): string {
  const id = extractYouTubeId(url);
  if (!id) return url;
  return `https://www.youtube.com/embed/${id}?autoplay=${autoplay ? 1 : 0}&rel=0&modestbranding=1`;
}

export function isValidYouTubeUrl(url: string): boolean {
  return extractYouTubeId(url) !== null;
}
