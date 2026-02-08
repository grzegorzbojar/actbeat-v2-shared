/**
 * Tests for permission and role constants.
 */

import { describe, it, expect } from 'vitest';
import {
  Role,
  Permission,
  ROLE_PERMISSIONS,
  hasPermission,
  getPermissionsForRole,
  hasAnyPermission,
  hasAllPermissions,
  ROLE_HIERARCHY,
  isRoleAtLeast,
} from '../../src/constants/permissions.js';

describe('Permissions', () => {
  describe('Role enum', () => {
    it('should have all expected roles', () => {
      expect(Role.BASIC).toBe('basic');
      expect(Role.GHOST).toBe('ghost');
      expect(Role.ACTOR).toBe('actor');
      expect(Role.ADMIN).toBe('admin');
    });

    it('should have exactly 4 roles', () => {
      const roleValues = Object.values(Role);
      expect(roleValues).toHaveLength(4);
    });
  });

  describe('Permission enum', () => {
    it('should have all expected permissions', () => {
      expect(Permission.PERSONAL_READ).toBe('personal:read');
      expect(Permission.PERSONAL_EDIT).toBe('personal:edit');
      expect(Permission.ORG_BASIC_READ).toBe('org:basic:read');
      expect(Permission.ORG_BASIC_EDIT).toBe('org:basic:edit');
      expect(Permission.ORG_MEMBERS_MANAGE).toBe('org:members:manage');
      expect(Permission.ORG_SETTINGS_MANAGE).toBe('org:settings:manage');
    });

    it('should have exactly 6 permissions', () => {
      const permValues = Object.values(Permission);
      expect(permValues).toHaveLength(6);
    });
  });

  describe('ROLE_PERMISSIONS', () => {
    it('should grant BASIC role personal read and edit', () => {
      expect(ROLE_PERMISSIONS[Role.BASIC]).toEqual([
        Permission.PERSONAL_READ,
        Permission.PERSONAL_EDIT,
      ]);
    });

    it('should grant GHOST role only personal read', () => {
      expect(ROLE_PERMISSIONS[Role.GHOST]).toEqual([Permission.PERSONAL_READ]);
    });

    it('should grant ACTOR role only org basic read', () => {
      expect(ROLE_PERMISSIONS[Role.ACTOR]).toEqual([Permission.ORG_BASIC_READ]);
    });

    it('should grant ADMIN role all permissions', () => {
      const adminPerms = ROLE_PERMISSIONS[Role.ADMIN];
      expect(adminPerms).toContain(Permission.PERSONAL_READ);
      expect(adminPerms).toContain(Permission.PERSONAL_EDIT);
      expect(adminPerms).toContain(Permission.ORG_BASIC_READ);
      expect(adminPerms).toContain(Permission.ORG_BASIC_EDIT);
      expect(adminPerms).toContain(Permission.ORG_MEMBERS_MANAGE);
      expect(adminPerms).toContain(Permission.ORG_SETTINGS_MANAGE);
      expect(adminPerms).toHaveLength(6);
    });

    it('should have an entry for every role', () => {
      for (const role of Object.values(Role)) {
        expect(ROLE_PERMISSIONS[role]).toBeDefined();
        expect(Array.isArray(ROLE_PERMISSIONS[role])).toBe(true);
      }
    });
  });

  describe('hasPermission', () => {
    it('should return true when role has the permission', () => {
      expect(hasPermission(Role.BASIC, Permission.PERSONAL_READ)).toBe(true);
      expect(hasPermission(Role.BASIC, Permission.PERSONAL_EDIT)).toBe(true);
      expect(hasPermission(Role.ADMIN, Permission.ORG_BASIC_EDIT)).toBe(true);
    });

    it('should return false when role does not have the permission', () => {
      expect(hasPermission(Role.BASIC, Permission.ORG_BASIC_READ)).toBe(false);
      expect(hasPermission(Role.GHOST, Permission.PERSONAL_EDIT)).toBe(false);
      expect(hasPermission(Role.ACTOR, Permission.PERSONAL_READ)).toBe(false);
    });

    it('should return true for admin on any permission', () => {
      for (const permission of Object.values(Permission)) {
        expect(hasPermission(Role.ADMIN, permission)).toBe(true);
      }
    });
  });

  describe('getPermissionsForRole', () => {
    it('should return a copy of permissions for a role', () => {
      const perms = getPermissionsForRole(Role.BASIC);
      expect(perms).toEqual([Permission.PERSONAL_READ, Permission.PERSONAL_EDIT]);
    });

    it('should return a new array (not the original)', () => {
      const perms = getPermissionsForRole(Role.BASIC);
      perms.push(Permission.ORG_BASIC_READ);
      // Original should not be modified
      expect(ROLE_PERMISSIONS[Role.BASIC]).not.toContain(Permission.ORG_BASIC_READ);
    });

    it('should return single permission for ghost', () => {
      const perms = getPermissionsForRole(Role.GHOST);
      expect(perms).toHaveLength(1);
      expect(perms[0]).toBe(Permission.PERSONAL_READ);
    });
  });

  describe('hasAnyPermission', () => {
    it('should return true if role has at least one of the permissions', () => {
      expect(
        hasAnyPermission(Role.BASIC, [Permission.PERSONAL_READ, Permission.ORG_BASIC_READ])
      ).toBe(true);
    });

    it('should return false if role has none of the permissions', () => {
      expect(
        hasAnyPermission(Role.GHOST, [Permission.PERSONAL_EDIT, Permission.ORG_BASIC_READ])
      ).toBe(false);
    });

    it('should return false for empty permissions array', () => {
      expect(hasAnyPermission(Role.ADMIN, [])).toBe(false);
    });

    it('should return true for admin with any permissions', () => {
      expect(
        hasAnyPermission(Role.ADMIN, [Permission.ORG_SETTINGS_MANAGE])
      ).toBe(true);
    });
  });

  describe('hasAllPermissions', () => {
    it('should return true if role has all of the permissions', () => {
      expect(
        hasAllPermissions(Role.BASIC, [Permission.PERSONAL_READ, Permission.PERSONAL_EDIT])
      ).toBe(true);
    });

    it('should return false if role is missing any permission', () => {
      expect(
        hasAllPermissions(Role.BASIC, [Permission.PERSONAL_READ, Permission.ORG_BASIC_READ])
      ).toBe(false);
    });

    it('should return true for empty permissions array', () => {
      expect(hasAllPermissions(Role.GHOST, [])).toBe(true);
    });

    it('should return true for admin with all permissions', () => {
      expect(
        hasAllPermissions(Role.ADMIN, Object.values(Permission))
      ).toBe(true);
    });
  });

  describe('ROLE_HIERARCHY', () => {
    it('should have correct order (lowest to highest)', () => {
      expect(ROLE_HIERARCHY).toEqual([Role.GHOST, Role.BASIC, Role.ACTOR, Role.ADMIN]);
    });

    it('should contain all roles', () => {
      for (const role of Object.values(Role)) {
        expect(ROLE_HIERARCHY).toContain(role);
      }
    });
  });

  describe('isRoleAtLeast', () => {
    it('should return true when role equals minimum', () => {
      expect(isRoleAtLeast(Role.BASIC, Role.BASIC)).toBe(true);
      expect(isRoleAtLeast(Role.ADMIN, Role.ADMIN)).toBe(true);
      expect(isRoleAtLeast(Role.GHOST, Role.GHOST)).toBe(true);
    });

    it('should return true when role is higher than minimum', () => {
      expect(isRoleAtLeast(Role.ADMIN, Role.GHOST)).toBe(true);
      expect(isRoleAtLeast(Role.ADMIN, Role.BASIC)).toBe(true);
      expect(isRoleAtLeast(Role.ADMIN, Role.ACTOR)).toBe(true);
      expect(isRoleAtLeast(Role.ACTOR, Role.GHOST)).toBe(true);
      expect(isRoleAtLeast(Role.BASIC, Role.GHOST)).toBe(true);
    });

    it('should return false when role is lower than minimum', () => {
      expect(isRoleAtLeast(Role.GHOST, Role.BASIC)).toBe(false);
      expect(isRoleAtLeast(Role.GHOST, Role.ADMIN)).toBe(false);
      expect(isRoleAtLeast(Role.BASIC, Role.ACTOR)).toBe(false);
      expect(isRoleAtLeast(Role.ACTOR, Role.ADMIN)).toBe(false);
    });
  });
});
