(function () {
  'use strict'
  forumApp = angular.module('forumApp')

  forumApp.controller('insideCtrl', function ($scope, AuthService, API_ENDPOINT, $http, $state, AUTH_EVENTS) {
    $scope.getInfo = function () {
      $http.get(API_ENDPOINT.url + '/memberinfo').then(function (result) {
        console.log(result.data)

      })
    }


    $scope.logout = function () {
      AuthService.logout()
      $state.go('login')
  }
    $scope.$on(AUTH_EVENTS.notAuthenticated, function (event) {
      AuthService.logout()
      $state.go('login')
      alert('Jūsų naršymo sesija prarasta, prašome prisijungti iš naujo')
    })
  })
})()
