"use strict";

app.directive('newsThumb', function($timeout) {
    return {
        templateUrl: "/template/directives/newsThumb.html",
        replace: true,
        scope: {
            post: "="
        },
        link: function(scope, element, attrs, controller){
        }
    }
});