export const getApiUrl = (path: string): string => {
  const isDev = window.location.port === '5173'; // Vite dev server
  const host = isDev ? `${window.location.hostname}:3000` : window.location.host;
  return `${window.location.protocol}//${host}${path}`;
};
