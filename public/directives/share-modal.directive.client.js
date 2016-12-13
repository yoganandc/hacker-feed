(function () {
    angular
        .module("HackerFeed")
        .directive("shareModal", function () {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {

                    attrs.$observe("shareModal", function(value) {
                        if (value === "true") {
                            element.modal('show')
                        }
                        else {
                            element.modal('hide')
                        }
                    })

                }
            }
        })
})()