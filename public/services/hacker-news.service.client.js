(function () {
    angular
        .module("HackerFeed")
        .factory("HackerNewsService", HackerNewsService)

    var BASE_URL = "https://hacker-news.firebaseio.com/v0/"
    var MAX_COUNT = 50

    function HackerNewsService($http, $q) {

        function topStories() {
            var deferred = $q.defer()

            $http.get(BASE_URL + "topstories.json")
                .then(function (obj) {

                    var itemIds = obj.data
                    var items = []

                    var j = 0
                    for (var i = 0; i < itemIds.length && i < MAX_COUNT; i++) {

                        $http.get(BASE_URL + "item/" + itemIds[i] + ".json")
                            .then(function (obj) {
                                items.push(obj.data)

                                j++
                                if(j === itemIds.length - 1 || j === MAX_COUNT - 1) {
                                    deferred.resolve(items)
                                }

                            }, function (err) {
                                deferred.reject(err)
                            })

                    }

                }, function (err) {
                    deferred.reject(err)
                })


            return deferred.promise
        }

        function bestStories() {
            var deferred = $q.defer()

            $http.get(BASE_URL + "beststories.json")
                .then(function (obj) {

                    var itemIds = obj.data
                    var items = []

                    var j = 0
                    for (var i = 0; i < itemIds.length && i < MAX_COUNT; i++) {

                        $http.get(BASE_URL + "item/" + itemIds[i] + ".json")
                            .then(function (obj) {
                                items.push(obj.data)

                                j++
                                if(j === itemIds.length - 1 || j === MAX_COUNT - 1) {
                                    deferred.resolve(items)
                                }

                            }, function (err) {
                                deferred.reject(err)
                            })

                    }

                }, function (err) {
                    deferred.reject(err)
                })

            return deferred.promise
        }

        function newStories() {
            var deferred = $q.defer()

            $http.get(BASE_URL + "newstories.json")
                .then(function (obj) {

                    var itemIds = obj.data
                    var items = []

                    var j = 0
                    for (var i = 0; i < itemIds.length && i < MAX_COUNT; i++) {

                        $http.get(BASE_URL + "item/" + itemIds[i] + ".json")
                            .then(function (obj) {
                                items.push(obj.data)

                                j++
                                if(j === itemIds.length - 1 || j === MAX_COUNT - 1) {
                                    deferred.resolve(items)
                                }

                            }, function (err) {
                                deferred.reject(err)
                            })

                    }

                }, function (err) {
                    deferred.reject(err)
                })


            return deferred.promise
        }

        function item(itemId) {
            var deferred = $q.defer()

            $http.get(BASE_URL + "item/" + itemId + ".json")
                .then(function (obj) {
                    deferred.resolve(obj.data)
                }, function (err) {
                    deferred.reject(err)
                })

            return deferred.promise
        }

        function comments(itemId) {
            var deferred = $q.defer()

            item(itemId)
                .then(function (obj) {
                    var comments = []

                    if (typeof obj.kids !== "undefined" && obj.kids.length > 0) {
                        populateComments(obj.kids, comments)
                            .then(function (obj2) {
                                console.log(comments)
                                deferred.resolve({item: obj, comments: comments})
                            }, function (err) {
                                deferred.reject(err)
                            })
                    }
                    else {
                        deferred.reject(null)
                    }


                }, function (err) {
                    deferred.reject(err)
                })

            return deferred.promise
        }

        function populateComments(commentIds, comments) {
            var deferred = $q.defer()

            var j = 0
            for (var i = 0; i < commentIds.length; i++) {
                item(commentIds[i])
                    .then(function (obj) {

                        if(typeof obj.text !== "undefined") {
                            comments.push({text: obj.text, comments: []})
                        }

                        if (typeof obj.text !== "undefined" && typeof obj.kids !== "undefined" && obj.kids.length > 0) {

                            populateComments(obj.kids, comments[comments.length - 1].comments)
                                .then(function (obj2) {

                                    j++
                                    if (j === commentIds.length) {
                                        deferred.resolve(comments)
                                    }

                                }, function (err) {
                                    deferred.reject(err)
                                })
                        }
                        else {
                            j++
                            if (j === commentIds.length) {
                                deferred.resolve(comments)
                            }
                        }

                    }, function (err) {
                        deferred.reject(err)
                    })
            }

            return deferred.promise
        }

        return {
            topStories: topStories,
            bestStories: bestStories,
            newStories: newStories,
            item: item,
            comments: comments
        }

    }
})()