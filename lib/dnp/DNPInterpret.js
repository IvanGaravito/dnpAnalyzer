var	dnpFlags = require('./dnpFlags.js')
,	DataObject = require('./dataObject.js')
,	dnpi = DNPInterpret

module.exports = DNPInterpret;

function DNPInterpret() {
	var err = false
	,	result = ''
	,	doRaw = {}
	,	doDat = {}
	,	trama = []

}

DNPInterpret.fieldToHtml = function(name, obj) {
	if(typeof obj == 'object' && "show" in obj) {
		return obj.show()
	} else if(typeof obj == 'object') {
		var html = '<div class="group"><div class="title">' + name + '</div>'
		for(var f in obj) {
			html = html + this.fieldToHtml(f, obj[f])
		}
		html = html + '</div>'
		return html
	} else {
		return '<div class="field"><span class="name">' + name + '</span><span class="value">' + obj + '</span></div>'
	}
}

DNPInterpret.getBit = function(value, index) {
	return (value & index)? 1: 0
}

DNPInterpret.getDataLinkFC = function(fc, prm) {
	return dnpFlags.DataLinkFC[prm][fc]
}

DNPInterpret.getApplicationFC = function(fc) {
	if(fc >= 24 && fc <= 120) {
		return "Reserved for future use"
	} else if(fc >= 121 && fc <= 128) {
		return "Reserved for testing only"
	} else if(fc > 130) {
		return null
	}
	return dnpFlags.ApplicationFC[fc]
}

DNPInterpret.getIIN = function(iin, octet) {
	return dnpFlags.IIN[octet][iin]
}

DNPInterpret.getData = function(byteArray, offset, wordBytes) {
	var	data = 0
	,	i = 0
	for(; i < wordBytes; i++) {
		data += byteArray[offset + i] << (8 * i)
	}
	return data
}

DNPInterpret.getDate = function(byteArray, offset) {
	var	data = '0x'
	,	i = 6
	for(; i > 0; i--) {
		data += this.getHexByte(byteArray[offset + i - 1])
	}
	return new Number(data)
}

DNPInterpret.getInterval = function(byteArray, offset) {
	var	data = '0x'
	,	i = 4
	for(; i > 0; i--) {
		data += this.getHexByte(byteArray[offset + i - 1])
	}
	return new Number(data)
}

DNPInterpret.getAIFlag = function(bit, value) {
	return dnpFlags.AIStatus[bit][value]
}

DNPInterpret.getAIFlags = function(data) {
	var	res = []
	,	tmp
	for(var bit = 0; bit < 7; bit++) {
		tmp = this.getAIFlag(bit, this.getBit(data, 0x01 << bit))
		if(tmp) {
			res.push(tmp)
		}
	}
	return res
}

DNPInterpret.getDIFlag = function(bit, value) {
	return dnpFlags.DIStatus[bit][value];
}

DNPInterpret.getDIWithFlags = function(data) {
	var res = {
			value: this.getBit(data, 0x80),
			flags: []
		}
	,	tmp1 = []
	,	tmp2;
	for(var bit = 0; bit < 7; bit++) {
		tmp2 = this.getDIFlag(bit, this.getBit(data, 0x01 << bit));
		if(tmp2) {
			res.flags.push(tmp2);
		}
	}
	return res;
}

DNPInterpret.getHexByte = function(data) {
	return (data >> 4 & 0x0F).toString(16).toUpperCase() + (data & 0x0F).toString(16).toUpperCase()
}

var error = module.exports.Error = {
	NoData: 1,
	InvalidDnpDatagram: 2,
	InvalidHeaderStart: 3
}

