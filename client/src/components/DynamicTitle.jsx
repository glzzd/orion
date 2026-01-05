import { useEffect } from "react";
import { useLocation, matchPath } from "react-router-dom";
import { MENUITEMS } from "@/consts/menuItems";
import { ALL_ROUTES } from "@/consts/routes";

const flattenMenuItems = (items) => {
  let routes = [];
  items.forEach((item) => {
    if (item.path) {
      routes.push({ path: item.path, title: item.title });
    }
    if (item.children) {
      routes = [...routes, ...flattenMenuItems(item.children)];
    }
  });
  return routes;
};

const getStaticRoutes = () => {
  const publicRoutes = ALL_ROUTES.public.map((r) => ({
    path: r.path,
    title: r.name,
  }));
  const privateRoutes = ALL_ROUTES.private.map((r) => ({
    path: r.path,
    title: r.name,
  }));
  return [...publicRoutes, ...privateRoutes];
};

// Define routes that are not in the menu or have dynamic parameters that need specific titles
const EXTRA_ROUTES = [
  { path: "/admin/users/edit/:id", title: "İstifadəçi Redaktə" },
  { path: "/admin/organizations/:id", title: "Qurum Detalları" },
  { path: "/admin/organizations/:id/structure", title: "Qurum Strukturu" },
  { path: "/human-resources/employees/new", title: "Yeni Əməkdaş" },
];

export default function DynamicTitle() {
  const location = useLocation();

  useEffect(() => {
    const menuRoutes = flattenMenuItems(MENUITEMS);
    const staticRoutes = getStaticRoutes();
    const allRoutes = [...EXTRA_ROUTES, ...menuRoutes, ...staticRoutes];

    const currentPath = location.pathname;
    
    // Find the first matching route
    // We prioritize exact matches first, then patterns
    const matchedRoute = allRoutes.find((route) =>
      matchPath({ path: route.path, end: true }, currentPath)
    );

    if (matchedRoute && matchedRoute.title) {
      document.title = `${matchedRoute.title} | ORION`;
    } else {
      document.title = "ORION";
    }
  }, [location]);

  return null;
}
