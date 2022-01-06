import { useEffect, useState } from 'react';
import { SearchOutlined, SyncOutlined } from '@ant-design/icons';
import './index.less';
import * as api from '@/api/maindata/index';
import moment from 'moment';
import { Table, Button, Form, Input, Pagination, Space, Select, DatePicker, message } from 'antd';

import TableModal from './tableModal';

const SearchFrom = (props) => {
  const [form] = Form.useForm();
  const onFinish = (values) => {
    const param = {};
    Object.keys(values).forEach((key) => {
      const element = values[key];
      param[key] = key === 'startTime' ? (element ? moment(element).format('YYYY-MM-DD') : '') : element;
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
          <Form.Item name="operateDescribe" label="描述">
            <Input allowClear />
          </Form.Item>
          <Form.Item name="type" label="数据类型">
            <Input allowClear />
          </Form.Item>
          <Form.Item name="startTime" label="开始时间">
            <DatePicker allowClear style={{ width: 172 }} />
          </Form.Item>
        </Space>
        <Space>
          <Form.Item name="state" label="状态">
            <Select allowClear style={{ width: 172 }}>
              <Select.Option value={1}>成功</Select.Option>
              <Select.Option value={0}>失败</Select.Option>
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

const SyncLog = () => {
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60
    },
    {
      title: '描述',
      dataIndex: 'operateDescribe',
      key: 'operateDescribe',
      width: 180,
      ellipsis: true
    },
    {
      title: '状态',
      dataIndex: 'state',
      key: 'state',
      width: 60,
      render: (val, record) => <>{parseInt(val) === 0 ? '失败' : parseInt(val) === 1 ? '成功' : ''}</>
    },

    {
      title: '开始时间',
      dataIndex: 'startTimeFormart',
      key: 'startTimeFormart',
      width: 90
    },
    {
      title: '结束时间',
      dataIndex: 'endTimeFormart',
      key: 'endTimeFormart',
      width: 90
    },
    {
      title: '执行时间',
      dataIndex: 'operateTime',
      key: 'operateTime',
      width: 80,
      render: (val) => {
        return `${(val / 1000).toFixed(2)}秒`;
      }
    },
    {
      title: '数据类型',
      dataIndex: 'type',
      key: 'type'
    },
    {
      title: '日志数据',
      dataIndex: 'logData',
      key: 'logData',
      width: 180,
      ellipsis: true
    },
    {
      title: '操作',
      key: 'operation',
      fixed: 'right',
      width: 140,
      render: (val, record) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)}>
            日志详情
          </Button>
          <Button type="link" onClick={() => handleExport(record)}>
            导出
          </Button>
        </>
      )
    }
  ];

  const [visible, setVisible] = useState(false);
  const [lists, setLists] = useState([]);
  const [rowdata, setRowdata] = useState({});
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchParam, setSearchParam] = useState([]);

  useEffect(() => {
    let didCancel = false;
    const params = {
      pageIndex: page,
      pageSize: pageSize,
      state: searchParam.state,
      startTime: searchParam.startTime ? searchParam.startTime : '',
      operateDescribe: searchParam.operateDescribe ? searchParam.operateDescribe : '',
      type: searchParam.type ? searchParam.type : '',
    };
    const gotData = async () => {
      try {
        const result = await api.logList(params);
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
    gotData();
    return () => {
      didCancel = true;
    };
  }, [page, pageSize, searchParam]);

  const changePage = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const handleSearch = (val) => {
    setPage(1);
    setPageSize(20);
    setSearchParam({ ...val });
  };

  const handleClose = () => {
    setVisible(false);
    setRowdata({});
  };

  const handleEdit = (value) => {
    setRowdata(value);
    setVisible(true);
  };

  const handleExport = async (row) => {
    const param = {
      logId: row.id
    };
    const result = await api.syncLogExport(param);
    if (result.resultCode === 2000) {
      message.error(result.errorMsg);
    } else {
      const blob = new Blob([result]);
      const fileName = `${row.operateDescribe}.xls`;
      const elink = document.createElement('a');
      elink.download = fileName;
      elink.style.display = 'none';
      elink.href = URL.createObjectURL(blob);
      document.body.appendChild(elink);
      elink.click();
      URL.revokeObjectURL(elink.href); // 释放URL 对象
      document.body.removeChild(elink);
    }
  };

  return (
    <>
      <div className="page">
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
      </div>
      <TableModal visible={visible} rowdata={rowdata} handleClose={handleClose} />
    </>
  );
};

export default SyncLog;
