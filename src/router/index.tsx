/* eslint-disable react-hooks/exhaustive-deps */
import React, { Suspense, useEffect, useState } from 'react';
import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { createHashHistory } from 'history';
import { companyConfig } from '@/config';
import { getSiderMenu, getAdminInfo } from '@/api/system/index';
import LazyComponent from '@/components/LazyComponent';
import { customRoutes, publicRoutes } from '@/router/routes';
import { translateListToTree, makeTreeKeys } from '@/libs';
import { clearAllToken } from '@/libs/handleStorage';
import { useRoutesContext, IRoute, useAuthContext, useMenuContext, useConfigContext } from '@/context';
import CacheRoute, { CacheSwitch } from 'react-router-cache-route';
import { Modal } from 'antd';
const Login = React.lazy(() => import('@/pages/Login'));
const history = createHashHistory();

const getRouterByRoutes = (routes: IRoute[]): IRoute[] => {
  let routesList: Object[] = [];
  const renderRoutes = () => {
    Array.isArray(routes) &&
      routes.forEach((route) => {
        const { path, redirect, component, layout, cache, title } = route;
        if (redirect) {
          routesList.push(<Redirect key={`${path}`} exact from={path} to={{
            ...redirect
          }} />);
        }
        if (component) {
          routesList.push(
            layout ? (
              cache ? (
                <CacheRoute
                  key={`${path}`}
                  exact
                  path={`${path}`}
                  render={(props) => React.createElement(layout, props, React.createElement(component, props))}
                  cacheKey={`${path}`}
                />
              ) : (
                <Route
                  key={`${path}`}
                  exact
                  path={`${path}`}
                  render={(props) => React.createElement(layout, props, React.createElement(component, props))}
                />
              )
            ) : cache ? (
              <CacheRoute key={`${path}`} exact path={`${path}`} component={component} cacheKey={`${path}`} />
            ) : (
              <Route key={`${path}`} exact path={`${path}`} component={component} />
            )
          );
        }
      });
  };
  renderRoutes();
  return routesList;
};

function MainRoute() {
  const { routes, dispatch } = useRoutesContext();
  const { dispatchMenu } = useMenuContext();
  const { auth, dispatchAuth } = useAuthContext();
  const [lists, setLists] = useState<IRoute[]>([]);
  const { dispatchConfig } = useConfigContext();

  function dispatchAuthRoutes(type: number, routes: any[], menus?: any[]) {
    let authRoutes: any[] = [];
    switch (type) {
      case 1:
        authRoutes = routes;
        break;
      case 2:
        authRoutes = routes.filter((item) => {
          return item.auth === 'all';
        });
        break;
      case 3:
        authRoutes = routes.filter((item) => {
          return (
            menus?.findIndex((val: any) => val.menuUrl === item.path) !== -1 ||
            menus?.findIndex((val: any) => val.menuUrl === item.auth) !== -1 ||
            item.auth === 'all' ||
            item.auth === '404' ||
            item.auth === 'strategy'
          );
        });
        break;
      default:
    }
    dispatch({
      type: 'post',
      payload: authRoutes
    });
    setLists([...authRoutes])
  }

  // 公司配置
  useEffect(() => {
    dispatchConfig({
      type: 'post',
      payload: companyConfig()
    });
    const companyName = companyConfig().companyName;
    document.title = `${companyName}数据中台`
  }, []);

  // 获取菜单|路由
  useEffect(() => {
    if (auth.token) {
      dispatchAuthRoutes(2, customRoutes);
      let didCancel = false;
      const gotData = async () => {
        try {
          const result = await getSiderMenu();
          if (!didCancel) {
            if (result.resultCode === 0) {
              const data = result.data;
              const menuslist = Array.isArray(data) ? data : [];
              const filtermenus = menuslist.filter((val) => val.menuType < 3);
              let menutree = translateListToTree([...filtermenus], 'parentMenuId');
              let menutreekeys = makeTreeKeys(menutree);
              const headlist = menuslist.filter((val: any) => val.parentMenuId === 0);
              const menus = {
                menutree: menutreekeys,
                menuslist: menuslist,
                headlist: headlist
              };
              dispatchAuthRoutes(3, customRoutes, menuslist);
              dispatchMenu({
                type: 'post',
                payload: menus
              });
            } else {
              dispatchAuthRoutes(3, customRoutes, []);
              Modal.destroyAll();
              Modal.confirm({
                title: '系统提示',
                content: `菜单错误，${result.errorMsg}！`,
                okText: '重新登录',
                cancelText: '取消',
                onOk() {
                  const url = history.location.pathname;
                  clearAllToken();
                  if (url) {
                    history.replace(`/login?redirect=${encodeURIComponent(url)}`);
                  } else {
                    history.replace(`/login`);
                  }
                },
                onCancel() {}
              });
            }
          }
        } catch (error) {}
      };
      gotData();
      return () => {
        didCancel = true;
      };
    } else {
      dispatchAuthRoutes(1, publicRoutes);
    }
  }, [auth.token]);
  
  // 登录用户信息
  useEffect(() => {
    if (auth.token) {
      let didCancel = false;
      const gotData = async () => {
        try {
          const result = await getAdminInfo();
          if (!didCancel) {
            if (result.resultCode === 0) {
              const data = result.data;
              const info = {
                name: data.name,
                userid: data.userid,
                companyName: data.companyName,
                departmentName: data.departmentName,
                id: data.id,
                thumbAvatar: data.thumbAvatar
              };
              dispatchAuth({
                type: 'setinfo',
                payload: info
              });
            }
          }
        } catch (error) {}
      };
      gotData();
      return () => {
        didCancel = true;
      };
    }
  }, [auth.token]);

  return (
    <Router>
      <Suspense fallback={<LazyComponent />}>
        <CacheSwitch>
          <Route exact path="/login" component={Login} />
          {getRouterByRoutes(lists)}
        </CacheSwitch>
      </Suspense>
    </Router>
  );
}

export default MainRoute;
