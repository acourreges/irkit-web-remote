var Setup = (function() {
    
    var result = {};
    
    var requestTimeout = 5000; //ms
    
    var keyByMailURL = "https://api.getirkit.com/1/apps";
    var clientKeyURL = "https://api.getirkit.com/1/clients";
    var deviceKeyURL = "https://api.getirkit.com/1/devices";
    
    var sendWifiConfigURL = "http://192.168.1.1/wifi";
    
    function getHTMLFeedbackOK(message) {
      return '' +
      '<div class="alert alert-success alert-dismissible" role="alert" style="margin-bottom: 0px;">' + 
      '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
      '<strong><span class="glyphicon glyphicon-ok" aria-hidden="true"></span></strong> ' + message +
      '</div>';
    }
    
    function getHTMLFeedbackError(message) {
      return '' +
      '<div class="alert alert-danger alert-dismissible" role="alert" style="margin-bottom: 0px;">' + 
      '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
      '<strong><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span></strong> ' + message +
      '</div>';
    }
    
    function getLoadingHTML() {
        return '<p style="text-align: center; margin-bottom: 0px;"><img src="img/loading.gif"/></p>';
    }

    // Gets an API key
    function sendKeyByMail() {
    
        //Display loading
        $("#keyByEmailFeedback").html(getLoadingHTML());

        $.ajax({
            url: keyByMailURL,
            type: 'POST',
            dataType: 'json',
            data: {
                email: $("#inputEmail").val()
            }
        }).done(function(data, textStatus, jqXHR) {
            $("#keyByEmailFeedback").html(getHTMLFeedbackOK("Request accepted! Please check your emails to get your key."));
        })
        .fail(function(xhr, status, error) {
            $("#keyByEmailFeedback").html(getHTMLFeedbackError("An error occurred while sending the request!<br/>Detail: " + error));
        });
    };
    
    // Gets a device key
    function sendClientKey() {
    
        //Display loading
        $("#deviceKeyFeedback").html(getLoadingHTML());

        $.ajax({
            url: clientKeyURL,
            type: 'POST',
            dataType: 'json',
            data: {
                apikey: $("#inputAPIKey").val()
            }
        }).done(function(data, textStatus, jqXHR) {
            
            var clientKey = data.clientkey;
            
            // Continue to get device key and device id
            
            $.ajax({
                url: deviceKeyURL,
                type: 'POST',
                dataType: 'json',
                data: {
                    clientkey: clientKey
                }
            }).done(function(data, textStatus, jqXHR) {
                
                var deviceKey = data.devicekey;
                var deviceId = data.deviceid;
                
                var message = "Request succeeded!<br/> Your client key is: <strong>" + clientKey + "</strong>";
                message += '<br/> Your device ID is:  <strong>' + deviceId + "</strong>";
                message += '<br/> Your device key is:  <strong>' + deviceKey + "</strong>";
                
                //Pre-fill later step
                $("#inputDeviceKey").val(deviceKey);
                
                $("#deviceKeyFeedback").html(getHTMLFeedbackOK(message));
                
            })
            .fail(function(xhr, status, error) {
                $("#deviceKeyFeedback").html(getHTMLFeedbackError("An error occurred while sending the request!<br/>Detail: " + error));
            });
            
        })
        .fail(function(xhr, status, error) {
            $("#deviceKeyFeedback").html(getHTMLFeedbackError("An error occurred while sending the request!<br/>Detail: " + error));
        });
    };
    
    // Sends home wifi information to IRKit device
    function sendWifiConfiguration() {
        
        $("#sendWifiConfigFeedback").html(getLoadingHTML());
        
        var ssid = $("#inputSSID").val();
        var password = $("#inputPassword").val();
        var security = $("#inputSecurity").val();
        var apiKey = $("#inputDeviceKey").val();
        
        var securityEnum;
        switch (security) {
            case "0": 
                securityEnum  =keyserializer.SECURITY_WPA_WPA2;
                break;
            case "1":
                securityEnum  =keyserializer.SECURITY_WEP;
                break;
            case "2": 
                securityEnum  =keyserializer.SECURITY_NONE;
                break;
        }

        var postData = keyserializer.serialize({
            ssid : ssid,
            password : password,
            security : securityEnum,
            devicekey : apiKey
        });
        

        $.ajax({
            url : sendWifiConfigURL,
            type : 'POST',
            data : postData,
            timeout: requestTimeout,
        }).done(function(data, textStatus, jqXHR) {
            $("#sendWifiConfigFeedback").html(getHTMLFeedbackOK("It's done! You can continue to the next step.<br/>Detail: " + data));
        }).fail(function(xhr, status, error) {
            $("#sendWifiConfigFeedback").html(getHTMLFeedbackError("An error occurred while sending the request!<br/>Detail: " + status));
        });
    }
    
    // Reads an IR command that IRKit picked up
    function readIRSignal() {
        
        $("#readIRFeedback").html(getLoadingHTML());
        
        var ip = $("#inputDeviceIPRead").val();

        $.ajax({
            url : "http://" + ip + "/messages",
            type : 'GET',
            timeout: requestTimeout,
        }).done(function(data, textStatus, jqXHR) {
            if (data.length <= 0) data = "No signal picked-up.";
            $("#readIRFeedback").html(getHTMLFeedbackOK("IRKit answer:<br/><pre>" + data + "</pre>"));
        }).fail(function(xhr, status, error) {
            $("#readIRFeedback").html(getHTMLFeedbackError("An error occurred while sending the request!<br/>Detail: " + status));
        });
    }
    
    // Asks IRKit to send an IR command
    function sendIRSignal() {
        
        $("#sendIRFeedback").html(getLoadingHTML());
        
        var ip = $("#inputDeviceIPSend").val();
        var jsonData = $("#jsonDataSend").val();

        $.ajax({
            url : "http://" + ip + "/messages",
            type : 'POST',
            data: jsonData,
            timeout: requestTimeout,
        }).done(function(data, textStatus, jqXHR) {
            $("#sendIRFeedback").html(getHTMLFeedbackOK("Signal sent!"));
        }).fail(function(xhr, status, error) {
            $("#sendIRFeedback").html(getHTMLFeedbackError("An error occurred while sending the request!<br/>Detail: " + status));
        });
    }
    
    // Public API
    result.sendKeyByMail = sendKeyByMail;
    result.sendClientKey = sendClientKey;
    result.sendWifiConfiguration = sendWifiConfiguration;
    result.readIRSignal = readIRSignal;
    result.sendIRSignal = sendIRSignal;
    
    return result;
})();