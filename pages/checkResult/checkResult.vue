<template>
	<view class="page">
		<view class="summary-container">
			<view class="user-info">
				<image :src="photo" mode="widthFix" class="photo"></image>
				<view class="info">
					<text class="username">{{ name }}</text>
					<text class="dept">隶属部门：{{ deptName == null ? '无' : deptName }}</text>
				</view>
			</view>
			<view class="date">{{ date }}</view>
		</view>

		<view class="result-container">
			<view class="left">
				<image src="../../static/icon-6.png" mode="widthFix" class="icon-timer"></image>
				<image src="../../static/icon-6.png" mode="widthFix" class="icon-timer"></image>
				<view class="line"></view>
			</view>
			<view class="right">
				<view class="row">
					<text class="start">上班（时间 {{ attendanceTime }}）</text>
				</view>

				<view class="row">
					<text class="checkin-time">签到时间（{{ checkinTime }}）</text>
					<text class="checkin-result other green" v-if="status == '正常'">{{ status }}</text>
					<text class="checkin-result other yellow" v-if="status == '迟到'">{{ status }}</text>
				</view>
				<view class="row">
					<image src="../../static/icon-7.png" mode="widthFix" class="icon-small"></image>
					<text class="desc">{{ address }}</text>
					<text class="checkin-result green" v-if="risk == 1">低风险</text>
					<text class="checkin-result yellow" v-if="risk == 2">中风险</text>
					<text class="checkin-result red" v-if="risk == 3">高风险</text>
				</view>
				<view class="row">
					<image src="../../static/icon-8.png" mode="widthFix" class="icon-small"></image>
					<block v-if="checkinTime != ''">
						<text class="desc">身份验证</text>
						<text class="checkin-result green">已通过</text>
					</block>
				</view>
				<view class="row">
					<text class="end">下班（时间 {{ closingTime }}）</text>
				</view>
			</view>
		</view>

		<view class="checkin-report">
			<image src="../../static/big-icon-1.png" mode="widthFix" class="big-icon"></image>
			<view class="report-title">
				<text class="days">{{ total }}</text>
				<text class="unit">天</text>
			</view>
			<view class="sub-title">
				<text>累计签到</text>
				<view class="line"></view>
			</view>
			<view class="calendar-container">
				<view class="calendar" v-for="one in weekCheckin" :key="one">
					<image src="../../static/icon-9.png" mode="widthFix" class="calendar-icon" v-if="one.type != '节假日'"></image>
					<image src="../../static/icon-10.png" mode="widthFix" class="calendar-icon" v-if="one.type == '节假日'"></image>
					<text class="day">{{ one.day }}</text>
					<text class="result green" v-if="one.status == 1">正常</text>
					<text class="result yellow" v-if="one.status == 2">迟到</text>
					<text class="result red" v-if="one.status == 3">缺勤</text>
					<text class="result red" v-if="one.status == 0">待考勤</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			name: '',
			photo: '',
			deptName: '',
			address: '',
			status: '',
			risk: '',
			checkinTime: '',
			date: '',
			attendanceTime: '',
			closingTime: '',
			total: 0,
			statusEnum: {
				'0': '待考勤',
				'1': '已考勤',
				'2': '迟到',
				'3': '缺勤',
				'4': '假期',
				'-1': ''
			},
			weekCheckin: []
		};
	},
	methods: {
		getTodayCheckin() {
			let that = this;
			that.$request(this.$urls.getTodayCheckin, 'GET', {}, res => {
				if (res.code === 2000) {
					let result = res.data;
					that.name = result.name;
					that.photo = result.photo;
					that.deptName = result.deptName;
					that.date = result.today;
					that.attendanceTime = result.attendanceTime;
					that.closingTime = result.closingTime;
					try {
						that.checkinTime = result.todayCheckins[0].checkinTime;
						that.status = result.todayCheckins[0].status;
						that.risk = result.todayCheckins[0].risk;
						that.address = result.todayCheckins[0].address;
					} catch (e) {}
					that.total = result.total;
					that.weekCheckin = result.weekCheckinList;
				} else {
					uni.showToast({
						title: res.data.msg || '系统错误',
						icon: 'error'
					});
				}
			});
		}
	},
	onShow() {
		this.getTodayCheckin();
	}
};
</script>

<style lang="less">
@import url('./checkResult.less');
</style>
