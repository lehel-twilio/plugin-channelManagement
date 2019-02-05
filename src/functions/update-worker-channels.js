exports.handler = function(context, event, callback) {

	const response = new Twilio.Response();
    response.appendHeader('Access-Control-Allow-Origin', '*');
    response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST');
    response.appendHeader('Content-Type', 'application/json');
    response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');

	let client = context.getTwilioClient();

	console.log(event.WorkerSid);

	let channels = [];
	const channelCapacity = JSON.parse(event.channelCapacity);
	const channelAvailability = JSON.parse(event.channelAvailability);
	channels = Object.keys(channelCapacity);

	for (let i = 0; i < channels.length; i++) {
	    let channel = channels[i];
	    let j = i;

	    console.log(i);
	    console.log(j);
	    console.log(event.WorkerSid);
	    console.log(channel);

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
                console.log('success');

                console.log(i);
                console.log(j);
                console.log(channels.length -1);


                if (j === (channels.length -1)) {

                    console.log(j);

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
                }
            })
            .catch(error => {
                console.log(error);
                callback(error);
            });
	}
};
