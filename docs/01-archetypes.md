# 01 · 41 个 keep → 模板原型

> 数据来源：`yoru-motion-research/curation/locomotion-2026-08-19.json.bz2`（427 条，41 keep / 123 maybe / 263 reject）。
> 原片来源：本地研究用渲染参考集（不随仓库分发），427 个 MP4，全部为 **960×540 / 30fps / 90 帧 = 3.00 秒 / 16:9**。
> 本文只做归类，不做实现；动效数值见 [`02-motion-rules.md`](02-motion-rules.md)。

## 先说三件确定的事

**1. 你筛的是同一套基准。** 427 条素材尺寸、帧率、时长完全一致，所以家族之间的差异只可能来自结构和节奏，不可能来自"这条做得更长更精致"。这让 keep/reject 有可比性。

**2. style 只是皮肤。** 同一家族的 7 个 variant，布局坐标和时间轴逐帧一致，只有边框宽度、圆角、阴影、字体族在变。这是把 `templates` 和 `themes` 拆成两层的直接依据——不是设计偏好，是从素材里量出来的。

**3. 你留下的全是"有话要说"的结构。** 41 个 keep 全部承载信息：数字、清单、对比、步骤、界面状态。纯装饰型结构全灭（下面第 9 节）。

---

## 归类总表

41 个 keep 落在 **20 个家族**、**7 类原型**里。第 8 类（intro/outro）在数据里是空的。

| # | 原型 | keep 数 | 家族（keep 的 style） | 已实现模板 |
|---|---|---:|---|---|
| 1 | 数据 / 数字展示 | 10 | bar-chart-reveal(4)、countdown-timer(3)、day-summary(2)、portfolio-breakdown(1) | `BarChartReveal` `Countdown` `MetricCounter` `DonutBreakdown` |
| 2 | 信息卡片 | 6 | changelog(4)、concept-breakdown(2) | `ChangelogCard` `BulletCard` |
| 3 | social post / 内容卡 | 1 | social-post(1) | `SocialPost` |
| 4 | 产品 UI 演示 | 12 | appointment-booking(5)、screen-showcase(2)、app-feature-callout(1)、bento-grid(1)、feature-showcase(1)、modal-explainer(1)、product-reveal(1) | `UiFlow` `ScreenShowcase` `UiCallout` `BentoGrid` `FeatureTrio` `ModalExplainer` `ProductReveal` |
| 5 | 标题 / 文字入场 | 4 | staggered-words(2)、typewriter-reveal(2) | `StaggeredWords` `TypewriterLine` |
| 6 | timeline / step explainer | 5 | patient-journey(3)、step-explainer(1)、payment-flow(1) | `StepTimeline` `StepList` |
| 7 | before / after | 3 | before-after(3) | `BeforeAfter` |
| 8 | intro / outro | **0** | —— | 不做（见第 9 节） |

合计 10+6+1+12+4+5+3 = **41**。每一个 keep 都有归属，没有丢。

---

## 1. 数据 / 数字展示

**共同骨架**：一个左对齐标题，下面一组同类数据元素，元素之间等距，数值贴在元素上而不是另起一栏。

| 家族 | 战绩 | 结构 | 为什么单独成模板 |
|---|---|---|---|
| `bar-chart-reveal` | 4 keep / 2 maybe / 1 reject | 标题 + 4 根柱 + 柱顶数值 + 基线下类目 | 全集第三强家族。四个 variant 都留 = 结构本身成立 |
| `countdown-timer` | 3 keep / 1 maybe / 3 reject | 标题 + 3 个数字方块（DAYS/HRS/MIN），数字持续跑 | 唯一一个动作贯穿全片的结构 |
| `day-summary` | 2 keep / 3 maybe / 2 reject | 卡片 + 一个大数字指标行 + 勾选清单 | 数字和清单混排，有"逐条打勾"的二次动作 |
| `portfolio-breakdown` | 1 keep / 5 maybe / 1 reject | 环形图 + 右侧图例（色块 + 名称 + 数值） | 唯一的构成比结构；5 个 maybe 说明结构 OK、皮肤没定 |

