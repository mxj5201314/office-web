let baseUrl = "http://192.168.0.102:8080/wx-api"
export const urls = {
	register: baseUrl + "/user/register",
	login: baseUrl + "/user/login",
	checkin: baseUrl + "/checkin/checkin",
	createFace: baseUrl + "/checkin/createFace",
	validCanCheckIn: baseUrl + "/checkin/validCanCheckIn",
	getTodayCheckin: baseUrl + "/checkin/getTodayCheckin",
	getUserSummary: baseUrl + "/user/getUserSummary",
}
