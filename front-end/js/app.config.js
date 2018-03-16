(function () {
  'use strict'

  forumApp = angular.module('forumApp')

  forumApp.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
    function ($stateProvider, $urlRouterProvider, $locationProvider) {
      $locationProvider.hashPrefix('')
      $locationProvider.html5Mode(true)

      $stateProvider
        .state('login', {
          url: '/',
          templateUrl: 'front-end/views/login.html',
          controller: 'loginCtrl'
        })

        .state('registration', {
          url: '/registration',
          templateUrl: 'front-end/views/registration.html',
          controller: 'registrationCtrl'
        })

        .state('admin-main', {
          url: '/admin-main',
          templateUrl: 'front-end/views/admin-main.html',
          controller: 'insideCtrl'
        })

        .state('user-main', {
          url: '/user-main',
          templateUrl: 'front-end/views/user-main.html',
          controller: 'insideCtrl'
        })

      $urlRouterProvider.otherwise('/')
    }])
  forumApp.run(['$rootScope', '$state', 'AuthService', 'AUTH_EVENTS', function ($rootScope, $state, AuthService, AUTH_EVENTS) {
    $rootScope.$on('$stateChangeStart', function (event, next, nextParams, fromState) {
      if (!AuthService.isAuthenticated()) {
        if (next.name !== 'registration' && next.name !== 'home' && next.name !== 'login') {
          event.preventDefault()
          alert('Prašome prisijungti!')
          $state.go('login')
        }
      }
    })
  }])
})()
