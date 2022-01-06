import React, { useEffect, useState } from 'react';
import Finance from './Finance';
import Target from './Target';
import './style.less';
import { Radio } from 'antd';

const FinanceIndex = () => {
  const [type, setType] = useState('1');
  const onChange = (e) => {
    setType(e.target.value);
  };
  return (
    <div>
      <div className="page">
        <div className="operation-wrapper">
          <Radio.Group value={type} onChange={onChange} style={{ marginBottom: 16 }}>
            <Radio.Button value="1">指标数据录入</Radio.Button>
            <Radio.Button value="2">目标数据录入</Radio.Button>
          </Radio.Group>
        </div>
        <div style={{ padding: '30px 20px' }}>
          {type === '1' && <Finance />}
          {type === '2' && <Target />}
        </div>
      </div>
    </div>
  );
};

export default FinanceIndex;
