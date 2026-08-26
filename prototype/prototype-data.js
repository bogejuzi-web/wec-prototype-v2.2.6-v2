window.PROTOTYPE_DATA = {
  "project": "睿聆智能云｜新华尊项目",
  "version": "v2.2.6-v2",
  "generatedAt": "2026-08-26T10:00:00+08:00",
  "navigation": [
    {
      "title": "项目说明",
      "groups": [
        {
          "title": "项目文档",
          "pageIds": ["P13", "P14"]
        }
      ]
    },
    {
      "title": "服务请求",
      "groups": [
        {
          "title": "万能表单-服务请求",
          "pageIds": ["P01", "P11", "P06"]
        }
      ]
    },
    {
      "title": "材料收集",
      "groups": [
        {
          "title": "材料收集流程",
          "pageIds": ["P12", "P15", "P16", "P07"]
        }
      ]
    },
    {
      "title": "服务报告推送",
      "groups": [
        {
          "title": "报告推送",
          "pageIds": ["P17", "P18"]
        }
      ]
    },
    {
      "title": "个人中心-服务记录详情",
      "groups": [
        {
          "title": "服务记录详情",
          "pageIds": ["P10"]
        }
      ]
    },
    {
      "title": "其他页面",
      "groups": [
        {
          "title": "未分组页面",
          "pageIds": ["P02", "P03"]
        }
      ]
    }
  ],
  "pages": [
    {
      "id": "P13",
      "title": "新华尊-客户对接确认",
      "file": "pages/P13-customer-handover-confirmation.html",
      "viewport": "PC",
      "requirements": [],
      "illustration": "assets/illustrations/p13-customer-handover-xiaohei.png",
      "overview": "只读回显《新华尊-客户对接确认》Markdown 文档内容。",
      "pageRole": "查看项目客户对接确认说明。",
      "scenario": "项目成员在 H5 文档页查阅客户对接确认内容。",
      "flow": {"current": "P13", "steps": [{"id": "P13", "title": "查看客户对接确认"}]},
      "changes": [],
      "states": []
    },
    {
      "id": "P14",
      "title": "PRD",
      "file": "pages/P14-prd-readonly.html",
      "viewport": "PC",
      "requirements": [],
      "illustration": "assets/illustrations/p14-prd-xiaohei.png",
      "overview": "只读回显 PRD Markdown 文档内容。",
      "pageRole": "查看项目研发 PRD。",
      "scenario": "项目成员在 H5 文档页查阅 PRD。",
      "flow": {"current": "P14", "steps": [{"id": "P14", "title": "查看 PRD"}]},
      "changes": [],
      "states": []
    },
    {
      "id": "P01",
      "title": "配置服务请求万能表单",
      "file": "pages/P01-universal-form.html",
      "viewport": "PC",
      "requirements": [
        "R08"
      ],
      "illustration": "assets/illustrations/p01-form-configuration-xiaohei.png",
      "overview": "沿用万能表单配置列表，为服务请求单提供服务配置、已配置服务查看与删除，并展示项目名称、服务首页名称和关联的服务。",
      "pageRole": "运营人员维护服务请求单万能表单及其服务配置。",
      "scenario": "在服务请求单万能表单的操作中配置服务并维护已配置服务。",
      "flow": {
        "current": "P01",
        "steps": [
          {
            "id": "P01",
            "title": "配置服务请求万能表单"
          },
          {
            "id": "P02",
            "title": "字段回传配置"
          },
          {
            "id": "P03",
            "title": "服务模板绑定"
          }
        ]
      },
      "changes": [
        {
          "id": "P01-C01",
          "location": "列表筛选区和列表列",
          "action": "按表单类别筛选并展示类别",
          "result": "支持健康档案、工单、服务请求单"
        },
        {
          "id": "P01-C02",
          "location": "服务请求单类别标签",
          "action": "维护表单类别",
          "result": "该类别的 H5 表单可供项目服务绑定"
        },
        {
          "id": "P01-C03",
          "location": "服务请求单操作列和已配置服务抽屉",
          "action": "在配置服务列表中选择服务，并查看已配置服务或删除服务配置",
          "result": "配置服务列表展示项目名称、前端页面名称和关联服务名称；已配置服务展示项目名称、服务首页名称和关联的服务，并可删除"
        }
      ],
      "states": [
        {
          "id": "P01-S01",
          "title": "已配置服务"
        }
      ]
    },
    {
      "id": "P02",
      "title": "万能表单详情页面",
      "file": "pages/P02-universal-form-detail.html",
      "viewport": "PC",
      "requirements": [
        "R06",
        "R08"
      ],
      "illustration": "assets/illustrations/p02-form-detail-xiaohei.png",
      "overview": "沿用移动端表单设计器三栏布局，在字段右侧增加数据回传配置。",
      "pageRole": "运营人员配置单个万能表单字段。",
      "scenario": "选中联系电话字段后配置其回传规则。",
      "flow": {
        "current": "P02",
        "steps": [
          {
            "id": "P01",
            "title": "选择服务请求单"
          },
          {
            "id": "P02",
            "title": "字段回传配置"
          },
          {
            "id": "P03",
            "title": "服务模板绑定"
          }
        ]
      },
      "changes": [
        {
          "id": "P02-C01",
          "location": "字段右侧配置区",
          "action": "开启或关闭字段回传",
          "result": "关闭时不回传并隐藏其余回传项"
        },
        {
          "id": "P02-C02",
          "location": "数据回传配置分组",
          "action": "设置名称、阶段和状态时机",
          "result": "状态进入所选节点时回传该字段"
        }
      ],
      "states": []
    },
    {
      "id": "P03",
      "title": "项目编辑－前端配置",
      "file": "pages/P03-project-h5-config.html",
      "viewport": "PC",
      "requirements": [
        "R01",
        "R08"
      ],
      "illustration": "assets/illustrations/p03-project-config-xiaohei.png",
      "overview": "复刻项目编辑第三步前端配置弹窗，集中维护 H5 开关、服务入口及用户绑定规则。",
      "pageRole": "项目运营人员维护新华尊项目 H5 配置。",
      "scenario": "编辑新华尊项目的第三步前端配置。",
      "flow": {
        "current": "P03",
        "steps": [
          {
            "id": "P01",
            "title": "维护万能表单"
          },
          {
            "id": "P02",
            "title": "配置字段回传"
          },
          {
            "id": "P03",
            "title": "绑定项目服务"
          }
        ]
      },
      "changes": [
        {
          "id": "P03-C05",
          "location": "首页弹窗说明下方",
          "action": "设置是否绑定用户",
          "result": "选择否时，用户进入项目和发起服务均不校验权限，适合无备案项目使用"
        }
      ],
      "states": []
    },
    {
      "id": "P06",
      "title": "H5 服务发起万能表单",
      "file": "pages/P06-h5-service-request.html",
      "viewport": "H5",
      "requirements": [
        "R01",
        "R02",
        "R03",
        "R08"
      ],
      "illustration": "assets/illustrations/p06-h5-request-xiaohei.png",
      "overview": "用户通过新华尊项目链接进入后，填写后台绑定的服务请求单万能表单。",
      "pageRole": "用户发起服务请求。",
      "scenario": "用户已通过带加密用户号的新华尊 H5 链接进入。",
      "flow": {
        "current": "P06",
        "steps": [
          {
            "id": "P06",
            "title": "填写服务请求单"
          }
        ]
      },
      "changes": [
          {
            "id": "P06-C02",
          "location": "服务请求信息表单",
          "action": "加载绑定的万能表单",
          "result": "必填校验通过后创建服务请求"
          }
      ],
      "states": []
    },
    {
      "id": "P11",
      "title": "项目编辑-前端服务配置",
      "file": "pages/P11-project-service-form-config.html",
      "viewport": "PC",
      "requirements": [
        "R08"
      ],
      "illustration": "assets/illustrations/p11-front-service-xiaohei.png",
      "overview": "复刻项目编辑第三步前端配置页面，在关联服务下方支持选择服务请求万能表单，并提供设置万能表单说明入口。",
      "pageRole": "运营人员为项目服务配置前端展示及服务请求万能表单。",
      "scenario": "编辑新华尊项目的前端配置，为门诊预约服务选择服务请求万能表单。",
      "flow": {
        "current": "P11",
        "steps": [
          {
            "id": "P01",
            "title": "配置服务请求万能表单"
          },
          {
            "id": "P11",
            "title": "项目服务配置"
          },
          {
            "id": "P06",
            "title": "H5 发起服务请求"
          }
        ]
      },
      "changes": [
        {
          "id": "P11-C01",
          "location": "前端配置－服务卡片的关联服务下方",
          "action": "下拉选择服务请求万能表单",
          "result": "当前服务使用所选万能表单发起服务请求"
        },
        {
          "id": "P11-C02",
          "location": "选择服务表单右侧",
          "action": "点击“设置万能表单”查看后续设置说明",
          "result": "提示进入现有万能表单页面设置并保存后，系统创建模板且本页自动选择该模板"
        }
      ],
      "states": []
    },
    {
      "id": "P15",
      "title": "材料收集提醒",
      "file": "pages/P15-h5-material-collection-reminder.html",
      "viewport": "H5",
      "requirements": ["R05"],
      "illustration": "assets/illustrations/p15-material-reminder-xiaohei.png",
      "overview": "复刻项目服务首页，在服务菜单上方展示材料上传提醒。",
      "pageRole": "用户查看项目服务菜单及待上传材料提醒。",
      "scenario": "会员从项目首页查看待上传材料并进入材料收集。",
      "flow": {"current": "P15", "steps": [{"id": "P15", "title": "查看材料提醒"}, {"id": "P07", "title": "上传材料图片"}]},
      "changes": [{"id": "P15-C01", "location": "服务菜单上方", "action": "点击材料上传提醒", "result": "跳转至 P07 H5 材料收集页面"}],
      "states": []
    },
    {
      "id": "P16",
      "title": "材料审核提醒",
      "file": "pages/P16-material-review-reminder.html",
      "viewport": "PC",
      "requirements": ["R05"],
      "illustration": "assets/illustrations/p16-material-review-xiaohei.png",
      "overview": "复刻客服工作台待办事项页，展示待审核材料列表。",
      "pageRole": "材料审核人员查看并处理待审核材料提醒。",
      "scenario": "材料审核人员在待办事项中查看待审核材料记录。",
      "flow": {"current": "P16", "steps": [{"id": "P16", "title": "查看材料审核提醒"}, {"id": "P12", "title": "查看材料收集详情"}]},
      "changes": [{"id": "P16-C01", "location": "待审核材料列表操作列", "action": "点击查看详情", "result": "跳转至 P12 发起材料收集页面"}],
      "states": []
    },
    {
      "id": "P12",
      "title": "发起材料收集",
      "file": "pages/P12-material-collection-start.html",
      "viewport": "PC",
      "requirements": [
        "R05"
      ],
      "illustration": "assets/illustrations/p12-material-collection-xiaohei.png",
      "overview": "运营人员在工单中创建材料收集内容，并跟踪或代替用户上传图片。",
      "pageRole": "客服或运营人员为本次服务发起材料收集。",
      "scenario": "通用工单处理中，需要向用户收集病历资料。",
      "flow": {
        "current": "P12",
        "steps": [
          {
            "id": "P12",
            "title": "创建材料收集"
          },
          {
            "id": "P07",
            "title": "用户上传材料"
          },
          {
            "id": "P10",
            "title": "查看服务记录"
          }
        ]
      },
      "changes": [
        {
          "id": "P12-C01",
          "location": "服务信息－材料收集区域",
          "action": "新增多个收集内容，并分别设置材料标题和简介",
          "result": "每个收集内容独立维护标题、简介与发起状态"
        },
        {
          "id": "P12-C02",
          "location": "已创建材料收集卡片",
          "action": "为每个收集内容上传图片",
          "result": "支持图片、PDF、Word 附件；已上传文件展示类型卡片并支持逐项删除"
        },
        {
          "id": "P12-C03",
          "location": "材料收集卡片操作区",
          "action": "对每个收集内容发起、取消或删除材料收集任务",
          "result": "支持多个收集内容独立流转待用户上传、待审核、已完成状态并删除"
        }
      ],
      "states": []
    },
    {
      "id": "P17",
      "title": "报告推送",
      "file": "pages/P17-report-push.html",
      "viewport": "PC",
      "requirements": ["R07"],
      "illustration": "assets/illustrations/p17-report-push-xiaohei.png",
      "overview": "以材料收集工单为基线，在右侧维护待推送报告。",
      "pageRole": "客服或运营人员上传并向用户推送服务报告。",
      "scenario": "材料已收集完成，运营人员上传报告并推送给用户。",
      "flow": {"current": "P17", "steps": [{"id": "P12", "title": "材料收集"}, {"id": "P17", "title": "报告推送"}, {"id": "P10", "title": "查看服务记录"}]},
      "changes": [
        {"id": "P17-C01", "location": "服务信息－材料收集下方", "action": "选择本地报告文件上传", "result": "展示已上传文件及待推送状态"},
        {"id": "P17-C02", "location": "推送报告操作区", "action": "推送、撤销、编辑或重新推送报告", "result": "报告推送状态随操作更新"}
      ],
      "states": []
    },
    {
      "id": "P18",
      "title": "报告推送提醒",
      "file": "pages/P18-report-push-reminder.html",
      "viewport": "H5",
      "requirements": ["R07"],
      "illustration": "assets/illustrations/p18-report-reminder-xiaohei.png",
      "overview": "复刻项目服务首页，在材料上传提醒下方展示报告查看入口。",
      "pageRole": "用户在项目首页查看已推送的服务报告。",
      "scenario": "服务报告已推送，用户从项目首页进入服务记录详情。",
      "flow": {"current": "P18", "steps": [{"id": "P18", "title": "查看报告提醒"}, {"id": "P10", "title": "服务记录详情"}]},
      "changes": [{"id": "P18-C01", "location": "材料上传提醒下方", "action": "点击查看报告", "result": "跳转 P10 服务记录详情"}],
      "states": []
    },
    {
      "id": "P07",
      "title": "H5 材料收集",
      "file": "pages/P07-h5-material-collection.html",
      "viewport": "H5",
      "requirements": [
        "R05"
      ],
      "illustration": "assets/illustrations/p07-material-upload-xiaohei.png",
        "overview": "用户按 PC 端发起的材料标题、简介上传图片，并在提交时校验图片不为空。",
      "pageRole": "用户完成客服发起的材料收集。",
        "scenario": "用户上传本次服务要求的材料图片。",
      "flow": {
        "current": "P07",
        "steps": [
          {
            "id": "P07",
            "title": "上传材料图片"
          },
          {
            "id": "P10",
            "title": "查看服务记录"
          }
        ]
      },
      "changes": [
        {
          "id": "P07-C01",
            "location": "材料收集列表",
            "action": "点击上传后选择文件上传、拍照或相册；文件上传可选择图片、PDF、Word",
            "result": "已上传文件展示类型卡片并支持逐项删除"
        },
        {
          "id": "P07-C02",
            "location": "提交材料按钮",
            "action": "提交前校验每项材料是否已上传图片",
            "result": "存在空图片时提示“上传图片不能为空”"
        }
      ],
        "states": [
          {
            "id": "P07-S01",
            "title": "材料提交成功"
          }
        ]
    },
    {
      "id": "P10",
      "title": "服务记录详情",
      "file": "pages/P10-service-record-detail.html",
      "viewport": "H5",
      "requirements": [
        "R05",
        "R07"
      ],
      "illustration": "assets/illustrations/p10-service-record-xiaohei.png",
      "overview": "展示多轮材料历史和由运营人员手动推送的报告。",
      "pageRole": "用户查看材料及报告。",
      "scenario": "服务处理中，存在一轮需补充材料并已推送报告。",
      "flow": {
        "current": "P10",
        "steps": [
          {
            "id": "P07",
            "title": "补充材料"
          },
          {
            "id": "P10",
            "title": "查看服务详情"
          },
          {
            "id": "P17",
            "title": "报告推送"
          }
        ]
      },
      "changes": [
        {
          "id": "P10-C01",
          "location": "服务状态",
          "action": "展示当前进度",
          "result": "以睿聆处理结果为准"
        },
        {
          "id": "P10-C02",
          "location": "材料收集记录",
          "action": "展示每轮材料",
          "result": "可查看已上传与已替换文件"
        },
        {
          "id": "P10-C04",
          "location": "报告区域",
          "action": "查看已推送报告",
          "result": "仅报告完成并由运营人员手动推送后显示"
        }
      ],
      "states": []
    }
  ]
};
