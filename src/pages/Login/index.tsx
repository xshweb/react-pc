/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import './index.less';
import * as api from '@/api/system/index';
import { message, Modal } from 'antd';
import { setUserToken, gotUserToken } from '@/libs/handleStorage';
import { useAuthContext } from '@/context';
import logo from './logo.png';
import { useHistory, useLocation } from 'react-router-dom';
import { companyConfig, webUrl } from '@/config';

const { confirm } = Modal;
function getQueryString(name: string): string {
  let reg = new RegExp('(^|&)' + name + '=([^&^#]*)(&|$|#)', 'i');;
  let index = window.location.href.indexOf('?');
  // let index = window.location.hash.indexOf('?');
  let r = window.location.href.substr(index + 1).match(reg);
  if (r !== null) {
    return r[2];
  } else {
    return '';
  }
}
const Login = () => {
  let history = useHistory();
  const { dispatchAuth } = useAuthContext();
  const config = companyConfig()
  const [name, setName] = useState(config.companyName);
  useEffect(() => {
    // 设置页面title 
    document.title = `${config.companyName}数据中台`
    // 初始化登录
    const initLogin = () => {
      const redirect_uri = `${config.origin}${webUrl}/#/login`;
      const path = getQueryString('redirect');
      (window as any).WwLogin({
        id: 'gvwxlogin',
        appid: config.appid,
        agentid: config.agentid,
        redirect_uri: encodeURIComponent(redirect_uri),
        state: path,
      });
    };

    initLogin();
    // 如果存在有效token
    function haveToken () {
      const token = gotUserToken() ? JSON.parse(gotUserToken()).token : '';
      if (token) {
        const path = getQueryString('redirect');
        if (path) {
          window.location.replace(`${config.origin}${webUrl}/#${decodeURIComponent(path)}`)
          // history.replace(`${decodeURIComponent(path)}`);
        } else {
          window.location.replace(`${config.origin}${webUrl}/#/`)
          // history.replace('/');
        }
        return;
      }
    }

    haveToken();
    
    // 获取登录code
    function getCode() {
      const urlcode = getQueryString('code');
      const state = getQueryString('state');
      if (urlcode) {
        submitData(urlcode, state);
      }
    }

    getCode();

    window.addEventListener('hashchange', getCode);
    return () => {
      window.removeEventListener('hashchange', getCode);
    };
  }, []);

  const submitData = async (urlcode: string, state: string) => {
    const param = {
      code: urlcode,
      source: 'ADMIN',
      corpCode: config.corpCode,
      appName: 'dm'
    };
    const result = await api.login(param);
    if (result.resultCode === 0) {
      message.success('您好，登录成功');
      const data = result.data;
      const value = {
        token: data.token
      };
      dispatchAuth({
        type: 'set',
        payload: value
      });
      // 设置token
      setUserToken(JSON.stringify(value));
      // 登陆成功
      if (state && state!=='STATE') {
        const target = decodeURIComponent(state)
        if (target === '/login') {
          window.location.replace(`${config.origin}${webUrl}/#/`)
        } else {
          setTimeout(() => {
            window.location.replace(`${config.origin}${webUrl}/#${target}`)
            // history.replace(`${decodeURIComponent(state)}`);
          }, 100);
        }
      } else {
        window.location.replace(`${config.origin}${webUrl}/#/`)
        // history.replace('/');
      }
    } else {
      // 登录失败
      confirm({
        title: '登录失败',
        content: `${result.errorMsg}`,
        okText: '重新登录',
        cancelText: '取消',
        onOk() {
          window.location.replace(`${config.origin}${webUrl}/#/rdlogin?redirect=${state}`)
          // history.replace(`/rdlogin?redirect=${state}`)
        },
        onCancel() {
          window.location.replace(`${config.origin}${webUrl}/#/rdlogin?redirect=${state}`)
          // history.replace(`/rdlogin?redirect=${state}`)
        }
      });
    }
  };

  const handleTest = () => {
    
    const value = {
      userId: 1,
      token: 'Bearer 453ecaa6c97b475fbb9758adcff8cc87',
      name: '张三'
    };
    dispatchAuth({
      type: 'set',
      payload: value
    });
    setUserToken(JSON.stringify(value));
    history.replace('/');
    return
    const path = getQueryString('redirect')
    // console.log(decodeURIComponent(path))
    // history.replace(`/rdlogin?redirect=${path}`)
    setTimeout(() => {
      history.replace(`${decodeURIComponent(path)}`);
    }, 100);
  }

  return (
    <div className="login-wrapper">
      <div className="content-wrapper">
        <div className="logo-box">
          <img src={logo} title="logo" alt="logo" className="logo" />
          <div className="logo-title">{name ? name : '绿谷'}数据中台</div>
        </div>
        <div id="gvwxlogin" />
      </div>
    </div>
  );
};

export default Login;
