import { useState } from 'react';
import { Layout } from 'antd';
import { useConfigContext } from '@/context';
import './index.less';
import SiderNav from '@/components/SiderNav';
import SiderLogo from '@/components/SiderLogo';
import HeaderBar from '@/components/HeaderBar';
import TagsView from '@/components/TagsView';

const { Header, Content, Footer, Sider } = Layout;

const LayoutPage = (props: any) => {
  const { config } = useConfigContext();
  let [collapsed, setCollapsed] = useState(false);

  const handleToggle = (flag: boolean) => {
    setCollapsed(flag);
  };

  return (
    <Layout>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          overflowY: 'auto',
          height: '100vh',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          backgroundColor: 'rgba(15,41,80,1)'
        }}
      >
        <SiderLogo collapsed={collapsed} />
        <SiderNav collapsed={collapsed} />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 200, position: 'relative', overflowX: 'hidden' }}>
        <Header
          style={{
            backgroundColor: '#3c8dbc',
            position: 'fixed',
            zIndex: 999,
            left: collapsed ? 80 : 200,
            right: 0,
            padding: 0,
            height: '50px',
            lineHeight: '50px'
          }}
        >
          <HeaderBar collapsed={collapsed} handleToggle={handleToggle} />
        </Header>
        <TagsView collapsed={collapsed} />
        <div className="ant-layout-scroll">
          <Content style={{ padding: 16, marginTop: 89 }}>
            <div className="ant-layout-page">{props.children}</div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>{config.companyName}数据中台 ©2021 </Footer>
        </div>
      </Layout>
    </Layout>
  );
};

export default LayoutPage;
