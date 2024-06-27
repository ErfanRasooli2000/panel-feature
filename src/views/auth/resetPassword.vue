<template>
  <div class="auth-wrapper auth-v1 px-2">
    <div class="auth-inner py-2">

      <!-- Login v1 -->
      <b-card class="mb-0">
        <b-link class="brand-logo">
          <vuexy-logo />
        </b-link>

        <b-card-title class="mb-1">
          بازیابی رمز عبور 👋
        </b-card-title>
        <b-card-text class="mb-2">
          کاربر گرامی درصورت فراموشی رمز عبور میتوانید از طریق فرم زیر رمز خود را تنظیم نمایید
        </b-card-text>

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
              label-for="username"
              label="نام کاربری"
              v-if="!showSubmit"
            >
              <validation-provider
                #default="{ errors }"
                name="نام کاربری"
                rules="required"
              >
                <b-form-input
                  id="username"
                  v-model="username"
                  name="login-username"
                  :state="errors.length > 0 ? false:null"
                  placeholder="نام کاربری شما"
                  autofocus
                  :disabled="submitCode"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>

            <!-- code -->
            <b-form-group
              label-for="code"
              label="کد ارسال شده"
              v-if="showSubmit"
            >
              <validation-provider
                #default="{ errors }"
                name="کد ارسال شده"
                rules="required"
              >
                <b-form-input
                  id="code"
                  v-model="code"
                  name="reset-code"
                  :state="errors.length > 0 ? false:null"
                  placeholder="کد ارسال شده"
                  ref="resetCode"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>

            <!-- forgot password -->
            <b-form-group
            v-if="showSubmit"
            label="رمز عبور جدید"
            >
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
                    placeholder="رمز عبور جدید"
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

            <b-form-group>
              <b-alert
              show
              variant="warning"
              class="p-1"
              v-if="showSubmit"
              >کد برای شما ارسال شد ، جهت تغییر رمز عبور کد ورودی دریافت شده را وارد نمایید</b-alert>
            </b-form-group>

            <!-- submit button -->
            <b-button
              variant="primary"
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
              {{ onProgress ? 'درحال پردازش ...' : 'ارسال کد با پیامک' }}
            </b-button>
            <b-button
              variant="secondary"
              block
              :disabled="onProgress"
              v-if="!submitCode"
              @click="sendLoginCode('call')"
            >
              <b-spinner
              v-if="onProgress"
              small
              ></b-spinner>
              {{ onProgress ? 'درحال پردازش ...' : 'ارسال کد با تماس' }}
            </b-button>
            <b-button
              variant="success"
              block
              :disabled="invalid || onProgress"
              v-if="showSubmit"
              @click="resetPassword"
              ref="reset"
            >
              <b-spinner
              v-if="onProgress"
              small
              ></b-spinner>
              {{ onProgress ? 'درحال تغییر رمز عبور' : 'تغییر رمز عبور' }}
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
      username: '',
      password: '',
      status: '',
      code: '',
      submitCode: false,
      resendTimer: 30,
      resendCode: false,
      showSubmit: false,
      onProgress: false,
      // validation rules
      required,
      email,
    }
  },
  computed: {
    passwordToggleIcon() {
      return this.passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
    },
  },
  methods: {
    async sendLoginCode(type) {
      if (!this.username) {
        this.$bvToast.toast('نام کاربری الزامیست', {
          title: 'خطا',
          toaster: `b-toaster-top-${this.$store.state.appConfig.isRTl ? 'right' : 'left'}`,
          variant: 'danger'
        })
        return
      }
      this.onProgress = true
      await this.$http.put('auth/send-reset-code', {type, username: this.username, password: this.password})
      .then(({data}) => {
        if (data.status) {
          this.submitCode = true
          this.showSubmit = true
          this.resendCodeTimer()
          setTimeout(()=>{
            this.$refs['resetCode'].focus()
          },100)
        }else{
          this.$bvToast.toast(data.message, {
            title: 'خطا',
            toaster: `b-toaster-top-${this.$store.state.appConfig.isRTl ? 'right' : 'left'}`,
            variant: 'danger'
          })
          if (data.redirectTo){
            setTimeout(() => {
              window.location.href = data.redirectTo
            }, 500);
          }
        }
      }).catch((err) => {});
      this.onProgress = false
    },
    resendCodeTimer() {
      let timer = setInterval(()=>{
        if (this.resendTimer === 0) {
          clearInterval(timer)
          this.submitCode = false
          this.resendTimer = 30
          return
        }
        this.resendTimer -= 1
      }, 1000)
    },
    async resetPassword() {
      if (!this.username) {
        this.$bvToast.toast('نام کاربری الزامیست', {
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
      if (!this.code) {
        this.$bvToast.toast('کد ارسال شده الزامیست', {
          title: 'خطا',
          toaster: `b-toaster-top-${this.$store.state.appConfig.isRTl ? 'right' : 'left'}`,
          variant: 'danger'
        })
        return
      }
      this.onProgress = true
      await this.$http.post('auth/reset-password', {
        username: this.username,
        password: this.password,
        code: this.code
      }).then(({data}) => {
        if (data.status){
          this.$router.push({name: 'auth-login'})
        }else{
          this.$toast({
            component: ToastificationContent,
            position: 'top-right',
            props: {
              title: 'عملیات ناموفق',
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
            this.$refs['reset'].click()
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
