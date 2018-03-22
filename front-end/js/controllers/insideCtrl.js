(function () {
  'use strict'
  forumApp = angular.module('forumApp')

  forumApp.controller('insideCtrl', function ($scope, CRUDService, AuthService, API_ENDPOINT, $http, $state, AUTH_EVENTS) {
    $scope.newThread = {
      name: ''
    }

    $scope.editedThread = {
      name: '',
      id: ''
    }

    $scope.createNewThread = function () {
      CRUDService.createThread($scope.newThread).then(function (msg) {
        alert(msg)
        $state.reload()
      }, function (errMsg) {
        alert(errMsg)
      })
    }

    $scope.getInfo = function () {
      $http.get(API_ENDPOINT.url + '/memberinfo').then(function (result) {
        console.log(result.data)
      })
    };

    function getAllThreads() {
      CRUDService.getThreads().then(function (threads) {
        $scope.threads = threads['threads']
      })
    }

    getAllThreads()

    $scope.pushToEditedThread = function (name, id) {
      $scope.editedThread = {
        name: name,
        id: id
      }
    }

    $scope.editThread = function () {
      CRUDService.editThread($scope.editedThread).then(function () {
        $state.reload()
      }, function (errMsg) {
        alert(errMsg)
      })
    }

    $scope.logout = function () {
      AuthService.logout()
      $state.go('login')
    }

    $scope.$on(AUTH_EVENTS.notAuthenticated, function () {
      AuthService.logout()
      $state.go('login')
      alert('Jūsų naršymo sesija prarasta, prašome prisijungti iš naujo')
    })
  })
})()
