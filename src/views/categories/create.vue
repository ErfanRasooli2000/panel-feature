<template>
  <b-card>
    <b-card-header header-bg-variant="info">
      <b-card-title>ساخت دسته بندی</b-card-title>
    </b-card-header>
    <b-card-body>
      <b-form ref="dataForm">
        <b-row>
          <b-col sm="12" md="6">
            <b-form-group label="نام دسته بندی">
              <b-form-input
                  id="categoryText"
                  type="text"
                  placeholder="نام دسته بندی"
                  v-model="form.name"
              ></b-form-input>
            </b-form-group>
          </b-col>
          <b-col sm="12" md="6">
            <b-form-group
                label="دسته بندی پدر">
              <v-select
                  v-model="form.parent_id"
                  dir="rtl"
                  label="name"
                  :options="categoryList"
                  :reduce="(category) => category.id"
              />
            </b-form-group>
          </b-col>
          <b-col sm="12">
            <b-button
                variant="success"
                class="mt-3 float-right"
                @click="createCategory"
                :disabled="onProgress"
            >{{!onProgress ? 'ثبت دسته بندی' : 'در حال ارسال اطلاعات'}}</b-button>
          </b-col>
        </b-row>
      </b-form>
    </b-card-body>
  </b-card>
</template>

<script>
  import VSelect from 'vue-select'
  import {
    BButton,
    BCard,
    BCardBody,
    BCardHeader, BCardTitle,
    BCol,
    BForm,
    BFormCheckbox, BFormFile,
    BFormGroup,
    BFormInput, BFormRadio, BFormText, BFormTextarea, BInputGroup, BInputGroupPrepend, BOverlay, BRow, BSpinner
  } from 'bootstrap-vue'

  export default {
    name: "Category_Create",

    components: {
      VSelect,
      BOverlay,
      BFormFile,
      BFormTextarea,
      BSpinner,
      BFormText,
      BRow,
      BCardTitle,
      BCardHeader,
      BCol,
      BFormGroup,
      BForm,
      BFormCheckbox,
      BCard,
      BCardBody,
      BButton,
      BFormInput,
      BInputGroup,
      BInputGroupPrepend,
      BFormRadio,
    },

    data(){
      return {
        form:{
          name: '',
          parent_id: null,
        },
        onProgress: false,
        categoryList: [],
      };
    },

    mounted() {
      this.getCategories();
    },

    methods: {
      async getCategories(){
        await this.$http.get('category/get-for-select')
            .then(({data})=>{
              this.categoryList = data.data
            })
            .catch((err)=>{})
      },
      async createCategory(){
        this.onProgress = true
        await this.$http.post('category/create', this.form)
            .then(({data}) => {
              this.$bvToast.toast('دسته بندی با موفقیت ذخیره شد.', {
                title: 'موفقیت',
                toaster: 'b-toaster-top-right',
                variant: 'success',
              })
              this.form = {
                name: '',
                parent_id: null,
              }
            })
            .catch(()=>{
            })

        this.onProgress = false;
      }
    },
  }
</script>
