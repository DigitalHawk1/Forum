(function () {

  'use strict'

  forumApp = angular.module('forumApp')

  forumApp.controller('threadCtrl', function ($scope, CRUDService, $stateParams, AuthService, $state) {

    function getMessages() {
      CRUDService.getMessages($stateParams.threadName).then(function (messages) {
        $scope.messages = messages
      })
    }

    getMessages()

    $scope.logout = function () {
      AuthService.logout()
      $state.go('login')
    }
  })

})()
