import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { pathToRegexp, match, parse, compile } from 'path-to-regexp';
import { Link, useLocation, useHistory, useRouteMatch } from 'react-router-dom';
import { dropByCacheKey } from 'react-router-cache-route';
import { useMenuContext, useTagsContext, useNavContext, useRoutesContext } from '@/context';
import { setNavToken } from '@/libs/handleStorage';
import {
  CloseSquareOutlined,
  CloseOutlined,
  CloseCircleOutlined,
  CloseCircleFilled,
  BackwardFilled,
  ForwardFilled,
  SyncOutlined
} from '@ant-design/icons';
import { Space, Button } from 'antd';
import './index.less';
const TagsView = (props: any) => {
  const { menus } = useMenuContext();
  const { routes } = useRoutesContext();
  const { tags, dispatchTags } = useTagsContext();
  const { dispatchNav } = useNavContext();

  let history = useHistory();
  let location = useLocation();

  const ref = useRef<null | any>(null);
  const refwrap = useRef<null | any>(null);
  const [tagsleft, setTagsLeft] = useState(0);
  const [left, setLeft] = useState(-9999);
  const [top, setTop] = useState(-9999);
  const [row, setRow] = useState({ menuUrl: '' });

  const closeMenu = () => {
    setLeft(-9999);
    setTop(-9999);
    setRow({ menuUrl: '' });
  };

  useEffect(() => {
    document.body.addEventListener('click', closeMenu);
    return () => document.body.removeEventListener('click', closeMenu);
  }, []);

  useEffect(() => {
    const excludeAllRoutes = routes.filter((val: any) => val.auth !== 'all');
    const matchRoutes = excludeAllRoutes.filter((val: any) => val.auth !== '404');
    if (matchRoutes.length > 0) {
      let payload: any = {};
      matchRoutes.map((val: any) => {
        if (pathToRegexp(val.path).test(location.pathname)) {
          const filterItem = menus.menuslist.filter((item: any) => item.menuUrl === location.pathname);
          const menuName = filterItem.length > 0 ? filterItem[0].menuName : val.title;
          payload = {
            menuUrl: location.pathname,
            menuName: menuName
          };
        }
      });
      if (payload.menuName && payload.menuUrl) {
        dispatchTags({
          type: 'add',
          payload: payload
        });
        const targetNav = findByParent(menus.menuslist, payload);
        if (targetNav.id) {
          handlehNavLink(targetNav);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, menus.menuslist, routes]);

  // 关闭
  const deteleTags = (val: any, e: React.MouseEvent) => {
    if (val.menuUrl === location.pathname) {
      const index = tags.findIndex((v: any) => v.menuUrl === val.menuUrl);
      if (index > 0) {
        history.replace(tags[index - 1].menuUrl);
      } else {
        if (tags.length >= 2) {
          history.replace(tags[index + 1].menuUrl);
        } else {
          history.replace('/');
        }
      }
    }
    dropByCacheKey(val.menuUrl);
    dispatchTags({
      type: 'del',
      payload: val
    });
    e.preventDefault();
  };

  const handlehNavLink = (param: any) => {
    const value = {
      id: param.id,
      linkstatus: param.linkStatus ? param.linkStatus : 2,
      navlink: param.menuUrl
    };
    dispatchNav({
      type: 'post',
      payload: value
    });
    setNavToken(JSON.stringify(value));
  };

  const findByParent = (arr: any[], val: any): any => {
    let value = {};
    const filterItem = arr.filter((item) => item.menuUrl === val.menuUrl);
    function findById(target: any) {
      arr.map((item) => {
        if (item.id === target) {
          if (item.parentMenuId === 0 && item.menuType === 1) {
            value = item;
          } else {
            findById(item.parentMenuId);
          }
        }
      });
    }
    if (filterItem.length > 0) {
      findById(filterItem[0].id);
    }
    return value;
  };

  // 刷新
  const handleRefresh = () => {
    // window.location.reload();
    dropByCacheKey(location.pathname);
    history.replace(`/redirect/${location.pathname}`);
  };

  // 后退
  const clickPrev = () => {
    if (refwrap.current !== null) {
      const reftabbox = refwrap.current.getBoundingClientRect().width - 145;
      const reftabul = ref.current.getBoundingClientRect().width;
      if (reftabul <= reftabbox) {
        return;
      }
      let children: any[] = Array.from(ref.current.children);
      let left = 0;
      let current = 0;

      children.forEach((el: any, index: number) => {
        left += el.clientWidth;
        if (left <= Math.abs(tagsleft)) {
          current = index;
        }
      });

      // console.log('prev-current', current)

      let left2 = 0;
      let current2 = current;
      for (let i = current; i >= 0; i--) {
        left2 += children[i].clientWidth;
        if (left2 < reftabbox) {
          current2 = i;
        }
      }

      // console.log('prev-current2', current2)

      if (current2 > 0) {
        const total2 = children.slice(0, current2 + 1).reduce((prev: number, cur: any) => {
          return prev + cur.clientWidth;
        }, 0);
        setTagsLeft(-total2);
      } else {
        setTagsLeft(0);
      }
    }
  };

  // 前进
  const clickNext = () => {
    if (refwrap.current !== null) {
      const reftabbox = refwrap.current.getBoundingClientRect().width - 145;
      const reftabul = ref.current.getBoundingClientRect().width;
      if (reftabbox >= reftabul) {
        return;
      }

      let children: any = Array.from(ref.current.children);
      let left = 0;
      let current = 0;

      children.forEach((el: any, index: number) => {
        left += el.clientWidth;
        if (left <= Math.abs(tagsleft)) {
          current = index;
        }
      });

      // console.log('next-current', current)

      let left2 = 0;
      let current2 = current;
      let isover = false;

      children.slice(current).forEach((el: any, index: number) => {
        left2 += el.clientWidth;
        if (left2 < reftabbox) {
          current2 = index + current;
        } else {
          isover = true;
        }
      });
      // console.log('next-isover', isover)
      // console.log('next-current2', current2)

      if (isover) {
        const total = children.slice(0, current2 + 1).reduce((prev: number, cur: any) => {
          return prev + cur.clientWidth;
        }, 0);
        setTagsLeft(-total);
      }
    }
  };

  // 菜单右键
  const openMenu = (e: React.MouseEvent, menuUrl: string) => {
    const left = e.pageX - 200;
    const top = e.pageY - 50;
    setLeft(left);
    setTop(top);
    setRow({ menuUrl });
    e.preventDefault();
  };

  const clickMenu = (e: React.MouseEvent, type: number) => {
    switch (type) {
      case 1:
        dropByCacheKey(row.menuUrl);
        history.replace(`/redirect/${row.menuUrl}`);
        break;
      case 2:
        if (row.menuUrl !== '/home') {
          if (row.menuUrl === location.pathname) {
            const index = tags.findIndex((v: any) => v.menuUrl === row.menuUrl);
            if (index > 0) {
              history.replace(tags[index - 1].menuUrl);
            } else {
              if (tags.length >= 2) {
                history.replace(tags[index + 1].menuUrl);
              } else {
                history.replace('/');
              }
            }
          }
          dropByCacheKey(row.menuUrl);
          dispatchTags({
            type: 'del',
            payload: row
          });
        }
        break;
      case 3: {
        let payload = row.menuUrl === '/home' ? { menuUrl: '' } : row;
        dispatchTags({
          type: 'delOther',
          payload: payload
        });
        history.replace(row.menuUrl);
        break;
      }
      case 4:
        dispatchTags({
          type: 'delAll'
        });
        history.replace('/');
        break;
      default:
    }
    closeMenu();
    e.stopPropagation();
  };

  return (
    <div
      className="tags-views"
      ref={refwrap}
      onContextMenu={(e) => e.preventDefault()}
      style={{
        left: props.collapsed ? 80 : 200
      }}
    >
      <div className="arrow-icon arrow-icon-left" onClick={clickPrev}>
        <BackwardFilled />
      </div>
      <div className="tags-ul-box">
        <ul className="tags-ul" ref={ref} style={{ marginLeft: `${tagsleft}px` }}>
          <li
            className={`tags-li ${location.pathname === '/home' ? 'active' : ''}`}
            key="9999"
            onContextMenu={(e) => openMenu(e, '/home')}
          >
            <Link to="/">
              <span>首页</span>
            </Link>
          </li>
          {tags.map((item: any) => (
            <li
              className={`tags-li ${location.pathname === item.menuUrl ? 'active' : ''}`}
              key={item.menuUrl}
              onContextMenu={(e) => openMenu(e, item.menuUrl)}
            >
              <Link to={item.menuUrl} replace>
                <span>{item.menuName}</span>
                <CloseCircleFilled className="tags-li-icon" onClick={(e) => deteleTags(item, e)} />
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="arrow-icon arrow-icon-right" onClick={clickNext}>
        <ForwardFilled />
      </div>
      <div className="arrow-icon arrow-icon-refresh" onClick={handleRefresh}>
        <SyncOutlined />
        <span className="arrow-icon-txt">刷新</span>
      </div>
      <ul className="contextmenu" style={{ left: `${left}px`, top: `${top}px` }}>
        <li onClick={(e) => clickMenu(e, 1)}>
          <Space>
            <SyncOutlined />
            刷新页面
          </Space>
        </li>
        <li onClick={(e) => clickMenu(e, 2)}>
          <Space>
            <CloseOutlined /> 关闭当前
          </Space>
        </li>
        <li onClick={(e) => clickMenu(e, 3)}>
          <Space>
            <CloseCircleOutlined /> 关闭其他
          </Space>
        </li>
        <li onClick={(e) => clickMenu(e, 4)}>
          <Space>
            <CloseSquareOutlined /> 关闭所有
          </Space>
        </li>
      </ul>
    </div>
  );
};

export default TagsView;
