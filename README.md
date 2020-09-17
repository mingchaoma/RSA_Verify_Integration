# Integrate RSA SecurID with Twilio Verify Service for SMS OTP delivery

Twilio Function acts as proxy between RSA Security Manager and Twilip Verify API. Please read this blog for more detail (https://www.twilio.com/blog/verify-rsa-secureid).

## The problem
RSA authentication manager (used by Admin to configure SecureID) HTTP Plug-in only support form-based authentication, while Twilo Verify API use basic authentication. 

## How does it work?

RSA authentication manager HTTP Plug-in makes a https request to Twilio Function ((function/RSA_Verify.js)), which will verify the request via a shared secret (passed in https request body), it will then make a call to Twilio Verify service and relay the response from Verify service back to RSA authentication manager.

The function will take two parameters as input: Verify Service SID and a shared secret, which is a long random password shared between the function and RSA security manager. Parameters are passed in via https post in request body. 

## Create a Verify Service via Twilio Console
Login Twilio Console and create a new Verify service. Note down the service SID, a long string starts with VA... ... Please contact Twilio support with Verify service SID to enable custome message feature. 

## Setup Twilio Function via Twilio Console
1. Login Twilio Console and create a Function, give a name and add a long random string to PATH, copy the full path to be used in RSA security manager HTTP Plug-in as the base URL
2. copy and paste RSA_Verify.js code to the newly created function
3. Un-tick Check for valid Twilio signature checkbox
4. Click Configure, tick Enable ACCOUNT_SID and AUTH_TOKEN checkbox
5. Add two Environmental Variables KEY: API_SECRET, VALUE: please generate long complext password and KEY: VERIFY_SID, VALUE: Your verify service SID, a long string starts with VA... ...
6. Update twilio to 3.36.0 in Dependencies
7. Save the changes

Please note: the full path in step 1, API_SECRET and VERIFY_SID in step 5 will be used in RSA authentication manager HTTP Plug-in configuration

To protect your Twilio function from being abused, make sure to create a long random string for the path and keep the full path (https://xxx-xxx.twil.io/YOUR_LONG_RANDOM_STRING) safe. Do not publish it on the Internet. 

To prevent toll fraud, please use strong complext password for API_SECRET. 

## Setup RSA authentication manager HTTP Plug-in

For general information about how to configure HTTP Plug-in for SMS token delivery, please check RSA online documents (https://community.rsa.com/docs/DOC-76905 and https://community.rsa.com/docs/DOC-77514)

On the On-Demand Tokencode Delivery page, go to SMS configuration tab. 

Under Tokencode Delivery by SMS section:

1. Tick the Enable the delivery of On-Demand Tokencodes using SMS service checkbox
2. Select user’s mobile number attribute from the dropdown menu of User Attribute to Provide SMS Destination. This is the mobile number to which the SMS OTP will be sent.
3. Select the Default country code from the drop-down menu (Optional)
4. Select HTTP from the SMS plug-in drop-down menu

Under SMS Provider Configuration section:

1. Copy the full path of your RSA Verify Twilio Function
(https://xxx-xxx.twil.io/YOUR_LONG_RANDOM_STRING) to the Base URL field
2. Download the certificate of Twilio function end-point and import the certificate by clicking Import Certificate (https://community.rsa.com/docs/DOC-76900)
3. Select POST from the HTTP Method drop-down menu
4. Copy the following string into the Parameters field
		To=$msg.address&Custommessage=$msg.message&Channel=sms&verify_sid=$cfg.user&api_secret=$cfg.password
5. Enter the Service SID value (VAXXX… ...) for Account User Name
6. Enter the value of API_SECRET for Account Password
7. Copy the following word into the Success Response Code field
      pending
8. Copy the following line into the Response Format field (note there is a leading period)
      .*status":\s?"([a-zA-Z]*)

Please also config SMS HTTP Proxy Configuration if HTTP proxy is used. Please speak to your network administrator for proxy detail. Leave it empty if HTTP proxy is not used in your network.

Do not forget to Click Update to save the SMS configuration.

To test your configuration, under Test SMS Provider Integration:
1. In the Mobile phone number to test fields, select a country code, and enter the number for a mobile phone that receives the test message and the OTP.
2. Click Send Test Text Message.

The system saves all of your changes before the test is conducted. If the connection is unsuccessful, you see an error message.






