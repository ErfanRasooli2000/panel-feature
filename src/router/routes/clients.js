export default [
  {
    path: '/clients/create',
    name: 'Client_Create',
    component: () => import('@/views/clients/create.vue'),
    meta: {
      authRequired: true,
      permission: 'admin'
    }
  },
  {
    path: '/clients/Lists',
    name: 'Client_List',
    component: () => import('@/views/clients/list.vue'),
    meta: {
      authRequired: true,
      permission: 'admin'
    }
  },
  {
    path: '/clients/edit/:id',
    name: 'Client_Edit',
    component: () => import('@/views/clients/edit.vue'),
    meta: {
      authRequired: true,
      permission: 'admin',
    }
  },
]
