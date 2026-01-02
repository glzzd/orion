export type Permission =
  | "dashboard:read"
  | "hr:read"
  | "hr:create"
  | "hr:update"
  | "hr:delete";

export type Role = "admin" | "manager" | "employee" | "user";

export interface RBAC {
  role: Role;
  permissions: Permission[];
}

export interface Department {
  id: number;
  name: string;
  parentId?: number | null;
  path?: string;
}

export interface Position {
  id: number;
  title: string;
  grade?: string;
  level?: number;
}

export interface ContactInfo {
  email: string;
  phone: string;
}

export interface EmploymentInfo {
  status: "Aktiv" | "Məzuniyyətdə" | "İşdən ayrılıb";
  type: "Tam ştat" | "Müqaviləli" | "Part-time";
  startDate: string; // ISO date
  endDate?: string | null; // ISO date or null
}

export interface EmployeeProfile {
  firstName: string;
  lastName: string;
  fullName: string;
}

export interface MockEmployee {
  id: number;
  profile: EmployeeProfile;
  contact: ContactInfo;
  position: Position;
  department: Department;
  employment: EmploymentInfo;
  managerId?: number | null;
  rbac: RBAC;
}

export interface AuthUser {
  id: number;
  username: string;
  password: string;
  name: string;
  role: Role;
}
