export default [
  {
    path: '/songs/create',
    name: 'Song_Create',
    component: () => import('@/views/songs/create.vue'),
    meta: {
      authRequired: true,
      permission: 'admin'
    }
  },
  {
    path: '/songs/Lists',
    name: 'Song_List',
    component: () => import('@/views/songs/lists.vue'),
    meta: {
      authRequired: true,
      permission: 'admin'
    }
  },
  {
    path: '/songs/edit/:id',
    name: 'Song_Edit',
    component: () => import('@/views/songs/edit.vue'),
    meta: {
      authRequired: true,
      permission: 'admin',
    }
  },
]
