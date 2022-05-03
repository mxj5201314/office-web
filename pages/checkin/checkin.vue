<template>
	<view>
		<camera device-position="front" flash="off" class="camera" @error="error" v-if="showCamera"></camera>
		<image mode="widthFix" class="image" :src="photoPath" v-if="showImage"></image>
		<view class="operate-container">
			<button type="primary" class="btn" @tap="clickBtn('拍照')" :disabled="!canCheckin">{{ btnText }}</button>
			<button type="warn" class="btn" @tap="reset" :disabled="!canCheckin">重拍</button>
		</view>
		<view class="notice-container">
			<text class="notice">注意事项</text>
			<text class="desc">拍照签到的时候，必须要拍摄自己的正面照片，侧面照片会导致无法识别。另外， 拍照的时候不要戴墨镜或者帽子，避免影响拍照签到的准确度。</text>
		</view>
	</view>
</template>

<script>
let QQMapWX = require('../../lib/qqmap-wx-jssdk.js');
let qqmapsdk;

export default {
	data() {
		return {
			canCheckin: true,
			photoPath: '',
			btnText: '拍照',
			showCamera: true,
			showImage: false
		};
	},
	methods: {
		clickBtn() {
			let that = this;
			if (that.btnText == '拍照') {
				let ctx = wx.createCameraContext();
				ctx.takePhoto({
					quality: 'high',
					success: resp => {
						that.photoPath = resp.tempImagePath;
						that.showCamera = false;
						that.showImage = true;
						that.btnText = '签到';
					}
				});
			} else {
				uni.showLoading({
					title: '签到中请稍后'
				});

				// 获取地理经纬度
				uni.getLocation({
					type: 'wgs84',
					success: resp => {
						// 调用腾讯定位的sdk获取对应经纬的地理信息
						qqmapsdk.reverseGeocoder({
							location: {
								latitude: resp.latitude,
								longitude: resp.longitude
							},
							success: resp2 => {
								let addressComponent = resp2.result.address_component;
								addressComponent['address'] = resp2.result.address;
								that.checkin(addressComponent);
								console.log(resp2.result);
								uni.hideLoading();
							},
							fail: failMsg => {
								uni.hideLoading();
								uni.showToast({
									title: '获取位置失败',
									icon: 'error'
								});
								console.log(failMsg);
							}
						});
					},

					fail: failMsg => {
						uni.hideLoading();
						uni.showToast({
							title: '获取位置失败',
							icon: 'error'
						});
						console.log(failMsg);
					}
				});
			}
		},
		reset() {
			this.showCamera = true;
			this.showImage = false;
			this.btnText = '拍照';
		},
		checkin(locationInfo) {
			const that = this;
			uni.uploadFile({
				url: that.$urls.checkin,
				filePath: that.photoPath,
				name: 'photo',
				header: {
					Authorization: uni.getStorageSync('token')
				},
				formData: locationInfo,

				success: resp => {
					let resData = JSON.parse(resp.data);
					// 人脸不存在
					if (resData.code == 4014) {
						uni.hideLoading();
						uni.showModal({
							title: '提示信息',
							content: 'OFFICE系统中不存在你的人脸识别模型，是否用当前这张照片作为人脸识别模型？',
							success: res => {
								if (res.confirm) {
									console.log('执行');
									//上传头像图片
									uni.uploadFile({
										url: that.$urls.createFace,
										filePath: that.photoPath,
										name: 'photo',
										header: {
											Authorization: uni.getStorageSync('token')
										},
										success: resp2 => {
											let resData2 = JSON.parse(resp2.data);
											uni.showToast({
												title: resData2.msg + (resData2.code == 2000 ? '请重新打卡' : ''),
												icon: resData2.code == 2000 ? 'success' : 'error',
												duration: 2500
											});
											that.reset();
										}
									});
								}
							}
						});
					} else if (resData.code == 2000) {
						uni.hideLoading();
						//签到成功
						uni.showToast({
							title: '签到成功',
							duration: 2500,
							success: () => {
								//TODO 跳转到签到结果统计页面
								console.log("执行");
								uni.navigateTo({
									url:"../checkResult/checkResult"
								})
							}
						});
					} else {
						console.log('执行');
						console.log(resData.code);
						uni.showToast({
							title: resData.msg,
							icon: 'error'
						});
					}
				}
			});
		},
		validCanCheckIn() {
			this.$request(this.$urls.validCanCheckIn, 'GET', {}, res => {
				if (res.code === 2000) {
					if (res.data.code === -1) {
						uni.showToast({
							title: res.data.message,
							icon: 'error',
							duration: 2500
						});
						this.canCheckin = false;
						uni.navigateBack({});
					}
				}
			});
		}
	},
	onLoad() {
		qqmapsdk = new QQMapWX({
			key: 'PTJBZ-FCXK4-4EBUU-DVMSC-SGR36-Y3BES'
		});
		// this.validCanCheckIn();
	}
};
</script>

<style lang="less">
@import url('checkin.less');
</style>
