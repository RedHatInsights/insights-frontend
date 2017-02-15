'use strict';

var constantsModule = require('./');

// Error responses from  {post} /maintenance/:id/playbook
constantsModule.constant('AnsibleAPIErrors', {
    AmbiguousResolution: 'AMBIGUOUS_RESOLUTION',
    MaintenanceEmpty: 'MAINTENANCE_EMPTY',
    MaintenanceNothingToFix: 'MAINTENANCE_NOTHING_TO_FIX',
    UnsupportedRule: 'UNSUPPORTED_RULE'
});

// Error messages
constantsModule.constant('AnsibleErrors', {
    AnswerAllQuestions: 'Please verify all questions have been answered',
    NoActions: 'There are no playbooks available for the selected Maintenance Plan',
    GeneralFailure: 'Can not create a playbook with the information provided.'
});
