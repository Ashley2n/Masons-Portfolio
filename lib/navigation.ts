const trimTrailingSlash = (path: string) =>
  path.length > 1 ? path.replace(/\/+$/, "") : path;

/** Whether a nav link to `href` should be highlighted on `pathname`. */
export const isActivePath = (pathname: string, href: string) => {
  const current = trimTrailingSlash(pathname);
  if (href === "/") return current === "/";
  return current === href || current.startsWith(`${href}/`);
};
