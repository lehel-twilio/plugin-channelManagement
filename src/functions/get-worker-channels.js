exports.handler = function(context, event, callback) {

    const response = new Twilio.Response();
    response.appendHeader('Access-Control-Allow-Origin', '*');
    response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST');
    response.appendHeader('Content-Type', 'application/json');
    response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');
    let client = context.getTwilioClient();
    if (event.WorkerSid === 'undefined') {
        response.body = 'no worker specified';
        callback(null, response);
    }

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
            // Authenticated, grab the worker channels
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
        }else{
            response.body = responseBody.message;
            callback(null, response);
        }
    });
};
