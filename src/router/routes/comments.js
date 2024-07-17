export default [
  {
    path: '/comments/Lists',
    name: 'Comments_List',
    component: () => import('@/views/comments/list.vue'),
    meta: {
      authRequired: true,
      permission: 'admin'
    }
  },
]
