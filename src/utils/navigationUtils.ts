
import { NavigationItem } from "@/types/navigation";

export function isActiveRoute(currentPath: string, path: string): boolean {
  if (path === "/") {
    return currentPath === path;
  }
  return currentPath.startsWith(path);
}

export function isChildRouteActive(item: NavigationItem, currentPath: string): boolean {
  if (!item.children) return false;
  return item.children.some(child => isActiveRoute(currentPath, child.href));
}

export function getActiveNavigationItem(items: NavigationItem[], currentPath: string) {
  const rootItem = items.find(item => {
    if (currentPath === "/") {
      return item.href === "/";
    }
    const pathSegment = `/${currentPath.split('/')[1]}`;
    return item.href === pathSegment;
  });
  
  return rootItem;
}
