import { useAuthContext } from '@/context';
import profile from '@/assets/images/greenlogo.png';
import './index.less';
const SiderAuth = () => {
  const { auth } = useAuthContext();
  return (
    <div className="sider-auth">
      <img src={auth.thumbAvatar ? auth.thumbAvatar : profile} alt="profile" className="profile" />
      <ul className="auth-content">
        <li className="auth-li">{auth.name}</li>
        <li className="auth-li">{auth.departmentName}</li>
      </ul>
    </div>
  );
};

export default SiderAuth;
