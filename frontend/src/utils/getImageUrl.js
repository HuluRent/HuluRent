export function getImageUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  
  // Ensure we use the base API URL for relative paths
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
  // VITE_API_BASE_URL usually includes /api, so we should strip it if the static files are served at the root
  const origin = new URL(baseUrl).origin; 
  return `${origin}${path.startsWith('/') ? '' : '/'}${path}`;
}
