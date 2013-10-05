var	util = require('util')

module.exports = DnpUserData

//	OBJECT CONSTRUCTOR
function DnpUserData(args) {
	var self = this
	if(!self) return new DnpUserData(args)
	self.setUserData(args.userData)
}

//	OBJECT STATIC CONSTANTS
var udState = DnpUserData.udState = {
	data:	0,
	crc:	1,
	end:	2,
	noData:	3
}

//  OBJECT METHODS
DnpUserData.prototype = {
	getBlockCount: function() {
		return Math.ceil(this._userData.length / 18)
	}

,	getData: function(freeze) {
		var response = {
			data: null,
			state: null
		}, idx = this._block * 18 + this._offset
		if(this._offset === null) {
			response.state = udState.noData
		} else if(idx >= this._userData.length) {
			response.state = udState.end
		} else if((this._offset < 16) && (idx < (this._userData.length - 2)) {
			response.data = this._userData[idx]
			response.state = udState.data
		} else {
			response.data = this._userData[idx]
			response.state = udState.crc
		}
		if(response.state == udState.data || response.state == udState.crc) {
			this._offset++
			if(this._offset == 18) {
				this._offset = 0
				this._block++
			}
		}
		return response
	}

,	setUserData: function(userData) {
		this._userData = util.isArray(userData)? userData: []
		this._offset = this.data.length>0? 0: null
		this._block = this.data.length>0? 0: null
		this._blockCount = this.getBlockCount()
	}
}
