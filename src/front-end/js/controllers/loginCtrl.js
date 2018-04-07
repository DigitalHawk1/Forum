{
  'use strict'

  forumApp = angular.module('forumApp')

  forumApp.controller('loginCtrl', ($scope, AuthService, $http, $state, $rootScope) => {
    $scope.user = {
      username: '',
      password: ''
    }

    $scope.login = () => {
      AuthService.login($scope.user).then(() => {

        if ($rootScope.userRole === 'admin') {
          $state.go('admin-main')
        } else if ($rootScope.userRole === 'user') {
          $state.go('user-main')
        }
      })
        .catch(err => {
          alert('Nepavyko prisijungti')
          console.log(err)
        })
    }
  })
}
