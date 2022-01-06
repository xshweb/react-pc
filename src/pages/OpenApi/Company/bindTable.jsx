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
import { Table, Button, Space, Modal, message, Form, Input, Popconfirm } from 'antd';

const FormModal = (props) => {
  const [form] = Form.useForm();
  useEffect(() => {
    if (props.isstatus === 2) {
      form.setFieldsValue({
        path: props.rowdata.path
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
        modifyApiPath(param);
      })
      .catch((error) => {});
  };

  const modifyApiPath = async (param) => {
    const params = {
      ...param,
      id: props.rowdata.id
    };
    try {
      const result = await api.modifyApiPath(params);
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
      title="修改路径"
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
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60
    },
    {
      title: '访问路径',
      dataIndex: 'path',
      key: 'path'
    },
    {
      title: 'apiId',
      dataIndex: 'apiId',
      key: 'apiId',
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
      key: 'apiModule',
      width: 120
    },
    {
      title: '租户Id',
      dataIndex: 'clientId',
      key: 'clientId',
      width: 60
    },
    {
      title: '操作',
      key: 'operation',
      fixed: 'right',
      width: 140,
      render: (value, record) => (
        <>
          <Button type="link" icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定要解绑此接口吗?"
            onConfirm={() => handleConfirm(record)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" icon={<DeleteOutlined />} size="small" danger>
              解绑
            </Button>
          </Popconfirm>
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
        const result = await api.getClientApis(params);
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

  const handleConfirm = (row) => {
    unbindClientApis(row);
  };

  const unbindClientApis = async (value) => {
    try {
      const param = {
        clientApiId: value.id
      };
      const result = await api.unbindClientApis(param);
      if (result.resultCode === 0) {
        message.success('解绑成功');
        setLoad(!load);
      }
    } catch (error) {}
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
