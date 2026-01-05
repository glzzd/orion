import { NavLink, useLocation } from "react-router-dom";
import { MENUITEMS } from "@/consts/menuItems";
import { PERMISSIONS } from "@/consts/permissions";
import { useAuth } from "@/hooks/useAuth";
import {
  Home,
  Users,
  UserPlus,
  UserMinus,
  UserCog,
  Building,
  Building2,
  Briefcase,
  BadgeCheck,
  ClipboardList,
  Table,
  Clock,
  Calendar,
  CalendarDays,
  ArrowLeftRight,
  Banknote,
  Trophy,
  Ban,
  Scale,
  BarChart3,
  LineChart,
  GraduationCap,
  BookOpen,
  Folder,
  FileText,
  FileBarChart,
  Heart,
  Stethoscope,
  ShieldCheck,
  RefreshCcw,
  Lock,
  Settings,
  Plus,
  List,
  Activity,
  Shield,
  FileKey
} from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu.jsx";
import { ShoppingCart } from "lucide-react";
import { Truck } from "lucide-react";
import { Package } from "lucide-react";
import { Box } from "lucide-react";
import { Tag } from "lucide-react";
import { Archive } from "lucide-react";
import { Upload } from "lucide-react";

const ICONS = {
  // =====================
  // CORE
  // =====================
  home: Home,

  // =====================
  // USERS / HR
  // =====================
  users: Users,
  people: Users,
  "user-plus": UserPlus,
  "user-minus": UserMinus,
  "user-cog": UserCog,

  // =====================
  // STRUCTURE
  // =====================
  building: Building,
  "building-office": Building2,
  "office-building": Building2,
  briefcase: Briefcase,
  "badge-check": BadgeCheck,
  table: Table,

  // =====================
  // ATTENDANCE & TIME
  // =====================
  clock: Clock,
  "clock-plus": Clock,
  calendar: Calendar,
  "calendar-days": CalendarDays,
  "arrows-right-left": ArrowLeftRight,

  // =====================
  // PAYROLL
  // =====================
  banknotes: Banknote,

  // =====================
  // DISCIPLINE
  // =====================
  trophy: Trophy,
  ban: Ban,
  scale: Scale,

  // =====================
  // PERFORMANCE
  // =====================
  "chart-bar": BarChart3,
  "chart-line": LineChart,

  // =====================
  // LEARNING
  // =====================
  "academic-cap": GraduationCap,
  "book-open": BookOpen,
  certificate: GraduationCap,

  // =====================
  // DOCUMENTS & REPORTS
  // =====================
  folder: Folder,
  "document-text": FileText,
  "document-report": FileBarChart,

  // =====================
  // WELLBEING
  // =====================
  heart: Heart,
  medical: Stethoscope,
  insurance: ShieldCheck,

  // =====================
  // MISC
  // =====================
  refresh: RefreshCcw,
  "shield-check": ShieldCheck,
  "lock-closed": Lock,
  settings: Settings,
  plus: Plus,
  list: List,
  activity: Activity,
  shield: Shield,
  "file-key": FileKey,
  cog: Settings,

  // =====================
  // PURCHASE
  // =====================
  "shopping-cart": ShoppingCart,
  truck: Truck,
  package: Package,
  clipboard: Clipboard,
  box: Box,
  tag: Tag,
  archive: Archive,
  upload: Upload
};

function hasAccess(rbac, userPerms) {
  if (!rbac) return true;
  const set = new Set(userPerms);
  if (rbac.all && !rbac.all.every((p) => set.has(p))) return false;
  if (rbac.any && !rbac.any.some((p) => set.has(p))) return false;
  return true;
}

