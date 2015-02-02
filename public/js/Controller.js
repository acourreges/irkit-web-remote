
// Sends a single command.
// This is actually queued to avoid flooding the remote.
function sendCmd(deviceName, commandID) {
    Scheduler.queue("command", deviceName, commandID);
}

// Immediate sending of the command without scheduler.
function performCmd(deviceName, commandID, onDone) {

    var host = Config.irDevices[deviceName];

    if (!host) {
        console.error("Device " + host + " not found");
        return;
    }

    var payload = irCommands[commandID];
    if (!payload) {
        console.error("Command " + commandID + " not found");
        return;
    }

    sendRawCommand(host, payload);
    
    onDone && onDone();
}

// Sends a sequence of commands.
// This is actually queued to avoid flooding the remote.
function sendSeq(deviceName, commandID) {
    Scheduler.queue("sequence", deviceName, commandID);
}


// Immediate sending of the sequence without scheduler.
function performSeq(deviceName, sequenceID, onDone) {
	var host = Config.irDevices[deviceName];
	
	if (!host) {
		console.error("Device " + host + " not found");
		return;
	}
	
	var seq = irSequences[sequenceID];
	if (!seq) {
		console.error("Sequence " + sequenceID + " not found");
		return;
	}
	
	var treatTask = function(index) {
		if (index == seq.length) {
		    onDone && onDone();
			return;
		}
		var task = seq[index];
		
		var payload = irCommands[task.command];
		if (!payload) {
			console.error("Command " + commandID + " not found");
			return;
		}
		
		var timeToWait = task.timer;
		
		sendRawCommand(host, payload);
		setTimeout( function() { treatTask(index+1); }, timeToWait * 1000 );
	};
	
	treatTask(0);  // Kicks the sequence
}

// Actual network call to POST the request to IRKit
function sendRawCommand(irDeviceAddress, payload) {
    if (Config.supportAccessFromWAN) {
        // Goes through the forwarder, so it works even from the WAN.
        $.ajax({
            type: "POST",
            url: Config.postForwarderURL,
            data: { host: irDeviceAddress, path: "/messages", payload: payload },
        });
    } else {
        // Send directly (only works inside the LAN).
        $.ajax({
            type: "POST",
            url: "http://" + irDeviceAddress + "/messages",
            data: payload
        });
    }
}