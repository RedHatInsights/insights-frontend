/*global module*/

const obj =  {
    actions: {
        page1: {
            donutHole: '.donut-container .donut-hole'
        },
        page2: {
            firstRuleInTable: '.topic-rule-list .legend-item:nth-of-type(1) td:nth-of-type(1)',
            categoryTitle:   '.topic-summary .page-title span span'
        },
        page3: {
            severityIcon:       '.main-content .severity-icon i',
            ruleTitle:          '.main-content .wrapper section.gray h2',
            impactedSystems:    '.main-content .wrapper section h3 span',
            firstSystemInTable: '.main-content .wrapper div table.table.nomar tbody tr:nth-of-type(1) td:nth-of-type(3) a'
        }
    },
    planner: {
        createPlan: '.maintenance-page .create-plan',
        editMeta: {
            name: '.maintenance-page .plan-wrap.active .form-group.nick input'
        },
        openPlan: {
            planCompress: '.maintenance-page .actions-panel.active .fa-compress.action',
            editToggle:   '.maintenance-page .plan-wrap.active .title .edit-toggle'
        }
    },
    inventory: {
        firstSystemInTable: '.inventory table.ng-table tbody tr:nth-of-type(1) td.long-name a',
        searchBox:          '.inventory .input-group',
        checkinSelect:      '.inventory .checkin-select',
        actionsSelect:      '.inventory .actions-select',
        systemCount:        '.inventory h3.system-count span'
    },
    jQuery: {
        inventory: {
            searchBox:     '.inventory .input-group input[placeholder="Search…"]',
            checkinSelect: '.inventory .checkin-select li a:contains("Checking In")',
            actionsSelect: '.inventory .actions-select li a:contains("Affected")'
        }
    },
    systemModal: {
        exButton:  '.modal-dialog .fa.fa-close',
        hostname:  '.modal-dialog .modal-title h2 .ellipsis-overflow span',
        firstRule: '.modal-dialog .rule-summaries .header h3.title'
    },
    nav: {
    },
    betaSwitch: '.beta-switch',
    goToApp: '.landing-page-top .container .row a.btn-app:nth-of-type(2)',
    loginForm: '#kc-form-login'
};

['security', 'availability', 'stability', 'performance'].forEach(function (category) {
    obj.actions.page1['legend_' + category] = 'table.legend a.' + category;
});

var i = 1;
['overview', 'actions', 'inventory', 'planner', 'rules', 'configuration'].forEach(function (item) {
    obj.nav[item] = '.dashboard-navigation-container .nav li:nth-of-type(' + i + ') a';
    i += 1;
});

// console.log(JSON.stringify(obj, false, 2));

module.exports = obj;
