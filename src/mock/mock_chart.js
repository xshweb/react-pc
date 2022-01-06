/* eslint-disable @typescript-eslint/no-require-imports */
const Mock = require('mockjs');
const Random = Mock.Random;
const moment = require('moment');
const data = Mock.mock({
  'list|365': [
    {
      // 属性 id 是一个自增数，起始值为 1，每次增 1
      name: '年度达成率',
      'date|+1': 0,
      'value|1-100': 100
    }
  ]
});

// 输出结果
const list = data.list.map((val) => {
  const date = moment([2021, 0, 1]).add(val.date, 'd').format('MM/DD');
  return {
    date: date,
    name: '年度达成率',
    value: val.value
  };
});
export const mock_data = list;
export const mock_data3 = [
  { name: '年度达成率', date: '3/9', value: 13 },
  { name: '年度达成率', date: '3/10', value: 23 },
  { name: '年度达成率', date: '3/11', value: 33 },
  { name: '年度达成率', date: '3/12', value: 43 },
  { name: '年度达成率', date: '3/13', value: 53 },
  { name: '年度达成率', date: '3/14', value: 63 },
  { name: '季度达成率', date: '3/9', value: 33 },
  { name: '季度达成率', date: '3/10', value: 43 },
  { name: '季度达成率', date: '3/11', value: 53 },
  { name: '季度达成率', date: '3/12', value: 33 },
  { name: '季度达成率', date: '3/13', value: 23 },
  { name: '季度达成率', date: '3/14', value: 53 },
  { name: '月度达成率', date: '3/9', value: 31 },
  { name: '月度达成率', date: '3/10', value: 42 },
  { name: '月度达成率', date: '3/11', value: 59 },
  { name: '月度达成率', date: '3/12', value: 43 },
  { name: '月度达成率', date: '3/13', value: 33 },
  { name: '月度达成率', date: '3/14', value: 23 }
];

export const mock_data2 = [
  { name: '晋豫大区', date: '1', value: 13 },
  { name: '晋豫大区', date: '2', value: 23 },
  { name: '晋豫大区', date: '3', value: 33 },
  { name: '晋豫大区', date: '4', value: 43 },
  { name: '晋豫大区', date: '5', value: 53 },
  { name: '晋豫大区', date: '6', value: 63 },
  { name: '浙闽大区', date: '1', value: 33 },
  { name: '浙闽大区', date: '2', value: 43 },
  { name: '浙闽大区', date: '3', value: 53 },
  { name: '浙闽大区', date: '4', value: 33 },
  { name: '浙闽大区', date: '5', value: 23 },
  { name: '浙闽大区', date: '6', value: 53 },
  { name: '苏皖大区', date: '1', value: 31 },
  { name: '苏皖大区', date: '2', value: 42 },
  { name: '苏皖大区', date: '3', value: 59 },
  { name: '苏皖大区', date: '4', value: 43 },
  { name: '苏皖大区', date: '5', value: 33 },
  { name: '苏皖大区', date: '6', value: 23 }
];

export const mock_data4 = [
  {
    planArea: 'E3_DM_08',
    planAreaName: '江苏区域5',
    planAreaParent: 'E3_RD_01',
    leader: '刘尊兵',
    yearSales: null,
    list: [
      {
        id: 18742,
        leader: '刘尊兵',
        month: '202101',
        monthSales: 17.0
      },
      {
        id: 18743,
        leader: '刘尊兵',
        month: '202102',
        monthSales: 17.0,
        planArea: 'E3_DM_08',
        planAreaName: '江苏区域5',
        planAreaParent: 'E3_RD_01',
        yearSales: null
      }
    ]
  },
  {
    planArea: 'E3_DM_08',
    planAreaName: '江苏区域5',
    planAreaParent: 'E3_RD_01',
    leader: '刘尊兵2',
    yearSales: null,
    list: [
      {
        id: 18744,
        leader: '刘尊兵',
        month: '202101',
        monthSales: 17.0,
        planArea: 'E3_DM_08',
        planAreaName: '江苏区域5',
        planAreaParent: 'E3_RD_01',
        yearSales: null
      },
      {
        id: 18743,
        leader: '刘尊兵',
        month: '202102',
        monthSales: 17.0,
        planArea: 'E3_DM_08',
        planAreaName: '江苏区域5',
        planAreaParent: 'E3_RD_01',
        yearSales: null
      }
    ]
  }
];
