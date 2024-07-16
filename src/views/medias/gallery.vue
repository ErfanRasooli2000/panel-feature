<template>
  <div>
    <b-card>
      <b-card-header header-bg-variant="info">
        <b-card-title>آپلود فایل گالری</b-card-title>
      </b-card-header>
      <b-card-body>
        <b-form-file
            placeholder="فایل ها را اینجا آپلود کنین"
            drop-placeholder="فایل ها را اینجا آپلود کنین"
            multiple
            v-model="form.images"
        />
        <b-col sm="12">
          <b-button
              variant="success"
              class="mt-3 float-right"
              @click="uploadFiles"
              :disabled="onProgress"
          >{{!onProgress ? 'آپلود فایل ها' : 'در حال ارسال اطلاعات'}}</b-button>
        </b-col>
      </b-card-body>
    </b-card>
    <b-card>
      <b-card-header>
        <b-card-title>گالری</b-card-title>
      </b-card-header>
      <b-card-body>
        <b-container>
          <b-row>
            <b-col sm="6" v-for="(item, index) in gallery" :key="index" class="d-flex justify-content-center mb-4" @click="copyToClipboard(item.url)">
              <b-img-lazy
                  :src="item.url"
                  fluid
                  class="bordered-image"
              />
            </b-col>
          </b-row>
        </b-container>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
import { BButton, BCard, BCardBody, BCardHeader, BCardTitle, BCol, BFormFile , BImgLazy , BRow , BContainer } from 'bootstrap-vue'

export default {
  components: {
    BButton,
    BCol,
    BCardHeader,
    BRow,
    BContainer,
    BCardTitle  ,
    BCard,
    BCardBody,
    BImgLazy,
    BFormFile,
  },

  data(){
    return {
      form: {
        images: [],
      },
      gallery: [],
      onProgress: false,
    }
  },

  mounted() {
    this.getGallery()
  },

  methods:{
    async getGallery() {
      await this.$http.get('media/gallery-images-list')
          .then(({data}) => {
            if(data.status)
            {
              this.gallery = data.data;
            }
          })
          .catch(()=>{
          })
    },

    async uploadFiles() {
      const formData = new FormData();
      for (let i = 0; i < this.form.images.length; i++) {
        formData.append('images[]', this.form.images[i]);
      }

      this.onProgress = true
      await this.$http.post('media/upload-multiple-images', formData)
          .then(({data}) => {
            if(data.status)
            {
              this.$bvToast.toast('دسته بندی با موفقیت ذخیره شد.', {
                title: 'موفقیت',
                toaster: 'b-toaster-top-right',
                variant: 'success',
              })
              this.form = {
                images: [],
              }
            }
          })
          .catch(()=>{
          })

      this.onProgress = false;
    },

    copyToClipboard(url) {
      console.log(url)
      const el = document.createElement('textarea');
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      alert('URL copied to clipboard: ' + url);
    },
  }
}
</script>

<style scoped>
.bordered-image {
  border: 2px solid #000; /* Add border */
  cursor: pointer; /* Change cursor to pointer on hover */
  transition: transform 0.2s ease; /* Smooth transition on hover */
}

.bordered-image:hover {
  transform: scale(1.05); /* Slightly enlarge image on hover */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Add shadow on hover */
}
</style>
