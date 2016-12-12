(function () {
    angular
        .module("HackerFeed")
        .factory("ItemService", ItemService)

    function ItemService($http) {
        function createItem(userId, item) {
            var url = "/api/user/" + userId + "/item"
            return $http.post(url, item)
        }

        function shareItem(userId, friendId, item) {
            var url = "/api/user/" + userId + "/item?share=" + friendId
            return $http.post(url, item)
        }

        function findItemsByUser(userId) {
            var url = "/api/user/" + userId + "/item"
            return $http.get(url)
        }

        function deleteItem(userId, itemId) {
            var url = "/api/user/" + userId + "/item/" + itemId
            return $http.delete(url)
        }

        return {
            createItem: createItem,
            shareItem: shareItem,
            findItemsByUser: findItemsByUser,
            deleteItem: deleteItem
        }
    }
})()