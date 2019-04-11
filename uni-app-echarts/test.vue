<template>
	<view class="content">
		<div class="echarts-box">
			<mpvue-echarts class="ec-canvas" :onInit="lineInit1" canvasId="line1" :lazyLoad="islazyLoad" :key="mpvue-echarts1" />
		</div>
	</view>
</template>

<script>
	import * as echarts from '@/components/echarts/echarts.simple.min.js';
	import mpvueEcharts from '@/components/echarts/echarts.vue';

	let echartsArr = [];
	let echartsOptions = {
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'cross',
					label: {
						backgroundColor: '#283b56'
					}
				}
			},
			legend: {
				data: ['最新成交价', '预购队列']
			},
			toolbox: {
				show: true,
				feature: {
					dataView: {
						readOnly: false
					},
					restore: {},
					saveAsImage: {}
				}
			},
			dataZoom: {
				show: false,
				start: 0,
				end: 100
			},
			xAxis: [{
					type: 'category',
					boundaryGap: true,
					data: (function() {
						var now = new Date();
						var res = [];
						var len = 10;
						while (len--) {
							res.unshift(now.toLocaleTimeString().replace(/^\D*/, ''));
							now = new Date(now - 2000);
						}
						return res;
					})()
				},
				{
					type: 'category',
					boundaryGap: true,
					data: (function() {
						var res = [];
						var len = 10;
						while (len--) {
							res.push(10 - len - 1);
						}
						return res;
					})()
				}
			],
			yAxis: [{
					type: 'value',
					scale: true,
					name: '价格',
					max: 30,
					min: 0,
					boundaryGap: [0.2, 0.2]
				},
				{
					type: 'value',
					scale: true,
					name: '预购量',
					max: 1200,
					min: 0,
					boundaryGap: [0.2, 0.2]
				}
			],
			series: [{
					name: '预购队列',
					type: 'bar',
					xAxisIndex: 1,
					yAxisIndex: 1,
					data: (function() {
						var res = [];
						var len = 10;
						while (len--) {
							res.push(Math.round(Math.random() * 1000));
						}
						return res;
					})()
				},
				{
					name: '最新成交价',
					type: 'line',
					data: (function() {
						var res = [];
						var len = 0;
						while (len < 10) {
							res.push((Math.random() * 10 + 5).toFixed(1) - 0);
							len++;
						}
						return res;
					})()
				}
			]
		
	};
	let lineInitPblic = (canvas, width, height, key) => {
		echarts.setCanvasCreator(() => canvas);
		let lineChart = echarts.init(canvas, null, {
			width: width,
			height: height
		})
		echartsArr.push(lineChart);
		canvas.setChart(lineChart);
		lineChart.setOption(echartsOptions)
		return lineChart
	}

	export default {
		components: {
			mpvueEcharts
		},
		data() {
			return {
				islazyLoad: false
			}
		},
		onLoad() {
			setTimeout(() => {
				this.islazyLoad = true;
			}, 1000)
		},
		methods: {
			lineInit1(c, w, h) {
				lineInitPblic(c, w, h, 1);
			},
			/**
			 * 刷新Echarts
			 */
			reloadEcharts() {
				for (let i = 0; i < echartsArr.length; i++) {
					let myChart = echartsArr[i];
					let option = myChart.getOption();
					option.series[0].data = echartsOptions[i + 1];
					myChart.setOption(option);
				}
			}
		}
	}
</script>

<style lang="scss">
	.content {
		height: 100vh;

		.echarts-box {
			height: 500upx;
		}
	}
</style>
