<template>
	<view>
		<view class="statistics">
			<image src="../../static/big-icon-1.png" mode="widthFix" class="big-icon"></image>
			<view class="report-title">
				<text class="days">{{ normalAttendance }}</text>
				<text class="unit">天</text>
			</view>
			<view class="sub-title"><text>本月签到</text></view>
			<view class="report">
				<view class="column green">
					<text class="column-title">正常签到</text>
					<text class="number">{{ normalAttendance }}</text>
				</view>
				<view class="column orange">
					<text class="column-title">迟到签到</text>
					<text class="number">{{ lateAttendance }}</text>
				</view>
				<view class="column red">
					<text class="column-title">缺勤签到</text>
					<text class="number">{{ absenteeism }}</text>
				</view>
			</view>
		</view>
		<view class="calendar-container"><uni-calendar :insert="true" :lunar="false" :selected="checkinList" @monthSwitch="changeMonth" @confirm="changeMonth" /></view>
	</view>
</template>

<script>
import uniCalendar from '@/components/uni-calendar/uni-calendar.vue';
export default {
	components: {
		uniCalendar
	},
	data() {
		return {
			checkinList: [],
			normalAttendance: 0,
			lateAttendance: 0,
			absenteeism: 0
		};
	},
	onShow() {
		let that = this;
		let now = new Date();
		let year = now.getFullYear();
		let month = now.getMonth() + 1;
		that.getCheckin(that, year, month);
	},
	methods: {
		getCheckin(ref, year, month) {
			let that = ref;
			that.normalAttendance = 0;
			that.lateAttendance = 0;
			that.absenteeism = 0;
			that.checkinList.length = 0;
			that.$request(this.$urls.getMonthCheckin, 'POST', { year: year, month: month }, res => {
				for (let one of res.data.checkinList) {
					if (one.status == 1 || one.status == 2 || one.status == 3) {
						let color = '';
						if (one.status == 1) {
							color = 'green';
						} else if (one.status == 2) {
							color = 'orange';
						} else if (one.status == 3) {
							color = 'red';
						}
						that.checkinList.push({
							date: one.date,
							info: one.status == 1 ? '考勤' : one.status == 2 ? '迟到' : one.status == 3 ? '缺勤' : '',
							color: color
						});
					}
				}
				that.normalAttendance = res.data.normalAttendance;
				that.lateAttendance = res.data.lateAttendance;
				that.absenteeism = res.data.absenteeism;
			});
		},
		changeMonth(e) {
			let that = this;
			let year = e.year;
			let month = e.month;
			that.getCheckin(that, year, month);
		}
	}
};
</script>

<style lang="less">
@import url('myCheckin.less');
</style>
