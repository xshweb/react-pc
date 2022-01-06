import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import './index.less';
import * as api from '@/api/system/index';
import { SearchOutlined, SyncOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
import { Table, Button, Modal, message, Form, Input, Select, Pagination, Space, Row, Col, Tree } from 'antd';

const { Option } = Select;

const FormModal = (props) => {
  const [form] = Form.useForm();
  useEffect(() => {
    if (props.isstatus === 2) {
      form.setFieldsValue({
        roleIds: props.rowdata.roleIds
      });
    }
  }, [props, form]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const param = {
          ...values,
          userId: props.isstatus === 2 ? props.rowdata.id : ''
        };
        submitData(param);
      })
      .catch((error) => {});
  };

  const submitData = async (param) => {
    const params = {
      ...param
    };
    try {
      const result = await api.userRoleUpdate(params);
      if (result.resultCode === 0) {
        message.success('操作成功');
        handleCancel();
      } else {
        message.error(result.errorMsg);
      }
    } catch (error) {}
  };

  const handleCancel = () => {
    form.resetFields();
    props.handleClose();
  };

  return (
    <Modal
      title={props.isstatus === 1 ? '数据新增' : '角色设置'}
      visible={props.visible}
      onOk={handleOk}
      width="600px"
      onCancel={handleCancel}
      maskClosable={false}
    >
      <Form
        name="form"
        form={form}
        labelCol={{
          span: 4
        }}
        wrapperCol={{
          span: 18
        }}
        style={{ height: '300px' }}
      >
        <Form.Item label="角色选择" name="roleIds" rules={[{ required: true }]}>
          <Select mode="multiple" placeholder="请选择">
            {props.rolelist.map((val) => (
              <Option key={val.id} value={val.id} disabled={parseInt(val.status) === 0}>
                {val.roleName}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export function translateListToTree(data, parentIdName, idName = 'id') {
  // 建立 ID-数组索引映射关系
  const idMapping = data.reduce((acc, el, i) => {
    acc[el[idName]] = i;
    return acc;
  }, {});
  let tree = [];
  data.forEach((el) => {
    // 判断根节点
    if (el[parentIdName] === '0') {
      tree.push(el);
      return;
    }
    // 用映射表找到父元素
    const parentEl = data[idMapping[el[parentIdName]]];
    // 把当前元素添加到父元素的`children`数组中
    if (parentEl) {
      parentEl.children = [...(parentEl.children || []), el];
    } else {
      tree.push(el);
    }
  });
  return tree;
}

const SearchFrom = (props) => {
  const [form] = Form.useForm();
  const onFinish = (values) => {
    const param = {};
    Object.keys(values).forEach((key) => {
      const element = values[key];
      param[key] = element ? element : '';
    });
    props.handleSearch(param);
  };

  const onReset = () => {
    form.resetFields();
    let values = form.getFieldsValue();
    const param = {};
    Object.keys(values).forEach((key) => {
      param[key] = '';
    });
    props.handleSearch(param);
  };

  return (
    <div className="searchform-wrapper">
      <Form form={form} name="searchform" onFinish={onFinish}>
        <Space>
          <Form.Item name="jobNum" label="用户编号">
            <Input allowClear />
          </Form.Item>
          <Form.Item name="userName" label="用户姓名">
            <Input allowClear />
          </Form.Item>
          <Form.Item name="mobile" label="手机号">
            <Input allowClear />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                查询
              </Button>
              <Button onClick={onReset} icon={<SyncOutlined />}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Space>
      </Form>
    </div>
  );
};

const User = () => {
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: '用户编号',
      dataIndex: 'userid',
      key: 'userid'
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '部门',
      dataIndex: 'departmentName',
      key: 'departmentName'
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      key: 'mobile'
    },
    {
      title: '任职状态',
      dataIndex: 'empStatus',
      key: 'empStatus',
      render: (val, record) => (
        <>
          {parseInt(val) === 1
            ? '待入职'
            : parseInt(val) === 2
            ? '试用'
            : parseInt(val) === 3
            ? '在职'
            : parseInt(val) === 4
            ? '调出'
            : parseInt(val) === 5
            ? '待调入'
            : parseInt(val) === 6
            ? '退休'
            : parseInt(val) === 8
            ? '离职'
            : parseInt(val) === 12
            ? '非正式'
            : ''}
        </>
      )
    },
    {
      title: '入职状态',
      dataIndex: 'entryStatus',
      key: 'entryStatus',
      render: (val, record) => (
        <>
          {parseInt(val) === 0
            ? '正常'
            : parseInt(val) === 1
            ? '取消'
            : parseInt(val) === 3
            ? '延期'
            : ''}
        </>
      )
    },
    {
      title: '公司',
      dataIndex: 'companyName',
      key: 'companyName'
    },
    {
      title: '操作',
      key: 'operation',
      fixed: 'right',
      width: 90,
      render: (val, record) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleEdit(record)}>
            分配角色
          </Button>
        </Space>
      )
    }
  ];
  let history = useHistory();
  const [visible, setVisible] = useState(false);
  const [load, setLoad] = useState(false);
  const [lists, setLists] = useState([]);
  const [rolelist, setRoleList] = useState([]);
  const [isstatus, setIsStatus] = useState(0);
  const [rowdata, setRowdata] = useState({});
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchParam, setSearchParam] = useState([]);
  const [treelists, setTreeLists] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]);

  // 组织结构
  useEffect(() => {
    let didCancel = false;
    const gotData = async () => {
      try {
        const result = await api.depList();
        if (!didCancel) {
          if (result.resultCode === 0) {
            const data = result.data;
            const lists = Array.isArray(data) ? data : [];
            const listsdata = lists
              .filter((val) => val.parentCode)
              .map((item) => {
                return {
                  ...item,
                  key: item.deptCode,
                  title: item.deptName,
                  value: item.deptCode
                };
              });
            const treelists = translateListToTree(listsdata, 'parentCode', 'deptCode');
            const filterExpandedKeys = listsdata.filter((val) => parseInt(val.parentlevel) <= 3);
            const expandedKeysList = filterExpandedKeys.map((val) => val.deptCode);
            const filterSelectedKeys = listsdata.filter((val) => val.parentCode === '0');
            setSelectedKeys([filterSelectedKeys[0].deptCode]);
            setExpandedKeys(expandedKeysList);
            setTreeLists([...treelists]);
          }
        }
      } catch (error) {}
    };
    gotData();
    return () => {
      didCancel = true;
    };
  }, []);

  useEffect(() => {
    let didCancel = false;
    const params = {
      pageIndex: page,
      pageSize: pageSize,
      departmentCode: selectedKeys[0],
      jobNum: searchParam.jobNum ? searchParam.jobNum : '',
      mobile: searchParam.mobile ? searchParam.mobile : '',
      userName: searchParam.userName ? searchParam.userName : ''
    };
    const gotData = async () => {
      try {
        const result = await api.userList(params);
        if (!didCancel) {
          if (result.resultCode === 0) {
            const data = result.data;
            const listsdata = Array.isArray(data.list) ? data.list : [];
            const lists = listsdata.map((item) => {
              return {
                ...item,
                key: item.id
              };
            });
            setTotal(data.total);
            setLists(lists);
          }
        }
      } catch (error) {}
    };
    if (selectedKeys.length > 0) {
      gotData();
    }
    return () => {
      didCancel = false;
    };
  }, [load, page, pageSize, searchParam, selectedKeys]);

  const changePage = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const handleSearch = (val) => {
    setPage(1);
    setPageSize(20);
    setSearchParam({ ...val });
  };

  const handleReload = () => {
    setLoad(!load);
  };

  const handleClose = () => {
    setVisible(false);
    setIsStatus(0);
  };

  const handleEdit = (value) => {
    // gotRoleList();
    // gotUserRole(value);
    history.replace(`/system/userrole/${value.id}`);
  };

  // 用户拥有的角色
  const gotUserRole = async (value) => {
    try {
      const param = {
        userId: value.id
      };
      const result = await api.gotUserRole(param);
      if (result.resultCode === 0) {
        const data = Array.isArray(result.data) ? result.data : [];
        const roleIds = data.map((val) => val.id);
        setRowdata({
          ...value,
          roleIds: roleIds
        });
        setVisible(true);
        setIsStatus(2);
      }
    } catch (error) {}
  };

  const onSelect = (selectedKeysValue, info) => {
    setSelectedKeys(selectedKeysValue);
  };

  // 角色
  const gotRoleList = async () => {
    try {
      const result = await api.roleListAll();
      if (result.resultCode === 0) {
        const data = result.data;
        const lists = Array.isArray(data) ? data : [];
        setRoleList(lists);
      }
    } catch (error) {}
  };

  return (
    <>
      <div className="page">
        <Row>
          <Col span={6}>
            {treelists.length ? (
              <div className="tree-wrapper">
                <Tree
                  showLine
                  treeData={treelists}
                  defaultExpandedKeys={expandedKeys}
                  selectedKeys={selectedKeys}
                  onSelect={onSelect}
                  height={1000}
                />
              </div>
            ) : null}
          </Col>
          <Col span={18}>
            <SearchFrom handleSearch={handleSearch} />
            <div className="table-wrapper">
              <Table columns={columns} dataSource={lists} bordered pagination={false} />
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
          </Col>
        </Row>
      </div>
      <FormModal
        rolelist={rolelist}
        isstatus={isstatus}
        visible={visible}
        rowdata={rowdata}
        handleReload={handleReload}
        handleClose={handleClose}
      />
    </>
  );
};

export default User;
