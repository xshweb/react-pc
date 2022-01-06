import React, { useEffect, useState, useRef } from 'react';
import UpFileBtn from '@/components/UpFileBtn';
import './style.less';
import * as api from '@/api/user';
import md5 from 'blueimp-md5';
import { gotUserToken } from '@/libs/handleStorage';
import { Table, Button, DatePicker, Space, Modal, message, Form, Input, Empty, Row, Col, Select } from 'antd';

const { Option } = Select;

const SearchFrom = (props) => {
  const [form] = Form.useForm();
  const onFinish = (values) => {
    const param = {};
    Object.keys(values).forEach((key) => {
      const element = values[key];
      param[key] = element ? element : '';
    });
    props.search(param);
  };

  return (
    <div className="searchform-wrapper">
      <Form form={form} name="searchform" onFinish={onFinish}>
        <Space>
          <Form.Item name="code">
            <Select
              allowClear
              showSearch
              style={{ width: 200 }}
              placeholder="输入大屏指标名称查询"
              optionFilterProp="children"
              filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              filterSort={(optionA, optionB) =>
                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
              }
            >
              {props.data.map((item, index) => (
                <Option key={String(index)} value={item.operationCode}>
                  {item.screenIndicator}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </Form.Item>
        </Space>
      </Form>
    </div>
  );
};

const BIWeb = () => {
  const [ispower, setIsPower] = useState(1);
  const [data, setData] = useState([]);
  const [searchdata, setSearchData] = useState([]);
  const [searchParam, setSearchParam] = useState('');
  const [visible, setVisible] = useState(false);
  const [power, setPower] = useState(0);
  const [isupdata, setIsUpData] = useState(0);

  // 下拉列表
  useEffect(() => {
    let didCancel = false;
    const gotSearchData = async () => {
      try {
        const params = {
          code: ''
        };
        const result = await api.largescreenlist(params);
        if (!didCancel) {
          if (result.resultCode === 0) {
            const data = Array.isArray(result.data) ? result.data : [];
            const tabledata = data.map((item, index) => {
              return {
                ...item,
                key: String(index)
              };
            });
            setSearchData([...tabledata]);
          }
        }
      } catch (error) {
        error.status === 403 && setIsPower(2);
      }
    };
    gotSearchData();
    return () => {
      didCancel = true;
    };
  }, []);

  // 数据
  useEffect(() => {
    let didCancel = false;
    const gotData = async () => {
      try {
        const params = {
          code: searchParam
        };
        const result = await api.largescreenlist(params);
        if (!didCancel) {
          if (result.resultCode === 0) {
            const data = Array.isArray(result.data) ? result.data : [];
            const tabledata = data.map((item, index) => {
              return {
                ...item,
                key: String(index)
              };
            });
            setData([...tabledata]);
          }
        }
      } catch (error) {
        error.status === 403 && setIsPower(2);
      }
    };
    gotData();
    return () => {
      didCancel = true;
    };
  }, [searchParam, isupdata]);

  const handleSearch = (value) => {
    setSearchParam(value.code);
  };

  const downFile = async (row) => {
    try {
      let type = handleType(row.operationCode);
      const param = {
        type: type
      };
      const result = await api.largescreendownload(param);
      const blob = new Blob([result]);
      const fileName = `${row.screenIndicator}.xlsx`;
      const elink = document.createElement('a');
      elink.download = fileName;
      elink.style.display = 'none';
      elink.href = URL.createObjectURL(blob);
      document.body.appendChild(elink);
      elink.click();
      URL.revokeObjectURL(elink.href); // 释放URL 对象
      document.body.removeChild(elink);
    } catch (error) {
      console.log(error);
    }
  };

  const handleExport = (row) => {
    downFile(row);
  };

  const handleCat = (row) => {
    let power = handleType(row.operationCode);
    const token = gotUserToken() ? JSON.parse(gotUserToken()).token : '';
  };

  const handleType = (operationCode) => {
    let type = 0;
    switch (operationCode) {
      // 会议情况监测数据统计
      case 'MEETINGOPERATION':
        type = 1;
        break;
      // 月纯销售数据统计
      case 'MONTHLYSALESOPERATION':
        type = 2;
        break;
      // 统计目标覆盖率
      case 'TARGETOPERATION':
        type = 3;
        break;
      // 营销费用统计
      case 'EXPENSESOPERATION':
        type = 4;
        break;
      default:
        break;
    }
    return type;
  };

  const handleCallBack = () => {
    const value = Math.random();
    setIsUpData(value);
  };

  const columns = [
    {
      title: '报表ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: '大屏指标名称',
      dataIndex: 'screenIndicator',
      key: 'screenIndicator'
    },
    {
      title: '大屏指标说明',
      dataIndex: 'screenExplain',
      key: 'screenExplain'
    },
    {
      title: '最后修改者',
      dataIndex: 'userName',
      key: 'userName'
    },
    {
      title: '最后修改时间',
      dataIndex: 'lastUpdatetime',
      key: 'lastUpdatetime'
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Button size="small" onClick={() => handleExport(record)}>
            导出模板
          </Button>
          <UpFileBtn
            data={{ type: handleType(record.operationCode) }}
            action="/screen/file/upload"
            callback={handleCallBack}
          />
          <Button size="small" type="dashed" onClick={() => handleCat(record)}>
            预览
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div>
      <SearchFrom search={handleSearch} data={searchdata} />
      {ispower === 1 && (
        <div className="page">
          <div className="table-wrapper">
            <Table columns={columns} dataSource={data} bordered />
          </div>
        </div>
      )}

      {ispower === 2 && (
        <div className="power-wrapper">
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="抱歉，您暂无权限" />
        </div>
      )}

      <Modal
        title="数据预览"
        visible={visible}
        maskClosable={false}
        destroyOnClose={true}
        // forceRender={true}
        width="1200px"
        height="648px"
        footer={null}
        onCancel={() => setVisible(false)}
      >
        {/* <iframe
          title="eiframe"
          src={`https://test-bi.greenvalleypharma.com/web/monitor/#/index?power=${md5(
            power
          )}`}
          height="648"
          width="1152"
          name="eiframe"
        ></iframe> */}
      </Modal>
    </div>
  );
};

export default BIWeb;
