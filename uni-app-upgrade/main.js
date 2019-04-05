import Vue from 'vue'
import App from './App'

import {updateurl} from './common/base.js'

Vue.config.productionTip = false

Vue.prototype.$updateurl = updateurl;


App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
