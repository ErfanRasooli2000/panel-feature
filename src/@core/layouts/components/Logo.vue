<template>
  <img :src="logo" alt="">
</template>
<script>
import logo from '@/assets/images/logo/logo-ir.jpg'
export default {
    name: 'Dashboard',
    data() {
        return {
            logo
        }
    }
}
</script>
<style scoped>
img {
  max-width: 100%;
}
</style>
