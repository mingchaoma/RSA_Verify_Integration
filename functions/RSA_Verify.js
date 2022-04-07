exports.handler = function (context, event, callback) {
  console.log(event.To);
  console.log(event.Customcode);
  console.log(event.Channel);

  if (
    event.verify_sid !== context.VERIFY_SID ||
    event.api_secret !== context.API_SECRET
  ) {
    //authentication failure
    let response = new Twilio.Response();
    response.setStatusCode(401);
    response.setBody("Unauthorized");
    callback(null, response);
  } else {
    var client = context.getTwilioClient();
    var response = new Twilio.Response();
    //call Lookup API to convert phone number to E.164 format
    client.lookups
      .phoneNumbers(event.To)
      .fetch()
      .then((phone_number) => {
        var to = phone_number.phoneNumber;
        //environment variables
        var verify_sid = context.VERIFY_SID;
        //http request parameters
        var channel = event.Channel;
        var customcode = event.Customcode;
        //call Verify API
        client.verify
          .services(verify_sid)
          .verifications.create({
            to: to,
            customCode: customcode,
            channel: channel,
          })
          .then((verification) => {
            //console.log(verification);
            response.appendHeader("Content-Type", "application/json");
            response.setBody(verification);
            callback(null, response);
          })
          .catch((error) => {
            console.log("Error: " + error);
            callback(error);
          });
      })
      .catch((error) => {
        console.log("Error: " + error);
        callback(error);
      });
  }
};
