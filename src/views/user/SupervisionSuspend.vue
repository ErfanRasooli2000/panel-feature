<template>
    <b-card>
        <b-card-header class="bg-info">
            <b-card-title>تعلیق و رفع تعلیق نظارت</b-card-title>
        </b-card-header>
        <b-card-body>
            <b-form @submit.prevent>
                <b-row class="align-items-center"
                v-if="$store.state.user.data.roles.includes('Administrator') || $store.state.user.data.permissions.includes('Supervision_Suspend_Users')"
                >
                  <b-col md="4">
                    <b-form-group
                        label="فروشنده ها"
                    >
                      <v-select
                          v-model="seller"
                          :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                          label="name"
                          :options="salersList"
                          :reduce="item => item"
                      />
                    </b-form-group>
                  </b-col>
                    <b-col md="2" class="mt-1" v-if="seller!==null && seller.is_suspended === true">
                        <b-button
                        variant="success"
                        :disabled="onProgress"
                        @click="unsuspendUser"
                        >
                        <b-spinner
                        v-if="onProgress"
                        small
                        ></b-spinner>
                        رفع تعلیق فروشنده</b-button>
                    </b-col>
                    <b-col md="2" class="mt-1" v-if="seller!==null && !seller.is_suspended">
                        <b-button
                        variant="danger"
                        :disabled="onProgress"
                        @click="suspendUser"
                        >
                        <b-spinner
                        v-if="onProgress"
                        small
                        ></b-spinner>
                        تعلیق فروشنده</b-button>
                    </b-col>
                </b-row>
                <b-row class="align-items-center"
                v-if="$store.state.user.data.roles.includes('Administrator') || $store.state.user.data.permissions.includes('Supervision_Suspend_Agents')"
                >
                  <b-col md="4">
                    <b-form-group
                        label="نماینده ها"
                    >
                      <v-select
                          v-model="agent"
                          :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                          label="name"
                          :options="agentList"
                          :reduce="item => item"
                      />
                    </b-form-group>
                  </b-col>
                  <b-col md="2" class="mt-1" v-if="agent!==null && agent.is_suspended === true">
                    <b-button
                        variant="success"
                        :disabled="onProgress"
                        @click="unsuspendAgent"
                    >
                      <b-spinner
                          v-if="onProgress"
                          small
                      ></b-spinner>
                      رفع تعلیق نمایندگی</b-button>
                  </b-col>
                  <b-col md="2" class="mt-1" v-if="agent!==null && !agent.is_suspended">
                    <b-button
                        variant="danger"
                        :disabled="onProgress"
                        @click="suspendAgent"
                    >
                      <b-spinner
                          v-if="onProgress"
                          small
                      ></b-spinner>
                      تعلیق نمایندگی</b-button>
                  </b-col>
                </b-row>
            </b-form>
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
    BFormInput,
    BRow,
    BCol,
    BButton,
    BSpinner,
    BCardText,
} from 'bootstrap-vue'
import { CancelToken } from 'axios'
import VSelect from 'vue-select'
export default {
    name: 'SupervisionSuspend',
    components: {
      VSelect,
        BCard,
        BCardHeader,
        BCardTitle,
        BCardBody,
        BForm,
        BFormGroup,
        BFormInput,
        BRow,
        BCol,
        BButton,
        BSpinner,
        BCardText,
    },
    data() {
        return {
            onProgress: false,
            agent: null,
            seller: null,
            agentList: [],
            salersList: [],
        }
    },
    methods: {
      suspendUser(){
        let id = this.seller._id;
        this.$swal({
          title: 'تعلیق کاربر',
          text: 'آیا از تعلیق کاربر مطمئن هستید؟',
          icon: 'warning',
          showCancelButton: true,
          cancelButtonText: 'لغو درخواست',
          confirmButtonText: 'تعلیق کاربر',
          customClass: {
            confirmButton: 'btn btn-danger',
            cancelButton: 'btn btn-success ml-1',
          },
        }).then(result => {
          if (result.value){
            this.$swal({
              title: 'درحال انجام',
              text: 'لطفا تا دریافت نتیجه منتطر بمانید...',
              confirmButtonText: 'متوجه شدم'
            })
            this.$http.put(`user/suspend/${id}`)
                .then(({data}) => {
                  if (data.status){
                    this.$swal({
                      title: 'انجام شد',
                      text: 'کاربر با موفقیت تعلیق شد',
                      icon: 'success',
                      confirmButtonText: 'تایید'
                    })
                    this.items = []
                    this.getSalersList()
                    this.seller = null
                  }else{
                    this.$swal({
                      title: 'انجام نشد',
                      text: 'در تعلیق کاربر خطایی رخ داده',
                      icon: 'danger',
                      confirmButtonText: 'تایید'
                    })
                  }
                })
                .catch(()=>{})
          }
        })
      },
      unsuspendUser(){
        let id = this.seller._id;
        this.$swal({
          title: 'رفع تعلیق کاربر',
          text: 'آیا از رفع تعلیق کاربر مطمئن هستید؟',
          icon: 'warning',
          showCancelButton: true,
          cancelButtonText: 'لغو درخواست',
          confirmButtonText: 'رفع تعلیق کاربر',
          customClass: {
            confirmButton: 'btn btn-danger',
            cancelButton: 'btn btn-success ml-1',
          },
        }).then(result => {
          if (result.value){
            this.$swal({
              title: 'درحال انجام',
              text: 'لطفا تا دریافت نتیجه منتطر بمانید...',
              confirmButtonText: 'متوجه شدم'
            })
            this.$http.put(`user/unsuspend/${id}`)
                .then(({data}) => {
                  if (data.status){
                    this.$swal({
                      title: 'انجام شد',
                      text: 'کاربر با موفقیت رفع تعلیق شد',
                      icon: 'success',
                      confirmButtonText: 'تایید'
                    })
                    this.items = []
                    this.getSalersList()
                    this.seller = null
                  }else{
                    this.$swal({
                      title: 'انجام نشد',
                      text: 'در رفع تعلیق کاربر خطایی رخ داده',
                      icon: 'danger',
                      confirmButtonText: 'تایید'
                    })
                  }
                })
                .catch(()=>{})
          }
        })
      },
      suspendAgent(){
        let id = this.agent._id;
        this.$swal({
          title: 'تعلیق نمایندگی',
          text: 'آیا از تعلیق نمایندگی مطمئن هستید؟',
          icon: 'warning',
          showCancelButton: true,
          cancelButtonText: 'لغو درخواست',
          confirmButtonText: 'تعلیق نمایندگی',
          customClass: {
            confirmButton: 'btn btn-danger',
            cancelButton: 'btn btn-success ml-1',
          },
        }).then(result => {
          if (result.value){
            this.$swal({
              title: 'درحال انجام',
              text: 'لطفا تا دریافت نتیجه منتطر بمانید...',
              confirmButtonText: 'متوجه شدم'
            })
            this.$http.put(`agents/suspend/${id}`)
                .then(({data}) => {
                  if (data.status){
                    this.$swal({
                      title: 'انجام شد',
                      text: 'نمایندگی با موفقیت تعلیق شد',
                      icon: 'success',
                      confirmButtonText: 'تایید'
                    })
                    this.items = []
                    this.getAgents()
                    this.agent = null
                  }else{
                    this.$swal({
                      title: 'انجام نشد',
                      text: 'در تعلیق نمایندگی خطایی رخ داده',
                      icon: 'danger',
                      confirmButtonText: 'تایید'
                    })
                  }
                })
                .catch(()=>{})
          }
        })
      },
      unsuspendAgent(){
        let id = this.agent._id;
        this.$swal({
          title: 'رفع تعلیق نمایندگی',
          text: 'آیا از رفع تعلیق نمایندگی مطمئن هستید؟',
          icon: 'warning',
          showCancelButton: true,
          cancelButtonText: 'لغو درخواست',
          confirmButtonText: 'رفع تعلیق نمایندگی',
          customClass: {
            confirmButton: 'btn btn-danger',
            cancelButton: 'btn btn-success ml-1',
          },
        }).then(result => {
          if (result.value){
            this.$swal({
              title: 'درحال انجام',
              text: 'لطفا تا دریافت نتیجه منتطر بمانید...',
              confirmButtonText: 'متوجه شدم'
            })
            this.$http.put(`agents/unsuspend/${id}`)
                .then(({data}) => {
                  if (data.status){
                    this.$swal({
                      title: 'انجام شد',
                      text: 'نمایندگی با موفقیت رفع تعلیق شد',
                      icon: 'success',
                      confirmButtonText: 'تایید'
                    })
                    this.items = []
                    this.getAgents()
                    this.agent = null
                  }else{
                    this.$swal({
                      title: 'انجام نشد',
                      text: 'در رفع تعلیق نمایندگی خطایی رخ داده',
                      icon: 'danger',
                      confirmButtonText: 'تایید'
                    })
                  }
                })
                .catch(()=>{})
          }
        })
      },
      getAgents(){
        this.$http.get('agents/get-all')
            .then(({data}) => {
              if (data.status){
                this.agentList = data.agents
              }else{
                this.$bvToast.toast('دریافت لیست نمایندگان با خطا مواجه شد' ,{
                  title: 'خطا در دریافت اطلاعات',
                  toaster: 'b-toaster-top-right',
                  variant: 'danger'
                })
              }
            })
            .catch(()=>{})
      },
      getSalersList(){
        this.$http.get('sale/salers-list')
            .then(({data}) => {
              if (data.status){
                this.salersList = data.salers
              }else{
                this.$bvToast.toast('دریافت لیست فروشندگان با خطا مواجه شد', {
                  title: 'حطا',
                  toaster: `b-toaster-top-${this.$store.state.appConfig.isRTL ? 'right' : 'left'}`,
                  variant: 'danger',
                })
              }
            })
            .catch((error)=>{
              this.$bvToast.toast('ارتباط با وبسرویس انجام نشد' ,{
                title: 'خطا در دریافت اطلاعات',
                toaster: `b-toaster-top-${this.$store.state.appConfig.isRTL ? 'right' : 'left'}`,
                variant: 'danger'
              })
            })
        this.getSalers = true
      },
    },
    created() {
      this.getAgents()
      this.getSalersList()
    }
}
</script>

<style>

</style>
