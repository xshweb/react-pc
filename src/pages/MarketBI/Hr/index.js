import React, { useEffect, useState, useRef } from 'react';
import './style.less';
import * as api from '@/api/user';
import moment from 'moment';
import { Table, Button, DatePicker, Space, Modal, message, Form, Input, Empty, Row, Col } from 'antd';

const FormModal = (props) => {
  const [form] = Form.useForm();
  /**
   * {
   *   current: 6
   *   date: "2021-03-11"
   *   description: "大区总监"
   *   id: 1
   *   name: "SALES_DIRECTOR"
   *   offers: 4
   *   target: 8
   * }
   */
  const [lists, setList] = useState([]);
  useEffect(() => {
    const initData = () => {
      if (props.isadd === 1) {
        let indicators = props.indicators.map((item) => {
          return {
            target: item.target,
            name: item.name,
            description: item.description,
            offers: '',
            current: ''
          };
        });
        setList([...indicators]);
      } else if (props.isadd === 2) {
        // 编辑
        const editlists = JSON.parse(JSON.stringify(props.data));
        setList([...editlists]);
      }
      form.setFieldsValue({
        date: props.defaultDate
      });
    };

    initData();
  }, [props, form]);

  const submitData = async (param) => {
    const params = {
      ...param
    };
    try {
      const result = await api.hradd(params);
      if (result.resultCode === 0) {
        message.success('操作成功');
        props.reloadData();
        props.closeModal();
      }
    } catch (error) {}
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        // console.log(values);
        const date = moment(values.date).format('YYYY-MM-DD');
        // 校验数据
        const numcheck = lists.findIndex((item) => {
          return checkNum(item.current) === false || checkNum(item.offers) === false || checkNum(item.target) === false;
        });
        const datecheck = lists.findIndex((item) => {
          return checkTotal(item) === false;
        });

        if (numcheck > -1) {
          message.warning('输入不合法，请输入正整数!');
          return;
        }
        if (datecheck > -1) {
          message.warning('在岗人数和Offer中人数之和不能大于目标人数');
          return;
        }

        const details = lists.map((item) => {
          return {
            ...item,
            date: date
          };
        });
        // console.log(details);
        const param = {
          details: details
        };
        submitData(param);
      })
      .catch((error) => {
        console.log('errorInfo', error);
      });
  };

  const handleCancel = () => {
    form.resetFields();
    setList([]);
    props.closeModal();
  };

  const checkNum = (value) => {
    if (/^([1-9]\d*|0)$/.test(value)) {
      return true;
    }
    return false;
  };

  const checkTotal = (item) => {
    const total = parseInt(item.current) + parseInt(item.offers);
    if (total > parseInt(item.target)) {
      return false;
    }
    return true;
  };

  const changeIptValue = (item, key, e) => {
    // console.log(value)
    // console.log(key)
    // console.log(e.target.value)
    const value = e.target.value;
    if (value === '' || /^([1-9]\d*|0)$/.test(value)) {
      lists.map((list) => {
        if (list.name === item.name) {
          list[key] = value;
        }
      });
      setList([...lists]);
    }
  };

  // 改变日期
  const changeDate = (date, dateString) => {
    props.updateDate(date);
  };

  const onPanelChange = (value, mode) => {
    if (value > moment().endOf('day')) {
      props.updateDate(props.defaultDate);
    } else if (value < moment().subtract(3, 'months')) {
      props.updateDate(props.defaultDate);
    } else {
      props.updateDate(value);
    }
  };

  const disabledDate = (current) => {
    // Can not select days before today and today
    const date = moment(current).format('YYYY-MM-DD');
    return (
      current &&
      (current > moment().endOf('day') ||
        current < moment().subtract(3, 'months') ||
        props.history.findIndex((item) => item.date === date) > -1)
    );
  };

  return (
    <Modal
      title={props.isadd === 1 ? '数据录入' : '数据编辑'}
      visible={props.visible}
      onOk={handleOk}
      onCancel={handleCancel}
      width="800px"
      maskClosable={false}
      destroyOnClose={true}
      forceRender={true}
    >
      <Form
        form={form}
        name="form-hooks"
        labelCol={{
          span: 8
        }}
        wrapperCol={{
          span: 16
        }}
      >
        <Row>
          <Col span={8}>
            <Form.Item label="选择日期" name="date" rules={[{ required: true, message: '请输入...' }]}>
              <DatePicker
                style={{ width: 167 }}
                disabledDate={disabledDate}
                disabled={props.isadd === 2}
                onChange={changeDate}
                onPanelChange={onPanelChange}
                dateRender={(current) => {
                  const style = {};
                  const value = moment(current).format('YYYY-MM-DD');
                  const filterData = props.history.filter((item) => item.date === value);
                  if (filterData.length > 0) {
                    style.border = '1px solid #ff4d4f';
                    style.borderRadius = '50%';
                  }
                  return (
                    <div className="ant-picker-cell-inner" style={style}>
                      {current.date()}
                    </div>
                  );
                }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={3}>
            <div className="hr-title">(单位/个)</div>
          </Col>
          <Col span={7}>
            <div className="hr-title">在岗人数</div>
          </Col>
          <Col span={7}>
            <div className="hr-title">Offer中</div>
          </Col>
          <Col span={7}>
            <div className="hr-title">目标人数</div>
          </Col>
        </Row>
        {lists.map((item, index) => (
          <div key={String(index)}>
            <Row gutter={16}>
              <Col span={3}>
                <div className="hr-name">{item.description}:</div>
              </Col>
              <Col span={7}>
                <Input value={item.current} onChange={(e) => changeIptValue(item, 'current', e)} />
              </Col>
              <Col span={7}>
                <Input value={item.offers} onChange={(e) => changeIptValue(item, 'offers', e)} />
              </Col>
              <Col span={7}>
                <Input value={item.target} disabled />
              </Col>
            </Row>
          </div>
        ))}
      </Form>
    </Modal>
  );
};

