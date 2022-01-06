import { useState, useEffect } from 'react';
import { Dropdown, Menu, Space } from 'antd';
import HeaderMenu from '@/components/HeaderMenu';
import profile from '@/assets/images/greenlogo.png';
import { clearAllToken, gotUserToken } from '@/libs/handleStorage';
import { useAuthContext } from '@/context';
import './style.less';
import * as api from '@/api/system';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  ArrowsAltOutlined,
  ShrinkOutlined,
  FormOutlined,
  LoginOutlined
} from '@ant-design/icons';
import { createHashHistory } from 'history';
const history = createHashHistory();
const menu = () => {
  const logout = async () => {
    const data = await api.userlogout();
    clearAllToken();
    history.replace('/login');
  };
  return (
    <Menu className="menu">
      <Menu.Item key="1">
        <span onClick={logout} className="menu-group-li">
          <Space>
            <LoginOutlined />
            退出登录
          </Space>
        </span>
      </Menu.Item>
    </Menu>
  );
};

const HeaderBar = (props) => {
  const { auth } = useAuthContext();

  const handleToggle = (flag) => {
    props.handleToggle(flag);
  };

  return (
    <div id="header">
      <div className="header-collapsed">
        {props.collapsed ? (
          <MenuUnfoldOutlined
            className="collapsed-icon"
            onClick={() => {
              handleToggle(false);
            }}
          />
        ) : (
          <MenuFoldOutlined
            className="collapsed-icon"
            onClick={() => {
              handleToggle(true);
            }}
          />
        )}
      </div>
      <div className="header-menu">
        <HeaderMenu />
      </div>
      <ul className="header-ul">
        <li>
          <Dropdown overlay={menu} placement="bottomCenter" arrow>
            <div className="avatar-box">
              <img src={auth.thumbAvatar ? auth.thumbAvatar : profile} alt="" className="avatar" />
              <span className="avatar-name">{auth.name}</span>
            </div>
          </Dropdown>
        </li>
      </ul>
    </div>
  );
};

export default HeaderBar;
