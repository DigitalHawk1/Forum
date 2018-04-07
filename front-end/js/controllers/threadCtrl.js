(function () {

  'use strict'

  forumApp = angular.module('forumApp')

  forumApp.controller('threadCtrl', function ($scope, $rootScope, CRUDService, $stateParams, AuthService, $state, $http, API_ENDPOINT) {

    $scope.pushToEditedMessage = function (message, id) {
      $scope.editedMessage = {
        message: message,
        id: id
      }
    }

    function getInfo () {
      $http.get(API_ENDPOINT.url + '/memberinfo').then(function (result) {
          $scope.newMessage = {
            message: '',
            messageAuthor: result.data.username,
            threadName: $stateParams.threadName
          }
          $scope.messageAuthor = result.data.username
        }
      )
    }

    getInfo()

    $scope.pushToMessageId = function (id) {
      $scope.messageId = {
        id: id
      }
    }

    $scope.createNewMessage = function () {
      CRUDService.createMessage($scope.newMessage).then(function (msg) {
          alert(msg)
          $state.reload()
        }
      )
    }

    function getMessages () {
      CRUDService.getMessages($stateParams.threadName).then(function (messages) {
          $scope.messages = messages
        }
      )
    }

    getMessages()

    $scope.logout = function () {
      AuthService.logout()
      $state.go('login')
    }

    $scope.editMessage = function () {
      CRUDService.editMessage($scope.editedMessage).then(function () {
          $state.reload()
        }
      )
    }

    $scope.deleteMessage = function () {
      CRUDService.deleteMessage($scope.messageId).then(function () {
          alert('Žinutė ištrinta')
          $state.reload()
        }
      )
    }

    $scope.ifAuthor = function (author) {
      if (author === $scope.messageAuthor) {
        return true
      }
    }

  })

})()
