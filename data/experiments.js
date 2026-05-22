export const levels = [
  {
    key: "beginner",
    title: "初阶",
    subtitle: "从现象入门，建立安全习惯与观察表达能力",
    description: "适合刚接触化学实验的学生，重点是器材认识、基础现象观察和规范操作。",
    focus: ["现象描述", "器材认识", "实验安全"],
    badgeClass: "badge-beginner"
  },
  {
    key: "intermediate",
    title: "中阶",
    subtitle: "进入制备、检验与沉淀反应的核心实验",
    description: "开始接触气体制备、物质鉴别和方程式理解，让实验和化学语言对应起来。",
    focus: ["气体制备", "物质检验", "沉淀生成"],
    badgeClass: "badge-intermediate"
  },
  {
    key: "advanced",
    title: "高阶",
    subtitle: "面向探究、设计与综合分析",
    description: "强调控制变量、实验对照、误差分析和综合探究，更接近项目式学习。",
    focus: ["变量控制", "实验设计", "综合推断"],
    badgeClass: "badge-advanced"
  }
];

export const experiments = [
  {
    slug: "acid-base-indicator",
    title: "酸碱指示剂变色",
    levelKey: "beginner",
    level: "初阶",
    badgeClass: "badge-beginner",
    summary: "通过紫甘蓝汁或石蕊试液观察不同溶液的颜色变化，建立酸碱概念。",
    objective: "学会利用指示剂判断溶液的酸碱性，训练颜色变化的观察与记录。",
    materials: ["紫甘蓝汁或石蕊试液", "稀盐酸", "白醋", "肥皂水", "食用碱水", "滴管", "试管"],
    steps: [
      "在不同试管中分别加入少量待测溶液。",
      "向每支试管滴加相同体积的指示剂。",
      "轻轻振荡并记录颜色变化。",
      "比较不同溶液对应的颜色，并归纳酸碱性特征。"
    ],
    observation: "酸性溶液和碱性溶液会使指示剂呈现明显不同的颜色，中性溶液变化较小。",
    equation: "该实验以酸碱指示剂显色规律为主，一般不要求写具体反应方程式。",
    safety: "使用稀酸时避免接触眼睛和皮肤；实验液不可入口。",
    safetyNotes: ["试剂量保持少量，避免泼洒。", "实验后及时清洗滴管和试管。", "若接触皮肤，立即用大量清水冲洗。"],
    practice: ["为什么同一种指示剂在不同溶液中会出现不同颜色？", "能否只通过颜色就精确判断溶液浓度？为什么？"],
    tags: ["颜色变化", "酸碱性", "入门观察"],
    sceneVariant: "hero"
  },
  {
    slug: "iron-copper-displacement",
    title: "铁与硫酸铜置换反应",
    levelKey: "beginner",
    level: "初阶",
    badgeClass: "badge-beginner",
    summary: "观察铁钉表面析出红色物质和溶液颜色变化，理解金属活动性顺序的基础现象。",
    objective: "认识置换反应的基本现象，理解铁比铜更活泼的实验依据。",
    materials: ["洁净铁钉", "硫酸铜溶液", "试管", "镊子", "滤纸"],
    steps: [
      "向试管中加入适量硫酸铜溶液。",
      "将打磨干净的铁钉放入试管中。",
      "静置几分钟，观察铁钉表面和溶液颜色变化。",
      "取出铁钉并用滤纸轻轻吸去表面液体。"
    ],
    observation: "铁钉表面附着红色铜，蓝色溶液逐渐变浅并带有浅绿色。",
    equation: "Fe + CuSO4 = FeSO4 + Cu",
    safety: "实验后清洗手部，避免硫酸铜残留；铁钉边缘可能尖锐。",
    safetyNotes: ["铁钉使用前要打磨，避免氧化层影响现象。", "不要用手直接揉搓反应后的铜层。", "废液按实验室要求集中处理。"],
    practice: ["为什么要先打磨铁钉表面？", "溶液颜色变化说明了什么？"],
    tags: ["置换反应", "金属活动性", "颜色观察"],
    sceneVariant: "feature"
  },
  {
    slug: "carbon-dioxide-preparation",
    title: "酸与碳酸盐反应制取二氧化碳",
    levelKey: "intermediate",
    level: "中阶",
    badgeClass: "badge-intermediate",
    summary: "通过大理石与稀盐酸反应制取二氧化碳，并用澄清石灰水完成检验。",
    objective: "理解二氧化碳制备、收集和检验的完整思路。",
    materials: ["大理石", "稀盐酸", "锥形瓶", "单孔塞", "导管", "澄清石灰水"],
    steps: [
      "向锥形瓶中加入适量大理石。",
      "滴加稀盐酸并快速塞紧导管装置。",
      "观察锥形瓶内气泡生成情况。",
      "将产生的气体通入澄清石灰水，记录变化。"
    ],
    observation: "反应过程中产生大量气泡，石灰水逐渐变浑浊。",
    equation: "CaCO3 + 2HCl = CaCl2 + H2O + CO2↑",
    safety: "防止液体倒吸；酸液不可过量泼洒；实验结束后及时拆除装置。",
    safetyNotes: ["导管伸入石灰水不宜过深。", "先移导管后停反应，避免倒吸。", "注意酸液使用量，避免污染桌面。"],
    practice: ["为什么制取二氧化碳时常用大理石而不是粉末状碳酸钙？", "为什么不直接用浓盐酸做该实验？"],
    tags: ["气体制备", "检验方法", "石灰水"],
    sceneVariant: "feature",
    subtitle: "从气泡生成到石灰水变浑浊，建立完整的制气与检验思路",
    highlights: ["装置搭建", "连续产气", "气体检验", "防倒吸"],
    knowledge: [
      "大理石主要成分是碳酸钙，和稀盐酸反应时能稳定放出二氧化碳。",
      "澄清石灰水变浑浊，是因为生成了难溶于水的碳酸钙沉淀。",
      "浓盐酸挥发性强，会带出氯化氢气体，干扰二氧化碳检验现象。"
    ],
    teacherPrompt: [
      "如果把导管插得过深，实验停止时为什么容易倒吸？",
      "为什么选择块状大理石而不是粉末状碳酸钙？",
      "怎样区分“有气体产生”和“已经确认是二氧化碳”这两个判断？"
    ]
  },
  {
    slug: "precipitation-reaction",
    title: "氯化钠与硝酸银沉淀反应",
    levelKey: "intermediate",
    level: "中阶",
    badgeClass: "badge-intermediate",
    summary: "混合两种无色溶液后快速出现白色沉淀，帮助学生理解复分解反应和离子检验。",
    objective: "认识沉淀生成条件，并理解氯离子检验的实验依据。",
    materials: ["氯化钠溶液", "硝酸银溶液", "试管", "滴管", "试管架"],
    steps: [
      "分别取少量氯化钠溶液和硝酸银溶液于不同容器。",
      "将硝酸银溶液滴入氯化钠溶液中。",
      "轻轻振荡后观察沉淀生成情况。",
      "记录沉淀颜色和变化速度。"
    ],
    observation: "两种无色溶液混合后立即出现白色絮状沉淀。",
    equation: "NaCl + AgNO3 = AgCl↓ + NaNO3",
    safety: "硝酸银可能污染皮肤和衣物，操作时佩戴手套更稳妥。",
    safetyNotes: ["使用滴管时避免交叉污染试剂。", "硝酸银若接触皮肤要及时冲洗。", "实验废液不要直接倒入普通水池。"],
    practice: ["为什么这个实验能用来检验氯离子？", "如果溶液中有其他离子，会不会影响观察？"],
    tags: ["沉淀反应", "离子检验", "复分解反应"],
    sceneVariant: "hero"
  },
  {
    slug: "reaction-rate-control",
    title: "反应条件对速率的影响",
    levelKey: "advanced",
    level: "高阶",
    badgeClass: "badge-advanced",
    summary: "通过改变温度、浓度或固体表面积，比较气体生成快慢，建立控制变量意识。",
    objective: "学会设置对照实验，分析影响化学反应速率的关键条件。",
    materials: ["碳酸钙颗粒或粉末", "稀盐酸", "不同温度水浴", "计时器", "锥形瓶", "导管"],
    steps: [
      "设计两组或三组只改变一个条件的对照实验。",
      "同步开始反应并记录相同时间内产生气泡的快慢。",
      "整理数据并比较反应速率差异。",
      "分析哪个变量导致了速率变化。"
    ],
    observation: "浓度更高、温度更高或固体表面积更大时，通常气泡产生更快。",
    equation: "可结合具体体系书写，例如 CaCO3 + 2HCl = CaCl2 + H2O + CO2↑",
    safety: "多组反应同时进行时要保持操作节奏，防止酸液泼洒和记录混乱。",
    safetyNotes: ["一次只改变一个变量。", "所有组别的起始量要尽可能一致。", "实验前先写好记录表，避免边做边改。"],
    practice: ["为什么控制变量是这个实验最重要的部分？", "如果两组实验差异不明显，可能是什么原因？"],
    tags: ["控制变量", "探究实验", "反应速率"],
    sceneVariant: "feature"
  },
  {
    slug: "substance-inference",
    title: "未知物质的综合推断",
    levelKey: "advanced",
    level: "高阶",
    badgeClass: "badge-advanced",
    summary: "整合变色、沉淀、气体和加热等线索，对未知样品进行逐步推断。",
    objective: "训练学生基于实验现象进行多步推理，形成完整的证据链。",
    materials: ["若干未知样品", "指示剂", "稀酸", "石灰水", "硝酸银溶液", "试管", "酒精灯"],
    steps: [
      "先观察样品外观与溶解性，初步分类。",
      "根据题设选择合适试剂逐步验证。",
      "将每一步现象记录在推断表格中。",
      "最后综合所有现象给出结论并说明依据。"
    ],
    observation: "不同试剂会带来颜色变化、沉淀生成、气体产生或无明显变化等多类线索。",
    equation: "根据具体推断路径书写相关反应方程式，不同题目会有不同答案。",
    safety: "涉及加热和多种试剂时，操作顺序和标签管理必须清晰。",
    safetyNotes: ["所有未知样品都要贴清楚编号。", "未确认成分前不要随意混合大量试剂。", "加热时试管口不要朝向人。"],
    practice: ["如何避免在推断题中因为一次误判导致后续全错？", "为什么要把现象和结论分开记录？"],
    tags: ["综合推断", "证据链", "实验设计"],
    sceneVariant: "hero"
  }
];

export const featuredSlug = "carbon-dioxide-preparation";

export function getExperimentBySlug(slug) {
  return experiments.find((experiment) => experiment.slug === slug);
}
