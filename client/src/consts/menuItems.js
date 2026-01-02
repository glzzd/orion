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
];
