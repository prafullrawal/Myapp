var client = null;
var server = null;
var port = 443;

// We build a deviceId that represents a randomly generated MAC address
var deviceId = null;

var url = null;

var clientId = null;
var interval = 2000;

//clear the interval when connection is lost or failed
var timer = null;

//
var orgID = 'xstg32';
var devType = 'TrackingItem';
var devID = 'Mydevice';
var devToken = 'XC(5sCXSqZSbJkgYqw';
var metaData = null;

function connectionLost() {
    console.log("connection lost! - reconnecting");
    clearInterval(timer);
    client.connect({
        onSuccess: onConnectSuccess,
        onFailure: onConnectFailure,
        useSSL: true
    });
}

function onMessage(topic, payload) {
    var topic = msg.destinationName;
    var payload = msg.payloadString;
    var qos = msg._getQos();
    var retained = msg._getRetained();

    var qosStr = ((qos > 0) ? "[qos " + qos + "]" : "");
    var retainedStr = ((retained) ? "[retained]" : "");
    appendLog(">> [" + topic + "]" + qosStr + retainedStr + " " + payload);
}


function onConnectSuccess() {
    console.log("connected as " + clientId);
    timer = setInterval(publish, interval);
    publish();
}

function onConnectFailure() {
    $("#deviceId").html("not connected");
    clearInterval(timer);
    console.log("failed! - retry connection w/ clientId "+clientId);
    client.connect({
        onSuccess: onConnectSuccess,
        onFailure: onConnectFailure,
        userName: "use-token-auth",
        password: devToken,
        useSSL: true
    });
}


function init() {

    try {
        client = new Messaging.Client(server, port, clientId);
    } catch (error) {
        console.log("Error:"+error);
    }
    
    client.onMessageArrived = onMessage;
    client.onConnectionLost = connectionLost;
    client.connect({
        onSuccess: onConnectSuccess,
        onFailure: onConnectFailure,
        userName: "use-token-auth",
        password: devToken,  
        useSSL: true
    });

    $("#interval").html(interval);
}

var sensors = {
    temp: 15 + Math.random() * 4,
    humidity: 75 + Math.random() * 5,
    objectTemp: 23 + Math.random() * 4,
};

var lowerLimits = {
    temp: -100,
    humidity: 0,
    objectTemp: -100
};

var upperLimits = {
    temp: 100,
    humidity: 100,
    objectTemp: 100
};

function publish() {
   

    var topic = "iot-2/evt/iotsensor/fmt/json";
    var payload = {
        d: {
            name: devID,
            temperature: sensors.temp,
            humidity: sensors.humidity,
            objectTemp: sensors.objectTemp,
            location: metaData,
        }
    };
    var message = new Messaging.Message(JSON.stringify(payload));
    message.destinationName = topic;
    console.log("publish | " + message.destinationName + " | " + message.payloadString);
    client.send(message);
}



function closeWindow() {  
	
    server = orgID + ".messaging.internetofthings.ibmcloud.com";
    url = "https://" + orgID + ".internetofthings.ibmcloud.com/?deviceId="+devID;
    url2 = "https://" + orgID + ".internetofthings.ibmcloud.com/dashboard/#/boards";
    clientId = "d:" + orgID + ":" + devType + ":" + devID;
    console.log(clientId);
    init();
}


function myStopFunction() {
    clearInterval(timer);
}
