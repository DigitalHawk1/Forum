(function () {
  'use strict'

  forumApp = angular.module('forumApp')

  forumApp.controller('loginCtrl', function ($scope, AuthService, $http, $state, $rootScope) {
    $scope.user = {
      username: '',
      password: ''
    }

    $scope.login = function () {
      AuthService.login($scope.user).then(function () {

        if ($rootScope.userRole === 'admin') {
          $state.go('admin-main')
        } else if ($rootScope.userRole === 'user') {
          $state.go('user-main')
        }
      })
        .catch(function (err) {
          alert('Nepavyko prisijungti')
          console.log(err)
        })
    }
  })
})()
