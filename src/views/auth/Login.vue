<template>
  <div class="auth-wrapper auth-v2">
    <b-row class="auth-inner m-0">

      <!-- Brand logo-->
      <b-link class="brand-logo" to="/">
        <vuexy-logo />
        <h2 class="brand-text text-primary ml-1">
          {{$t('App.title')}}
        </h2>
      </b-link>
      <!-- /Brand logo-->

      <!-- Login-->
      <b-col
        lg="4"
        class="d-flex align-items-center auth-bg px-2 p-lg-5"
      >
        <b-col
          sm="8"
          md="6"
          lg="12"
          class="px-xl-2 mx-auto"
        >
          <b-card-title
            class="mb-1 font-weight-bold"
            title-tag="h2"
          >
            {{$t('Pages.Login.Title.welcome to system')}} 👋
          </b-card-title>
          <b-card-text class="mb-2">
            {{ $t('Pages.Login.Title.you can login with your username or mobile number') }}
          </b-card-text>

          <!-- form -->
          <validation-observer
            ref="loginForm"
            #default="{invalid}"
          >
            <b-form
              class="auth-login-form mt-2"
              @submit.prevent="login"
            >
              <!-- email -->
              <b-form-group
                label="نام کاربری / موبایل"
                label-for="login-username"
              >
                <validation-provider
                  #default="{ errors }"
                  name="نام کاربری / موبایل"
                  vid="username"
                  rules="required"
                >
                  <b-form-input
                    id="login-username"
                    v-model="username"
                    :state="errors.length > 0 ? false:null"
                    name="username"
                    placeholder="نام کاربری یا شماره موبایل"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <!-- forgot password -->
              <b-form-group>
                <div class="d-flex justify-content-between">
                  <label for="password">رمز عبور</label>
                  <b-link to="#">
                    <small>بازیابی رمز عبور</small>
                  </b-link>
                </div>
                <validation-provider
                  #default="{ errors }"
                  name="رمز عبور"
                  vid="password"
                  rules="required"
                >
                  <b-input-group
                    class="input-group-merge"
                    :class="errors.length > 0 ? 'is-invalid':null"
                  >
                    <b-form-input
                      id="password"
                      v-model="password"
                      :state="errors.length > 0 ? false:null"
                      class="form-control-merge"
                      :type="passwordFieldType"
                      name="password"
                      placeholder="رمز عبور"
                    />
                    <b-input-group-append is-text>
                      <feather-icon
                        class="cursor-pointer"
                        :icon="passwordToggleIcon"
                        @click="togglePasswordVisibility"
                      />
                    </b-input-group-append>
                  </b-input-group>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <!-- checkbox -->
              <b-form-group>
                <b-form-checkbox
                  id="remember-me"
                  v-model="status"
                  name="checkbox-1"
                >
                  مرا به یاد داشته باش
                </b-form-checkbox>
              </b-form-group>

              <!-- submit buttons -->
              <b-button
                type="submit"
                variant="primary"
                block
                :disabled="invalid || onProgress"
              >
                <b-spinner
                v-if="onProgress"
                small
                ></b-spinner>
                {{ onProgress ? 'درحال ورود به سیستم ...' : 'ورود به سیستم' }}
              </b-button>
            </b-form>
          </validation-observer>
        </b-col>
      </b-col>
      <!-- /Login-->

      <!-- Left Text-->
      <b-col
        lg="8"
        class="d-none d-lg-flex align-items-center p-5"
      >
        <div class="w-100 d-lg-flex align-items-center justify-content-center px-5">
          <b-img
            fluid
            :src="imgUrl"
            alt="Login V2"
          />
        </div>
      </b-col>
      <!-- /Left Text-->
    </b-row>
  </div>
</template>

<script>
/* eslint-disable global-require */
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import VuexyLogo from '@core/layouts/components/Logo.vue'
import {
  BRow, BCol, BLink, BFormGroup, BFormInput, BInputGroupAppend, BInputGroup, BFormCheckbox, BCardText, BCardTitle, BImg, BForm, BButton, BAlert, VBTooltip, BSpinner,
} from 'bootstrap-vue'
import { required, email } from '@validations'
import { togglePasswordVisibility } from '@core/mixins/ui/forms'
import store from '@/store/index'

import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default {
  directives: {
    'b-tooltip': VBTooltip,
  },
  components: {
    BRow,
    BCol,
    BLink,
    BFormGroup,
    BFormInput,
    BInputGroupAppend,
    BInputGroup,
    BFormCheckbox,
    BCardText,
    BCardTitle,
    BImg,
    BForm,
    BButton,
    BAlert,
    VuexyLogo,
    ValidationProvider,
    ValidationObserver,
    BSpinner,
  },
  mixins: [togglePasswordVisibility],
  data() {
    return {
      status: '',
      password: '',
      username: '',
      sideImg: require('@/assets/images/pages/login-v2.svg'),

      // validation rules
      required,
      email,
      onProgress: false,
    }
  },
  computed: {
    passwordToggleIcon() {
      return this.passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
    },
    imgUrl() {
      if (store.state.appConfig.layout.skin === 'dark') {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.sideImg = require('@/assets/images/pages/login-v2-dark.svg')
        return this.sideImg
      }
      return this.sideImg
    },
  },
  methods: {
    login() {
      this.$refs.loginForm.validate().then(async success => {
        if (success) {
          this.onProgress = true
          await this.$http.post('user/login', {username: this.username, password: this.password})
            .then(({data}) => {

              if (data.status){
                this.$store.commit('user/UPDATE_USER_TOKEN', data.token)
                this.$cookies.set('token', data.token)
                this.$http.get('user/get-user-data')
                  .then(({data}) => {
                    if (data.status){
                      this.$store.commit('user/UPDATE_USER_DATA', data.userData)
                      this.$router.replace('/')
                        .then(() => {
                          this.$toast({
                            component: ToastificationContent,
                            position: 'top-right',
                            props: {
                              title: `${data.userData.name} عزیز ، خوش آمدید`,
                              icon: 'CoffeeIcon',
                              variant: 'success',
                              text: `شما با موفقیت وارد سیستم شدید`,
                            },
                          })
                        })
                    }else{
                      this.$toast({
                        component: ToastificationContent,
                        position: 'top-right',
                        props: {
                          title: 'ورود ناموفق',
                          icon: 'CoffeeIcon',
                          variant: 'danger',
                          text: data.message,
                        },
                      })
                    }
                  })
              }else{
                this.$toast({
                  component: ToastificationContent,
                  position: 'top-right',
                  props: {
                    title: 'ورود ناموفق',
                    icon: 'CoffeeIcon',
                    variant: 'danger',
                    text: data.message,
                  },
                })
              }
            })
            .catch(error => {
              this.$toast({
                component: ToastificationContent,
                position: 'top-left',
                props: {
                  title: 'ورود ناموفق',
                  icon: 'CoffeeIcon',
                  variant: 'danger',
                  text: 'خطا در دریافت اطلاعات',
                },
              })
            })
          this.onProgress = false
        }
      })
    },
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-auth.scss';
</style>
