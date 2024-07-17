export default [
  {
    path: '/users/create',
    name: 'User_Create',
    component: () => import('@/views/users/create.vue'),
    meta: {
      authRequired: true,
      permission: 'admin'
    }
  },
  {
    path: '/users/Lists',
    name: 'User_List',
    component: () => import('@/views/users/list.vue'),
    meta: {
      authRequired: true,
      permission: 'admin'
    }
  },
  {
    path: '/users/edit/:id',
    name: 'User_Edit',
    component: () => import('@/views/users/edit.vue'),
    meta: {
      authRequired: true,
      permission: 'admin',
    }
  },
]
