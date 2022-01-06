import React, { useEffect, useState } from 'react';
import './index.less';
import * as api from '@/api/openapi/index';
import { CopyToClipboard } from 'react-copy-to-clipboard';
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
import { Table, Button, Space, Modal, message, Form, Input, Radio, Tree, Checkbox, Popconfirm } from 'antd';

import TableModal from './tableModal';

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
        clientName: props.rowdata.clientName,
        clientDesc: props.rowdata.clientDesc,
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
      const result = await api.clientAdd(params);
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
      const result = await api.clientUpdate(params);
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
        <Form.Item label="租户名称" name="clientName" rules={[{ required: true }]}>
          <Input allowClear />
        </Form.Item>
        <Form.Item label="租户描述" name="clientDesc">
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

const SecretModal = (props) => {
  const [secret, setSecret] = useState('');
  useEffect(() => {
    if (props.rowdata.id) {
      setSecret(props.rowdata.clientSecret);
    }
  }, [props]);

  const submitReset = async () => {
    const params = {
      clientId: props.rowdata.id
    };
    try {
      const result = await api.resetClientSecret(params);
      if (result.resultCode === 0) {
        message.success('密钥重置成功');
        const data = result.data;
        setSecret(data.clientSecret);
      } else {
        message.error(result.errorMsg);
      }
    } catch (error) {}
  };

  const handleCancel = () => {
    props.handleClose();
  };

  function confirm(e) {
    submitReset();
  }

  function cancel(e) {}

  return (
    <Modal
      title="查看密钥"
      visible={props.visible}
      width="600px"
      layout="vertical"
      onCancel={handleCancel}
      footer={null}
      maskClosable={false}
      bodyStyle={{ height: '300px' }}
    >
      <div className="secret-box">
        <CopyToClipboard text={secret} onCopy={() => message.success('复制成功')}>
          <div className="secret-content">
            <div className="secret-txt">{secret}</div>
            <div className="secret-btn">点击复制</div>
          </div>
        </CopyToClipboard>

        <Popconfirm
          title="重置密钥会导致已绑定接口全部失效，确定要进行此操作吗?"
          onConfirm={confirm}
          onCancel={cancel}
          okText="确定"
          cancelText="取消"
        >
          <Button danger>重置密钥</Button>
        </Popconfirm>
      </div>
    </Modal>
  );
};

const Company = () => {
  const columns = [
    {
      title: '租户Id',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: '租户Code',
      dataIndex: 'clientCode',
      key: 'clientCode'
    },
    {
      title: '租户名称',
      dataIndex: 'clientName',
      key: 'clientName'
    },
    {
      title: '租户描述',
      dataIndex: 'clientDesc',
      key: 'clientDesc'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
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
      width: 240,
      render: (value, record) => (
        <>
          <Button type="link" icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" onClick={() => handleCat(record)}>
            查看密钥
          </Button>
          <Button type="link" onClick={() => handleCatApi(record)}>
            查看接口
          </Button>
        </>
      )
    }
  ];

  const [visible, setVisible] = useState(false);
  const [load, setLoad] = useState(false);
  const [lists, setLists] = useState([]);
  const [treedata, setTreeData] = useState([]);
  const [menulist, setMenulist] = useState([]);
  const [isstatus, setIsstatus] = useState(0);
  const [rowdata, setRowdata] = useState({});

  const [svisible, setSVisible] = useState(false);
  const [srowdata, setSRowdata] = useState({});

  const [tvisible, setTVisible] = useState(false);
  const [trowdata, setTRowdata] = useState({});

  useEffect(() => {
    let didCancel = false;
    const gotData = async () => {
      try {
        const result = await api.clientList();
        if (!didCancel) {
          if (result.resultCode === 0) {
            const data = result.data;
            const listsdata = Array.isArray(data.clients) ? data.clients : [];
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

  const handleCat = (value) => {
    getClientSecret(value);
  };

  const getClientSecret = async (value) => {
    try {
      const param = {
        clientId: value.id
      };
      const result = await api.getClientSecret(param);
      if (result.resultCode === 0) {
        const data = result.data;
        setSRowdata({
          ...data
        });
        setSVisible(true);
      } else {
        message.error(result.errorMsg);
      }
    } catch (error) {}
  };

  const handleSClose = () => {
    setSVisible(false);
  };

  const handleCatApi = (value) => {
    setTVisible(true);
    setTRowdata({
      ...value
    });
  };

  const handleTClose = () => {
    setTVisible(false);
  };

  const handleDelete = (value) => {
    confirm({
      title: '确定要删除吗?',
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
        roleId: value.id
      };
      const result = await api.getClientSecret(param);
      if (result.resultCode === 0) {
        message.success('删除成功');
        setLoad(!load);
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
      <SecretModal visible={svisible} rowdata={srowdata} handleClose={handleSClose} />
      <TableModal visible={tvisible} rowdata={trowdata} handleClose={handleTClose} />
    </>
  );
};

export default Company;
