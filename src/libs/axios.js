import Vue from 'vue'

import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

// axios
import axios from 'axios'
import store from '@/store';
import cookie from '@/libs/cookie'
import router from '@/router';

const axiosIns = axios.create({
  baseURL: process.env.VUE_APP_API,
  timeout: 120000,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json'
  }
})

axiosIns.interceptors.request.use(function (config) {
  const current = new Date().getTime();
  let loginExpire = cookie.get('loginExpire');

  let ExpireHourDefault = 1;
  if(!loginExpire) {
    cookie.set('loginExpire' , (current + (ExpireHourDefault*60*60*1000)))
  } else {
    if(loginExpire<current){
      cookie.remove('loginExpire')
      cookie.remove('token')
      window.location.reload();
    } else {
      cookie.set('loginExpire' , (current + (ExpireHourDefault*60*60*1000)))
    }
  }

  config.headers.Authorization = "Bearer " + store.state.user.token
  config.timeout = 999999999
  return config;
});
axiosIns.interceptors.response.use(response => {
  return response;
}, error => {
  if (error.response.status === 401) {
    store.commit('user/UPDATE_USER_TOKEN', null)
    store.commit('user/UPDATE_USER_DATA', null)
    cookie.remove('token')
    router.push({name: 'auth-login'})
  }
  if (error.response.status === 422) {
    for (const key in error.response.data.errors) {
      if (Object.hasOwnProperty.call(error.response.data.errors, key)) {
        const message = error.response.data.errors[key].join(' , ');
        Vue.prototype.$toast({
          component: ToastificationContent,
          position: 'top-left',
          props: {
            title: 'متن خطا',
            icon: 'RefreshCcwIcon',
            variant: 'danger',
            text: message,
          },
        })
      }
    }
  }else{
    Vue.prototype.$toast({
      component: ToastificationContent,
      position: 'top-left',
      props: {
        title: 'خطای ارتباطی',
        icon: 'RefreshCcwIcon',
        variant: 'danger',
        text: error.response.data.message ?? 'ارتباط با وب سرویس قطع می باشد',
      },
    })
  }
  return error;
});

Vue.prototype.$http = axiosIns

export default axiosIns
