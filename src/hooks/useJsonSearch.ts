import { useMemo } from "react";

export function useJsonSearch(data: unknown, query: string) {
  const normalizedQuery = query.toLowerCase().trim();

  const searchResults = useMemo(() => {
    if (!normalizedQuery) return { paths: new Set<string>(), count: 0 };

    const foundPaths = new Set<string>();
    let matchCount = 0;

    const search = (obj: unknown, path: string) => {
      let isMatch = false;

      // Check primitives
      if (typeof obj === "string" || typeof obj === "number" || typeof obj === "boolean") {
        if (String(obj).toLowerCase().includes(normalizedQuery)) {
          foundPaths.add(path);
          matchCount++;
          isMatch = true;
        }
      }

      // Check objects/arrays
      if (obj !== null && typeof obj === "object") {
        const entries = Object.entries(obj);
        for (const [key, value] of entries) {
          const currentPath = path === "root" ? key : `${path}.${key}`;
          
          // Check key match
          if (key.toLowerCase().includes(normalizedQuery)) {
            foundPaths.add(currentPath);
            matchCount++;
            isMatch = true;
          }

          // Check children match
          if (search(value, currentPath)) {
            isMatch = true;
          }
        }
      }

      if (isMatch) {
        foundPaths.add(path);
      }
      return isMatch;
    };

    search(data, "root");
    return { paths: foundPaths, count: matchCount };
  }, [data, normalizedQuery]);

  return searchResults;
}
