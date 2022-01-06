import React, { useRef } from 'react';
import { Button, message} from 'antd';
import './style.less';

const ReadFileBtn = (props) => {
  const filedom = useRef(null);
  const handleChange = (e) => {
    const files = e.target.files;
    if (files.length) {
      const file = files[0]
      const fileType = file.name.substring(
        file.name.lastIndexOf(".")+1
      );
      const isLt2 = file.size/1024/1024 < 20
      if (fileType !== 'pdf') {
        message.error('目前只支持pdf文件上传!');
        filedom.current.value = ''
        props.callback(null);
        return
      } else if (!isLt2) {
        message.error('上传文件大小不能超过20MB!');
        filedom.current.value = ''
        props.callback(null);
        return
      }
      props.callback(file);
    }
  };
  return (
    <>
      <Button size="small" type="primary" ghost style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer' }}>
        点此导入
        <input
          type="file"
          name="file"
          className="ipt-file"
          onChange={handleChange}
          ref={filedom}
        />
      </Button>
    </>
  );
};
export default ReadFileBtn;
