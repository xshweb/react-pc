import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import './index.less';
import * as api from '@/api/system/index';
import {
  SearchOutlined,
  SyncOutlined,
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
  Descriptions,
  Tag
} from 'antd';

const UserRole = () => {
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
      key: 'roleName'
    },
    {
      title: '角色字符',
      dataIndex: 'roleCode',
      key: 'roleCode'
    },
    {
      title: '角色状态',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => {
        switch (text) {
          case '1':
            return `正常`;
          case '0':
            return <span style={{ color: '#ccc' }}>停用</span>;
          default:
        }
      }
    },
    {
      title: '创建人',
      dataIndex: 'createUserName',
      key: 'createUserName'
    },
    {
      title: '创建时间',
      dataIndex: 'createDateFormart',
      key: 'createDateFormart'
    }
  ];

  let history = useHistory();
  let urlparams = useParams();

  const [load, setLoad] = useState(false);
  const [lists, setLists] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    let didCancel = false;
    const gotData = async () => {
      const params = {
        userId: urlparams?.userId
      };
      try {
        const result = await api.gotUserRole(params);
        if (!didCancel) {
          if (result.resultCode === 0) {
            const data = Array.isArray(result.data) ? result.data : [];
            const lists = data.map((item) => {
              return {
                ...item,
                key: item.id,
                disabled: parseInt(item.operationStatus) === 0 || parseInt(item.status) === 0
              };
            });
            lists.sort((a, b) => {
              return parseInt(b.operationStatus) - parseInt(a.operationStatus);
            });
            const filterLists = lists.filter((val) => {
              return parseInt(val.operationStatus) === 1 || parseInt(val.operationStatus) === 0;
            });
            const selectedId = filterLists.map((val) => val.id);
            setLists(lists);
            setSelectedKeys(selectedId);
          }
        }
      } catch (error) {}
    };
    if (urlparams?.userId) {
      gotData();
    }
    return () => {
      didCancel = true;
    };
  }, [urlparams?.userId, load]);

  useEffect(() => {
    let didCancel = false;
    const gotInfo = async () => {
      const params = {
        userId: urlparams?.userId
      };
      try {
        const result = await api.userDetail(params);
        if (!didCancel) {
          if (result.resultCode === 0) {
            setUserInfo(result.data);
          }
        }
      } catch (error) {}
    };
    if (urlparams?.userId) {
      gotInfo();
    }
    return () => {
      didCancel = true;
    };
  }, [urlparams?.userId]);

  const rowSelection = {
    selectedRowKeys: selectedKeys,
    onChange: (selectedRowKeys) => {
      setSelectedKeys([...selectedRowKeys]);
    },
    getCheckboxProps: (record) => ({
      // operationStatus "0" 已选中无权限修改 "1" 已选中 "2"未选中
      disabled: record.disabled
    })
  };

  const handleOk = () => {
    if (!urlparams?.userId) {
      message.warning('当前页面错误，请关闭重新打开');
      return;
    }
    const roleIds = selectedKeys.reduce((pre, val) => {
      const filterItems = lists.filter((item) => item.id === val);
      if (filterItems.length > 0) {
        if (parseInt(filterItems[0].operationStatus) !== 0 && parseInt(filterItems[0].status) === 1) {
          pre.push(val);
        }
      }
      return pre;
    }, []);
    // console.log(selectedKeys)
    // console.log(roleIds)
    const param = {
      roleIds: roleIds,
      userId: parseInt(urlparams?.userId)
    };
    submitData(param);
  };

  const submitData = async (param) => {
    const params = {
      ...param
    };
    try {
      const result = await api.userRoleUpdate(params);
      if (result.resultCode === 0) {
        message.success('操作成功');
        setLoad(!load);
      } else {
        message.error(result.errorMsg);
      }
    } catch (error) {}
  };

  const handleCancle = () => {
    history.replace(`/system/user`);
  };

  return (
    <>
      <div className="page">
        <div className="page-padding-bottom">
          <Descriptions title="用户信息">
            <Descriptions.Item label="用户编号">{userInfo.userid}</Descriptions.Item>
            <Descriptions.Item label="姓名">{userInfo.name}</Descriptions.Item>
            <Descriptions.Item label="部门">{userInfo.departmentName}</Descriptions.Item>
          </Descriptions>
        </div>
        <div className="table-wrapper">
          <div className="table-title">角色信息</div>
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={lists}
            bordered
            pagination={false}
            scroll={{ y: 400 }}
          />
        </div>
        <div className="btns-box">
          <Space>
            <Button type="primary" onClick={handleOk}>
              提交
            </Button>
            <Button onClick={handleCancle}>返回</Button>
          </Space>
        </div>
      </div>
    </>
  );
};

export default UserRole;
