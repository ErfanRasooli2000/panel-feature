<template>
  <b-card>
    <b-card-header header-bg-variant="light">
      <b-card-title>لیست برچسب ها</b-card-title>
    </b-card-header>
    <b-card-body>

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
    BFormInput, BFormRadio, BFormText, BFormTextarea, BInputGroup, BInputGroupPrepend, BOverlay, BRow, BSpinner
  } from 'bootstrap-vue'

  export default {
    name: "Category_List",

    components:{
      BCardHeader,
      BCardTitle,
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
        ]
      }
    },

    mounted() {
      this.getCategories();
    },

    methods: {
      async getCategories(){

      }
    }
  }


</script>
