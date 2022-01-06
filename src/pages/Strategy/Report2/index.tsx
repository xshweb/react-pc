import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './index.less';
import "react-photo-view/dist/index.css";
import { PhotoProvider, PhotoConsumer } from "react-photo-view";
import * as api from '@/api/strategy';
import { tagsData, tagsData2, tagsData3, mockClassifyList } from '@/mock/report';
import {
  SearchOutlined,
  SyncOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
  FolderOpenOutlined,
  FileOutlined,
  DeleteOutlined,
  EditOutlined,
  FilePdfOutlined
} from '@ant-design/icons';
import { Tag, Table, Button, Modal, message, Form, Input, Select, Pagination, Space, Row, Col, Tree, Radio, Card } from 'antd';
import { ColumnsType } from 'antd/lib/table';

const { confirm } = Modal;
const { CheckableTag } = Tag;
const { Search } = Input;


interface ISearchParams {
  classificationCode?: any[],
  keywords?: string,
}

const FormModal = (props: any) => {

  const handleOk = () => {

  };
  const handleCancel = () => {
    props.handleClose();
  };

  return (
    <Modal
      title="查看原文"
      visible={props.visible}
      onOk={handleOk}
      width="800px"
      onCancel={handleCancel}
      maskClosable={false}
    >

    </Modal>
  );
};

const SearchFrom = (props: any) => {
  const [classifyList, setClassifyList] = useState<any[]>([...props.classifyList])
  const [keywords, setKeywords] = useState<string>('')
  let param: ISearchParams = {}
  // 选中/取消操作
  const handleIndustry = (tag: any, index: number, checked: boolean) => {
    const target = classifyList[index]
    const nexttarget = target.map((t: any) => {
      return {
        ...t,
        checked: tag.code === t.code ? checked : t.checked
      }
    })
    classifyList.splice(index, 1, nexttarget)
    handleMultiArr(classifyList, keywords)
    setClassifyList([...classifyList])
  }
  // 不限操作
  const resetIndustry = (val: number) => {
    const target = classifyList[val]
    const nexttarget = target.map((t: any) => {
      return {
        ...t,
        checked: false
      }
    })
    classifyList.splice(val, 1, nexttarget)
    handleMultiArr(classifyList, keywords)
    setClassifyList([...classifyList])
  }
  const handleMultiArr = (list: any[], keywords: string) => {
    const codeList = list.reduce((pre, cur) => {
      const target = cur.filter((t: any) => t.checked === true)
      target.map((val: any) => {
        pre.push(val)
      })
      return pre
    }, [])
    param.keywords = keywords
    param.classificationCode = codeList.map((val: any) => val.code)
    props.handleSearch(param)
  }
  const onSearch = (value: string) => {
    handleMultiArr(classifyList, value)
    setKeywords(value)
  };
  const active = { borderColor: '#1890ff', color: '#1890ff', cursor: 'pointer', background: '#fff' }
  const style = { borderColor: '#d9d9d9', color: 'rgba(0, 0, 0, 0.85)', cursor: 'pointer', background: '#fff' }
  return (
    <div className="searchform-wrapper report">
      {
        classifyList.length && classifyList.map((list: any, index: number) => (
          <div className="row-box" key={index}>
            <div className="row-title">
              {list[0].ClassName}：
            </div>
            <div className="row-content">
              <div className="row-li" key={index}>
                <Tag style={list.filter((t: any) => t.checked).length > 0 ? style : active} onClick={() => resetIndustry(index)}>不限</Tag>
              </div>
              {list.map((tag: any) => (
                <div className="row-li" key={tag.code}>
                  <CheckableTag
                    key={tag.code}
                    checked={tag.checked}
                    onChange={(checked) => handleIndustry(tag, index, checked)}
                  >
                    {tag.name}
                  </CheckableTag>
                </div>
              ))}
            </div>
          </div>
        ))
      }
      <div className="row-box-flex">
        <Space>
          <Form.Item name="dictionaryName">
            <Search placeholder="请输入关键词查询相关报告" allowClear onSearch={onSearch} enterButton style={{ width: 230 }} />
          </Form.Item>
        </Space>
      </div>
    </div>
  );
};


