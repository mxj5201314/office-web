import App from './App'
import {
	request
} from "./utils/request.js"

import {
	urls
} from "./utils/baseUrl.js"

import {
	checkPermission
} from "./utils/checkPermission.js"


// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'

export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}


// #endif
Vue.prototype.$request = request;
Vue.prototype.$urls = urls;
Vue.prototype.$checkPermission = checkPermission;
