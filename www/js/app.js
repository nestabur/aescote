// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'firebase', 'OcrService'])

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

// a factory to create a re-usable Profile object
// we pass in a username and get back their synchronized data as an object
    .factory("Profile", ["$firebaseObject",
        function ($firebaseObject) {
            return function (username) {
                // create a reference to the database where we will store our data
                //var randomRoomId = Math.round(Math.random() * 100000000);
                //var ref = new Firebase("https://f2c2gl3tdy5.firebaseio-demo.com/data/" + randomRoomId);
                var ref = new Firebase("https://f2c2gl3tdy5.firebaseio-demo.com/data");
                var profileRef = ref.child(username);

                // return it as a synchronized object
                return $firebaseObject(profileRef);
            }
        }
    ])

.controller("ProfileCtrl", ["$scope", "Profile",
  function($scope, Profile) {
    // create a three-way binding to our Profile as $scope.profile
    Profile("physicsmarie").$bindTo($scope, "profile");
  }
])

  .factory("Storage", function(){
    var loggedInUser = {};

    return {
      setLoggedInUser: function(userEmail) {
        loggedInUser.email = userEmail;
      },

      getLoggedInUser: function() {
        return loggedInUser;
      }
    }

  })

  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'login.html',
        controller: 'LoginController'
      })
      .state('groups', {
        url: '/groups',
        templateUrl: 'groups.html',
        controller: 'GroupsController'
      })
      .state('group', {
        url: "/groups/:groupId",
        templateUrl: "group.html",
        controller: "GroupController"
      });
    $urlRouterProvider.otherwise('/login');
  })
.controller("GroupController", function($scope, $stateParams) {


})
  .controller("LoginController", function($scope, $state, Storage) {
    $scope.doLogin = function() {
      Storage.setLoggedInUser($scope.user);
      $state.go('groups');
    }

  })
  .controller("GroupsController", function($scope, Storage) {
    $scope.loggedInUser = Storage.getLoggedInUser.email;

  })

    .run(function ($ionicPlatform) {
      $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
      })
    })

    .controller('CapturePhotoCtrl', function ($scope, OcrService) {

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
            window.resolveLocalFileSystemURI(imageURI, function (fileEntry) {
                OcrService.processFile(fileEntry).then(function (result) {
                    $scope.result = result;
                }, function (error) {
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
