# 微信炸弹人
By 周爽 刘俊鹏 谢天帝 

## 游戏需求

1. 微信小游戏
2. 双人对战（开房间，分享点击进入，房间号进入，二维码进入）
3. 炸死立即结束，没死60s结束，计分判定胜利（得分：炸墙，吃道具）
4. 没有闯关
5. 道具有： 增加炸弹威力、增加炸弹个数、移动加速5s
6. 出生点为地图对角线
7. 实时显示双方分数和道具状态
8. 战绩炫耀、再来一局、好友战绩排行
9. 可选需求：增加野怪

## 技术选型及对比

### 前端技术选型
#### 一、背景
    1. 小游戏是一个不同于浏览器的 JavaScript 运行环境，没有 BOM 和 DOM API。
    2. 基本上所有基于 HTML5 的游戏引擎都是依赖浏览器提供的 BOM 和 DOM API 的。所以如果要在小游戏中使用引擎，需要对引擎进行改造。
    3. 目前，Cocos、Egret、Laya 已经完成了自身引擎及其工具对小游戏的适配和支持，对应的官方文档已经对接入小游戏开发做了介绍。
    4. 微信官方文档上的开发示例主要介绍Canvas的渲染使用，而以上三种游戏引擎支持webGL，在性能上，webGL模式远超Canvas数倍。
    5. 2016.6后，微信已经全面升级到 Blink 内核14，支持 WebGL
