import React, { useEffect, useState, useMemo } from 'react';
import Editable from '@/components/Editable';
import './style.less';
import * as api from '@/api/user';
import moment from 'moment';
import { Badge, Button, DatePicker, Modal, message, Form, Input, Empty, Select, Checkbox, Table } from 'antd';

const { TextArea } = Input;

const FormModal = (props) => {
  const [form] = Form.useForm();
  const [milestones, setMilestones] = useState([]);

  useEffect(() => {
    const initData = () => {
      form.setFieldsValue({
        deadLine: moment(props.data.deadLine),
        responsibleDep: props.data.responsibleDep,
        name: props.data.name,
        target: props.data.target,
        sequence: props.data.sequence
      });
      if (Array.isArray(props.data.milestones)) {
        const milestones = props.data.milestones.map((item) => {
          return {
            ...item,
            key: item.id
          };
        });
        setMilestones([...milestones]);
      }
    };
    initData();
  }, [props, form]);

  const submitUpdateData = async (param) => {
    const params = {
      id: props.data.id,
      ...param
    };
    try {
      const result = await api.projectupdate(params);
      if (result.resultCode === 0) {
        message.success('更新成功');
        props.closeModal();
        props.reloadData();
      }
    } catch (error) {}
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const deadLine = moment(values.deadLine).format('YYYY-MM-DD');
        const param = {
          ...values,
          deadLine: deadLine,
          milestones: milestones
        };
        // console.log(param);
        submitUpdateData(param);
      })
      .catch((error) => {
        console.log('errorInfo', error);
      });
  };

  const handleCancel = () => {
    form.resetFields();
    props.closeModal();
  };

  const changeTable = (type, record, value) => {
    const newMilestones = milestones.reduce((prev, cur) => {
      let newcur = {
        ...cur
      };
      if (record.id === cur.id) {
        newcur = {
          ...cur,
          [type]: value
        };
      }
      prev.push(newcur);
      return prev;
    }, []);
    setMilestones([...newMilestones]);
  };

  return (
    <Modal
      title="项目详情"
      visible={props.visible}
      onOk={handleOk}
      onCancel={handleCancel}
      destroyOnClose={true}
      forceRender={true}
      width="1000px"
      okText="保存"
    >
      <Form
        form={form}
        name="form-hooks"
        labelCol={{
          span: 2
        }}
        wrapperCol={{
          span: 24
        }}
      >
        <Form.Item label="项目名称" name="name" rules={[{ required: true, message: '请输入...' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="显示顺序" name="sequence" rules={[{ required: true, message: '请输入...' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="最终目标" name="target" rules={[{ required: true, message: '请输入...' }]}>
          <TextArea autoSize={{ minRows: 2, maxRows: 4 }} />
        </Form.Item>
        <Form.Item label="主责部门" name="responsibleDep" rules={[{ required: true, message: '请输入...' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="截止时间" name="deadLine" rules={[{ required: true, message: '请输入...' }]}>
          <DatePicker style={{ width: 872 }} />
        </Form.Item>
      </Form>

      <Editable list={milestones} callback={changeTable} />
    </Modal>
  );
};

const Project = () => {
  const [list, setList] = useState([]);
  const [rowdata, setRowData] = useState({});
  const [visible, setVisible] = useState(false);
  const [ispower, setIsPower] = useState(1);
  const [loaddata, setLoadData] = useState(false);
  const [lastDate, setLastDate] = useState({});
  useEffect(() => {
    let didCancel = false;
    const gotData = async () => {
      try {
        const result = await api.projectlist();
        if (!didCancel) {
          if (result.resultCode === 0) {
            const data = result.data;
            const projects = Array.isArray(data.projects) ? data.projects : [];
            const list = projects.map((item, index) => {
              return {
                ...item,
                key: String(index)
              };
            });
            setList([...list]);
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
  }, [loaddata]);

  const closeModal = () => {
    setVisible(false);
  };

  const reloadData = () => {
    setLoadData(!loaddata);
  };

  const changeCheckbox = async (value) => {
    const isOnIndex = parseInt(value.isOnIndex) === 1 ? 0 : 1;
    const params = {
      id: value.id,
      isOnIndex: isOnIndex
    };
    try {
      const result = await api.projectop(params);
      if (result.resultCode === 0) {
        message.success('操作成功');
        reloadData();
      }
    } catch (error) {}
  };

  const handleEdit = (value) => {
    setVisible(true);
    setRowData(value);
  };

  const columns = [
    {
      title: '是否置顶',
      dataIndex: 'isOnIndex',
      key: 'isOnIndex',
      render: (text, record) => (
        <Button type="link" size="small">
          <Checkbox onChange={() => changeCheckbox(record)} checked={parseInt(text) === 1 ? true : false}>
            {parseInt(text) === 1 ? '是' : '否'}
          </Checkbox>
        </Button>
      )
    },
    {
      title: '项目名称',
      dataIndex: 'name',
      key: 'name',
      width: '200px'
    },
    {
      title: '显示顺序',
      dataIndex: 'sequence',
      key: 'sequence'
    },
    {
      title: '最终目标',
      dataIndex: 'target',
      key: 'target',
      width: '200px'
    },
    {
      title: '主责部门',
      dataIndex: 'responsibleDep',
      key: 'responsibleDep'
    },
    {
      title: '截至日期',
      dataIndex: 'deadLine',
      key: 'deadLine'
    },
    {
      title: '项目状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <div>
          <Badge status={parseInt(status) === 0 ? 'processing' : parseInt(status) === 1 ? 'success' : 'error'} />
          {parseInt(status) === 0 ? '未开始' : parseInt(status) === 1 ? '正常' : parseInt(status) === 2 ? '未完成' : ''}
        </div>
      )
    },
    {
      title: '最后更新',
      dataIndex: 'modifyDate',
      key: 'modifyDate'
    },
    {
      title: '操作',
      key: 'operation',
      fixed: 'right',
      width: 100,
      render: (value, record) => (
        <Button type="link" onClick={() => handleEdit(record)}>
          详情
        </Button>
      )
    }
  ];

  return (
    <div>
      {ispower === 1 && (
        <div className="page">
          <div style={{ padding: '40px 40px 0' }}>
            最后更新：{lastDate.lastUpdateUser} {lastDate.lastUpdateDate}
          </div>
          <div className="project-wrapper">
            <Table dataSource={list} columns={columns} bordered pagination={false} />
          </div>
        </div>
      )}
      {ispower === 2 && (
        <div className="power-wrapper">
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="抱歉，您暂无权限" />
        </div>
      )}
      <FormModal closeModal={closeModal} reloadData={reloadData} visible={visible} data={rowdata} />
    </div>
  );
};

export default Project;
