import React from 'react';
import { gotUserToken, gotNavToken } from '@/libs/handleStorage';

/**
 * 公司配置
 */

export const configContext = React.createContext<any | null>(null);
export function useConfigContext() {
  return React.useContext(configContext);
}
function configReducer(state: any, action: any): any {
  switch (action.type) {
    case 'post':
      return {
        ...action.payload
      };
    default:
      return {
        ...state
      };
  }
}
const config = {
  agentid: '',
  corpCode: ''
};
export function useConfigReducer() {
  return React.useReducer(configReducer, config);
}

/**
 * routes
 */

export interface IRoute {
  title?: string;
  cache?: boolean;
  path?: string;
  redirect?: any;
  children?: any[];
  component?: any;
  layout?: any;
}

export const routesContext = React.createContext<any | null>(null);
export function useRoutesContext() {
  return React.useContext(routesContext);
}

function routesReducer(state: IRoute[], action: any): any[] {
  switch (action.type) {
    case 'post':
      return [...action.payload];
    default:
      return [...state];
  }
}

export function useRoutesReducer() {
  return React.useReducer(routesReducer, []);
}

/**
 * 菜单列表
 */

export const menuContext = React.createContext<any | null>(null);
export function useMenuContext() {
  return React.useContext(menuContext);
}

function menuReducer(state: any, action: any): any {
  switch (action.type) {
    case 'post':
      return {
        ...action.payload
      };
    default:
      return state;
  }
}

const menus = {
  menutree: [],
  menuslist: [],
  headlist: []
};

export function useMenuReducer() {
  return React.useReducer(menuReducer, menus);
}

/**
 * token
 */
export const authContext = React.createContext<any | null>(null);
export function useAuthContext() {
  return React.useContext(authContext);
}

function authReducer(state: any, action: any): any {
  switch (action.type) {
    case 'set':
      return {
        token: action.payload.token,
        name: state.name,
        userid: state.userid,
        companyName: state.companyName,
        departmentName: state.departmentName,
        id: state.id,
        thumbAvatar: state.thumbAvatar
      };
    case 'setinfo':
      return {
        token: state.token,
        id: action.payload.id,
        name: action.payload.name,
        userid: action.payload.userid,
        companyName: action.payload.companyName,
        departmentName: action.payload.departmentName,
        thumbAvatar: action.payload.thumbAvatar
      };
    default:
      return {
        ...state
      };
  }
}

const token = gotUserToken() ? JSON.parse(gotUserToken()).token : '';
const auth = {
  token: token,
  id: '',
  name: '',
  userid: '',
  companyName: '',
  departmentName: '',
  job: '',
  thumbAvatar: ''
};
export function useAuthReducer() {
  return React.useReducer(authReducer, auth);
}

/**
 * click headernav
 */

export const navContext = React.createContext<any | null>(null);
export function useNavContext() {
  return React.useContext(navContext);
}

function navReducer(state: any, action: any): any {
  switch (action.type) {
    case 'post':
      return {
        ...action.payload
      };
    default:
      return state;
  }
}

const headnavid = gotNavToken() ? JSON.parse(gotNavToken()).id : 0;
const linkstatus = gotNavToken() ? JSON.parse(gotNavToken()).linkstatus : 2;
const navlink = gotNavToken() ? JSON.parse(gotNavToken()).navlink : '';

const headnav = {
  id: headnavid,
  linkstatus: linkstatus,
  navlink: navlink
};

export function useNavReducer() {
  return React.useReducer(navReducer, headnav);
}

/**
 * 获取tags
 */

export const tagsContext = React.createContext<any | null>(null);
export function useTagsContext() {
  return React.useContext(tagsContext);
}

function tagsReducer(state: any[], action: any): any[] {
  switch (action.type) {
    case 'add': {
      const index1 = state.findIndex((v) => v.menuUrl === action.payload.menuUrl);
      if (index1 !== -1) return [...state];
      return [...state, action.payload];
    }
    case 'del': {
      const index2 = state.findIndex((v) => v.menuUrl === action.payload.menuUrl);
      if (index2 >= 0) {
        state.splice(index2, 1);
      }
      return [...state];
    }
    case 'delOther': {
      const filterItems = state.filter((v) => v.menuUrl === action.payload.menuUrl);
      return [...filterItems];
    }
    case 'delAll':
      return [];
    default:
      return [...state];
  }
}
export function useTagsReducer() {
  return React.useReducer(tagsReducer, []);
}
