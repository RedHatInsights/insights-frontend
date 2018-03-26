/*global module*/

const pub = {};

pub.getRecommendations = (accountNumber, systemId) => {
    return [
        {
            id: 1,
            rule_id: 1,
            system_id: systemId,
            account_number: accountNumber,
            showGraph: true,
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
                confidence: 4,
                likelihood: 3,
                reliability: 3,
                reason: '<p>This system network performance is degraded because:</p>\n<ul>\n<li>It is running a non-standard MTU setting on an access network <strong>ifcfg-eth0 MTU="800"</strong>.</li>\n\n\n\n\n</ul>\n',
                resolution: '<p>Red Hat recommends that you change the MTU setting <code>MTU="1545"</code></p>'
            }
        },
        {
            id: 2,
            rule_id: 2,
            system_id: systemId,
            account_number: accountNumber,
            rule: {
                category: "Deployment",
                description: "Bare metal deployment delivers better performance with Apache Load Balancers",
                severity: 'INFO',
                optimization: 1,
                ansible: true,
                ansible_fix: true,
                ansible_mitigation: false,
                rule_id: 'BARE_METAL_APACHE',
                summary: 'Non-optimal hardware configuration causing less than optimal performance',
                generic: '',
                confidence: 2,
                likelihood: 2,
                reliability: 2,
                reason: '<p>This system would be more performant using baremental</p>\n<ul>\n\n\n\n\n\n</ul>\n',
                resolution: '<p>Red Hat recommends using a baremetal hardware configuration</p>'
            }
        },
        {
            id: 3,
            rule_id: 3,
            system_id: systemId,
            account_number: accountNumber,
            rule: {
                category: "Security",
                description: "No significant correlation between number of security related customer cases and applying all errata",
                severity: 'INFO',
                optimization: 1,
                ansible: true,
                ansible_fix: true,
                ansible_mitigation: false,
                rule_id: 'SECURITY_ERRATA',
                summary: 'Unapplied Errata',
                generic: '',
                confidence: 2,
                likelihood: 2,
                reliability: 2,
                reason: '<p>This system is insecure because some errata has not been applied</p>\n',
                resolution: '<p>Red Hat recommends that you apply all errata</p>'
            }
        },
        {
            id: 4,
            rule_id: 4,
            system_id: systemId,
            account_number: accountNumber,
            rule: {
                category: "Observation",
                description: "Correlation of traditional system monitoring anomalies",
                severity: 'INFO',
                optimization: 1,
                ansible: true,
                ansible_fix: true,
                ansible_mitigation: false,
                rule_id: 'SECURITY_ERRATA',
                summary: 'System Monitoring Anomalies',
                generic: '',
                confidence: 1,
                likelihood: 1,
                reliability: 1,
                reason: '<p>This system has encountered minor anomalies that may require manual intervention</p>\n',
                resolution: '<p>Red Hat recommends that you investigate anomalies</p>'
            }
        }
    ];
};

module.exports = pub;
