<template>
  <b-card>
    <b-card-header header-bg-variant="info">
      <b-card-title>ساخت کاربر</b-card-title>
    </b-card-header>
    <b-card-body>
      <b-row>
        <b-col sm="6">
          <b-form-group
              label="نام"
          >
            <b-form-input
                id="name"
                type="text"
                placeholder="نام"
                v-model="form.name"
            />
          </b-form-group>
        </b-col>
        <b-col sm="6">
          <b-form-group
              label="نام کاربری"
          >
            <b-form-input
                id="username"
                type="text"
                placeholder="نام کاربری"
                v-model="form.username"
            />
          </b-form-group>
        </b-col>
        <b-col sm="6">
          <b-form-group
              label="شماره موبایل"
          >
            <b-form-input
                id="mobile"
                type="text"
                placeholder="شماره موبایل"
                v-model="form.mobile"
            />
          </b-form-group>
        </b-col>
        <b-col sm="6">
          <b-form-group
              label="ایمیل"
          >
            <b-form-input
                id="email"
                type="email"
                placeholder="ایمیل"
                v-model="form.email"
            />
          </b-form-group>
        </b-col>
        <b-col sm="6">
          <b-form-group
              label="رمز عبور"
          >
            <b-form-input
                id="password"
                type="password"
                placeholder="رمز عبور"
                v-model="form.password"
            />
          </b-form-group>
        </b-col>
        <b-col sm="6">
          <b-form-group
              label="تایید رمز عبور"
          >
            <b-form-input
                id="password_confirmation"
                type="password"
                placeholder="تایید رمز عبور"
                v-model="form.password_confirmation"
            />
          </b-form-group>
        </b-col>
        <b-col sm="12">
          <b-form-group
              label="بیوگرافی"
          >
            <b-form-input
                id="biography"
                type="text"
                placeholder="بیوگرافی"
                v-model="form.biography"
            />
          </b-form-group>
        </b-col>
        <b-col lg="6" sm="6" md="6">
          <b-form-group label="جنسیت">
            <v-select
                id="gender"
                v-model="form.gender"
                dir="rtl"
                label="name"
                :options="genderList"
                :reduce="(gender) => gender.value"
            ></v-select>
          </b-form-group>
        </b-col>
        <b-col lg="6" sm="6" md="6">
            <b-form-group label="تاریخ تولد">
              <date-picker v-model="form.birthday" type="date" clearable/>
            </b-form-group>
        </b-col>
        <b-col sm="6" class="mt-2">
          <b-form-group
              label="فایل رزومه"
          >
            <b-form-file
                placeholder="فایل رزومه را اینجا آپلود کنین"
                drop-placeholder="فایل رزومه را اینجا آپلود کنین"
                v-model="form.profile"
            />
          </b-form-group>
        </b-col>
        <b-col sm="6" class="mt-2">
          <b-form-group
              label="تصویر پروفایل"
          >
            <b-form-file
                placeholder="تصویر پروفایل را اینجا آپلود کنین"
                drop-placeholder="تصویر پروفایل را اینجا آپلود کنین"
                v-model="form.resume"
            />
          </b-form-group>
        </b-col>

      </b-row>
      <b-col sm="12">
        <b-button
            variant="info"
            class="mt-3 float-right"
            @click="createUser"
            :disabled="onProgress"
        >{{!onProgress ? 'ثبت کاربر' : 'در حال ارسال اطلاعات'}}</b-button>
      </b-col>
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
  name: 'User_Create',
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
      form: {
        name : '',
        username : '',
        email : '',
        password : '',
        password_confirmation : '',
        biography : '',
        mobile : '',
        resume : null,
        profile : null,
        gender : null,
        birthday : null,
      },
      genderList:[
        {name: 'آقا' , value: 'male'},
        {name: 'خانم' , value: 'female'},
        {name: 'سایر' , value: 'other'},
      ],
      onProgress: false
    }
  },

  mounted(){
  },

  methods: {
    async createUser()
    {
      const formData = new FormData();
      formData.append('name', this.form.name);
      formData.append('username', this.form.username);
      formData.append('email', this.form.email);
      formData.append('password', this.form.password);
      formData.append('password_confirmation', this.form.password_confirmation);
      formData.append('biography', this.form.biography);
      formData.append('mobile', this.form.mobile);
      formData.append('gender', this.form.gender);
      formData.append('birthday', this.form.birthday);

        formData.append('resume', this.form.resume);

        formData.append('profile', this.form.profile);


      this.onProgress = true
      await this.$http.post('user/create', formData , { headers: { 'Content-Type': 'multipart/form-data' }})
          .then(({data}) => {
            if (data.status)
            {
              this.$bvToast.toast('کاربر با موفقیت ذخیره شد.', {
                title: 'موفقیت',
                toaster: 'b-toaster-top-right',
                variant: 'success',
              })

              this.$router.push({ name :'User_List' })
            }
          })
          .catch(()=>{
          })

      this.onProgress = false;
    },
  }
}
</script>
