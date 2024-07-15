export default [
  {
    path: '/media/gallery',
    name: 'Gallery',
    component: () => import('@/views/medias/gallery.vue'),
    meta: {
      authRequired: true,
      permission: 'admin'
    }
  },
]
