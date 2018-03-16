/*global require*/
'use strict';

var componentsModule = require('../');

/**
* @ngInject
*/

function primaryNavCtrl($scope, Utils, $state, InsightsConfig, User, InsightsJwt) {

    const policyAccounts = {
        540155: true,
        540694: true,
        901578: true
    };

    $scope.canSeePolicies = false;
    $scope.isHidden = false;
    $scope.utils = Utils;
    $scope.state = $state;
    $scope.config = InsightsConfig;
    $scope.doLogout = InsightsJwt.standardLogout;
    $scope.isPortal = InsightsConfig.isPortal;

    $scope.toggleNav = function () {
        $scope.isHidden = !$scope.isHidden;
    };

    $scope.states = {
        rules: [
            'app.rules',
            'app.admin-topic',
            'app.edit-topic'
        ],
        actions: [
            'app.actions',
            'app.actions-rule',
            'app.topic'
        ],
        config: [
            'app.config',
            'app.config-webhook-edit'
        ],
        policies: [
            'app.view-policy',
            'app.list-policies'
        ],
        inventoryDeployment: [
            'app.inventory-deployment',
            'app.system-overview'
        ]
    };

    $scope.isActive = function (states) {
        return {
            current: states.some(state => {
                $state.is(state);
            })
        };
    };

    function checkPolicies () {
        User.asyncCurrent((user) => {
            let accountNumber = window.sessionStorage.getItem(InsightsConfig.acctKey) ||
                user.account_number;

            $scope.canSeePolicies = policyAccounts[accountNumber];
        });
    }

    $scope.$on('account:change', checkPolicies);

    checkPolicies();

    // This is the navigation js
    const htmlElem              = document.querySelector('html');
    const backdrop              = document.createElement('div');
    backdrop.className          = 'backdrop';
    const navMobile             = 'nav-mobile-active';
    const navDesktopExpanding   = 'nav-expanding';
    const navDesktopCollapsing  = 'nav-collapsing';
    const navDesktop            = 'nav-desktop-collapsed';
    const windowSm              = 768;

    function viewportSize () {
        let windowWidth = document.documentElement.clientWidth;

        if (windowWidth < windowSm) {
            return 'mobile';
        } else {
            return 'desktop';
        }
    }

    // Check for navMobile or navDesktop on html
    function htmlHasClass (size) {
        if (htmlElem.classList.contains(size)) {
            return true;
        } else {
            return false;
        }
    }

    // Test looks for any leftover desktop or mobile styles and remove them
    function removeResponsiveClasses () {
        if (viewportSize() === 'mobile' && htmlHasClass(navDesktop)) {
            htmlElem.classList.remove(navDesktop);
        } else if (viewportSize() === 'desktop' && htmlHasClass(navMobile)) {
            htmlElem.classList.remove(navMobile);
        } else {
            return;
        }
    }

    // Removes the backdrop when clicked
    function toggleBackdrop () {
        let removeBG = function () {
            document.body.removeChild(backdrop);
        };

        if (viewportSize() === 'mobile' && !document.body.contains(backdrop)) {
            document.body.append(backdrop);
        } else if (document.body.contains(backdrop)) {
            setTimeout(removeBG, 500);
        } else {
            return;
        }
    }

    // Toggles nav-desktop-collapse on html
    function toggleDesktop () {
        let speed = 300;

        if (viewportSize() === 'desktop') {
            if (!htmlElem.classList.contains(navDesktop) ||
                htmlElem.classList.contains(navDesktopCollapsing)) {

                htmlElem.classList.add(navDesktopCollapsing);
                toggleBackdrop();

                setTimeout(function () {
                    htmlElem.classList.add(navDesktop);
                    htmlElem.classList.remove(navDesktopCollapsing);
                }, speed);
            }

            else {
                htmlElem.classList.add(navDesktopExpanding);
                toggleBackdrop();

                setTimeout(function () {
                    htmlElem.classList.remove(navDesktop);
                    htmlElem.classList.remove(navDesktopExpanding);
                }, speed);
            }
        }

        removeResponsiveClasses();
    }

    // Close the mobile nav when a link/button is clicked
    $scope.toggleMobile = function () {
        if (viewportSize() === 'mobile') {
            htmlElem.classList.toggle(navMobile);
            toggleBackdrop();
        }

        removeResponsiveClasses();
    };

    // Run checks on the primary nav
    $scope.navPrimary = function () {
        $scope.toggleMobile();
        toggleDesktop();
    };

    // Backdrop click event listener
    backdrop.addEventListener('click', function () {
        $scope.toggleMobile();
    });

    // Esc keypress event listener
    document.onkeydown = function (evt) {
        evt = evt || window.event;
        if (evt.keyCode === 27 && viewportSize() === 'mobile' &&
            htmlHasClass(navMobile)) {
            $scope.toggleMobile();
        }
    };

    $scope.navCollapsedPopover = function () {
        var offset          = 20;
        var target          = event.target;
        let viewportOffset  = target.getBoundingClientRect().top;
        let top             = viewportOffset + offset;

        if (htmlElem.classList.contains(navDesktop)) {
            setTimeout(function () {
                target.children[1].setAttribute('style', 'top: ' + top + 'px');
            }, 200);
        }
    };
}

function primaryNav() {
    return {
        templateUrl: 'js/components/primary-nav/primary-nav.html',
        restrict: 'E',
        replace: true,
        controller: primaryNavCtrl
    };
}

componentsModule.directive('primaryNav', primaryNav);
