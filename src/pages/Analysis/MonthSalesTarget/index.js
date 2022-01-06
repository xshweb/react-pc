import React, { useEffect, useState, useRef } from 'react';
import UpFileBtn from '@/components/TargertUpFileBtn';
import './style.less';
import * as api from '@/api/analysis/index';
import {
  Table,
  Button,
  DatePicker,
  Space,
  Modal,
  message,
  Form,
  Input,
  Empty,
  Row,
  Col,
  Select,
  Pagination
} from 'antd';
import { VerticalAlignBottomOutlined } from '@ant-design/icons';
const MonthSalesTarget = () => {
  const [data, setData] = useState([]);
  const [isupdata, setIsUpData] = useState(0);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // 数据
  useEffect(() => {
    let didCancel = false;
    const gotData = async () => {
      try {
        const params = {
          curPage: page,
          pageSize: pageSize
        };
        const result = await api.saleTargetRecord(params);
        if (!didCancel) {
          if (result.resultCode === 0) {
            const data = result.data;
            const datalist = Array.isArray(data.moidfys) ? data.moidfys : [];
            const tabledata = datalist.map((item, index) => {
              return {
                ...item,
                key: String(index)
              };
            });
            setTotal(data.totalSize);
            setData([...tabledata]);
          }
        }
      } catch (error) {}
    };
    gotData();
    return () => {
      didCancel = true;
    };
  }, [isupdata, page, pageSize]);

  const handleExport = async () => {
    const param = {};
    const result = await api.saleTargetExcel(param);
    if (result.resultCode === 2000) {
      message.error(result.errorMsg);
    } else {
      const blob = new Blob([result]);
      const fileName = `销售目标excel模板.xls`;
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

  const handleCallBack = () => {
    const value = Math.random();
    setIsUpData(value);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: '操作人',
      dataIndex: 'createUserName',
      key: 'createUserName'
    },
    {
      title: '操作时间',
      dataIndex: 'createTimeFormat',
      key: 'createTimeFormat'
    }
  ];

  const changePage = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  return (
    <>
      <div className="page">
        <div className="operation-wrapper">
          <Space>
            <Button size="small" onClick={handleExport} icon={<VerticalAlignBottomOutlined />}>
              导出模板
            </Button>
            <UpFileBtn action="/sfa/file/upload/sales" callback={handleCallBack} />
          </Space>
        </div>
        <div className="table-wrapper">
          <Table columns={columns} dataSource={data} bordered pagination={false} />
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
    </>
  );
};

export default MonthSalesTarget;
