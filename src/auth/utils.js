import useJwt from '@/auth/jwt/useJwt'
import store from '@store'
import cookie from '@/libs/cookie'
import axios from '@axios'
import Vue from 'vue'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

/**
 * Return if user is logged in
 * This is completely up to you and how you want to store the token in your frontend application
 * e.g. If you are using cookies to store the application please update this function
 */
// eslint-disable-next-line arrow-body-style
export const isUserLoggedIn = () => {
  if (store.state.user.token || cookie.get('token')) {
    return true
  }
  return false
}

export const getUserData = async () => {
  if (store.state.user.data) return store.state.user.data

  if (cookie.get('token')){
    if (!store.state.user.token){
      store.commit('user/UPDATE_USER_TOKEN', cookie.get('token'))
    }
    await axios.get('user/get-user-data')
    .then(({data}) => {
      if (data.status){
        store.commit('user/UPDATE_USER_DATA', data.data)
      }
    }).catch(error=>{
      Vue.prototype.$toast({
        component: ToastificationContent,
        position: 'top-left',
        props: {
          title: 'احزار هویت انجام نشد',
          icon: 'RefreshCcwIcon',
          variant: 'danger',
          text: 'کاربر گرامی ، شما از سیستم خارج شدید و باید دوباره وارد سیستم شوید',
        },
      })
      store.commit('user/UPDATE_USER_TOKEN', null)
      store.commit('user/UPDATE_USER_DATA', null)
      cookie.remove('token')
    })
    return store.state.user.data
  }

  return false
}

/**
 * This function is used for demo purpose route navigation
 * In real app you won't need this function because your app will navigate to same route for each users regardless of ability
 * Please note role field is just for showing purpose it's not used by anything in frontend
 * We are checking role just for ease
 * NOTE: If you have different pages to navigate based on user ability then this function can be useful. However, you need to update it.
 * @param {String} userRole Role of user
 */
export const getHomeRouteForLoggedInUser = userRole => {
  if (userRole === 'admin') return '/'
  if (userRole === 'client') return { name: 'access-control' }
  return { name: 'auth-login' }
}
