require('./tdMap');
require('./tdPoint');
require('./tdRole');


var TDPaopao = function(position, power, role){
    this.position = position;
    this.power = power;
    this.role = role;
    this.map = this.role.getMap();

    console.log('paopao created at'+ this.position.x+","+this.position.y);

    var self = this;
    setTimeout(function(){
        self.boom();
    },2000);

    this.boom = function(){
        console.log('paopao boom  at'+this.position.x+","+this.position.y);
        this.role.deletePaopao(this);
    };


}


module.exports = {
    TDPaopao:TDPaopao
}