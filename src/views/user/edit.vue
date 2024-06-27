<template>
    <b-card>
      <b-card-header class="bg-info">
          <h4 class="title">ویرایش کاربر</h4>
      </b-card-header>
      <b-card-body>
          <b-form @submit.prevent>
              <b-row>
                  <b-col cols="12">
                      <b-form-group>
                          <label for="fullname">
                              <feather-icon
                                  icon="CheckIcon"
                              />
                              وضعیت کاربر
                          </label>
                          <b-form-checkbox
                          v-model="status"
                          switch
                          ></b-form-checkbox>
                      </b-form-group>
                  </b-col>
                  <b-col cols="4">
                      <b-form-group>
                          <label for="fullname">
                              <feather-icon
                                  icon="FeatherIcon"
                              />
                              نام و نام خانوادگی
                          </label>
                          <b-form-input
                          v-model="fullname"
                          id="fullname"
                          placeholder="نام و نام خانوادگی را وارد نمایید"
                          />
                      </b-form-group>
                  </b-col>
                  <b-col cols="4">
                      <b-form-group>
                          <label for="username">
                              <feather-icon
                                  icon="UserIcon"
                              />
                              نام کاربری
                          </label>
                          <b-form-input
                          v-model="username"
                          id="username"
                          placeholder="نام کاربری را وارد نمایید"
                          :disabled="this.$store.state.user.role === 'Administrator'"
                          />
                      </b-form-group>
                  </b-col>
                  <b-col cols="4">
                      <b-form-group>
                          <label for="mobile">
                              <feather-icon
                                  icon="SmartphoneIcon"
                              />
                              موبایل
                          </label>
                          <b-form-input
                          v-model="mobile"
                          id="mobile"
                          placeholder="موبایل را وارد نمایید"
                          />
                      </b-form-group>
                  </b-col>
                  <b-col cols="4">
                      <b-overlay :show="rolesList.length == 0">
                          <b-form-group>
                              <label for="role">
                                  <feather-icon
                                      icon="UserCheckIcon"
                                  />
                                  نقش کاربر
                              </label>
                              <v-select
                                  v-model="roles"
                                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                                  label="name"
                                  :options="rolesList"
                                  :reduce="role => role.value"
                                  multiple
                              >
                              </v-select>
                          </b-form-group>
                      </b-overlay>
                  </b-col>
                <b-col md="4" v-if="isAgency">
                    <b-form-group label="عاملیت فروش">
                        <v-select
                        v-model="agency"
                        :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                        label="name"
                        :options="agenciesList"
                        :reduce="(agency) => agency._id"
                        ></v-select>
                    </b-form-group>
                </b-col>
                  <b-col md="4" v-if="isAgency">
                    <b-form-group label="کمپین تبلیغات">
                        <v-select
                        v-model="campaigns"
                        multiple
                        :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                        label="name"
                        :options="advertisementCampaignsList"
                        :reduce="(item) => item.value"
                        ></v-select>
                    </b-form-group>
                  </b-col>
                  <b-col cols="4">
                      <b-overlay :show="userGroupList.length == 0">
                          <b-form-group>
                              <label for="userGroup">
                                  <feather-icon
                                      icon="UsersIcon"
                                  />
                                  گروه کاربری
                              </label>
                              <v-select
                                  v-model="userGroup"
                                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                                  label="name"
                                  :options="userGroupList"
                                  :reduce="group => group.value"
                              >
                              </v-select>
                          </b-form-group>
                      </b-overlay>
                  </b-col>
                  <b-col cols="4">
                      <b-overlay :show="permissionList.length == 0">
                          <b-form-group>
                              <label for="permissions">
                                  <feather-icon
                                      icon="CheckSquareIcon"
                                  />
                                  لیست دسترسی ها
                              </label>
                              <v-select
                                  v-model="permissions"
                                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                                  multiple
                                  label="name"
                                  :options="permissionList"
                                  :reduce="permission => permission.value"
                              >
                              </v-select>
                          </b-form-group>
                      </b-overlay>
                  </b-col>
                  <b-col cols="4">
                      <b-form-group>
                          <label for="voip">
                              <feather-icon
                                  icon="PhoneCallIcon"
                              />
                              داخلی Voip
                          </label>
                          <b-form-input
                          v-model="voip"
                          id="voip"
                          placeholder="شماره داخلی کاربر را وارد نمایید"
                          />
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
          </b-form>
          <button class="btn btn-info" @click="updateUser">ذخیره کاربر</button>
      </b-card-body>
    </b-card>
  </template>
  
  <script>
  import {
      BRow,
      BCol,
      BCard,
      BCardHeader,
      BCardBody,
      BForm,
      BFormGroup,
      BFormInput,
      BOverlay,
      BInputGroup,
      BInputGroupAppend,
      BFormCheckbox
  } from 'bootstrap-vue'
  import VSelect from 'vue-select'
  import { togglePasswordVisibility } from '@core/mixins/ui/forms'
  
  export default {
      name: 'Users_Update',
      components: {
          BRow,
          BCol,
          BCard,
          BCardHeader,
          BCardBody,
          BForm,
          BFormGroup,
          BFormInput,
          VSelect,
          BOverlay,
          BInputGroup,
          BInputGroupAppend,
          BFormCheckbox
      },
      data(){
          return {
              fullname: '',
              username: '',
              mobile: '',
              roles: [],
              rolesList: [],
              userGroup: '',
              userGroupList: [],
              permissions: [],
              permissionList: [],
              voip: '',
              password: '',
              status: false,
            isAgency: false,
            advertisementCampaignsList: [],
            campaigns: [],
            agenciesList: [],
            agency: null,
          }
      },
      mixins:[togglePasswordVisibility],
      computed: {
          passwordToggleIcon() {
              return this.passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
          },
      },
      methods: {
        getUser(){
            this.$http.get(`user/get/${this.$route.params.id}`)
            .then(({data}) => {
                if (data.status){
                    this.user = data.user
                    this.fullname = data.user.name
                    this.userGroup = data.user.user_group_id
                    this.username = data.user.username
                    this.mobile = data.user.mobile
                    this.roles = data.user.roles
                    this.permissions = data.user.permissions
                    this.voip = data.user.voip_number
                    this.status = data.user.status
                    this.campaigns = data.user.campaigns
                    this.agency = data.user.agency_id
                }else{
                    this.$bvToast.toast('دریافت گروه کاربری با خطا مواجه شد' ,{
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
          updateUser(){
              if (this.fullname == ''){
                  this.$bvToast.toast('نام و نام خانوادگی نمیتواند خالی باشد', {
                      title: 'خطا',
                      toaster: 'b-toaster-top-right',
                      variant: 'danger'
                  })
                  return false
              }
              if (this.username == ''){
                  this.$bvToast.toast('نام کاربری نمیتواند خالی باشد', {
                      title: 'خطا',
                      toaster: 'b-toaster-top-right',
                      variant: 'danger'
                  })
                  return false
              }
              if (this.mobile == ''){
                  this.$bvToast.toast('موبایل نمیتواند خالی باشد', {
                      title: 'خطا',
                      toaster: 'b-toaster-top-right',
                      variant: 'danger'
                  })
                  return false
              }
              if (this.roles.length == 0){
                  this.$bvToast.toast('نقش کاربر نمیتواند خالی باشد', {
                      title: 'خطا',
                      toaster: 'b-toaster-top-right',
                      variant: 'danger'
                  })
                  return false
              }
            if (this.roles.includes('Agency') && !this.campaigns.length && !this.agency){
                this.$bvToast.toast('انتخاب عاملیت یا کمپین برای نقش عاملیت الزامیست', {
                    title: 'خطا',
                    toaster: 'b-toaster-top-right',
                    variant: 'danger'
                })
                return false
            }
              this.$http.put(`user/update/${this.$route.params.id}`, {
                  fullname: this.fullname,
                  username: this.username,
                  mobile: this.mobile,
                  roles: this.roles,
                  group: this.userGroup,
                  permissions: this.permissions,
                  voip: this.voip,
                  password: this.password,
                  status: this.status,
                campaigns: this.campaigns,
                agency: this.agency,
              })
              .then(({data}) => {
                  if (data.status){
                      this.$bvToast.toast('کاربر با موفقیت ایجاد شد', {
                          title: 'موفقیت',
                          toaster: 'b-toaster-top-right',
                          variant: 'success',
                      })
                      this.fullname = ''
                      this.userGroup = ''
                      this.username = ''
                      this.mobile = ''
                      this.role = ''
                      this.permission = []
                      this.voip = ''
                      this.password = ''
                      this.getUser()
                  }else{
                      this.$bvToast.toast('در ایجاد کاربر خطایی رخ داده', {
                          title: 'حطا',
                          toaster: 'b-toaster-top-right',
                          variant: 'danger',
                      })
                  }
              })
              .catch((error)=>{
                  this.$bvToast.toast('ارتباط با وبسرویس انجام نشد' ,{
                      title: 'خطا در دریافت اطلاعات',
                      toaster: 'b-toaster-top-right',
                      variant: 'danger'
                  })
              })
          },
          getPermissions(){
              this.$http.get('user/get-permissions-list')
              .then(({data}) => {
                  if (data.status){
                      this.permissionList = data.permissions
                  }else{
                      this.$bvToast.toast('دریافت لیست دسترسی ها با خطا مواجه شد' ,{
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
              .catch(()=>{
                  this.$bvToast.toast('ارتباط با وبسرویس انجام نشد' ,{
                      title: 'خطا در دریافت اطلاعات',
                      toaster: 'b-toaster-top-right',
                      variant: 'danger'
                  })
              })
          },
          getGroups(){
              this.$http.get('user/get-groups-list')
              .then(({data}) => {
                  if (data.status){
                      this.userGroupList = data.groups
                  }else{
                      this.$bvToast.toast('دریافت لیست گروه ها با خطا مواجه شد' ,{
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
          getAdvertisementCampaignsList() {
            this.$http
            .get("user/campaigns-list")
            .then(({ data }) => {
            if (data.status) {
                this.advertisementCampaignsList = data.advertisements;
            } else {
                this.$bvToast.toast("دریافت لیست کمپین های تبلیغات با خطا مواجه شد", {
                title: "خطا",
                toaster: `b-toaster-top-${
                    this.$store.state.appConfig.isRTL ? "right" : "left"
                }`,
                variant: "danger",
                });
            }
            })
            .catch((error) => {});
        },
        getSaleAgencies() {
            this.$http
            .get("sale/agencies-list")
            .then(({ data }) => {
            if (data.status) {
                this.agenciesList = data.agencies;
            } else {
                this.$bvToast.toast("دریافت لیست عاملین فروش با خطا مواجه شد", {
                title: "خطا",
                toaster: `b-toaster-top-${
                    this.$store.state.appConfig.isRTL ? "right" : "left"
                }`,
                variant: "danger",
                });
            }
            })
            .catch((error) => {});
        },
      },
      mounted(){
        this.getUser()
        this.getPermissions()
        this.getRoles()
        this.getGroups()
      },
    watch: {
        roles(newVal, oldVal){
            if(newVal.includes('Agency')){
                this.isAgency = true
                this.getAdvertisementCampaignsList()
                this.getSaleAgencies()
            }else{
                this.isAgency = false
            }
        }
    },
  }
  </script>
  
  <style>
  
  </style>