/**
 * ============================================================================
 * 郜维佳个人导演作品集配置文件 (js/data.js)
 * ============================================================================
 * 说明：
 * 1. 本文件是全站唯一的数据源，采用 window.PORTFOLIO_DATA 全局挂载，
 *    确保直接双击 index.html（file:// 协议）或部署至国内静态服务器均可零报错运行。
 * 2. 线上播放的 10 支成片为网页转码版（H.264 High + AAC + faststart），放在 media/ 目录；
 *    分辨率与帧率与原片一致，码率按网页播放优化。原始母版保留在 assets/videos/（不进仓库）。
 * 3. 如在中国大陆正式上线并绑定自定义域名，请在 site.icp 中填入工信部备案号；留空则隐藏。
 * ============================================================================
 */

window.PORTFOLIO_DATA = {
  site: {
    nameCn: '郜维佳',
    nameEn: 'GAO WEIJIA',
    age: 22,
    roleCn: '22 岁 · 导演 · AI 影像创作者',
    roleEn: '22 · Director / AI Filmmaker',
    heroCue: '点击进入 · 或按 Enter',
    introLead: '22 岁，以 AI 电影工作流重构叙事张力与视听节奏。',
    introDesc:
      '毕业于影像创作方向的青年导演郜维佳（22 岁），作品横跨海外竖屏 AI 短剧与横屏 AI 漫剧、剧情短片与毛毡动画实验。从 1080×1920 的高密度竖屏强反转，到 1920×1080 的东方仙侠、都市悬疑与温情青春，坚持“电影语言先于工具，情绪张力先于奇观”，以原画质感呈现每一帧视觉表达。',
    stats: [
      { value: 9, suffix: '', label: '部精选作品（10 支成片）', sub: 'SELECTED PROJECTS' },
      { value: 4, suffix: '', label: '大创作赛道', sub: 'OVERSEAS · COMIC · LIVE · MV' },
      { value: 19, suffix: '', label: '分钟累计成片', sub: 'TOTAL ORIGINAL RUNTIME' }
    ],
    categories: [
      { key: 'all', label: '全部', en: 'ALL' },
      { key: 'overseas', label: '海外剧', en: 'OVERSEAS SERIES' },
      { key: 'comic', label: '漫剧', en: 'AI COMIC DRAMA' },
      { key: 'live', label: '真人剧', en: 'LIVE-ACTION STYLE' },
      { key: 'mv', label: 'MV', en: 'MUSIC VIDEO' }
    ],
    contact: {
      eyebrow: 'CONTACT · 合作联系',
      headlinePrefix: "LET'S MAKE A ",
      headlineAccent: 'FILM.',
      phone: '15035534262',
      email: '1815320768@qq.com',
      wechatHint: '微信扫码添加好友 · 郜维佳（22 岁）',
      qrImage: 'assets/images/wechat-qr.jpg',
      qrCaption: '点击二维码可放大 · 微信扫一扫加好友'
    },
    copyright: '© 2026 郜维佳 GAO WEIJIA',
    icp: '',

    /* ------------------------------------------------------------------
     * 线上播放源配置
     * ------------------------------------------------------------------
     * mode:
     *   'local' —— 播放仓库内 media/ 里的网页转码版（当前方案）
     *   'none'  —— 关闭在线播放，只显示海报与占位文案
     *
     * 10 支成片以 H.264 High + AAC 转码进仓库：分辨率/帧率与原片一致，
     * 码率按网页播放优化（原片 8–16 Mbps → 网页版约 1–3 Mbps）。
     * 原始母版仍在 assets/videos/，不进仓库、不影响线上。
     * ------------------------------------------------------------------ */
    media: {
      mode: 'local',
      placeholderTitle: '影片即将上线',
      placeholderDesc: '该片的网页版正在转码，稍后可在此直接观看。'
    }
  },

  works: [
    {
      id: 'mias-wild-wonderland',
      num: '01',
      slug: 'mias-wild-wonderland',
      title: "Mia's Wild Wonderland",
      subTitleCn: '《米娅的奇幻庄园》· 两集连播',
      enTitle: "MIA'S WILD WONDERLAND",
      primaryLang: 'en',
      category: '海外剧',
      categoryKey: 'overseas',
      aspect: '9:16',
      resolution: '1080×1920 原画',
      duration: '2 分 00 秒（共 2 集）',
      durationEn: 'EP01 00:56 + EP02 01:04',
      director: '郜维佳',
      accent: '#e2a84b',
      accentRgb: '226, 168, 75',
      logline: '玫瑰庄园的阳光下，小女孩米娅轻轻抱住了白虎的脖颈——在本作完整收录的第一集与第二集中，纯真童话与豪门暗涌在奇幻动物伙伴的注视下悄然交锋。',
      quote: '当庄园里最温柔的守护者是一头白虎，大人世界里的算计才刚刚露出爪牙。',
      quoteEn: 'TWO EPISODES · ONE ENCHANTED ESTATE · ZERO COMPROMISE.',
      synopsis: [
        '《Mia’s Wild Wonderland》是面向海外竖屏家庭奇幻短剧赛道创作的双集联动先导项目，完整收录 EP01（56 秒）与 EP02（1 分 04 秒）两支 1080×1920 原画成片。',
        '全片以暖金色庄园花园为主基调，在维持白虎毛发质感、萌娃微表情表演与群像角色高度一致性的同时，通过双集递进式的节奏剪辑，完成从奇遇建立到危机伏笔的完整闭环。'
      ],
      credits: [
        { role: '导演 / 主创', name: '郜维佳（22 岁）' },
        { role: '作品形态', name: '海外竖屏 AI 短剧 · 双集项目（EP01 + EP02）' },
        { role: '原画规格', name: '1080×1920 · 30fps 原片画幅' },
        { role: '分集时长', name: '第一集 00:56 · 第二集 01:04' }
      ],
      platformNote: '本项目包含第一集（EP01）与第二集（EP02）两支完整成片，页面内任意分集按钮均可一键独立切换播放',
      video: 'media/mias-wild-wonderland-ep01.mp4',
      episodes: [
        {
          num: 'EP01',
          shortLabel: '第一集',
          title: '第一集 · 庄园初遇',
          enTitle: 'EPISODE 01 · THE WHITE TIGER',
          duration: '00:56',
          thumb: 'assets/images/mias-wild-wonderland-still-1.jpg',
          video: 'media/mias-wild-wonderland-ep01.mp4'
        },
        {
          num: 'EP02',
          shortLabel: '第二集',
          title: '第二集 · 奇幻风波',
          enTitle: 'EPISODE 02 · WONDERLAND RISING',
          duration: '01:04',
          thumb: 'assets/images/mias-wild-wonderland-still-4.jpg',
          video: 'media/mias-wild-wonderland-ep02.mp4'
        }
      ],
      poster: 'assets/images/mias-wild-wonderland-cover.jpg',
      thumb: 'assets/images/thumbs/mias-wild-wonderland-cover.webp',
      posterCaption: "《Mia's Wild Wonderland》官方竖版主视觉海报（含 EP01 & EP02 双集先导成片）。",
      stills: [
        'assets/images/mias-wild-wonderland-still-1.jpg',
        'assets/images/mias-wild-wonderland-still-2.jpg',
        'assets/images/mias-wild-wonderland-still-3.jpg',
        'assets/images/mias-wild-wonderland-still-4.jpg',
        'assets/images/mias-wild-wonderland-still-5.jpg',
        'assets/images/mias-wild-wonderland-still-6.jpg'
      ],
      scriptSource: '双集联动分场手记 · EP01 / EP02',
      scriptPages: [
        {
          blocks: [
            { type: 'scene', text: 'EXT. 玫瑰庄园石阶 - 日（EP01）' },
            { type: 'action', text: '金色逆光穿透柏树与玫瑰花墙。米娅蹲在青苔石台边，小手抱住身旁白虎柔软的颈毛，身后是神色各异的庄园家人。' },
            { type: 'char', text: 'MIA 米娅' },
            { type: 'paren', text: '（偏过头，冲着镜头露出纯粹笑意）' },
            { type: 'dia', text: '别怕，它只听得懂我讲的秘密。' },
            { type: 'trans', text: '接第一集正片 EP01 CUT TO:' }
          ]
        },
        {
          blocks: [
            { type: 'scene', text: 'INT./EXT. 庄园喷泉长廊 - 日（EP02）' },
            { type: 'action', text: '午后阴影拉长。成年人的低声交谈被一阵低沉的虎啸打断，花瓣随风掠过石柱。' },
            { type: 'char', text: 'LADY ELEANOR' },
            { type: 'dia', text: '这座庄园换过三代主人，可那头白虎从来只认一个人的名字。' },
            { type: 'trans', text: '第二集高潮 EP02 CONTINUE' }
          ]
        }
      ]
    },
    {
      id: 'the-king-of-sorrow',
      num: '02',
      slug: 'the-king-of-sorrow',
      title: 'THE KING OF SORROW',
      subTitleCn: '《悲恸之王》· 暗黑宫廷史诗短剧',
      enTitle: 'THE KING OF SORROW',
      primaryLang: 'en',
      category: '海外剧',
      categoryKey: 'overseas',
      aspect: '9:16',
      resolution: '544×960 原画',
      duration: '2 分 20 秒',
      durationEn: '02:20 · 9:16',
      director: '郜维佳',
      accent: '#c93636',
      accentRgb: '201, 54, 54',
      logline: '乌云压境的铁血堡垒之上，戴着黑铁王冠的年轻君主被宿命红焰缠绕——两张截然不同的命运面孔，谁才是王座最后的代价？',
      quote: '每一顶王冠的重量，都是用爱过的人与流干的血一起铸成的。',
      quoteEn: 'BROKEN CROWN OF PAIN. ONE THRONE, TWO SOULS.',
      synopsis: [
        '暗黑中世纪奇幻题材的海外竖屏 AI 短剧。全片以冷峻暗影、暗红火星与金色命运丝线构建极具史诗感的视觉冲击。',
        '作品围绕“黑化君王—落难少女—白衣王后”三角宿命关系展开，通过紧凑剪辑与强戏剧冲突台词，在两分二十秒内完成高密度群像情绪爆发。'
      ],
      credits: [
        { role: '导演 / 主创', name: '郜维佳（22 岁）' },
        { role: '作品形态', name: '海外竖屏 AI 短剧 · 9:16' },
        { role: '原画规格', name: '544×960 · 28fps 原片画幅' },
        { role: '成片时长', name: '2 分 20 秒' }
      ],
      video: 'media/the-king-of-sorrow.mp4',
      poster: 'assets/images/the-king-of-sorrow-cover.jpg',
      thumb: 'assets/images/thumbs/the-king-of-sorrow-cover.webp',
      posterCaption: '《THE KING OF SORROW》暗黑奇幻竖版官方封面。',
      stills: [
        'assets/images/the-king-of-sorrow-still-1.jpg',
        'assets/images/the-king-of-sorrow-still-2.jpg',
        'assets/images/the-king-of-sorrow-still-3.jpg',
        'assets/images/the-king-of-sorrow-still-4.jpg',
        'assets/images/the-king-of-sorrow-still-5.jpg',
        'assets/images/the-king-of-sorrow-still-6.jpg'
      ],
      scriptSource: '场次手记 · 黑铁王座前',
      scriptPages: [
        {
          blocks: [
            { type: 'scene', text: 'EXT. 黑色城堡高塔 - 暴雨前夜' },
            { type: 'action', text: '赤红火星逆风飘升。黑甲君王低垂眼眸，胸甲裂纹处透出微弱余烬，金色光丝在少女指尖缠绕闪烁。' },
            { type: 'char', text: 'THE KING' },
            { type: 'dia', text: '如果整座王国都要替我的痛苦陪葬，你还要留在这里吗？' },
            { type: 'trans', text: '切至特写 CUT TO:' }
          ]
        }
      ]
    },
    {
      id: 'ceo-sweet-punishment-ep53',
      num: '03',
      slug: 'ceo-sweet-punishment-ep53',
      title: "The CEO's Sweet Punishment EP53",
      subTitleCn: '《总裁的甜蜜惩罚 · 第 53 集》',
      enTitle: "THE CEO'S SWEET PUNISHMENT · EP53",
      primaryLang: 'en',
      category: '海外剧',
      categoryKey: 'overseas',
      aspect: '9:16',
      resolution: '1080×1920 原画',
      duration: '1 分 09 秒',
      durationEn: '01:09 · EP53',
      director: '郜维佳',
      accent: '#d63855',
      accentRgb: '214, 56, 85',
      logline: '冷蓝与炽红光影交错的密闭空间，玫瑰花瓣随铁链轻晃而落——当高傲的猎人俯下身，究竟是谁把谁关进了这场危险博弈？',
      quote: '越是致命的吸引，越像一场心甘情愿戴上的枷锁。',
      quoteEn: 'BETWEEN RED ROSES AND COLD CHAINS.',
      synopsis: [
        '面向北美及全球女频短剧受众打造的 1080×1920 原画第 53 集高能切片成片。',
        '全片采用极致双色温打光（冷冽钢蓝背光 + 猩红侧逆光），精确控制人物贴近时的面部微表情与眼神压迫感，还原霸总强张力名场面。'
      ],
      credits: [
        { role: '导演 / 主创', name: '郜维佳（22 岁）' },
        { role: '作品形态', name: '海外竖屏 AI 短剧 · 9:16' },
        { role: '原画规格', name: '1080×1920 · 30fps 原片画幅' },
        { role: '成片时长', name: '1 分 09 秒' }
      ],
      video: 'media/ceo-sweet-punishment-ep53.mp4',
      poster: 'assets/images/ceo-sweet-punishment-ep53-cover.jpg',
      thumb: 'assets/images/thumbs/ceo-sweet-punishment-ep53-cover.webp',
      posterCaption: "《The CEO's Sweet Punishment EP53》竖版官方海报。",
      stills: [
        'assets/images/ceo-sweet-punishment-ep53-still-1.jpg',
        'assets/images/ceo-sweet-punishment-ep53-still-2.jpg',
        'assets/images/ceo-sweet-punishment-ep53-still-3.jpg',
        'assets/images/ceo-sweet-punishment-ep53-still-4.jpg',
        'assets/images/ceo-sweet-punishment-ep53-still-5.jpg',
        'assets/images/ceo-sweet-punishment-ep53-still-6.jpg'
      ],
      scriptSource: 'EP53 核心对峙场次',
      scriptPages: [
        {
          blocks: [
            { type: 'scene', text: 'INT. 暗红密室 - 夜' },
            { type: 'action', text: '绯红玫瑰花瓣缓缓飘过镜头前景。她微微扬起下巴，目光毫不避让地迎上身后的黑影。' },
            { type: 'char', text: 'HER' },
            { type: 'dia', text: '锁链是你的规矩，可先动心的人，从来不是我。' },
            { type: 'trans', text: '黑场 CUT TO BLACK' }
          ]
        }
      ]
    },
    {
      id: 'xianmen',
      num: '04',
      slug: 'xianmen',
      title: '仙门偏养反骨人',
      subTitleCn: '第一集 · 东方仙侠漫剧',
      enTitle: 'REBEL OF THE IMMORTAL SECT',
      primaryLang: 'cn',
      category: '漫剧',
      categoryKey: 'comic',
      aspect: '16:9',
      resolution: '1920×1080 原画',
      duration: '2 分 29 秒',
      durationEn: '02:29 · 1080P',
      director: '郜维佳',
      accent: '#c8a663',
      accentRgb: '200, 166, 99',
      logline: '百阶白玉道场之上，千百名门弟子冷眼旁观——他偏要在仙门祖训面前横臂护下那身染血白衣，既然天道不许，那就做个反骨人。',
      quote: '仙门规矩千万条，可我偏要保一个不肯低头的人。',
      quoteEn: 'DEFYING A THOUSAND IMMORTAL LAWS FOR ONE PERSON.',
      synopsis: [
        '1920×1080 全高清东方仙侠题材 AI 漫剧/短片第一集完整成片。宏阔的宗门道场实景纵深与精细的汉服刺绣、飞花粒子交织出电影级国风质感。',
        '作品精准拿捏主角伤痕妆造、黑金道袍质感与群演空间透视，展现高燃群像对峙与反套路护短名场面。'
      ],
      credits: [
        { role: '导演 / 主创', name: '郜维佳（22 岁）' },
        { role: '作品形态', name: '横屏 AI 仙侠短片 · 16:9' },
        { role: '原画规格', name: '1920×1080 · 30fps 原片画幅' },
        { role: '成片时长', name: '2 分 29 秒' }
      ],
      video: 'media/xianmen.mp4',
      poster: 'assets/images/xianmen-cover.jpg',
      thumb: 'assets/images/thumbs/xianmen-cover.webp',
      posterCaption: '《仙门偏养反骨人》第一集 16:9 横版官方海报。',
      stills: [
        'assets/images/xianmen-still-1.jpg',
        'assets/images/xianmen-still-2.jpg',
        'assets/images/xianmen-still-3.jpg',
        'assets/images/xianmen-still-4.jpg',
        'assets/images/xianmen-still-5.jpg',
        'assets/images/xianmen-still-6.jpg'
      ],
      scriptSource: '第一集 · 宗门审判阶',
      scriptPages: [
        {
          blocks: [
            { type: 'scene', text: 'EXT. 凌霄宗百阶道场 - 日' },
            { type: 'action', text: '花瓣随灵风掠过长阶。少女白衣溅血却脊背挺直，玄衣青年一步踏上台阶，伸手稳稳护住她肩头。' },
            { type: 'char', text: '玄衣弟子' },
            { type: 'dia', text: '诸位长老若嫌她身上反骨太硬，连我这一身骨头，一并敲断便是。' },
            { type: 'trans', text: '推近 PUSH IN:' }
          ]
        }
      ]
    },
    {
      id: 'xian',
      num: '05',
      slug: 'xian',
      title: '陷',
      subTitleCn: '噩梦 ——《陷》· 心理悬疑真人剧',
      enTitle: 'TRAPPED IN NIGHTMARE',
      primaryLang: 'cn',
      category: '真人剧',
      categoryKey: 'live',
      aspect: '16:9',
      resolution: '1920×1080 原画',
      duration: '1 分 40 秒',
      durationEn: '01:40 · 1080P',
      director: '郜维佳',
      accent: '#6d8fa8',
      accentRgb: '109, 143, 168',
      logline: '积水漫过窄小出租屋的地板，倒映着窗外冷漠的城市灯火——倚在门边的究竟是疲惫的自己，还是早已困在梦魇里的另一个人？',
      quote: '最可怕的不是房间进水，而是你站在干燥的门框边，却始终走不出去。',
      quoteEn: 'WHEN YOUR OWN ROOM BECOMES AN ABYSS.',
      synopsis: [
        '由郜维佳独立执导的 1920×1080 现代都市心理悬疑实验短片《噩梦 ——〈陷〉》。',
        '全片依托逼真的室内积水倒影、压抑的灰冷夜景光影与极简空间调度，外化现代人陷入精神困境与噩梦循环的窒息瞬间。'
      ],
      credits: [
        { role: '导演 / 主创', name: '郜维佳（22 岁）' },
        { role: '作品形态', name: '横屏 AI 悬疑短片 · 16:9' },
        { role: '原画规格', name: '1920×1080 · 25fps 原片画幅' },
        { role: '成片时长', name: '1 分 40 秒' }
      ],
      video: 'media/xian.mp4',
      poster: 'assets/images/xian-cover.jpg',
      thumb: 'assets/images/thumbs/xian-cover.webp',
      posterCaption: '《噩梦 ——〈陷〉》官方海报 · 导演：郜维佳。',
      stills: [
        'assets/images/xian-still-1.jpg',
        'assets/images/xian-still-2.jpg',
        'assets/images/xian-still-3.jpg',
        'assets/images/xian-still-4.jpg',
        'assets/images/xian-still-5.jpg',
        'assets/images/xian-still-6.jpg'
      ],
      scriptSource: '场次 01 · 淹没的房间',
      scriptPages: [
        {
          blocks: [
            { type: 'scene', text: 'INT. 凌乱单身公寓 - 深夜' },
            { type: 'action', text: '漆黑的水面没过脚踝，窗外霓虹在水波上碎成冷光。灰衣少年双手插兜靠在防盗门旁，沉默地看着房间中央的凌乱餐桌。' },
            { type: 'char', text: '独白 V.O.' },
            { type: 'dia', text: '门锁其实从来没有坏。只是我忘了，该往哪一侧推开。' },
            { type: 'trans', text: '黑场 CUT TO BLACK' }
          ]
        }
      ]
    },
    {
      id: 'yemiao',
      num: '06',
      slug: 'yemiao',
      title: '野庙',
      subTitleCn: '风雪孤剑 · 武侠写实真人剧',
      enTitle: 'THE WILD TEMPLE',
      primaryLang: 'cn',
      category: '真人剧',
      categoryKey: 'live',
      aspect: '16:9',
      resolution: '854×480 原画',
      duration: '2 分 41 秒',
      durationEn: '02:41 · WUXIA',
      director: '郜维佳',
      accent: '#b88954',
      accentRgb: '184, 137, 84',
      logline: '雪山断崖上的破败古刹，粗布衣的执剑者与云海金袍故人隔雪相望——这一剑拔出，斩的是风雪，还是当年未尽的恩怨？',
      quote: '雪落野庙三尺深，唯有出鞘的冷铁还记着故人姓名。',
      quoteEn: 'TWO BLADES ABOVE THE FROZEN CLOUDS.',
      synopsis: [
        '硬派冷冽武侠风格 AI 短片。以高寒雪山古庙与翻涌云海为背景，将破旧粗麻布衣与华贵白金长袍形成鲜明阶级与命运对位。',
        '通过慢节奏冷兵器对峙与大雪纷飞中的眼神特写，还原传统港台及新武侠电影的苍凉江湖气韵。'
      ],
      credits: [
        { role: '导演 / 主创', name: '郜维佳（22 岁）' },
        { role: '作品形态', name: '横屏 AI 武侠短片 · 16:9' },
        { role: '原画规格', name: '854×480 · 30fps 原片画幅' },
        { role: '成片时长', name: '2 分 41 秒' }
      ],
      video: 'media/yemiao.mp4',
      poster: 'assets/images/yemiao-cover.jpg',
      thumb: 'assets/images/thumbs/yemiao-cover.webp',
      posterCaption: '《野庙》横版武侠概念海报。',
      stills: [
        'assets/images/yemiao-still-1.jpg',
        'assets/images/yemiao-still-2.jpg',
        'assets/images/yemiao-still-3.jpg',
        'assets/images/yemiao-still-4.jpg',
        'assets/images/yemiao-still-5.jpg',
        'assets/images/yemiao-still-6.jpg'
      ],
      scriptSource: '雪山野庙 · 断崖对峙',
      scriptPages: [
        {
          blocks: [
            { type: 'scene', text: 'EXT. 雪山古庙断崖 - 日' },
            { type: 'action', text: '冰棱倒挂檐角。粗衣剑客横剑护于身前，剑脊倒映着冷日寒光；十步之外的白衣金枪人回眸望来，云海在脚下翻卷。' },
            { type: 'char', text: '执剑人' },
            { type: 'dia', text: '山下的路早就封死了。今日之后，只留一把剑下山。' },
            { type: 'trans', text: '急推 FAST PUSH IN:' }
          ]
        }
      ]
    },
    {
      id: 'sanjie',
      num: '07',
      slug: 'sanjie',
      title: '三界绒游记',
      subTitleCn: '制作组：GHZ · 毛毡奇幻漫剧',
      enTitle: 'FELT ODYSSEY OF THREE REALMS',
      primaryLang: 'cn',
      category: '漫剧',
      categoryKey: 'comic',
      aspect: '16:9',
      resolution: '1920×1080 原画',
      duration: '1 分 29 秒',
      durationEn: '01:29 · 1080P',
      director: '郜维佳（制作组：GHZ）',
      accent: '#f09b46',
      accentRgb: '240, 155, 70',
      logline: '当东方神话全员变成软乎乎的羊毛毡玩偶，骑着大白牦牛踩上七彩织锦天路，一场暖融融的“三界绒游”就此发车！',
      quote: '神仙妖怪也能毛茸茸的，连南天门都透着阳光烤过的棉花味。',
      quoteEn: 'MYTHOLOGY REIMAGINED IN WARM HANDCRAFTED WOOL FELT.',
      synopsis: [
        '风格独树一帜的 1920×1080 全高清羊毛毡定格动画质感 AI 短片（制作组：GHZ）。',
        '打破常规写实或二次元路径，全片精细模拟手工羊毛毡纤维、针织彩虹桥与暖阳透光绒毛材质，打造兼具童趣与东方神话想象力的奇幻群像冒险。'
      ],
      credits: [
        { role: '导演 / 制作组', name: '郜维佳 · 制作组：GHZ' },
        { role: '作品形态', name: '横屏 AI 毛毡动画短片 · 16:9' },
        { role: '原画规格', name: '1920×1080 · 30fps 原片画幅' },
        { role: '成片时长', name: '1 分 29 秒' }
      ],
      video: 'media/sanjie.mp4',
      poster: 'assets/images/sanjie-cover.jpg',
      thumb: 'assets/images/thumbs/sanjie-cover.webp',
      posterCaption: '《三界绒游记》官方毛毡风格横版海报 · 制作组：GHZ。',
      stills: [
        'assets/images/sanjie-still-1.jpg',
        'assets/images/sanjie-still-2.jpg',
        'assets/images/sanjie-still-3.jpg',
        'assets/images/sanjie-still-4.jpg',
        'assets/images/sanjie-still-5.jpg',
        'assets/images/sanjie-still-6.jpg'
      ],
      scriptSource: '南天门外 · 绒游启程',
      scriptPages: [
        {
          blocks: [
            { type: 'scene', text: 'EXT. 红云漫野与彩虹织道 - 日' },
            { type: 'action', text: '金光万丈的南天门牌坊下，三只圆滚滚的羊毛毡小仙骑在白毛大牛背上，提着翠绿灯笼摇摇晃晃往前赶路。' },
            { type: 'char', text: '绒团小仙' },
            { type: 'dia', text: '抓稳牛角啦，前方就是南天门第一站！' },
            { type: 'trans', text: '摇镜 PAN RIGHT:' }
          ]
        }
      ]
    },
    {
      id: 'chunri-laixin',
      num: '08',
      slug: 'chunri-laixin',
      title: '春日来信',
      subTitleCn: '林夏 × 许屿 · 治愈青春真人剧',
      enTitle: 'LETTER FROM SPRING',
      primaryLang: 'cn',
      category: '真人剧',
      categoryKey: 'live',
      aspect: '16:9',
      resolution: '968×544 原画',
      duration: '2 分 02 秒',
      durationEn: '02:02 · YOUTH',
      director: '郜维佳',
      accent: '#e48397',
      accentRgb: '228, 131, 151',
      logline: '樱花树下的湖畔石阶，单车静静停在光影里——信封上那句“To 林夏”，是许屿鼓起整个春天的勇气。',
      quote: '所有的心动都写在纸页折痕里，等风吹过湖面时才敢拆开。',
      quoteEn: 'CHERRY BLOSSOMS, A LAKE BREEZE, AND AN UNSENT LETTER.',
      synopsis: [
        '清新日系胶片色调的青春纯爱 AI 短片，讲述林夏与许屿在樱花湖畔交换信件的温柔故事。',
        '作品着重还原自然日光的通透散射、校园制服褶皱、胶片相机挂绳与樱花花瓣飘落轨迹，以极细腻的青春日常打动观众。'
      ],
      credits: [
        { role: '导演 / 主创', name: '郜维佳（22 岁）' },
        { role: '作品形态', name: '横屏 AI 青春短片 · 16:9' },
        { role: '原画规格', name: '968×544 · 30fps 原片画幅' },
        { role: '成片时长', name: '2 分 02 秒' }
      ],
      video: 'media/chunri-laixin.mp4',
      poster: 'assets/images/chunri-laixin-cover.jpg',
      thumb: 'assets/images/thumbs/chunri-laixin-cover.webp',
      posterCaption: '《春日来信》林夏 × 许屿 · 青春短片官方封面。',
      stills: [
        'assets/images/chunri-laixin-still-1.jpg',
        'assets/images/chunri-laixin-still-2.jpg',
        'assets/images/chunri-laixin-still-3.jpg',
        'assets/images/chunri-laixin-still-4.jpg',
        'assets/images/chunri-laixin-still-5.jpg',
        'assets/images/chunri-laixin-still-6.jpg'
      ],
      scriptSource: '樱花湖畔 · 拆信瞬间',
      scriptPages: [
        {
          blocks: [
            { type: 'scene', text: 'EXT. 樱花湖畔石阶 - 午后晴日' },
            { type: 'action', text: '波光粼粼的湖面反射暖阳。林夏低头抿唇轻笑，展开写满字的信纸；许屿坐在身旁，悄悄把视线停在她发梢。' },
            { type: 'char', text: '许屿 XU YU' },
            { type: 'paren', text: '（指尖轻轻摩挲膝盖，声音有点轻）' },
            { type: 'dia', text: '信封背面还有一句话，你等樱花落下来的时候再看。' },
            { type: 'trans', text: '溶入阳光 DISSOLVE:' }
          ]
        }
      ]
    },
    {
      id: 'rexue-qingchun',
      num: '09',
      slug: 'rexue-qingchun',
      title: '热血青春',
      subTitleCn: '燃向少年逆光 MV · 就在这条街上燃烧吧',
      enTitle: 'BLAZING YOUTH · MV',
      primaryLang: 'cn',
      category: 'MV',
      categoryKey: 'mv',
      aspect: '16:9',
      resolution: '1280×720 原画',
      duration: '2 分 56 秒',
      durationEn: '02:56 · MV',
      director: '郜维佳',
      accent: '#f06d2f',
      accentRgb: '240, 109, 47',
      logline: '穿过高架桥底的金橙色逆光，反戴鸭舌帽的少年伴随节拍挥拳大喊——“就在这条街上燃烧吧”，把所有不甘全唱进这阵夏末的风里！',
      quote: '只要拳头还攥着光，这条街上的节奏就永远不会停。',
      quoteEn: 'BURN BRIGHT ON THIS STREET BEFORE THE SUNSET FADES.',
      synopsis: [
        '高燃快节奏的现代都市少年音乐 MV，全片近三分钟贴合音乐鼓点一气呵成。',
        '以饱和度极高的日落橙金、高架桥速度感镜头与竖排歌词动态排版为核心，表现少年在城市立交与老街之间奔跑、呐喊、挥拳的炽热生命力。'
      ],
      credits: [
        { role: '导演 / 主创', name: '郜维佳（22 岁）' },
        { role: '作品形态', name: '横屏音乐 MV · 16:9' },
        { role: '原画规格', name: '1280×720 · 30fps 原片画幅' },
        { role: '成片时长', name: '2 分 56 秒' }
      ],
      video: 'media/rexue-qingchun.mp4',
      poster: 'assets/images/rexue-qingchun-cover.jpg',
      thumb: 'assets/images/thumbs/rexue-qingchun-cover.webp',
      posterCaption: '《热血青春》横版燃向官方海报。',
      stills: [
        'assets/images/rexue-qingchun-still-1.jpg',
        'assets/images/rexue-qingchun-still-2.jpg',
        'assets/images/rexue-qingchun-still-3.jpg',
        'assets/images/rexue-qingchun-still-4.jpg',
        'assets/images/rexue-qingchun-still-5.jpg',
        'assets/images/rexue-qingchun-still-6.jpg'
      ],
      scriptSource: '立交桥下 · 逆光宣言',
      scriptPages: [
        {
          blocks: [
            { type: 'scene', text: 'EXT. 高架桥公路 - 日落黄金时刻' },
            { type: 'action', text: '金红色夕阳刺穿桥墩立柱。穿橙色卫衣的少年向前奋力挥出右拳，镜头疾速掠过飞驰光轨。' },
            { type: 'char', text: '少年' },
            { type: 'dia', text: '输过的局算什么，这一次，老子自己抢回来！' },
            { type: 'trans', text: '定格收尾 FREEZE FRAME' }
          ]
        }
      ]
    }
  ]
};
