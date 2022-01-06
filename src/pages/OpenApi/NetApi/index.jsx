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

const { confirm } = Modal;

const FormModal = (props) => {
  const [form] = Form.useForm();
  useEffect(() => {
    if (props.isstatus === 1) {
      form.setFieldsValue({
        status: '1'
      });
    } else if (props.isstatus === 2) {
      form.setFieldsValue({
        apiDesc: props.rowdata.apiDesc,
        apiModule: props.rowdata.apiModule,
        apiName: props.rowdata.apiName,
        apiPath: props.rowdata.apiPath,
        status: props.rowdata.status
      });
    }
  }, [props, form]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const param = {
          ...values
        };
        if (props.isstatus === 1) {
          clientAdd(param);
        } else {
          submitUpdate(param);
        }
      })
      .catch((error) => {});
  };
  const clientAdd = async (param) => {
    const params = {
      ...param
    };
    try {
      const result = await api.apiAdd(params);
      if (result.resultCode === 0) {
        message.success('新增成功');
        handleCancel();
        props.handleReload();
      } else {
        message.error(result.errorMsg);
      }
    } catch (error) {}
  };

  const submitUpdate = async (param) => {
    const params = {
      ...param,
      id: props.rowdata.id
    };
    try {
      const result = await api.apiUpdate(params);
      if (result.resultCode === 0) {
        message.success('更新成功');
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
      title={props.isstatus === 1 ? '数据新增' : '数据编辑'}
      visible={props.visible}
      onOk={handleOk}
      width="800px"
      onCancel={handleCancel}
      maskClosable={false}
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
        <Form.Item label="api名称" name="apiName" rules={[{ required: true }]}>
          <Input allowClear />
        </Form.Item>
        <Form.Item label="api地址" name="apiPath" rules={[{ required: true }]}>
          <Input allowClear />
        </Form.Item>
        <Form.Item label="api所属系统" name="apiModule" rules={[{ required: true }]}>
          <Input allowClear />
        </Form.Item>
        <Form.Item label="api描述" name="apiDesc">
          <Input.TextArea allowClear rows={4} />
        </Form.Item>
        {props.isstatus === 2 ? (
          <Form.Item label="状态" name="status" rules={[{ required: true }]}>
            <Radio.Group>
              <Radio value="1">正常</Radio>
              <Radio value="0">停用</Radio>
            </Radio.Group>
          </Form.Item>
        ) : null}
      </Form>
    </Modal>
  );
};

const NetApi = () => {
  const columns = [
    {
      title: 'apiID',
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
        switch (text) {
          case '1':
            return `正常`;
          case '0':
            return <span style={{ color: '#ccc' }}>停用</span>;
          default:
        }
      }
    },
    {
      title: '操作',
      key: 'operation',
      fixed: 'right',
      width: 120,
      render: (value, record) => (
        <>
          <Space>
            <Button type="link" icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)}>
              编辑
            </Button>
            <Button type="link" icon={<DeleteOutlined />} danger size="small" onClick={() => handleDelete(record)}>
              删除
            </Button>
          </Space>
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
    const gotData = async () => {
      try {
        const result = await api.apiList();
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
    gotData();
    return () => {
      didCancel = true;
    };
  }, [load]);

  const handleAdd = () => {
    setVisible(true);
    setIsstatus(1);
  };

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

  const handleDelete = (value) => {
    confirm({
      title: '确定要删除该接口吗?',
      icon: <ExclamationCircleOutlined />,
      content: '',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        deleteSubmit(value);
      },
      onCancel() {
        // Cancel
      }
    });
  };

  const deleteSubmit = async (value) => {
    try {
      const param = {
        apiId: value.id
      };
      const result = await api.apiRemove(param);
      if (result.resultCode === 0) {
        message.success('删除成功');
        setLoad(!load);
      } else {
        message.error(result.errorMsg);
      }
    } catch (error) {}
  };

  return (
    <>
      <div className="page">
        <div className="operation-wrapper">
          <Space>
            <Button type="primary" onClick={handleAdd} icon={<PlusOutlined />}>
              新增
            </Button>
          </Space>
        </div>
        <div className="table-wrapper">
          <Table columns={columns} dataSource={lists} bordered pagination={false} />
        </div>
      </div>
      <FormModal
        isstatus={isstatus}
        visible={visible}
        rowdata={rowdata}
        handleReload={handleReload}
        handleClose={handleClose}
      />
    </>
  );
};

export default NetApi;
