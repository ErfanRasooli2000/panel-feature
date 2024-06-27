export default [
  {
    path: '/albums/create',
    name: 'Album_Create',
    component: () => import('@/views/albums/create.vue'),
    meta: {
      authRequired: true,
      permission: 'admin'
    }
  },
  {
    path: '/albums/Lists',
    name: 'Albums_List',
    component: () => import('@/views/albums/lists.vue'),
    meta: {
      authRequired: true,
      permission: 'admin'
    }
  },
  {
    path: '/albums/edit/:id',
    name: 'Album_Edit',
    component: () => import('@/views/albums/edit.vue'),
    meta: {
      authRequired: true,
      permission: 'admin',
    }
  },
]
