module.exports = {
    roomId: 0,
    FPS: 30, // 数据刷新帧率
    host: "http://localhost:4000",
    // host:"wss://www.x-lab.ac",
    // port: 4000,
    showImgUrl: "https://www.x-lab.ac/pic/share.png",
    moveMap: false, // 是否正在移动地图
    isMaster: false, // 是否是房主
    isWinner: false,
    socket: null,
    windowSize:null, // 界面尺寸缓存
    userInfos: [], // 角色信息
    monsterInfos: [], // 怪物信息
    map: {}, // 地图缓存
    KeyCode: cc.Enum({ // 键盘键码
        w: 87,
        s: 83,
        a: 65,
        d: 68,
        j: 74
    }),
    userInfo: { // 当前角色信息
        guid: null,
        nickName: "unknown",
        avatarUrl: null,
        gender: 1,
    }
};
