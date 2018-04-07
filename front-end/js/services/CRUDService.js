(function () {

  'use strict'

  angular.module('forumApp').service('CRUDService', function ($q, $http, API_ENDPOINT) {

    var createThread = function createThread (thread) {
      return $q(function (resolve) {
        $http.post(API_ENDPOINT.url + '/create-thread', thread).then(function (result) {
          if (result.data.success) {
            resolve(result.data.msg)
          } else {
            reject(result.data.msg)
          }
        })
      })
    }

    var getThreads = function getThreads () {
      return $q(function (resolve) {
        $http.get(API_ENDPOINT.url + '/get-threads').then(function (result) {
          if (result.data.success) {
            delete result.data.success
            resolve(result.data)
          }
        })
      })
    }

    var editThread = function editThread (thread) {
      return $q(function (resolve) {
        $http.put(API_ENDPOINT.url + '/edit-thread/' + thread.id, thread).then(function (result) {
          if (result.data.success) {
            resolve(result.data.msg)
          }
        })
      })
    }

    var deleteThread = function deleteThread (thread) {
      return $q(function (resolve) {
        $http.delete(API_ENDPOINT.url + '/delete-thread/' + thread.id).then(function (result) {
          if (result.data.success) {
            resolve(result.data.msg)
          }
        })
      })
    }

    var getNewestMessage = function getNewestMessage (name) {
      return $q(function (resolve) {
        $http.get(API_ENDPOINT.url + '/get-message/' + name).then(function (result) {
          if (result.data.success) {
            delete result.data.success
            resolve(result.data)
          }
        })
      })
    }

    var createMessage = function createMessage (message) {
      return $q(function (resolve) {
        $http.post(API_ENDPOINT.url + '/create-message', message).then(function (result) {
          if (result.data.success) {
            resolve(result.data.msg)
          }
        })
      })
    }

    var getMessages = function getMessages (threadName) {
      return $q(function (resolve) {
        $http.get(API_ENDPOINT.url + '/get-messages/' + threadName).then(function (result) {
          if (result.data.success) {
            delete result.data.success
            resolve(result.data.messages)
          }
        })
      })
    }

    var editMessage = function editMessage (message) {
      return $q(function (resolve) {
        $http.put(API_ENDPOINT.url + '/edit-message/' + message.id, message).then(function (result) {
          if (result.data.success) {
            resolve(result.data.msg)
          }
        })
      })
    }

    var deleteMessage = function deleteMessage (message) {
      return $q(function (resolve) {
        $http.delete(API_ENDPOINT.url + '/delete-message/' + message.id).then(function (result) {
          if (result.data.success) {
            resolve(result.data.msg)
          }
        })
      })
    }

    return {
      createThread: createThread,
      getThreads: getThreads,
      editThread: editThread,
      deleteThread: deleteThread,
      getNewestMessage: getNewestMessage,
      createMessage: createMessage,
      getMessages: getMessages,
      editMessage: editMessage,
      deleteMessage: deleteMessage
    }
  })
})()