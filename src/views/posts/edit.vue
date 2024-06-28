<template>
  <b-card>
    <b-card-header header-bg-variant="info">
      <b-card-title>ویرایش آرتیست</b-card-title>
    </b-card-header>
    <b-card-body>
      <b-form @submit.p.prevent>
        <b-row>
          <b-col lg="3" sm="12" md="6">
            <b-form-group label="نام فارسی آرتیست">
              <b-form-input
                  type="text"
                  placeholder=""
                  v-model="nameFa"
                  dir="ltr"
              />
            </b-form-group>
          </b-col>
          <b-col lg="3" sm="12" md="6">
            <b-form-group label="نام انگلیسی آرتیست">
              <b-form-input
                  type="text"
                  placeholder=""
                  v-model="nameEn"
                  dir="ltr"
              />
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col sm="12">
            <b-button
                variant="info"
                class="mt-3 float-right"
                @click="updateArtist"
                :disabled="onProgress"
            >{{!onProgress ? 'ویرایش آرتیست' : 'در حال ارسال اطلاعات'}}</b-button>
          </b-col>
        </b-row>
      </b-form>
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
import VSelect from 'vue-select'
export default {
  name: 'Artist_Create',
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
    VSelect,
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
      nameFa: "",
      nameEn: "",
      onProgress: false
    }
  },
  methods: {
    async updateArtist(){
      await this.$http.put(`artist/update/${this.$route.params.id}` , {
        name_fa : this.nameFa,
        name_en : this.nameEn,
      })
          .then(({data}) => {
            if (data.status)
            {
              this.$swal({
                title: 'انجام شد',
                text: 'آرتیست با موفقیت ویرایش شد',
                icon: 'success',
                confirmButtonText: 'متوجه شدم',
                timer: 3000
              })

              this.getArtist();
            }
            else
            {
              this.$bvToast.toast(data.message, {
                title: 'در ویرایش آرتیست مشکلی به وجود آمده.',
                toaster: `b-toaster-top-${this.$store.state.appConfig.isRTL ? 'right' : 'left'}`,
                variant: 'danger'
              })
            }
          })
          .catch(()=>{})
    },
    async getArtist(){
      await this.$http.get(`artist/show/${this.$route.params.id}`)
          .then(response => {
            if (response.status === 200){
              this.nameFa = response.data.data.name_fa;
              this.nameEn = response.data.data.name_en;
            }
          })
          .catch((err) => {});
    },
  },
  mounted() {
    this.getArtist();
  }
}
</script>
