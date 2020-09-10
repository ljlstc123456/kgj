/*
 * @Author: nds
 */
import axios from "axios";
import React, { Component } from 'react';
import { Message } from '@alifd/next';
import moment from 'moment';
// import { Loading } from 'element-ui';

axios.defaults.withCredentials = true;

const instance = axios.create({
	timeout: 60000,
	withCredentials: false,
	headers: {
		"content-type": "application/json;charset=utf-8",
		"Authorization": ""
	}
});

let baseURL = '';
console.log(process) ;
switch (process.env.NODE_ENV) {
	case 'development':
	  //baseURL = 'http://192.168.137.22:9527/clinic_web';
		baseURL = 'https://api.sunland.vip';
    baseURL = 'http://sta.api.sunland.vip';
		break;
	case 'qa':
		baseURL = "/api";
		break;
	case 'qa2':
		baseURL = "/api";
		break;
	case 'qa-sz':
		baseURL = "/api";
		break;
	case 'production':
		baseURL = 'https://api.sunland.vip';
		break;
	case 'test1':
		// baseURL = "http://qa.enterprise.h.idoumeng.cn/front";
		baseURL = "/api";
		break;
	default:
		baseURL = "/api";
		break;
}
// var loadingInstance  = {
// 	close: function(){},
// }
instance.interceptors.request.use((async (req) => {
	let token = localStorage.getItem("kgj_token");
	if (token || req.url.indexOf('/home/login') > -1) {

	} else {

		//loadingInstance.close() ;
		location.href= `${location.origin}${location.pathname}#/user/login`
		//Vue.prototype.$router.push("login") ;
		return false;
	}
	if (!req.params) req.params = {} ;
	//console.log(req)
	return req;
}));

//刷新token定时器
let timerInterval = 0
//跳转登录
const goLogin = ()=>{
	clearInterval(timerInterval)
	location.href= `${location.origin}${location.pathname}#/user/login`
}


instance.interceptors.response.use((res) => {
	//loadingInstance.close() ;
	console.log(res)
	if (res.status == 200) {
		//用户session超期
		// if (res.data.error) {
		// 	//loadingInstance.close() ;
		// 	//location.href= `${location.origin}${location.pathname}#/login` ;
		// 	return Promise.reject();
		// }
		if (!res.data.success) {
			Message.error(res.data.error);
			//alert() ;
			//Vue.prototype.$showMsg(res.data.desc)
			return Promise.reject();
		}


		return res.data;
	}
}, (error) => {
	console.log(error) ;
	if(error.toString().indexOf("401")!=-1){//token过期
		//console.log(res)
		goLogin()
	}
	//Vue.prototype.$loading.close();
	//请求超时处理

	return Promise.reject();
});



let kgj_refresh_token = localStorage.getItem('kgj_refresh_token'),lastDate ;
if(kgj_refresh_token) {
		kgj_refresh_token = JSON.parse(kgj_refresh_token)
		lastDate = new Date(kgj_refresh_token.expiresIn).getTime()//过期时间
}

const makePost = (url) => {
	return (params, showLoading = true) => {
		if(showLoading){
			//loadingInstance = Loading.service({ fullscreen: true });
		}
		return instance.post(`${baseURL}${url}`, {...params})
	};
}

const makeGet = (url,type="param") => {
	return (params={}, showLoading = true) => {
		if(showLoading){
			//loadingInstance = Loading.service({ fullscreen: true });
		}
		var paramUrl = Object.keys(params).map((key)=>{
        // body...
        return encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
    }).join("&");

		if(type == 'param') {
			return instance.get(`${baseURL}${url}?${paramUrl}`)
		} else {
			//console.log(params) ;
			return instance.get(`${baseURL}${url}/${params.id}`)
		}

	};
}

const makePut = (url,type="param") => {
	return (params, showLoading = true) => {
		if(showLoading){
			//loadingInstance = Loading.service({ fullscreen: true });
		}
		if(type == 'param') {
			return instance.put(`${baseURL}${url}`, {...params})
		}else {
			return instance.put(`${baseURL}${url}/${params.id}`)
		}

	};
}

const makeDelete = (url) => {
	return (params, showLoading = true) => {

		if(showLoading){
			//loadingInstance = Loading.service({ fullscreen: true });
		}
		return instance.delete(`${baseURL}${url}/${params.id}`)
	};
}


//设置token
const setAuth = (obj) =>{
	let {tokenType,accessToken} = obj
	if(tokenType&&accessToken){
		localStorage.setItem('kgj_token',tokenType + " " + accessToken)
		// localStorage.setItem('kgj_refresh_token',JSON.stringify(obj))
		instance.defaults.headers['Authorization'] = tokenType + " " + accessToken
	} else if( localStorage.getItem('kgj_token')){
		instance.defaults.headers['Authorization'] = localStorage.getItem('kgj_token')
	}
	// clearInterval(timerInterval)
	// interval()
}
//定时刷新token,暂时不需要了

