/*global module*/

const pub = {};

pub.getRecommendations = (accountNumber, systemId) => {
    return [
        {
            id: 1,
            system_id: systemId,
            account_number: accountNumber,
            rule: {
                category: "Stability",
                description: "Outlier in Underlying Network/System Configuration Parameter (Access Network MTU)",
                severity: 'WARN',
                optimization: 4,
                ansible: true,
                ansible_fix: true,
                ansible_mitigation: false,
                rule_id: 'ACCESS_NETWORK_MTU_MISMATCH',
                summary: 'Non-optimal MTU setting chosen causing degraded performance',
                generic: '',
                confidence: 2,
                likelihood: 3,
                reliability: 2,
                reason: '<p>This system network performance is degraded because:</p>\n<ul>\n<li>It is running a non-standard MTU setting on an access network <strong>ifcfg-eth0 MTU="800"</strong>.</li>\n\n\n\n\n</ul>\n',
                resolution: '<p>Red Hat recommends that you change the MTU setting <code>MTU="1545"</code></p>'
            }
        },
    ];
};

module.exports = pub;
