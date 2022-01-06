import React, { useRef, useState } from 'react';
import { Button, message, Progress } from 'antd';
import './style.less';
import request from '@/libs/request';
import { baseURL } from '@/config';

const UpFileBtn = (props) => {
  const [complete, setComplete] = useState(0);
  const [load, setLoad] = useState(false);
  const iptdom = useRef(null);
  const handleChange = (e) => {
    const files = e.target.files;
    const formData = new FormData();

    formData.append('type', props.data.type);
    if (files.length > 0) {
      for (const val of files) {
        formData.append('file', val);
      }
    }
    setLoad(true);
    request
      .upfile(`${baseURL}/${props.action}`, formData, (progress) => {
        let complete = ((progress.loaded / progress.total) * 100) | 0;
        // console.log(complete);
        setComplete(complete);
      })
      .then((result) => {
        setLoad(false);
        iptdom.current.value = '';
        if (result.resultCode === 0) {
          setTimeout(() => {
            message.success('数据导入成功');
          });
          props.callback();
        }
      })
      .catch(() => {
        setLoad(false);
        iptdom.current.value = '';
      });
  };

  return (
    <>
      <Button size="small" type="primary" style={{ position: 'relative', overflow: 'hidden' }}>
        导入数据
        <input
          type="file"
          name="file"
          className="ipt-file"
          onChange={handleChange}
          ref={iptdom}
          // multiple="multiple"
        />
      </Button>
      {load && (
        <div
          style={{
            position: 'fixed',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.1)',
            zIndex: 1000
          }}
        >
          <Progress type="circle" percent={complete} />
        </div>
      )}
    </>
  );
};
export default UpFileBtn;
