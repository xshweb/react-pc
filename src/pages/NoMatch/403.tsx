import { Result, Button } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import { clearAllToken } from '@/libs/handleStorage';
const NoPower = () => {
  let history = useHistory();
  let location = useLocation();
  // 刷新
  const goLogin = () => {
    // window.location.reload();
    // dropByCacheKey(location.pathname);
    // history.replace(`/redirect/${location.pathname}`);
    // history.goBack();
    clearAllToken();
    history.replace('/login');
  };
  return (
    <Result
      status="403"
      title="接口403"
      subTitle="抱歉，您暂无权限操作。请联系管理员授权，再重新登录"
      extra={
        <Button type="primary" onClick={goLogin}>
          重新登录
        </Button>
      }
    />
  );
};

export default NoPower;
