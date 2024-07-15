<template>
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
</template>

<script>
import { BButton, BCard, BCardBody, BCardHeader, BCardTitle, BCol, BFormFile } from 'bootstrap-vue'

export default {
  components: {
    BButton,
    BCol,
    BCardHeader,
    BCardTitle,
    BCard,
    BCardBody,
    BFormFile,
  },

  data(){
    return {
      form: {
        images: [],
      },
      onProgress: false,
    }
  },

  methods:{
    async uploadFiles()
    {
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
    }
  }
}
</script>
