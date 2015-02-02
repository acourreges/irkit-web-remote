var Scheduler = (function() {
    
    var result = {};
    
    var currentQueue = [];
    
    // action should be "command" or "sequence"
    function queue(action, host, payload){
        
        var manualKick = (currentQueue.length == 0);
        
        currentQueue.push({
            action: action,
            host: host,
            payload: payload
        });
        
        onNewOrderQueued();
        
        manualKick && treatNextTask();
    };
    
    function onNewOrderQueued() {
        if (currentQueue.length > 1) {
            onQueueFlood();
        }
        updateView();
    };
    
    var progressBarVisible = false;
    var progressBarTotalTask = 1;
    
    function onQueueFlood() {
        if (!progressBarVisible) progressBarTotalTask = 1;
        progressBarTotalTask += 1;
        showQueue();
    };
    
    function showQueue() {
        progressBarVisible = true;
        $("#requestQueueIndicator")[0].style["marginTop"] = "0px";
        $("#requestQueueIndicator")[0].style["opacity"] = "1";
    };
    
    function hideQueue() {
        progressBarVisible = false;
        $("#requestQueueIndicator")[0].style["marginTop"] = "-50px";
        $("#requestQueueIndicator")[0].style["opacity"] = "0";
    };
    
    var cacheReqNumber = -1;
    
    function updateView() {
        
        // Update text
        var reqNumber = currentQueue.length;
        if (cacheReqNumber != reqNumber) {
            cacheReqNumber = reqNumber;
            var labelTxt = reqNumber + " request";
            if (reqNumber > 1) labelTxt += "s";
            labelTxt += " to send...";
            $('#queueRequestLabel').html(labelTxt);
        }
        
        // Update progress bar
        var newPercent = Math.floor((progressBarTotalTask - reqNumber) / progressBarTotalTask * 100);
        //console.log("Progress: " + newPercent);
        
        var progressBar = $("#requestQueue");
        var innerBar = progressBar.find(".progress-bar")[0];
        innerBar.style.width = newPercent + "%";
    }
    
    function treatNextTask() {
        
        // Update visual progress
        updateView();
        if (currentQueue.length == 0) {
            hideQueue();
            return;
        }
        
        var task = currentQueue[0];
        var isCommand = (task.action == "command");
        
        var delay =  Config.schedulerDelay * 1000;
        if (!isCommand) delay = 1; // Don't wait for sequences
        
        var delayAndTreatNext = function() {
            
            var shiftAndContinue = function() {
                currentQueue.shift();
                treatNextTask();
            };
            
            setTimeout( shiftAndContinue, delay );
        };
        
        // console.log("Processing: " + JSON.stringify(task));
        
        switch (task.action) {
            case "command":
                performCmd(task.host, task.payload, delayAndTreatNext);
                break;
                
            case "sequence":
                performSeq(task.host, task.payload, delayAndTreatNext);
                break;
    
            default:
                console.error("Unknow command type " + task.action);
                break;
        }
    }
    
    function clearQueue() {
        currentQueue = [];
        hideQueue();
    }
    
    //Public API
    result.queue = queue;
    result.clearQueue = clearQueue;
    
    return result;
})();