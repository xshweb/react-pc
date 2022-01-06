import { useState, useEffect, useMemo } from 'react';
import { Menu } from 'antd';
import { setNavToken, gotNavToken } from '@/libs/handleStorage';
import { createFromIconfontCN } from '@ant-design/icons';
import { useMenuContext, useNavContext } from '@/context';
const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2402613_ye3vti0or7o.js'
});

let menus = [];

const HeaderMenu = () => {
  const { menu } = useMenuContext();

  const { headnav, dispatchNav } = useNavContext();

  let [lists, setList] = useState([]);
  useEffect(() => {
    setList([...menu]);
    if (!gotNavToken()) {
      if (menu.length > 0) {
        dispatchNav({
          type: 'post',
          payload: menu[0].link
        });
        setNavToken(menu[0].link);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menu]);

  const handleClick = (e) => {
    dispatchNav({
      type: 'post',
      payload: e.key
    });
    setNavToken(e.key);
  };

  const renderMenuItem = ({ link, icon, title }) => {
    return (
      <Menu.Item
        key={link}
        icon={icon && <IconFont style={{ color: headnav === link ? '#1890ff' : '#000000' }} type={icon} />}
      >
        <span>{title}</span>
      </Menu.Item>
    );
  };

  return (
    <Menu onClick={handleClick} selectedKeys={[headnav]} mode="horizontal">
      {lists.map((item) => renderMenuItem(item))}
    </Menu>
  );
};

export default HeaderMenu;
