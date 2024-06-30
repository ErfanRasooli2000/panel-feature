<template>
  <b-card>
    <b-card-header header-bg-variant="info">
      <b-card-title>ساخت دسته بندی</b-card-title>
    </b-card-header>
    <b-card-body>
      <b-row>
        <b-col sm="12" md="6">
          <b-form-group label="نام دسته بندی">
            <b-form-input
              id="categoryText"
              type="text"
              placeholder="نام دسته بندی"
              v-model="name"
            ></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
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
    name: "Post_Create",

    components: {
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
        name: '',
      };
    }
  }
</script>
