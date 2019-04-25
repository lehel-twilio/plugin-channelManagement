exports.handler = function(context, event, callback) {

    const response = new Twilio.Response();
    response.appendHeader('Access-Control-Allow-Origin', '*');
    response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST');
    response.appendHeader('Content-Type', 'application/json');
    response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');
    let client = context.getTwilioClient();

    const request = require('request');
    const iamUrl = `https://iam.twilio.com/v1/Accounts/${context.ACCOUNT_SID}/Tokens/validate`;
    const base64Token = Buffer.from(`${context.ACCOUNT_SID}:${context.AUTH_TOKEN}`).toString('base64');
    const options = {
        url: iamUrl,
        method: 'POST',
        headers: {
            Authorization: `Basic ${base64Token}`,
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({token: event.token}),
    };
    request(options, function (err, res, body) {
        if (err) {
            throw err;
        }
        const responseBody = JSON.parse(body);
        if(responseBody.valid === true){
            // Authenticated, update the worker channels
            let channels = [];
            const channelCapacity = JSON.parse(event.channelCapacity);
            const channelAvailability = JSON.parse(event.channelAvailability);
            channels = Object.keys(channelCapacity);
            for (let i = 0; i < channels.length; i++) {
                let channel = channels[i];
                let j = i;
                client
                    .taskrouter
                    .workspaces(context.TWILIO_WORKSPACE_SID)
                    .workers(event.WorkerSid)
                    .workerChannels(channel)
                    .update({
                      capacity: channelCapacity[channel],
                      available: channelAvailability[channel]
                    })
                    .then(result => {
                        if (j === (channels.length -1)) {
                            client
                                .taskrouter
                                .workspaces(context.TWILIO_WORKSPACE_SID)
                                .workers(event.WorkerSid)
                                .workerChannels
                                .list()
                                .then(result => {
                                    response.body = result;
                                    callback(null, response);
                                  })
                                .catch(error => {
                                    console.log(error);
                                    callback(error);
                                });
                        }
                    })
                    .catch(error => {
                        console.log(error);
                        callback(error);
                    });
            }
        }else{
            response.body = responseBody.message;
            callback(null, response);
        }
    });
};
