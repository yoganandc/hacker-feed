(function() {
    angular
        .module("HackerFeed")
        .directive("embedResponsiveFull", ["$window", function($window) {
            return {
                restrict: "A",
                link: function(scope, elem, attr) {

                    function resize() {
                        var h = $window.innerHeight - 70
                        var w = $window.innerWidth

                        var ratio = h / w;
                        var padding = ratio * 100;
                        elem.css({"padding-bottom": padding + "%"})
                        console.log("resized: ", h, w)
                    }

                    $window.onresize = resize()
                }
            }
        }])
})()