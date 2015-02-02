/**
 * Main configuration file for IRKitWebRemote.
 */

var Config = {
        
    // Define your IRKit devices with a name and the associated IP address.
    irDevices: {
        living: "192.168.11.30" 
    },
    
    // If you wish to be able to access the interface from the internet, turn this on.
    // This will forward the POST requests from a client to an IRKit device. IRKit doesn't need to be 
    // exposed online. 
    // Note that this feature requires PHP5 with curl enabled. 
    supportAccessFromWAN: true,
    
    // Path of the PHP script for POST request proxying and forwarding.
    // Only useful if 'supportAccessFromWAN' is enabled. 
    // (Reason: security. The script, unlike the IRKit device, can be safely exposed to 
    // the Internet and because of same-origin policy restrictions the browser might complain
    // it cannot communicate with the IRKit directly.
    // Also it's the only way to support HTTPS.)
    postForwarderURL: "dopost.php",
    
    // How much delay between 2 consecutive commands in seconds.
    // (We can't spam the device with a lot of requests simultaneously, 
    // requests are put in a queue and sent sequentially.)
    schedulerDelay: 0.7, 

    // More configuration: define IR commands in the "Commands.js" file.
};