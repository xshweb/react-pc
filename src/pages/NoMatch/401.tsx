import { Result, Button } from 'antd';
import { useHistory } from 'react-router-dom';
import { clearAllToken } from '@/libs/handleStorage';
const NoToken = () => {
  let history = useHistory();
  // 刷新
  const goLogin = () => {
    clearAllToken();
    history.replace('/login');
  };
  return (
    <Result
      status="403"
      title="接口401"
      subTitle="抱歉，您的登录状态已过期，请重新登录"
      extra={
        <Button type="primary" onClick={goLogin}>
          重新登录
        </Button>
      }
    />
  );
};

export default NoToken;
