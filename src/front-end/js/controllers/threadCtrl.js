{

  'use strict'

  forumApp = angular.module('forumApp')

  forumApp.controller('threadCtrl', ($scope, $rootScope, CRUDService, $stateParams, AuthService, $state, $http, API_ENDPOINT) => {

    $scope.pushToEditedMessage = (message, id) => {
      $scope.editedMessage = {
        message: message,
        id: id
      }
    }

    function getInfo () {
      $http.get(API_ENDPOINT.url + '/memberinfo').then(result => {
        $scope.newMessage = {
          message: '',
          messageAuthor: result.data.username,
          threadName: $stateParams.threadName
        }
        $scope.messageAuthor = result.data.username
      })
    }

    getInfo()

    $scope.pushToMessageId = id => {
      $scope.messageId = {
        id: id
      }
    }

    $scope.createNewMessage = () => {
      CRUDService.createMessage($scope.newMessage).then(msg => {
        alert(msg)
        $state.reload()
      })
    }

    function getMessages () {
      CRUDService.getMessages($stateParams.threadName).then(messages => {
        $scope.messages = messages
      })
    }

    getMessages()

    $scope.logout = () => {
      AuthService.logout()
      $state.go('login')
    }

    $scope.editMessage = () => {
      CRUDService.editMessage($scope.editedMessage).then(() => {
        $state.reload()
      })
    }

    $scope.deleteMessage = () => {
      CRUDService.deleteMessage($scope.messageId).then(() => {
        alert('Žinutė ištrinta')
        $state.reload()
      })
    }

    $scope.ifAuthor = author => {
      if (author === $scope.messageAuthor) {
        return true
      }
    }

  })

}
