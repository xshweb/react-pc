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
  EditOutlined,
  PlusSquareOutlined,
  RollbackOutlined
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

function formatDate(date) {
  return date ? moment(date).format('YYYY') : '';
}

const SearchFrom = (props) => {
  const [form] = Form.useForm();
  useEffect(() => {
    if (form) {
      form.setFieldsValue({
        sometime: 'year'
      });
      let param = getTimeQuantum('year');
      props.handleSearch(param);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  const onFinish = (values) => {
    let param = {};
    if (values.date) {
      param.start = formatDate(values.date);
      param.end = formatDate(values.date);
      form.setFieldsValue({
        sometime: ''
      });
    } else {
      param = getTimeQuantum(values.sometime);
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

  function handleExport() {
    props.handleExport();
  }

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
          <Form.Item name="date" label="切换年份">
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
              <Button onClick={handleExport} type="dashed" icon={<VerticalAlignBottomOutlined />}>
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
    legend: { position: 'right-top' },
    smooth: true
  };

  const [lists, setLists] = useState([]);
  const [searchParam, setSearchParam] = useState({});
  const [sortParam, setSortParam] = useState({});
  const [type, setType] = useState('RD'); // 区类型(大区:RD,区域:DM,辖区:MR)
  const [chartData, setChartData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [areaCode, setAreaCode] = useState('');
  const [rowdata, setRowData] = useState([]);

  useEffect(() => {
    let didCancel = false;
    const params = {
      areaCode: areaCode,
      startTime: searchParam.start ? `${searchParam.start}` : '',
      endTime: searchParam.end ? `${searchParam.end}` : '',
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
            const listsColumns = handleColumns(lists);
            const tableData = handleData(lists);
            setColumns(listsColumns);
            setLists(tableData);
            const chartLists = handleChartData(lists);
            setChartData([...chartLists]);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areaCode, searchParam, sortParam]);

  const handleSearch = (val) => {
    setSearchParam({ ...val });
  };

  function onChangeTable(pagination, filters, sorter) {
    setSortParam({
      sortName: sorter.order ? sorter.columnKey : '',
      sort: sorter.order === 'ascend' ? 2 : sorter.order === 'descend' ? 1 : ''
    });
  }

  function backData() {
    const index = rowdata.findIndex((val) => val.planArea === areaCode);
    const planAreaParent = rowdata[index].planAreaParent;
    if (planAreaParent === 'COUNTRY') {
      // 顶级
      setAreaCode('');
    } else {
      setAreaCode(planAreaParent);
    }
    let typeval = getLevel(planAreaParent);
    setType(typeval);
    rowdata.splice(index, 1);
    setRowData([...rowdata]);
  }

  function nextData(val) {
    let typeval = getLevel(val.planArea);
    setType(typeval);
    setAreaCode(val.planArea);
    setRowData([...rowdata, val]);
  }

  function getLevel(val) {
    let value = '';
    if (/RD/.test(val)) {
      value = 'DM';
    } else if (/DM/.test(val)) {
      value = 'MR';
    } else {
      value = 'RD';
    }
    return value;
  }

  function handleColumns(data) {
    let columnsArr = [
      {
        title: '销售区划',
        dataIndex: 'planAreaName',
        key: 'planAreaName',
        width: 150,
        render: (val, record) => {
          if (/MR/.test(record.planArea)) {
            return <span>{val}</span>;
          } else {
            return (
              <span>
                {val}
                <span style={{ color: '#1890ff', marginLeft: 8, cursor: 'pointer' }} onClick={() => nextData(record)}>
                  <PlusSquareOutlined />
                </span>
              </span>
            );
          }
        }
      },
      {
        title: '负责人',
        dataIndex: 'leader',
        key: 'leader'
      }
    ];
    if (data.length > 0) {
      data[0].monthSet.map((val) => {
        const title = val.split('-');
        columnsArr.push({
          title: `${title[0]}${title[1]}`,
          dataIndex: val,
          key: val,
          sorter: true
        });
      });
    }
    columnsArr.push({
      title: `当年累计`,
      dataIndex: 'yearSales',
      key: 'yearSales',
      sorter: true
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
  function handleChartData(data) {
    let lists = [];
    const targetdata = data.map((val) => {
      let monthSetVaue = val.monthSet.map((item) => {
        return {
          month: item,
          monthSales: 0
        }
      });
      monthSetVaue.map((item) => {
        val.list.map((list) => {
          if (item.month === list.month) {
            item.monthSales = list.monthSales
          }
        })
      })
      return {
        ...val,
        listvalues: monthSetVaue
      }
    });
    targetdata.map((val) => {
      val.listvalues.map((item) => {
        lists.push({
          name: val.planAreaName,
          date: `${parseInt(item.month.split('-')[1])}月`,
          value: item.monthSales
        });
      });
    });
    return lists;
  }

  const handleExport = async () => {
    const param = {
      areaCode: areaCode,
      startTime: searchParam.start ? `${searchParam.start}` : '',
      endTime: searchParam.end ? `${searchParam.end}` : '',
      sortName: sortParam.sortName ? sortParam.sortName : '',
      sort: sortParam.sort ? sortParam.sort : ''
    };
    const result = await api.monthSalesExcel(param);
    if (result.resultCode === 2000) {
      message.error(result.errorMsg);
    } else {
      const blob = new Blob([result]);
      const typeName = type === 'RD' ? '大区' : type === 'DM' ? '区域' : type === 'MR' ? '辖区' : '';
      const fileName = `纯销月报-${typeName}${searchParam.start}.xls`;
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
        <SearchFrom handleSearch={handleSearch} handleExport={handleExport} />
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
        {type !== 'RD' && (
          <div className="operation-wrapper">
            <Space>
              <Button type="primary" onClick={backData} icon={<RollbackOutlined />}>
                返回上一级
              </Button>
            </Space>
          </div>
        )}
        <div className="table-wrapper">
          <Table columns={columns} dataSource={lists} bordered pagination={false} onChange={onChangeTable} />
        </div>
      </div>
    </>
  );
};

export default MonthSales;
