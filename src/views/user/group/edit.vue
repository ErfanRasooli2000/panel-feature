<template>
  <b-card>
    <b-card-header class="bg-info">
        <h4 class="title">ویرایش گروه کاربری</h4>
    </b-card-header>
    <b-card-body>
        <b-overlay :show="!userGroup">
            <b-form @submit.prevent>
                <b-row>
                    <b-col cols="6">
                        <b-form-group>
                            <label for="name">
                                <feather-icon
                                    icon="FeatherIcon"
                                />
                                نام گروه کاربری
                            </label>
                            <b-form-input
                            v-model="userGroupName"
                            placeholder="نام گروه کاربری را وارد نمایید"
                            />
                        </b-form-group>
                    </b-col>
                    <b-col cols="6">
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
                </b-row>
            </b-form>
        </b-overlay>
        <button class="btn btn-info" @click="updateUserGroup">ذخیره گروه کاربری</button>
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
    BOverlay
} from 'bootstrap-vue'
import VSelect from 'vue-select'
export default {
    name: 'UserGroups_Update',
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
        BOverlay
    },
    data(){
        return {
            userGroupName: '',
            permissions: [],
            permissionList: [],
            userGroup: false
        }
    },
    methods: {
        updateUserGroup(){
            if (this.userGroupName == ''){
                this.$bvToast.toast('نام گروه کاربری نمیتواند خالی باشد', {
                    title: 'خطا',
                    toaster: 'b-toaster-top-right',
                    variant: 'danger'
                })
                return false
            }
            if (this.permissions.length === 0){
                this.$bvToast.toast('لیست دسترسی گروه کاربری نمیتواند خالی باشد', {
                    title: 'خطا',
                    toaster: 'b-toaster-top-right',
                    variant: 'danger'
                })
                return false
            }
            if (!this.userGroup){
                this.$bvToast.toast(' گروه کاربری نمیتواند خالی باشد', {
                    title: 'خطا',
                    toaster: 'b-toaster-top-right',
                    variant: 'danger'
                })
                return false
            }
            let id = this.userGroup.id
            this.userGroup = false
            this.$http.put(`user/group/update/${this.$route.params.id}`, {name: this.userGroupName, permissions: this.permissions, id})
            .then(({data}) => {
                if (data.status){
                    this.$bvToast.toast('گروه کاربری با موفقیت اصلاح شد', {
                        title: 'موفقیت',
                        toaster: 'b-toaster-top-right',
                        variant: 'success',
                    })
                }else{
                    this.$bvToast.toast('در اصلاح گروه کاربری خطایی رخ داده', {
                        title: 'حطا',
                        toaster: 'b-toaster-top-right',
                        variant: 'danger',
                    })
                }
                this.userGroupName = ''
                this.permissions = []
                this.userGroup = false
                this.getUserGroup()
            })
            .catch(()=>{
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
        getUserGroup(){
            this.$http.get(`user/group/get/${this.$route.params.id}`)
            .then(({data}) => {
                if (data.status){
                    this.userGroup = data.userGroup
                    this.permissions = data.userGroup.permissions
                    this.userGroupName = data.userGroup.name
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
        }
    },
    mounted(){
        this.getUserGroup()
        this.getPermissions()
    }
}
</script>

<style>

</style>