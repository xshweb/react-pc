import './style.less';
import moment from 'moment';
import { DatePicker, Input, Select, Table } from 'antd';

const { TextArea } = Input;

const { Option } = Select;

const Editable = (props) => {
  const changeStatus = (type, record, val) => {
    props.callback(type, record, val);
  };

  const changeIpt = (type, record, e) => {
    props.callback(type, record, e.target.value);
  };

  const changeDate = (type, record, dateString) => {
    props.callback(type, record, dateString);
  };

  const columns = [
    {
      title: '主里程碑状态',
      dataIndex: 'status',
      key: 'status',
      render: (value, record) => {
        return (
          <Select placeholder="请选择" value={parseInt(value)} onChange={(val) => changeStatus('status', record, val)}>
            <Option value={0}>未开始</Option>
            <Option value={2}>进行中</Option>
            <Option value={1}>已完成</Option>
            <Option value={3}>未完成</Option>
            <Option value={4}>有风险</Option>
          </Select>
        );
      }
    },
    {
      title: '主里程碑名称',
      dataIndex: 'name',
      key: 'name',
      render: (value, record) => {
        return (
          <TextArea
            value={value}
            autoSize={{ minRows: 1, maxRows: 3 }}
            onChange={(e) => changeIpt('name', record, e)}
          />
        );
      }
    },
    {
      title: '截至时间',
      dataIndex: 'deadLine',
      key: 'deadLine',
      render: (value, record) => {
        return (
          <DatePicker
            allowClear={false}
            value={moment(value)}
            onChange={(date, dateString) => changeDate('deadLine', record, date, dateString)}
          />
        );
      }
    },
    {
      title: '责任部门',
      dataIndex: 'department',
      key: 'department',
      render: (value, record) => {
        return <Input value={value} onChange={(e) => changeIpt('department', record, e)} />;
      }
    }
  ];
  return <Table dataSource={props.list} columns={columns} bordered pagination={false} />;
};

export default Editable;
