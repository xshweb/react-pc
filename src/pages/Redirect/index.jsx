import { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';

const Redirect = () => {
  let history = useHistory();
  let query = useParams();
  useEffect(() => {
    if (query) {
      history.replace(query.path);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return <></>;
};

export default Redirect;
