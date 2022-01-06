/**
 *  bootstrap-icons-1.5.0
 *  https://icons.getbootstrap.com/
 */
import { useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import icons from './requireIcons'
import SvgIcon from '@/components/SvgIcon';
import './index.less'
const IconSelect = (props: any) => {
  const [value, setValue] = useState('');
  const [lists, setLists] = useState<string []>([...icons]);
  const onChange = (e: any) => {
    setValue(e.target.value)
    let targetList = icons
    if (e.target.value) {
      const value = e.target.value.toLowerCase()
      const reg = new RegExp(value)
      targetList = icons.filter((item: string) => item.search(reg) > -1 )
    }
    setLists([...targetList])
  }
  const onClick = (value: string) => {
    setValue('')
    setLists([...icons])
    props.callback && props.callback(value)
  }

  return (<div className="icon-body">
    <Input
      suffix={
        <SearchOutlined />
      }
      value={value}
      onChange={onChange}
      style={{ marginBottom: '20px' }}
    />
    <div className="icon-lists">
      {
        lists.map((item: string, index: number) => (
          <div className="icon-list" onClick={() => onClick(item)} key={index}>
            <SvgIcon name={item} style={{fontSize: '24px'}}/>
            <span className="icon-list-span">{item}</span>
          </div>
        ))
      }
    </div>
  </div>)
}

export default IconSelect