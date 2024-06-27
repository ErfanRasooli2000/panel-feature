<template>
<section>
    <b-modal
    ref="referral-modal"
    id="referral-modal"
    ok-title="ارجاع شماره"
    cancel-title="بستن"
    ok-variant="success"
    :ok-disabled="onProgress"
    :cancel-disabled="onProgress"
    centered
    @reset="referral=null"
    @ok="referralCustomer"
    >
        <b-form @submit.prevent>
            <b-form-group
            label="شماره موبایل مشتری"
            >
                <b-form-input
                v-model="referral"
                placeholder="شماره موبایل جهت ارجاع"
                />
            </b-form-group>
        </b-form>
        <b-alert
        variant="warning"
        :show="onProgress"
        class="p-1"
        >
            <b-spinner small></b-spinner>
            در حال انجام درخواست لطفا منتظر بمانید...
        </b-alert>
    </b-modal>
</section>
</template>

<script>
import {
    BButton,
    BModal,
    BForm,
    BFormGroup,
    BFormInput,
    BAlert,
    BSpinner,
} from "bootstrap-vue";
export default {
    name: 'ReferralButton',
    components: {
        BButton,
        BModal,
        BForm,
        BFormGroup,
        BFormInput,
        BAlert,
        BSpinner,
    },
    data(){
        return {
            referral: null,
            onProgress: false,
        }
    },
    methods: {
        async referralCustomer($event){
            $event.preventDefault()
            if (this.referral == null){
                this.$bvToast.toast('وارد کردن شماره موبایل مشتری الزامیست',{
                    title: 'خطا',
                    toaster: `b-toaster-top-${this.$store.state.appConfig.isRTL ? 'right' : 'left'}`,
                    variant: 'danger'
                })
                return
            }
            this.onProgress = true
            await this.$http.post('customer/referral-customer', {mobile:this.referral})
            .then(({data}) => {
                if (data.status){
                    this.$swal({
                        title: 'انجام شد',
                        text: 'ارجاع مشتری به کارشناس مربوطه انجام شد',
                        icon: 'success',
                        confirmButtonText: 'متوجه شدم'
                    })
                    this.$nextTick(() => {
                        this.$refs['referral-modal'].hide()
                    })
                }else{
                    this.$swal({
                        title: 'انجام نشد',
                        text: data.message,
                        icon: 'error',
                        confirmButtonText: 'متوجه شدم'
                    })
                }
            }).catch((err) => {});
            this.onProgress = false
        },
    },
}
</script>

<style>

</style>
