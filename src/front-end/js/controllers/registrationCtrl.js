{
  'use strict'

  forumApp = angular.module('forumApp')

  forumApp.controller('registrationCtrl', ($scope, AuthService, $state) => {
    $scope.user = {
      name: '',
      password: ''
    }

    $scope.signup = () => {
      AuthService.register($scope.user).then(() => {
        $state.go('login')
      }, errMsg => {
        alert(errMsg)
      })
    }
  })
}
