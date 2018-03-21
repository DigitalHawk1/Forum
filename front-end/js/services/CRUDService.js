(function () {

  'use strict'

  angular.module('forumApp')

    .service('CRUDService', function ($q, $http, API_ENDPOINT) {

      var createThread = function (thread) {
        return $q(function (resolve, reject) {
          $http.post(API_ENDPOINT.url + '/create-thread', thread).then(function (result) {
            if (result.data.success) {
              resolve(result.data.msg)
            } else {
              reject(result.data.msg)
            }
          })
        })
      }

      var getThreads = function () {
        $http.get(API_ENDPOINT.url + '/get-threads').then(function (result) {
          console.log(result.data)
          $scope.threads = result.data
        })
      }

      return {
        createThread: createThread
      }
    })
})()