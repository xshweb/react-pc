/**
 * 扁平数组转tree数组
 */
const data = [
  { id: 56, parentId: 62 },
  { id: 81, parentId: 80 },
  { id: 74, parentId: 0 },
  { id: 76, parentId: 80 },
  { id: 63, parentId: 62 },
  { id: 80, parentId: 86 },
  { id: 87, parentId: 86 },
  { id: 62, parentId: 74 },
  { id: 86, parentId: 74 },
  { id: 1, parentId: 0 },
  { id: 2, parentId: 1 },
  { id: 3, parentId: 1 },
  { id: 4, parentId: 3 },
  { id: 5, parentId: 2 },
  { id: 6, parentId: 4 }
];

function translateListToTree6(data) {
  const tree = [];
  const record = {};
  // id映射
  data.forEach((item) => {
    item.children = []; // 重置 children
    record[item.id] = item;
  });
  data.forEach((item) => {
    if (item.parentId) {
      if (record[item.parentId]) {
        record[item.parentId].children.push(item);
      }
    } else {
      tree.push(item);
    }
  });
  return tree;
}

function translateListToTree5(data) {
  const tree = [];
  const record = {};
  data.forEach((item) => {
    // 根据当前id查找对象parentId等于当前id的映射
    if (record[item.id]) {
      item.children = record[item.id];
    } else {
      record[item.id] = [];
      item.children = record[item.id];
    }
    // 构建parentId映射的数组的对象
    if (item.parentId) {
      if (!record[item.parentId]) {
        record[item.parentId] = [];
      }
      record[item.parentId].push(item);
    } else {
      tree.push(item);
    }
  });
  return tree;
}

function translateListToTree4(data) {
  // 建立 ID-数组索引映射关系
  const idMapping = data.reduce((acc, el, i) => {
    acc[el.id] = i;
    return acc;
  }, {});
  let tree = [];
  data.forEach((el) => {
    // 判断根节点
    if (el.parentId === 0) {
      tree.push(el);
      return;
    }
    // 用映射表找到父元素
    const parentEl = data[idMapping[el.parentId]];
    // 把当前元素添加到父元素的`children`数组中
    parentEl.children = [...(parentEl.children || []), el];
  });
  return tree;
}

function translateListToTree3(dataArr) {
  // 根据parentId创建映射关系
  const result = dataArr.reduce((prev, next) => {
    prev[next.parentId] ? prev[next.parentId].push(next) : (prev[next.parentId] = [next]);
    return prev;
  }, {});
  // 根据当前id查找parentId映射的数组
  Object.keys(result).map((key) => {
    result[key].map((item, i) => {
      item.children = result[item.id] ? result[item.id] : [];
    });
  });
  return result;
}

function translateListToTree2(source) {
  let cloneData = JSON.parse(JSON.stringify(source));
  return cloneData.filter((father) => {
    let branchArr = cloneData.filter((child) => father.id === child.parentId);
    father.children = branchArr;
    return father.parentId === 0; // 如果第一层不是parentId=0，请自行修改
  });
}

function translateListToTree(lists) {
  let parentLists = lists.filter((val) => val.parentId === 0);
  let childLists = lists.filter((val) => val.parentId !== 0);

  function translator(parents, children) {
    parents.forEach((val) => {
      children.forEach((cur, index) => {
        if (val.id === cur.parentId) {
          let temp = JSON.parse(JSON.stringify(children));
          // 让当前子节点从temp中移除，temp作为新的子节点数据，这里是为了让递归时，子节点的遍历次数更少，如果父子关系的层级越多，越有利
          temp.splice(index, 1);
          // 让当前子节点作为唯一的父节点，去递归查找其对应的子节点
          translator([cur], temp);
          val.children = [...(val.children || []), cur];
        }
      });
    });
  }

  translator(parentLists, childLists);

  return parentLists;
}

function translateTreeToList(lists) {
  let res = [];
  const fn = (source) => {
    source.forEach((el) => {
      res.push(el);
      if (el.children && el.children.length > 0) {
        fn(el.children);
      }
    });
  };
  fn(lists);
  return res;
}

function treeFindPath(tree, func, path = []) {
  if (!tree) return [];
  for (const data of tree) {
    // 这里按照你的需求来存放最后返回的内容吧
    path.push(data.name);
    if (func(data)) return path;
    if (data.children) {
      const findChildren = treeFindPath(data.children, func, path);
      if (findChildren.length) return findChildren;
    }
    path.pop();
  }
  return [];
}

const findParentIds = (target, id) => {
  let temp = [];
  // 声明digui函数
  const forFn = function (arr, id) {
    // 遍历树
    arr.forEach((item) => {
      if (item.id === id) {
        // 查找到指定节点加入集合
        temp.push(item);
        // 查找其父节点
        forFn(target, item.parentId);
      } else {
        if (item.children) {
          // 向下查找到id
          forFn(item.children, id);
        }
      }
    });
  };
  // 调用函数
  forFn(target, id);
  // 返回结果
  return temp;
};
