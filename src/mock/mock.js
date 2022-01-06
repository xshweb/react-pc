export const mockMemu = [
  {
    id: 9,
    title: '营销监测',
    icon: 'icon-shujuzhibiao',
    link: '/market',
    children: [
      {
        id: 2,
        title: '指标数据',
        icon: 'icon-shujuzhibiao',
        link: '/data',
        children: [
          { id: 3, link: '/data/finance', title: '财务录入', icon: '' },
          { id: 4, link: '/data/hr', title: 'HR录入', icon: '' },
          { id: 5, link: '/data/project', title: '项目更新', icon: '' }
        ]
      },
      {
        id: 6,
        title: '大屏数据',
        icon: 'icon-shujuzhibiao',
        link: '/webdata',
        children: [
          { id: 7, link: '/webdata/bi', title: '数据录入', icon: '' },
          { id: 8, link: '/webdata/stock', title: '库存数据录入', icon: '' }
        ]
      }
    ]
  },
  {
    id: 9,
    title: 'OA同步',
    icon: 'icon-shujuzhibiao',
    link: '/oa',
    children: [
      {
        id: 11,
        title: '用户管理',
        icon: 'icon-xiangmujindu',
        link: '/oa',
        children: [
          {
            id: 12,
            link: '/oa/index',
            title: '用户管理',
            icon: ''
          }
        ]
      },
      {
        id: 13,
        title: '角色管理',
        icon: 'icon-xiangmujindu',
        link: '/oa/home'
      }
    ]
  }
];

export const mockMemu2 = [
  {
    id: 1,
    menuName: '系统管理',
    parentMenuId: 0,
    menuUrl: '/system',
    menuType: 1,
    sequence: 1,
    menuIcon: null,
    menuStatus: 1
  },
  {
    id: 2,
    menuName: '用户管理',
    parentMenuId: 1,
    menuUrl: '/system/user',
    menuType: 2,
    sequence: 1,
    menuIcon: null,
    menuStatus: 1
  },
  {
    id: 3,
    menuName: '角色管理',
    parentMenuId: 1,
    menuUrl: '/system/role',
    menuType: 2,
    sequence: 1,
    menuIcon: null,
    menuStatus: 1
  },
  {
    id: 12,
    menuName: '菜单管理',
    parentMenuId: 1,
    menuUrl: '/system/menu',
    menuType: 2,
    sequence: 1,
    menuIcon: null,
    menuStatus: 1
  },
  {
    id: 4,
    menuName: '用户查询',
    parentMenuId: 2,
    menuUrl: '',
    menuType: 3,
    sequence: 1,
    menuIcon: null,
    menuStatus: 1
  },
  {
    id: 5,
    menuName: '营销监控',
    parentMenuId: 0,
    menuUrl: '/bi',
    menuType: 1,
    sequence: 1,
    menuIcon: null,
    menuStatus: 1
  },
  {
    id: 6,
    menuName: '数据指标',
    parentMenuId: 5,
    menuUrl: '/bi/data',
    menuType: 2,
    sequence: 1,
    menuIcon: null,
    menuStatus: 1
  },
  {
    id: 7,
    menuName: '财务录入',
    parentMenuId: 6,
    menuUrl: '/bi/data/finance',
    menuType: 2,
    sequence: 1,
    menuIcon: null,
    menuStatus: 1
  },
  {
    id: 8,
    menuName: '新增按钮',
    parentMenuId: 7,
    menuUrl: '',
    menuType: 3,
    sequence: 1,
    menuIcon: null,
    menuStatus: 1
  },
  {
    id: 9,
    menuName: '大屏数据',
    parentMenuId: 5,
    menuUrl: '/bi/webdata',
    menuType: 2,
    sequence: 1,
    menuIcon: null,
    menuStatus: 1
  },
  {
    id: 10,
    menuName: '数据录入',
    parentMenuId: 9,
    menuUrl: '/bi/webdata/bi',
    menuType: 2,
    sequence: 1,
    menuIcon: null,
    menuStatus: 1
  },
  {
    id: 11,
    menuName: '百度首页',
    parentMenuId: 0,
    menuUrl: 'https://www.baidu.com/',
    menuType: 1,
    sequence: 1,
    menuIcon: null,
    menuStatus: 1,
    linkStatus: 1
  }
];

