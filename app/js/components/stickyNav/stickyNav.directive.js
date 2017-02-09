'use strict';

var componentsModule = require('../');

function _offsetSticky($child, parent, sibling, offset) {
    var scroll = document.body.scrollTop;
    var siblingRect = sibling.getBoundingClientRect();
    var topPosElem = siblingRect.top + document.body.scrollTop + offset;
    var parentRect = parent.getBoundingClientRect();
    var containerBottom = parentRect.top + scroll + parentRect.height;
    var bottomOfPage = (scroll + document.body.offsetHeight);
    var toAdd = '';
    var toRemove = '';
    if (scroll < topPosElem) {
        toAdd = 'absolute-top';
        toRemove = 'absolute-bottom fixed-bottom';
    } else if (bottomOfPage > containerBottom) {
        toAdd = 'absolute-bottom';
        toRemove = 'absolute-top fixed-bottom';
    } else {
        toAdd = 'fixed-bottom';
        toRemove = 'absolute-top absolute-bottom';
    }

    $child.addClass(toAdd).removeClass(toRemove);
}

function _topSticky($child) {
    var stuckClass = 'stuck';
    var scroll = document.body.scrollTop;
    var elm = $child[0];
    var topOffset;
    if (typeof $child.originalOffset === 'undefined') {
        $child.removeClass(stuckClass);
        topOffset = elm.getBoundingClientRect().top;
        $child.originalOffset = topOffset + scroll;
    } else {
        topOffset = elm.getBoundingClientRect().top;
    }

    if (scroll >= $child.originalOffset) {
        $child.addClass(stuckClass);
    } else {
        $child.removeClass(stuckClass);
    }
}

function _sticky($child, parent, sibling, offset) {
    if ($child && parent && sibling) {
        _offsetSticky($child, parent, sibling, offset);
    } else if ($child) {
        _topSticky($child);
    }
}

/**
 * @ngInject
 */
function stickyNavLink($scope) {
    var $child;
    var parent;
    var sibling;
    var offset;
    var $window;

    if (!$scope.child) {
        console.warn('Missing parameter');
        return;
    }

    // Get refs to elements
    $child = angular.element(document.querySelector($scope.child));
    parent = document.querySelector($scope.parent);
    sibling = document.querySelector($scope.sibling);

    // normalize offset var
    offset = $scope.offset;
    if (typeof offset === 'undefined') {
        offset = 0;
    }

    offset = parseInt(offset, 10);

    function sticky(e) {
        if (e && e.type === 'resize') {
            delete $child.originalOffset;
        }

        return _sticky($child, parent, sibling, offset);
    }

    // bind scroll and resize events
    $window = angular.element(window);
    $window.on('scroll', sticky);
    $window.on('resize', sticky);
    $scope.$on('$destroy', function () {
        $window.off('scroll', sticky);
        $window.off('resize', sticky);
    });
}

function stickyNav() {
    return {
        restrict: 'CA',
        scope: {
            // Look at this happy family
            parent: '@',
            child: '@',
            sibling: '@',
            offset: '@'
        },
        link: stickyNavLink
    };
}

componentsModule.directive('stickyNav', stickyNav);
