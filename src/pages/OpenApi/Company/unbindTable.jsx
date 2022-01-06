import React, { useEffect, useState } from 'react';
import './index.less';
import * as api from '@/api/openapi/index';
import {
  SearchOutlined,
  SyncOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
  FolderOpenOutlined,
  FileOutlined,
  DeleteOutlined,
  EditOutlined
} from '@ant-design/icons';

import { Table, Button, Space, Modal, message, Form, Input, Radio, Tree, Checkbox } from 'antd';

const FormModal = (props) => {
  const [form] = Form.useForm();
  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const param = {
          ...values
        };
        bindClientApis(param);
      })
      .catch((error) => {});
  };

  const bindClientApis = async (param) => {
    const params = {
      ...param,
      clientId: props.clientId,
      apiId: props.rowdata.id
    };
    try {
      const result = await api.bindClientApis(params);
      if (result.resultCode === 0) {
        message.success('绑定成功');
        handleCancel();
        props.handleReload();
      } else {
        message.error(result.errorMsg);
      }
    } catch (error) {}
  };

  const handleCancel = () => {
    form.resetFields();
    props.handleClose();
  };

  return (
    <Modal
      title="接口绑定"
      visible={props.visible}
      onOk={handleOk}
      width="800px"
      onCancel={handleCancel}
      maskClosable={false}
      bodyStyle={{ height: '300px' }}
    >
      <Form
        name="form"
        form={form}
        labelCol={{
          span: 4
        }}
        wrapperCol={{
          span: 18
        }}
      >
        <Form.Item label="访问路径" name="path" rules={[{ required: true }]}>
          <Input allowClear />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const ApiTable = (props) => {
  const columns = [
    {
      title: 'apiId',
      dataIndex: 'id',
      key: 'id',
      width: 60
    },
    {
      title: 'api名称',
      dataIndex: 'apiName',
      key: 'apiName'
    },
    {
      title: 'api地址',
      dataIndex: 'apiPath',
      key: 'apiPath'
    },
    {
      title: 'api所属系统',
      dataIndex: 'apiModule',
      key: 'apiModule'
    },
    {
      title: 'api描述',
      dataIndex: 'apiDesc',
      key: 'apiDesc'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 60,
      render: (text, record) => {
        switch (parseInt(text)) {
          case 1:
            return `正常`;
          case 0:
            return `停用`;
          default:
        }
      }
    },
    {
      title: '操作',
      key: 'operation',
      fixed: 'right',
      width: 100,
      render: (value, record) => (
        <>
          <Button type="link" icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)}>
            绑定
          </Button>
        </>
      )
    }
  ];

  const [visible, setVisible] = useState(false);
  const [load, setLoad] = useState(false);
  const [lists, setLists] = useState([]);
  const [isstatus, setIsstatus] = useState(0);
  const [rowdata, setRowdata] = useState({});

  useEffect(() => {
    let didCancel = false;
    const params = {
      clientId: props.rowdata.id
    };
    const gotData = async () => {
      try {
        const result = await api.getUnbindApis(params);
        if (!didCancel) {
          if (result.resultCode === 0) {
            const data = result.data;
            const listsdata = Array.isArray(data.apis) ? data.apis : [];
            const lists = listsdata.map((item) => {
              return {
                ...item,
                key: item.id
              };
            });
            setLists(lists);
          }
        }
      } catch (error) {}
    };
    if (props.rowdata.id) {
      gotData();
    }
    return () => {
      didCancel = true;
    };
  }, [load, props.rowdata]);

  const handleReload = () => {
    setLoad(!load);
  };

  const handleClose = () => {
    setIsstatus(0);
    setVisible(false);
  };

  const handleEdit = (value) => {
    setRowdata({
      ...value
    });
    setVisible(true);
    setIsstatus(2);
  };

  return (
    <>
      <div className="table-wrapper">
        <Table columns={columns} dataSource={lists} bordered pagination={false} />
      </div>
      <FormModal
        isstatus={isstatus}
        visible={visible}
        rowdata={rowdata}
        handleReload={handleReload}
        handleClose={handleClose}
        clientId={props.rowdata.id}
      />
    </>
  );
};

export default ApiTable;
