// 以下文件格式为描述路由的协议格式
// 你可以调整 routerConfig 里的内容
// 变量名 routerConfig 为 iceworks 检测关键字，请不要修改名称
import UserLogin from './pages/UserLogin';
import Project from './pages/Project';
import ProjectAdd from './pages/ProjectAdd';
import Custom from './pages/Custom';
import CustomInfo from './pages/CustomInfo';
import StaffAdd from './pages/StaffAdd';
import Staff from './pages/Staff';
import Role from './pages/Role';
import Sign from './pages/Sign';
import SignDetail from './pages/SignDetail';
// import React, { Component } from 'react';
// 
// const UserLogin = React.lazy(() => import('./pages/UserLogin'));
// const Project = React.lazy(() => import('./pages/Project'));
// const ProjectAdd = React.lazy(() => import('./pages/ProjectAdd'));
// const Custom = React.lazy(() => import('./pages/Custom'));
// const CustomInfo = React.lazy(() => import('./pages/CustomInfo'));
// const StaffAdd = React.lazy(() => import('./pages/StaffAdd'));
// const Staff = React.lazy(() => import('./pages/Staff'));
// const Role = React.lazy(() => import('./pages/Role'));
// const Sign = React.lazy(() => import('./pages/Sign'));
// const SignDetail = React.lazy(() => import('./pages/SignDetail'));

const routerConfig = [
  {
    path: '/user/login',
    component: UserLogin,
  },

  // {
  //   path: '/user/register',
  //   component: UserRegister,
  // },
  {
    path: '/project',
    component: Project,
  },
  {
    path: '/projectAdd',
    component: ProjectAdd,
  },
  {
    path: '/custom',
    component: Custom,
  },
  {
    path: '/customInfo',
    component: CustomInfo,
  },
  {
    path: '/staffAdd',
    component: StaffAdd,
  },
	{
	  path: '/sign',
	  component: Sign,
	},
	{
		path:'/signDetail',
		component: SignDetail
	},
  {
    path: '/staff',
    component: Staff,
  },
  {
    path: '/role',
    component: Role,
  },
];

export default routerConfig;
