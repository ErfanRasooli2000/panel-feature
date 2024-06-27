export default [
  {
    path: '/artists/create',
    name: 'Artist_Create',
    component: () => import('@/views/artists/create.vue'),
    meta: {
      authRequired: true,
      permission: 'admin'
    }
  },
  {
    path: '/artists/Lists',
    name: 'Artists_List',
    component: () => import('@/views/artists/lists.vue'),
    meta: {
      authRequired: true,
      permission: 'admin'
    }
  },
  {
    path: '/artists/edit/:id',
    name: 'Artist_Edit',
    component: () => import('@/views/artists/edit.vue'),
    meta: {
      authRequired: true,
      permission: 'admin',
    }
  },
]
