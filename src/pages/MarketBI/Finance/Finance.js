/* eslint-disable complexity */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef, useMemo } from 'react';
import './style.less';
import * as api from '@/api/user';
import moment from 'moment';
import { regnumber2 } from '@/libs/regular';
import { Table, Button, DatePicker, Space, Modal, message, Form, Input, Empty } from 'antd';

const FormModal = (props) => {
  const [form] = Form.useForm();
  useEffect(() => {
    const filltData = () => {
      if (props.isadd === 2) {
        form.setFieldsValue({
          date: props.defaultDate,
          // funds: props.data[0].total,
          salesBoxes: props.data[1].total,
          salesFunds: props.data[2].total,
          returnBoxes: props.data[3].total,
          returnFunds: props.data[4].total
        });
      } else if (props.isadd === 1) {
        form.setFieldsValue({
          date: props.defaultDate
        });
      }
    };
    filltData();
  }, [props, form]);

  const submitData = async (param) => {
    const params = {
      ...param
    };
    try {
      const result = await api.financeadd(params);
      if (result.resultCode === 0) {
        message.success('操作成功');
        props.reloadData();
        handleCancel();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        // console.log(values);
        const date = moment(values.date).format('YYYY-MM-DD');
        const param = {
          ...values,
          date: date,
          funds: 0
        };
        submitData(param);
      })
      .catch((error) => {
        console.log('errorInfo', error);
      });
  };

  const handleCancel = () => {
    form.resetFields();
    props.closeModal();
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
      (current && (current > moment().endOf('day') || current < moment().subtract(3, 'months'))) ||
      props.history.findIndex((item) => item.date === date) > -1
    );
  };

  const checkMoney = (_, value) => {
    // console.log(_)
    // console.log(value)
    if (/^-?([1-9]\d*)(\.\d+)?$|^0$|^-?0\.\d+/.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('输入不合法，请输入数字!'));
  };

  const checkNum = (_, value) => {
    if (/^-?([1-9]\d*)$|^0$/.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('输入不合法，请输入整数!'));
  };

  return (
    <Modal
      title={props.isadd === 1 ? '数据录入' : '数据编辑'}
      visible={props.visible}
      onOk={handleOk}
      width="600px"
      onCancel={handleCancel}
      maskClosable={false}
      destroyOnClose={true}
      forceRender={true}
    >
      <Form
        form={form}
        name="form-hooks"
        labelCol={{
          span: 6
        }}
        wrapperCol={{
          span: 24
        }}
      >
        <Form.Item label="选择日期" name="date" rules={[{ required: true, message: '请输入...' }]}>
          <DatePicker
            showToday={false}
            style={{ width: 414 }}
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
        {/* <Form.Item
          label="公司整体资金(元)"
          name="funds"
          rules={[{ required: true, validator: checkMoney }]}
        >
          <Input />
        </Form.Item> */}
        <Form.Item label="发货盒数(盒)" name="salesBoxes" rules={[{ required: true, validator: checkNum }]}>
          <Input />
        </Form.Item>
        <Form.Item label="发货金额(元)" name="salesFunds" rules={[{ required: true, validator: checkMoney }]}>
          <Input />
        </Form.Item>
        <Form.Item label="回款盒数(盒)" name="returnBoxes" rules={[{ required: true, validator: checkNum }]}>
          <Input />
        </Form.Item>
        <Form.Item label="回款金额(元)" name="returnFunds" rules={[{ required: true, validator: checkMoney }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const columns = [
  {
    title: '数据日期',
    dataIndex: 'date',
    key: 'date'
  },
  {
    title: '指标名称',
    dataIndex: 'description',
    key: 'description',
    render: (text, record, index) => {
      switch (record.name) {
        case 'FINANCE_SALES_BOX':
          return `${text}(盒)`;
        case 'FINANCE_RETURN_BOX':
          return `${text}(盒)`;
        default:
          return `${text}(元)`;
      }
    }
  },
  {
    title: '指标数据',
    dataIndex: 'total',
    key: 'total'
  }
];

const Finance = () => {
  const firstload = useRef(1);
  const isajax = useRef(0);
  const isClickPanelChange = useRef(1);
  const nowdate = moment();
  const nowqueryMonth = moment().format('YYYY-MM');
  const [data, setData] = useState([]);
  const [lastDate, setLastDate] = useState({});
  const [history, setHistory] = useState([]);
  const [loaddata, setLoadData] = useState(false);
  const [visible, setVisible] = useState(false);
  const [defaultDate, setDefaultDate] = useState('');
  const [queryMonth, setQueryMonth] = useState('');
  const [isadd, setIsAdd] = useState(0);
  const [ispower, setIsPower] = useState(1);

  // 1月以内数据
  useEffect(() => {
    let didCancel = false;
    isajax.current = 0;
    const gotData = async () => {
      try {
        const params = {
          queryMonth: queryMonth
        };
        const result = await api.financehistory(params);
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
            setIsPower(1);
            setLastDate({
              lastUpdateUser: data.lastUpdateUser ? data.lastUpdateUser : '',
              lastUpdateDate: data.lastUpdateDate ? data.lastUpdateDate : ''
            });
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
  }, [loaddata, queryMonth]);

  // 查询当前选择日期是否录入
  useEffect(() => {
    const searchData = () => {
      const date = moment(defaultDate).format('YYYY-MM-DD');
      const filterData = history.filter((item) => item.date === date);
      if (filterData.length === 1) {
        const funds = filterData[0].funds ? filterData[0].funds : {};
        const salesBox = filterData[0].salesBox ? filterData[0].salesBox : {};
        const salesFunds = filterData[0].salesFunds ? filterData[0].salesFunds : {};
        const returnBox = filterData[0].returnBox ? filterData[0].returnBox : {};
        const returnFunds = filterData[0].returnFunds ? filterData[0].returnFunds : {};

        let combinationData = [];
        // 财务资金
        combinationData[0] = {
          description: funds.description ? funds.description : '公司总资金',
          total: funds.totalFunds ? funds.totalFunds : 0,
          date: funds.date ? funds.date : '',
          name: funds.name ? funds.name : 'FINANCE_FUNDS'
        };
        // 销售盒数
        combinationData[1] = {
          description: salesBox.description ? salesBox.description : '发货盒数',
          total: salesBox.counts ? salesBox.counts : 0,
          date: salesBox.date ? salesBox.date : '',
          name: salesBox.name ? salesBox.name : 'FINANCE_SALES_BOX'
        };
        // 销售金额
        combinationData[2] = {
          description: salesFunds.description ? salesFunds.description : '发货金额',
          total: salesFunds.counts ? salesFunds.counts : 0,
          date: salesFunds.date ? salesFunds.date : '',
          name: salesFunds.name ? salesFunds.name : 'SALES_FUNDS_NAME'
        };
        // 回款盒数
        combinationData[3] = {
          description: returnBox.description ? returnBox.description : '回款盒数',
          total: returnBox.counts ? returnBox.counts : 0,
          date: returnBox.date ? returnBox.date : '',
          name: returnBox.name ? returnBox.name : 'FINANCE_RETURN_BOX'
        };
        // 回款金额
        combinationData[4] = {
          description: returnFunds.description ? returnFunds.description : '回款金额',
          total: returnFunds.counts ? returnFunds.counts : 0,
          date: returnFunds.date ? returnFunds.date : '',
          name: returnFunds.name ? returnFunds.name : 'RETURN_FUNDS_NAME'
        };
        combinationData.map((item, index) => {
          item.key = index + 1;
        });
        setData([...combinationData]);
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
    } else {
      setData([]);
    }
  }, [history, defaultDate]);

  const handleAdd = () => {
    setVisible(true);
    setIsAdd(1);
  };

  const handleEdit = () => {
    setVisible(true);
    setIsAdd(2);
  };

  const updateDate = (date) => {
    setDefaultDate(date);
    setQueryMonth(moment(date).format('YYYY-MM'));
  };

  const reloadData = () => {
    setLoadData(!loaddata);
  };

  const closeModal = () => {
    setVisible(false);
    setIsAdd(0);
  };

  const changeDate = (date, dateString) => {
    setDefaultDate(date);
    setQueryMonth(moment(date).format('YYYY-MM'));
  };

  const onPanelChange = (value, mode) => {
    isClickPanelChange.current = 2;
    console.log(moment().format('YYYY-MM'));
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
        <div>
          <div style={{ padding: '0 20px' }}>
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
        reloadData={reloadData}
        updateDate={updateDate}
        history={history}
        defaultDate={defaultDate}
      />
    </div>
  );
};

export default Finance;
