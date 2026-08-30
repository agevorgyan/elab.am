import { Role } from '@prisma/client';

export type Permission =
  | 'manage_users'
  | 'manage_settings'
  | 'manage_portfolio'
  | 'manage_services'
  | 'manage_media'
  | 'manage_leads'
  | 'manage_seo'
  | 'manage_legal'
  | 'manage_cookies'
  | 'view_audit_logs';

/**
 * Role Permission Mapping Matrix
 */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  SUPER_ADMIN: [
    'manage_users',
    'manage_settings',
    'manage_portfolio',
    'manage_services',
    'manage_media',
    'manage_leads',
    'manage_seo',
    'manage_legal',
    'manage_cookies',
    'view_audit_logs',
  ],
  ADMIN: [
    'manage_settings',
    'manage_portfolio',
    'manage_services',
    'manage_media',
    'manage_leads',
    'manage_seo',
    'manage_legal',
    'manage_cookies',
    'view_audit_logs',
  ],
  EDITOR: [
    'manage_portfolio',
    'manage_services',
    'manage_media',
    'manage_seo',
    'manage_legal',
  ],
};

/**
 * Checks if a given Role possesses a specific Permission
 */
export function hasPermission(role: Role, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
}

/**
 * Maps Admin Sidebar Routes to required Permission
 */
export const ROUTE_PERMISSIONS: Record<string, Permission> = {
  '/admin/dashboard': 'manage_portfolio', // Base dashboard viewable by content creators
  '/admin/leads': 'manage_leads',
  '/admin/portfolio': 'manage_portfolio',
  '/admin/content': 'manage_services',
  '/admin/media': 'manage_media',
  '/admin/seo': 'manage_seo',
  '/admin/legal': 'manage_legal',
  '/admin/settings': 'manage_settings',
  '/admin/audit-logs': 'view_audit_logs',
};
