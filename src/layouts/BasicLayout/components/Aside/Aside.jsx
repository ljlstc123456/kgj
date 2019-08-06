import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import cx from 'classnames';
import FoundationSymbol from '@icedesign/foundation-symbol';
import { Nav ,Icon} from '@alifd/next';
import Logo from '../Logo';
import { asideMenuConfig } from '../../../../menuConfig';
import './scss/base.scss';

//const Icon = FoundationSymbol;
let role = JSON.parse(localStorage.getItem('userInfo')).role
let asideMenuConfigFilter = []

@withRouter
export default class Aside extends Component {
  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);

    const openKeys = this.getDefaultOpenKeys();
    this.state = {
      openDrawer: false,
      openKeys,
    };
		
		role = JSON.parse(localStorage.getItem('userInfo')).role
		asideMenuConfigFilter = asideMenuConfig.map(i=>{
			if(role == 'Super' ||i.name!='客户管理') {
				return i
			} else {
				return null
			}
		}).filter(i=>i) 

    this.openKeysCache = openKeys;
  }
  /**
   * 响应式通过抽屉形式切换菜单
   */
  toggleMenu = () => {
    const { openDrawer } = this.state;
    this.setState({
      openDrawer: !openDrawer,
    });
  };

  /**
   * 左侧菜单收缩切换
   */
  onMenuClick = () => {
    this.toggleMenu();
  };

  /**
   * 获取默认展开菜单项
   */
  getDefaultOpenKeys = () => {
    const { location = {} } = this.props;
    const { pathname } = location;
    const menus = this.getNavMenuItems(asideMenuConfigFilter);

    let openKeys = [];
    if (Array.isArray(menus)) {
      asideMenuConfigFilter.forEach((item, index) => {
        if (pathname.startsWith(item.path)) {
          openKeys = [`${index}`];
        }
      });
    }

    return openKeys;
  };

  /**
   * 当前展开的菜单项
   */
  onOpenChange = (openKeys) => {
    this.setState({
      openKeys,
    });
    this.openKeysCache = openKeys;
  };

  /**
   * 获取菜单项数据
   */
  getNavMenuItems = (menusData) => {
    if (!menusData) {
      return [];
    }

    return menusData
      .filter(item => item.name && !item.hideInMenu)
      .map((item, index) => {
        return this.getSubMenuOrItem(item, index);
      });
  };

  /**
   * 二级导航
   */
  getSubMenuOrItem = (item, index) => {
    if (item.children && item.children.some(child => child.name)) {
      const childrenItems = this.getNavMenuItems(item.children);

      if (childrenItems && childrenItems.length > 0) {
        return (
          <Nav.SubNav
            key={index}
            label={
              <span>
                {item.icon ? (
                  <FoundationSymbol size="small" type={item.icon} />
                ) : null}
                <span className="ice-menu-collapse ice-menu-collapse-hide">
                  {item.name}
                </span>
              </span>
            }
          >
            {childrenItems}
          </Nav.SubNav>
        );
      }
      return null;
    }
    return (
      <Nav.Item key={item.path}>
        <Link to={item.path}>{item.icon ? (
                  <FoundationSymbol style={{marginRight:'5px'}} size="small" type={item.icon} />
                ) : null}{item.name}</Link>
      </Nav.Item>
    );
  };

  render() {
    const { openDrawer } = this.state;
    const {
      location: { pathname },
      isMobile,
    } = this.props;

    return (
      <div
        className={cx('ice-design-layout-aside', { 'open-drawer': openDrawer })}
      >
        {isMobile && <Logo />}

        { (
          <a className="menu-btn-category" onClick={this.toggleMenu}>
            {!openDrawer?(<Icon type="arrow-double-right" />):(<Icon type="arrow-double-left" />)}
          </a>
        )}

        <Nav
          style={{ width: 200 }}
          mode="inline"
          selectedKeys={[pathname]}
          openKeys={this.state.openKeys}
          defaultSelectedKeys={[pathname]}
          onClick={this.onMenuClick}
          onOpen={this.onOpenChange}
          type="secondary"
        >
          {this.getNavMenuItems(asideMenuConfigFilter)}
        </Nav>
      </div>
    );
  }
}
