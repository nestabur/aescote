Description
-----------------

@escote comes from a Spanish sentence "a escote" meaning that a dinner/lunch ticket is gonna be paid by each individual person and only for items that has consumed. 
This application makes easy to split the ticket by allowing each user to select the items that has consumed and to calculate the total amount to be paid.

The workflow is:
1. enter the app
2. create a new group taking a picture of the ticket
3. rest of users (friends?) enter the group
4. selection of items
5. calculate value

Technologies
-----------------
Ionic Framework (http://ionicframework.com/)
Apache Cordova (https://cordova.apache.org/)
AngularJS (https://angularjs.org/)

Devices
-----------------
Tested in Android. Will most probably work in IOS as well, but we have not the opportunity to test the app with it.

OCR
-----------------
The original idea was to use Tesseract OCR library. But the cordova plugin (for android) was not working properly and we had not enough time to integrate it via custom cordova plugin.
We have used the OCR web service published by http://api.ocrapiservice.com/1.0/rest/ocr which only allows 100 request and was not always returning the expected data. 
So at the moment, even though the service has been integrated, the data has been hard-coded for demo purposes.  

PreInstallations
-----------------
<pre>
$ npm install -g cordova ionic
</pre>

Run App
-----------------

<pre>
$ ionic platform add android
$ ionic build android
</pre>

If you have ionic-view installed in your device (http://view.ionic.io/) you can upload the app with the command

<pre>
$ ionic upload
</pre>