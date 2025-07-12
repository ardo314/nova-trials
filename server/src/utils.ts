/**
 * Get the base path for the application.
 * This function retrieves the base path from the environment variable `BASE_PATH`.
 * If the base path does not start with a slash, it prepends one.
 * If the base path ends with a slash, it removes the trailing slash.
 * @returns The base path for the application, ensuring it starts with a slash and does not end with one.
 */
function getBasePath() {
  let basePath = process.env.BASE_PATH || "";
  if (!basePath.startsWith("/")) {
    basePath = `/${basePath}`;
  }
  if (basePath.endsWith("/")) {
    return basePath.slice(0, -1);
  }
  return basePath;
}

export function withBasePath(path: string) {
  if (path.startsWith("/")) {
    path = path.substring(1);
  }

  return `${getBasePath()}/${path}`;
}
