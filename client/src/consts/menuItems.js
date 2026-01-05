// menu-items.js
import { PERMISSIONS } from "@/consts/permissions";

export const MENUITEMS = [
  {
    id: "dashboard",
    title: "Məlumat lövhəsi",
    path: "/",
    icon: "home",
    rbac: { any: [PERMISSIONS.DASHBOARD.READ] },
  },

  {
    id: "hr",
    title: "İnsan resursları",
    icon: "users",
    rbac: { any: [PERMISSIONS.HR.READ] },
    children: [

    // =====================================================
    // 1. ƏMƏKDAŞ HƏYAT DÖVRÜ
    // =====================================================
    {
      id: "hr-lifecycle",
      title: "Əməkdaşlar",
      icon: "refresh",
      children: [
        {
          id: "hr-employees",
          title: "Bütün əməkdaşlar",
          path: "/human-resources/employees",
          icon: "users",
          rbac: { any: [PERMISSIONS.HR.READ] },
        },
        {
          id: "hr-onboarding",
          title: "İşə qəbul (Onboarding)",
          path: "/human-resources/onboarding",
          icon: "user-plus",
          rbac: { all: [PERMISSIONS.HR.CREATE] },
        },
        {
          id: "hr-offboarding",
          title: "İşdən çıxış (Offboarding)",
          path: "/human-resources/offboarding",
          icon: "user-minus",
          rbac: { any: [PERMISSIONS.HR.UPDATE] },
        },
        {
          id: "hr-contracts",
          title: "Əmək müqavilələri",
          path: "/human-resources/contracts",
          icon: "document-text",
          rbac: { any: [PERMISSIONS.HR.READ] },
        },
      ],
    },

    // =====================================================
    // 2. STRUKTUR & ŞTAT
    // =====================================================
    {
      id: "hr-structure",
      title: "Struktur və ştat",
      icon: "building-office",
      children: [
        {
          id: "hr-departments",
          title: "Strukturlar",
          path: "/human-resources/departments",
          icon: "office-building",
        },
        {
          id: "hr-positions",
          title: "Vəzifələr",
          path: "/human-resources/positions",
          icon: "briefcase",
        },
        {
          id: "hr-staff-table",
          title: "Ştat cədvəli",
          path: "/human-resources/staff-table",
          icon: "table",
        },
        {
          id: "hr-ranks",
          title: "Rütbələr",
          path: "/human-resources/grades",
          icon: "badge-check",
        },
        {
          id: "hr-degrees",
          title: "Dərəcələr",
          path: "/human-resources/degrees",
          icon: "badge-check",
        },
      ],
    },

    // =====================================================
    // 3. DAVAMIYYƏT & İŞ VAXTI
    // =====================================================
    {
      id: "hr-attendance",
      title: "Davamiyyət və iş vaxtı",
      icon: "clock",
      children: [
        {
          id: "hr-attendance-log",
          title: "Giriş-çıxış jurnalı",
          path: "/human-resources/attendance",
          icon: "calendar-days",
        },
        {
          id: "hr-shifts",
          title: "Növbə və qrafiklər",
          path: "/human-resources/shifts",
          icon: "arrows-right-left",
        },
        {
          id: "hr-overtime",
          title: "Əlavə iş saatları",
          path: "/human-resources/overtime",
          icon: "clock-plus",
        },
      ],
    },

    // =====================================================
    // 4. MƏZUNİYYƏT & İCAZƏLƏR
    // =====================================================
    {
      id: "hr-leaves",
      title: "Məzuniyyət və icazələr",
      icon: "calendar",
      children: [
        {
          id: "hr-leave-types",
          title: "Məzuniyyət növləri",
          path: "/human-resources/leave-types",
          icon: "calendar",
        },
        {
          id: "hr-leave-requests",
          title: "Məzuniyyət sorğuları",
          path: "/human-resources/leave-requests",
          icon: "calendar-days",
        },
        {
          id: "hr-remote-work",
          title: "Remote / Ezamiyyət",
          path: "/human-resources/remote-work",
          icon: "arrows-right-left",
        },
      ],
    },

    // =====================================================
    // 5. ƏMƏK HAQQI & BONUS
    // =====================================================
    {
      id: "hr-payroll",
      title: "Əmək haqqı və ödənişlər",
      icon: "banknotes",
      children: [
        {
          id: "hr-salary",
          title: "Əmək haqqı",
          path: "/human-resources/salaries",
          icon: "banknotes",
        },
        {
          id: "hr-bonuses",
          title: "Bonuslar",
          path: "/human-resources/bonuses",
          icon: "trophy",
        },
        {
          id: "hr-deductions",
          title: "Tutmalar",
          path: "/human-resources/deductions",
          icon: "ban",
        },
      ],
    },

    // =====================================================
    // 6. TƏLTİF & CƏZA
    // =====================================================
    {
      id: "hr-discipline",
      title: "Təltif və intizam",
      icon: "scale",
      children: [
        {
          id: "hr-rewards",
          title: "Təltiflər",
          path: "/human-resources/rewards",
          icon: "trophy",
        },
        {
          id: "hr-penalties",
          title: "Cəzalar",
          path: "/human-resources/penalties",
          icon: "ban",
        },
      ],
    },

    // =====================================================
    // 7. PERFORMANS & KPI
    // =====================================================
    {
      id: "hr-performance",
      title: "Performans və KPI",
      icon: "chart-bar",
      children: [
        {
          id: "hr-kpi",
          title: "KPI göstəriciləri",
          path: "/human-resources/kpi",
          icon: "chart-line",
        },
        {
          id: "hr-evaluations",
          title: "Qiymətləndirmələr",
          path: "/human-resources/evaluations",
          icon: "clipboard-list",
        },
        {
          id: "hr-career",
          title: "Karyera planı",
          path: "/human-resources/career-paths",
          icon: "book-open",
        },
      ],
    },

    // =====================================================
    // 8. TƏLİM & İNKİŞAF
    // =====================================================
    {
      id: "hr-learning",
      title: "Təlim və inkişaf",
      icon: "academic-cap",
      children: [
        {
          id: "hr-trainings",
          title: "Təlim proqramları",
          path: "/human-resources/trainings",
          icon: "book-open",
        },
        {
          id: "hr-certifications",
          title: "Sertifikatlar",
          path: "/human-resources/certifications",
          icon: "certificate",
        },
      ],
    },

    // =====================================================
    // 9. SOSİAL & SAĞLAMLIQ
    // =====================================================
    {
      id: "hr-wellbeing",
      title: "Sosial və sağlamlıq",
      icon: "heart",
      children: [
        {
          id: "hr-insurance",
          title: "Sığorta",
          path: "/human-resources/insurance",
          icon: "insurance",
        },
        {
          id: "hr-medical",
          title: "Tibbi yoxlamalar",
          path: "/human-resources/medical-checks",
          icon: "medical",
        },
      ],
    },

    // =====================================================
    // 10. HR SƏNƏDLƏR & HESABATLAR
    // =====================================================
    {
      id: "hr-reports",
      title: "Hesabatlar və sənədlər",
      icon: "document-report",
      children: [
        {
          id: "hr-documents",
          title: "HR sənədləri",
          path: "/human-resources/documents",
          icon: "document-text",
        },
        {
          id: "hr-analytics",
          title: "Analitika",
          path: "/human-resources/analytics",
          icon: "document-report",
        },
      ],
    },
  ],
  },
   {
    id: "purchase",
    title: "Satınalma",
    icon: "shopping-cart",
    rbac: { any: [PERMISSIONS.PURCHASE.READ] },
    children: [
      // 1. SİFARİŞLƏR
      {
        id: "purchase-orders",
        title: "Sifarişlər",
        icon: "clipboard",
        rbac: { any: [PERMISSIONS.PURCHASE.ORDERS] },
        children: [
          {
            id: "purchase-order-new",
            title: "Yeni sifariş",
            path: "/purchase/orders/new",
            icon: "plus",
            rbac: { any: [PERMISSIONS.PURCHASE.CREATE] },
          },
          {
            id: "purchase-orders-my",
            title: "Mənim sifarişlərim",
            path: "/purchase/orders/my",
            icon: "list",
            rbac: { any: [PERMISSIONS.PURCHASE.ORDERS] },
          },
          {
            id: "purchase-orders-list",
            title: "Bütün sifarişlər",
            path: "/purchase/orders",
            icon: "list",
            rbac: { any: [PERMISSIONS.PURCHASE.ORDERS] },
          },
        ],
      },

      // 2. TƏDARÜKÇÜLƏR
      {
        id: "purchase-suppliers",
        title: "Tədarükçülər",
        icon: "truck",
        rbac: { any: [PERMISSIONS.PURCHASE.SUPPLIERS] },
        children: [
          {
            id: "purchase-supplier-new",
            title: "Yeni tədarükçü",
            path: "/purchase/suppliers/new",
            icon: "plus",
            rbac: { any: [PERMISSIONS.PURCHASE.CREATE] },
          },
          {
            id: "purchase-suppliers-list",
            title: "Bütün tədarükçülər",
            path: "/purchase/suppliers",
            icon: "users",
            rbac: { any: [PERMISSIONS.PURCHASE.SUPPLIERS] },
          },
        ],
      },

      // 3. LOTLAR
      {
        id: "purchase-lots",
        title: "Lotlar",
        icon: "archive",
        rbac: { any: [PERMISSIONS.PURCHASE.LOTS] },
        children: [
          {
            id: "purchase-lot-new",
            title: "Yeni lot",
            path: "/purchase/lots/new",
            icon: "plus",
            rbac: { any: [PERMISSIONS.PURCHASE.CREATE] },
          },
          {
            id: "purchase-lots-my",
            title: "Mənim lotlarım",
            path: "/purchase/lots/my",
            icon: "list",
            rbac: { any: [PERMISSIONS.PURCHASE.LOTS] },
          },
          {
            id: "purchase-lots-list",
            title: "Bütün lotlar",
            path: "/purchase/lots",
            icon: "list",
            rbac: { any: [PERMISSIONS.PURCHASE.LOTS] },
          },
        ],
      },

      // 4. MÜQAVİLƏLƏR
      {
        id: "purchase-contracts",
        title: "Müqavilələr",
        icon: "document-text",
        rbac: { any: [PERMISSIONS.PURCHASE.CONTRACTS] },
        children: [
          {
            id: "purchase-contract-new",
            title: "Yeni müqavilə",
            path: "/purchase/contracts/new",
            icon: "plus",
            rbac: { any: [PERMISSIONS.PURCHASE.CREATE] },
          },
          {
            id: "purchase-contracts-list",
            title: "Bütün müqavilələr",
            path: "/purchase/contracts",
            icon: "list",
            rbac: { any: [PERMISSIONS.PURCHASE.CONTRACTS] },
          },
        ],
      },

      // 5. MƏHSULLAR VƏ KATEQORİYALAR
      {
        id: "purchase-products",
        title: "Məhsullar",
        icon: "package",
        rbac: { any: [PERMISSIONS.PURCHASE.PRODUCTS, PERMISSIONS.PURCHASE.CATEGORIES] },
        children: [
          {
            id: "purchase-product-new",
            title: "Yeni məhsul",
            path: "/purchase/products/new",
            icon: "plus",
            rbac: { any: [PERMISSIONS.PURCHASE.CREATE] },
          },
          {
            id: "purchase-category-new",
            title: "Yeni kateqoriya",
            path: "/purchase/categories/new",
            icon: "plus",
            rbac: { any: [PERMISSIONS.PURCHASE.CREATE] },
          },
          {
            id: "purchase-categories-list",
            title: "Bütün kateqoriyalar və məhsullar",
            path: "/purchase/categories",
            icon: "tag",
            rbac: { any: [PERMISSIONS.PURCHASE.CATEGORIES] },
          },
          {
            id: "purchase-categories-upload",
            title: "Kateqoriyalar və məhsullar yüklə",
            path: "/purchase/categories/upload",
            icon: "upload",
            rbac: { any: [PERMISSIONS.PURCHASE.CATEGORIES] },
          },
        ],
      },
    ],
  },
  // =====================================================
  // ADMIN PANEL
  // =====================================================
  {
    id: "admin",
    title: "Sistem inzibatçısı",
    icon: "shield-check",
    rbac: { any: [PERMISSIONS.ADMIN.READ] },
    children: [
      // 1. ORGANİZASİYALAR
      

      {
        id: "admin-organizations",
        title: "Qurumlar və Təşkilatlar",
        icon: "shield",
        rbac: { any: [PERMISSIONS.ADMIN.ROLES] },
        children:[
          {
            id: "admin-role-add",
            title: "Yeni qurum və ya təşkilat",
            path: "/admin/organizations/add",
            icon: "plus",
            rbac: { any: [PERMISSIONS.ADMIN.ORGANIZATIONS] },
          },
          {
            id: "admin-organizations-list",
            title: "Bütün qurumlar və təşkilatlar",
            path: "/admin/organizations",
            icon: "list",
            rbac: { any: [PERMISSIONS.ADMIN.ORGANIZATIONS] },
          },
          {
            id: "admin-organization-structures",
            title: "Qurum və Təşkilatların strukturları",
            path: "/admin/organizations/structures",
            icon: "settings",
            rbac: { any: [PERMISSIONS.ADMIN.ORGANIZATIONS] },
          }
          
        ]
      },
      {
        id: "admin-users",
        title: "İstifadəçilər",
        icon: "users",
        rbac: { any: [PERMISSIONS.ADMIN.USERS] },
        children:[
          {
            id: "admin-user-add",
            title: "Yeni istifadəçi",
            path: "/admin/users/add",
            icon: "user-plus",
            rbac: { any: [PERMISSIONS.ADMIN.USERS] },
          },
          {
            id: "admin-users-list",
            title: "Bütün istifadəçilər",
            path: "/admin/users",
            icon: "users",
            rbac: { any: [PERMISSIONS.ADMIN.USERS] },
          },
        ]
      },

      // 3. ROLLAR VƏ SƏLAHİYYƏTLƏR
      {
        id: "admin-roles",
        title: "Rollar və səlahiyyətlər",
        icon: "shield",
        rbac: { any: [PERMISSIONS.ADMIN.ROLES] },
        children:[
          {
            id: "admin-role-add",
            title: "Yeni rol",
            path: "/admin/roles/add",
            icon: "plus",
            rbac: { any: [PERMISSIONS.ADMIN.ROLES] },
          },
          {
            id: "admin-roles-list",
            title: "Bütün rollar",
            path: "/admin/roles",
            icon: "list",
            rbac: { any: [PERMISSIONS.ADMIN.ROLES] },
          },
          {
            id: "admin-permission-add",
            title: "Yeni səlahiyyət",
            path: "/admin/permissions/add",
            icon: "plus",
            rbac: { any: [PERMISSIONS.ADMIN.PERMISSIONS] },
          },
          {
            id: "admin-permissions-list",
            title: "Bütün səlahiyyətlər",
            path: "/admin/permissions",
            icon: "file-key",
            rbac: { any: [PERMISSIONS.ADMIN.PERMISSIONS] },
          },
        ]
      },
      
      // 4. AUDİT VƏ LOGLAR
      {
        id: "admin-audit",
        title: "Audit və Loglar",
        icon: "activity",
        rbac: { any: [PERMISSIONS.ADMIN.AUDIT, PERMISSIONS.ADMIN.LOGS] },
        children: [
          {
            id: "admin-logs",
            title: "Sistem Logları",
            path: "/admin/logs",
            icon: "clipboard-list",
            rbac: { any: [PERMISSIONS.ADMIN.LOGS] },
          },
          {
            id: "admin-audit-logs",
            title: "Audit Jurnalı",
            path: "/admin/audit",
            icon: "activity",
            rbac: { any: [PERMISSIONS.ADMIN.AUDIT] },
          },
        ]
      },

      // 5. AYARLAR
      {
        id: "admin-settings",
        title: "Sistem Ayarları",
        path: "/admin/settings",
        icon: "settings",
        rbac: { any: [PERMISSIONS.ADMIN.SETTINGS] },
      },
    ],
  },
];
