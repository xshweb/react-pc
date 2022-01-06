import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './index.less';
import * as api from '@/api/system/index';
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
import { Table, Button, Modal, message, Form, Input, Select, Pagination, Space, Row, Col, Tree, Radio } from 'antd';

const { confirm } = Modal;

const FormModal = (props) => {
  const [form] = Form.useForm();
  useEffect(() => {
    if (props.isstatus === 1) {
      form.setFieldsValue({
        status: '1',
        dictionaryType: props.dictId
      });
    } else if (props.isstatus === 2) {
      form.setFieldsValue({
        dictionaryKey: props.rowdata.dictionaryKey,
        dictionaryLabel: props.rowdata.dictionaryLabel,
        seqencn: props.rowdata.seqencn,
        dictionaryType: props.dictId,
        remarks: props.rowdata.remarks,
        status: props.rowdata.status
      });
    }
  }, [props, form]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const param = {
          ...values,
          id: props.isstatus === 2 ? props.rowdata.id : ''
        };
        submitData(param);
      })
      .catch((error) => {});
  };

  const submitData = async (param) => {
    const params = {
      ...param
    };
    try {
      const result = await api.dictDetailUpdate(params);
      if (result.resultCode === 0) {
        message.success('操作成功');
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
        <Form.Item label="字典类型" name="dictionaryType" rules={[{ required: true }]}>
          <Input disabled />
        </Form.Item>
        <Form.Item label="字典标签" name="dictionaryLabel" rules={[{ required: true }]}>
          <Input allowClear />
        </Form.Item>
        <Form.Item label="字典键值" name="dictionaryKey" rules={[{ required: true }]}>
          <Input allowClear />
        </Form.Item>
        <Form.Item label="排序" name="seqencn" rules={[{ required: true }]}>
          <Input allowClear />
        </Form.Item>
        <Form.Item label="状态" name="status" rules={[{ required: true }]}>
          <Radio.Group>
            <Radio value="1">正常</Radio>
            <Radio value="0">停用</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="备注" name="remarks">
          <Input.TextArea allowClear />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const SearchFrom = (props) => {
  const [form] = Form.useForm();
  const onFinish = (values) => {
    const param = {};
    Object.keys(values).forEach((key) => {
      const element = values[key];
      param[key] = element ? element : '';
    });
    props.handleSearch(param);
  };

  const onReset = () => {
    form.resetFields();
    let values = form.getFieldsValue();
    const param = {};
    Object.keys(values).forEach((key) => {
      param[key] = '';
    });
    props.handleSearch(param);
  };

  return (
    <div className="searchform-wrapper">
      <Form form={form} name="searchform" onFinish={onFinish}>
        <Space>
          <Form.Item name="dictionaryLabel" label="字典标签">
            <Input allowClear />
          </Form.Item>
          <Form.Item name="dictionaryKey" label="字典键值">
            <Input allowClear />
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select allowClear style={{ width: 172 }}>
              <Select.Option value="1">正常</Select.Option>
              <Select.Option value="0">停用</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                查询
              </Button>
              <Button onClick={onReset} icon={<SyncOutlined />}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Space>
      </Form>
    </div>
  );
};

const DictData = () => {
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: '字典标签',
      dataIndex: 'dictionaryLabel',
      key: 'dictionaryLabel'
    },
    {
      title: '字典键值',
      dataIndex: 'dictionaryKey',
      key: 'dictionaryKey'
    },
    {
      title: '字典顺序',
      dataIndex: 'seqencn',
      key: 'seqencn'
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      key: 'remarks'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (val, record) => {
        switch (val) {
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
      render: (val, record) => (
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
  let urlparams = useParams();
  const [visible, setVisible] = useState(false);
  const [load, setLoad] = useState(false);
  const [lists, setLists] = useState([]);
  const [rolelist, setRoleList] = useState([]);
  const [isstatus, setIsStatus] = useState(0);
  const [rowdata, setRowdata] = useState({});
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchParam, setSearchParam] = useState({});

  useEffect(() => {
    let didCancel = false;
    const params = {
      pageIndex: page,
      pageSize: pageSize,
      dictionaryType: urlparams?.dictId,
      dictionaryLabel: searchParam.dictionaryLabel ? searchParam.dictionaryLabel : '',
      dictionaryKey: searchParam.dictionaryKey ? searchParam.dictionaryKey : '',
      status: searchParam.status ? searchParam.status : ''
    };
    const gotData = async () => {
      try {
        const result = await api.dictDetailList(params);
        if (!didCancel) {
          if (result.resultCode === 0) {
            const data = result.data;
            const listsdata = Array.isArray(data.list) ? data.list : [];
            const lists = listsdata.map((item) => {
              return {
                ...item,
                key: item.id
              };
            });
            setTotal(data.total);
            setLists(lists);
          }
        }
      } catch (error) {}
    };
    if (urlparams?.dictId) {
      gotData();
    }
    return () => {
      didCancel = true;
    };
  }, [load, page, pageSize, searchParam, urlparams?.dictId]);

  const changePage = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const handleSearch = (val) => {
    setPage(1);
    setPageSize(20);
    setSearchParam({ ...val });
  };

  const handleAdd = () => {
    setVisible(true);
    setIsStatus(1);
  };

  const handleEdit = (value) => {
    setVisible(true);
    setIsStatus(2);
    setRowdata(value);
  };

  const handleReload = () => {
    setLoad(!load);
  };

  const handleClose = () => {
    setIsStatus(0);
    setVisible(false);
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
        id: value.id
      };
      const result = await api.dictDetailDel(param);
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
        <SearchFrom handleSearch={handleSearch} />
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
        <div className="pagination-wrapper">
          <Pagination
            current={page}
            pageSize={pageSize}
            total={total}
            showSizeChanger
            showQuickJumper
            showTotal={(total) => `共${total}条`}
            onChange={changePage}
          />
        </div>
      </div>
      <FormModal
        isstatus={isstatus}
        visible={visible}
        rowdata={rowdata}
        handleReload={handleReload}
        handleClose={handleClose}
        dictId={urlparams?.dictId}
      />
    </>
  );
};

export default DictData;