DNPInterpret.prototype = {
	getDataObjects: function(byteArray, offset, indexBytes, obj, variation, from, to, args) {
		var	i
		,	res = {
				data: {},
				offset: offset
			}
		,	tmp1, tmp2, tmp3

		if(obj == 1 && variation == 1) {
			console.log("Single-bit inary input@" + offset)
			for(i = 0; i < (to - from + 1); i++) {
				if((i % 8) === 0 && i > 0) {
					offset++
				}
				res.data["DI " + (from + i)] =dnpi.getBit(byteArray[offset], 0x01 << (i % 8))
			}
			res.offset = offset + 1
		} else if(obj == 1 && variation == 2) {
			console.log("Binary input with status@" + offset)
			for(i = 0; i < (to - from + 1); i++) {
				tmp1 = dnpi.getDIWithFlags(byteArray[offset])
				res.data["DI " + (from + i)] = tmp1.value
				if(tmp1.flags.length > 0) {
					res.data["DI " + (from + i)] += " [" + tmp1.flags.join(", ") + "]"
				}
				offset++
			}
			res.offset = offset
		} else if(obj == 2 && variation == 1) {
			console.log("Binary input change without time@" + offset)
			for(i = 0; i < (to - from + 1); i++) {
				tmp1 = dnpi.getDIWithFlags(byteArray[offset])
				res.data["DI " + (from + i)] = tmp1.value
				if(tmp1.flags.length > 0) {
					res.data["DI " + (from + i)] += " [" + tmp1.flags.join(", ") + "]"
				}
				offset++
			}
			res.offset = offset
		} else if(obj == 2 && variation == 2) {
			console.log("Binary input change with time@" + offset)
			for(i = 0; i < (to - from + 1); i++) {
				tmp1 = dnpi.getDIWithFlags(byteArray[offset])
				res.data["DI " + (from + i)] = tmp1.value
				if(tmp1.flags.length > 0) {
					res.data["DI " + (from + i)] += " [" + tmp1.flags.join(", ") + "]"
				}
				offset++
				tmp2 = new Date(dnpi.getDate(byteArray, offset))
				res.data["DI " + (from + i)] += " " + tmp2.toISOString().replace("T", " ").replace("Z", "")
				offset += 6
			}
			res.offset = offset;
		} else if(obj == 2 && variation == 3) {
			console.log("Binary input change with relative time@" + offset)
			for(i = 0; i < (to - from + 1); i++) {
				tmp1 = dnpi.getDIWithFlags(byteArray[offset])
				res.data["DI " + (from + i)] = tmp1.value
				if(tmp1.flags.length > 0) {
					res.data["DI " + (from + i)] += " [" + tmp1.flags.join(", ") + "]"
				}
				offset++
				tmp2 = new Date(args.valueOf() + dnpi.getData(byteArray, offset, 2))
				res.data["DI " + (from + i)] += " " + tmp2.toISOString().replace("T", " ").replace("Z", "")
				offset += 2
			}
			res.offset = offset
		} else if(obj == 30 && (variation == 1 || variation == 2)) {
			console.log((variation == 1? "32": "16") + "-bit analog input@" + offset)
			for(i = 0; i < (to - from + 1); i++) {
				tmp1 = dnpi.getAIFlags(byteArray[offset])
				offset++
				tmp3 = (variation == 1? 4: 2)
				tmp2 = dnpi.getData(byteArray, offset, tmp3)
				res.data["AI " + (from + i)] = tmp2
				if(tmp1.length > 0) {
					res.data["AI " + (from + i)] += " [" + tmp1.join(", ") + "]"
				}
				offset += tmp3
			}
			res.offset = offset
		} else if(obj == 30 && (variation == 3 || variation == 4)) {
			console.log((variation == 3? "32": "16") + "-bit analog input@" + offset)
			for(i = 0; i < (to - from + 1); i++) {
				tmp3 = (variation == 3? 4: 2)
				tmp2 = dnpi.getData(byteArray, offset, tmp3)
				res.data["AI " + (from + i)] = tmp2
				if(tmp2.length > 0) {
					res.data["AI " + (from + i)] += " [" + tmp2.join(", ") + "]"
				}
				offset += tmp3
			}
			res.offset = offset
		} else if(obj == 32 && (variation == 1 || variation == 2)) {
			console.log((variation == 1? "32": "16") + "-bit analog change event without time@" + offset)
			for(i = 0; i < (to - from + 1); i++) {
				tmp1 = dnpi.getAIFlags(byteArray[offset])
				offset++
				tmp3 = (variation == 1? 4: 2)
				tmp2 = dnpi.getData(byteArray, offset, tmp3)
				res.data["AI " + (from + i)] = tmp2
				if(tmp1.length > 0) {
					res.data["AI " + (from + i)] += " [" + tmp1.join(", ") + "]"
				}
				offset += tmp3
			}
			res.offset = offset
		} else if(obj == 50 && variation == 1) {
			console.log("Time and date@" + offset)
			for(i = 0; i < (to - from + 1); i++) {
				tmp2 = new Date(dnpi.getDate(byteArray, offset))
				res.cto = tmp2
				res.data["T&D " + (from + i)] = {}
				res.data["T&D " + (from + i)] = " " + tmp2.toISOString().replace("T", " ").replace("Z", "")
				offset += 6
			}
			res.offset = offset
		} else if(obj == 50 && variation == 2) {
			console.log("Time and date with Interval@" + offset)
			for(i = 0; i < (to - from + 1); i++) {
				tmp2 = new Date(dnpi.getDate(byteArray, offset))
				res.data["T&D " + (from + i)] = {}
				res.data["T&D " + (from + i)] = " " + tmp2.toISOString().replace("T", " ").replace("Z", "")
				offset += 6
				tmp1 = tmp2 = dnpi.getInterval(byteArray, offset)
				res.data["T&D Interval" + (from + i)] = ""
				tmp3 = []
				tmp3.push((tmp2 % 1000) + "ms")
				tmp2 = (tmp2 / 1000).toFixed()
				tmp3.push((tmp2 % 60) + "s")
				tmp2 = (tmp2 / 60).toFixed()
				tmp3.push((tmp2 % 60) + "m")
				tmp2 = (tmp2 / 60).toFixed()
				tmp3.push((tmp2 % 24) + "h")
				tmp2 = (tmp2 / 24).toFixed()
				tmp3.push(tmp2 + "d")
				var n
				while(n = tmp3.pop()) {
					res.data["T&D Interval" + (from + i)] += " " + n
				}
				offset += 4
			}
			res.offset = offset
		} else if(obj == 50 && variation == 3) {
			console.log("Last recorded time@" + offset)
			for(i = 0; i < (to - from + 1); i++) {
				tmp2 = new Date(dnpi.getDate(byteArray, offset))
				res.cto = tmp2
				res.data["LRT " + (from + i)] = {}
				res.data["LRT " + (from + i)] = " " + tmp2.toISOString().replace("T", " ").replace("Z", "")
				offset += 6
			}
			res.offset = offset
		} else if(obj == 51 && variation == 1) {
			console.log("Time and date CTO@" + offset)
			for(i = 0; i < (to - from + 1); i++) {
				tmp2 = new Date(dnpi.getDate(byteArray, offset))
				res.cto = tmp2
				res.data["CTO " + (from + i)] = {}
				res.data["CTO " + (from + i)] = " " + tmp2.toISOString().replace("T", " ").replace("Z", "")
				offset += 6
			}
			res.offset = offset
		} else {
			console.log("Object/Variation not compatible: Object " + obj + " Variation " + variation + "@" + offset)
		}
		return res
	}

,	setDatagram: function(datagram) {
		if(!datagram)
			return false

		if(datagram.length < 20 || (datagram.length % 2 == 1))
			return (this.err = error.InvalidDnpDatagram)

		var trama = this.trama = []
		,	tramaLength = (datagram.length / 2).toFixed(0)

		for(var b = 0; b < tramaLength; b++)
			trama[b] = Number('0x' + datagram.substr(b * 2, 2))

		return true
	}

,	interpret: function(callback) {
		var trama = this.trama

		/* 
			DATA LINK LAYER
		*/
		/* Header */
console.log("DATA LINK HEADER")
		//Sync or Start Field
		if(!(trama[0] == 0x05 && trama[1] == 0x64)) {
			if(callback && typeof callback == 'function') {
				callback(error.InvalidHeaderStart, '<div class="error">Inicio no v&aacute;lido</div>')
			}
			return
		}

		var err = this.err = false
		,	result = this.result = ''
		,	obj = {}
		,	fnCode
		,	userDataBlocks
		,	doRaw = this.doRaw = {}
		,	doDat = this.doDat = {}

		obj.Header = {}
		doDat['DLH'] = new DataObject({name:'Data Link Header', type:DataObject.doType.block})

		doRaw['DLH_Sync'] = new DataObject({name:'rawSync', value:0x6405, type:DataObject.doType.raw, bytes:2, linkId:'Sync'})
		doDat['DLH'].items['Sync'] = new DataObject({name:'Sync', value:'05 64', linkId:'rawSync'})
//<<
		obj.Header.Start = new DataObject({name:'Start', value:'05 64'})
//>>
		//Length Field
		doRaw['DLH_Len'] = new DataObject({name:'rawLength', value:trama[2], type:DataObject.doType.raw, linkId:'Length'})
		doDat['DLH'].items['Len'] = new DataObject({name:'Length', value:trama[2], linkId:'rawLength'})
//<<
		obj.Header.Length = new DataObject({name:'Length', value:trama[2], id:"x"})
//>>

		doDat['DLH'].items['UDB'] = new DataObject({name:'User Data Blocks', value:(doDat['DLH'].items['Len'].value == 5? 0: Math.ceil((trama.length - 10) / 18)), id:null, linkId:null})
//<<
		userDataBlocks = doDat['DLH'].items['Len'].value == 5? 0: Math.ceil((trama.length - 10) / 18)
		obj.Header["User Data Blocks"] = userDataBlocks
//>>
		if(doDat['DLH'].items['Len'].value != (trama.length - 5 - doDat['DLH'].items['UDB'].value * 2)) {
			doDat['DLH'].items['Len'].error = 'Campo no v&aacute;lido (trama='+trama.length+')'
//<<
			if(callback && typeof callback == 'function') {
				callback(error.InvalidHeaderStart, '<div class="error">Campo "length" no v&aacute;lido '+trama.length+' : '+doDat['DLH'].items['Len'].value+' : '+doDat['DLH'].items['UDB'].value+'</div>')
			}
//>>
			return
		}
		//Link Control Field
		doRaw['DLH_LC'] = new DataObject({name:'rawDLH_LC', value:trama[3], type:DataObject.doType.raw, linkId:'DLH_LC'})
		doDat['DLH'].items['LC'] = new DataObject({name:'Link Control', type:DataObject.doType.group, id:'DLH_LC', linkId:'rawDLH_LC'})
		doDat['DLH'].items['LC'].items['DIR'] = new DataObject({name:'DIR', value:dnpi.getBit(trama[3], 0x80)})
		doDat['DLH'].items['LC'].items['PRM'] = new DataObject({name:'PRM', value:dnpi.getBit(trama[3], 0x40)})
		if(doDat['DLH'].items['LC'].items['PRM']) {
			doDat['DLH'].items['LC'].items['FCB'] = new DataObject({name:'FCB', value:dnpi.getBit(trama[3], 0x20)})
			doDat['DLH'].items['LC'].items['FCV'] = new DataObject({name:'FCV', value:dnpi.getBit(trama[3], 0x10)})
		} else {
			doDat['DLH'].items['LC'].items['RES'] = new DataObject({name:'RES', value:dnpi.getBit(trama[3], 0x20)})
			doDat['DLH'].items['LC'].items['DFC'] = new DataObject({name:'DFC', value:dnpi.getBit(trama[3], 0x10)})
		}
		doDat['DLH'].items['LC'].items['FC'] = new DataObject({name:'Function Code', value:trama[3] & 0x0F})
		fnCode = dnpi.getDataLinkFC(doDat['DLH'].items['LC'].items['FC'].value, doDat['DLH'].items['LC'].items['PRM'].value)
		doDat['DLH'].items['LC'].items['FC'].msg = (fnCode? (fnCode.serviceFn? fnCode.serviceFn: fnCode.frameType): "Not used")
//<<
		obj.Header["Link Control"] = {}
		obj.Header["Link Control"].DIR = dnpi.getBit(trama[3], 0x80)
		obj.Header["Link Control"].PRM = dnpi.getBit(trama[3], 0x40)
		if(obj.Header["Link Control"].PRM) {
			obj.Header["Link Control"].FCB = dnpi.getBit(trama[3], 0x20)
			obj.Header["Link Control"].FCV = dnpi.getBit(trama[3], 0x10)
		} else {
			obj.Header["Link Control"].RES = dnpi.getBit(trama[3], 0x20)
			obj.Header["Link Control"].DFC = dnpi.getBit(trama[3], 0x10)
		}
		obj.Header["Link Control"]["Function Code"] = trama[3] & 0x0F
		fnCode = dnpi.getDataLinkFC(obj.Header["Link Control"]["Function Code"], obj.Header["Link Control"].PRM)
		obj.Header["Link Control"]["Function Code"] += ": " + (fnCode? (fnCode.serviceFn? fnCode.serviceFn: fnCode.frameType): "Not used")
//>>
		//Dst Address Field
		doRaw['DLH_DstAddr'] = new DataObject({name:'rawDLH_DstAddr', value:(trama[5] << 8) | trama[4], type:DataObject.doType.raw, bytes:2, linkId:'DLH_DstAddr'})
		doDat['DLH'].items['DstAddr'] = new DataObject({name:'Dst Addr', value:(trama[5] << 8) | trama[4], id:'DLH_DstAddr', linkId:'rawDLH_DstAddr'})
//<<
		obj.Header["Dst Addr"] = (trama[5] << 8) | trama[4]
//>>
		//Src Address Field
		doRaw['DLH_SrcAddr'] = new DataObject({name:'rawDLH_SrcAddr', value:(trama[7] << 8) | trama[6], type:DataObject.doType.raw, bytes:2, linkId:'DLH_SrcAddr'})
		doDat['DLH'].items['SrcAddr'] = new DataObject({name:'Src Addr', value:(trama[7] << 8) | trama[6], id:'DLH_SrcAddr', linkId:'rawDLH_SrcAddr'})
//<<
		obj.Header["Src Addr"] = (trama[7] << 8) | trama[6]
//>>
		//CRC Field
		doRaw['DLH_CRC'] = new DataObject({name:'rawDLH_CRC', value:(trama[9] << 8) | trama[8], type:DataObject.doType.raw, bytes:2, linkId:'DLH_CRC'})
		doDat['DLH'].items['CRC'] = new DataObject({name:'CRC', value:(trama[9] << 8) | trama[8], id:'DLH_CRC', linkId:'rawDLH_CRC', showType:DataObject.doShowType.hex, bytes:2})
//<<
		obj.Header.CRC = '0x' + (trama[8] >> 4 & 0x0F).toString(16).toUpperCase() + (trama[8] & 0x0F).toString(16).toUpperCase() + (trama[9] >> 4 & 0x0F).toString(16).toUpperCase() + (trama[9] & 0x0F).toString(16).toUpperCase()

		var userData = []
		if(doDat['DLH'].items['UDB'].value > 0) {
console.log(userDataBlocks + " user data blocks found")
			var offset = 0
			for(userDataBlock = 0; userDataBlock < doDat['DLH'].items['UDB'].value; userDataBlock++) {
				for(offset = 0; (offset < 16) && (10 + (userDataBlock * 18) + offset) < (trama.length - 2); offset++) {
					userData.push(trama[10 + (userDataBlock * 18) + offset])
				}
			}

			var	counter
			offset = 0

			/*
				TRANSPORT LAYER
			*/
console.log("TRANSPORT HEADER")
			doDat['TR'] = new DataObject({name:'Transport', type:DataObject.doType.block})

			/* Transport Header */
			doRaw['TR_TH'] = new DataObject({name:'rawTR_TH', value:userData[offset], type:DataObject.doType.raw, linkId:'TH'})
			doDat['TR'].items['TH'] = new DataObject({name:'TH', type:DataObject.doType.group, linkId:'rawTR_TH'})
//<<
			obj.Transport = {}
//>>

			//FIR Field
			doDat['TR'].items['TH'].items['FIR'] = new DataObject({name:'FIR', value:dnpi.getBit(userData[offset], 0x80), id:null, linkId:null})
//<<
			obj.Transport.FIR = dnpi.getBit(userData[offset], 0x80)
//>>
			//FIN Field
			doDat['TR'].items['TH'].items['FIN'] = new DataObject({name:'FIR', value:dnpi.getBit(userData[offset], 0x40), id:null, linkId:null})
//<<
			obj.Transport.FIN = dnpi.getBit(userData[offset], 0x40)
//>>
			//Sequence Field
			doDat['TR'].items['TH'].items['SEQ'] = new DataObject({name:'SEQ', value:userData[offset] & 0x3F, id:null, linkId:null})
//<<
			obj.Transport.Sequence = userData[offset] & 0x3F
//>>
			offset++

			/*
				USER DATA
			*/
console.log("APPLICATION DATA")
			doDat['APP'] = new DataObject({name:'Application', type:DataObject.doType.block})
//<<
			obj.Application = {}
//>>
			//Application Control
			doRaw['APP_AC'] = new DataObject({name:'rawAPP_AC', value:userData[offset], type:DataObject.doType.raw, linkId:'APP_AC'})
			doDat['APP'].items['AC'] = new DataObject({name:'AC', type:DataObject.doType.group, id:'APP_AC', linkId:'rawAPP_AC'})
//<<
			obj.Application["AC"] = {}
			//FIR Field
			doDat['APP'].items['AC'].items['FIR'] = new DataObject({name:'FIR', value:dnpi.getBit(userData[offset], 0x80)})
//<<
			obj.Application["AC"].FIR = dnpi.getBit(userData[offset], 0x80)
//>>
			//FIN Field
			doDat['APP'].items['AC'].items['FIN'] = new DataObject({name:'FIN', value:dnpi.getBit(userData[offset], 0x40)})
//<<
			obj.Application["AC"].FIN = dnpi.getBit(userData[offset], 0x40)
//>>
			//CON Field
			doDat['APP'].items['AC'].items['CON'] = new DataObject({name:'CON', value:dnpi.getBit(userData[offset], 0x20)})
//<<
			obj.Application["AC"].CON = dnpi.getBit(userData[offset], 0x20)
//>>
			//Sequence Field
			doDat['APP'].items['AC'].items['SEQ'] = new DataObject({name:'SEQ', value:userData[offset] & 0x1F})
//<<
			obj.Application["AC"].Sequence = userData[offset] & 0x1F
//>>
			if(doDat['DLH'].items['LC'].items['DIR'].value == 0 && doDat['APP'].items['AC'].items['SEQ'].value > 15) {
				//Unsolicited response
				doDat['APP'].items['AC'].msg = 'Unsolicited response'
			}
			offset++

			doRaw['APP_FC'] = new DataObject({name:'rawAPP_FC', value:userData[offset], type:DataObject.doType.raw, linkId:'APP_FC'})
			doDat['APP'].items['FC'] = new DataObject({name:'Function Code', value:userData[offset], msg:dnpi.getApplicationFC(userData[offset]) || 'Not used', id:'APP_FC', linkId:'rawAPP_FC'})
//<<
			obj.Application["FC"] = {}
			obj.Application["FC"]["Function Code"] = userData[offset]
			fnCode = dnpi.getApplicationFC(userData[offset])
			obj.Application["FC"]["Function Code"] += ": " + (fnCode? fnCode: "Not used")
//>>
			offset++

			if(doDat['DLH'].items['LC'].items['DIR'].value == 0) {
				doRaw['APP_IIN'] = new DataObject({name:'rawAPP_IIN', value:(userData[offset + 1] << 8) | userData[offset], type:DataObject.doType.raw, linkId:'IIN'})
				doDat['APP'].items['IIN'] = new DataObject({name:'IIN', type:DataObject.doType.group, linkId:'rawAPP_IIN'})
//<<
				obj.Application.IIN = {}
//>>
				counter = 0
				for(var octet = 0; octet < 2; octet++) {
					for(var bit = 0; bit < 8; bit++) {
						if(dnpi.getBit(userData[offset + octet], 0x01 << bit)) {
							doDat['APP'].items['IIN'].items["B"+(octet+1)+"b"+bit] = new DataObject({value:dnpi.getIIN(bit, octet+1)})
//<<
							obj.Application.IIN["B" + (octet + 1) + " b" +  bit] = dnpi.getIIN(bit, octet + 1)
//>>
							counter++
						}
					}
				}
				if(!counter) {
					delete obj.Application.IIN
				}
				offset += 2
			}

			var iSize
			,	qCode
			,	wordBytes
			,	objectDataResult
			,	lastCTO
			,	i
			,	iObj
			,	iVar

			counter = 0
console.log("Entering to object header/data")
			while(offset < userData.length) {
console.log("Position: " + offset + "/" + userData.length)
				counter++
				doDat['APP'].items['OH_'+counter] = new DataObject({type:DataObject.doType.group})
//<<
				obj.Application["Object Header " + counter] = {}
//>>

				doRaw['APP_OH_'+counter+'_O'] = new DataObject({name:'rawAPP_OH_'+counter+'_O', value:userData[offset], type:DataObject.doType.raw, linkId:'APP_OH_'+counter+'_O'})
				doDat['APP'].items['OH_'+counter].items['O'] = new DataObject({name:'Object', value:userData[offset], id:'APP_OH_'+counter+'_O', linkId:'rawAPP_OH_'+counter+'_O'})
				iObj = doDat['APP'].items['OH_'+counter].items['O'].value
//<<
				obj.Application["Object Header " + counter].Object = iObj = userData[offset]
//>>
				offset++
				doRaw['APP_OH_'+counter+'_V'] = new DataObject({name:'rawAPP_OH_'+counter+'_V', value:userData[offset], type:DataObject.doType.raw, linkId:'APP_OH_'+counter+'_V'})
				doDat['APP'].items['OH_'+counter].items['V'] = new DataObject({name:'Variation', value:userData[offset], id:'APP_OH_'+counter+'_V', linkId:'rawAPP_OH_'+counter+'_V'})
				iVar = doDat['APP'].items['OH_'+counter].items['V'].value
//<<
				obj.Application["Object Header " + counter].Variation = iVar = userData[offset]
//>>
				offset++
				doRaw['APP_OH_'+counter+'_Q'] = new DataObject({name:'rawAPP_OH_'+counter+'_Q', value:userData[offset], type:DataObject.doType.raw, linkId:'APP_OH_'+counter+'_Q'})
				doDat['APP'].items['OH_'+counter].items['Q'] = new DataObject({name:'Qualifier', value:userData[offset], showType:DataObject.doShowType.hex, id:'APP_OH_'+counter+'_Q', linkId:'rawAPP_OH_'+counter+'_Q'})
//<<
				obj.Application["Object Header " + counter].Qualifier = '0x' + dnpi.getHexByte(userData[offset])
				if(dnpi.getBit(userData[offset], 0x80) == 0) {
					iSize = (userData[offset] & 0x70) >> 4
					qCode = userData[offset] & 0x0F
					offset++
					if(qCode >= 0 && qCode <= 5) {
						if(iSize == 0) {
							if(qCode == 0 || qCode == 3) {			//8 bits Data objects defined in ranges
								wordBytes = 1
							} else if(qCode == 1 || qCode == 4) {	//16 bits Data objects defined in ranges
								wordBytes = 2
							} else if(qCode == 2 || qCode == 5) {	//32 bits Data objects defined in ranges
								wordBytes = 4
							}
							obj.Application["Object Header " + counter].I1 = dnpi.getData(userData, offset, wordBytes)
							offset += wordBytes
							obj.Application["Object Header " + counter].I2 = dnpi.getData(userData, offset, wordBytes)
							offset += wordBytes
							if(obj.Header["Link Control"].DIR == 0) {
								objectDataResult = this.getDataObjects(userData, offset, 1, iObj, iVar, obj.Application["Object Header " + counter].I1, obj.Application["Object Header " + counter].I2)
								obj.Application["Object Response " + counter] = objectDataResult.data
								offset = objectDataResult.offset
							}
						} else {
							obj.Application["Object Header " + counter].Qualifier += ': Not valid'
						}
					} else if(qCode == 6) {	//All data objects
						if(obj.Header["Link Control"].DIR == 0 || iSize != 0) {
							obj.Application["Object Header " + counter].Qualifier += ': Not valid'
						}
					} else if(qCode >= 7 && qCode <= 9) {
						if(qCode == 7) {		//8 bits Data objects defined in ranges
							wordBytes = 1
						} else if(qCode == 8) {	//16 bits Data objects defined in ranges
							wordBytes = 2
						} else if(qCode == 9) {	//32 bits Data objects defined in ranges
							wordBytes = 4
						}
						obj.Application["Object Header " + counter].Q = dnpi.getData(userData, offset, wordBytes)
						offset += wordBytes
						if(iSize == 0 && obj.Header["Link Control"].DIR == 1 && obj.Application["FC"]["Function Code"] == "2: Write") {
							obj.Application["Object Sent " + counter] = {}
							for(i = 0; i < obj.Application["Object Header " + counter].Q; i++) {
								objectDataResult = this.getDataObjects(userData, offset, 1, iObj, iVar, i, i)
								obj.Application["Object Sent " + counter]["I" + i] = objectDataResult.data
								offset = objectDataResult.offset
							}
						} else if(iSize == 0 && obj.Header["Link Control"].DIR == 0) {
							obj.Application["Object Response " + counter] = {}
							for(i = 0; i < obj.Application["Object Header " + counter].Q; i++) {
								objectDataResult = this.getDataObjects(userData, offset, 1, iObj, iVar, i, i)
								if(iObj == 51 && iVar == 1) {
									lastCTO = objectDataResult.cto
								}
								obj.Application["Object Response " + counter]["I" + i] = objectDataResult.data
								offset = objectDataResult.offset
							}
						} else if(iSize >= 1 && iSize <= 3) {
							var indexBytes = 0
							if(iSize == 1) {		//8 bits Data objects defined in ranges
								indexBytes = 1
							} else if(iSize == 2) {	//16 bits Data objects defined in ranges
								indexBytes = 2
							} else if(iSize == 3) {	//32 bits Data objects defined in ranges
								indexBytes = 4
							}
							if(obj.Header["Link Control"].DIR == 0) {
								obj.Application["Object Response " + counter] = {}
							}
							for(i = 1; i <= obj.Application["Object Header " + counter].Q; i++) {
								obj.Application["Object Header " + counter]["I" + i] = dnpi.getData(userData, offset, indexBytes)
								offset += wordBytes
								if(obj.Header["Link Control"].DIR == 0) {
									objectDataResult = this.getDataObjects(userData, offset, 1, iObj, iVar, obj.Application["Object Header " + counter]["I" + i], obj.Application["Object Header " + counter]["I" + i], lastCTO)
									obj.Application["Object Response " + counter]["I" + i] = objectDataResult.data
									offset = objectDataResult.offset
								}
							}
						} else {
							obj.Application["Object Header " + counter].Qualifier += ': Not valid'
						}
					} else if(qCode == 11) {	//
						if(obj.Header["Link Control"].DIR == 1 && iSize > 0 && iSize < 4) {
						} else {
							//Not valid
						}
					} else {
						obj.Application["Object Header " + counter].Qualifier += ": Reserved"
					}
				} else {
					obj.Application["Object Header " + counter].Qualifier += ": Not valid"
					offset++
				}
			}
		}

console.log("RENDERING DATA")
		var resTrama = ''
		var resInter = ''
		for(var g in obj) {
			result = result + '<div class="panel panel-default"><div class="panel-heading">' + g + '</div><div class="panel-body">'
			for(var f in obj[g]) {
				result = result + dnpi.fieldToHtml(f, obj[g][f])
			}
			result = result + '</div></div>'
		}
		/*result += '\n\n<div class="block"><div class="title">Datagram</div>'
		for(var g in doRaw) {
			result += doRaw[g].show()
		}
		result += '</div>'
		result += '\n\n<div class="block"><div class="title">Interpret</div>'
		for(var g in doDat) {
			result += doDat[g].show()
		}
		result += '</div>'*/
		this.result = result;
		if(callback && typeof callback == 'function') {
			callback(false, result)
		}
	}
}
