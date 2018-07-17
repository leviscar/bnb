module.exports = {
    socket: null,
    roomId: 0,
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
        d: 68
    })

}