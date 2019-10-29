// 菜单配置
// headerMenuConfig：头部导航配置
// asideMenuConfig：侧边导航配置

const headerMenuConfig = [
  {
    name: '首页',
    path: '/project',
    icon: 'home',
  }
];

const asideMenuConfig = [
  // {
  //   name: 'Dashboard',
  //   path: '/dashboard',
  //   icon: 'home',
  //   children: [
  //     {
  //       name: '监控页',
  //       path: '/dashboard/monitor',
  //     },
  //   ],
  // },
  // {
  //   name: '文章管理',
  //   path: '/post',
  //   icon: 'copy',
  //   children: [
  //     { name: '文章列表', path: '/post/list' },
  //     { name: '添加文章', path: '/post/create' },
  //   ],
  // },
  // {
  //   name: '分类管理',
  //   path: '/cate',
  //   icon: 'cascades',
  //   children: [
  //     { name: '分类列表', path: '/cate/list' },
  //     { name: '添加分类', path: '/cate/create' },
  //   ],
  // },
  // {
  //   name: '标签管理',
  //   path: '/tag',
  //   icon: 'pin',
  //   children: [
  //     { name: '标签列表', path: '/tag/list' },
  //     { name: '添加标签', path: '/tag/create' },
  //   ],
  // },
  // {
  //   name: '用户管理',
  //   path: '/users',
  //   icon: 'yonghu',
  //   children: [
  //     { name: '用户列表', path: '/users/list' },
  //     { name: '添加用户', path: '/users/create' },
  //     { name: '修改密码', path: '/users/pwd' },
  //   ],
  // },
  // {
  //   name: '通用设置',
  //   path: '/setting',
  //   icon: 'shezhi',
  //   children: [
  //     { name: '基础设置', path: '/setting/basic' },
  //     {
  //       name: '菜单设置',
  //       path: '/setting/navigation',
  //     },
  //   ],
  // },
	
	
	
  {
    name: '项目管理',
    path: '/project',
    icon: 'cascades',
  },
  {
    name: '员工管理',
    path: '/staff',
    icon: 'yonghu',
  },
  {
    name: '客户管理',
    path: '/custom',
    icon: 'yonghu',
  },
	{
	  name:'踩盘签到',
		path: '/sign',
	  icon: 'pin',
	},
	{
	  name: '设置',
	  icon: 'shezhi',
		children: [
			{
			 name: '\u89D2\u8272\u6743\u9650\u7BA1\u7406',
			 path: '/role',
			},
			{
			 name: 'app启动图',
			 path: '/startLogo',
			}
		],
	}
];

export { headerMenuConfig, asideMenuConfig };
