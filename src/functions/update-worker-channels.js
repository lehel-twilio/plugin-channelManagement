exports.handler = function(context, event, callback) {
    const response = new Twilio.Response();
    response.appendHeader("Access-Control-Allow-Origin", "*");
    response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST");
    response.appendHeader("Content-Type", "application/json");
    response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
  
    const client = context.getTwilioClient();
    const channels = JSON.parse(event.channels);
    const WorkspaceSid = context.TWILIO_WORKSPACE_SID;
    const WorkerSid = event.WorkerSid
  
    const promises = channels.map(channel => {
      return new Promise((resolve, reject) => {
        client.taskrouter
          .workspaces(WorkspaceSid)
          .workers(WorkerSid)
          .workerChannels(channel.name)
          .update({
            capacity: channel.capacity,
            available: channel.isAvailable
          })
          .then(result => {
            console.log(result, "result");
            resolve(result);
          })
          .catch(error => {
            console.log(error, "error");
            reject(error);
          });
      });
    });
  
    Promise.all(promises).then( data => {
      client.taskrouter
        .workspaces(WorkspaceSid)
        .workers(WorkerSid)
        .workerChannels.list()
        .then(result => {
          console.log(result);
          response.body = result;
          callback(null, response);
        })
        .catch(error => {
          console.log(error);
          callback(error);
        });
    });
  };
  
