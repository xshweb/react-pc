import { Result, Button } from 'antd';
import { useHistory } from 'react-router-dom';
const NoMatch = () => {
  let history = useHistory();
  return (
    <Result
      status="404"
      title="页面404"
      subTitle="抱歉，您访问页面不存在"
      extra={
        <Button type="primary" onClick={() => history.replace('/')}>
          返回首页
        </Button>
      }
    />
  );
};

export default NoMatch;
