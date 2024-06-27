<template>
  <div class="auth-wrapper auth-v1 px-2">
    <div class="auth-inner py-2">

      <!-- Login v1 -->
      <b-card class="mb-0">
        <b-link class="brand-logo">
          <vuexy-logo />
        </b-link>

        <b-card-title class="mb-1" dir="ltr">
          {{$t('Pages.Login.Title.welcome to system')}} 👋
        </b-card-title>
        <!-- form -->
        <validation-observer
          ref="loginForm"
          #default="{invalid}"
          localize="fa"
        >
          <b-form
            class="auth-login-form mt-2"
            @submit.prevent
          >

            <!-- username -->
            <b-form-group
              label-for="email"
              label="ایمیل"
            >
              <validation-provider
                #default="{ errors }"
                name="ایمیل"
                rules="required"
              >
                <b-form-input
                  id="email"
                  v-model="email"
                  name="login-email"
                  :state="errors.length > 0 ? false:null"
                  placeholder="ایمیل شما"
                  autofocus
                  :disabled="submitCode"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>

            <!-- forgot password -->
            <b-form-group>
                <div class="d-flex justify-content-between">
                  <label for="password">رمز عبور</label>
                  <b-link :to="{name: 'auth-reset-password'}">
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

            <!-- code -->
            <b-form-group
              label-for="code"
              label="کد ورود"
              v-if="showSubmit"
            >
              <validation-provider
                #default="{ errors }"
                name="کد ورود"
                rules="required"
              >
                <b-form-input
                  id="code"
                  v-model="code"
                  name="login-code"
                  :state="errors.length > 0 ? false:null"
                  placeholder="کد ورود به سیستم"
                  ref="loginCode"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>

            <b-form-group>
              <b-alert
              show
              variant="warning"
              class="p-1"
              v-if="showSubmit"
              >کد ورود برای شما ارسال شد ، جهت ورود به سیستم کد ورودی دریافت شده را وارد نمایید</b-alert>
            </b-form-group>

            <!-- submit button -->
            <b-button
              variant="success"
              block
              :disabled="onProgress"
              v-if="!submitCode"
              @click="sendLoginCode('sms')"
              ref="sendCodeBySms"
            >
              <b-spinner
              v-if="onProgress"
              small
              ></b-spinner>
              {{ onProgress ? 'درحال پردازش ...' : 'ورود به سیستم' }}
            </b-button>
<!--            <b-button-->
<!--              variant="secondary"-->
<!--              block-->
<!--              :disabled="onProgress"-->
<!--              v-if="!submitCode"-->
<!--              @click="sendLoginCode('call')"-->
<!--            >-->
<!--              <b-spinner-->
<!--              v-if="onProgress"-->
<!--              small-->
<!--              ></b-spinner>-->
<!--              {{ onProgress ? 'درحال پردازش ...' : 'ارسال کد با تماس' }}-->
<!--            </b-button>-->
            <b-button
              variant="success"
              block
              :disabled="invalid || onProgress"
              v-if="showSubmit"
              @click="login"
              ref="login"
            >
              <b-spinner
              v-if="onProgress"
              small
              ></b-spinner>
              {{ onProgress ? 'درحال ورود به سیستم' : 'ورود به سیستم' }}
            </b-button>
            <p class="text-center p-1" v-if="submitCode">ارسال مجدد تا {{ resendTimer }} ثانیه دیگر</p>
          </b-form>
        </validation-observer>
      </b-card>
      <!-- /Login v1 -->
    </div>
  </div>
</template>

<script>
import { ValidationProvider, ValidationObserver, localize } from 'vee-validate'
import {
  BButton, BForm, BFormInput, BFormGroup, BCard, BLink, BCardTitle, BCardText, BInputGroup, BInputGroupAppend, BFormCheckbox, BAlert, BSpinner,
} from 'bootstrap-vue'
import VuexyLogo from '@core/layouts/components/Logo.vue'
import { required, email } from '@validations'
import { togglePasswordVisibility } from '@core/mixins/ui/forms'

import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'


export default {
  components: {
    // BSV
    BButton,
    BForm,
    BFormInput,
    BFormGroup,
    BCard,
    BCardTitle,
    BLink,
    VuexyLogo,
    BCardText,
    BInputGroup,
    BInputGroupAppend,
    BFormCheckbox,
    ValidationProvider,
    ValidationObserver,
    BAlert,
    BSpinner,
  },
  mixins: [togglePasswordVisibility],
  data() {
    return {
      email: '',
      password: '',
      status: '',
      code: '',
      submitCode: false,
      resendTimer: 60,
      resendCode: false,
      showSubmit: false,
      onProgress: false,
      // validation rules
      required,
    }
  },
  computed: {
    passwordToggleIcon() {
      return this.passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
    },
  },
  methods: {
    async sendLoginCode(type) {
      if (!this.email) {
        this.$bvToast.toast('ایمیل الزامیست', {
          title: 'خطا',
          toaster: `b-toaster-top-${this.$store.state.appConfig.isRTl ? 'right' : 'left'}`,
          variant: 'danger'
        })
        return
      }
      if (!this.password) {
        this.$bvToast.toast('رمز عبور الزامیست', {
          title: 'خطا',
          toaster: `b-toaster-top-${this.$store.state.appConfig.isRTl ? 'right' : 'left'}`,
          variant: 'danger'
        })
        return
      }
      this.onProgress = true
      await this.$http.post('/auth/panel/login', {
        email: this.email,
        password: this.password,
      }).then(async ({data}) => {
        if (data.status){
          this.$store.commit('user/UPDATE_USER_TOKEN', data.data.token)
          this.$cookies.set('token', data.data.token)
          this.$store.commit('user/UPDATE_USER_DATA', data.data.data)

          this.$router.replace('/')
              .then(() => {
                this.$toast({
                  component: ToastificationContent,
                  position: 'top-right',
                  props: {
                    title: `${data.data.data.name} عزیز ، خوش آمدید`,
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
      }).catch((err) => {});
      this.onProgress = false
    },
  },
  mounted() {
    localize('fa')
    document.addEventListener('keyup', (e) => {
      if (e.code === 'Enter' || e.code === 'NumpadEnter') {
        if (this.submitCode === false){
          this.$nextTick(()=>{
            this.$refs['sendCodeBySms'].click()
          })
        }else{
          this.$nextTick(()=>{
            this.$refs['login'].click()
          })
        }
      }
    })
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-auth.scss';
</style>
