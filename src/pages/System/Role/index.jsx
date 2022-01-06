import React, { useEffect, useState } from 'react';
import './index.less';
import * as api from '@/api/system/index';
import { translateListToTree } from '@/libs';
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
import { Table, Button, Space, Modal, message, Form, Input, Radio, Tree, Checkbox, Tag } from 'antd';

const { confirm } = Modal;

const FormModal = (props) => {
  const [form] = Form.useForm();
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [isopen, setIsOpen] = useState(true);
  const [isall, setIsAll] = useState(false);
  const [isexpanded, setIsExpanded] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState([]);

  useEffect(() => {
    if (props.isstatus === 1) {
      form.setFieldsValue({
        status: '1'
      });
    } else if (props.isstatus === 2) {
      form.setFieldsValue({
        roleName: props.rowdata.roleName,
        roleCode: props.rowdata.roleCode,
        status: props.rowdata.status
      });
      const menuIds = props.rowdata.menuIds;
      // 全选判断
      const menuListAll = props.menulist.filter((val) => parseInt(val.status) === 1);
      if (menuIds.length > 0 && menuIds.length === menuListAll.length) {
        setIsAll(true);
      } else {
        setIsAll(false);
      }
      setCheckedKeys([...menuIds]);
    } else if (props.isstatus === 3) {
      form.setFieldsValue({
        roleName: props.rowdata.roleName,
        roleCode: props.rowdata.roleCode,
        status: props.rowdata.status
      });
      props.rowdata.menuIds && setCheckedKeys([...props.rowdata.menuIds]);
    }
  }, [props, form]);

  const handleOk = () => {
    if (props.isstatus === 3) {
      handleCancel();
    } else {
      form
        .validateFields()
        .then((values) => {
          if (checkedKeys.length < 0) {
            message.warning('请选择菜单权限');
            return;
          }
          const param = {
            ...values,
            menuIds: checkedKeys,
            id: props.isstatus === 2 ? props.rowdata.id : ''
          };
          submitData(param);
        })
        .catch((error) => {});
    }
  };

  const submitData = async (param) => {
    const params = {
      ...param
    };
    try {
      const result = await api.roleUpdate(params);
      if (result.resultCode === 0) {
        message.success('操作成功');
        handleCancel();
        props.handleReload();
      } else {
        message.error(result.errorMsg);
      }
    } catch (error) {}
  };

  const handleCancel = () => {
    form.resetFields();
    setCheckedKeys([]);
    setIsOpen(true);
    setIsAll(false);
    setIsExpanded(false);
    setExpandedKeys([]);
    props.handleClose();
  };

  const pushChild = (childList, target) => {
    childList.map((val) => {
      if (parseInt(val.status) === 1) {
        target.push(val.id);
      }
      if (val.children) {
        pushChild(val.children, target);
      }
    });
    return target;
  };

  const spliceChild = (childList, target) => {
    childList.map((val) => {
      const index = target.findIndex((item) => item === val.id);
      if (index > -1) {
        target.splice(index, 1);
        if (val.children) {
          spliceChild(val.children, target);
        }
      } else {
        if (val.children) {
          spliceChild(val.children, target);
        }
      }
    });
    return target;
  };

  const findByParentPushIds = (id, target) => {
    // 声明digui函数
    const forFn = function (arr, id) {
      // 遍历树
      arr.forEach((item) => {
        if (item.id === id) {
          // 查找到指定节点加入集合
          target.push(item.id);
          // 查找其父节点
          forFn(props.treeData, item.parentMenuId);
        } else {
          if (item.children) {
            // 向下查找到id
            forFn(item.children, id);
          }
        }
      });
    };
    // 调用函数
    forFn(props.treeData, id);
    // 返回结果
    return target;
  };

  const findByParentSpliceIds = (id, target) => {
    // 声明digui函数
    const forFn = function (arr, id) {
      // 遍历树
      arr.forEach((item) => {
        if (item.id === id) {
          // 查找到指定节点加入集合
          const index = target.findIndex((item) => item.id === id);
          target.splice(index, 1);
          // 查找其父节点
          forFn(props.treeData, item.parentMenuId);
        } else {
          if (item.children) {
            // 向下查找到id
            forFn(item.children, id);
          }
        }
      });
    };
    // 调用函数
    forFn(props.treeData, id);
    // 返回结果
    return target;
  };

  const onCheck = (checkedKeysValue, e) => {
    // console.log(checkedKeysValue);
    // console.log(e);

    let arr = [...checkedKeysValue.checked];
    let child = arr;
    let parent = [];

    if (e.checked) {
      if (e.node.children) {
        child = pushChild(e.node.children, arr);
        parent = findByParentPushIds(e.node.id, arr);
      } else {
        child = findByParentPushIds(e.node.id, arr);
      }
    } else {
      if (e.node.children) {
        child = spliceChild(e.node.children, arr);
      } else {
        const index = arr.findIndex((item) => item.id === e.node.id);
        if (index > -1) {
          arr.splice(index, 1);
          parent = arr;
        }
      }
    }

    const value = [...new Set([...child, ...parent])];

    // 全选判断
    const tempCheckedKeysItem = props.menulist.filter((val) => parseInt(val.status) === 1);
    if (value.length > 0 && value.length === tempCheckedKeysItem.length) {
      setIsAll(true);
    } else {
      setIsAll(false);
    }

    setCheckedKeys(value);
  };

  const onExpand = (expandedKeysValue) => {
    setExpandedKeys(expandedKeysValue);
  };

  const onOpenTree = (type, e) => {
    const istrue = e.target.checked;
    switch (type) {
      case 1:
        if (istrue) {
          const parentlist = props.menulist.filter((val) => val.menuType < 2);
          const tempExpandedKeys = parentlist.map((val) => val.id);
          setExpandedKeys(tempExpandedKeys);
        } else {
          setExpandedKeys([]);
        }
        setIsExpanded(istrue);
        break;
      case 2:
        if (istrue) {
          const tempCheckedKeysItem = props.menulist.filter((val) => parseInt(val.status) === 1);
          const tempCheckedKeys = tempCheckedKeysItem.map((val) => val.id);
          setCheckedKeys(tempCheckedKeys);
        } else {
          setCheckedKeys([]);
        }
        setIsAll(istrue);
        break;
      case 3:
        setIsOpen(!istrue);
        break;
      default:
    }
  };

  const checkCode = (_, value) => {
    if (/^[A-Z0-9]+(_)?(-)?[A-Z0-9]+$/.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('角色字符只允许输入字母大写，数字，下划线，中划线!'));
  };

  return (
    <Modal
      title={props.isstatus === 1 ? '数据新增' : props.isstatus === 2 ? '数据编辑' : '查看'}
      visible={props.visible}
      width="800px"
      onCancel={handleCancel}
      maskClosable={false}
      footer={
        props.isstatus === 3
          ? null
          : [
              <Button key="back" onClick={handleCancel}>
                取消
              </Button>,
              <Button key="submit" type="primary" onClick={handleOk}>
                确定
              </Button>
            ]
      }
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
      >
        <Form.Item label="角色名称" name="roleName" rules={[{ required: true }]}>
          <Input allowClear disabled={props.isstatus === 3} />
        </Form.Item>
        <Form.Item label="角色字符" rules={[{ required: true, validator: checkCode }]} name="roleCode">
          <Input allowClear disabled={props.isstatus === 2 || props.isstatus === 3 ? true : false} />
        </Form.Item>
        <Form.Item label="菜单权限">
          <div style={{ height: '30px', lineHeight: '30px' }}>
            <Checkbox onChange={(e) => onOpenTree(1, e)} checked={isexpanded}>
              展开/折叠
            </Checkbox>
            <Checkbox onChange={(e) => onOpenTree(2, e)} checked={isall} disabled={props.isstatus === 3}>
              全选/全不选
            </Checkbox>
            {/* <Checkbox onChange={(e) => onOpenTree(3, e)} checked={!isopen}>
              父子联动
            </Checkbox> */}
          </div>
          <div className="tree-border">
            <Tree
              checkable
              selectable={false}
              checkStrictly={isopen}
              onCheck={onCheck}
              checkedKeys={checkedKeys}
              onExpand={onExpand}
              expandedKeys={expandedKeys}
              treeData={props.treeData}
              titleRender={(nodeData) => {
                switch (nodeData.menuType) {
                  case 1:
                    return (
                      <>
                        <FolderOpenOutlined /> {nodeData.title}
                      </>
                    );
                  case 2:
                    return (
                      <>
                        <FileOutlined /> {nodeData.title}
                      </>
                    );
                  case 3:
                    return <Tag color="blue">{nodeData.title}</Tag>;
                  default:
                    return nodeData.title;
                }
              }}
            />
          </div>
        </Form.Item>
        <Form.Item label="角色状态" name="status" rules={[{ required: true }]}>
          <Radio.Group disabled={props.isstatus === 3}>
            <Radio value="1">正常</Radio>
            <Radio value="0">停用</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

const Role = () => {
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
      render: (val, record) => {
        switch (val) {
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
    },
    {
      title: '操作',
      key: 'operation',
      fixed: 'right',
      width: 120,
      render: (value, record) => (
        <>
          {parseInt(record.check) === 1 ? (
            <Space>
              <Button type="link" size="small" onClick={() => handleEdit(record)}>
                编辑
              </Button>
              <Button type="link" icon={<DeleteOutlined />} danger size="small" onClick={() => handleDelete(record)}>
                删除
              </Button>
            </Space>
          ) : parseInt(record.check) === 2 ? (
            <Space>
              <Button type="link" size="small" onClick={() => handleCat(record)}>
                查看
              </Button>
            </Space>
          ) : parseInt(record.check) === 3 ? (
            <Space>
              <Button type="link" size="small" onClick={() => handleCat(record)}>
                查看
              </Button>
              <Button type="link" icon={<DeleteOutlined />} danger size="small" onClick={() => handleDelete(record)}>
                删除
              </Button>
            </Space>
          ) : null}
        </>
      )
    }
  ];

  const [visible, setVisible] = useState(false);
  const [load, setLoad] = useState(false);
  const [lists, setLists] = useState([]);
  const [treedata, setTreeData] = useState([]);
  const [menulist, setMenulist] = useState([]);
  const [isstatus, setIsStatus] = useState(0);
  const [rowdata, setRowdata] = useState({});

  useEffect(() => {
    let didCancel = false;
    const gotData = async () => {
      try {
        const result = await api.roleList();
        if (!didCancel) {
          if (result.resultCode === 0) {
            const data = result.data;
            const listsdata = Array.isArray(data) ? data : [];
            const lists = listsdata.map((item) => {
              return {
                ...item,
                key: item.id
              };
            });
            setLists(lists);
          }
        }
      } catch (error) {}
    };
    gotData();
    return () => {
      didCancel = true;
    };
  }, [load]);

  const handleAdd = () => {
    gotMenuList();
    setVisible(true);
    setIsStatus(1);
  };

  const handleReload = () => {
    setLoad(!load);
  };

  const handleClose = () => {
    setVisible(false);
    setIsStatus(0);
  };

  const handleEdit = (value) => {
    gotMenuList();
    gotDetail(value);
  };

  const handleDelete = (value) => {
    confirm({
      title: '确定要删除吗?',
      icon: <ExclamationCircleOutlined />,
      content: '',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        deleteSubmit(value);
      },
      onCancel() {
        // Cancel
      }
    });
  };

  const gotDetail = async (value) => {
    try {
      const param = {
        roleId: value.id
      };
      const result = await api.roleDetail(param);
      if (result.resultCode === 0) {
        const data = result.data;
        const menuIds = data.menuDTOList.map((val) => val.id);

        setRowdata({
          ...data,
          menuIds: menuIds
        });

        setVisible(true);
        setIsStatus(2);
      }
    } catch (error) {}
  };

  const gotMenuList = async () => {
    try {
      const result = await api.menuList();
      if (result.resultCode === 0) {
        const data = result.data;
        const listsdata = Array.isArray(data) ? data : [];
        const lists = listsdata.map((item) => {
          return {
            ...item,
            key: item.id,
            title: item.menuName,
            value: item.id,
            disableCheckbox: parseInt(item.status) === 0
          };
        });
        const liststree = translateListToTree(lists, 'parentMenuId');
        setTreeData(liststree);
        setMenulist(listsdata);
      }
    } catch (error) {}
  };

  const deleteSubmit = async (value) => {
    try {
      const param = {
        roleId: value.id
      };
      const result = await api.roleDelete(param);
      if (result.resultCode === 0) {
        message.success('删除成功');
        setLoad(!load);
      } else {
        message.error(result.errorMsg);
      }
    } catch (error) {}
  };

  const handleCat = async (value) => {
    try {
      const param = {
        roleId: value.id
      };
      const result = await api.roleDetail(param);
      if (result.resultCode === 0) {
        const data = result.data;
        const listsdata = Array.isArray(data.menuDTOList) ? data.menuDTOList : [];
        const menuIds = listsdata.map((val) => val.id);
        const lists = listsdata.map((item) => {
          return {
            ...item,
            key: item.id,
            title: item.menuName,
            value: item.id,
            disableCheckbox: true
          };
        });
        const liststree = translateListToTree(lists, 'parentMenuId');
        setTreeData(liststree);
        setMenulist(listsdata);
        setRowdata({
          ...data,
          menuIds: menuIds
        });
        setVisible(true);
        setIsStatus(3);
      }
    } catch (error) {}
  };

  return (
    <>
      <div className="page">
        <div className="operation-wrapper">
          <Space>
            <Button type="primary" onClick={handleAdd} icon={<PlusOutlined />}>
              新增
            </Button>
          </Space>
        </div>
        <div className="table-wrapper">
          <Table columns={columns} dataSource={lists} bordered pagination={false} />
        </div>
      </div>
      <FormModal
        menulist={menulist}
        treeData={treedata}
        isstatus={isstatus}
        visible={visible}
        rowdata={rowdata}
        handleReload={handleReload}
        handleClose={handleClose}
      />
    </>
  );
};

export default Role;
