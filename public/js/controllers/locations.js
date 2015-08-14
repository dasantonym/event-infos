(function () {
    'use strict';
    angular.module('event-infos.controllers.locations', [])
        .controller('Locations.List', ['$scope', '$q', 'apiService', function ($scope, $q, apiService) {
            $scope.locations = [];
            var deferred = $q.defer();
            $scope.promiseString = 'Loading...';
            $scope.promise = deferred.promise;
            apiService('locations').actions.all(function (err, data) {
                deferred.resolve();
                if (data) {
                    $scope.locations = data;
                }
            });
        }])
        .controller('Locations.Edit', ['$scope', '$q', 'apiService', '$location', '$routeParams', function ($scope, $q, apiService, $location, $routeParams) {
            var uuid = $routeParams.uuid;
            $scope.location = {};
            if (uuid) {
                $scope.formTitle = 'Edit location';
                var deferred = $q.defer();
                $scope.promiseString = 'Loading...';
                $scope.promise = deferred.promise;
                apiService('locations').actions.find($routeParams.uuid, function (err, data) {
                    deferred.resolve();
                    if (data) {
                        $scope.location = data;
                        $scope.submit = function () {
                            var deferred = $q.defer();
                            $scope.promiseString = 'Saving...';
                            $scope.promise = deferred.promise;
                            apiService('locations').actions.update($routeParams.uuid, $scope.location, function (err, data) {
                                deferred.resolve();
                                $location.path('/locations');
                            });
                        };
                    }
                });
            } else {
                $scope.formTitle = 'Create location';
                $scope.submit = function () {
                    var deferred = $q.defer();
                    $scope.promiseString = 'Saving...';
                    $scope.promise = deferred.promise;
                    apiService('locations').actions.create($scope.location, function (err, data) {
                        deferred.resolve();
                        if (data) {
                            uuid = data.uuid;
                            $location.path('/locations');
                        }
                    });
                };
            }
        }]);
}());