export default function Navbar() {
  const { user } = useAuth();
  const perms = user?.permissions || [];
  const location = useLocation();

  return (
    <NavigationMenu viewport={true} className="text-white w-full">
      <NavigationMenuList className="gap-3">
        {MENUITEMS.map((item) => {
          // 1. Check parent access first
          if (!hasAccess(item.rbac, perms)) return null;

          const groups = (item.children || []).filter(
            (g) => hasAccess(g.rbac, perms) || (g.children || []).some((cc) => hasAccess(cc.rbac, perms))
          );

          // 2. If parent implies a dropdown (has children) but no children are accessible, hide it
          if (item.children && item.children.length > 0 && groups.length === 0) return null;

          const Icon = ICONS[item.icon];
          const groupPaths = [];
          groups.forEach((g) => {
            if (g.path) groupPaths.push(g.path);
            (g.children || []).forEach((c) => {
              if (hasAccess(c.rbac, perms) && c.path) groupPaths.push(c.path);
            });
          });
          const parentActive = (item.path && location.pathname.startsWith(item.path)) || groupPaths.some((p) => location.pathname.startsWith(p));

          return (
            <NavigationMenuItem key={item.id}>
              {groups.length > 0 ? (
                <>
                
                  <NavigationMenuTrigger className={`relative group bg-transparent flex flex-col items-center justify-center gap-1 h-12 px-4 py-0 hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent data-[state=open]:hover:bg-transparent after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[2px] after:bg-[#EFAF00] ${parentActive ? "text-[#EFAF00] after:opacity-100" : "text-white after:opacity-0"} hover:text-[#EFAF00] hover:after:opacity-100`}>
                    <span className="block leading-none">
                      {Icon ? <Icon size={20} className="transition-colors" /> : null}
                    </span>
                    <span className="text-xs font-medium leading-none">{item.title}</span>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="bg-[#fff] p-6 ring-1 ring-white/10 rounded-md  w-full">
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-6 [&>div]:min-w-0 md:[&>div]:pr-6 [&>div]:border-r [&>div]:border-[#124459]/10 [&>div:nth-child(6n)]:border-r-0 md:[&>div:nth-child(6n)]:border-r-0">
                      {groups.map((group) => {
                        const GroupIcon = ICONS[group.icon];
                        const groupChildren = (group.children || []).filter((c) => hasAccess(c.rbac, perms));
                        const isHeader = !group.path;
                        if (isHeader) {
                          return (
                            <div key={group.id} className="min-w-0 mb-8">
                              <div className="flex items-center gap-2 text-md font-bold uppercase tracking-wider text-[#124459]/80">
                                <span>{group.title}</span>
                              </div>
                              <div className="mt-2 border-t border-white/10" />
                              <ul className="mt-2 space-y-1.5">
                                {groupChildren.map((c) => {
                                  const CIcon = ICONS[c.icon];
                                  return (
                                    <li key={c.id}>
                                      <NavLink
                                        to={c.path}
                                        className={({ isActive }) =>
                                          `flex items-center gap-3 rounded-md px-3 py-2 hover:bg-white/10 ${isActive ? "bg-white/20" : ""}`
                                        }
                                      >
                                        {CIcon ? <CIcon size={16} /> : null}
                                        <span className="text-sm">{c.title}</span>
                                      </NavLink>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          );
                        }
                        return (
                          <NavLink
                            key={group.id}
                            to={group.path}
                            className={({ isActive }) =>
                              `flex w-full items-center gap-2 rounded-md px-3 py-2 hover:bg-white/10 ${isActive ? "bg-white/20" : ""}`
                            }
                          >
                            {GroupIcon ? <GroupIcon size={16} /> : null}
                            <span className="text-sm">{group.title}</span>
                          </NavLink>
                        );
                      })}
                    </div>
                  </NavigationMenuContent>
                </>
              ) : hasAccess(item.rbac, perms) ? (
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `relative group flex flex-col items-center justify-center gap-1 h-12 px-4 py-0 rounded-md ${isActive ? "text-[#EFAF00]" : "text-white"} hover:text-[#EFAF00] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[2px] after:bg-[#EFAF00] ${isActive ? "after:opacity-100" : "after:opacity-0"} hover:after:opacity-100`
                  }
                >
                  {Icon ? <Icon size={20} className="transition-colors" /> : null}
                  <span className="text-xs font-medium">{item.title}</span>
                </NavLink>
              ) : (
                <NavigationMenuTrigger disabled className="bg-transparent text-white/70">
                  {Icon ? <Icon size={18} /> : null}
                  <span className="text-sm font-medium">{item.title}</span>
                </NavigationMenuTrigger>
              )}
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
