import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, message, Form, Input, Select, Pagination, Space, Row, Col, Tree } from 'antd';

const CustomTable = (props) => {
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const changePage = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };
  <>
    <Table columns={props.columns} dataSource={props.lists} bordered pagination={false} />
    <div className="pagination-wrapper">
      <Pagination
        current={page}
        pageSize={pageSize}
        total={props.total}
        showSizeChanger
        showQuickJumper
        showTotal={(total) => `共${total}条`}
        onChange={changePage}
      />
    </div>
  </>;
};

export default CustomTable;
