export default [
  {
    path: '/posts/create',
    name: 'Post_Create',
    component: () => import('@/views/posts/create.vue'),
    meta: {
      authRequired: true,
      permission: 'admin'
    }
  },
  {
    path: '/posts/Lists',
    name: 'Post_List',
    component: () => import('@/views/posts/lists.vue'),
    meta: {
      authRequired: true,
      permission: 'admin'
    }
  },
  {
    path: '/posts/edit/:id',
    name: 'Post_Edit',
    component: () => import('@/views/posts/edit.vue'),
    meta: {
      authRequired: true,
      permission: 'admin',
    }
  },
]
