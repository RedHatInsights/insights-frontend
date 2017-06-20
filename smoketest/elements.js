/*global module*/

const obj =  {
    overview: {
        severitySummary: '.overview .widget.severity-summary'
    },
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
        createModal: {
            name:        '.maintenance-plan-modal input[name="name"]',
            firstAction: '.maintenance-modal table > tbody > tr:nth-child(1) > td:nth-child(1) > input',
            save:        '.maintenance-modal tfoot button.btn-accent'
        },
        editMeta: {
            name: '.maintenance-page .plan-wrap.active .form-group.nick input',
            save: '.maintenance-page .plan-wrap.active button[type="submit"]'
        },
        swal: {
            yes: '.swal2-container button.swal2-confirm'
        },
        openPlan: {
            name:         '.maintenance-page .plan-wrap.active .title',
            planCompress: '.maintenance-page .actions-panel.active .fa-compress.action',
            delete:       '.maintenance-page .actions-panel.active .fa-trash-o',
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
    login: {
        form: '#kc-form-login',
        username: '#username',
        password: '#password',
        submit: '#_eventId_submit'
    }
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
