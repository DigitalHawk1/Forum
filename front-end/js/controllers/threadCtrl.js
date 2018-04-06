(function () {

  'use strict'

  forumApp = angular.module('forumApp')

  forumApp.controller('threadCtrl', function ($scope, CRUDService, $stateParams, AuthService, $state) {

    $scope.pushToEditedMessage = function (message, id) {
      console.log(message, id)
      $scope.editedMessage = {
        message: message,
        id: id
      }
    }

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

    $scope.editMessage = function () {
      CRUDService.editMessage($scope.editedMessage).then(function () {
        $state.reload()
      })
    }

  })

})()
