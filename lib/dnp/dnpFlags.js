var DataLinkFC = {
	0: {		//prm = 0
		0: {
			frameType: "CONFIRM",
			serviceFn: "ACK - positive acknowledgement"
		}, 1: {
			frameType: "CONFIRM",
			serviceFn: "NACK - Message not accepted, Link busy"
		}, 11: {
			frameType: "RESPOND",
			serviceFn: "Status of Link (DFC = 0 or DFC = 1)"
		}, 14: {
			frameType: "Link service not functioning"
		}, 15: {
			frameType: "Link service not used or implemented"
		}
	},	1: {	//prm = 1
		0: {
			frameType: "SEND - CONFIRM expected",
			serviceFn: "Reset of remote link",
			fcv:		0
		}, 1: {
			frameType: "SEND - CONFIRM expected",
			serviceFn: "Reset of user process",
			fcv:		0
		}, 2: {
			frameType: "SEND - CONFIRM expected",
			serviceFn: "Test function for link",
			fcv:		1
		}, 3: {
			frameType: "SEND - CONFIRM expected",
			serviceFn: "User Data",
			fcv:		1
		}, 4: {
			frameType: "SEND - NO REPLY expected",
			serviceFn: "Unconfirmed User Data",
			fcv:		0
		}, 9: {
			frameType: "REQUEST - RESPOND expected",
			serviceFn: "Request link status",
			fcv:		0
		}
	}
};
exports.DataLinkFC = DataLinkFC;

var ApplicationFC = {
	//Transfer Funcion Codes
	0: "Confirm",
	1: "Read",
	2: "Write",
	//Control Funcion Codes
	3: "Select",
	4: "Operate",
	5: "Direct Operate",
	6: "Direct Operate - No Acknowledgment",
	//Freeze Funcion Codes
	7: "Inmediate Freeze",
	8: "Inmediate Freeze - No Acknowledgment",
	//Transfer Funcion Codes
	9: "Freeze and Clear",
	10: "Freeze and Clear - No Acknowledgment",
	11: "Freeze with Time",
	12: "Freeze with Time - No Acknowledgment",
	//Application Control Funcion Codes
	13: "Cold Restart",
	14: "Warm Restart",
	15: "Initialize Data to Defaults",
	16: "Initialize Application",
	17: "Start Application",
	18: "Stop Application",
	//Configuration Funcion Codes
	19: "Save Configuration",
	20: "Enable Unsolicited Messages",
	21: "Disable Unsolicited Messages",
	22: "Assign Class",
	//Time Synchronization Funcion Codes
	23: "Delay Measurement",
	//Response Function Codes
	//0: "Confirm",
	129: "Response",
	130: "Unsolicited Message"
};
exports.ApplicationFC = ApplicationFC;

var IIN = {
	1: {	//octet = 1st
		0: "Broadcasted message received",
		1: "Class 1",
		2: "Class 2",
		3: "Class 3",
		4: "Time synchronization required",
		5: "Some/All DO points in Local",
		6: "Device trouble",
		7: "Device restart"
	}, 2: {	//octet = 2nd
		0: "Function Code not implemented",
		1: "Request object unknown",
		2: "Parameters not valid or out of range",
		3: "Buffer overflow",
		4: "Already executing",
		5: "Configuration corrupt",
		6: "Reserved, always zero",
		7: "Reserved, always zero"
	}
};
exports.IIN = IIN;

var AIStatus = {
	0: {
		0: "Offline",
		1: "Online"
	}, 1: {
		//0: "Normal",
		1: "Restart"
	}, 2: {
		//0: "Normal",
		1: "COM Lost"
	}, 3: {
		//0: "Normal",
		1: "Remote forced"
	}, 4: {
		//0: "Normal",
		1: "Local forced"
	}, 5: {
		//0: "Normal",
		1: "Over-range"
	}, 6: {
		//0: "Normal",
		1: "Reference check error"
	}, 7: {
		//0: "Normal",
		1: "Reserved"
	}
};
exports.AIStatus = AIStatus;

var CNStatus = {
	0: {
		0: "Offline",
		1: "Online"
	}, 1: {
		//0: "Normal",
		1: "Restart"
	}, 2: {
		//0: "Normal",
		1: "COM Lost"
	}, 3: {
		//0: "Normal",
		1: "Remote forced"
	}, 4: {
		//0: "Normal",
		1: "Local forced"
	}, 5: {
		//0: "Normal",
		1: "Roll-over"
	}, 6: {
		//0: "Normal",
		1: "Reserved"
	}, 7: {
		//0: "Normal",
		1: "Reserved"
	}
};
exports.CNStatus = CNStatus;

var DIStatus = {
	0: {
		0: "Offline",
		1: "Online"
	}, 1: {
		//0: "Normal",
		1: "Restart"
	}, 2: {
		//0: "Normal",
		1: "COM Lost"
	}, 3: {
		//0: "Normal",
		1: "Remote forced"
	}, 4: {
		//0: "Normal",
		1: "Local forced"
	}, 5: {
		//0: "Normal",
		1: "Filter on"
	}, 6: {
		//0: "Normal",
		1: "Reserved"
	}, 7: {
		0: "OFF",
		1: "ON"
	}
};
exports.DIStatus = DIStatus;

var DOStatus = {
	0: {
		0: "Offline",
		1: "Online"
	}, 1: {
		//0: "Normal",
		1: "Restart"
	}, 2: {
		//0: "Normal",
		1: "COM Lost"
	}, 3: {
		//0: "Normal",
		1: "Remote forced"
	}, 4: {
		//0: "Normal",
		1: "Local forced"
	}, 5: {
		//0: "Normal",
		1: "Reserved"
	}, 6: {
		//0: "Normal",
		1: "Reserved"
	}, 7: {
		0: "OFF",
		1: "ON"
	}
};
exports.DOStatus = DOStatus;
