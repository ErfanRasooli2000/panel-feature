<template>
  <p class="clearfix mb-0">
    <span class="float-md-left d-block d-md-inline-block mt-25">
      <span class="d-none d-sm-inline-block">تمامی حقوق برای عرفان رسولی
        محفوظ است
      </span>
      © {{ new Date().getFullYear() }}
    </span>

    <span class="float-md-right d-none d-md-block">
      ساخته شده با
      <span title="عشق">
        <feather-icon
          icon="HeartIcon"
          size="21"
          class="text-danger"
        />
      </span>
      و
      <span title="علاقه">
        <feather-icon
          icon="CoffeeIcon"
          size="21"
          class="text-warning"
        />
      </span>
      توسط عرفان رسولی
    </span>
  </p>
</template>

<script>
import { BLink } from 'bootstrap-vue'

export default {
  components: {
    BLink,
  },
}
</script>
