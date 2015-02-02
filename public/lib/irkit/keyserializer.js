// auto generated using browserify
// % browserify lib/models/keyserializer.js -s keyserializer -o keyserializer.js     
!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.keyserializer=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var CRC8INIT = 0x00;
var CRC8POLY = 0x31; // = X^8+X^5+X^4+X^0

function crc8 ( data, size, crcinit ) {
    var crc, i, j;

    crc = (typeof crcinit === "undefined") ? CRC8INIT : crcinit;

    for (i=0; i<size; i++ ) {
        var bite;
        if (typeof data === "number") {
            if (data > 255) {
                throw "only input less than 1byte as number";
            }
            bite = data;
        }
        else if (typeof data === "string") {
            if (i < data.length) {
                bite = data.charCodeAt( i );
            }
            else {
                // 0 filled
                bite = 0;
            }
        }
        else {
            throw "only number or string allowed";
        }

        crc ^= bite;

        for (j=0; j<8; j++) {
            if (crc & 0x80) {
                crc = (crc<<1) ^ CRC8POLY;
            }
            else {
                crc <<= 1;
            }
        }
        crc &= 0xFF;
    }

    return crc;
}

module.exports = crc8;

},{}],2:[function(_dereq_,module,exports){
var crc8 = _dereq_("./crc8")
;

const SECURITY_WPA_WPA2 = 8
,     SECURITY_WEP      = 2
,     SECURITY_NONE     = 0
;

function serializeSecurity (security) {
    return security;
}

function serializeSSID (ssid) {
    var ret = "";
    for (var i=0; i<ssid.length; i++) {
        ret += ssid.charCodeAt( i ).toString( 16 ).toUpperCase();
    }
    return ret;
}

function serializePassword (password) {
    var ret = "";
    for (var i=0; i<password.length; i++) {
        ret += password.charCodeAt( i ).toString( 16 ).toUpperCase();
    }
    return ret;
}

function serializeWEPPassword (password) {
    var ret = "";
    for (var i=0; i<password.length; i++) {
        ret += password.charCodeAt( i ).toString( 16 ).toUpperCase();
    }
    return serializePassword( ret );
}

function serializeDevicekey (devicekey) {
    return devicekey;
}

function serializeCRC (obj) {
    var crc;
    crc = crc8( obj.security, 1 );
    crc = crc8( obj.ssid, 33, crc );
    crc = crc8( obj.password, 64, crc );
    crc = crc8( 1, 1, crc ); // wifi_is_set
    crc = crc8( 0, 1, crc ); // wifi_was_valid
    crc = crc8( obj.devicekey, 33, crc );
    return crc.toString( 16 ).toUpperCase();
}

function serialize (obj) {
    return [
        serializeSecurity(obj.security),
        serializeSSID(obj.ssid),
        (obj.security == SECURITY_WEP) ? serializeWEPPassword(obj.password)
                                       : serializePassword(obj.password),
        serializeDevicekey(obj.devicekey),
        '2', // 2: TELEC, 1: FCC, 0: ETSI
        '',
        '',
        '',
        '',
        '',
        serializeCRC(obj)
    ].join("/");
}

module.exports = {
    serialize         : serialize,
    SECURITY_WPA_WPA2 : SECURITY_WPA_WPA2,
    SECURITY_WEP      : SECURITY_WEP,
    SECURITY_NONE     : SECURITY_NONE
};

},{"./crc8":1}]},{},[2])
(2)
});