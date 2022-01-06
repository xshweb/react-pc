import React, { useEffect, useState } from 'react';
import './style.less';
import * as api from '@/api/user';
import { Table, Button, Modal, message, Form, Input, Empty, Tag } from 'antd';

const FormModal = (props) => {
  const [form] = Form.useForm();
  const submitData = async (param) => {
    const params = {
      ...param
    };
    try {
      const result = await api.stockAdd(params);
      if (result.resultCode === 0) {
        message.success('操作成功');
        props.reloadData();
        handleCancel();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const param = {
          ...values
        };
        submitData(param);
      })
      .catch((error) => {
        console.log('errorInfo', error);
      });
  };

  const handleCancel = () => {
    form.resetFields();
    props.closeModal();
  };

  const checkNum = (_, value) => {
    if (/^([1-9]\d*|0)$/.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('输入不合法，请输入正整数!'));
  };

  return (
    <Modal
      title="数据录入"
      visible={props.visible}
      onOk={handleOk}
      width="600px"
      onCancel={handleCancel}
      maskClosable={false}
      destroyOnClose={true}
      forceRender={true}
    >
      <Form
        form={form}
        name="form-hooks"
        labelCol={{
          span: 6
        }}
        wrapperCol={{
          span: 24
        }}
      >
        <Form.Item label="库存数据(盒)" name="stock" rules={[{ required: true, validator: checkNum }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const columns = [
  {
    title: '库存数量',
    dataIndex: 'currentInventory',
    key: 'currentInventory'
  },
  {
    title: '录入人员',
    dataIndex: 'createName',
    key: 'createName'
  },
  {
    title: '录入时间',
    dataIndex: 'createTime',
    key: 'createTime',
    render: (text, record) => (
      <span>
        {text}
        <span style={{ marginLeft: '20px' }}>{record.isdelete === 0 && <Tag color="green">最新</Tag>}</span>
      </span>
    )
  }
];

const StockData = () => {
  const [ispower, setIsPower] = useState(1);
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [loaddata, setLoadData] = useState(false);
  // 数据
  useEffect(() => {
    let didCancel = false;
    const gotData = async () => {
      try {
        const result = await api.stockList();
        if (!didCancel) {
          if (result.resultCode === 0) {
            const data = Array.isArray(result.data) ? result.data : [];
            const tabledata = data.map((item, index) => {
              return {
                ...item,
                key: String(index)
              };
            });

            setData([...tabledata]);
          }
        }
      } catch (error) {
        error.status === 403 && setIsPower(2);
      }
    };
    gotData();
    return () => {
      didCancel = true;
    };
  }, [loaddata]);

  const handleAdd = () => {
    setVisible(true);
  };

  const reloadData = () => {
    setLoadData(!loaddata);
  };

  const closeModal = () => {
    setVisible(false);
  };

  return (
    <div>
      {ispower === 1 && (
        <div className="page">
          <div className="operation-wrapper">
            <Button type="primary" onClick={handleAdd}>
              库存录入
            </Button>
          </div>
          <div className="table-wrapper">
            <Table columns={columns} dataSource={data} bordered />
          </div>
        </div>
      )}

      {ispower === 2 && (
        <div className="power-wrapper">
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="抱歉，您暂无权限" />
        </div>
      )}

      <FormModal closeModal={closeModal} visible={visible} data={data} reloadData={reloadData} />
    </div>
  );
};

export default StockData;
