import React, { useEffect, useState, useRef } from 'react';
import { Line } from '@ant-design/charts';
import './index.less';
import * as api from '@/api/analysis/index';
import moment from 'moment';
import NP from 'number-precision';
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
  DatePicker
} from 'antd';

function formatDate(date) {
  return date ? moment(date).format('YYYY-MM-DD') : '';
}

const { Option } = Select;

const { RangePicker } = DatePicker;

const SearchFrom = (props) => {
  const [form] = Form.useForm();
  // 大区
  const [rm, setRm] = useState('');
  // 区域
  const [dm, setDm] = useState('');
  // 辖区
  const [mr, setMr] = useState('');
  const [rmAreaList, setRmAreaList] = useState([]);
  const [dmAreaList, setDmAreaList] = useState([]);
  const [mrAreaList, setMrAreaList] = useState([]);

  useEffect(() => {
    function initSearch() {
      form.setFieldsValue({
        sometime: 'month'
      });
      const timeQuantum = getTimeQuantum('month');
      let param = {
        region: rm,
        district: dm,
        position: mr,
        start: timeQuantum.start,
        end: timeQuantum.end
      };
      props.handleSearch(param);
    }
    if (form) {
      initSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  // RM大区
  useEffect(() => {
    let didCancel = false;
    const params = {
      areaCode: ''
    };
    const gotData = async () => {
      try {
        const result = await api.areaList(params);
        if (!didCancel) {
          if (result.resultCode === 0) {
            const data = result.data;
            const listsdata = Array.isArray(data) ? data : [];
            if (listsdata.length > 0) {
              listsdata.unshift({
                areaCode: 'AllRegion',
                areaName: '所有大区'
              });
            }
            setRmAreaList(listsdata);
          }
        }
      } catch (error) {}
    };
    gotData();
  }, []);

  // DM区域
  useEffect(() => {
    let didCancel = false;
    const params = {
      areaCode: rm
    };
    const gotData = async () => {
      try {
        const result = await api.areaList(params);
        if (!didCancel) {
          if (result.resultCode === 0) {
            const data = result.data;
            const listsdata = Array.isArray(data) ? data : [];
            if (listsdata.length > 0) {
              listsdata.unshift({
                areaCode: 'AllDistrict',
                areaName: '所有区域'
              });
            }
            setDmAreaList(listsdata);
            if (rm === 'AllRegion' || !rm) {
              setDm('');
              setMr('');
            } else {
              listsdata.length > 0 && setDm('AllDistrict');
              setMr('');
            }
          }
        }
      } catch (error) {}
    };
    if (rm) {
      gotData();
    }
  }, [rm]);

  // MR辖区
  useEffect(() => {
    let didCancel = false;
    const params = {
      areaCode: dm
    };
    const gotData = async () => {
      try {
        const result = await api.areaList(params);
        if (!didCancel) {
          if (result.resultCode === 0) {
            const data = result.data;
            const listsdata = Array.isArray(data) ? data : [];
            if (listsdata.length > 0) {
              listsdata.unshift({
                areaCode: 'Allpostion',
                areaName: '所有辖区'
              });
            }
            setMrAreaList(listsdata);
            if (dm === 'AllDistrict' || !dm) {
              setMr('');
            } else {
              listsdata.length > 0 && setMr('Allpostion');
            }
          }
        }
      } catch (error) {}
    };
    if (dm) {
      gotData();
    }
  }, [dm]);

  // 大区
  const changeRmSelect = (value) => {
    setRm(value);
    if (!value) {
      setDm('');
      setMr('');
      setDmAreaList([]);
      setMrAreaList([]);
    }
  };

  // 区域
  const changeDmSelect = (value) => {
    setDm(value);
  };

  // 辖区
  const changeMrSelect = (value) => {
    setMr(value);
  };

  const onFinish = (values) => {
    let param = {
      start: '',
      end: '',
      region: rm,
      district: dm,
      position: mr
    };
    if (values.date) {
      param.start = formatDate(values.date[0]);
      param.end = formatDate(values.date[1]);
      form.setFieldsValue({
        sometime: ''
      });
    } else {
      const timeQuantum = getTimeQuantum(values.sometime);
      param.start = timeQuantum.start;
      param.end = timeQuantum.end;
    }
    props.handleSearch(param);
  };

  const onReset = () => {
    form.resetFields();
    form.setFieldsValue({
      sometime: 'month'
    });
    const timeQuantum = getTimeQuantum('month');
    const param = {
      start: timeQuantum.start,
      end: timeQuantum.end,
      region: '',
      position: '',
      district: ''
    };
    props.handleSearch(param);
    setRm('');
    setDm('');
    setMr('');
    setDmAreaList([]);
    setMrAreaList([]);
  };

  function radioChange() {
    const values = form.getFieldsValue();
    form.setFieldsValue({
      date: ''
    });
    const timeQuantum = getTimeQuantum(values.sometime);
    let param = {
      region: rm,
      district: dm,
      position: mr,
      start: timeQuantum.start,
      end: timeQuantum.end
    };
    props.handleSearch(param);
  }

  function getTimeQuantum(value) {
    return {
      start: moment().startOf(value).format('YYYY-MM-DD'),
      end: moment().endOf(value).format('YYYY-MM-DD')
    };
  }

  function handleExport() {
    props?.handleExport();
  }

  function changeRangePicker(date, dateString) {
    const values = form.getFieldsValue();
    if (!date && !values.sometime) {
      form.setFieldsValue({
        sometime: 'month'
      });
      const timeQuantum = getTimeQuantum('month');
      let param = {
        region: rm,
        district: dm,
        position: mr,
        start: timeQuantum.start,
        end: timeQuantum.end
      };
      props.handleSearch(param);
    }
  }

  return (
    <div className="searchform-wrapper">
      <Form form={form} name="searchform" onFinish={onFinish}>
        <Space>
          <Form.Item name="sometime">
            <Radio.Group onChange={radioChange} size="large">
              <Radio.Button value="isoweek">当周</Radio.Button>
              <Radio.Button value="month">当月</Radio.Button>
              <Radio.Button value="quarter">当季</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="date" label="起止日期" style={{ marginRight: 10 }}>
            <RangePicker
              allowClear
              disabledDate={(current) =>
                current && (current < moment().startOf('year') || current > moment().endOf('year'))
              }
              onChange={changeRangePicker}
            />
          </Form.Item>
        </Space>
        <Space>
          <Form.Item label="销售区划">
            <Space>
              <Select style={{ width: 100 }} value={rm} onChange={changeRmSelect} allowClear>
                {rmAreaList.map((item) => (
                  <Option value={item.areaCode} key={item.areaCode}>
                    {item.areaName}
                  </Option>
                ))}
              </Select>
              <Select style={{ width: 100 }} value={dm} onChange={changeDmSelect}>
                {dmAreaList.map((item) => (
                  <Option value={item.areaCode} key={item.areaCode}>
                    {item.areaName}
                  </Option>
                ))}
              </Select>
              <Select style={{ width: 100 }} value={mr} onChange={changeMrSelect}>
                {mrAreaList.map((item) => (
                  <Option value={item.areaCode} key={item.areaCode}>
                    {item.areaName}
                  </Option>
                ))}
              </Select>
            </Space>
          </Form.Item>
          <Form.Item>
            <Space style={{ textAlign: 'right' }}>
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

const DaySales = () => {
  const columns = [
    {
      title: '日期',
      dataIndex: 'fillDateFormart',
      key: 'fill_date',
      sorter: true
    },
    {
      title: '销售区划',
      dataIndex: 'planAreaName',
      key: 'plan_area_name',
      sorter: true
    },
    {
      title: '负责人',
      dataIndex: 'leader',
      key: 'leader'
    },
    {
      title: '纯销盒数',
      dataIndex: 'saleCounts',
      key: 'sale_counts',
      sorter: true
    },
    {
      title: '月度累计',
      dataIndex: 'pureSalesMonth',
      key: 'pure_sales_month',
      sorter: true
    },
    {
      title: '月度目标',
      dataIndex: 'targetSalesMonth',
      key: 'targetSalesMonth'
    },
    {
      title: '月度达成率',
      dataIndex: 'monthConversion',
      key: 'month_conversion',
      sorter: true,
      render: (val, record) => `${NP.times(val, 100)}%`
    },
    {
      title: '季度累计',
      dataIndex: 'quarterSales',
      key: 'quarter_sales',
      sorter: true
    },
    {
      title: '季度目标',
      dataIndex: 'targetQuarterSales',
      key: 'targetQuarterSales'
    },
    {
      title: '季度达成率',
      dataIndex: 'quarterConversion',
      key: 'quarter_conversion',
      sorter: true,
      render: (val, record) => `${NP.times(val, 100)}%`
    }
  ];

  const defaultConfig = {
    height: 400,
    xField: 'date',
    yField: 'value',
    seriesField: 'name',
    legend: { position: 'top' },
    smooth: true,
    tooltip: {
      customContent: (title, data) => {
        if (data && data.length > 0) {
          return `<div style="padding: 15px 6px">
            <div style="margin-bottom: 15px">${title}</div>
            <div style="margin-bottom: 15px">当日销量(盒)：${data[0].data.saleCounts}</div>
              <ul>
                <li style="margin-bottom: 15px">
                  <span style="display: inline-block; width: 8px; height: 8px;  border-radius: 8px; background-color: #5B8FF9"></span>
                  <span>${data[0].name}：</span>
                  <span>${NP.strip(data[0].value)}%</span>
                </li>
                <li>
                  <span style="display: inline-block; width: 8px; height: 8px;  border-radius: 8px; background-color: #5AD8A6"></span>
                  <span>${data[1].name}：</span>
                  <span>${NP.strip(data[1].value)}%</span>
                </li>
              </ul>
          </div>`;
        } else {
          return `${title}`;
        }
      }
    },
    xAxis: {
      label: {
        rotate: 1,
        offset: 15
      }
    }
  };

  const [lists, setLists] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchParam, setSearchParam] = useState({});
  const [sortParam, setSortParam] = useState({});
  const [chartData, setChartData] = useState([]);
  const plot = useRef(null);

  useEffect(() => {
    let didCancel = false;
    const params = {
      curPage: page,
      pageSize: pageSize,
      startTime: searchParam.start ? searchParam.start : '',
      endTime: searchParam.end ? searchParam.end : '',
      region: searchParam.region ? searchParam.region : '',
      position: searchParam.position ? searchParam.position : '',
      district: searchParam.district ? searchParam.district : '',
      sortName: sortParam.sortName ? sortParam.sortName : 'fill_date',
      sort: sortParam.sort ? sortParam.sort : 2
    };
    const gotData = async () => {
      try {
        const result = await api.daySalesList(params);
        if (!didCancel) {
          if (result.resultCode === 0) {
            const data = result.data;
            const listsdata = Array.isArray(data.positions) ? data.positions : [];
            const lists = listsdata.map((item, index) => {
              return {
                ...item,
                key: index
              };
            });
            setTotal(data.totalSize);
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
  }, [page, pageSize, searchParam, sortParam]);

  // 达成率折线图
  useEffect(() => {
    let didCancel = false;
    const params = {
      curPage: 0,
      pageSize: 0,
      startTime: searchParam.start ? searchParam.start : '',
      endTime: searchParam.end ? searchParam.end : '',
      region: searchParam.region ? searchParam.region : '',
      position: searchParam.position ? searchParam.position : '',
      district: searchParam.district ? searchParam.district : ''
    };
    const gotData = async () => {
      try {
        const result = await api.daySalesChart(params);
        if (!didCancel) {
          if (result.resultCode === 0) {
            const data = result.data;
            const listsdata = Array.isArray(data) ? data : [];
            if (sortParam.sortName === 'fill_date' && sortParam.sort === 2) {
              listsdata.sort((a, b) => {
                return moment(b.fillDateFormart).unix() - moment(a.fillDateFormart).unix();
              });
            } else {
              listsdata.sort((a, b) => {
                return moment(a.fillDateFormart).unix() - moment(b.fillDateFormart).unix();
              });
            }
            const quarter = listsdata.map((item) => {
              return {
                name: '季度达成率',
                date: moment(item.fillDateFormart).format('MM/DD'),
                value: NP.times(item.quarterConversion, 100),
                saleCounts: item.saleCounts
              };
            });
            const month = listsdata.map((item) => {
              return {
                name: '月度达成率',
                date: moment(item.fillDateFormart).format('MM/DD'),
                value: NP.times(item.monthConversion, 100),
                saleCounts: item.saleCounts
              };
            });
            const datalist = [...quarter, ...month];
            setChartData(datalist);
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
  }, [searchParam, sortParam]);

  const changePage = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const handleSearch = (val) => {
    setPage(1);
    setPageSize(20);
    setSearchParam({ ...val });
  };

  function onChangeTable(pagination, filters, sorter) {
    setSortParam({
      sortName: sorter.order ? sorter.columnKey : '',
      sort: sorter.order === 'ascend' ? 2 : sorter.order === 'descend' ? 1 : ''
    });
  }

  const handleExport = async () => {
    const param = {
      curPage: 0,
      pageSize: 0,
      startTime: searchParam.start ? searchParam.start : '',
      endTime: searchParam.end ? searchParam.end : '',
      region: searchParam.region ? searchParam.region : '',
      position: searchParam.position ? searchParam.position : '',
      district: searchParam.district ? searchParam.district : '',
      sortName: sortParam.sortName ? sortParam.sortName : 'fill_date',
      sort: sortParam.sort ? sortParam.sort : 2
    };
    const result = await api.daySalesExcel(param);
    if (result.resultCode === 2000) {
      message.error(result.errorMsg);
    } else {
      const blob = new Blob([result]);
      const startstr = searchParam.start.split('-');
      const endstr = searchParam.end.split('-');
      const fileName = `纯销日报${startstr[0]}${startstr[1]}${startstr[2]}-${endstr[0]}${endstr[1]}${endstr[2]}.xls`;
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

  const readyChart = (value) => {
    plot.current = value;
  };

  return (
    <>
      <div className="page">
        <SearchFrom handleSearch={handleSearch} handleExport={handleExport} />
        <div className="chart-page">
          <div className="chart-title">
            <LineChartOutlined style={{ color: '#1890ff' }} />
            <span className="title-span">纯销达成率</span>
          </div>
          <div className="chart-tips">数据来源：itodo填报销售盒数(不含赠药)</div>
          <div className="chart-component">
            <Line {...defaultConfig} data={chartData} onReady={readyChart} />
          </div>
        </div>
        <div className="table-wrapper">
          <Table columns={columns} dataSource={lists} bordered pagination={false} onChange={onChangeTable} />
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

export default DaySales;
