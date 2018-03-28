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
                reason: '<p>This system is running on OpenStack Platform 10. and Neutron network service. Red Hat analysed that <strong>93%</strong> of our customers running a similar deployment, have configured the MTU of the tenant network to 1545.</p>' +
                '<p>This systems configuration of the MTU of the tenant network is currently configured to be 950</p>' +
                '<p>Parameter Value is used in 0.75% of the similar deployments.  Parameter Value is in the 2σ interval</p>' +
                '<p>Predictive accuracy of a model is <strong>very high.</strong></p>',
                resolution: '<p>Red Hat recommends that you change <code>global_physnet_mtu</code> setting in <code>/etc/neutron/neutron.conf</code>  file to fix this issue.</p>' +
                '<p>Run this Ansible playbook:&nbsp;&nbsp; ' +
                '<md-icon md-svg-src="static/images/l_ansible-blue.svg" alt="This rule has Ansible support. Use the Planner to generate an Ansible Playbook." class="material-icons" role="img" aria-hidden="true"><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 2032 2027.2" style="enable-background:new 0 0 2032 2027.2;" xml:space="preserve" fit="" height="100%" width="100%" preserveAspectRatio="xMidYMid meet" focusable="false">\n' +
                '<style type="text/css">\n' +
                '\t.st0{fill:#08C0FC;}\n' +
                '</style>\n' +
                '<path class="st0" d="M2030.8,1014.8c0,559.2-453.3,1012.4-1012.4,1012.4C459.2,2027.2,5.9,1574,5.9,1014.8\n' +
                '\tC5.9,455.7,459.2,2.4,1018.3,2.4C1577.5,2.4,2030.8,455.7,2030.8,1014.8 M1035.4,620.9l262,646.6L901.7,955.8L1035.4,620.9\n' +
                '\tL1035.4,620.9z M1500.8,1416.5l-403-969.9c-11.5-28-34.5-42.8-62.4-42.8c-28,0-52.7,14.8-64.2,42.8L528.9,1510.4h151.3l175.1-438.6\n' +
                '\tl522.5,422.1c21,17,36.2,24.7,55.9,24.7c39.5,0,74-29.6,74-72.3C1507.7,1439.4,1505.3,1428.3,1500.8,1416.5L1500.8,1416.5z"></path>\n' +
                '</svg></md-icon><a target="_blank" href="#"> Download</a></p>',
                more_info: '<ul>' +
                '<li><a href="https://access.redhat.com/documentation/en-us/red_hat_openstack_platform/12/html/networking_guide/sec-mtu">Chapter 9. Configure MTU Settings - Red Hat OpenStack Platform 12 Networking Guide</a></li>' +
                '<li><a href="https://access.redhat.com/solutions/3059091">How to set MTU per Port/Subnet/Network in Neutron</a></li>' +
                '</ul>'
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
