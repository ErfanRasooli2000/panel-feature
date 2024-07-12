<template>
  <b-card bg-variant="bg-white">
    <b-card-header>
      <b-card-title>لیست برچسب ها</b-card-title>
    </b-card-header>
    <b-card-body class="bg-white">
      <b-table
        :fields="fields"
        :items="categoryList"
      ></b-table>
    </b-card-body>
  </b-card>
</template>

<script>

import {
  BButton,
  BCard,
  BCardBody,
  BCardHeader, BCardTitle,
  BCol,
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
        ]
      }
    },

    mounted() {
      this.getCategories();
    },

    methods: {
      async getCategories(){
        await this.$http.get('category/index')
            .then(({data})=>{
              this.categoryList = data.data
            })
            .catch((err)=>{})
      }
    }
  }


</script>