const Hr = () => {
  const columns = [
    {
      title: '数据日期',
      dataIndex: 'date',
      key: 'date'
    },
    {
      title: '岗位名称',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: '在岗人数',
      dataIndex: 'current',
      key: 'current'
    },
    {
      title: 'Offer中',
      dataIndex: 'offers',
      key: 'offers'
    },
    {
      title: '目标人数',
      dataIndex: 'target',
      key: 'target'
    }
  ];
  const firstload = useRef(1);
  const isajax = useRef(0);
  const isClickPanelChange = useRef(1);
  const nowdate = moment();
  const nowqueryMonth = moment().format('YYYY-MM');
  const [data, setData] = useState([]);
  const [history, setHistory] = useState([]);
  const [lastDate, setLastDate] = useState({});
  const [indicators, setIndicators] = useState([]);
  const [loaddata, setLoadData] = useState(false);
  const [visible, setVisible] = useState(false);
  const [defaultDate, setDefaultDate] = useState('');
  const [queryMonth, setQueryMonth] = useState('');
  const [isadd, setIsAdd] = useState(0);
  const [ispower, setIsPower] = useState(1);

  useEffect(() => {
    // 更新后的hr名称
    let didCancel = false;
    const gotHrName = async () => {
      try {
        const result = await api.hrindicator();
        if (!didCancel) {
          if (result.resultCode === 0) {
            const data = result.data;
            setIndicators([...data.indicators]);
            setIsPower(1);
          }
        }
      } catch (error) {
        error.status === 403 && setIsPower(2);
      }
    };
    gotHrName();
    return () => {
      didCancel = true;
    };
  }, []);

  useEffect(() => {
    // 1月以内数据
    let didCancel = false;
    isajax.current = 0;
    const gotData = async () => {
      try {
        const params = {
          queryMonth: queryMonth
        };
        const result = await api.hrhistory(params);
        if (!didCancel) {
          if (result.resultCode === 0) {
            const data = result.data;
            const historyList = Array.isArray(data.history) ? data.history : [];
            if (historyList.length > 0 && firstload.current === 1) {
              setDefaultDate(moment(historyList[historyList.length - 1].date, 'YYYY-MM-DD'));
            } else if (historyList.length === 0 && firstload.current === 1) {
              setDefaultDate(nowdate);
            }
            setHistory([...historyList]);
            firstload.current = 2;
            isajax.current++;
            setLastDate({
              lastUpdateUser: data.lastUpdateUser ? data.lastUpdateUser : '',
              lastUpdateDate: data.lastUpdateDate ? data.lastUpdateDate : ''
            });
            setIsPower(1);
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
    // eslint-disable-next-line
  }, [loaddata, queryMonth]);

  useEffect(() => {
    // 查询当前选择日期是否录入
    const searchData = () => {
      const date = moment(defaultDate).format('YYYY-MM-DD');
      const filterData = history.filter((item) => item.date === date);
      if (filterData.length === 1) {
        let infoList = filterData[0].infoList;
        infoList.map((item, index) => {
          item.key = String(index + 1);
        });
        setData([...infoList]);
        closeModal();
      } else {
        setData([]);
        if (defaultDate >= moment().subtract(3, 'months') && isClickPanelChange.current !== 2) {
          handleAdd();
        } else {
          closeModal();
        }
      }
      isClickPanelChange.current = 1;
    };
    if (isajax.current === 1 && isadd === 0 && defaultDate) {
      searchData();
    }
    // eslint-disable-next-line
  }, [history, defaultDate]);

  const handleAdd = () => {
    setVisible(true);
    setIsAdd(1);
  };
  const handleEdit = () => {
    setVisible(true);
    setIsAdd(2);
  };

  const closeModal = () => {
    setVisible(false);
    setIsAdd(0);
  };

  const updateDate = (date) => {
    setDefaultDate(date);
    setQueryMonth(moment(date).format('YYYY-MM'));
  };

  const reloadData = () => {
    setLoadData(!loaddata);
  };

  // 改变当前日期
  const changeDate = (date, dateString) => {
    setDefaultDate(date);
    setQueryMonth(moment(date).format('YYYY-MM'));
  };

  const onPanelChange = (value, mode) => {
    isClickPanelChange.current = 2;
    if (value > moment().endOf('day')) {
      setDefaultDate(moment());
      setQueryMonth(moment().format('YYYY-MM'));
    } else {
      setDefaultDate(value);
      setQueryMonth(moment(value).format('YYYY-MM'));
    }
  };

  // 只能选择1个月以内的
  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current > moment().endOf('day');
  };

  return (
    <div>
      {ispower === 1 && (
        <div className="page">
          <div className="operation-wrapper">
            <Space>
              <DatePicker
                style={{ width: 200 }}
                value={defaultDate}
                disabledDate={disabledDate}
                onChange={changeDate}
                allowClear={false}
                onPanelChange={onPanelChange}
                dateRender={(current) => {
                  const style = {};
                  const value = moment(current).format('YYYY-MM-DD');
                  const filterData = history.filter((item) => item.date === value);
                  if (current < moment().subtract(3, 'months')) {
                    style.color = 'rgba(0, 0, 0, 0.5)';
                  }
                  if (filterData.length > 0) {
                    style.border = '1px solid #ff4d4f';
                    style.borderRadius = '50%';
                  }
                  return (
                    <div className="ant-picker-cell-inner" style={style}>
                      {current.date()}
                    </div>
                  );
                }}
              />
              {defaultDate >= moment().subtract(3, 'months') && data.length > 0 && (
                <Button type="primary" onClick={handleEdit}>
                  编辑
                </Button>
              )}

              {defaultDate >= moment().subtract(3, 'months') && data.length === 0 && (
                <Button type="primary" onClick={handleAdd}>
                  新增
                </Button>
              )}
            </Space>
            <div style={{ marginTop: 20 }}>
              最后更新：{lastDate.lastUpdateUser} {lastDate.lastUpdateDate}
            </div>
          </div>
          <div className="table-wrapper">
            <Table columns={columns} dataSource={data} bordered pagination={false} />
          </div>
        </div>
      )}

      {ispower === 2 && (
        <div className="power-wrapper">
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="抱歉，您暂无权限" />
        </div>
      )}
      <FormModal
        closeModal={closeModal}
        visible={visible}
        data={data}
        isadd={isadd}
        indicators={indicators}
        reloadData={reloadData}
        updateDate={updateDate}
        history={history}
        defaultDate={defaultDate}
      />
    </div>
  );
};

export default Hr;
