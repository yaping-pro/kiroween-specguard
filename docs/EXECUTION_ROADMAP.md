# Kiroween 2026 技术路线执行全景图与后续排期指南 (SSOT)

> **项目名称**：SpecGuard Crew（Skeleton Crew 赛道）  
> **创作者**：Steven Ma (`hi.steven.ma@gmail.com`)  
> **当前状态**：Phase 1 ~ Phase 3 全部完成，等待 Didit 邮件核验与终审提交

---

## 一、 当前已就绪的技术资产清单（Ready Assets）

| 资产模块 | 文件位置 | 状态 | 验证结果 |
| :--- | :--- | :--- | :--- |
| **Devpost 官方报名** | `https://kiroween.devpost.com/` | **已完成** | 已正式登记进入 Kiroween 2026 参赛者名单 |
| **AWS Kiro 账号绑定** | `https://app.kiro.dev/settings/account` | **已完成** | User ID: `d-9067c98495.a4086408-9081-70b4-7fb6-f78f4ff0a982` |
| **4000 积分表单** | Google Form (Kiroween Credits) | **已提交** | 状态："Your response has been recorded" |
| **Kiro 规范体系** | `.kiro/{steering,specs,hooks,agents,settings}` | **已就绪** | 包含 EARS 格式规范、PostFileSave 自动测试 Hook、MCP 配置 |
| **核心骨架模板** | `core-template/src/` | **已就绪** | 纯函数状态机 + fast-check 生成式属性测试桥接 |
| **独立应用 1 (密码保险箱)** | `app-1-necromancer-vault/src/` | **已就绪** | 基于 $GF(256)$ 的门限秘密共享，测试通过 |
| **独立应用 2 (暗黑订单簿)** | `app-2-potions-exchange/src/` | **已就绪** | 高频限价撮合引擎，严格保持资产价值守恒，测试通过 |
| **交互式 Web UI** | `public/index.html` + `serve.ts` | **已就绪** | 包含实时 Invariant Radar 与 1,000 次 PBT 压力测试面板 |
| **全套评审外宣物料** | `docs/{KIRO_USAGE,VIDEO_SCRIPT,BLOG,SOCIAL}.md` | **已就绪** | 结构化报告、分镜脚本、博客草稿、推文草稿全齐 |

---

## 二、 核心技术路线与架构全景（Architecture Blueprint）

```
                         ┌────────────────────────────────────────┐
                         │   .kiro/ Architectural Governance      │
                         │   • Steering (product / tech / struct) │
                         │   • EARS Specs (WHEN ... SHALL ...)    │
                         │   • Hooks (pbt-verify-on-save.json)    │
                         └───────────────────┬────────────────────┘
                                             │
                                             ▼
                         ┌────────────────────────────────────────┐
                         │   core-template/ Invariant Engine      │
                         │   • Pure Functional State Machine      │
                         │   • Fast-Check Generative PBT Bridge   │
                         │   • PbtRadarWidget (Realtime Telemetry)│
                         └───────────┬────────────────┬───────────┘
                                     │                │
            ┌────────────────────────┘                └────────────────────────┐
            ▼                                                                  ▼
┌──────────────────────────────────────┐            ┌──────────────────────────────────────┐
│ app-1-necromancer-vault              │            │ app-2-potions-exchange               │
│ • Domain: Cryptographic Zero-Knowledge│           │ • Domain: High-Frequency Dark Market │
│ • Primitives: Galois Field GF(256)   │            │ • Algorithms: FIFO Price-Time Match  │
│ • Invariant: Perfect (k, n) Roundtrip│            │ • Invariant: Value Conservation      │
└──────────────────────────────────────┘            └──────────────────────────────────────┘
                                     │                │
                                     └────────┬───────┘
                                              ▼
                         ┌────────────────────────────────────────┐
                         │        Interactive Web Dashboard       │
                         │        (public/index.html - Zero Deps) │
                         └────────────────────────────────────────┘
```

---

## 三、 后续执行时间表与操作指南（Follow-up Action Steps）

