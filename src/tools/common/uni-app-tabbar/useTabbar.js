import Draw from './drawTabbar.js';
const allListKeys = ['tabbar1', 'tabbar2', 'tabbar3', 'tabbar4'];
const list = [{
		"pagePath": "/pages/tabbar/tabbar-1/tabbar-1",
		"iconPath": "static/tabbar/home.png",
		"selectedIconPath": "static/tabbar/homeactive.png",
		'text': '首页',
		key: 'tabbar1'
	},
	{
		"pagePath": "/pages/tabbar/tabbar-2/tabbar-2",
		"iconPath": "static/tabbar/guanzhu.png",
		"selectedIconPath": "static/tabbar/guanzhuactive.png",
		'text': '关注',
		key: 'tabbar2'
	},
	{
		"pagePath": "/pages/tabbar/tabbar-3/tabbar-3",
		"iconPath": "static/tabbar/news.png",
		"selectedIconPath": "static/tabbar/newsactive.png",
		"text": "消息",
		key: 'tabbar3'
	},
	{
		"pagePath": "/pages/tabbar/tabbar-4/tabbar-4",
		"iconPath": "static/tabbar/me.png",
		"selectedIconPath": "static/tabbar/meactive.png",
		'text': '我',
		key: 'tabbar4'
	}
]
export const draw = (config) => {
	return new Draw({
		allListKeys,
		list,
		...config,
	});
}
