import type {
  BarChartRevealProps,
  BeforeAfterProps,
  BentoGridProps,
  BulletCardProps,
  ChangelogCardProps,
  CountdownProps,
  DonutBreakdownProps,
  FeatureTrioProps,
  MetricCounterProps,
  ModalExplainerProps,
  ProductRevealProps,
  ScreenShowcaseProps,
  SocialPostProps,
  StaggeredWordsProps,
  StepListProps,
  StepTimelineProps,
  TypewriterLineProps,
  UiCalloutProps,
  UiFlowProps,
} from '../templates';

/**
 * Synthetic demo content shared by landscape and portrait registrations.
 * Keep committed examples fictional or explicitly redistributable. Private
 * production material may be used locally for stress tests, but must not be
 * committed to this repository.
 */
const STAGE = {palette: 'yoru-light', skin: 'hairline', rhythm: 'medium'} as const;

export const EXAMPLES = {
  barChartReveal: {
    ...STAGE,
    title: '季度增长',
    bars: [
      {label: 'Q1', value: 65, display: '65%'},
      {label: 'Q2', value: 78, display: '78%'},
      {label: 'Q3', value: 92, display: '92%'},
      {label: 'Q4', value: 100, display: '100%'},
    ],
  } satisfies BarChartRevealProps,

  donutBreakdown: {
    ...STAGE,
    title: '时间去哪了',
    segments: [
      {label: '研究', value: 32, display: '32%'},
      {label: '设计', value: 28, display: '28%'},
      {label: '开发', value: 26, display: '26%'},
      {label: '发布', value: 14, display: '14%'},
    ],
  } satisfies DonutBreakdownProps,

  metricCounter: {
    ...STAGE,
    badge: '✦',
    title: '这周做完的事',
    metricLabel: '完成任务',
    metricValue: 23,
    items: ['整理动效参考', '修掉排版问题', '补完三组测试'],
  } satisfies MetricCounterProps,

  countdown: {
    ...STAGE,
    title: '开播倒计时',
    units: [
      {label: 'DAYS', from: 12, to: 0},
      {label: 'HRS', from: 7, to: 0},
      {label: 'MIN', from: 40, to: 0},
    ],
    runFrames: 60,
  } satisfies CountdownProps,

  changelogCard: {
    ...STAGE,
    badge: 'v2.4.0',
    title: 'What is new',
    items: ['自动对轴', '时间线拖拽', '多套视觉皮肤', '一键导出代码'],
  } satisfies ChangelogCardProps,

  bulletCard: {
    ...STAGE,
    eyebrow: 'EXPLAINED',
    title: '什么是 Motion System',
    bullets: ['一套可复用的结构与节奏', '主题和内容分开', '同一个模板适配横竖屏'],
  } satisfies BulletCardProps,

  socialPost: {
    ...STAGE,
    author: 'Mika Studio',
    handle: '@mika_motion',
    body: '新一期制作日志上线了。这次记录从草图、结构测试到最终成片的完整过程。',
    stats: [
      {icon: '❤️', value: 1284},
      {icon: '💬', value: 96},
      {icon: '👁', value: 18420},
    ],
  } satisfies SocialPostProps,

  staggeredWords: {
    ...STAGE,
    kicker: 'MOTION STUDY',
    text: 'Design. Build. Ship.',
    align: 'center',
    step: 6,
  } satisfies StaggeredWordsProps,

  typewriterLine: {
    ...STAGE,
    kicker: 'NOW LOADING',
    text: 'Building the future.',
    cps: 7,
    caret: true,
  } satisfies TypewriterLineProps,

  beforeAfter: {
    ...STAGE,
    beforeLabel: 'BEFORE',
    afterLabel: 'AFTER',
    before: ['手动整理', '反复导出', '改一处重来'],
    after: ['结构复用', '快速预览', '内容与布局分离'],
  } satisfies BeforeAfterProps,

  stepTimeline: {
    ...STAGE,
    title: '一条片子怎么走完',
    steps: [
      {label: '想法', caption: '定角度'},
      {label: '素材', caption: '内容入库'},
      {label: '编排', caption: '结构先行'},
      {label: '发布', caption: '导出成片'},
    ],
    style: 'node',
  } satisfies StepTimelineProps,

  stepList: {
    ...STAGE,
    title: 'How it works',
    steps: ['Choose a structure', 'Replace the content', 'Render and review'],
    underline: true,
  } satisfies StepListProps,

  screenShowcase: {
    ...STAGE,
    appTitle: 'Dashboard',
    features: ['实时数据', '团队协作', '自定义报表'],
  } satisfies ScreenShowcaseProps,

  uiFlow: {
    ...STAGE,
    title: 'Book appointment',
    subtitle: 'Demo Clinic · March 28',
    options: ['9:00 AM', '10:30 AM', '2:00 PM'],
    selected: 1,
    cta: 'Confirm booking',
  } satisfies UiFlowProps,

  uiCallout: {
    ...STAGE,
    appTitle: 'Workspace',
    callout: 'Real-time collaboration',
  } satisfies UiCalloutProps,

  modalExplainer: {
    ...STAGE,
    title: 'How it works',
    subtitle: 'Get started in three simple steps',
    steps: [
      {label: 'Connect', caption: 'Link a demo account'},
      {label: 'Choose', caption: 'Pick a template that fits'},
      {label: 'Ship', caption: 'Render and publish'},
    ],
    pageFrames: 38,
  } satisfies ModalExplainerProps,

  bentoGrid: {
    ...STAGE,
    cells: [
      {icon: '📊', label: 'Analytics'},
      {icon: '⚡', label: 'Fast API'},
      {icon: '🔒', label: 'Secure'},
      {icon: '🌍', label: 'Global'},
      {icon: '🔑', label: 'Auth'},
      {icon: '🔗', label: 'Webhooks'},
    ],
  } satisfies BentoGridProps,

  featureTrio: {
    ...STAGE,
    title: 'EVERYTHING YOU NEED',
    features: [
      {icon: '◼', label: 'FAST', caption: 'Built for speed'},
      {icon: '◼', label: 'CLEAR', caption: 'Readable by default'},
      {icon: '◼', label: 'SHIP IT', caption: 'Idea to render'},
    ],
  } satisfies FeatureTrioProps,

  productReveal: {
    ...STAGE,
    name: 'Studio Headphones',
    price: '$249',
    comparePrice: '$299',
  } satisfies ProductRevealProps,
};
