
export const request = (url, method, data, fun) => {
	uni.request({
		url,
		data,
		method,
		header: {
			'Authorization': uni.getStorageSync("token")
		},
		success: (resp) => {
			if (resp.data.code == 4006 || resp.data.code == 4010) {
				uni.redirectTo({
					url: '../login/login'
				});
			} else if (resp.data.code == 2000) {

				let data = resp.data
				if (data.hasOwnProperty("token")) {
					let token = data.token
					uni.setStorageSync("token", token)
				}
				fun(resp.data)
			} else {
				console.log("执行异常处理");
				uni.showToast({
					icon: 'none',
					title: resp.data.msg || "失败，错误未知，状态码：" + resp.data.code
				});
			}
		}
	});
}
