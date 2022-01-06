import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Button, message } from 'antd';
import './index.less';
import * as api from '@/api/sso/index';
const SSOSystem = () => {
  const [lists, setLists] = useState([]);
  // 角色
  useEffect(() => {
    let didCancel = false;
    const gotData = async () => {
      try {
        const result = await api.systemsList();
        if (!didCancel) {
          if (result.resultCode === 0) {
            const data = result.data.systems;
            const lists = Array.isArray(data) ? data : [];
            setLists(lists);
          }
        }
      } catch (error) {}
    };
    gotData();
    return () => {
      didCancel = true;
    };
  }, []);

  const handleClick = async (id) => {
    try {
      const params = {
        id: id
      };
      const result = await api.gotSystemsPath(params);
      if (result.resultCode === 0) {
        const data = result.data;
        data.path && window.open(data.path);
      } else {
        message.error(result.errorMsg);
      }
    } catch (error) {}
  };

  return (
    <>
      <div className="page" id="sso-page">
        <div className="sso-ul">
          {lists.map((val, index) => (
            <div className="sso-li" key={String(index)} onClick={() => handleClick(val.systemId)}>
              <img src={val.systemIcon} alt="logo" className="logo" />
              <div className="logo-txt">{val.systemName}</div>
              <Button type="link">点击登录</Button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SSOSystem;
