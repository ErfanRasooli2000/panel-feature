<template>
  <div>
    <b-card>
      <b-card-header header-bg-variant="info">
        <b-card-title>افزودن آهنگ</b-card-title>
      </b-card-header>
      <b-card-body>
        <b-form @submit.p.prevent>
          <b-row>
            <b-col lg="3" sm="12" md="6">
              <b-form-group label="نام فارسی آهنگ">
                <b-form-input
                    type="text"
                    placeholder=""
                    v-model="nameFa"
                    dir="ltr"
                />
              </b-form-group>
            </b-col>
            <b-col lg="3" sm="12" md="6">
              <b-form-group label="نام انگلیسی آهنگ">
                <b-form-input
                    type="text"
                    placeholder=""
                    v-model="nameEn"
                    dir="ltr"
                />
              </b-form-group>
            </b-col>
            <b-col lg="6" sm="12">
              <b-form-group label="لینک آهنگ">
                <b-form-input
                    type="text"
                    placeholder=""
                    v-model="url"
                    dir="ltr"
                />
              </b-form-group>
            </b-col>
            <b-col lg="3" sm="12" md="6">
              <b-form-group label="آلبوم">
                <v-select
                    v-model="album"
                    dir="rtl"
                    label="name"
                    :options="albumList"
                    :reduce="(type) => type.id"
                ></v-select>
              </b-form-group>
            </b-col>
            <b-col lg="3" sm="12" md="6">
              <b-form-group label="لیست آرتیست ها">
                <b-overlay :show="!getArtists">
                  <v-select
                      id="label"
                      v-model="artists"
                      :dir="rtl"
                      label="name"
                      :options="artistsList"
                      :reduce="(artitstName) => artitstName.id"
                        multiple
                  ></v-select>
                </b-overlay>
              </b-form-group>
            </b-col>
            <b-col lg="3" sm="12" md="6">
              <b-form-group>
                <label for="name">
                  <feather-icon
                      icon="FeatherIcon"
                  />
                  متن آهنگ
                </label>
                <b-form-textarea
                    v-model="lyrics"
                    placeholder="متن موزیک"
                ></b-form-textarea>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="12">
              <b-button
                  variant="info"
                  class="mt-3 float-right"
                  @click="createSong"
                  :disabled="onProgress"
              >{{!onProgress ? 'ساخت آهنگ' : 'در حال ارسال اطلاعات'}}</b-button>
            </b-col>
          </b-row>
        </b-form>
      </b-card-body>
    </b-card>
    <b-card>
    <b-card-header class="bg-info">
      <b-card-title>افزودن موزیک با اکسل</b-card-title>
      <b-link
          :href="baseUrl + 'samples/musicSample.xlsx'"
          class="btn btn-success"
          target="_blank"
      >دریافت فایل نمونه</b-link>
    </b-card-header>
    <b-card-body>
      <b-alert
          :show="uploadSuccess"
          :variant="uploadType"
          dismissible
      >
        <b-card-text v-if="uploadType === 'danger'" class="p-1">{{ uploadMessage }}</b-card-text>
        <b-card-text v-if="uploadType === 'success'" class="p-1">
          <span>آپلود موزیک ها با موفقیت انجام شد و گزارش به صورت زیر است:</span><br>
          <span>کل موزیک ها: {{ total }}</span><br>
        </b-card-text>
      </b-alert>
      <b-form @submit.prevent>
        <b-form-group
            label="فایل اکسل"
        >
          <b-form-file
              v-model="excelFile"
              accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          ></b-form-file>
        </b-form-group>
      </b-form>
      <b-button
          v-if="excelFile != null"
          variant="success"
          :disabled="onProgress"
          class="mr-1"
          @click="uploadFile"
      >
        <b-spinner v-if="onProgress" small></b-spinner>
        {{ onProgress ? 'درحال پردازش' : 'آپلود فایل' }}
      </b-button>
    </b-card-body>
  </b-card>
  </div>
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
  name: 'Song_Create',
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
      url: "",
      album: null,
      albumList: [],
      artists: [],
      artistsList: [],
      lyrics: null,
      onProgress: false,
      baseUrl: process.env.VUE_APP_API_BASE,
      uploadSuccess: null,
      excelFile: null,
      uploadType: null,
      uploadMessage: "",
    }
  },
  methods: {
    async createSong(){
      await this.$http.post('songs/create' , {
        name_fa : this.nameFa,
        name_en : this.nameEn,
        url : this.url,
        album: this.album,
        artists: this.artists,
        lyrics: this.lyrics
      })
          .then(({data}) => {
            if (data.status)
            {
              this.$swal({
                title: 'انجام شد',
                text: 'آهنگ با موفقیت ساخته شد',
                icon: 'success',
                confirmButtonText: 'متوجه شدم',
                timer: 3000
              })

              this.resetData();
            }
            else
            {
              this.$bvToast.toast(data.message, {
                title: 'در ساخت آهنگ مشکلی به وجود آمده.',
                toaster: `b-toaster-top-${this.$store.state.appConfig.isRTL ? 'right' : 'left'}`,
                variant: 'danger'
              })
            }
          })
          .catch(()=>{})
    },
    async getArtists(){
      this.$http.get(`artist/get-for-select`)
          .then(({data}) => {
            if (data.status){
              this.artistsList = data.data;
            }else{
              this.$bvToast.toast('دریافت لیست آرتیست ها با خطا مواجه شد' ,{
                title: 'خطا در دریافت اطلاعات',
                toaster: 'b-toaster-top-right',
                variant: 'danger'
              })
            }
          })
          .catch(()=>{})
    },
    async getAlbums(){
      this.$http.get(`albums/get-for-select`)
          .then(({data}) => {
            if (data.status){
              this.albumList = data.data;
            }else{
              this.$bvToast.toast('دریافت لیست آلبوم ها با خطا مواجه شد' ,{
                title: 'خطا در دریافت اطلاعات',
                toaster: 'b-toaster-top-right',
                variant: 'danger'
              })
            }
          })
          .catch(()=>{})
    },
    async uploadFile() {
      const formData = new FormData
      formData.append('file', this.excelFile, 'test')
      this.onProgress = true
      await this.$http.post('songs/group-create', formData, {
        headers: {
          'Content-Type': 'multipart/formData'
        }
      }).then(({data}) =>
      {
        this.uploadSuccess = true
        this.excelFile = null
        if (data.status){
          this.$bvToast.toast('فایل با موفقیت آپلود شد', {
            title: 'موفقیت',
            toaster: `b-taster-top-${this.$store.state.appConfig.isRTL ? 'right' : 'left'}`,
            variant: 'success'
          })
          this.uploadType = 'success'
          this.total = data.total
        }else{
          this.$bvToast.toast('فایل با موفقیت آپلود نشد', {
            title: 'خطا',
            toaster: `b-taster-top-${this.$store.state.appConfig.isRTL ? 'right' : 'left'}`,
            variant: 'danger'
          })
          this.uploadType = 'danger'
          this.uploadMessage = data.message
        }
      }).catch((err) => {});
      this.onProgress = false
    },

    resetData(){
      this.nameFa = "";
      this.nameEn = "";
      this.url = "";
      this.album = null;
      this.albumList = [];
      this.artists = [];
      this.artistsList = [];
      this.lyrics = null;
      this.onProgress = false;
    }
  },
  mounted() {
    this.getArtists();
    this.getAlbums();
  }
}
</script>
