import { API_URL } from "./requests";

/**
 * Resolves a profile picture URL, prepending the API_URL if it's a relative path.
 * Also handles legacy hardcoded localhost URLs.
 */
export const resolveProfilePicture = (path: string | null | undefined) => {
  if (!path) return null;

  // Handle absolute URLs (including old hardcoded ones)
  if (path.startsWith("http")) {
    return path.replace("http://localhost:8000", API_URL);
  }

  // Prepend API_URL to relative paths
  return `${API_URL}${path.startsWith("/") ? "" : "/"}${path}`;
};
