<template>
  <b-card bg-variant="bg-white">
    <b-card-header>
      <b-card-title>لیست برچسب ها</b-card-title>
    </b-card-header>
    <b-card-body class="bg-white">
      <b-table
        :fields="fields"
        :items="categoryList"
      >

        <template #cell(action)="data">
          <b-dropdown
            size="md"
            text="عملیات"
            variant="outline-primary">

            <b-dropdown-item
              :to="{name: 'Category_Edit' , params:{id: data.item.id}}"
            >
              <feather-icon
                icon="EditIcon"
                class="text-warning"
              />
              ویرایش دسته بندی
            </b-dropdown-item>

            <b-dropdown-item
              @click="showDeleteModal(data.item.id)"
            >
              <feather-icon
                icon="DeleteIcon"
                class="text-danger"
              />
              حذف دسته بندی
            </b-dropdown-item>

          </b-dropdown>
        </template>
      </b-table>
    </b-card-body>

    <b-modal id="delete-confirmation-modal" @ok="deleteCategory">
      <template #modal-title>
        تایید حذف
      </template>
      <p>آیا مطمئن هستید که می‌خواهید این دسته بندی را حذف کنید؟</p>
    </b-modal>

  </b-card>

</template>

<script>

import {
  BButton,
  BCard,
  BCardBody,
  BCardHeader, BCardTitle,
  BCol, BDropdown, BDropdownItem,
  BForm,
  BFormCheckbox, BFormFile,
  BFormGroup,
  BFormInput, BFormRadio, BFormText, BFormTextarea, BInputGroup, BInputGroupPrepend, BOverlay, BRow, BSpinner, BTable
} from 'bootstrap-vue'

  export default {
    name: "Category_List",

    components:{
      BTable,
      BCardHeader,
      BCardTitle,
      BCardBody,
      BDropdownItem,
      BDropdown,
      BCol,
      BForm,
      BFormCheckbox,
      BFormFile,
      BFormGroup,
    },

    data(){
      return{
        onProgress: false,
        categoryList: [],
        fields: [
          {key: 'id' , label : "شناسه"},
          {key: 'name' , label : "نام"},
          {key: 'parent.name' , label : "برچسب پدر"},
          {key: 'creator.name' , label : "سازنده"},
          {key: 'created_at' , label : "تاریخ ساخت"},
          {key: 'action' , label : "عملیات"},
        ],
        idForDelete: null,
      }
    },

    mounted() {
      this.getCategories();
    },

    methods: {
      showDeleteModal(id) {
        this.$bvModal.show('delete-confirmation-modal');
        this.idForDelete = id;
      },

      async getCategories(){
        await this.$http.get('category/index')
            .then(({data})=>{
              this.categoryList = data.data
            })
            .catch((err)=>{})
      },

      async deleteCategory(){
        await this.$http.delete(`category/delete/${this.idForDelete}`)
        .then(({data})=>{
          if(data.status)
          {
            this.$bvToast.toast('دسته بندی با موفقیت حذف شد.', {
              title: 'موفقیت',
              toaster: 'b-toaster-top-right',
              variant: 'success',
            })

            this.getCategories();
          }
        })
        .catch((err)=>{})
      }
    }
  }


</script>
