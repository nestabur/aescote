// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'OcrService'])

    .run(function ($ionicPlatform) {
      $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
          StatusBar.styleDefault();
        }

      });
    })

    .controller('Application', function ($scope, OcrService) {

      $scope.capturePhoto = function () {
        // Take picture using device camera and retrieve image as file uri string
        navigator.camera.getPicture(onPhotoURISuccess, onFail, {
          quality: 100,
          destinationType: destinationType.FILE_URI
        });
      };

      $scope.capturePhotoEdit = function () {
        // Take picture using device camera, allow edit, and retrieve image as base64-encoded string
        navigator.camera.getPicture(onPhotoURISuccess, onFail, {
          quality: 50, allowEdit: true,
          destinationType: destinationType.FILE_URI
        });
      };

      function onPhotoURISuccess(imageURI) {
        window.resolveLocalFileSystemURI(imageURI, function(fileEntry) {
          OcrService.processFile(fileEntry).then(function(result) {
            $scope.result = result;
          }, function(error) {
            // Showing error dialog
            switch (error.code) {
              case FileTransferError.FILE_NOT_FOUND_ERR:
                $scope.errorReadingFile = "File not found.";
                break;
              case FileTransferError.INVALID_URL_ERR:
                $scope.errorReadingFile = "Invalid URL.";
                break;
              case FileTransferError.CONNECTION_ERR:
                $scope.errorReadingFile = "Connection error.";
                break;
            }
          })
        }, onFail);
      }

      function onFail(error) {
        $scope.errorGettingPicture = error;
      }

    });
