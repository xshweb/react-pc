import React from 'react';
import './index.less'
type Props = {
  name: string,
  style?: any
}
const SvgIcon = function (props: Props) {
  return (
    <span role="img" aria-label={props.name} className="anticon ant-menu-item-icon" style={props.style}>
      <svg className="svg-icon" focusable="false" aria-hidden="true" viewBox="0 0 100 100">
        <use xlinkHref={'#icon-' + props.name} />
      </svg>
    </span>

  )
}
export default SvgIcon
