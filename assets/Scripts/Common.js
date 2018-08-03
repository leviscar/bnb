
// userInfo 用户资料
// roleInfos 移动数据
module.exports = {
    socket: null,
    roomId: 0,
    moveMap: false,
    TouchType : cc.Enum({
        DEFAULT: 0,
        FOLLOW: 1,
    }),

    DirectionType : cc.Enum({
        FOUR: 4,
        EIGHT: 8,
        ALL: 0,
    }),

    KeyCode: cc.Enum({
        w: 87,
        s: 83,
        a: 65,
        d: 68,
        j: 74
    }),
    userInfo: {
        nickName: 'unknown',
        avatarUrl: null,
        gender: 1
    },
    isMaster: false,
    userInfos: [],
    monsterInfos: [],
    FPS: 30,
    map: {}, // 地图缓存
    windowSize:null, // 界面尺寸缓存
    host: 'localhost',
    // host:'212.64.17.36',
    port: 4000
}