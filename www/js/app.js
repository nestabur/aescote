// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'firebase'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

// a factory to create a re-usable Profile object
// we pass in a username and get back their synchronized data as an object
.factory("Profile", ["$firebaseObject",
  function($firebaseObject) {
    return function(username) {
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
]);