const Report = () => {
  const urlparam: any = useParams();
  const [visible, setVisible] = useState(false);
  const [load, setLoad] = useState(false);
  const [lists, setLists] = useState([]);
  const [rowdata, setRowdata] = useState({});
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(18);
  const [searchParam, setSearchParam] = useState<ISearchParams>({});
  const [classifyList, setClassifyList] = useState<any[]>([...mockClassifyList]);

  useEffect(() => {
    let didCancel = false;
    const params = {
      pageIndex: page,
      pageSize: pageSize,
      plateCode: urlparam.path,
      classificationCode: searchParam.classificationCode ? searchParam.classificationCode : '',
      keywords: searchParam.keywords ? searchParam.keywords : ''
    };
    const gotData = async () => {
      try {
        const result = await api.materialSearch(params);
        if (!didCancel) {
          if (result.resultCode === 0) {
            const data = result.data;
            const lists = Array.isArray(data.sciences) ? data.sciences.map((item: any) => {
              return {
                ...item,
                key: item.id
              };
            }) : [];
            setTotal(data.totalSize);
            setLists(lists);
          }
        }
      } catch (error) { }
    };
    if (urlparam.path) {
      gotData();
    }
    return () => {
      didCancel = true;
    };
  }, [load, page, pageSize, searchParam, urlparam]);

  const changePage = (page: number, pageSize?: number | undefined) => {
    setPage(page);
    pageSize && setPageSize(pageSize);
  };

  const handleSearch = (val: any) => {
    setPage(1);
    setPageSize(18);
    setSearchParam({ ...val });
  };

  const handleCat = () => {
    setVisible(true);
  };

  const handleClose = () => {
    setVisible(false);
  };

  // 所属板块
  useEffect(() => {
    let didCancel = false;
    const param = {
      plateCode: urlparam.path
    }
    const getClassifyList = async () => {
      try {
        const result = await api.plateList(param);
        if (!didCancel) {
          if (result.resultCode === 0) {
            const data = result.data;
            const lists = Array.isArray(data) ? data : [];
            setClassifyList(lists)
          }
        }
      } catch (error) { }
    };
    if (urlparam.path) {
      getClassifyList();
    }
    return () => {
      didCancel = true;
    };
  }, [urlparam]);


  return (
    <>
      <div className="page report-page">
        <SearchFrom handleSearch={handleSearch} classifyList={classifyList} />
        <div className="table-wrapper report">
          <div className="card-ul">
            {
              tagsData3.map((item) => (<div className="card-li" key={item.id}>
                <div className="card-title">
                  {item.text}
                </div>
                <div className="card-image">
                  {/* <PhotoProvider>
                    <PhotoConsumer src={item.img}>
                      <img
                        src={item.abbImg}
                        className="card-image"
                        title="logo"
                        alt=""
                      />
                    </PhotoConsumer>
                  </PhotoProvider> */}
                </div>
                <div className="card-des">
                  <div className="des">2019-09-08</div>
                  <div className="des">健康产业</div>
                </div>
                <div className="card-bottom">
                  <div className="tags">
                    <div className="tag">医药</div>
                    <div className="tag">医疗服务</div>
                    <div className="tag">基因技术</div>
                    <div className="tag">基因技术</div>
                  </div>
                  <div className="btn">
                    <Button type="primary" icon={<FilePdfOutlined />}>
                      原文
                    </Button>
                  </div>
                </div>
              </div>))
            }
          </div>
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
        visible={visible}
        rowdata={rowdata}
        handleClose={handleClose}
      />
    </>
  );
};

export default Report;
