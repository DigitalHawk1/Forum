{

  'use strict'

  angular.module('forumApp')

    .service('CRUDService', ($q, $http, API_ENDPOINT) => {

      let createThread = thread => {
        return $q((resolve) => {
          $http.post(API_ENDPOINT.url + '/create-thread', thread).then(result => {
            if (result.data.success) {
              resolve(result.data.msg)
            } else {
              reject(result.data.msg)
            }
          })
        })
      }

      let getThreads = () => {
        return $q((resolve) => {
          $http.get(API_ENDPOINT.url + '/get-threads').then(result => {
            if (result.data.success) {
              delete result.data.success
              resolve(result.data)
            }
          })
        })
      }

      let editThread = thread => {
        return $q((resolve) => {
          $http.put(API_ENDPOINT.url + '/edit-thread/' + thread.id, thread).then(result => {
            if (result.data.success) {
              resolve(result.data.msg)
            }
          })
        })
      }
      
      let deleteThread = thread => {
        return $q((resolve) => {
          $http.delete(API_ENDPOINT.url + '/delete-thread/' + thread.id).then(result => {
            if (result.data.success) {
              resolve(result.data.msg)
            }
          })
        })
      }

      let getNewestMessage = name => {
        return $q((resolve) => {
          $http.get(API_ENDPOINT.url + '/get-message/' + name).then(result => {
            if (result.data.success) {
              delete result.data.success
              resolve(result.data)
            }
          })
        })
      }

      let createMessage = message => {
        return $q((resolve) => {
          $http.post(API_ENDPOINT.url + '/create-message', message).then(result => {
            if (result.data.success) {
              resolve(result.data.msg)
            }
          })
        })
      }

      let getMessages = threadName => {
        return $q((resolve) => {
          $http.get(API_ENDPOINT.url + '/get-messages/' + threadName).then(result => {
            if (result.data.success) {
              delete result.data.success
              resolve(result.data.messages)
            }
          })
        })
      }

      let editMessage = message => {
        return $q((resolve) => {
          $http.put(API_ENDPOINT.url + '/edit-message/' + message.id, message).then(result => {
            if (result.data.success) {
              resolve(result.data.msg)
            }
          })
        })
      }

      let deleteMessage = message => {
        return $q((resolve) => {
          $http.delete(API_ENDPOINT.url + '/delete-message/' + message.id).then(result => {
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
}