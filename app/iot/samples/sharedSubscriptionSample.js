var iotf = require("../");

var appClientConfig = {
  org: 'xstg32',
  id: 'xstg32',
  "auth-key": 'a-xstg32-gx3ai4h2hz',
  "auth-token": 'fxszaa)h+wlzJWOkYV',
  "type" : "shared"	// make this connection as shared subscription
};

var appClient = new iotf.IotfApplication(appClientConfig);

//setting the log level to trace. By default its 'warn'
appClient.log.setLevel('info');

appClient.connect();

appClient.on("connect", function () {
	appClient.subscribeToDeviceEvents();
});

appClient.on("deviceEvent", function (deviceType, deviceId, eventType, format, payload) {
    console.log("Device Event from :: "+deviceType+" : "+deviceId+" of event "+eventType+" with payload : "+payload);
});

console.log("END");
