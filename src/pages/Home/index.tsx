import React, { useEffect, useState } from 'react';
import './index.less';
import { useAuthContext, useMenuContext, useNavContext } from '@/context';
import { setNavToken, setNavToSider } from '@/libs/handleStorage';
import { Card } from 'antd';
import { ProfileOutlined, createFromIconfontCN } from '@ant-design/icons';
import profile from '@/assets/images/greenlogo.png';
import SvgIcon from '@/components/SvgIcon';
const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2402613_ye3vti0or7o.js'
});

const Home:React.FC = () => {
  const { auth } = useAuthContext();
  const { menus } = useMenuContext();
  const { dispatchNav } = useNavContext();
  const handlehNavLink = (param: any, type = 1) => {
    const value = {
      id: param.id,
      linkstatus: param.linkStatus ? param.linkStatus : 2,
      navlink: param.menuUrl
    };
    dispatchNav({
      type: 'post',
      payload: value
    });
    if (type === 1) {
      setNavToken(JSON.stringify(value));
    }
  };
  const handleClick = (item: any) => {
    if (item.linkStatus === 1) {
      window.open(item.menuUrl);
      handlehNavLink(item, 2);
    } else {
      handlehNavLink(item);
      setNavToSider('start');
    }
  };
  return (
    <div className="page" id="home-page">
      <Card>
        {auth.name ? (
          <div className="pageHeaderContent">
            <div className="avatar">
              <img src={auth.thumbAvatar ? auth.thumbAvatar : profile} alt="profile" className="profile" />
            </div>
            <div className="content">
              <div className="content-title">{auth.name}，欢迎登录！</div>
              <div className="content-text">
                {auth.companyName}/{auth.departmentName}
              </div>
            </div>
          </div>
        ) : null}
      </Card>
      <div style={{ height: '20px' }} />
      <Card title={<div style={{ fontSize: '18px', paddingLeft: '24px', paddingRight: '24px' }}>快捷导航</div>}>
        {menus.headlist.map((item: any, index: number) => (
          <Card.Grid key={String(index)}>
            <div className="item-li" onClick={() => handleClick(item)}>
              <span className="icon">
                {item.menuIcon ? (
                  <SvgIcon name={item.menuIcon} style={{ fontSize: '48px', color: '#1890ff' }} />
                ) : (
                  <ProfileOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
                )}
              </span>
              <span className="title">{item.menuName}</span>
            </div>
          </Card.Grid>
        ))}
      </Card>
    </div>
  );
};

export default Home;
