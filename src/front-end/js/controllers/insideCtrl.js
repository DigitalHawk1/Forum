{
  'use strict'
  forumApp = angular.module('forumApp')

  forumApp.controller('insideCtrl', ($scope, CRUDService, AuthService, API_ENDPOINT, $http, $state, AUTH_EVENTS) => {

    $scope.pushToEditedThread = (name, id) => {
      $scope.editedThread = {
        name: name,
        id: id
      }
    }

    $scope.pushToThreadId = id => {
      $scope.threadId = {
        id: id
      }
    }

    function getInfo () {
      $http.get(API_ENDPOINT.url + '/memberinfo').then(result => {
        $scope.newThread = {
          name: '',
          threadAuthor: result.data.username
        }
        $scope.threadAuthor = result.data.username
      })
    }

    getInfo()

    $scope.logout = () => {
      AuthService.logout()
      $state.go('login')
    }

    $scope.$on(AUTH_EVENTS.notAuthenticated, () => {
      AuthService.logout()
      $state.go('login')
      alert('Jūsų naršymo sesija prarasta, prašome prisijungti iš naujo')
    })

    $scope.createNewThread = () => {
      CRUDService.createThread($scope.newThread).then(msg => {
        alert(msg)
        $state.reload()
      }, errMsg => {
        alert(errMsg)
      })
    }

    function getAllThreads() {
      CRUDService.getThreads().then(threads => {
        $scope.threads = threads['threads']
      })
    }

    getAllThreads()

    $scope.editThread = () => {
      CRUDService.editThread($scope.editedThread).then(() => {
        $state.reload()
      })
    }

    $scope.deleteThread = () => {
      CRUDService.deleteThread($scope.threadId).then(() => {
        alert('Tema ištrinta')
        $state.reload()
      })
    }

    $scope.ifAuthor = author => {
      if (author === $scope.threadAuthor) {
        return true
      }
    }

  })
}
