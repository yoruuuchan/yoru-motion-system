# 用这套系统做一条片子

## 0. 先想清楚这一段要说什么

这套模板全部是"有话要说"的结构——数字、清单、对比、步骤、界面状态。如果你想不出这一段要传达什么，那大概率不需要模板，需要的是素材本身。

## 1. 挑原型

| 你要说的 | 用哪个 |
|---|---|
| 几个数比一比 | `BarChartReveal` |
| 一个整体拆成几块 | `DonutBreakdown` |
| 一个大数字 + 做了哪些事 | `MetricCounter` |
| 还剩多久 | `Countdown` |
| 更新了什么 / 一份清单 | `ChangelogCard` |
| 一个概念 + 几条要点 | `BulletCard` |
| 一条帖子 / 一段引用 | `SocialPost` |
| 一句话开场 | `StaggeredWords`（逐词）/ `TypewriterLine`（逐字） |
| 以前 vs 现在 | `BeforeAfter` |
| 流程走一遍 | `StepTimeline`（横向节点）/ `StepList`（纵向清单） |
| 产品长什么样 + 有什么 | `ScreenShowcase` |
| 界面上的一次操作 | `UiFlow` |
| 指着界面某处说话 | `UiCallout` |
| 一次讲三步的弹窗 | `ModalExplainer` |
| 能力一览 | `BentoGrid` / `FeatureTrio` |
| 一件商品 | `ProductReveal` |

## 2. 定 palette / skin / rhythm

```tsx
palette: 'yoru-light' | 'yoru-dark' | 'neutral-light' | 'neutral-dark'
skin:    'hairline' | 'brutalist' | 'glass' | 'flat'
rhythm:  'slow' | 'medium' | 'fast'
```

不确定就用 `yoru-light` + `hairline` + `medium`。数据上 `default` 皮肤是你最常留下的一种。

想一次看完所有组合：

```bash
node scripts/theme-matrix.mjs UiFlow
```

## 3. 填内容，别改时长

时长由 `xxxDuration(props)` 算出来：`最后一拍 + 回弹稳定 + 静帧`。多加一行清单，片子自动变长。

**不要手动缩短**去凑时间线。结尾那 1 秒静帧是设计的一部分——没有它，观众来不及读完最后一行。真要压节奏，改 `rhythm: 'fast'`，整条编排会按比例压缩，而不是把最后一拍砍掉。

## 4. 放素材

所有图片、视频位都走 `Placeholder`：

```tsx
screen: 'shots/dashboard.png'      // public/ 下的相对路径
screen: 'clips/demo.mp4'           // mp4/mov/webm 自动走 OffthreadVideo
screen: undefined                  // 渲染主题化骨架块
```

**不填也能出片。** 骨架块和真图占同样大小的格子，换成真图不会推动画面上任何别的东西。可以先把整条片子的结构搭完再补素材。

## 5. 看，然后渲

```bash
npm run studio                                   # 浏览
node scripts/stills.mjs BarChart                 # 抽几张静帧仔细看
npm run render -- BarChartReveal out/chart.mp4   # 出真片
```

**Studio 里好看不算通过。** 至少渲一条真的 MP4 再判断——第一版的 `yoru-light` 数据色阶最浅那一档在 Studio 里看着还行，渲出来图例几乎消失。

## 6. 竖屏检查

每个模板都注册了 `-9x16` 版本。做竖屏内容时直接切过去看，别用 16:9 的结果推断——横竖屏是两套排版，不是缩放。

## 7. 拼成完整片子

单个模板是一"段"，不是一条片子。拼接用 Remotion 的 `<Series>`：

```tsx
<Series>
  <Series.Sequence durationInFrames={staggeredWordsDuration(intro)}>
    <StaggeredWords {...intro} />
  </Series.Sequence>
  <Series.Sequence durationInFrames={barChartRevealDuration(chart)}>
    <BarChartReveal {...chart} />
  </Series.Sequence>
</Series>
```

段与段之间目前是硬切。转场还没做——原素材里没有转场证据，等你另外筛一批再说。

## 8. 遇到不对劲的地方

先看 `docs/02-motion-rules.md` 里那条规则是"实测"还是"我们自己定的"。实测的那些是从你自己筛出来的片子里量出来的，改之前值得想一下；标为未验收的（竖屏、真实素材、遮罩、中文排版）本来就等着你推翻。
