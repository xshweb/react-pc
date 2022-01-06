import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import './index.less';
import "react-photo-view/dist/index.css";
import { PhotoProvider, PhotoConsumer } from "react-photo-view";
import * as api from '@/api/strategy';
import { companyConfig, baseURL } from '@/config';
import { getStrategyCache, setStrategyCache, clearStrategyCache } from '@/libs/handleStorage';
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
import { Image, Empty, Tag, Table, Button, Modal, message, Form, Input, Select, Pagination, Space, Row, Col, Tree, Radio, Card } from 'antd';

const { CheckableTag } = Tag;
const { Search } = Input;


interface ISearchParams {
  classificationCode?: string[],
  keywords?: string,
}

const FormModal = (props: any) => {

  const handleOk = () => {
    props.handleClose();
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
  const [classifyList, setClassifyList] = useState<any[]>([])
  const [keywords, setKeywords] = useState<string | undefined>('')
  const searchdom = useRef(null)

  // 获取分类列表
  useEffect(() => {
    setClassifyList([...props.classifyList])
  }, [props.classifyList])
  
  let param: ISearchParams = {}
  // 选中/取消操作
  const handleIndustry = (tag: any, index: number, checked: boolean) => {
    const target = classifyList[index]
    const nexttarget = target.map((t: any) => {
      return {
        ...t,
        checked: tag.id === t.id ? checked : false
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
  const handleMultiArr = (list: any[], keywords: string | undefined) => {
    const codeList = list.reduce((pre, cur) => {
      const target = cur.filter((t: any) => t.checked === true)
      if (target.length) {
        const codeItem = target.map((v: any) => v.code)
        pre.push(codeItem)
      }
      return pre
    }, [])
    param.keywords = keywords
    param.classificationCode = codeList
    props.handleSearch(param)
  }
  const onSearch = (value: string) => {
    handleMultiArr(classifyList, value)
    setKeywords(value)
  };
  // const changeSearch = (e: React.ChangeEvent<HTMLInputElement> | undefined): void => {
  //   const val = e?.target.value
  //   props.assignSearch(val)
  // }
  const active = { borderColor: '#1890ff', color: '#1890ff', cursor: 'pointer', background: '#fff' }
  const style = { borderColor: '#d9d9d9', color: 'rgba(0, 0, 0, 0.85)', cursor: 'pointer', background: '#fff' }
  return (
    <div className="searchform-wrapper report">
      {
        classifyList.length ? (classifyList.map((list: any, index: number) => (
          <div className="row-box" key={index}>
            <div className="row-title">
              {list[0].calssName}：
            </div>
            <div className="row-content">
              <div className="row-li" key={0}>
                <Tag style={list.filter((t: any) => t.checked).length > 0 ? style : active} onClick={() => resetIndustry(index)}>不限</Tag>
              </div>
              {list.map((tag: any) => (
                <div className="row-li" key={tag.id}>
                  <CheckableTag
                    key={tag.id}
                    checked={tag.checked}
                    onChange={(checked) => handleIndustry(tag, index, checked)}
                  >
                    {tag.name}
                  </CheckableTag>
                </div>
              ))}
            </div>
          </div>
        ))) : null
      }
      <div className="row-box-flex">
        <Space>
          <Search ref={searchdom} placeholder="请输入关键词查询相关报告" allowClear  onSearch={onSearch} enterButton style={{ width: 230 }} />
        </Space>
      </div>
    </div>
  );
};


const Report = () => {
  const urlparam: any = useParams();
  const [visible, setVisible] = useState(false);
  const [isrequest, setIsrequest] = useState(false);
  const [lists, setLists] = useState<any[]>([]);
  const [rowdata, setRowdata] = useState({});
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(18);
  const [searchParam, setSearchParam] = useState<ISearchParams>({});
  const [searchText, setSearchText] = useState<string | undefined>('');
  const [classifyList, setClassifyList] = useState<any[]>([]);
  const config = companyConfig()
  let history = useHistory();
  const strategyCache = getStrategyCache()

  useEffect(() => {
  if (strategyCache && urlparam.path) {
    clearStrategyCache()
    history.replace(`/rdstrategy/${urlparam.path}`);
  } else {
    setStrategyCache('strategy1')
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlparam.path])

  useEffect(() => {
    let didCancel = false;
    const params = {
      curPage: page,
      pageSize: pageSize,
      plateCode: urlparam.path,
      classificationCode: Array.isArray(searchParam.classificationCode) ? searchParam.classificationCode : [],
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
          setIsrequest(true)
        }
      } catch (error) { }
    };
    if (urlparam.path) {
      gotData();
    }
    return () => {
      didCancel = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, searchParam]);

  // 所属板块
  useEffect(() => {
    let didCancel = false;
    const param = {
      plateCode: urlparam.path
    }
    const getClassifyList = async () => {
      try {
        const result = await api.classifyList(param);
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const assignSearch = (val: string | undefined) => {
    setSearchText(val)
  }

  const changePage = (page: number, pageSize?: number | undefined) => {
    setPage(page);
    pageSize && setPageSize(pageSize);
  };

  const handleSearch = (val: any) => {
    setPage(1);
    setPageSize(18);
    setSearchParam({ ...val });
  };

  const handleCat = (item: any) => {
    // setVisible(true);
    // handleExport(item)
    const url = handleImgSrc(item.pdfKey)
    window.open(url)
  };

  const handleExport = async (row: any) => {
    const param = {
      fileId: row.pdfKey,
    };
    const result = await api.materialPreview(param);
    if (result.resultCode === 2000) {
      message.error(result.errorMsg);
    } else {
      const blob = new Blob([result]);
      const fileName = `${row.text}.pdf`;
      const elink = document.createElement('a');
      elink.download = fileName;
      elink.style.display = 'none';
      elink.href = URL.createObjectURL(blob);
      document.body.appendChild(elink);
      elink.click();
      URL.revokeObjectURL(elink.href); // 释放URL 对象
      document.body.removeChild(elink);
    }
  };

  const handleClose = () => {
    setVisible(false);
  };


  const handleImgSrc = (key: string) => {
    return `${config.origin}${baseURL}/strategy/v1/material/preview?key=${key}`
  }

  const handleHighWords = (str: string) => {
    const value = searchParam.keywords
    let newstr = str ? str : ''
    if (value) {
      const reg = new RegExp(value, 'g')
      newstr = str.replace(reg, `<span style="color: #F5BC67; font-weight: 700">${value}</span>`)
    }
    return newstr
  }

  return (
    <>
      <div className="page report-page">
        <SearchFrom handleSearch={handleSearch} classifyList={classifyList} searchText={searchText} assignSearch={assignSearch} urlparam={urlparam} />
        <div className="table-wrapper report">
          <div className="card-ul">
            {
              lists.map((item) => (<div className="card-li" key={item.id}>
                <div className="card-title" dangerouslySetInnerHTML={{ __html: handleHighWords(item.highWords) }} />
                <div className="card-image">
                  <PhotoProvider>
                    <PhotoConsumer src={handleImgSrc(item.img)}>
                      {/* <div className="origin-image" style={{backgroundImage: `url(${handleImgSrc(item.abbImg)})`}}></div> */}
                      <img src={handleImgSrc(item.abbImg)} alt="" className="origin-image" />
                    </PhotoConsumer>
                  </PhotoProvider>
                </div>
                <div className="card-bottom">
                  <div className="tags">
                    <div className="tag">{item.createTime}</div>
                  </div>
                  <div className="btn">
                    <Button type="primary" icon={<FilePdfOutlined />} onClick={() => handleCat(item)}>
                      原文
                    </Button>
                  </div>
                </div>
              </div>))
            }
          </div>
          {
            isrequest && lists.length === 0 ? (
              <div className="empty-wrap">
                <Empty />
              </div>
            ) : null
          }
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
            pageSizeOptions={['9', '18', '54', '90']}
          />
        </div>
        {/* <ReactPDF/> */}
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
