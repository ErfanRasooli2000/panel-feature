export default [
  {
    path: '/categories/create',
    name: 'Category_Create',
    component: () => import('@/views/categories/create.vue'),
    meta: {
      authRequired: true,
      permission: 'admin'
    }
  },
  {
    path: '/categories/Lists',
    name: 'Category_List',
    component: () => import('@/views/categories/list.vue'),
    meta: {
      authRequired: true,
      permission: 'admin'
    }
  },
  {
    path: '/categories/edit/:id',
    name: 'Category_Edit',
    component: () => import('@/views/categories/edit.vue'),
    meta: {
      authRequired: true,
      permission: 'admin',
    }
  },
]
