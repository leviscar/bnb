cc.Class({
    extends: cc.Component,

    properties: {
        duration: 0
    },

    onLoad: function() {
        this.node.active = false;
        this.node.on('fade-in',this.show,this);
    },

    show: function() {
        this.node.active = !this.node.active;
    }
});
