import React from 'react';
import { pathToRegexp, match, parse, compile } from 'path-to-regexp';
import { createHashHistory } from 'history';
import MainLayout from '@/layouts';
import SystemMenu from '@/pages/System/Menu';
import Home from '@/pages/Home';
import Redirect from '@/pages/Redirect';
import Rdtlogin from '@/pages/Redirect/rdtlogin';
import Report from '@/pages/Strategy/Report';
const history = createHashHistory();

const NoMatch = React.lazy(() => import('@/pages/NoMatch'));
const NoPower = React.lazy(() => import('@/pages/NoMatch/403'));
const NoToken = React.lazy(() => import('@/pages/NoMatch/401'));

// 营销监控
// const Home = React.lazy(() => import('@/pages/Home'));
const MarketBIFinance = React.lazy(() => import('@/pages/MarketBI/Finance'));
const MarketBIHr = React.lazy(() => import('@/pages/MarketBI/Hr'));
const MarketBIProject = React.lazy(() => import('@/pages/MarketBI/Project'));
const MarketBIStockData = React.lazy(() => import('@/pages/MarketBI/StockData'));
const MarketBIWeb = React.lazy(() => import('@/pages/MarketBI/BIWeb'));

// 系统管理
// const SystemMenu = React.lazy(() => import("@/pages/System/Menu"));
const SystemRole = React.lazy(() => import('@/pages/System/Role'));
const SystemUser = React.lazy(() => import('@/pages/System/User'));
const UserRole = React.lazy(() => import('@/pages/System/UserRole'));
const Dict = React.lazy(() => import('@/pages/System/Dict'));
const DictData = React.lazy(() => import('@/pages/System/DictData'));

// 统一登录
const SSOSystem = React.lazy(() => import('@/pages/SSO/System'));

// 主数据平台
const SyncLog = React.lazy(() => import('@/pages/MainData/SyncLog'));

// 开放平台
const OpenApiCompany = React.lazy(() => import('@/pages/OpenApi/Company'));
const NetApi = React.lazy(() => import('@/pages/OpenApi/NetApi'));

// 经营分析
const DaySales = React.lazy(() => import('@/pages/Analysis/DaySales'));
const MonthSales = React.lazy(() => import('@/pages/Analysis/MonthSales'));
const MonthSalesTarget = React.lazy(() => import('@/pages/Analysis/MonthSalesTarget'));

// 战略研究
const ImportFile = React.lazy(() => import('@/pages/Strategy/ImportFile'));
const RdStrategy = React.lazy(() => import('@/pages/Redirect/rdstrategy'));
// const Report = React.lazy(() => import('@/pages/Strategy/Report'));

/**
 * auth: 权限
 *   all -> 不限权限
 *   404 -> 页面404
 *   redirect —> 刷新
 *   '/system/user' -> 分配角色权限
 *
 * cache: 是否缓存
 *
 *
 */

export const customRoutes = [
  {
    path: '/',
    redirect: {
      pathname: "/home",
    },
    auth: 'all'
  },
  {
    path: '/home',
    component: Home,
    layout: MainLayout,
    auth: 'all',
    title: '首页',
    cache: true
  },
  {
    path: '/system/user',
    component: SystemUser,
    layout: MainLayout,
    title: '用户管理',
    cache: true
  },
  {
    path: '/system/userrole/:userId(.*)',
    component: UserRole,
    layout: MainLayout,
    title: '分配角色',
    cache: true,
    auth: '/system/user'
  },
  {
    path: '/system/menu',
    component: SystemMenu,
    layout: MainLayout,
    title: '菜单管理',
    cache: true
  },
  {
    path: '/system/role',
    component: SystemRole,
    layout: MainLayout,
    title: '角色管理',
    cache: true
  },
  {
    path: '/system/dict',
    component: Dict,
    layout: MainLayout,
    title: '字典管理',
    cache: true
  },
  {
    path: '/system/dictdata/:dictId(.*)',
    component: DictData,
    layout: MainLayout,
    title: '字典数据',
    cache: true,
    auth: '/system/dict'
  },
  {
    path: '/sso/system',
    component: SSOSystem,
    layout: MainLayout,
    title: '系统管理',
    cache: true
  },
  {
    path: '/maindata/synclog',
    component: SyncLog,
    layout: MainLayout,
    title: '同步日志',
    cache: false
  },
  {
    path: '/strategy/importfile',
    component: ImportFile,
    layout: MainLayout,
    title: '战略资料导入',
    cache: true
  },
  {
    path: '/strategy/:path(.*)',
    component: Report,
    layout: MainLayout,
    title: '',
    cache: false,
    auth: 'strategy'
  },
  {
    path: '/rdstrategy/:path(.*)',
    component: RdStrategy,
    layout: MainLayout,
    title: '',
    cache: false,
    auth: 'all'
  },
  {
    path: '/openapi/company',
    component: OpenApiCompany,
    layout: MainLayout,
    title: '租户管理',
    cache: true
  },
  {
    path: '/openapi/netapi',
    component: NetApi,
    layout: MainLayout,
    title: '接口管理',
    cache: true
  },
  {
    path: '/analysis/daysales',
    component: DaySales,
    layout: MainLayout,
    title: '纯销日报',
    cache: true
  },
  {
    path: '/analysis/monthsales',
    component: MonthSales,
    layout: MainLayout,
    title: '纯销月报',
    cache: true
  },
  {
    path: '/analysis/monthsalestarget',
    component: MonthSalesTarget,
    layout: MainLayout,
    title: '目标录入',
    cache: true
  },
  {
    path: '/bi/data/finance',
    component: MarketBIFinance,
    layout: MainLayout,
    cache: true,
    title: '财务录入'
  },
  {
    path: '/bi/data/hr',
    component: MarketBIHr,
    layout: MainLayout,
    cache: true,
    title: 'HR录入'
  },
  {
    path: '/bi/data/project',
    component: MarketBIProject,
    layout: MainLayout,
    cache: true,
    title: '项目管理'
  },
  {
    path: '/bi/webdata/bi',
    component: MarketBIWeb,
    layout: MainLayout,
    cache: true,
    title: '数据录入'
  },
  {
    path: '/bi/webdata/stock',
    component: MarketBIStockData,
    layout: MainLayout,
    cache: true,
    title: '库存录入'
  },
  {
    path: '/redirect/:path(.*)',
    component: Redirect,
    layout: MainLayout,
    cache: false,
    auth: 'all'
  },
  {
    path: '/403',
    component: NoPower,
    cache: false,
    title: '403',
    auth: 'all'
  },
  {
    path: '/401',
    component: NoToken,
    cache: false,
    title: '401',
    auth: 'all'
  },
  {
    path: '*',
    component: NoMatch,
    layout: MainLayout,
    cache: false,
    title: '页面404',
    auth: '404'
  }
];

const url = history.location.pathname;
export const publicRoutes = [
  {
    path: '/',
    redirect: {
      pathname: "/login",
      search: `?redirect=${encodeURIComponent(url)}`,
    }
  },
  {
    path: '/rdlogin/:path(.*)',
    cache: false,
    component: Rdtlogin,
  },
  {
    path: '*',
    redirect: {
      pathname: "/login",
      search: `?redirect=${encodeURIComponent(url)}`,
    }
  }
];