**共同规则**：数据颜色是**明度阶**，不是色相。浅底从浅到深，深底从深到浅。41 个 keep 里没有一个用彩色编码序列。

---

## 2. 信息卡片

| 家族 | 战绩 | 结构 |
|---|---|---|
| `changelog` | 4 keep / 3 maybe / **0 reject** | 卡片 + 版本 pill + 大标题 + 带分隔线的清单行（图标 + 文字） |
| `concept-breakdown` | 2 keep / 4 maybe / 1 reject | eyebrow 小标签 + 大标题 + 项目符号列表，**没有卡片** |

`changelog` 是全集仅有的两个零否决家族之一。它和 `concept-breakdown` 的差别值得记：一个有容器，一个没有。有容器的适合"一份东西"（更新日志、清单、票据），没容器的适合"一段话"（概念、观点）。我把它们做成两个模板而不是一个带开关的模板，因为它们的排版重心不同。

---

## 3. social post / 内容卡

`social-post`：1 keep / 2 maybe / 4 reject。头像 + 名字 + handle + 正文段落 + 分隔线 + 互动数据行。

正文是**整段淡入**，不是逐词。这点和标题类模板正好相反——引用是拿来读的，不是拿来表演的。

---

## 4. 产品 UI 演示

这是 keep 最多的一类（12 个），也是内部差异最大的。拆成六种：

| 家族 | 战绩 | 结构 | 关键动作 |
|---|---|---|---|
| `appointment-booking` | **5 keep / 2 maybe / 0 reject** | 卡片 + 标题副标题 + 可选行列表 + 主按钮 | 选中态在行**已经出现之后**才亮；按钮最后到 |
| `screen-showcase` | 2 keep / 1 maybe / 4 reject | 浏览器窗口 + 内容块 + 右侧编号功能列表 | 窗口先到，主张后到 |
| `app-feature-callout` | 1 keep / 2 maybe / 4 reject | 窗口 + 从右缘滑出的 pill 标注 | 标注**从界面里长出来**，不是盖上去 |
| `bento-grid` | 1 keep / 0 maybe / 6 reject | 大小不等的卡片网格（图标 + 标签） | 只有 brutalist 被留下 |
| `feature-showcase` | 1 keep / 0 maybe / 6 reject | 居中标题 + 三张并列特性卡 | default 被否、brutalist 被留 |
| `modal-explainer` | 1 keep / 0 maybe / 6 reject | 遮罩 + 模态卡 + 内部翻页（步骤 1 → 2） | 唯一有"内部换页"的结构 |
| `product-reveal` | 1 keep / 2 maybe / 4 reject | 大图卡 + 商品名 + 价格（带划线原价） | 只有三拍，靠克制取胜 |

`appointment-booking` 是全集第一强：**7 个 variant 里 5 个 keep，0 个 reject**。它在 brutalist / dark / glass / minimal / neo 五种完全不同的皮肤下都被留下来了，这基本上排除了"因为好看才留"的可能——留的是结构。

---

## 5. 标题 / 文字入场

| 家族 | 战绩 | 结构 |
|---|---|---|
| `staggered-words` | 2 keep / 2 maybe / 3 reject | 大字居中，逐词淡入 |
| `typewriter-reveal` | 2 keep / 0 maybe / 5 reject | 等宽字体，逐字打出，光标闪烁 |

`typewriter-reveal` 是标准的"结构成立、皮肤挑食"案例：只有 default 和 dark 被留，其余 5 个全否，一个 maybe 都没有。

两者都有一条硬规则：**整行文字在第 0 帧就已经排好版**，词只是在自己的最终位置上淡入。我逐帧量过第一个词的 x 坐标，全程不动。这决定了实现方式——不能用"逐词 append 到 DOM"，那会导致整行反复重排。

