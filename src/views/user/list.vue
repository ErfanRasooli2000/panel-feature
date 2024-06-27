<template>
    <section>
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
                            label="نقش کاربری"
                            >
                                <v-select
                                v-model="filter.roles"
                                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                                label="name"
                                :options="rolesList"
                                :reduce="item => item.value"
                                multiple
                                ></v-select>
                            </b-form-group>
                        </b-col>
                        <b-col md="3">
                            <b-form-group
                            label="گروه کاربری"
                            >
                                <v-select
                                v-model="filter.userGroups"
                                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                                multiple
                                label="name"
                                :options="userGroupsList"
                                :reduce="item => item.value"
                                ></v-select>
                            </b-form-group>
                        </b-col>
                        <b-col md="3">
                            <b-form-group
                            label="سازنده"
                            >
                                <v-select
                                v-model="filter.creater"
                                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                                label="name"
                                :options="creatersList"
                                :reduce="item => item._id"
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

                <template #cell(status)="data">
                    <b-badge v-if="data.value" variant="light-success">فعال</b-badge>
                    <b-badge v-if="!data.value" variant="light-secondary">غیر فعال</b-badge>
                </template>
                <template #cell(is_suspended)="data">
                    <b-badge v-if="data.value" variant="light-danger">تعلیق شده</b-badge>
                </template>

                <template #cell(action)="data">
                    <b-dropdown
                    text="عملیات"
                    variant="outline-primary"
                    >
                    <b-dropdown-item :to="{name: 'Users_Update', params:{id: data.item.id}}">
                        <feather-icon icon="EditIcon" class="text-warning"/>
                        ویرایش
                    </b-dropdown-item>
                    <b-dropdown-item @click="deleteUser(data.item.id)">
                        <feather-icon icon="XSquareIcon" class="text-danger"/>
                        حذف
                    </b-dropdown-item>
                    <b-dropdown-item v-if="(data.item.roles.includes('فروشنده') || data.item.roles.includes('نمایندگی')) && !data.item.is_suspended" @click="suspendUser(data.item.id)">
                        <feather-icon icon="XOctagonIcon" class="text-danger"/>
                        تعلیق کاربر
                    </b-dropdown-item>
                    <b-dropdown-item v-if="(data.item.roles.includes('فروشنده') || data.item.roles.includes('نمایندگی')) && data.item.is_suspended" @click="unsuspendUser(data.item.id)">
                        <feather-icon icon="CheckSquareIcon" class="text-success"/>
                        رفع تعلیق کاربر
                    </b-dropdown-item>
                    <b-dropdown-item v-if="$store.state.user.data.roles.includes('Administrator')" @click="changeUserEntrance(data.item.id)">
                        <feather-icon icon="CheckSquareIcon" class="text-success"/>
                        ورود به دسترسی
                    </b-dropdown-item>
                    <b-dropdown-item v-if="data.item.roles.includes('کاربر') && !data.item.is_post_reviewer" @click="updatePostReviewerUser(data.item.id, true)">
                        <feather-icon icon="PackageIcon" class="text-info"/>
                        تعیین کاربر پست
                    </b-dropdown-item>
                    <b-dropdown-item v-if="data.item.roles.includes('کاربر') && data.item.is_post_reviewer" @click="updatePostReviewerUser(data.item.id, false)">
                        <feather-icon icon="PackageIcon" class="text-danger"/>
                        حذف کاربر پست
                    </b-dropdown-item>
                    <b-dropdown-item v-if="data.item.roles.includes('کاربر') && !data.item.is_support_operator" @click="updateSupportUser(data.item.id, true)">
                        <feather-icon icon="PackageIcon" class="text-info"/>
                        تعیین پشتیبان
                    </b-dropdown-item>
                    <b-dropdown-item v-if="data.item.roles.includes('کاربر') && data.item.is_support_operator" @click="updateSupportUser(data.item.id, false)">
                        <feather-icon icon="PackageIcon" class="text-danger"/>
                        حذف پشتیبان
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
                    key: 'roles',
                    label: 'نقش(ها)',
                },
                {
                    key: 'status',
                    label: 'وضعیت کاربر',
                },
                {
                    key: 'is_suspended',
                    label: 'وضعیت تعلیق',
                },
                {
                    key: 'createdDate',
                    label: 'تاریخ ساخت',
                },
                {
                    key: 'creater',
                    label: 'سازنده',
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
            rolesList: [],
            userGroupsList: [],
            creatersList: [],
            statusesList: [
                {value: true, name: 'فعال'},
                {value: false, name: 'غیر فعال'},
            ],
            onProgress: false,
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
                            roles: user.rolesName,
                            createdDate: user.created_datetime,
                            creater: user.creater.name,
                            status: user.status,
                            is_suspended: user.is_suspended,
                            is_post_reviewer: user.is_post_reviewer,
                            is_support_operator: user.is_support_operator,
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
        deleteUser(id){
            this.$swal({
                title: 'حذف کاربر',
                text: 'آیا از حذف کاربر مطمئن هستید؟',
                icon: 'warning',
                showCancelButton: true,
                cancelButtonText: 'لغو درخواست',
                confirmButtonText: 'حذف کاربر',
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
                    this.$http.delete(`user/delete/${id}`)
                    .then(({data}) => {
                        if (data.status){
                            this.$swal({
                                title: 'انجام شد',
                                text: 'کاربر با موفقیت حذف شد',
                                icon: 'success',
                                confirmButtonText: 'تایید'
                            })
                            this.items = []
                            this.getUsersList()
                        }else{
                            this.$swal({
                                title: 'انجام نشد',
                                text: 'در حذف کاربر خطایی رخ داده',
                                icon: 'danger',
                                confirmButtonText: 'تایید'
                            })
                        }
                    })
                    .catch(()=>{})
                }
            })
        },
        updatePostReviewerUser(id, status){
            this.$swal({
                title: 'کاربر بررسی پست',
                text: 'در حال تغییر وضعیت کاربر بررسی پست',
                icon: 'info',
                confirmButtonText: 'متوجه شدم',
            })
            this.$http.put(`user/update-post-operator/${id}`, {status})
            .then(({data}) => {
                if (data.status){
                    this.$swal({
                        title: 'انجام شد',
                        text: 'کاربر پست با موفقیت تغییر وضعیت شد',
                        icon: 'success',
                        confirmButtonText: 'تایید'
                    })
                    this.items = []
                    this.getUsersList()
                }else{
                    this.$swal({
                        title: 'انجام نشد',
                        text: 'در تغییر وضعیت کاربر پست خطایی رخ داده',
                        icon: 'danger',
                        confirmButtonText: 'تایید'
                    })
                }
            })
            .catch(()=>{})
        },
        suspendUser(id){
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
                            this.getUsersList()
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
        unsuspendUser(id){
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
                            this.getUsersList()
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
        getRoles(){
            this.$http.get('user/get-roles-list')
            .then(({data}) => {
                if (data.status){
                    this.rolesList = data.roles
                }else{
                    this.$bvToast.toast('دریافت لیست نقش ها با خطا مواجه شد' ,{
                        title: 'خطا در دریافت اطلاعات',
                        toaster: 'b-toaster-top-right',
                        variant: 'danger'
                    })
                }
            })
            .catch(()=>{})
        },
        getGroups(){
            this.$http.get('user/get-groups-list')
            .then(({data}) => {
                if (data.status){
                    this.userGroupsList = data.groups
                }else{
                    this.$bvToast.toast('دریافت لیست گروه ها با خطا مواجه شد' ,{
                        title: 'خطا در دریافت اطلاعات',
                        toaster: 'b-toaster-top-right',
                        variant: 'danger'
                    })
                }
            })
            .catch(()=>{})
        },
        getUsers(){
            this.$http.get('user/users-list')
            .then(({data}) => {
                if (data.status){
                    this.creatersList = data.users
                }else{
                    this.$bvToast.toast('دریافت لیست گروه ها با خطا مواجه شد' ,{
                        title: 'خطا در دریافت اطلاعات',
                        toaster: 'b-toaster-top-right',
                        variant: 'danger'
                    })
                }
            })
            .catch(()=>{})
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
                            roles: user.rolesName,
                            createdDate: user.created_datetime,
                            creater: user.creater.name,
                            status: user.status,
                            is_suspended: user.is_suspended,
                            is_post_reviewer: user.is_post_reviewer,
                            is_support_operator: user.is_support_operator,
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
        changeUserEntrance(id){
            this.$http.post('user/switch-user', {user: id})
            .then(({data}) => {
                if (data.status){
                  if (data.type === 'agent'){
                    window.open(process.env.VUE_APP_AGENCY_URL + "/auth/login?token="+data.token, '_blank');
                  } else {
                    this.$cookies.remove('token')
                    this.$cookies.set('token', data.token)
                    window.location.href = process.env.VUE_APP_URL
                  }
                }
            }).catch((err) => {

            });
        },
        updateSupportUser(id, status){
            this.$swal({
                title: 'کاربر پشتیبانی',
                text: 'در حال تغییر وضعیت کاربر پشتیبانی',
                icon: 'info',
                confirmButtonText: 'متوجه شدم',
            })
            this.$http.put(`user/update-support-operator/${id}`, {status})
            .then(({data}) => {
                if (data.status){
                    this.$swal({
                        title: 'انجام شد',
                        text: 'کاربر پشتیبانی با موفقیت تغییر وضعیت شد',
                        icon: 'success',
                        confirmButtonText: 'تایید'
                    })
                    this.items = []
                    this.getUsersList()
                }else{
                    this.$swal({
                        title: 'انجام نشد',
                        text: 'در تغییر وضعیت کاربر پشتیبانی خطایی رخ داده',
                        icon: 'danger',
                        confirmButtonText: 'تایید'
                    })
                }
            })
            .catch(()=>{})
        },
      },
      watch:{
        'currentPage'(newVal, oldVal){
            if (newVal != oldVal){
                this.$router.push({name: 'Users_List', query: {page: this.currentPage}})
                this.items = []
                this.getUsersList()
            }
        }
      },
      mounted(){
          this.getUsersList()
          this.getRoles()
          this.getGroups()
          this.getUsers()
      }
  }
  </script>

  <style>

  </style>
