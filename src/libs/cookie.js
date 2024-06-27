import Vue from 'vue'
import VueCookies from 'vue-cookies'

// default options config: { expires: '1d', path: '/', domain: '', secure: '', sameSite: 'Lax' }
Vue.use(VueCookies, { secure: true})

export default VueCookies