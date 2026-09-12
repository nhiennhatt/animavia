export const isPartOfPath = (path: string, basePath: string) => {
  if (path === basePath) return true;
  if (!path.startsWith(basePath)) return false;

  const nextChar = path[basePath.length];
  return ["/", "?", "#"].includes(nextChar);
};
