(function () {
    'use strict';
    angular.module(
        'event-infos.controllers.artists', [])
        .controller('Artists.Edit', ['$scope', '$q', 'apiService', '$location', '$routeParams', 'Upload', function ($scope, $q, apiService, $location, $routeParams, Upload) {
            var event_uuid = $routeParams.event_uuid,
                uuid = $routeParams.uuid;
            $scope.artist = {
                event_uuid: event_uuid
            };
            $scope.asset_data = {
                assets: [],
                asset_add: {},
                asset_add_file: null
            };
            if (uuid) {
                $scope.formTitle = 'Edit artist';
                var deferred = $q.defer();
                $scope.promiseString = 'Loading...';
                $scope.promise = deferred.promise;
                Promise.promisify(apiService('artists').actions.find)($routeParams.uuid)
                    .then(function (data) {
                        if (data) {
                            $scope.artist = data;
                            $scope.submit = function () {
                                var deferred = $q.defer();
                                $scope.promiseString = 'Saving...';
                                $scope.promise = deferred.promise;
                                apiService('artists').actions.update($routeParams.uuid, $scope.artist, function (err, data) {
                                    deferred.resolve();
                                    $location.path('/events/' + event_uuid);
                                });
                            };
                            $scope.addAsset = function () {
                                if (!$scope.asset_data.asset_add_file) {
                                    return;
                                }
                                $scope.asset_data.asset_add.size = $scope.asset_data.asset_add_file.size;
                                $scope.asset_data.asset_add.parent_uuid = uuid;
                                Upload.upload({
                                    url: '/api/assets',
                                    fields: $scope.asset_data.asset_add,
                                    file: $scope.asset_data.asset_add_file
                                }).progress(function (evt) {
                                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                                    //console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                                }).success(function (data, status, headers, config) {
                                    if (data) {
                                        $scope.asset_data.asset_add = {};
                                        $scope.asset_data.asset_add_file = null;
                                        console.log($scope.asset_data.assets);
                                        $scope.asset_data.assets.push(data);
                                    }
                                }).error(function (data, status, headers, config) {
                                    console.log('error status: ' + status);
                                });
                            };
                            return Promise.promisify(apiService('assets/list/' + $scope.artist.uuid).actions.all)();
                        }
                    })
                    .then(function (data) {
                        if (data) {
                            $scope.asset_data.assets = data;
                        }
                        deferred.resolve();
                    });
            } else {
                $scope.formTitle = 'Create artist';
                $scope.submit = function () {
                    var deferred = $q.defer();
                    $scope.promiseString = 'Saving...';
                    $scope.promise = deferred.promise;
                    Promise.promisify(apiService('artists').actions.create)($scope.artist)
                        .then(function (data) {
                            if (data) {
                                uuid = data.uuid;
                                return Promise.promisify(apiService('events').actions.find)($scope.artist.event_uuid);
                            }
                        })
                        .then(function (data) {
                            if (data) {
                                if (!data.artist_uuids) {
                                    data.artist_uuids = [];
                                }
                                data.artist_uuids.push(uuid);
                                return Promise.promisify(apiService('events').actions.update)($scope.artist.event_uuid, data);
                            }
                        })
                        .then(function () {
                            deferred.resolve();
                            $location.path('/events/' + event_uuid);
                        })
                        .catch(function (err) {
                            deferred.reject();
                            console.log(err);
                        });
                };
            }
        }]);
}());