import { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
const Redirect = () => {
  let history = useHistory();
  let query = useParams();
  useEffect(() => {
    if (query.path) {
      history.replace(`/login?redirect=${query.path}`);
    } else {
      history.replace(`/login`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return <></>;
};

export default Redirect;
