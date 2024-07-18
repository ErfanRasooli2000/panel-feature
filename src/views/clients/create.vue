<template>
  <b-card>
    <b-card-header header-bg-variant="info">
      <b-card-title>ساخت دسته بندی</b-card-title>
    </b-card-header>
    <b-card-body>
      <b-form ref="dataForm">
        <b-row>

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
  name: "Client_Create",

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

}
</script>