### 阶段 1：查收 Didit 实名邮件并激活 4,000 积分（预计 11-02 ~ 11-03）
1. **盯紧邮箱**：留意发件人为 Devpost 或 Didit 的邮件（标题通常含 `Identity Verification` 或 `Kiroween`）。
2. **手机认证**：点开链接，手机拍摄身份证件正面 + 活体自拍，耗时约 2 分钟。
3. **兑换积分**：
   * 认证通过后系统会发放 Kiroupon 兑换链接；
   * 打开链接登录 Kiro，看到绿色 `Kiroupon successfully redeemed!` 即激活成功（必须在 12 月 4 日前激活）。

### 阶段 2：GitHub 仓库开源与 Live URL 上线（预计 10 分钟）
1. **推送 GitHub**：
   * 仓库命名为 `kiroween-specguard`（设为 Public）；
   * 在 GitHub 仓库的 **About 栏** 填写项目描述并勾选 MIT License。
2. **部署在线页面**：
   * 将仓库导入 **Vercel** 或开启 **GitHub Pages**，根目录指向 `public/index.html`；
   * 产出的链接即可作为 Devpost 要求的 `Working Application URL`。

### 阶段 3：录制 2 分钟实操视频与外宣（预计 15 分钟）
1. **录屏**：
   * 打开部署好的 Live URL，按照 `docs/VIDEO_SCRIPT.md` 的指引演示：
     - 点击 App-1 的分片与恢复（展示门限不足被拦截，门限满足瞬间恢复）；
     - 点击 App-2 的撮合交易与点击 `⚡ Run 1,000 PBT Stress Pass` 按钮；
     - 镜头切换到 Kiro IDE 展示 `.kiro/` 目录。
2. **配音与上传**：
   * 可直接朗读 `docs/VIDEO_SCRIPT.md` 的英文旁白（或通过剪映/TTS 生成）；
   * 视频上传至 YouTube，隐私选项必须设为 **Public（公开）**，时长严控在 3 分钟以内。
3. **同步发布附加奖博客与推文**：
   * 将 `docs/BLOG_POST.md` 发布在 Medium / Dev.to（文末包含固定声明）；
   * 将 `docs/SOCIAL_POST.md` 发布在你的 X（Twitter）账号（开头为 `#KiroweenHackathon26`）。

### 阶段 4：Devpost 最终提交（12 月 4 日 14:00 PT 截止前）
1. 登录 `https://devpost.com/submit-to/31667-kiroween-2026/manage/submissions`；
2. 选择赛道：**Skeleton Crew**；
3. 将 `docs/KIRO_USAGE.md` 和各项目链接复制填入对应表单字段并最终提交。

---

## 三·五、 已上线地址（2026-11-06 实测通过）

- **公开仓库**：https://github.com/yaping-pro/kiroween-specguard
- **Live Dashboard（评委可直接点开）**：https://yaping-pro.github.io/kiroween-specguard/
- **验证记录**：页面加载正常 → Radar 渲染 → 5 片分片生成 → 门限恢复出原文 → 1,000 次 PBT 压力测试 12.3ms 通过。
- **仓库合规**：public + MIT（GitHub 已识别 spdx `MIT`）+ `.kiro/` 已跟踪且未被 gitignore。

## 三·六、 已正式提交（2026-11-07）

- **Devpost 项目页**：https://devpost.com/software/specguard-crew
- **赛道**：Skeleton Crew｜**附加奖**：Social Blitz + Bonus Blog
- **提交确认**：My projects 页面显示 `SUBMITTED`；项目页 HTTP 200 且可公开访问
- 截止前仍可编辑：2026-12-04 17:00 EST（北京 12-05 06:00）

## 四、 核心纪律与避坑防线

1. **绝对不要向 `.gitignore` 添加 `.kiro`**：官方明确指出忽视 `.kiro` 会被取消参赛资格。
2. **视频严禁使用任何有版权音乐**：YouTube 版权声明会触发裁判刷票机制。
3. **积分有效期**：兑换后的 4,000 积分在 **2026-12-31 23:59 PT** 自动清零，务必在年底前消耗完毕。
