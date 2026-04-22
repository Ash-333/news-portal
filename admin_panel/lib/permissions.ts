import { Role } from "@prisma/client";

export const permissions = {
  dashboardView: "dashboard.view",
  articlesView: "articles.view",
  articlesCreate: "articles.create",
  articlesReview: "articles.review",
  mediaView: "media.view",
  photosView: "photos.view",
  categoriesView: "categories.view",
  categoriesManage: "categories.manage",
  commentsManage: "comments.manage",
  usersView: "users.view",
  usersCreate: "users.create",
  userRolesManage: "users.roles.manage",
  analyticsView: "analytics.view",
  auditView: "audit.view",
  settingsManage: "settings.manage",
  videosView: "videos.view",
  videosCreate: "videos.create",
  adsView: "ads.view",
  adsManage: "ads.manage",
  pollsView: "polls.view",
  pollsManage: "polls.manage",
} as const;

export type Permission = (typeof permissions)[keyof typeof permissions];

const rolePermissions: Record<Role, Permission[]> = {
  [Role.PUBLIC_USER]: [],
  [Role.AUTHOR]: [
    permissions.dashboardView,
    permissions.articlesView,
    permissions.articlesCreate,
    permissions.mediaView,
    permissions.photosView,
    permissions.categoriesView,
    permissions.videosView,
    permissions.videosCreate,
  ],
  [Role.ADMIN]: [
    permissions.dashboardView,
    permissions.articlesView,
    permissions.articlesCreate,
    permissions.articlesReview,
    permissions.mediaView,
    permissions.photosView,
    permissions.categoriesView,
    permissions.categoriesManage,
    permissions.commentsManage,
    permissions.usersView,
    permissions.usersCreate,
    permissions.analyticsView,
    permissions.videosView,
    permissions.videosCreate,
    permissions.adsView,
    permissions.adsManage,
    permissions.pollsView,
    permissions.pollsManage,
  ],
  [Role.SUPERADMIN]: [
    permissions.dashboardView,
    permissions.articlesView,
    permissions.articlesCreate,
    permissions.articlesReview,
    permissions.mediaView,
    permissions.photosView,
    permissions.categoriesView,
    permissions.categoriesManage,
    permissions.commentsManage,
    permissions.usersView,
    permissions.usersCreate,
    permissions.userRolesManage,
    permissions.analyticsView,
    permissions.auditView,
    permissions.settingsManage,
    permissions.videosView,
    permissions.videosCreate,
    permissions.adsView,
    permissions.adsManage,
    permissions.pollsView,
    permissions.pollsManage,
  ],
};

export function getPermissionsForRole(
  role: Role | string | undefined,
): Permission[] {
  if (!role || !(role in rolePermissions)) {
    return [];
  }
  return rolePermissions[role as Role];
}

export function hasPermission(
  role: Role | string | undefined,
  permission: Permission,
): boolean {
  return getPermissionsForRole(role).includes(permission);
}

export function getAssignableRoles(role: Role | string | undefined): Role[] {
  if (role === Role.SUPERADMIN) {
    return [Role.AUTHOR, Role.ADMIN, Role.SUPERADMIN];
  }
  if (role === Role.ADMIN) {
    return [Role.AUTHOR];
  }
  return [];
}

export function canManageRole(
  actorRole: Role | string | undefined,
  targetRole: Role,
): boolean {
  return getAssignableRoles(actorRole).includes(targetRole);
}

export const permissionGroups: Array<{
  title: string;
  items: Array<{ permission: Permission; label: string }>;
}> = [
  {
    title: "Dashboard",
    items: [
      { permission: permissions.dashboardView, label: "View admin dashboard" },
    ],
  },
  {
    title: "Articles",
    items: [
      { permission: permissions.articlesView, label: "View articles" },
      {
        permission: permissions.articlesCreate,
        label: "Create and edit articles",
      },
      {
        permission: permissions.articlesReview,
        label: "Approve, reject, and publish articles",
      },
    ],
  },
  {
    title: "Content",
    items: [
      { permission: permissions.mediaView, label: "Manage media library" },
      { permission: permissions.photosView, label: "Manage photo galleries" },
      {
        permission: permissions.categoriesView,
        label: "View categories and tags",
      },
      {
        permission: permissions.categoriesManage,
        label: "Manage categories and tags",
      },
      { permission: permissions.commentsManage, label: "Moderate comments" },
      { permission: permissions.videosView, label: "View videos" },
      {
        permission: permissions.videosCreate,
        label: "Create and manage videos",
      },
    ],
  },
  {
    title: "Advertising",
    items: [
      { permission: permissions.adsView, label: "View advertisements" },
      {
        permission: permissions.adsManage,
        label: "Create and manage advertisements",
      },
    ],
  },
  {
    title: "Users",
    items: [
      { permission: permissions.usersView, label: "View users" },
      { permission: permissions.usersCreate, label: "Create users" },
      {
        permission: permissions.userRolesManage,
        label: "Change user roles and permissions",
      },
    ],
  },
  {
    title: "Administration",
    items: [
      { permission: permissions.analyticsView, label: "View analytics" },
      { permission: permissions.auditView, label: "Access audit logs" },
      {
        permission: permissions.settingsManage,
        label: "Manage system settings",
      },
    ],
  },
];
