(function () {
    'use strict';
    angular.module('event-infos.controllers.events', [])
        .controller('Events.List', ['$scope', '$q', 'apiService', function ($scope, $q, apiService) {
            $scope.events = [];
            var deferred = $q.defer();
            $scope.promiseString = 'Loading...';
            $scope.promise = deferred.promise;
            $scope.pad = function (n, width, z) {
                z = z || '0';
                n = n + '';
                return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
            };
            $scope.getDate = function (datestring) {
                return new Date(datestring);
            };
            apiService('events').actions.all(function (err, data) {
                deferred.resolve();
                if (data) {
                    $scope.events = data.sort(function (a, b) {
                        if (a.event_date < b.event_date) {
                            return 1;
                        } else if (a.event_date > b.event_date) {
                            return -1;
                        }
                        return 0;
                    });;
                }
            });
        }])
        .controller('Events.View', ['$scope', '$q', 'apiService', '$routeParams', function ($scope, $q, apiService, $routeParams) {
            var deferred = $q.defer();
            $scope.promiseString = 'Loading...';
            $scope.promise = deferred.promise;
            Promise.promisify(apiService('locations').actions.all)()
                .then(function (data) {
                    $scope.locations = data;
                    $scope.artists = [];
                    $scope.pad = function (n, width, z) {
                        z = z || '0';
                        n = n + '';
                        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
                    };
                    $scope.getDate = function (datestring) {
                        return new Date(datestring);
                    };
                    return Promise.promisify(apiService('events').actions.find)($routeParams.uuid)
                        .then(function (data) {
                            if (data) {
                                $scope.event = data;
                                $scope.formatDate = function (date) {
                                    var dt = new Date(date);
                                    return $scope.pad(dt.getDate(), 2) + '. ' + $scope.pad(dt.getMonth(), 2) + '. ' + dt.getFullYear();
                                };
                                $scope.formatTime = function (date) {
                                    var dt = new Date(date);
                                    return $scope.pad(dt.getHours(), 2) + ':' + $scope.pad(dt.getMinutes(), 2);
                                };
                                for (var i = 0; i < $scope.locations.length; i += 1) {
                                    if ($scope.locations[i].uuid === $scope.event.location_uuid) {
                                        $scope.locationTitle = $scope.locations[i].title;
                                    }
                                }
                                if ($scope.event.artist_uuids) {
                                    return Promise.map($scope.event.artist_uuids, function (artist_uuid) {
                                        return Promise.promisify(apiService('artists').actions.find)(artist_uuid)
                                            .then(function (artist) {
                                                if (artist) {
                                                    $scope.artists.push(artist);
                                                }
                                            });
                                    })
                                    .then(function () {
                                        deferred.resolve();
                                        $scope.$apply();
                                    });
                                } else {
                                    deferred.resolve();
                                    $scope.$apply();
                                    return;
                                }
                            }
                        });
                });
        }])
        .controller('Events.Edit', ['$scope', '$q', 'apiService', '$location', '$routeParams', 'Upload', function ($scope, $q, apiService, $location, $routeParams, Upload) {
            var uuid = $routeParams.uuid;
            $scope.event = {
                event_time: new Date(),
                event_date: new Date()
            };
            $scope.asset_data = {
                assets: [],
                asset_add: {},
                asset_add_file: null
            };
            $scope.timetable_add = {};
            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1
            };
            $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
            $scope.format = $scope.formats[2];
            $scope.status = {
                eventdate_opened: false,
                timetable_opened: false
            };
            $scope.open = function ($event) {
                $scope.status[$event.target.id + "_opened"] = true;
            };
            $scope.clear = function () {

            };
            $scope.pad = function (n, width, z) {
                z = z || '0';
                n = n + '';
                return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
            };
            $scope.getDate = function (datestring) {
                return new Date(datestring);
            };
            $scope.addToTimetable = function () {
                if (!$scope.event.timetable) $scope.event.timetable = [];
                $scope.timetable_add.date.setHours($scope.timetable_add.time.getHours(), $scope.timetable_add.time.getMinutes())
                $scope.event.timetable.push({
                    time: $scope.timetable_add.date,
                    description: $scope.timetable_add.description
                });
                $scope.event.timetable = $scope.event.timetable.sort(function (a, b) {
                    if (a.time < b.time) {
                        return -1;
                    } else if (a.time > b.time) {
                        return 1;
                    }
                    return 0;
                });
                $scope.timetable_add = {
                    date: new Date($scope.event.event_date),
                    time: new Date($scope.event.event_date)
                };
            };
            $scope.removeFromTimetable = function (item) {
                var index = $scope.event.timetable.indexOf(item);
                $scope.event.timetable.splice(index, 1);
            };
            var deferred = $q.defer();
            $scope.promiseString = 'Loading...';
            $scope.promise = deferred.promise;
            Promise.promisify(apiService('locations').actions.all)()
                .then(function (data) {
                    $scope.locations = data;
                    if (uuid) {
                        $scope.formTitle = 'Edit event';
                        $scope.submit = function () {
                            $scope.event.event_date.setHours($scope.event.event_time.getHours(), $scope.event.event_time.getMinutes());
                            apiService('events').actions.update($routeParams.uuid, $scope.event, function (err, data) {
                                if (err) {
                                    $scope.alerts = [
                                        {
                                            type: 'danger',
                                            msg: 'Failed to update event.'
                                        }
                                    ];
                                } else {
                                    $scope.alerts = [
                                        {
                                            type: 'success',
                                            msg: 'Event updated.'
                                        }
                                    ];
                                }
                            });
                        };
                        $scope.addAsset = function () {
                            var deferred = $q.defer();
                            $scope.promiseString = 'Uploading...';
                            $scope.promise = deferred.promise;
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
                                    $scope.asset_data.assets.push(data);
                                }
                            }).error(function (data, status, headers, config) {
                                console.log('error status: ' + status);
                            });
                        };
                        return Promise.promisify(apiService('events').actions.find)($routeParams.uuid);
                    } else {
                        $scope.formTitle = 'Create event';
                        $scope.submit = function () {
                            var deferred = $q.defer();
                            $scope.promiseString = 'Saving...';
                            $scope.promise = deferred.promise;
                            $scope.event.event_date.setHours($scope.event.event_time.getHours(), $scope.event.event_time.getMinutes());
                            apiService('events').actions.create($scope.event, function (err, data) {
                                deferred.resolve();
                                if (data) {
                                    $location.path('/events/' + data.uuid);
                                }
                            });
                        };
                        return;
                    }
                })
                .then(function (data) {
                    if (data) {
                        $scope.event = data;
                        $scope.event.event_date = new Date(data.event_date);
                        $scope.event.event_time = new Date(data.event_date);
                        $scope.artists = [];
                        $scope.timetable_add.date = new Date(data.event_date);
                        $scope.timetable_add.time = new Date(data.event_date);
                        if ($scope.event.artist_uuids) {
                            return Promise.map($scope.event.artist_uuids, function (artist_uuid) {
                                return Promise.promisify(apiService('artists').actions.find)(artist_uuid)
                                    .then(function (artist) {
                                        if (artist) {
                                            $scope.artists.push(artist);
                                        }
                                    });
                            });
                        } else {
                            return;
                        }
                    }
                })
                .then(function () {
                    return Promise.promisify(apiService('assets/list/' + $scope.event.uuid).actions.all)();
                })
                .then(function (data) {
                    if (data) {
                        $scope.asset_data.assets = data;
                        deferred.resolve();
                        $scope.$apply();
                    }
                })
                .catch(function (err) {
                    deferred.reject();
                    console.log('create event error', err);
                });
        }]);
}());