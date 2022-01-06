/**
 *
 * @param {list to treelist} data
 * @returns
 */
export function translateListToTree(data, parentIdName, idName = 'id') {
  // 建立 ID-数组索引映射关系
  const idMapping = data.reduce((acc, el, i) => {
    acc[el[idName]] = i;
    return acc;
  }, {});
  let tree = [];
  data.forEach((el) => {
    // 判断根节点
    if (el[parentIdName] === 0) {
      tree.push(el);
      return;
    }
    // 用映射表找到父ID
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

/**
 *
 */

export function makeTreeKeys(data) {
  data.map((item) => {
    if (item.parentMenuId === 0) {
      item.key = String(item.id);
    }
  });
  data.map((item) => {
    setChildKey(item);
  });
  function setChildKey(item) {
    item.children?.map((val) => {
      val.key = `${item.key}-${val.id}`;
      setChildKey(val);
    });
  }
  return data;
}

/**
 * 获取图片原始宽高
 * @param {*} oImg 
 * @returns 
 */
export const getImgNaturalDimensions = function getImgNaturalDimensions(oImg) {
  var nWidth, nHeight;
  if (!oImg.naturalWidth) { // 现代浏览器
    nWidth = oImg.naturalWidth;
    nHeight = oImg.naturalHeight;
    return ({ w: nWidth, h: nHeight });
  } else { // IE6/7/8
    nWidth = oImg.width;
    nHeight = oImg.height;
    return ({ w: nWidth, h: nHeight });
  }
}