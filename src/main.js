// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/store'
import axios from 'axios'
import qs from 'qs'
import ElementUI from 'element-ui'
import mavonEditor from 'mavon-editor'
import JsonViewer from 'vue-json-viewer'
import 'element-ui/lib/theme-chalk/index.css'
import 'mavon-editor/dist/css/index.css'

Vue.config.productionTip = false
Vue.prototype.$qs = qs
Vue.prototype.$axios = axios
Vue.use(ElementUI)
Vue.use(mavonEditor)
Vue.use(JsonViewer)

// axios.defaults.baseURL = 'https://ronyun.com/synonym/'
axios.defaults.baseURL = 'http://localhost:8081'
// axios.defaults.baseURL = 'http://1527215sw.top:8087/'
axios.defaults.withCredentials=true;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
