//	OBJECT CONSTRUCTOR
var dataObject = function(args) {
	var self = this;
	if(!self) return new dataObject(args);
	self.name = args.name==undefined? null: args.name;
	self.id = args.id==undefined? args.name: args.id;
	self.linkId = args.linkId==undefined? null: args.linkId;
	self.value = args.value==undefined? null: args.value;
	self.msg = args.msg==undefined? null: args.msg;
	self.help = args.help==undefined? null: args.help;
	self.error = args.error==undefined? null: args.help;
	self.type = args.type==undefined? doType.item: args.type;
	self.showType = args.showType==undefined? (self.type==doType.raw? doShowType.hex: doShowType.text): args.showType;
	self.customFormat = args.customFormat==undefined? null: args.customFormat;
	if(self.showType == doShowType.hex) {
		self.bytes = args.bytes==undefined? 1: args.bytes;
		self.show0x = args.show0x==undefined? (self.type==doType.raw? false: true): args.show0x;
	}
	if(self.type == doType.block || self.type == doType.group) {
		self.items = {};
	}
console.log('new DO(type='+args.type+', name='+args.name+', value='+args.value+') => (type='+this.type+', name='+this.name+', value='+this.value+')');
};
exports = module.exports = dataObject;

//	OBJECT STATIC CONSTANTS
var doShowType = dataObject.doShowType = {
	text:	0,
	binary:	1,
	number:	2,
	hex:	3,
	date:	4,
	custom:	99
};

var doType = dataObject.doType = {
	block:	0,
	group:	1,
	item:	2,
	raw:	3
};

//  OBJECT METHODS
dataObject.prototype.show = function() {
console.log('DO->show(type='+this.type+', name='+this.name+', value='+this.value+')');
	if(this.type == doType.item) {
		return this._showItem();
	} else if(this.type == doType.raw) {
		return this._showRaw();
	}
	//Blocks and Groups
	var events = (this.linkId? ' onMouseOver="document.getElementById(\''+this.linkId+'\').style.backgroundColor=\'#E0FF40\'" onMouseOut="document.getElementById(\''+this.linkId+'\').style.backgroundColor=\'white\'"':'');
	var res = '<div class="' + (this.type == doType.group? 'group': 'block') + '"' + (this.id? ' id="'+this.id+'"': '') + events + '>' + (this.name? '<div class="title">'+this.name+'</div>': '');
	for(var i in this.items) {
		res += this.items[i].show();
	}
	res += '</div>';
	return res;
};
dataObject.prototype._showItem = function() {
	var value;
	if(this.showType == doShowType.text) {
		value = '' + this.value;
	} else if(this.showType == doShowType.binary) {
		value = this.value? '1': '0';
	} else if(this.showType == doShowType.number) {
		value = this.value;
	} else if(this.showType == doShowType.hex) {
		value = this.toHex();
	} else if(this.showType == doShowType.date) {
		value = this.value.toISOString().replace("T", " ").replace("Z", "");
	} else if(this.showType == doShowType.custom) {
		value = require('util').format(this.customFormat, this.value);
	}
	if(this.msg) {
		value += ': ' + this.msg;
	}
	var events = (this.linkId? ' onMouseOver="document.getElementById(\''+this.linkId+'\').style.backgroundColor=\'#E0FF40\'" onMouseOut="document.getElementById(\''+this.linkId+'\').style.backgroundColor=\'white\'"':'');
	return '<div class="field"' + (this.id? ' id="'+this.id+'"': '') + events + '>' + (this.name? '<span class="name">' + this.name + '</span><span class="value">': '') + value + '</span></div>';
};
dataObject.prototype._showRaw = function() {
	var events = (this.linkId? ' onMouseOver="document.getElementById(\''+this.linkId+'\').lastBorder = document.getElementById(\''+this.linkId+'\').style.border; document.getElementById(\''+this.linkId+'\').style.border=\'2px solid #FF4040\'; this.style.backgroundColor=\'#E0FF40\'" onMouseOut="document.getElementById(\''+this.linkId+'\').style.border=document.getElementById(\''+this.linkId+'\').lastBorder; this.style.backgroundColor=\'white\'"':'');
	return '<span class="rawData"'+(this.id? ' id="'+this.id+'"': '')+events+'>'+this.toHex()+'</span>';
};
dataObject.prototype.toHex = function() {
	var	hex = (this.show0x? '0x': ''),
		v;
	if(this.type == doType.raw) {	//LSB > MSB
		for(var b = 0; b < this.bytes; b++) {
			v = (this.value >> (8*b)) & 0xFF;
			hex += (v >> 4 & 0x0F).toString(16).toUpperCase() + (v & 0x0F).toString(16).toUpperCase();
		}
	} else {	//MSB > LSB
		for(var b = (this.bytes - 1); b >= 0; b--) {
			v = (this.value >> (8*b)) & 0xFF;
			hex += (v >> 4 & 0x0F).toString(16).toUpperCase() + (v & 0x0F).toString(16).toUpperCase();
		}
	}
	return hex;
};
