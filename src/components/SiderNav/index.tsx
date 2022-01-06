/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { dropByCacheKey } from 'react-router-cache-route';
import { useMenuContext, useNavContext } from '@/context';
import { gotNavToSider, clearNavToSider, gotSiderNavToken, setSiderNavToken } from '@/libs/handleStorage';
import { useHistory, useLocation } from 'react-router-dom';
import SiderMenu from '@/components/SiderMenu';
import SiderAuth from '@/components/SiderAuth';
import './index.less';

interface IProps {
  collapsed: boolean;
}

interface IMenuProps {
  menuUrl: string;
  key: string;
  id: number;
}

function usePrevious(data: string) {
  const ref = useRef('');
  React.useEffect(() => {
    ref.current = data;
  }, [data]);
  return ref.current;
}

const SiderNav = (props: IProps) => {
  const history = useHistory();
  let location = useLocation();
  const { menus } = useMenuContext();
  const { headnav } = useNavContext();
  const [lists, setLists] = useState<any[]>([]);
  let prevLocation = usePrevious(location.pathname);
  let [openKeys, setOpenKeys] = useState<string[]>([]);
  let [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  useMemo(() => {
    const handlePath = (list: any[]) => {
      if (list.length > 0) {
        if (list[0].children) {
          handlePath(list[0].children);
        } else {
          const url = list[0].menuUrl;
          // 子叶菜单才能跳转
          if (list[0].menuType === 2) {
            setTimeout(() => {
              history.replace(url);
            });
          }
        }
      }
    };
    if (headnav.linkstatus === 2) {
      const sidermenu = menus.menutree.filter((val: any) => val.id === headnav.id);
      if (sidermenu.length > 0) {
        if (sidermenu[0].children) {
          setLists(sidermenu[0].children);
          if (gotNavToSider() === 'start') {
            clearNavToSider();
            handlePath(sidermenu[0].children);
          }
        }
      }
    }
  }, [menus.menutree, headnav]);

  useMemo(() => {
    // 页面刷新
    let localSelectedKeys: string[] = gotSiderNavToken() ? JSON.parse(gotSiderNavToken()) : [];
    // 获取当前路由所在的目录层级
    const filterMenus = menus.menuslist.filter((val: IMenuProps) => val.menuUrl === location.pathname);
    if (filterMenus.length) {
      const currentId = String(filterMenus[0].id);
      const currentKey = filterMenus[0].key;
      const keys = currentKey.split('-');
      const tempOpenKeys = new Set([...keys, ...localSelectedKeys]);
      const openkeys = Array.from(tempOpenKeys);
      setSelectedKeys([currentId]);
      setOpenKeys([...openkeys]);
      setSiderNavToken(JSON.stringify(openkeys));
    }
  }, [menus.menuslist, location.pathname]);

  const openChange = (value: string[]) => {
    setOpenKeys(value);
    setSiderNavToken(JSON.stringify(value));
  };

  // 清除前一个路由缓存
  const onSelect = (value: any) => {
    dropByCacheKey(prevLocation);
  };

  return (
    <div className="sider-menu">
      {props.collapsed ? null : <SiderAuth />}
      <SiderMenu
        menus={lists}
        onSelect={onSelect}
        openChange={openChange}
        openKeys={openKeys}
        selectedKeys={selectedKeys}
      />
    </div>
  );
};

export default SiderNav;
