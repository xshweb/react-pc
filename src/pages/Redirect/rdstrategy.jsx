import { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { setStrategyCache } from '@/libs/handleStorage';
const RdStrategy = () => {
  let history = useHistory();
  let query = useParams();
  useEffect(() => {
    if (query.path) {
      history.replace(`/strategy/${query.path}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);
  return <></>;
};

export default RdStrategy;