---

## 6. timeline / step explainer

| 家族 | 战绩 | 结构 |
|---|---|---|
| `patient-journey` | 3 keep / 2 maybe / 2 reject | 横向：编号圆点 + 虚线连接 + 下方标签 |
| `payment-flow` | 1 keep / 2 maybe / 4 reject | 横向：带框步骤 chip + 破折号连接 |
| `step-explainer` | 1 keep / 1 maybe / 5 reject | 纵向：`01/02/03` + 标签 + **自左向右画出的下划线** |

横向和纵向差别足够大，做成两个模板（`StepTimeline` / `StepList`）。`payment-flow` 的 chip 版本作为 `StepTimeline` 的一个 `style` 参数，因为它和 `patient-journey` 的时间轴逻辑完全一样，只有节点形状不同。

`step-explainer` 值得注意：**default 被否、glass 被留**。全集只有 3 个家族出现这种"非默认皮肤救活了被否的默认版"，另两个是 `bento-grid` 和 `feature-showcase`。这三个家族的皮肤是真的在做事，不是装饰。

---

## 7. before / after

`before-after`：3 keep / 2 maybe / 2 reject。左 BEFORE（红色 ✗ 列表）+ 箭头 + 右 AFTER（✓ 列表）。

两侧**不对等**：AFTER 边框是全对比度，BEFORE 是弱化的。这个不对称是这个结构的全部意义——如果两边一样重，它就退化成一张双栏表格。

---

## 8. intro / outro —— 数据不支持

你列的第 8 类，在 41 个 keep 里**一个都没有**：

- `intro-outro`：0 keep / 2 maybe / 5 reject
- `logo-reveal`：0 keep / 0 maybe / **7 reject**
- `milestone-counter`、`achievement-unlock`、`product-hunt`、`level-up`、`bold-text-punch`、`gradient-text`、`meme-card`、`culture-reel`、`lesson-intro`、`leaderboard`、`fade-slide-up`、`toggle-switch`：全部 7 个 variant 全否

13 个家族的 7 个 variant 全军覆没。它们的共同点：**动作本身就是内容**——logo 变形、粒子炸开、数字冲击、渐变文字。而你留下的 41 个，动作全都在服务一段要传达的信息。

所以这一版不做 intro/outro。用 `StaggeredWords` / `TypewriterLine` 加品牌字标顶替，等你另外筛一批开场素材再单独立类。

---

## 9. 皮肤怎么选（从 427 条统计）

| skin | keep | keep 率 | 结论 |
|---|---:|---:|---|
| `default` | 10 | 16.4% | 最安全的起点 → 系统里叫 `hairline` |
| `dark` | 9 | 14.8% | 次安全 → 做成 `neutral-dark` / `yoru-dark` 两套配色 |
| `brutalist` | 8 | 13.1% | 挑结构，但对的结构上很强 → 保留 |
| `glass` | 7 | 11.5% | 同上 → 保留 |
| `minimal` | 3 | 4.9% | 弱 → 清理成 `flat` 保留（screen-showcase / before-after 靠它得分） |
| `neo` | 2 | 3.3% | **不做**。61 个里 2 个是噪声，不是证据 |
| `rounded` | 2 | 3.3% | **不做**。同上 |

系统最终出 4 个 skin：`hairline` / `brutalist` / `glass` / `flat`，配 4 套 palette（`neutral-light`、`neutral-dark`、`yoru-light`、`yoru-dark`）。

---

## 10. 三个家族的悬案

`agenda-reveal`、`cart-animation`、`pricing-comparison` 是 **0 keep / 7 maybe / 0 reject**——你对这三个结构一个都没否，也一个都没留。数据上它们是待定，不是不喜欢。等你哪天想清楚了再说，agent 不该替你二选一。
