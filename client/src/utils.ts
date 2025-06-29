export function getServerHost(): string {
  if (import.meta.env.DEV && import.meta.env.VITE_SERVER_HOST) {
    return import.meta.env.VITE_SERVER_HOST;
  }
  return `${window.location.origin}${window.location.pathname}`;
}

export function withServerHost(path: string): string {
  if (path.startsWith("/")) {
    path = path.substring(1);
  }
  return `${getServerHost()}/${path}`;
}
