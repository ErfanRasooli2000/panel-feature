<template>
    <b-card>
        <b-card-header header-bg-variant="info">
            <b-card-title>پروفایل کاربر</b-card-title>
        </b-card-header>
        <b-card-body>
            <b-overlay
            :show="!getUserProfile || onProgress"
            variant="transparent"
            >
                <b-form @submit.prevent>
                    <b-row>
                        <b-col md="4">
                            <b-form-group
                            label="انتخاب داخلی پیشفرض"
                            >
                            <v-select
                            v-model="defaultVoip"
                            :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                            :options="defaultVoipList"
                            label="name"
                            :reduce="item=>item.value"
                            ></v-select>
                            </b-form-group>
                        </b-col>
                        <b-col md="4">
                            <b-form-group
                            label="شماره داخلی ویپ"
                            >
                            <b-form-input
                            v-model="voip"
                            placeholder="شماره داخلی ویپ شما"
                            disabled
                            ></b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col md="4">
                            <b-form-group
                            label="شماره موبایل"
                            >
                            <b-form-input
                            v-model="mobile"
                            placeholder="شماره موبایل شما"
                            disabled
                            ></b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col cols="4">
                            <b-form-group>
                                <label for="password">
                                    <feather-icon
                                        icon="LockIcon"
                                    />
                                    رمز عبور
                                </label>
                                <b-input-group>
                                    <b-form-input
                                    :type="passwordFieldType"
                                    v-model="password"
                                    id="password"
                                    placeholder="رمز عبور را وارد نمایید"
                                    />
                                    <b-input-group-append is-text>
                                    <feather-icon
                                        :icon="passwordToggleIcon"
                                        class="cursor-pointer"
                                        @click="togglePasswordVisibility"
                                    />
                                    </b-input-group-append>
                                </b-input-group>
                            </b-form-group>
                        </b-col>
                    </b-row>
                    <b-button
                    @click="storeProfile"
                    :disabled="onProgress"
                    variant="success"
                    >
                        <b-spinner v-if="onProgress" small></b-spinner>
                        {{ onProgress ? 'درحال پردازش...' : 'ثبت اطلاعات' }}
                    </b-button>
                </b-form>
            </b-overlay>
        </b-card-body>
    </b-card>
</template>

<script>
import {
    BCard,
    BCardHeader,
    BCardTitle,
    BCardBody,
    BForm,
    BFormGroup,
    BOverlay,
    BSpinner,
    BButton,
    BRow,
    BCol,
    BFormInput,
    BInputGroup,
    BInputGroupAppend
} from 'bootstrap-vue'
import VSelect from 'vue-select'
import { togglePasswordVisibility } from '@core/mixins/ui/forms'
export default {
    name: 'UserProfile',
    components: {
        BCard,
        BCardHeader,
        BCardTitle,
        BCardBody,
        BForm,
        BFormGroup,
        BOverlay,
        BSpinner,
        BButton,
        BRow,
        BCol,
        VSelect,
        BFormInput,
        BInputGroup,
        BInputGroupAppend
    },
    mixins:[togglePasswordVisibility],
    computed: {
        passwordToggleIcon() {
            return this.passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
        },
    },
    data() {
        return {
            getUserProfile: false,
            onProgress: false,
            defaultVoipList: [
                {name: 'شماره موبایل', value: 'mobile'},
                {name: 'داخلی ویپ', value: 'voip'},
            ],
            defaultVoip: null,
            mobile: null,
            voip: null,
            password: null,
        }
    },
    methods: {
        async getProfile() {
            this.onProgress = true
            await this.$http.get('user/profile')
            .then(({data}) => {
                if (data.status){
                    this.defaultVoip = data.profile.operator_type
                    this.voip = data.profile.voip_number
                    this.mobile = data.profile.mobile
                }
            }).catch((err) => {});
            this.onProgress = false
            this.getUserProfile = true
        },
        async storeProfile() {
            if (!this.defaultVoip){
                this.$bvToast.toast('انتخاب داخلی الزامیست.', {
                    title: 'خطا',
                    toaster: `b-toaster-top-${this.$store.state.appConfig.isRTL ? 'right' : 'left'}`,
                    variant: 'danger'
                })
                return
            }
            if (!this.mobile){
                this.$bvToast.toast('وارد کردن شماره موبایل الزامیست.', {
                    title: 'خطا',
                    toaster: `b-toaster-top-${this.$store.state.appConfig.isRTL ? 'right' : 'left'}`,
                    variant: 'danger'
                })
                return
            }
            this.onProgress = true
            await this.$http.post('user/profile', {
                operator_type: this.defaultVoip,
                password: this.password,
            })
            .then(({data}) => {
                if (data.status){
                    this.$bvToast.toast('اطلاعات پروفایل شما ذخیره شد.', {
                        title: 'موفقیت',
                        toaster: `b-toaster-top-${this.$store.state.appConfig.isRTL ? 'right' : 'left'}`,
                        variant: 'success'
                    })
                    this.defaultVoip = null
                    this.voip = null
                    this.mobile = null
                    this.password = null
                    this.getUserProfile = false
                    this.getProfile()
                }
            }).catch((err) => {});
            this.onProgress = false
        },
    },
    mounted() {
        this.getProfile()
    },
}
</script>

<style>

</style>