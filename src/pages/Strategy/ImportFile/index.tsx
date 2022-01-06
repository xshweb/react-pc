import React, { useEffect, useState } from 'react';
import './index.less';
import * as api from '@/api/strategy';
import ReadFileBtn from '@/components/ReadFileBtn';
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
import { Tag, Table, Button, Modal, message, Form, Input, Select, Pagination, Space, Row, Col, Tree, Radio } from 'antd';
import { ColumnsType } from 'antd/lib/table';

const { confirm } = Modal;

interface ISearchParams {
  plateCode?: string,
  name?: string
}

const FormModal = (props: any) => {
  const [form] = Form.useForm();
  const [classifyList, setClassifyList] = useState<any[]>([]);
  const [PDFfile, setPDFFile] = useState<any>(null);
  useEffect(() => {
    if (props.isstatus === 1) {
      form.setFieldsValue({
        show: 1
      });
    } else if (props.isstatus === 2) {
      const plateCode = props.rowdata.plateCode
      // 获取分类列表
      plateCode && getClassifyList(plateCode)
      const classificationList = Array.isArray(props.rowdata.classificationList) ? props.rowdata.classificationList : [];
      const classifyParams: any = {}
      classificationList.map((val: any, index: string) => {
        const key = `classifyCode${index}`
        classifyParams[key] = val.code
      })
      form.setFieldsValue({
        name: props.rowdata.name,
        plateCode: plateCode,
        keywords: props.rowdata.keywords,
        show: props.rowdata.show,
        ...classifyParams
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props, form]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        let classificationCode: string[] = []
        Object.keys(values).forEach((key) => {
          if (/classifyCode/i.test(key)) {
            classificationCode.push(values[key])
          }
        })
        const param = {
          name: values.name,
          plateCode: values.plateCode,
          keywords: values.keywords,
          show: values.show,
          classificationCode: classificationCode
        };
        if (props.isstatus === 2) {
          materialUpdate(param);
        } else {
          submitUploadData(param)
        }
      })
      .catch((error) => { });
  };

  const materialUpdate = async (param: any) => {
    const params = {
      ...param,
      id: props.rowdata.id
    };
    try {
      const result = await api.materialUpdate(params);
      if (result.resultCode === 0) {
        message.success({ content: '更新成功', duration: 1 })
        handleCancel();
        setTimeout(() => {
          props.handleReload();
        }, 2000);
      } else {
        message.error(result.errorMsg);
      }
    } catch (error) { }
  };

  const submitUploadData = async (param: any) => {
    if (!PDFfile) {
      message.warning('您还没有导入材料，请导入！！！');
      return
    }
    const formData = new FormData();
    Object.keys(param).forEach(key => {
      formData.append(key, param[key]);
    });
    formData.append('file', PDFfile);
    try {
      const result = await api.materialUpload(formData);
      if (result.resultCode === 0) {
        message.success({ content: '导入成功', duration: 1 })
        handleCancel();
        setTimeout(() => {
          props.handleReload();
        }, 2000);
      } else {
        message.error(result.errorMsg);
      }
    } catch (error) { }
  };


  const handleCancel = () => {
    form.resetFields();
    setClassifyList([])
    setPDFFile(null)
    props.handleClose();
  };

  const changePlate = (value?: string) => {
    if (value) {
      getClassifyList(value, 2)
    } else {
      setClassifyList([])
    }
  }

  const getClassifyList = async (value: string, type: number = 1) => {
    const param = {
      plateCode: value
    }
    try {
      const result = await api.classifyList(param);
      if (result.resultCode === 0) {
        const data = result.data;
        let lists = Array.isArray(data) ? data : [];
        lists.map((item, index) => {
          if (Array.isArray(item) && item.length > 1) {
            if (item[0].type === 3) {
              item.unshift({
                calssName: item[0].calssName,
                code: "BX",
                id: 1000,
                name: "不限",
                parentCode: null,
                status: "1",
                type: 3,
              })
            }
          }
        })
        // 清空赋值
        if (lists.length > 0 && type === 2) {
          const classifyParams: any = {}
          lists.map((item, index) => {
            classifyParams[`classifyCode${index}`] = ''
          })
          form.setFieldsValue({
            ...classifyParams
          });
        } else if (lists.length > 0 && type === 1) {
          /*
          const classificationList = Array.isArray(props.rowdata.classificationList) ? props.rowdata.classificationList : [];
          const classifyParams: any = {}
          classificationList.map((val: any, index: string) => {
            const key = `classifyCode${index}`
            classifyParams[key] = val.code
          })
          form.setFieldsValue({
            ...classifyParams
          });
          */
        }
        setClassifyList(lists)
      }
    } catch (error) { }
  }

  const fileCallBack = (value: any) => {
    setPDFFile(value)
  }

  return (
    <Modal
      title={props.isstatus === 1 ? '数据新增' : '数据编辑'}
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
        <Form.Item label="材料标题" name="name" rules={[{ required: true }]}>
          <Input allowClear />
        </Form.Item>
        <Form.Item label="所属版块" name="plateCode" rules={[{ required: true }]}>
          <Select allowClear onChange={changePlate}>
            {
              props.plateList.map((val: any) =>
                <Select.Option value={val.code} key={val.id}>
                  {val.name}
                </Select.Option>)
            }
          </Select>
        </Form.Item>
        {
          classifyList.length ? (classifyList.map((list, index) => (
            <Form.Item label={list[0].type === 2 ? '所属分类' : list[0].type === 3 ? '标签分类' : ''} key={index} name={`classifyCode${index}`} rules={[{ required: true}]}>
              <Select allowClear>
                {
                  list.map((val: any) =>
                    <Select.Option value={val.code} key={val.code}>
                      {val.name}
                    </Select.Option>)
                }
              </Select>
            </Form.Item>
          ))) : null
        }
        <Form.Item label="关键词" name="keywords" tooltip="多个关键词以分号分隔" rules={[{ required: true }]}>
          <Input.TextArea allowClear placeholder="请输入关键词，多个关键词以分号分隔" />
        </Form.Item>
        <Form.Item label="是否显示" name="show" rules={[{ required: true }]}>
          <Radio.Group>
            <Radio value={1}>是</Radio>
            <Radio value={0}>否</Radio>
          </Radio.Group>
        </Form.Item>
        {
          props.isstatus === 1 ? (<Form.Item label={<span className="form-item-required">导入材料</span>} rules={[{ required: true }]}>
            <ReadFileBtn callback={fileCallBack} />  {PDFfile ? PDFfile.name : ''}
          </Form.Item>)
            : null}
      </Form>
    </Modal>
  );
};

const SearchFrom = (props: any) => {
  const [form] = Form.useForm();
  const onFinish = (values: any) => {
    let param: any = {};
    Object.keys(values).forEach((key) => {
      const element = values[key];
      param[key] = element ? element : '';
    });
    props.handleSearch(param);
  };

  const onReset = () => {
    form.resetFields();
    let values = form.getFieldsValue();
    let param: any = {};
    Object.keys(values).forEach((key) => {
      param[key] = '';
    });
    props.handleSearch(param);
  };

  return (
    <div className="searchform-wrapper">
      <Form form={form} name="searchform" onFinish={onFinish}>
        <Space>
          <Form.Item name="name" label="材料标题">
            <Input allowClear />
          </Form.Item>
          <Form.Item name="plateCode" label="所属板块">
            <Select allowClear style={{ width: 172 }}>
              {
                props.plateList.map((val: any) =>
                  <Select.Option value={val.code} key={val.id}>
                    {val.name}
                  </Select.Option>)
              }
            </Select>
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

const ImportFile = () => {
  const columns: ColumnsType<any> | undefined = [
    {
      title: '材料标题',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true
    },
    {
      title: '所属板块',
      dataIndex: 'plate',
      key: 'plate',
      width: 120
    },
    {
      title: '所属分类',
      dataIndex: 'classificationList',
      key: 'classificationList',
      render: (val: any, record: any) => (
        val.map((list: any) => {
          if (list.type === 2) {
            // return <Tag color="processing" key={list.id}>{list.name}</Tag>
            return list.name
          }
          return null
        })
      )
    },
    {
      title: '是否显示',
      dataIndex: 'show',
      key: 'show',
      width: 80,
      render: (val: any, record: any) => {
        switch (val) {
          case 1:
            return `是`;
          case '0':
            return <span style={{ color: '#ccc' }}>否</span>;
          default:
        }
      }
    },
    {
      title: '最后修改时间',
      dataIndex: 'lastUpdateTime',
      key: 'lastUpdateTime'
    },
    {
      title: '最后修改人',
      width: 100,
      dataIndex: 'lastUpdateUser',
      key: 'lastUpdateUser'
    },
    {
      title: '操作',
      key: 'operation',
      fixed: 'right',
      width: 150,
      render: (val: any, record: any) => (
        <>
          <Space>
            <Button type="link" icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)}>
              编辑
            </Button>
            <Button type="link" icon={<DeleteOutlined />} danger size="small" onClick={() => handleDelete(record)}>
              删除
            </Button>
          </Space>
        </>
      )
    }
  ];
  const [visible, setVisible] = useState(false);
  const [load, setLoad] = useState(false);
  const [lists, setLists] = useState([]);
  const [isstatus, setIsStatus] = useState(0);
  const [rowdata, setRowdata] = useState({});
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchParam, setSearchParam] = useState<ISearchParams>({});
  const [plateList, setPlateList] = useState<any[]>([]);

  useEffect(() => {
    let didCancel = false;
    const params = {
      curPage: page,
      pageSize: pageSize,
      plateCode: searchParam.plateCode ? searchParam.plateCode : '',
      name: searchParam.name ? searchParam.name : '',
    };
    const gotData = async () => {
      try {
        const result = await api.materialList(params);
        if (!didCancel) {
          if (result.resultCode === 0) {
            const data = result.data;
            const lists = Array.isArray(data.essays) ? data.essays.map((item: any, index: string) => {
              return {
                ...item,
                key: index
              };
            }) : [];
            setTotal(data.totalSize);
            setLists(lists);
          }
        }
      } catch (error) { }
    };
    gotData();
    return () => {
      didCancel = true;
    };
  }, [load, page, pageSize, searchParam]);

  const changePage = (page: number, pageSize?: number | undefined) => {
    setPage(page);
    pageSize && setPageSize(pageSize);
  };

  const handleSearch = (val: any) => {
    setPage(1);
    setPageSize(20);
    setSearchParam({ ...val });
  };

  const handleAdd = () => {
    setVisible(true);
    setIsStatus(1);
  };

  const handleEdit = (value: any) => {
    setVisible(true);
    setIsStatus(2);
    setRowdata(value);
  };

  const handleReload = () => {
    setLoad(!load);
  };

  const handleClose = () => {
    setIsStatus(0);
    setVisible(false);
  };

  const handleDelete = (value: any) => {
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

  const deleteSubmit = async (value: any) => {
    try {
      const param = {
        id: value.id
      };
      const result = await api.materialDelete(param);
      if (result.resultCode === 0) {
        message.success('删除成功');
        setTimeout(() => {
          setLoad(!load);
        }, 2000)
      } else {
        message.error(result.errorMsg);
      }
    } catch (error) { }
  };


  // 所属板块
  useEffect(() => {
    let didCancel = false;
    const param = {}
    const gotPlateList = async () => {
      try {
        const result = await api.plateList(param);
        if (!didCancel) {
          if (result.resultCode === 0) {
            const data = result.data;
            const lists = Array.isArray(data) ? data.filter((val) => parseInt(val.status) === 1) : [];
            setPlateList(lists)
          }
        }
      } catch (error) { }
    };
    gotPlateList();
    return () => {
      didCancel = true;
    };
  }, []);

  return (
    <>
      <div className="page">
        <SearchFrom handleSearch={handleSearch} plateList={plateList} />
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
      <FormModal
        isstatus={isstatus}
        visible={visible}
        rowdata={rowdata}
        handleReload={handleReload}
        handleClose={handleClose}
        plateList={plateList}
      />
    </>
  );
};

export default ImportFile;
