
var Lang = {
	data: null,
	setRes: function(res){
		this.data = res;
	},
	i18n: function(){
		var args = arguments,
			key = null;
		var paths = args[0].split(".");
		var val = this.data;
		key = paths.shift();
		while(key){
			val = val[key];
			key = paths.shift();
		}
		if(args.length !== 1){
			for(var i = args.length - 1; i>0 ; i--){
				val = val.replace('{'+(i-1)+'}',args[i]);
			}
		}
		return val;
	}
};
module.exports =  Lang;