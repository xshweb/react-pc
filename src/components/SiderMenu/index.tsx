import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import SvgIcon from '@/components/SvgIcon';
import { createFromIconfontCN, FolderOutlined, AppstoreAddOutlined, FileOutlined } from '@ant-design/icons';
const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2859523_av0dv3m4dy9.js'
});

const SiderMenu = (props: any) => {
  const renderMenuItem = ({ id, menuName }: any) => {
    return (
      <Menu.Item key={id}>
        <span>{menuName}</span>
      </Menu.Item>
    );
  };

  const renderMenuItemIcon = ({ id, menuUrl, menuIcon, menuName }: any) => {
    return (
      <Menu.Item
        key={id}
        icon={menuIcon ? <SvgIcon name={menuIcon} /> : <FileOutlined />}
      >
        <Link to={menuUrl} replace>
          <span>{menuName}</span>
        </Link>
      </Menu.Item>
    );
  };

  const renderMenuItemLink = ({ id, menuUrl, menuName }: any) => {
    return (
      <Menu.Item key={id}>
        <Link to={menuUrl} replace>
          <span>{menuName}</span>
        </Link>
      </Menu.Item>
    );
  };

  const renderSubMenuChild = (item: any) => {
    return (
      <Menu.SubMenu key={item.id} title={item.menuName}>
        {item.children?.map((item: any) => {
          return item.children && item.children.length > 0
            ? renderSubMenuChild(item)
            : item.menuType === 2
              ? renderMenuItemLink(item)
              : renderMenuItem(item);
        })}
      </Menu.SubMenu>
    );
  };

  const renderSubMenu = (item: any) => {
    return (
      <Menu.SubMenu
        key={item.id}
        icon={item.menuIcon ? <SvgIcon name={item.menuIcon} /> : <FolderOutlined />}
        title={item.menuName}
      >
        {item.children?.map((item: any) => {
          return item.children && item.children.length > 0
            ? renderSubMenuChild(item)
            : item.menuType === 2
              ? renderMenuItemLink(item)
              : renderMenuItem(item);
        })}
      </Menu.SubMenu>
    );
  };

  return (
    <Menu
      onOpenChange={(value) => props.openChange(value)}
      openKeys={props.openKeys}
      selectedKeys={props.selectedKeys}
      onSelect={(value) => props.onSelect(value)}
      theme="dark"
      mode="inline"
    >
      {props?.menus?.map((item: any) => {
        return item.children && item.children.length > 0
          ? renderSubMenu(item)
          : item.menuType === 2
            ? renderMenuItemIcon(item)
            : renderMenuItem(item);
      })}
    </Menu>
  );
};

export default SiderMenu;
