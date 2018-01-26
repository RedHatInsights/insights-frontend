/*global module, require*/

const lodash = require('lodash');

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
            categoryTitle:    '.page-title h1'
        },
        page3: {
            severityIcon:       'i.severity-icon.total-risk',
            ruleTitle:          '.page-title h1',
            impactedSystems:    'h3.system-count span',
            firstSystemInTable: 'section.content table tbody tr:nth-of-type(1) td:nth-of-type(3) a'
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
        firstSystemInTable: '.page-inventory table tbody tr:nth-of-type(1) td:nth-of-type(3) a',
        searchBox:          '.page-inventory .table-search input',
        systemCount:        '.page-inventory .system-count span'
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
        hostname:  'system-metadata md-card h2 .name',
        firstRule: 'rule-summary:nth-of-type(1) .title'
    },
    nav: {
    },
    betaSwitch: '.beta-switch',
    goToApp: '#launchApp',
    login: {
        form: '#kc-form-login',
        username: '#username',
        password: '#password',
        submit: '#_eventId_submit'
    }
};

['security', 'availability', 'stability', 'performance'].forEach(function (category) {
    obj.actions.page1['legend_' + category] = 'table.legend td a.' + category;
});

var i = 1;
['overview', 'actions', 'inventory', 'planner', 'rules', 'configuration'].forEach(function (item) {
    obj.nav[item] = 'md-sidenav nav li:nth-of-type(' + i + ') a';
    i += 1;
});

function unwrap(o, pre) {
    for (const [k, v] of new Map(Object.entries(o))) {
        pre = pre || '';
        if (typeof v === 'object' && !lodash.isString(v)) {
            unwrap(v, `${pre}${k}.`);
        } else {
            const path = pre + k;
            lodash.set(obj, path, {
                path: path,
                s: v,
                selector: v
            });
        }
    }
}

unwrap(obj);

module.exports.obj = obj;
module.exports.get = (o) => {
    return o.selector;
};
