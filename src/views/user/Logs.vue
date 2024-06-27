<template>
    <section>
        <b-card>
            <b-card-header header-bg-variant="light">
                <b-card-title>فیلتر کردن لاگ ها</b-card-title>
            </b-card-header>
            <b-card-body>
                <b-form @submit.prevent>
                    <b-row>
                      <b-col cols="3">
                        <b-overlay :show="LogTypes.length == 0">
                          <b-form-group>
                            <label for="permissions">
                              <feather-icon
                                  icon="CheckSquareIcon"
                              />
                              نوع لاگ
                            </label>
                            <v-select
                                v-model="filter.logTypes"
                                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                                label="name"
                                :options="LogTypes"
                                :reduce="type => type.value"
                            >
                            </v-select>
                          </b-form-group>
                        </b-overlay>
                      </b-col>
                        <b-col md="3">
                            <b-form-group
                            label="تاریخ شروع"
                            >
                                <date-picker
                                clearable
                                v-model="filter.startDate"
                                type="datetime"
                                placeholder="لطفا بازه زمانی را مشخص کنید"
                                ></date-picker>
                            </b-form-group>
                        </b-col>
                        <b-col md="3">
                            <b-form-group
                            label="تاریخ پایان"
                            >
                                <date-picker
                                clearable
                                v-model="filter.endDate"
                                type="datetime"
                                :min="filter.startDate"
                                placeholder="لطفا بازه زمانی را مشخص کنید"
                                ></date-picker>
                            </b-form-group>
                        </b-col>
                        <b-col md="3">
                            <b-form-group
                            label="انتخاب فروشنده">
                                <b-overlay
                                :show="!getSalersList"
                                spinner-small
                                >
                                    <v-select
                                    v-model="filter.salers"
                                    :dir="$store.state.appConfig.isRTl ? 'rtl' : 'ltr'"
                                    label="name"
                                    :options="salersList"
                                    :reduce="item=>item._id"
                                    multiple
                                    />
                                </b-overlay>
                            </b-form-group>
                        </b-col>
                    </b-row>
                </b-form>
                <b-button
                variant="info"
                class="mr-1"
                @click="doFilter"
                >فیلتر کردن</b-button>
                <b-button
                variant="success"
                class="mr-1"
                @click="filter={}"
                >ریست کردن</b-button>
            </b-card-body>
        </b-card>
        <b-card>
          <b-card-header class="bg-info">
              <h4 class="title">لاگ کاربران</h4>
          </b-card-header>
          <b-card-body>
            <b-overlay :show="onProgress">
                <b-table
                :fields="fields"
                :items="items"
                hover
                striped
                responsive
                show-empty
                empty-text="رکوردی یافت نشد"
                >

                </b-table>
                <b-pagination class="mt-2"
                    v-model="currentPage"
                    :total-rows="totalRows"
                    :per-page="perPage"
                />
            </b-overlay>
          </b-card-body>
        </b-card>
    </section>
</template>
<script>
import {
    BCard,
    BCardHeader,
    BCardBody,
    BTable,
    BOverlay,
    BDropdown,
    BDropdownItem,
    BPagination,
    BBadge,
    BCardTitle,
    BRow,
    BCol,
    BForm,
    BFormGroup,
    BFormInput,
    BButton,
    BFormCheckbox,
} from 'bootstrap-vue'
import VSelect from 'vue-select'
export default {
    name: 'SaleEntryList',
    components: {
        BCard,
        BCardHeader,
        BCardBody,
        BTable,
        BOverlay,
        BDropdown,
        BDropdownItem,
        BPagination,
        BBadge,
        BCardTitle,
        BRow,
        BCol,
        BForm,
        BFormGroup,
        BFormInput,
        BButton,
        VSelect,
        BFormCheckbox,
    },
    data() {
        return {
            items: [],
            fields: [
                {key: 'name', label: 'نام کاربر'},
                {key: 'action_type', label: 'نوع عملیات'},
                {key: 'origin', label: 'مبدا'},
                {key: 'destination', label: 'مقصد'},
                {key: 'created_by', label: 'توسط'},
                {key: 'created_at', label: 'تاریخ'},
            ],
            onProgress: false,
            currentPage: 1,
            totalRows: 0,
            perPage: 0,
            filter: {},
            salersList: [],
            LogTypes: [],
            logsList: [],
            getLogsList: true,
            getSalersList: true,
        }
    },
    methods: {
        async getLogs() {
            this.onProgress = true
            await this.$http.get(`user/logs?page=${this.currentPage}`)
            .then(({data}) => {
                if (data.status){
                    this.items = data.logs
                    this.currentPage = data.meta.current_page
                    this.totalRows = data.meta.total
                    this.perPage = data.meta.per_page
                }
            }).catch(err=>{})
            this.onProgress = false
        },
        getSalers() {
            this.getSalersList = false
            this.$http.get('user/get-salers-list')
            .then(({data}) => {
                if (data.status){
                    this.salersList = data.salers
                }else{
                    this.$bvToast.toast('دریافت لیست کاربران با خطا مواجه شد', {
                        title: 'خطا',
                        toaster: `b-toaster-top-${this.$store.state.appConfig.isRTL ? 'right' : 'left'}`,
                        variant: 'danger'
                    })
                }
            }).catch((err) => {});
            this.getSalersList = true
        },
        async doFilter() {
            this.onProgress = true
            await this.$http.get(`user/logs?filter=1&${new URLSearchParams(this.filter)}`)
            .then(({data}) => {
                if (data.status){
                    this.$bvToast.toast('لاگ کاربران با موفقیت دریافت شد', {
                        title: 'موفقیت',
                        toaster: 'b-toaster-top-right',
                        variant: 'success',
                    })
                    this.items = data.logs
                    this.currentPage = 1
                    this.totalRows = data.meta.total
                    this.perPage = data.meta.per_page
                }else{
                    this.$bvToast.toast('در دریافت لاگ کاربران خطایی رخ داده', {
                        title: 'خطا',
                        toaster: 'b-toaster-top-right',
                        variant: 'danger',
                    })
                }
            })
            .catch(()=>{})
            this.onProgress = false
        },
        getLogTypes(){
          this.$http.get('user/log-types')
              .then(({data}) => {
                if (data.status){
                  this.LogTypes = data.LogTypes
                }else{
                  this.$bvToast.toast('دریافت نوع لاگ ها با خطا مواجه شد' ,{
                    title: 'خطا در دریافت اطلاعات',
                    toaster: 'b-toaster-top-right',
                    variant: 'danger'
                  })
                }
              })
              .catch(()=>{
                this.$bvToast.toast('ارتباط با وبسرویس انجام نشد' ,{
                  title: 'خطا در دریافت اطلاعات',
                  toaster: 'b-toaster-top-right',
                  variant: 'danger'
                })
              })
        },
    },
    watch:{
      'currentPage'(newVal, oldVal){
        if (newVal != oldVal){
          this.$router.push({name: 'Users_Logs', query: {page: this.currentPage}})
          this.items = []
          this.getLogs()
        }
      }
    },
    mounted() {
        this.getLogs()
        this.getSalers()
        this.getLogTypes()
    },
}
</script>

<style>

</style>
