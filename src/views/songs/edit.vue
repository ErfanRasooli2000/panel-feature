<template>
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
                @click="updateSong"
                :disabled="onProgress"
            >{{!onProgress ? 'ویرایش آهنگ' : 'در حال ارسال اطلاعات'}}</b-button>
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
  name: 'Song_Edit',
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
      onProgress: false
    }
  },
  methods: {
    async updateSong(){
      await this.$http.put(`songs/update/${this.$route.params.id}` , {
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
            }
            else
            {
              this.$bvToast.toast(data.message, {
                title: 'در ساخت آهنگ مشکلی به وجود آمده.',
                toaster: `b-toaster-top-right`,
                variant: 'danger'
              })
            }
          })
          .catch(()=>{})
    },
    async getSong(){
      await this.$http.get(`songs/show/${this.$route.params.id}`)
          .then(response => {
            if (response.status === 200){
              let data = response.data.data;
              this.nameFa = data.name_fa;
              this.nameEn = data.name_en;
              this.url = data.url;
              this.lyrics = data.lyric;

              if (data.album)
              {
                this.album = data.album.id;
              }

              this.artists = data.artist.map((item) => {
                return item.id;
              });
            }
          })
          .catch((err) => {});
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
  },
  mounted() {
    this.getSong();
    this.getArtists();
    this.getAlbums();
  }
}
</script>
