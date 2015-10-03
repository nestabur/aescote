// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('aescote', ['ionic', 'firebase', 'OcrService'])

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
            return function (node) {
                // create a reference to the database where we will store our data
                //var randomRoomId = Math.round(Math.random() * 100000000);
                //var ref = new Firebase("https://f2c2gl3tdy5.firebaseio-demo.com/data/" + randomRoomId);
                var ref = new Firebase("https://aescote.firebaseio.com");
                var profileRef = ref.child(node);

                // return it as a synchronized object
                return $firebaseObject(profileRef);
            }
        }
    ])

    .factory("Storage", function () {
        var loggedInUser = {};
        var selectedGroup = "";

        return {
            setLoggedInUser: function (userEmail) {
                loggedInUser.email = userEmail;
            },
            getLoggedInUser: function () {
                return loggedInUser;
            },

            setSelectedGroup: function(groupName) {
                selectedGroup = groupName;
            },
            getSelectedGroup: function() {
                return selectedGroup;
            }
        }

    })


    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'login.html',
                controller: 'LoginController'
            })
            .state('group', {
                url: '/group',
                templateUrl: 'group.html',
                controller: 'GroupController'
            })
            .state('groupDetail', {
                url: '/groupDetail',
                templateUrl: 'groupDetail.html',
                controller: 'GroupDetailController'
            })
            .state('summary', {
                url: "/summary",
                templateUrl: "summary.html",
                controller: "SummaryController"
            });
        $urlRouterProvider.otherwise('/login');
    })

    .controller("SummaryController", function ($scope, $stateParams) {

    })

    .controller("GroupDetailController", function ($scope, $stateParams, $firebaseObject, Storage) {
        $scope.selectItem = selectItem;
        $scope.summarizeGroup = summarizeGroup;
        $scope.showSummaryValue = showSummaryValue;
        $scope.displaySummaryValue = displaySummaryValue;

        $scope.group= {};

        var ref = new Firebase("https://aescote.firebaseio.com/"+Storage.getSelectedGroup());
        var obj = $firebaseObject(ref);
        obj.$bindTo($scope, "group");

        function selectItem(item) {
            if(!item.users)  {
                item.users=[];
            }
            item.users.push(Storage.getLoggedInUser());
        }

        function summarizeGroup() {
            $scope.group.sumary = {};

            angular.forEach($scope.group.items, function(item) {
                var value = eval(item.value) / item.users.length;

                angular.forEach(item.users, function(user) {
                    if($scope.group.sumary[user.email]){
                        $scope.group.sumary[user.email] = $scope.group.sumary[user.email] + value;
                    } else {
                        $scope.group.sumary[user.email] = value;
                    }
                });
            });

            $scope.group.status = 'CLOSED';
        }

        function showSummaryValue() {
            return $scope.group.status === 'CLOSED';
        }

        function displaySummaryValue() {
            return $scope.group.sumary[Storage.getLoggedInUser().email];
        }

    })

    .controller("LoginController", function ($scope, $state, Storage) {
        $scope.doLogin = function (user) {
            Storage.setLoggedInUser(user);
            $state.go('group');
        }
    })

    .controller("GroupController", function ($q, $scope, Storage, $firebaseObject, $state) {
        $scope.loggedInUser = Storage.getLoggedInUser().email;

        $scope.joinGroup = joinGroup;
        $scope.captureTicket = captureTicket;


        function joinGroup(groupName) {
            Storage.setSelectedGroup(groupName);
            $state.go("groupDetail");
        }

        function captureTicket(groupName) {
            capturePhotoEdit().then(function(items) {
                var ref = new Firebase("https://aescote.firebaseio.com/"+groupName);
                var obj = $firebaseObject(ref);

                obj.items = items;
                obj.status = 'OPEN';
                obj.$save().then(function(ref) {
                    Storage.setSelectedGroup(groupName);
                    $state.go("groupDetail");

                }, function(error) {
                    console.log("Error:", error);
                });
            });
        }

        function capturePhotoEdit() {
            var defer = $q.defer();
            defer.resolve([
                {
                    name: 'Item 1',
                    value: '10.00',
                    users: []
                },
                {
                    name: 'Item 2',
                    value: '12.00',
                    users: []
                }
            ]);

            // Take picture using device camera, allow edit, and retrieve image as base64-encoded string
            //navigator.camera.getPicture(function onPhotoURISuccess(imageURI) {
            //        // SEE CapturePhotoCtrl
            //        defer.resolve([
            //            {
            //                name: 'Item 1',
            //                value: '10.00'
            //            },
            //            {
            //                name: 'Item 2',
            //                value: '12.00'
            //            }
            //        ]);
            //    }
            //    , function() {
            //        defer.reject();
            //    }, {
            //    quality: 50, allowEdit: true,
            //    destinationType: destinationType.FILE_URI
            //});

            return defer.promise;
        }


        //function onFail(error) {
        //    $scope.errorGettingPicture = error;
        //}

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
