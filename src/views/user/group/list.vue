<template>
    <b-card>
      <b-card-header class="bg-info">
          <h4 class="title">لیست گروه کاربری</h4>
      </b-card-header>
      <b-card-body>
        <b-overlay :show="items.length == 0">
            <b-table
            :fields="fields"
            :items="items"
            hover
            striped
            >
            <template #table-busy>
                <div class="text-center text-info my-2">
                <b-spinner class="align-middle"></b-spinner>
                <strong> درحال دریافت اطلاعات...</strong>
                </div>
            </template>

            <template #cell(permissions)="data">
                <b-badge variant="light-info" class="ml-1" v-for="(permission, index) in data.value" :key="index">{{ permission }}</b-badge>
            </template>

            <template #cell(action)="data">
                <b-dropdown
                text="عملیات"
                variant="outline-primary"
                >
                <b-dropdown-item :to="{name: 'UserGroups_Update', params:{id: data.item.id}}">
                    <feather-icon icon="EditIcon" class="text-warning"/>
                    ویرایش
                </b-dropdown-item>
                <b-dropdown-item @click="deleteUserGroup(data.item.id)">
                    <feather-icon icon="XSquareIcon" class="text-danger"/>
                    حذف
                </b-dropdown-item>
                </b-dropdown>
            </template>
            
            </b-table>
        </b-overlay>
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
      BTable,
      BSpinner,
      BBadge,
      BDropdown,
      BDropdownItem,
      BOverlay
  } from 'bootstrap-vue'
  export default {
      name: 'UserGroups_List',
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
          BOverlay
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
                    label: 'نام گروه کاربری',
                },
                {
                    key: 'permissions',
                    label: 'دسترسی ها',
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
            items: []
          }
      },
      methods: {
        getUserGroupList(){
            this.$http.get(`user/group/list?page=${this.$route.query.page ?? 1}`)
            .then(({data}) => {
                if (data.status){
                    this.$bvToast.toast('گروه های کاربری با موفقیت دریافت شدند', {
                        title: 'موفقیت',
                        toaster: 'b-toaster-top-right',
                        variant: 'success',
                    })
                    data.userGroups.data.map((permission, index) =>{
                        this.items.push({
                            row: index + 1,
                            id: permission._id,
                            name: permission.name,
                            permissions: permission.permissionsName,
                            createdDate: permission.createdDate,
                            creater: permission.creater.name,
                        })
                    })
                }else{
                    this.$bvToast.toast('در دریافت گروه های کاربری خطایی رخ داده', {
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
        },
        deleteUserGroup(id){
            this.$swal({
                title: 'حذف گروه دسترسی',
                text: 'آیا از حذف گروه دسترسی مطمئن هستید؟',
                icon: 'warning',
                showCancelButton: true,
                cancelButtonText: 'لغو درخواست',
                confirmButtonText: 'حذف گروه دسترسی',
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
                    this.$http.delete(`user/group/delete/${id}`)
                    .then(({data}) => {
                        if (data.status){
                            this.$swal({
                                title: 'انجام شد',
                                text: 'گروه کاربری با موفقیت حذف شد',
                                icon: 'success',
                                confirmButtonText: 'تایید'
                            })
                            this.items = []
                            this.getUserGroupList()
                        }else{
                            this.$swal({
                                title: 'انجام نشد',
                                text: 'در حذف گروه کاربری خطایی رخ داده',
                                icon: 'danger',
                                confirmButtonText: 'تایید'
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
            })
        }
      },
      mounted(){
          this.getUserGroupList()
      }
  }
  </script>
  
  <style>
  
  </style>