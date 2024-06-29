<template>
  <b-nav-item-dropdown
    right
    toggle-class="d-flex align-items-center dropdown-user-link"
    class="dropdown-user"
    v-if="$store.state.user.data"
  >
    <template #button-content>
      <div class="d-sm-flex d-none user-nav">
        <p class="user-name font-weight-bolder mb-0">
          {{ $store.state.user.data.name}}
        </p>
        <span class="user-status">{{ $store.state.user.data.roleName }}</span>
      </div>
      <b-avatar
        size="40"
        :src="$store.state.user.data.avatar"
        variant="light-primary"
        badge
        class="badge-minimal"
        badge-variant="success"
      >
        <feather-icon
          v-if="!$store.state.user.data.name"
          icon="UserIcon"
          size="22"
        />
      </b-avatar>
    </template>
    <!--      :to="{ name: 'User_Profile'}"-->
    <b-dropdown-item
      link-class="d-flex align-items-center"
    >
      <feather-icon
        size="16"
        icon="UserIcon"
        class="mr-50"
      />
      <span>پروفایل</span>
    </b-dropdown-item>
    <b-dropdown-item
      link-class="d-flex align-items-center"
      @click="logout"
    >
      <feather-icon
        size="16"
        icon="LogOutIcon"
        class="mr-50"
      />
      <span>خروج</span>
    </b-dropdown-item></b-nav-item-dropdown>
</template>

<script>
import {
  BNavItemDropdown, BDropdownItem, BDropdownDivider, BAvatar,
} from 'bootstrap-vue'
import { initialAbility } from '@/libs/acl/config'
import useJwt from '@/auth/jwt/useJwt'
import { avatarText } from '@core/utils/filter'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default {
  components: {
    BNavItemDropdown,
    BDropdownItem,
    BDropdownDivider,
    BAvatar,
  },
  data() {
    return {
      userData: this.$store.state.user.data,
      avatarText,
    }
  },
  methods: {
    async logout() {
      await this.$http.post('auth/logout')
      .then(({data}) => {
        if (data.status){
          this.$toast({
            component: ToastificationContent,
            position: 'top-right',
            props: {
              title: `${this.userData.name} عزیز ، به امید دیدار`,
              icon: 'CoffeeIcon',
              variant: 'success',
              text: `شما با موفقیت از سیستم خارج شدید`,
            },
          })
        }
      }).catch((err) => {});
      this.$store.commit('user/UPDATE_USER_TOKEN', null)
      this.$store.commit('user/UPDATE_USER_DATA', null)
      this.$cookies.remove('token')

      this.$echo.disconnect()

      // Redirect to login page
      this.$router.push({ name: 'auth-login' })
    },
  },
}
</script>
