import React, { useEffect, useState } from 'react';
import './index.less';
import * as api from '@/api/system/index';
import { translateListToTree } from '@/libs';
import SvgIcon from '@/components/SvgIcon';
import IconSelect from '@/components/IconSelect';
import { Table, Button, Space, Modal, message, Form, Input, Radio, TreeSelect, Tag, Popover } from 'antd';
import {
  SearchOutlined,
  SyncOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
  FolderOpenOutlined,
  FileOutlined,
  DeleteOutlined,
  EditOutlined,
  CloseCircleFilled
} from '@ant-design/icons';

const { confirm } = Modal;

const FormModal = (props) => {
  const [form] = Form.useForm();
  const [parentMenuType, setMenuType] = useState(0);
  const [checkMenuUrl, setCheckMenuUrl] = useState(false);
  const [visible, setVisible] = useState(false);
  const [menuIcon, setMenuIcon] = useState('');

  useEffect(() => {
    if (props.isstatus === 1) {
      form.setFieldsValue({
        linkStatus: 2,
        status: '1',
        menuStatus: 1,
        parentMenuId: '',
        menuType: 1
      });
      setMenuIcon('');
    } else if (props.isstatus === 2) {
      form.setFieldsValue({
        menuName: props.rowdata.menuName,
        linkStatus: props.rowdata.linkStatus,
        status: props.rowdata.status,
        menuStatus: props.rowdata.menuStatus,
        parentMenuId: props.rowdata.parentMenuId === 0 ? '' : props.rowdata.parentMenuId,
        menuType: props.rowdata.menuType,
        sequence: props.rowdata.sequence,
        menuUrl: props.rowdata.menuUrl
      });
      setMenuIcon(props.rowdata.menuIcon);
      if (props.rowdata.parentMenuId === 0) {
        setMenuType(0);
      } else {
        const filterItem = props.oldlists.filter((val) => val.id === props.rowdata.parentMenuId);
        if (filterItem.length > 0) {
          const menuType = filterItem[0].menuType;
          setMenuType(menuType);
        }
      }
    } else if (props.isstatus === 3) {
      setMenuType(props.rowdata.menuType);
      setMenuIcon('');
      if (props.rowdata.menuType === 2) {
        form.setFieldsValue({
          linkStatus: 2,
          status: '1',
          menuStatus: 1,
          parentMenuId: props.rowdata.id,
          menuType: 3
        });
      } else {
        form.setFieldsValue({
          linkStatus: 2,
          status: '1',
          menuStatus: 1,
          parentMenuId: props.rowdata.id,
          menuType: 1
        });
      }
    }
  }, [props, form]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const parentMenuId = values.parentMenuId ? values.parentMenuId : 0;
        if (props.isstatus === 2) {
          if (props.rowdata.id === parentMenuId) {
            message.warning('?????????????????????????????????????????????????????????');
            return;
          }
        }
        const param = {
          ...values,
          parentMenuId: parentMenuId,
          menuIcon: menuIcon,
          id: props.isstatus === 2 ? props.rowdata.id : ''
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
      const result = await api.menuUpdate(params);
      if (result.resultCode === 0) {
        message.success('????????????');
        handleCancel();
        props.handleReload();
      } else {
        message.error(result.errorMsg);
      }
    } catch (error) {}
  };

  const handleCancel = () => {
    form.resetFields();
    setMenuType(0);
    setCheckMenuUrl(false);
    props.handleClose();
  };

  const handleSelect = (value, node, extra) => {
    setMenuType(node.menuType);
    switch (node.menuType) {
      case 1:
        form.setFieldsValue({
          linkStatus: 2,
          menuType: 1
        });
        setCheckMenuUrl(false);
        break;
      case 2:
        form.setFieldsValue({
          linkStatus: 2,
          menuType: 3
        });
        setCheckMenuUrl(true);
        break;
      case 3:
        form.setFieldsValue({
          linkStatus: 2,
          menuType: ''
        });
        break;
      default:
    }
  };

  const handleChange = (value, label, extra) => {
    if (!value) {
      setMenuType(0);
      form.setFieldsValue({
        menuType: 1
      });
    }
  };

  const changeRadio = (e) => {
    const value = e.target.value;
    switch (value) {
      case 1:
        if (form.getFieldValue('linkStatus') === 2) {
          form.setFieldsValue({
            menuUrl: ''
          });
          setCheckMenuUrl(false);
        } else {
          setCheckMenuUrl(true);
        }
        break;
      case 2:
        setCheckMenuUrl(true);
        form.setFieldsValue({
          linkStatus: 2
        });
        break;
      case 3:
        setCheckMenuUrl(true);
        form.setFieldsValue({
          linkStatus: 2
        });
        break;
      default:
    }
  };

  const changeRadioLink = (e) => {
    const value = e.target.value;
    if (parentMenuType === 0) {
      if (form.getFieldValue('menuType') === 1) {
        if (value === 1) {
          setCheckMenuUrl(true);
        } else {
          setCheckMenuUrl(false);
        }
      }
    }
  };

  const callback = (value) => {
    setMenuIcon(value);
    setVisible(false);
  };

  const clickClear = () => {
    setMenuIcon('');
    setVisible(false);
  };

  return (
    <Modal
      title={props.isstatus === 1 ? '????????????' : '????????????'}
      visible={props.visible}
      onOk={handleOk}
      width="800px"
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
      >
        <Form.Item label="????????????" name="parentMenuId">
          <TreeSelect
            style={{ width: '100%' }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={props.treeData}
            treeDefaultExpandAll
            allowClear
            onSelect={handleSelect}
            onChange={handleChange}
            bordered
          />
        </Form.Item>
        <Form.Item label="????????????" name="menuType" rules={[{ required: true }]}>
          <Radio.Group onChange={changeRadio}>
            <Radio value={1} disabled={parentMenuType === 2 || parentMenuType === 3}>
              ??????
            </Radio>
            <Radio value={2} disabled={parentMenuType === 3 || parentMenuType === 2 || parentMenuType === 0}>
              ?????????
            </Radio>
            <Radio value={3} disabled={parentMenuType === 3 || parentMenuType === 1 || parentMenuType === 0}>
              ??????
            </Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="????????????" name="menuName" rules={[{ required: true }]}>
          <Input allowClear />
        </Form.Item>
        <Form.Item label="????????????">
          <Popover
            content={<IconSelect callback={callback} />}
            placement="bottom"
            trigger="click"
            visible={visible}
            onVisibleChange={() => setVisible(!visible)}
          >
            <Input
              readOnly="readonly"
              value={menuIcon}
              prefix={
                menuIcon ? <SvgIcon name={menuIcon} /> : <SearchOutlined style={{ color: 'rgba(0, 0, 0, 0.25)' }} />
              }
              suffix={
                <CloseCircleFilled
                  style={{ color: menuIcon ? 'rgba(0, 0, 0, 0.25)' : 'rgba(0, 0, 0, 0)' }}
                  onClick={clickClear}
                />
              }
              placeholder="???????????????"
            />
          </Popover>
        </Form.Item>
        <Form.Item label="????????????" name="menuUrl" rules={[{ required: checkMenuUrl }]}>
          <Input allowClear />
        </Form.Item>
        <Form.Item label="????????????" name="sequence" rules={[{ required: true }]}>
          <Input allowClear />
        </Form.Item>
        <Form.Item label="????????????" name="linkStatus" rules={[{ required: true }]}>
          <Radio.Group onChange={changeRadioLink}>
            <Radio value={2}>???</Radio>
            <Radio value={1} disabled={parentMenuType !== 0}>
              ???
            </Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="????????????" name="menuStatus" rules={[{ required: true }]}>
          <Radio.Group>
            <Radio value={1}>PC</Radio>
            <Radio value={2}>??????</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="????????????" name="status" rules={[{ required: true }]}>
          <Radio.Group>
            <Radio value="1">??????</Radio>
            <Radio value="0">??????</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

const Menu = () => {
  const columns = [
    {
      title: '????????????',
      dataIndex: 'menuName',
      key: 'menuName',
      width: 150
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60
    },
    {
      title: '??????',
      dataIndex: 'sequence',
      key: 'sequence',
      width: 60
    },
    {
      title: '????????????',
      dataIndex: 'menuUrl',
      key: 'menuUrl',
      width: 100,
      ellipsis: true
    },
    {
      title: '??????ICON',
      dataIndex: 'menuIcon',
      key: 'menuIcon',
      width: 80,
      ellipsis: true,
      render: (text, record) => {
        return text ? <SvgIcon name={text}/> : null
      }
    },
    {
      title: '????????????',
      dataIndex: 'menuType',
      key: 'menuType',
      width: 80,
      render: (text, record) => {
        switch (text) {
          case 1:
            return (
              <Tag color="blue" style={{ width: '51px', textAlign: 'center' }}>
                ??????
              </Tag>
            );
          case 2:
            return (
              <Tag color="green" style={{ width: '51px', textAlign: 'center' }}>
                ?????????
              </Tag>
            );
          case 3:
            return (
              <Tag color="volcano" style={{ width: '51px', textAlign: 'center' }}>
                ??????
              </Tag>
            );
          default:
        }
      }
    },
    {
      title: '????????????',
      dataIndex: 'menuStatus',
      key: 'menuStatus',
      width: 80,
      render: (text, record) => {
        switch (text) {
          case 1:
            return `pc`;
          case 2:
            return `??????`;
          default:
        }
      }
    },
    {
      title: '????????????',
      dataIndex: 'linkStatus',
      key: 'linkStatus',
      width: 80,
      render: (text, record) => {
        switch (text) {
          case 1:
            return `???`;
          case 2:
            return `???`;
          default:
        }
      }
    },
    {
      title: '????????????',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (text, record) => {
        switch (text) {
          case '1':
            return `??????`;
          case '0':
            return <span style={{ color: '#ccc' }}>??????</span>;
          default:
        }
      }
    },
    {
      title: '????????????',
      dataIndex: 'createDateFormart',
      key: 'createDateFormart',
      ellipsis: true
    },
    {
      title: '??????',
      key: 'operation',
      fixed: 'right',
      width: 200,
      render: (value, record) => (
        <>
          <Space>
            {record.menuType !== 3 && record.linkStatus === 2 && (
              <Button type="link" icon={<PlusOutlined />} size="small" onClick={() => handleAddRow(record)}>
                ??????
              </Button>
            )}
            <Button type="link" icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)}>
              ??????
            </Button>
            <Button type="link" icon={<DeleteOutlined />} danger size="small" onClick={() => handleDelete(record)}>
              ??????
            </Button>
          </Space>
        </>
      )
    }
  ];

  const [visible, setVisible] = useState(false);
  const [load, setLoad] = useState(false);
  const [lists, setLists] = useState([]);
  const [oldlists, setOldLists] = useState([]);
  const [isstatus, setIsStatus] = useState(0);
  const [rowdata, setRowdata] = useState({});

  useEffect(() => {
    let didCancel = false;
    const gotData = async () => {
      try {
        const result = await api.menuList();
        if (!didCancel) {
          if (result.resultCode === 0) {
            const data = result.data;
            const listsdata = Array.isArray(data) ? data : [];
            const lists = listsdata.map((item) => {
              return {
                ...item,
                key: item.id,
                title: item.menuName,
                value: item.id,
                disabled: parseInt(item.status) === 0
              };
            });
            let liststree = translateListToTree(lists, 'parentMenuId');
            console.log(listsdata)
            setLists(liststree);
            setOldLists(lists);
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
    setVisible(true);
    setIsStatus(1);
  };

  const handleReload = () => {
    setLoad(!load);
  };

  const handleClose = () => {
    setIsStatus(0);
    setVisible(false);
  };

  const handleEdit = (value) => {
    setVisible(true);
    setIsStatus(2);
    setRowdata(value);
  };

  const handleAddRow = (value) => {
    setVisible(true);
    setIsStatus(3);
    setRowdata(value);
  };

  const handleDelete = (value) => {
    confirm({
      title: '???????????????????',
      icon: <ExclamationCircleOutlined />,
      content: '',
      okText: '??????',
      okType: 'danger',
      cancelText: '??????',
      onOk() {
        deleteSubmit(value);
      },
      onCancel() {
        // Cancel
      }
    });
  };

  const deleteSubmit = async (value) => {
    try {
      const param = {
        menuId: value.id
      };
      const result = await api.menuDelete(param);
      if (result.resultCode === 0) {
        message.success('????????????');
        setLoad(!load);
      } else {
        message.error(result.errorMsg);
      }
    } catch (error) {}
  };

  return (
    <>
      <div className="page">
        <div className="operation-wrapper">
          <Space>
            <Button type="primary" onClick={handleAdd} icon={<PlusOutlined />}>
              ??????
            </Button>
          </Space>
        </div>
        <div className="table-wrapper">
          <Table columns={columns} dataSource={lists} pagination={false} />
        </div>
      </div>
      <FormModal
        treeData={lists}
        oldlists={oldlists}
        isstatus={isstatus}
        visible={visible}
        rowdata={rowdata}
        handleReload={handleReload}
        handleClose={handleClose}
      />
    </>
  );
};

export default Menu;
