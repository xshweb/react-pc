import React, { useEffect, useState } from 'react';
import { SearchOutlined, SyncOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
import './index.less';
import * as api from '@/api/maindata/index';
import moment from 'moment';
import { Table, Button, Modal, message, Form, Input, Pagination, Space, Select, DatePicker } from 'antd';

const SearchFrom = (props) => {
  const [form] = Form.useForm();
  const onFinish = (values) => {
    const param = {};
    Object.keys(values).forEach((key) => {
      const element = values[key];
      param[key] = key === 'syncTime' ? (element ? moment(element).format('YYYY-MM-DD') : '') : element;
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
          <Form.Item name="type" label="操作类型">
            <Input allowClear />
          </Form.Item>
          <Form.Item name="syncTime" label="操作时间">
            <DatePicker allowClear style={{ width: 172 }} />
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select allowClear style={{ width: 172 }}>
              <Select.Option value="1">成功</Select.Option>
              <Select.Option value="0">失败</Select.Option>
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

const TableModal = (props) => {
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80
    },
    {
      title: '内容',
      dataIndex: 'dataContent',
      key: 'dataContent',
      width: 400,
      ellipsis: true
    },
    {
      title: '操作名',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '操作类型',
      dataIndex: 'operationType',
      key: 'operationType',
      width: 80
    },
    {
      title: '操作结果',
      dataIndex: 'syncResult',
      key: 'syncResult'
    },
    {
      title: '数据状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (val, record) => <>{parseInt(val) === 0 ? '失败' : parseInt(val) === 1 ? '成功' : ''}</>
    },
    {
      title: '操作时间',
      dataIndex: 'syncTimeFormat',
      key: 'syncTimeFormat',
      width: 140
    }
  ];

  const [lists, setLists] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchParam, setSearchParam] = useState({});

  useEffect(() => {
    let didCancel = false;
    const params = {
      logId: props.rowdata.id,
      pageIndex: page,
      pageSize: pageSize,
      status: searchParam.status ? searchParam.status : '',
      syncTime: searchParam.syncTime ? searchParam.syncTime : '',
      type: searchParam.type ? searchParam.type : '',
    };
    const gotData = async () => {
      try {
        const result = await api.syncLogList(params);
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

    if (props.rowdata.id) {
      gotData();
    }

    return () => {
      didCancel = true;
    };
  }, [page, pageSize, searchParam, props.rowdata]);

  const changePage = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const handleSearch = (val) => {
    setSearchParam({ ...val });
  };

  const handleCancel = () => {
    props.handleClose();
    setLists([]);
    setTotal(0);
    setPage(1);
    setPageSize(20);
    setSearchParam({});
  };

  return (
    <>
      <Modal
        title="日志详情"
        visible={props.visible}
        width="90%"
        onCancel={handleCancel}
        maskClosable={false}
        destroyOnClose={true}
        footer={null}
      >
        <SearchFrom handleSearch={handleSearch} />
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
      </Modal>
    </>
  );
};

export default TableModal;
