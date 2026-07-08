export const getApiUrl = (path: string): string => {
  // Siempre usamos el mismo host y puerto del frontend.
  // La redirección al backend se maneja mediante el proxy de Vite (en desarrollo) o Nginx (en producción).
  return `${window.location.protocol}//${window.location.host}${path}`;
};