const menus = [
  {
    id: 1,
    title: '首页',
    icon: 'icon-xiangmujindu',
    link: '/index',
    children: [
      {
        id: 6,
        link: '/index/work',
        title: '工作台',
        icon: ''
      }
    ]
  },
  {
    id: 2,
    title: '指标数据',
    icon: 'icon-shujuzhibiao',
    link: '/data',
    children: [
      { id: 3, link: '/data/finance', title: '财务录入', icon: '' },
      { id: 4, link: '/data/hr', title: 'HR录入', icon: '' },
      { id: 5, link: '/data/project', title: '项目更新', icon: '' }
    ]
  },
  {
    id: 6,
    title: '大屏数据',
    icon: 'icon-shujuzhibiao',
    link: '/webdata',
    children: [
      { id: 7, link: '/webdata/bi', title: '数据录入', icon: '' },
      { id: 8, link: '/webdata/stock', title: '库存数据录入', icon: '' }
    ]
  }
];

export const mockdeptList = [
  {
    deptCode: 'GV0002D0',
    deptName: '默认部门',
    shortName: null,
    parentlevel: '2',
    companyCode: 'GV0002'
  },
  {
    deptCode: 'GV0002D900601619',
    deptName: '组织机构',
    shortName: null,
    parentlevel: '1',
    companyCode: 'GV0002'
  },
  {
    deptCode: 'GV0002D42650',
    deptName: '绿谷医药科技',
    shortName: '绿谷医药科技',
    parentlevel: '2',
    companyCode: 'GV0002'
  },
  {
    deptCode: 'GV0002D42653',
    deptName: '证券事务部',
    shortName: '证券事务部',
    parentlevel: '4',
    companyCode: 'GV0002'
  },
  {
    deptCode: 'GV0002D42657',
    deptName: '生产中心',
    shortName: '生产中心',
    parentlevel: '3',
    companyCode: 'GV0002'
  },
  {
    deptCode: 'GV0002D42674',
    deptName: '生产部',
    shortName: '生产部',
    parentlevel: '4',
    companyCode: 'GV0002'
  },
  {
    deptCode: 'GV0002D42675',
    deptName: '质量管理部',
    shortName: '质量管理部',
    parentlevel: '4',
    companyCode: 'GV0002'
  },
  {
    deptCode: 'GV0002D42651',
    deptName: '总经办',
    shortName: '总经办',
    parentlevel: '3',
    companyCode: 'GV0002'
  },
  {
    deptCode: 'GV0002D42656',
    deptName: '财务中心',
    shortName: '财务中心',
    parentlevel: '4',
    companyCode: 'GV0002'
  },
  {
    deptCode: 'GV0002D42673',
    deptName: '战略投资部',
    shortName: '战略投资部',
    parentlevel: '5',
    companyCode: 'GV0002'
  },
  {
    deptCode: 'GV0002D42672',
    deptName: '财务部',
    shortName: '财务部',
    parentlevel: '5',
    companyCode: 'GV0002'
  },
  {
    deptCode: 'GV0002D42654',
    deptName: '研究院',
    shortName: '研究院',
    parentlevel: '3',
    companyCode: 'GV0002'
  },
  {
    deptCode: 'GV0002D42665',
    deptName: '药物分析平台',
    shortName: '药物分析平台',
    parentlevel: '6',
    companyCode: 'GV0002'
  },
  {
    deptCode: 'GV0002D42667',
    deptName: '神经行为学组',
    shortName: '神经行为学组',
    parentlevel: '8',
    companyCode: 'GV0002'
  },
  {
    deptCode: 'GV0002D42669',
    deptName: '工艺质量平台',
    shortName: '工艺质量平台',
    parentlevel: '6',
    companyCode: 'GV0002'
  },
  {
    deptCode: 'GV0002D42660',
    deptName: '生物分析平台',
    shortName: '生物分析平台',
    parentlevel: '6',
    companyCode: 'GV0002'
  },
  {
    deptCode: 'GV0002D42659',
    deptName: '药物警戒部',
    shortName: '药物警戒部',
    parentlevel: '3',
    companyCode: 'GV0002'
  },
  {
    deptCode: 'GV0002D42664',
    deptName: '药物化学研发平台',
    shortName: '药物化学研发平台',
    parentlevel: '6',
    companyCode: 'GV0002'
  },
  {
    deptCode: 'GV0002D42663',
    deptName: '菌群平台',
    shortName: '菌群平台',
    parentlevel: '7',
    companyCode: 'GV0002'
  },
  {
    deptCode: 'GV0002D42668',
    deptName: '免疫学平台',
    shortName: '免疫学平台',
    parentlevel: '7',
    companyCode: 'GV0002'
  },
  {
    deptCode: 'GV0002D42662',
    deptName: '神经病理学平台',
    shortName: '神经病理学平台',
    parentlevel: '7',
    companyCode: 'GV0002'
  },
  {
    deptCode: 'GV0002D42661',
    deptName: '生物信息平台',
    shortName: '生物信息平台',
    parentlevel: '6',
    companyCode: 'GV0002'
  },
  {
    deptCode: 'GV0002D42666',
    deptName: '体内药效评价平台',
    shortName: '体内药效评价平台',
    parentlevel: '7',
    companyCode: 'GV0002'
  },
  {
    deptCode: 'GV0002D42658',
    deptName: '运营中心',
    shortName: '运营中心',
    parentlevel: '3',
    companyCode: 'GV0002'
  },
  {
    deptCode: 'GV0002D42680',
    deptName: '法务合规部',
    shortName: '法务合规部',
    parentlevel: '4',
    companyCode: 'GV0002'
  },
  {
    deptCode: 'GV0002D42681',
    deptName: '规划建设部',
    shortName: '规划建设部',
    parentlevel: '4',
    companyCode: 'GV0002'
  },
  {
    deptCode: 'GV0002D42679',
    deptName: '人力资源中心',
    shortName: '人力资源中心',
    parentlevel: '3',
    companyCode: 'GV0002'
  },
  {
    deptCode: 'GV0002D42677',
    deptName: '行政部',
    shortName: '行政部',
    parentlevel: '4',
    companyCode: 'GV0002'
  },
  {
    deptCode: 'GV0002D42683',
    deptName: '档案室',
    shortName: '档案室',
    parentlevel: '4',
    companyCode: 'GV0002'
  },
  {
    deptCode: 'GV0002D42676',
    deptName: '信息中心',
    shortName: '信息中心',
    parentlevel: '3',
    companyCode: 'GV0002'
  },
  {
    deptCode: 'GV0002D42678',
    deptName: '采购部',
    shortName: '采购部',
    parentlevel: '4',
    companyCode: 'GV0002'
  },
  {
    deptCode: 'GV0002D42682',
    deptName: '内控部',
    shortName: '内控部',
    parentlevel: '4',
    companyCode: 'GV0002'
  },
  {
    deptCode: 'GV0002D42652',
    deptName: '审计中心',
    shortName: '审计中心',
    parentlevel: '3',
    companyCode: 'GV0002'
  },
  {
    deptCode: 'GV0002D42655',
    deptName: '营销中心',
    shortName: '营销中心',
    parentlevel: '3',
    companyCode: 'GV0002'
  },
  {
    deptCode: 'GV0002D42671',
    deptName: '市场部',
    shortName: '市场部',
    parentlevel: '4',
    companyCode: 'GV0002'
  },
  {
    deptCode: 'GV0002D42670',
    deptName: '渠道运营部',
    shortName: '渠道运营部',
    parentlevel: '4',
    companyCode: 'GV0002'
  },
  {
    deptCode: 'GV0002D42915',
    deptName: '本溪制药',
    shortName: '本溪制药',
    parentlevel: '4',
    companyCode: 'GV0002'
  },
  {
    deptCode: 'GV0002D132057',
    deptName: 'BMID平台',
    shortName: 'BMID平台',
    parentlevel: '6',
    companyCode: 'GV0002'
  },
  {
    deptCode: 'GV0002D132042',
    deptName: '品牌部',
    shortName: '品牌部',
    parentlevel: '4',
    companyCode: 'GV0002'
  },
  {
    deptCode: 'GV0002D132056',
    deptName: '转化医学研究部',
    shortName: '转化医学研究部',
    parentlevel: '5',
    companyCode: 'GV0002'
  },
  {
    deptCode: 'GV0002D132049',
    deptName: '临床研究中心',
    shortName: '临床研究中心',
    parentlevel: '4',
    companyCode: 'GV0002'
  },
  {
    deptCode: 'GV0002D132080',
    deptName: '合规部',
    shortName: '合规部',
    parentlevel: '5',
    companyCode: 'GV0002'
  },
  {
    deptCode: 'GV0002D132055',
    deptName: '生物学研究部',
    shortName: '生物学研究部',
    parentlevel: '5',
    companyCode: 'GV0002'
  },
  {
    deptCode: 'GV0002D132054',
    deptName: '制剂研究平台',
    shortName: '制剂研究平台',
    parentlevel: '6',
    companyCode: 'GV0002'
  },
  {
    deptCode: 'GV0002D132038',
    deptName: '医学事务部',
    shortName: '医学事务部',
    parentlevel: '4',
    companyCode: 'GV0002'
  },
  {
    deptCode: 'GV0002D132096',
    deptName: '药物评价筛选平台',
    shortName: '药物评价筛选平台',
    parentlevel: '6',
    companyCode: 'GV0002'
  },
  {
    deptCode: 'GV0002D132062',
    deptName: '行政部',
    shortName: '行政部',
    parentlevel: '6',
    companyCode: 'GV0002'
  },
  {
    deptCode: 'GV0002D132047',
    deptName: '验证部',
    shortName: '验证部',
    parentlevel: '4',
    companyCode: 'GV0002'
  },
  {
    deptCode: 'GV0002D132070',
    deptName: '临床项目协调部',
    shortName: '临床项目协调部',
    parentlevel: '5',
    companyCode: 'GV0002'
  },
  {
    deptCode: 'GV0002D132060',
    deptName: '实验室管理部',
    shortName: '实验室管理部',
    parentlevel: '6',
    companyCode: 'GV0002'
  },
  {
    deptCode: 'GV0002D132030',
    deptName: '品牌中心',
    shortName: '品牌中心',
    parentlevel: '3',
    companyCode: 'GV0002'
  },
  {
    deptCode: 'GV0002D132048',
    deptName: '临床前研究中心',
    shortName: '临床前研究中心',
    parentlevel: '4',
    companyCode: 'GV0002'
  },
  {
    deptCode: 'GV0002D132069',
    deptName: '上市后研究',
    shortName: '上市后研究',
    parentlevel: '5',
    companyCode: 'GV0002'
  },
  {
    deptCode: 'GV0002D132037',
    deptName: '销售部',
    shortName: '销售部',
    parentlevel: '4',
    companyCode: 'GV0002'
  },
  {
    deptCode: 'GV0002D132035',
    deptName: '质量管理中心',
    shortName: '质量管理中心',
    parentlevel: '3',
    companyCode: 'GV0002'
  },
  {
    deptCode: 'GV0002D132063',
    deptName: 'HPS',
    shortName: 'HPS',
    parentlevel: '6',
    companyCode: 'GV0002'
  },
  {
    deptCode: 'GV0002D132079',
    deptName: '法务部',
    shortName: '法务部',
    parentlevel: '5',
    companyCode: 'GV0002'
  },
  {
    deptCode: 'GV0002D132031',
    deptName: '政府事务部',
    shortName: '政府事务部',
    parentlevel: '3',
    companyCode: 'GV0002'
  },
  {
    deptCode: 'GV0002D132059',
    deptName: '项目管理部',
    shortName: '项目管理部',
    parentlevel: '6',
    companyCode: 'GV0002'
  },
  {
    deptCode: 'GV0002D132051',
    deptName: '药学研究部',
    shortName: '药学研究部',
    parentlevel: '5',
    companyCode: 'GV0002'
  },
  {
    deptCode: 'GV0002D132066',
    deptName: '临床运营部',
    shortName: '临床运营部',
    parentlevel: '5',
    companyCode: 'GV0002'
  },
  {
    deptCode: 'GV0002D132067',
    deptName: '临床医学部',
    shortName: '临床医学部',
    parentlevel: '5',
    companyCode: 'GV0002'
  },
  {
    deptCode: 'GV0002D132032',
    deptName: '流程变革管理中心',
    shortName: '流程变革管理中心',
    parentlevel: '3',
    companyCode: 'GV0002'
  },
  {
    deptCode: 'GV0002D132040',
    deptName: 'SFE',
    shortName: 'SFE',
    parentlevel: '4',
    companyCode: 'GV0002'
  },
  {
    deptCode: 'GV0002D132050',
    deptName: '科研管理部',
    shortName: '科研管理部',
    parentlevel: '5',
    companyCode: 'GV0002'
  },
  {
    deptCode: 'GV0002D132043',
    deptName: '营销办公室',
    shortName: '营销办公室',
    parentlevel: '4',
    companyCode: 'GV0002'
  },
  {
    deptCode: 'GV0002D132034',
    deptName: '战略发展中心',
    shortName: '战略发展中心',
    parentlevel: '3',
    companyCode: 'GV0002'
  },
  {
    deptCode: 'GV0002D132058',
    deptName: '科研管理办公室',
    shortName: '科研管理办公室',
    parentlevel: '6',
    companyCode: 'GV0002'
  },
  {
    deptCode: 'GV0002D132065',
    deptName: '注册部',
    shortName: '注册部',
    parentlevel: '5',
    companyCode: 'GV0002'
  },
  {
    deptCode: 'GV0002D132045',
    deptName: '设备管理部',
    shortName: '设备管理部',
    parentlevel: '4',
    companyCode: 'GV0002'
  }
];
