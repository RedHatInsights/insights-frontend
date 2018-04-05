/*global module*/

const pub = {};
function stateToColor(state) {
    switch (state) {
        case 'critical':
            return '#cc0000';
        case 'moderate':
            return '#f0ab00';
        case 'high':
            return '#2d7623';
        default:
            return '#0088ce';
    }
}

pub.generateRatingsDonutChartData = (ratings) => {
    return [
        {
            name: 'vulnerability',
            columns: [
                ['Secure systems', ratings.vulnerability.secure],
                ['Vulnerable systems', ratings.vulnerability.vulnerable]
            ],
            state: ratings.vulnerability.state,
            title: ratings.vulnerability.score + '%',
            color: {
                pattern: [
                    stateToColor(ratings.vulnerability.state),
                    '#d1d1d1'
                ]
            }
        },

        {
            name: 'compliance',
            columns: [
                ['Compliant systems', ratings.compliance.compliant],
                ['Noncompliant systems', ratings.compliance.nonCompliant]
            ],
            state: ratings.compliance.state,
            title: ratings.compliance.score + '%',
            color: {
                pattern: [
                    stateToColor(ratings.compliance.state),
                    '#d1d1d1'
                ]
            }
        },

        {
            name: 'advisor',
            columns: [
                ['Rules passed', ratings.advisor.passed],
                ['Rules failed', ratings.advisor.failed]
            ],
            state: ratings.advisor.state,
            title: ratings.advisor.score + '%',
            color: {
                pattern: [
                    stateToColor(ratings.advisor.state),
                    '#d1d1d1'
                ]
            }
        },

        {
            name: 'subscription',
            columns: [
                ['RHEL', ratings.subscription.rhel],
                ['OpenShift', ratings.subscription.openshift],
                ['OpenStack', ratings.subscription.openstack],
                ['Available', ratings.subscription.available]
            ],
            title: ratings.subscription.score + '%',
            color: {
                pattern: [
                    '#004368',
                    '#0088ce',
                    '#7dc3e8',
                    '#d1d1d1'
                ]
            }
        }
    ];
};

module.exports = pub;