const interval = ()=>{
	let kgj_refresh_token = localStorage.getItem('kgj_refresh_token')
	if(kgj_refresh_token) {
		kgj_refresh_token = JSON.parse(kgj_refresh_token)
		let lastDate = new Date(kgj_refresh_token.expiresIn).getTime()//过期时间
		//在过期前1分钟之内 刷新token
		timerInterval = setInterval(()=>{
			let nowTime = new Date().getTime()
			if(lastDate - nowTime >= 0 && lastDate-nowTime <60000) {
				clearInterval(timerInterval)
				makeGet('/home/token/refresh')({refreshToken:kgj_refresh_token.refreshToken}).then(i=>{
					setAuth(i.data)
				}).catch(()=>{
					goLogin()
				})
			}
		},3000)
	}
}


setAuth({}) ;

export default {
	setAuth,
	goLogin,
	login: makePost('/home/login/back'),
	//获取登录信息
	loginInfo: makeGet('/home/user/back'),
	//token续期
	refreshToken: makeGet('/home/token/refresh'),
	//获取部门
	getOrg: makeGet('/employee/org'),

	//修改部门
	modifyOrg: makePut('/employee/org'),
	//创建部门
	addOrg: makePost('/employee/org'),
	//删除部门
	deleteOrg: makeDelete('/employee/org'),
	//获取员工列表
	getEmployee: makePost('/employee/list'),
	//员工详细信息
	employeeDetail: makeGet('/employee','path'),
	//新增员工
	addEmloyee: makePost('/employee'),
	//编辑员工
	modifyEmployee: makePut('/employee'),
	//重置密码
	resetPassword: makePut('/employee/password','path'),
	//冻结或者解冻员工
	freezeEmployee: makePut('/employee/state',"path"),
	//删除员工
	deleteEmployee: makeDelete('/employee'),
	//角色列表
	getRoles: makeGet('/employee/role'),
	//创建角色
	createRole: makePost('/employee/role'),
	//给权限
	permissionRole: makePost('/employee/role/permission'),
	//修改角色
	modifyRole: makePut('/employee/role'),
	//删除角色
	deleteRole: makeDelete('/employee/role'),

	//上传图片地址
	upload: `${baseURL}/home/upload`,

	//获取区域列表
	projectArea: makeGet('/project/area'),

	//获取角色下关联的权限
	getPermissionByRole: makeGet('/employee/role/permission','path'),

	//新增相册
	addAlbum: makePost('/project/album'),
	//获取相册详情
	getAlbum: makeGet('/project/album','path'),
	//修改相册
	modifyAlbum: makePut('/project/album'),
	//删除相册
	deleteAlbum: makeDelete('/project/album'),

	//创建户型
	createHouse:makePost('/project/housetype'),
	//获取户型详情
	getHouse: makeGet('/project/housetype','path'),
	//修改户型
	modifyHouse: makePut('/project/housetype'),
	//删除户型
	deleteHouse: makeDelete('/project/housetype'),

	//创建项目
	createProject: makePost('/project'),
	//获取项目列表
	getProjectList: makePost('/project/back'),
	//获取项目详情
	getProject: makeGet('/project/back','path'),
	//获取项目信息，用于下拉
	getProjectS:makeGet('/project/simple'),
	//修改项目
	modifyProject:makePut('/project'),

	//修改状态
	toggleState: makePut('/project/state'),
	//删除项目
	deleteProject: makeDelete('/project'),


	//客户列表
	getCustomerList:makePost('/customer/back'),
	//客户详情
	getCustomer:makeGet('/customer','path'),
	//客户报备信息
	getCustomerReport: makeGet('/customer/report','path'),


	//获取签到活动列表
	getSignList: makeGet('/sign/activity'),
	//修改活动状态
	toggleSignState: makePut('/sign/activity','path'),
	//删除活动
	deleteSign: makeDelete('/sign/activity'),
	addSign: makePost('/sign/activity'),
	modifySign:makePut('/sign/activity'),
	//获取活动下的项目
	getActivityProject: makeGet('/sign/activity/project','path'),
	//获取签到列表
	getSignEmpList: makePost('/sign/back'),

	//下载excel模板
	downLoadExcel:makePost('/employee/template'),

	//导入员工
	importStaff:`${baseURL}/employee/import`,

	//导出客户
	exportCustom:makePost('/customer/export'),

	//关联部门
	linkOrg:makePost('/employee/org/batch'),
	//关联角色
	linkRole:makePost('/employee/role/batch'),

	//获取启动广告列表
	adList:makeGet('/home/app/ad/list'),


	//创建广告
	createAd:makePost('/home/app/ad'),

	//修改广告
	modifyAd:makePut('/home/app/ad'),
}
