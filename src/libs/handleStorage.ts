const secretid = 'gvdm';

export function clearAllToken() {
  // clearSiderNavToken()
  clearNavToken();
  clearUserToken();
  clearNavToSider();
}

/**
 * SiderNavToken 侧边栏展开
 * @returns
 */
export function gotSiderNavToken(): any {
  return window.sessionStorage.getItem(`${secretid}_setOpenKeys`);
}

export function setSiderNavToken(token: string) {
  window.sessionStorage.setItem(`${secretid}_setOpenKeys`, token);
}

export function clearSiderNavToken() {
  window.sessionStorage.removeItem(`${secretid}_setOpenKeys`);
}

/**
 * NavToken 当前头部菜单
 * @returns
 */
export function gotNavToken(): any {
  return window.sessionStorage.getItem(`${secretid}_headnav`);
}

export function setNavToken(token: string) {
  window.sessionStorage.setItem(`${secretid}_headnav`, token);
}

export function clearNavToken() {
  window.sessionStorage.removeItem(`${secretid}_headnav`);
}

/**
 * NavToSider 切换头部菜单,默认选中菜单
 * @returns
 */

export function gotNavToSider(): any {
  return window.sessionStorage.getItem(`${secretid}_navtosider`);
}

export function setNavToSider(token: string) {
  window.sessionStorage.setItem(`${secretid}_navtosider`, token);
}

export function clearNavToSider() {
  window.sessionStorage.removeItem(`${secretid}_navtosider`);
}

/**
 * UserToken 用户登录信息
 * @returns
 */

export function gotUserToken(): any {
  const data = window.localStorage.getItem(`${secretid}_user`);
  return data;
}

export function setUserToken(token: string) {
  window.localStorage.setItem(`${secretid}_user`, token);
}

export function clearUserToken() {
  window.localStorage.removeItem(`${secretid}_user`);
}

/**
 * 
 */

export function getStrategyCache() {
  const data = window.sessionStorage.getItem(`${secretid}_strategy`);
  return data;
}

export function setStrategyCache(token: string) {
  window.sessionStorage.setItem(`${secretid}_strategy`, token);
}

export function clearStrategyCache() {
  window.sessionStorage.removeItem(`${secretid}_strategy`);
}