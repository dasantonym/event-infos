(function () {
    'use strict';
    angular.module('event-infos', [
        'ui.bootstrap',
        'ngRoute',
        'cgBusy',
        'btford.markdown',
        'ngFileUpload',
        'event-infos.services.api',
        'event-infos.controllers.site',
        'event-infos.controllers.events',
        'event-infos.controllers.locations',
        'event-infos.controllers.artists'
    ])
        .config(['$routeProvider', '$locationProvider', '$logProvider', function ($routeProvider, $locationProvider, $logProvider) {
            var tpp = 'partials/';

            $logProvider.debugEnabled(true);
            $locationProvider.html5Mode(true).hashPrefix('!');

            $routeProvider.when('/', {templateUrl: tpp + 'site_welcome', controller: 'Site.Welcome'});
            $routeProvider.when('/events', {templateUrl: tpp + 'event_list', controller: 'Events.List'});
            $routeProvider.when('/events/:uuid', {templateUrl: tpp + 'event_view', controller: 'Events.View'});
            $routeProvider.when('/events/:uuid/:token', {templateUrl: tpp + 'event_edit', controller: 'Events.Edit'});
            $routeProvider.when('/create_event', {templateUrl: tpp + 'event_edit', controller: 'Events.Edit'});
            $routeProvider.when('/locations', {templateUrl: tpp + 'location_list', controller: 'Locations.List'});
            $routeProvider.when('/locations/:uuid', {templateUrl: tpp + 'location_edit', controller: 'Locations.Edit'});
            $routeProvider.when('/create_location', {templateUrl: tpp + 'location_edit', controller: 'Locations.Edit'});
            $routeProvider.when('/artists/create_artist/:event_uuid', {templateUrl: tpp + 'artist_edit', controller: 'Artists.Edit'});
            $routeProvider.when('/artists/:event_uuid/:uuid/:token', {templateUrl: tpp + 'artist_edit', controller: 'Artists.Edit'});

            $routeProvider.otherwise({redirectTo: '/'});
        }]).run(['$rootScope', '$q', function ($rootScope, $q) {
            $rootScope.$on('$routeChangeStart', function () {
                $rootScope.pageDefer = $q.defer();
                $rootScope.pagePromise = $rootScope.pageDefer.promise;
            });
            $rootScope.$on('$routeChangeSuccess', function () {
                $rootScope.pageDefer.resolve();
            });
            $rootScope.$on('$routeChangeError', function () {
                $rootScope.pageDefer.reject();
            });
        }]);
}());