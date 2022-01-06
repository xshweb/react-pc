import { useHistory } from 'react-router-dom';
import biglogo from '@/assets/images/logo-big.png';
import logo from '@/assets/images/logo.png';
import { useConfigContext } from '@/context';
import './index.less';
interface IProps {
  collapsed: boolean;
}
const SiderLogo = (props: IProps) => {
  let history = useHistory();
  const { config } = useConfigContext();
  return (
    <div className={`company-logo ${props.collapsed ? 'active' : ''}`} onClick={() => history.replace('/')}>
      {props.collapsed ? <img src={logo} alt="logo" className="logo" /> : <div className="logo-text">{config.companyName}</div>}
    </div>
  );
};

export default SiderLogo;
