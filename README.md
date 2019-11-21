# Integrate RSA SecureID with Twilio Verify Service for SMS OTP delivery

Twilio Function acts as proxy between RSA Security Manager and Twilip Verify API

## The problem
RSA security manager (used by Admin to configure SecureID) HTTP Plug-in only support form-based authentication, while Twilo Verify API use basic authentication. 

## How does it work?

RSA security manager HTTP Plug-in makes a https request to Twilio Function ((function/RSA_Verify.js)), which will verify the request via a shared secret (passed in https request body), it will then make a call to Verify service and relay the response from Verify service back to RSA security manager.

The function will take two parameters as input: Verify Service SID and a shared secret, which is a long random password shared between the function and RSA security manager. Parameters are passed in via https post in request body. 

## Create a Verify Service via Twilio Console
Login Twilio Console and create a new Verify service. Note down the service SID, a long string starts with VA... ... Please contact Twilio support with Verify service SID to enable custome message feature. 

## Setup Twilio Function via Twilio Console
1. Login Twilio Console and create a Function, give a name and add a long random string to PATH, copy the full path to be used in RSA security manager HTTP Plug-in as the base URL
2. copy and paste RSA_Verify.js code to the newly created function
3. Un-tick Check for valid Twilio signature
4. Click Configure, tick Enable ACCOUNT_SID and AUTH_TOKEN
5. Add two Environment Variables KEY: API_SECRET, VALUE: please generate long complext password and KEY: VERIFY_SID, VALUE: Your verify service SID, a long string starts with VA... ...
6. Update twilio to 3.36.0 in Dependencies
7. Save the changes

Please note: the full path in step 1, API_SECRET and VERIFY_SID in step 5 will be used in RSA security manager HTTP Plug-in configuration

To protect your Twilio function from being abused, make sure to create a long random string for the path and keep the full path (https://xxx-xxx.twil.io/YOUR_LONG_RANDOM_STRING) safe. Do not publish it on the Internet. 

To prevenat toll fraud, please use strong complext password for API_SECRET. 

## Setup RSA security manager HTTP Plug-in
TBC