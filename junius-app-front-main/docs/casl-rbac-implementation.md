# CASL/RBAC Implementation Guide

This document outlines the implementation of Role-Based Access Control (RBAC) using CASL in our project. It covers page-based RBAC, component-level RBAC, sidebar navigation RBAC, and the underlying permission system.

## Basic Rules and Subjects

To implement RBAC using CASL in our project, we need to define the basic rules and subjects.

- Actions: 'manage', 'create', 'read', 'update', 'delete'
- Subjects: 'all', 'customuser', 'customgroup', etc.

### Example of a Permission

```json
{
  "id": 5,
  "name": "Super Admin",
  "permissions": [
    {
      "id": 21,
      "name": "Can add custom user",
      "codename": "add_customuser"
    },
    {
      "id": 22,
      "name": "Can view custom user",
      "codename": "view_customuser"
    },
    {
      "id": 23,
      "name": "Can change custom user",
      "codename": "change_customuser"
    },
    {
      "id": 24,
      "name": "Can delete custom user",
      "codename": "delete_customuser"
    }
  ]
}
```

### Transforming Permissions to Actions

The `getActionFromCodename` function is used to transform the permission codenames to CASL actions.

### Example output

```typescript
'add_customuser' -> 'create' | 'customuser'
'view_customuser' -> 'read' | 'customuser'
'change_customuser' -> 'update' | 'customuser'
'delete_customuser' -> 'delete' | 'customuser'
```

## 1. Page-Based RBAC

For page-based RBAC, implement CASL in the layout file of the respective page. Here's an example:

```typescript:src/app/(app)/dashboard/user-list/layout.tsx
'use client';

import { notFound } from 'next/navigation';
import { useAbility } from 'src/lib/casl/use-ability';

export default function UserListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ability = useAbility();

  if (ability.cannot('create', 'customuser')) {
    return notFound();
  }

  return <>{children}</>;
}
```

This layout checks if the user has the ability to 'create' a 'customuser'. If not, it returns a 404 Not Found page.

## 2. Component-Level RBAC

For component-level RBAC, use the `Can` component provided by CASL. Here's a template:

```typescript
import { Can } from '@casl/react';
import { useAbility } from 'src/lib/casl/use-ability';

function MyComponent() {
  return (
    <div>
      <Can I="read" a="someResource">
        {/* Content only visible to users who can read 'someResource' */}
        <p>You have permission to read this content.</p>
      </Can>

      <Can I="update" a="someResource">
        {/* Content only visible to users who can update 'someResource' */}
        <button>Edit</button>
      </Can>
    </div>
  );
}
```

## 3. Sidebar Navigation RBAC

For sidebar navigation RBAC, check the `config-navigation.tsx` file. Here's an example of how it's implemented:

```typescript:src/config/config-navigation.tsx
import { useAbility } from 'src/lib/casl/use-ability';

export function useNavData() {
  const ability = useAbility();
  const data = useMemo(
    () => [
      // ... other navigation items ...
      ability.can('create', 'customuser')
        ? {
            subheader: 'Management',
            items: [
              {
                title: 'User List',
                path: paths.dashboard.admin.userList,
                icon: icon('mdi:security-account-outline'),
              },
            ],
          }
        : undefined,
    ],
    [ability],
  );

  return data;
}
```

This code checks the user's ability to 'create' a 'customuser' and only includes the 'User List' navigation item if the user has the required permission.

## 4. Permission List

The permission list is defined in the `permission_template.json` file. Here's a snippet:

```json:docs/permission_template.json
{
  "results": [
    {
      "id": 5,
      "name": "Super Admin",
      "permissions": [
        {
          "id": 21,
          "name": "Can add custom user",
          "codename": "add_customuser"
        },
        // ... other permissions ...
      ]
    }
    // ... other roles ...
  ]
}
```

This file defines the roles and their associated permissions.

## 5. CASL Ability Implementation

The core CASL ability implementation is in the `ability.ts` file:

```typescript:src/lib/casl/ability.ts
import { PureAbility, AbilityBuilder } from '@casl/ability';
import { type IPermission } from 'src/types/role-group';

export type IAppAbility = PureAbility<[Actions, Subjects]>;

export function defineAbilityFor(permissions: IPermission[]) {
  const { can, build } = new AbilityBuilder(AppAbility);

  permissions.forEach(permission => {
    const action = getActionFromCodename(permission.codename);
    const subject = getSubjectFromCodename(permission.codename);
    can(action, subject);
  });

  return build();
}

function getActionFromCodename(codename: string): Actions {
  if (codename.startsWith('add_')) return 'create';
  if (codename.startsWith('view_')) return 'read';
  if (codename.startsWith('change_')) return 'update';
  if (codename.startsWith('delete_')) return 'delete';
  return 'manage';
}

function getSubjectFromCodename(codename: string): Subjects {
  return codename.split('_')[1] || 'all';
}
```

This file defines the `defineAbilityFor` function, which creates a CASL ability based on the user's permissions. It maps the permission codenames to CASL actions and subjects.

Key points:

- Actions are mapped from Django-style codenames (e.g., 'add\_' to 'create').
- Subjects are extracted from the second part of the codename.
- The resulting ability can be used throughout the application to check permissions.

By implementing RBAC using CASL in these ways, you can effectively control access to pages, components, and navigation items based on user roles and permissions.
