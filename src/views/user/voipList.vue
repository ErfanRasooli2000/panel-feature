<template>
    <section>
        <b-modal
        id="user-edit-modal"
        ref="user-edit-modal"
        title="ویرایش کاربر"
        centered
        ok-title="ثبت اطلاعات"
        cancel-title="لغو درخواست"
        no-close-on-backdrop
        no-close-on-esc
        hide-header-close
        :ok-disabled="onProgress"
        :cancel-disabled="onProgress"
        @cancel="user=null"
        @ok="updateUser"
        v-if="user"
        >
            <b-alert show variant="warning">
                <div class="p-1">
                    <feather-icon icon="InfoIcon"></feather-icon>
                    شما در حال ویرایش اطلاعات برای کاربر <span><b>{{ user.name }}</b></span> هستید
                </div>
            </b-alert>
            <b-form @submit.prevent>
                <b-row>
                    <b-col cols="12">
                        <b-form-group
                            label="داخلی پیشفرض"
                            >
                                <v-select
                                v-model="user.operator_type"
                                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                                label="name"
                                :options="operatorTypeList"
                                :reduce="item => item.value"
                                ></v-select>
                            </b-form-group>
                    </b-col>
                    <b-col cols="12">
                        <b-form-group
                            label="شماره موبایل"
                            >
                                <b-form-input
                                v-model="user.mobile"
                                placeholder="شماره موبایل کاربر"
                                ></b-form-input>
                            </b-form-group>
                    </b-col>
                    <b-col cols="12">
                        <b-form-group
                            label="داخلی voip"
                            >
                                <b-form-input
                                v-model="user.voip_number"
                                placeholder="داخلی voip کاربر"
                                ></b-form-input>
                            </b-form-group>
                    </b-col>
                </b-row>
            </b-form>
        </b-modal>
        <b-card>
            <b-card-header header-bg-variant="light">
                <b-card-title>فیلتر کردن کاربر ها</b-card-title>
            </b-card-header>
            <b-card-body>
                <b-form @submit.prevent>
                    <b-row>
                        <b-col md="3">
                            <b-form-group
                            label="نام کاربری"
                            >
                                <b-form-input
                                v-model="filter.username"
                                placeholder="نام کاربری"
                                ></b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col md="3">
                            <b-form-group
                            label="نام"
                            >
                                <b-form-input
                                v-model="filter.name"
                                placeholder="بخشی از نام کاربر"
                                ></b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col md="3">
                            <b-form-group
                            label="شماره موبایل"
                            >
                                <b-form-input
                                v-model="filter.mobile"
                                placeholder="شماره موبایل کاربر"
                                ></b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col md="3">
                            <b-form-group
                            label="داخلی Voip"
                            >
                                <b-form-input
                                v-model="filter.voip"
                                placeholder="داخلی Voip کاربر"
                                ></b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col md="3">
                            <b-form-group
                            label="وضعیت کاربر"
                            >
                                <v-select
                                v-model="filter.status"
                                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                                label="name"
                                :options="statusesList"
                                :reduce="item => item.value"
                                ></v-select>
                            </b-form-group>
                        </b-col>
                        <b-col md="3">
                            <b-form-group
                            label="تاریخ دسترسی"
                            >
                                <date-picker
                                clearable
                                range
                                v-model="filter.createdDate"
                                placeholder="لطفا بازه زمانی را مشخص کنید"
                                ></date-picker>
                            </b-form-group>
                        </b-col>
                        <b-col md="3">
                            <b-form-group
                            label="تماس پیشفرض"
                            >
                                <v-select
                                v-model="filter.operator_type"
                                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                                label="name"
                                :options="operatorTypeList"
                                :reduce="item => item.value"
                                ></v-select>
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
                variant="warning"
                class="mr-1"
                @click="getReport"
                >دریافت گزارش</b-button>
                <b-button
                variant="success"
                class="mr-1"
                @click="filter={}"
                >ریست کردن</b-button>
            </b-card-body>
        </b-card>
        <b-card>
          <b-card-header class="bg-info">
              <h4 class="title">لیست کاربران</h4>
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
                empty-text="موردی جهت نمایش یافت نشد"
                >
                <template #table-busy>
                    <div class="text-center text-info my-2">
                    <b-spinner class="align-middle"></b-spinner>
                    <strong> درحال دریافت اطلاعات...</strong>
                    </div>
                </template>
    
                <template #cell(roles)="data">
                    <b-badge v-for="(value,index) in data.value" :key="index" variant="light-info" class="ml-1">{{ value }}</b-badge>
                </template>
    
                <template #cell(operator_type)="data">
                    {{ data.value === 'voip' ? 'داخلی voip' : 'شماره موبایل' }}
                </template>
    
                <template #cell(status)="data">
                    <b-badge v-if="data.value" variant="light-success">فعال</b-badge>
                    <b-badge v-if="!data.value" variant="light-secondary">غیر فعال</b-badge>
                </template>
    
                <template #cell(action)="data">
                    <b-dropdown
                    text="عملیات"
                    variant="outline-primary"
                    >
                    <b-dropdown-item @click="openModal(data.item.id)">
                        <feather-icon icon="EditIcon" class="text-warning"/>
                        ویرایش
                    </b-dropdown-item>
                    </b-dropdown>
                </template>
                
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
      BRow,
      BCol,
      BCard,
      BCardHeader,
      BCardBody,
      BTable,
      BSpinner,
      BBadge,
      BDropdown,
      BDropdownItem,
      BOverlay,
      BPagination,
      BForm,
      BFormGroup,
      BFormInput,
      BButton,
      BFormCheckbox,
      BCardTitle,
      BModal,
      BAlert,
  } from 'bootstrap-vue'
  import VSelect from 'vue-select'
  export default {
      name: 'Users_List',
      components: {
          BRow,
          BCol,
          BCard,
          BCardHeader,
          BCardBody,
          BTable,
          BSpinner,
          BBadge,
          BDropdown,
          BDropdownItem,
          BOverlay,
          BPagination,
          BForm,
          BFormGroup,
          BFormInput,
          BButton,
          BFormCheckbox,
          VSelect,
          BCardTitle,
          BModal,
          BAlert,
      },
      data(){
          return {
            fields: [
                {
                    key: 'row',
                    label: 'ردیف',
                },
                {
                    key: 'name',
                    label: 'نام و نام خانوادگی',
                },
                {
                    key: 'mobile',
                    label: 'موبایل',
                },
                {
                    key: 'username',
                    label: 'نام کاربری',
                },
                {
                    key: 'voip_number',
                    label: 'داخلی کاربر',
                },
                {
                    key: 'status',
                    label: 'وضعیت کاربر',
                },
                {
                    key: 'operator_type',
                    label: 'تماس پیشفرض',
                },
                {
                    key: 'createdDate',
                    label: 'تاریخ ساخت',
                },
                {
                    key: 'action',
                    label: 'عملیات',
                }
            ],
            items: [],
            currentPage: 1,
            totalRows: 0,
            perPage: 0,
            filter: {},
            operatorTypeList: [
                {name: 'شماره موبایل', value: 'mobile'},
                {name: 'شماره داخلی', value: 'voip'},
            ],
            statusesList: [
                {value: true, name: 'فعال'},
                {value: false, name: 'غیر فعال'},
            ],
            onProgress: false,
            user: null,
          }
      },
      methods: {
        async getUsersList(){
            this.onProgress = true
            this.$http.get(`user/list?page=${this.currentPage}`)
            .then(({data}) => {
                if (data.status){
                    this.$bvToast.toast('لیست کاربران با موفقیت دریافت شدند', {
                        title: 'موفقیت',
                        toaster: 'b-toaster-top-right',
                        variant: 'success',
                    })
                    data.users.data.map((user, index) =>{
                        this.items.push({
                            row: index + 1,
                            id: user._id,
                            name: user.name,
                            username: user.username,
                            createdDate: user.created_datetime,
                            status: user.status,
                            mobile: user.mobile,
                            voip_number: user.voip_number,
                            operator_type: user.operator_type,
                        })
                    })
                    this.currentPage = data.users.current_page
                    this.totalRows = data.users.total
                    this.perPage = data.users.per_page
                }else{
                    this.$bvToast.toast('در دریافت لیست کاربران خطایی رخ داده', {
                        title: 'حطا',
                        toaster: 'b-toaster-top-right',
                        variant: 'danger',
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
            this.onProgress = false
        },
        async doFilter() {
            if (this.filter.status && Object.keys(this.filter).length < 2){
                this.$bvToast.toast('پارامتری برای فیلتر کردن کاربران تعیین نشده',{
                    title: 'خطا',
                    toaster: `b-toaster-top-${this.$store.state.appConfig.isRTL ? 'right' : 'left'}`,
                    variant: 'danger'
                })
                return false
            }
            this.onProgress = true
            await this.$http.get(`user/list?filter=1&${new URLSearchParams(this.filter)}`)
            .then(({data}) => {
                if (data.status){
                    this.$bvToast.toast('لیست کاربران با موفقیت دریافت شدند', {
                        title: 'موفقیت',
                        toaster: 'b-toaster-top-right',
                        variant: 'success',
                    })
                    this.items = []
                    data.users.map((user, index) =>{
                        this.items.push({
                            row: index + 1,
                            id: user._id,
                            name: user.name,
                            username: user.username,
                            createdDate: user.created_datetime,
                            status: user.status,
                            mobile: user.mobile,
                            voip_number: user.voip_number,
                            operator_type: user.operator_type,
                        })
                    })
                    this.currentPage = 1
                    this.totalRows = 0
                    this.perPage = 0
                }else{
                    this.$bvToast.toast('در دریافت لیست فاکتور ها خطایی رخ داده', {
                        title: 'خطا',
                        toaster: 'b-toaster-top-right',
                        variant: 'danger',
                    })
                }
            })
            .catch(()=>{})
            this.onProgress = false
        },
        async getReport() {
            this.$swal({
                title: 'درحال انجام...',
                text: 'درخواست شما درحال پردازش میباشد لطفا تا دریافت نتیجه منتظر بمانید.',
                icon: 'info',
                confirmButtonText: 'متوجه شدم',
                allowOutsideClick: false
            })
            this.onProgress = true
            await this.$http.get(`user/list?report=1&filter=1&${new URLSearchParams(this.filter)}`,{timeout:99999999, responseType: 'blob'})
            .then((response) => {
                if (response.status == 200){
                    if (response.headers['content-type'] === 'application/json'){
                        this.$swal({
                            title: 'خطا',
                            text: 'در ذخیره سازی فایل گزارش خطایی رخ داده است',
                            icon: 'error',
                            confirmButtonText: 'متوجه شدم',
                        })
                    }else{
                        const filename = 'usersExtraction.xlsx';
                        const blob = new Blob([response.data]);
                        this.$saveFile(blob, filename);
                        this.$swal({
                            title: 'انجام شد',
                            text: 'فایل با موفقیت ذخیره شد',
                            icon: 'success',
                            confirmButtonText: 'متوجه شدم',
                            timer: 3000
                        })
                    }
                }
            }).catch((err) => {});
            this.onProgress = false
        },
        openModal(id){
            this.items.find((o,i)=>{
                if (o.id === id){
                    this.user = this.items[i]
                }
            })
            console.log(id,this.user);
            this.$nextTick(()=>{
                this.$refs['user-edit-modal'].show()
            })
        },
        async updateUser($event){
            if (!this.user){
                this.$bvToast.toast('لطفا درخواست را از طریق فرم انجام دهید',{
                    title: 'خطا',
                    toaster: `b-toaster-top-${this.$store.state.appConfig.isRTL ? 'right' : 'left'}`,
                    variant: 'danger'
                })
                return 
            }
            this.onProgress = true
            await this.$http.put('user/update-operator/' + this.user.id, {...this.user})
            .then(({data}) => {
                if (data.status){
                    this.$swal({
                        title: 'انجام شد',
                        text: 'داخلی کاربر با موفقیت اصلاح شد',
                        icon: 'success',
                        confirmButtonText: 'متوجه شدم',
                    })
                    this.$nextTick(() => {
                        this.$refs['user-edit-modal'].hide() 
                        this.user = null
                        this.items = []
                        this.getUsersList()
                    })
                }else{
                    this.$bvToast.toast(data.message ? data.message : 'درخواست تغییر داخلی کاربر با خطا مواجه شد', {
                        title: 'خطا',
                        toaster: `b-toaster-top-${this.$store.state.appConfig.isRTL ? 'right' : 'left'}`,
                        variant: 'danger',
                    })
                }
            }).catch((err) => {});
            this.onProgress = false
        },
      },
      watch:{
        'currentPage'(newVal, oldVal){
            if (newVal != oldVal){
                this.$router.push({name: 'Users_Voip_List', query: {page: this.currentPage}})
                this.items = []
                this.getUsersList()
            }
        }
      },
      mounted(){
          this.getUsersList()
      }
  }
  </script>
  
  <style>
  
  </style>