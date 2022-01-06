/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Line } from '@ant-design/charts';
import './index.less';
import * as api from '@/api/analysis/index';
import moment from 'moment';
import {
  VerticalAlignBottomOutlined,
  SearchOutlined,
  SyncOutlined,
  LineChartOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
  FolderOpenOutlined,
  FileOutlined,
  DeleteOutlined,
  EditOutlined
} from '@ant-design/icons';
import {
  Table,
  Button,
  Modal,
  message,
  Form,
  Input,
  Select,
  Pagination,
  Space,
  Row,
  Col,
  Tree,
  Radio,
  DatePicker,
  Badge
} from 'antd';

const { RangePicker } = DatePicker;
function formatDate(date) {
  return date ? moment(date).format('YYYY') : '';
}

const SearchFrom = (props) => {
  const [form] = Form.useForm();
  const [dates, setDates] = useState([]);
  useEffect(() => {
    if (form) {
      form.setFieldsValue({
        sometime: 'year'
      });
      let param = getTimeQuantum('year');
      props.handleSearch(param);
    }
  }, [form]);

  const onFinish = (values) => {
    let param = {};
    if (values.date) {
      param.start = formatDate(values.date[0]);
      param.end = formatDate(values.date[1]);
      form.setFieldsValue({
        sometime: ''
      });
    } else {
      param = getTimeQuantum('year');
    }
    props.handleSearch(param);
  };

  function radioChange() {
    const values = form.getFieldsValue();
    form.setFieldsValue({
      date: ''
    });
    const param = getTimeQuantum(values.sometime);
    props.handleSearch(param);
  }

  const onReset = () => {
    form.resetFields();
    form.setFieldsValue({
      sometime: 'year'
    });
    const param = getTimeQuantum('year');
    props.handleSearch(param);
  };

  function getTimeQuantum(value) {
    return {
      start: value === 'lastyear' ? moment().subtract(1, 'years').format('YYYY') : moment().format('YYYY'),
      end: value === 'lastyear' ? moment().subtract(1, 'years').format('YYYY') : moment().format('YYYY')
    };
  }

  function changeRangePicker(date, dateString) {
    const values = form.getFieldsValue();
    if (!date && !values.sometime) {
      form.setFieldsValue({
        sometime: 'year'
      });
      let param = getTimeQuantum('year');
      props.handleSearch(param);
    }
  }

  function onCalendarChange(dates, dateStrings, info) {
    setDates(dates);
  }

  const disabledDate = (current) => {
    if (!dates || dates.length === 0) {
      return false;
    }
    const tooLate = dates[0] && current.diff(dates[0], 'years') > 3;
    const tooEarly = dates[1] && dates[1].diff(current, 'years') > 3;
    return tooEarly || tooLate;
  };

  return (
    <div className="searchform-wrapper">
      <Form form={form} name="searchform" onFinish={onFinish}>
        <Space>
          <Form.Item name="sometime">
            <Radio.Group size="large" onChange={radioChange}>
              <Radio.Button value="year">当年</Radio.Button>
              <Radio.Button value="lastyear">去年</Radio.Button>
            </Radio.Group>
          </Form.Item>
          {/* <Form.Item name="date" label="起止年份">
            <RangePicker
              picker="year"
              allowClear
              onChange={changeRangePicker}
              onCalendarChange={onCalendarChange}
              disabledDate={disabledDate}
            />
          </Form.Item> */}
          <Form.Item name="date" label="起止年份">
            <DatePicker picker="year" allowClear onChange={changeRangePicker} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                查询
              </Button>
              <Button onClick={onReset} icon={<SyncOutlined />}>
                重置
              </Button>
              <Button type="dashed" icon={<VerticalAlignBottomOutlined />}>
                导出数据
              </Button>
            </Space>
          </Form.Item>
        </Space>
      </Form>
    </div>
  );
};

