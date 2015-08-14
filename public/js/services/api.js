(function () {
    'use strict';
    angular.module('event-infos.services.api', []).
        factory('apiService', ['$http', function ($http) {
            'use strict';
            return function (resourceName) {
                var config = {
                    resourceName: resourceName,
                    host: '/api/'
                };
                return {
                    config: config,
                    actions: {
                        all: function (callback) {
                            $http.get(config.host + config.resourceName, {headers: {'Content-Type': 'application/json'}})
                                .then(function (response) {
                                    callback(null, response.data);
                                }, function (response) {
                                    callback({
                                        status: response.status,
                                        statusText: response.statusText,
                                        data: response.data
                                    }, null);
                                });
                        },
                        find: function (uuid, callback) {
                            $http.get(config.host + config.resourceName + '/' + uuid, {headers: {'Content-Type': 'application/json'}})
                                .then(function (response) {
                                    callback(null, response.data);
                                }, function (response) {
                                    callback({
                                        status: response.status,
                                        statusText: response.statusText,
                                        data: response.data
                                    }, null);
                                });
                        },
                        create: function (data, callback) {
                            $http.post(config.host + config.resourceName, data, {headers: {'Content-Type': 'application/json'}})
                                .then(function (response) {
                                    callback(null, response.data);
                                }, function (response) {
                                    callback({
                                        status: response.status,
                                        statusText: response.statusText,
                                        data: response.data
                                    }, null);
                                });
                        },
                        update: function (uuid, data, callback) {
                            $http.put(config.host + config.resourceName + '/' + uuid, data, {headers: {'Content-Type': 'application/json'}})
                                .then(function (response) {
                                    callback(null, response.data);
                                }, function (response) {
                                    callback({
                                        status: response.status,
                                        statusText: response.statusText,
                                        data: response.data
                                    }, null);
                                });
                        },
                        remove: function (uuid, callback) {
                            $http.delete(config.host + config.resourceName + '/' + uuid, {headers: {'Content-Type': 'application/json'}})
                                .then(function (response) {
                                    callback(null, response.data);
                                }, function (response) {
                                    callback({
                                        status: response.status,
                                        statusText: response.statusText,
                                        data: response.data
                                    }, null);
                                });
                        }
                    }
                };
            };
        }]);
}());