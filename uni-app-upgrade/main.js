import Vue from 'vue'
import App from './App'

import {updateurl} from './common/base.js'
Vue.prototype.$updateurl = updateurl;

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
