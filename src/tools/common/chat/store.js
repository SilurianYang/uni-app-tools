import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		SocketState: {},
		SocketStateErr: {},
	},
	mutations: {
		setSocketState(that, info) {
			that.SocketState = info;
		},
		setSocketStateErr(that, info) {
			that.SocketStateErr = info;
		}
	}
})
export default store;
