export const methods = {
	push: 'navigateTo',
	replace: 'redirectTo',
	replaceAll: 'reLaunch',
	pushTab: 'switchTab',
	back: 'navigateBack',
}
export const lifeCycle={
	beforeHooks:[],
	afterHooks:[]
};	

export const route=function(object={}){
	return {
		...object,
		params:{},
		query:{}
	}
}
