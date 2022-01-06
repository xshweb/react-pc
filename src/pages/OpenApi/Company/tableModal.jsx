import { useState } from 'react';
import './index.less';
import UnbindTable from './unbindTable';
import BindTable from './bindTable';
import { Modal, Tabs } from 'antd';

const { TabPane } = Tabs;

const TableModal = (props) => {
  const [activeKey, setActiveKey] = useState('1');

  const handleCancel = () => {
    props.handleClose();
  };

  const onChange = (activeKey) => {
    setActiveKey(activeKey);
  };

  return (
    <>
      <Modal
        title="查看接口"
        visible={props.visible}
        width="90%"
        onCancel={handleCancel}
        maskClosable={false}
        destroyOnClose={true}
        footer={null}
        bodyStyle={{ minHeight: '300px' }}
      >
        <Tabs defaultActiveKey="1" type="card" onChange={onChange}>
          <TabPane tab="已绑定接口" key="1">
            {activeKey === '1' ? <BindTable rowdata={props.rowdata} /> : null}
          </TabPane>
          <TabPane tab="未绑定接口" key="2">
            {activeKey === '2' ? <UnbindTable rowdata={props.rowdata} /> : null}
          </TabPane>
        </Tabs>
      </Modal>
    </>
  );
};

export default TableModal;
