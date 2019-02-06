exports.handler = function(context, event, callback) {

	const response = new Twilio.Response();
    response.appendHeader('Access-Control-Allow-Origin', '*');
    response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST');
    response.appendHeader('Content-Type', 'application/json');
    response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');

	let client = context.getTwilioClient();

	console.log(event.WorkerSid);

	if (event.WorkerSid === 'undefined') {
	    response.body = 'no worker specified';
	    callback(null, response);
	}

	client
        .taskrouter
        .workspaces(context.TWILIO_WORKSPACE_SID)
        .workers(event.WorkerSid)
        .workerChannels
        .list()
        .then(result => {
            console.log(result);

            response.body = result;
            callback(null, response);
          })
        .catch(error => {
            console.log(error);
            callback(error);
        });
};