- Cocos: [http://docs.cocos.com/creator/manual/zh/publish/publish-wechatgame.html](http://docs.cocos.com/creator/manual/zh/publish/publish-wechatgame.html)
- Egret: [http://developer.egret.com/cn/github/egret-docs/Engine2D/minigame/introduction/index.html](http://developer.egret.com/cn/github/egret-docs/Engine2D/minigame/introduction/index.html)
- Laya: [https://ldc.layabox.com/doc/?nav=zh-as-5-0-1](https://ldc.layabox.com/doc/?nav=zh-as-5-0-1)
#### 二、引擎介绍

1. Cocos-Creator

    - Cocos Creator是基于开源框架Cocos2d-x的编辑器，实现了一体化、可扩展、可自定义工作流。并在Cocos系列产品中第一次引入了组件化编程思想和数据驱动的架构设计，这极大地简化了Cocos2d-x开发工作流中的场景编辑、UI设计、资源管理、游戏调试和预览、多平台发布等工作。

    - 最新版本V1.9：早在微信团队宣布小游戏之前，Cocos Creator 团队就和微信开发团队合作完成了 Cocos Creator 对微信小游戏平台的支持。作为引擎方，Cocos为用户完成的主要工作包括：
        1. 引擎框架适配微信小游戏 API，纯游戏逻辑层面，用户不需要任何额外的修改。

        2. Cocos Creator 编辑器提供了快捷的打包流程，直接发布为微信小游戏，并自动唤起小游戏的开发者工具。
        3. 自动加载远程资源，缓存资源以及缓存资源版本控制。

    - Cocos creator内置 AnySDK
        - AnySDK为游戏开发商提供一套第三方SDK接入解决方案，整个接入过程，不改变任何SDK的功能、特性、参数等，对于最终玩家而言是完全透明无感知的。目的是让游戏开发商大大节省SDK接入的时间投入，能有更多时间更专注于游戏本身的品质，目前支持的第三方SDK包括了渠道SDK、用户系统、支付系统、广告系统、统计系统、分享系统等等。
    - 使用Cocos引擎的游戏：
        - 腾讯互娱的光子和天美，网易《梦幻西游》、《大话西游》、《率土之滨》、《阴阳师》等，乐动卓越《我叫MT》、莉莉丝《刀塔传奇》和《剑与家园》、盛大《热血传奇》与《传奇世界》，掌趣《大掌门》《拳皇98》《魔法门英雄无敌》、飞鱼科技《神仙道》《保卫萝卜》《三国之刃》。

2. 白鹭科技Egret
    - 白鹭引擎是一款开源免费的基于HTML5标准的游戏及应用开发引擎。白鹭引擎使用标准化的语言开发并兼具高性能，跨平台和完整的创作工作流。通过白鹭引擎及其配套开发工具开发者可以快速搭建HTML5 移动游戏。白鹭引擎采用双周迭代方式发布更新，为开发者提供了高效稳定的技术基础架构，开发者借助引擎可以充分实现游戏的创意和体验。2014年7月，在Egret Engine的1.0版本时期，开发者基于引擎曾创作出风靡全国的《围住神经猫》微信游戏，3天内触及全国2亿玩家。

3. 搜游网络Layabox
    - LayaAir是全球首款基于HTML5协议的全能型开源引擎。是全球唯一支持FlashAS3、JavaScript、TypeScript三种开发语言，并且一次开发同时发布APP、HTML5、Flash三个版本的游戏引擎。除支持2D/3D/VR/AR的游戏开发外，引擎还可以用于应用软件、广告、营销、教育等众多领域，性能媲美APP引擎。

    - LayaAir IDE包括代码模式与设计模式，支持代码开发与美术设计分离。设计模式下，支持UI、粒子、动画、场景等可视化编辑器功能。支持Spine、DragonBones、TiledMap、Unity3D等第三方扩展，内置了SWF转换、图集打包、JS压缩与加密、APP打包、FLash发布等实用功能
    - 使用Layabox的公司：三七互娱《大天使之剑H5》
4. Three.js
    - Three.js 是一款运行在浏览器中的 3D 引擎，你可以用它创建各种三维场景，包括了摄影机、光影、材质等各种对象。其实质是一个开源的WebGL库，WebGL允许JavaScript操作GPU，在浏览器端实现真正意义的3D。
    - 但是目前这项技术还处在发展阶段，资料极为匮乏，爱好者学习基本要通过Demo源码和Three.js本身的源码来学习。其源代码存放在Github中，目前没有一家公司在经营Three.js的社区
5. Phaser
    - Phaser也是一款免费的开源的3D游戏引擎，由Photon Storm公司研发制造。公司提供的产品有：
        1. Ladderz：一款梯子游戏，包含无尽的奔跑模式，5种不同敌人。Ladderz产品包含了该游戏的所有代码。
        2. Phaser editor：一个跨平台的Phaser编辑器（IDE）。
        3. Phaser游戏代码包。包含一些经典的代码。
        4. 接口产品：提供一个API将一些简单易实行的功能通过一个API接口去实现。
        5. 教授Phaser使用的书籍和课程。
    - Phaser是基于Pixi.js开发的，由Richard Davey开发。整个程序比较新，但是一直被Photon Storm公司积极维护着。
#### 三、引擎对比
    1. 开发语言对比
| 引擎          | JavaScript(JS) | TypeScript(TS) | ActionScript3(AS3) 
| ------------- | -- | -------------- | ------------------ |
| Layabox       | 支持           | 支持           | 支持               |
| Egret         | 支持           | 支持           | 不支持             |
| Cocos Creator | 支持           | 支持           | 不支持             |

三款引擎都支持JS、TS开发,而采用AS3作为开发语言的仅有Layabox引擎，而基于项目组成员实际能力，已经参考案例(demo)的多寡，我们选用JS作为前端开发主语言。

    2. 引擎渲染模式
|引擎|2D渲染(Canvas)|2D渲染(webGL)|
| ------------- | -- | ---|
|Layabox|支持|支持|
|Egret|支持|支持|
|Cocos Creator|支持|支持|

在引擎渲染模式方面，三款引擎都支持Canvas以及webGL的渲染模式，而我们的游戏定位为2D画面游戏，所以三种引擎持平。

    3. 性能

| 引擎 | 2D性能(Canvas) | 2D性能(webGL) | Runtime性能 |
| ----| -- | ---|----|
| Layabox | 5星 | 5星 | 5星 |
| Egret | 4.5星 | 3.5星 | 3.5星 |
| Cocos Creator | 3星 | 3星 | 5星 |
    4. 成熟案例
|序号| 游戏 | 使用引擎 |
|-| ----| -- |
|1|欢乐斗地主|Cocos|
|2|四川麻将|Cocos|
|3|天天德州|Cocos|
|4|欢乐消消消|Cocos|
|5|腾讯中国象棋|Cocos|
|6|爱消除乐园|Cocos|
|7|欢乐坦克大战|Cocos|
|8|保卫萝卜讯玩版|Cocos|
|9|全民大乐斗|Laya|
|10|贵州麻将|Laya|
|11|广东麻将|Laya|
|12|悦动音符|Laya|
|13|大家来找茬腾讯版|phaser|
|14|星途WeGoing|three.js|
|15|跳一跳|three.js|

在微信首批发布的15款小游戏中，Cocos占据8席，Laya占据4席，three.js占据2个，phaser占据1个。在官方热度这一方面，Cocos占据绝对优势。

## 概要设计


## 原型实现


## 难点讨论