/*global require*/
'use strict';

var componentsModule = require('../../');

/**
* @ngInject
*/

function navPrimaryCtrl($scope, Utils, $state, InsightsConfig, User, InsightsJwt) {

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
        ]
    };

    $scope.isActive = function (states) {
        return {
            current: states.some(state => $state.is(state))
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
    const htmlElem            = document.querySelector('html');
    const backdrop            = document.createElement('div');
    backdrop.className        = 'backdrop';
    const navMobile           = 'nav-mobile-active';
    const navDesktop          = 'nav-desktop-collapse';
    const windowSm            = 768;

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

    // Test looks for any leftover desktop styles and remove them
    function removeResponsiveClasses () {
        if (viewportSize() === 'mobile' && htmlHasClass(navDesktop)) {
            htmlElem.classList.remove(navDesktop);
        } else if (viewportSize() === 'desktop' && htmlHasClass(navMobile)) {
            htmlElem.classList.remove(navMobile);
        } else {
            return;
        }
    }

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

    function toggleDesktop () {
        if (viewportSize() === 'desktop') {
            htmlElem.classList.toggle(navDesktop);
            toggleBackdrop();
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
}

function navPrimary() {
    return {
        templateUrl: 'js/components/nav/nav-primary/nav-primary.html',
        restrict: 'E',
        replace: true,
        controller: navPrimaryCtrl
    };
}

componentsModule.directive('navPrimary', navPrimary);