const MonthSales = () => {
  const defaultConfig = {
    height: 400,
    xField: 'date',
    yField: 'value',
    seriesField: 'name',
    legend: { position: 'top' },
    smooth: true
    // slider: {
    //   start: 0,
    //   end: 1
    // }
  };

  const [lists, setLists] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchParam, setSearchParam] = useState({});
  const [sortParam, setSortParam] = useState({});
  const [type, setType] = useState('RD'); // 区类型(大区:RD,区域:DM,辖区:MR)
  const [chartData, setChartData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [areaCode, setAreaCode] = useState('');

  useEffect(() => {
    let didCancel = false;
    const params = {
      areaCode: areaCode,
      startTime: searchParam.start ? searchParam.start : '',
      endTime: searchParam.end ? searchParam.end : '',
      sortName: sortParam.sortName ? sortParam.sortName : '',
      sort: sortParam.sort ? sortParam.sort : ''
    };

    const gotData = async () => {
      try {
        const result = await api.monthSalesList(params);
        if (!didCancel) {
          if (result.resultCode === 0) {
            const data = result.data;
            const listsdata = Array.isArray(data) ? data : [];
            const lists = listsdata.map((item, index) => {
              return {
                ...item,
                key: index
              };
            });

            setLists(lists);
          }
        }
      } catch (error) {}
    };
    if (searchParam.start) {
      gotData();
    }
    return () => {
      didCancel = true;
    };
  }, [type, page, pageSize, searchParam, sortParam]);

  // 达成率折线图
  useEffect(() => {
    let didCancel = false;
    const params = {
      areaCode: areaCode,
      startTime: searchParam.start ? searchParam.start : '',
      endTime: searchParam.end ? searchParam.end : '',
      sortName: '',
      sort: ''
    };
    const gotData = async () => {
      try {
        const result = await api.monthSalesChart(params);
        if (!didCancel) {
          if (result.resultCode === 0) {
            const data = result.data;
            const listsdata = Array.isArray(data.positions) ? data.positions : [];
          }
        }
      } catch (error) {}
    };
    if (searchParam.start) {
      // gotData();
    }
    return () => {
      didCancel = true;
    };
  }, [searchParam, type]);

  const changePage = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const handleSearch = (val) => {
    setSearchParam({ ...val });
  };

  function onChangeTable(pagination, filters, sorter) {
    setSortParam({
      sortName: sorter.columnKey,
      sort: sorter.order === 'ascend' ? 2 : 1
    });
  }

  function handleColumns(data) {
    let columnsArr = [
      {
        title: '销售区划',
        dataIndex: 'planAreaName',
        key: 'planAreaName',
        width: 120
      },
      {
        title: '负责人',
        dataIndex: 'leader',
        key: 'leader',
        width: 120
      }
    ];
    if (data.length > 0) {
      data[0].list.map((val) => {
        const title = val.month.split('-');
        columnsArr.push({
          title: `${title[0]}${title[1]}`,
          dataIndex: val.month,
          key: val.month,
          width: 120
        });
      });
    }
    columnsArr.push({
      title: `当年累计`,
      dataIndex: 'yearSales',
      key: 'yearSales',
      width: 120
    });
    return columnsArr;
  }

  function handleData(data) {
    data.map((val) => {
      if (val.list && val.list.length > 0) {
        val.list.map((item) => {
          val[item.month] = item.monthSales;
        });
      }
    });
    return data;
  }

  return (
    <>
      <div className="page">
        <SearchFrom handleSearch={handleSearch} />
        <div className="chart-page">
          <div className="chart-title">
            <LineChartOutlined style={{ color: '#1890ff' }} />
            <span className="title-span">
              {type === 'RD' ? '大区' : type === 'DM' ? '区域' : type === 'MR' ? '辖区' : ''}
              月度纯销
            </span>
          </div>
          <div className="chart-tips">数据来源：itodo填报销售盒数(不含赠药)</div>
          <div className="chart-component">
            <Line {...defaultConfig} data={chartData} />
          </div>
        </div>
        <div className="table-wrapper">
          <Table
            columns={columns}
            dataSource={lists}
            bordered
            pagination={false}
            onChange={onChangeTable}
            scroll={{ x: true }}
          />
        </div>
        {/* <div className="pagination-wrapper">
          <Pagination
            current={page}
            pageSize={pageSize}
            total={total}
            showSizeChanger
            showQuickJumper
            showTotal={(total) => `共${total}条`}
            onChange={changePage}
          />
        </div> */}
      </div>
    </>
  );
};

export default MonthSales;
