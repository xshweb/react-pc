/* eslint-disable no-restricted-globals */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useCallback } from 'react';
import { setNavToken, gotNavToken, setNavToSider } from '@/libs/handleStorage';
import { AppstoreOutlined } from '@ant-design/icons';
import { useMenuContext, useNavContext } from '@/context';
import { useHistory, useLocation } from 'react-router-dom';
import SvgIcon from '@/components/SvgIcon';
import './index.less';

const HeaderMenu = () => {
  let location = useLocation();
  const { menus } = useMenuContext();
  const { headnav, dispatchNav } = useNavContext();

  const handlehNavLink = (param: any, type = 1) => {
    const value = {
      id: param.id,
      linkstatus: param.linkStatus ? param.linkStatus : 2,
      navlink: param.menuUrl,
      menuType: param.menuType
    };
    dispatchNav({
      type: 'post',
      payload: value
    });
    if (type === 1) {
      setNavToken(JSON.stringify(value));
    }
  };

  useEffect(() => {
    if (!gotNavToken()) {
      const headlist = menus.headlist;
      const filterMenus = menus.menuslist.filter((val: any) => val.menuUrl === location.pathname);
      if (location.pathname === '/' || location.pathname === '/home') {
        if (headlist.length > 0) {
          handlehNavLink(headlist[0]);
        }
      } else {
        if (filterMenus.length > 0) {
          const targethead = headlist.filter((val: any) => val.id === filterMenus[0].parentMenuId)
          handlehNavLink(targethead[0]);
          setNavToSider('start');
        }
      }
    }
  }, [menus, location.pathname]);

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
    <ul className="head-menus">
      {menus.headlist.map((item: any, index: number) => (
        <li
          onClick={() => handleClick(item)}
          className={`head-menu ${headnav.id === item.id ? 'active' : ''}`}
          key={String(index)}
        >
          <span className="head-menu-a">
            {item.menuIcon ? <SvgIcon name={item.menuIcon} /> : <AppstoreOutlined />}
            <span>{item.menuName}</span>
          </span>
        </li>
      ))}
    </ul>
  );
};

export default HeaderMenu;
