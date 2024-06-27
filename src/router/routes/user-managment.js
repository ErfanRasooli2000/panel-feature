export default [
    {
        path: '/users/groups/create',
        name: 'UserGroups_Create',
        component: () => import('@/views/user/group/create.vue'),
        meta: {
            authRequired: true,
            permission: 'UserGroups_Create'
        }
    },
    {
        path: '/users/groups/list',
        name: 'UserGroups_List',
        component: () => import('@/views/user/group/list.vue'),
        meta: {
            authRequired: true,
            permission: 'UserGroups_List'
        }
    },
    {
        path: '/users/groups/edit/:id',
        name: 'UserGroups_Update',
        component: () => import('@/views/user/group/edit.vue'),
        meta: {
            authRequired: true,
            permission: 'UserGroups_Update'
        }
    },
    {
        path: '/users/create',
        name: 'Users_Create',
        component: () => import('@/views/user/create.vue'),
        meta: {
            authRequired: true,
            permission: 'Users_Create'
        }
    },
    {
        path: '/users/list',
        name: 'Users_List',
        component: () => import('@/views/user/list.vue'),
        meta: {
            authRequired: true,
            permission: 'Users_List'
        }
    },
    {
        path: '/users/logs',
        name: 'Users_Logs',
        component: () => import('@/views/user/Logs.vue'),
        meta: {
            authRequired: true,
            permission: 'Users_Logs'
        }
    },
    {
        path: '/users/edit/:id',
        name: 'Users_Update',
        component: () => import('@/views/user/edit.vue'),
        meta: {
            authRequired: true,
            permission: 'Users_Update'
        }
    },
    {
        path: '/user/profile',
        name: 'User_Profile',
        component: () => import('@/views/user/profile.vue'),
        meta: {
            authRequired: true,
        }
    },
    {
        path: '/users/voip-list',
        name: 'Users_Voip_List',
        component: () => import('@/views/user/voipList.vue'),
        meta: {
            authRequired: true,
            permission: 'Users_Voip_List'
        }
    },
    {
        path: '/users/supervision-suspend',
        name: 'Supervision_Suspend',
        component: () => import('@/views/user/SupervisionSuspend.vue'),
        meta: {
            authRequired: true,
            permission: 'Supervision_Suspend_Page',
        }
    },
]
