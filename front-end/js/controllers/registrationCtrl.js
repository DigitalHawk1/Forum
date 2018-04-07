(function () {
  'use strict'

  forumApp = angular.module('forumApp')

  forumApp.controller('registrationCtrl', function ($scope, AuthService, $state) {
    $scope.user = {
      name: '',
      password: ''
    }

    $scope.signup = function () {
      AuthService.register($scope.user).then(function () {
        $state.go('login')
      }, function (errMsg) {
        alert(errMsg)
      })
    }
  })
})()
