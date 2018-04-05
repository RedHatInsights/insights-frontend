const moment = require('moment');
const storedData = require('./storedData');

const pub = {};

pub.getDemoDeployment = () => {
    let deployment = {
        id: 'aws-east',
        name:'US East Cloud',
        region:'AWS US-East-2',
        type:'OpenShift',
        issues: true,
        ratings: generateRatings(),
        ratings_history: generateRatingsHistory()
    };

    if (storedData.isFixed()) {
        deployment.issues = false;
        deployment.ratings.advisor.score = 91;
        deployment.ratings.advisor.passed = 82;
        deployment.ratings.advisor.failed = 8;
        deployment.ratings.advisor.state = 'high';
        let a = deployment.ratings_history.advisor.y;
        a[a.length - 1] = deployment.ratings.advisor.score;
    }

    return deployment;
};

function generateRatings() {
    return {
        vulnerability: {
            secure: 1142,
            vulnerable: 58,
            state: 'high',
            score: 95
        },

        compliance: {
            compliant: 1116,
            nonCompliant: 84,
            state: 'high',
            score: 93
        },

        advisor: {
            passed: 66,
            failed: 24,
            state: 'critical',
            score: 73
        },

        subscription: {
            rhel: 1050,
            openshift: 100,
            openstack: 50,
            available: 25,
            score: 98
        },
    }
}

function generateRatingsHistory() {
    let timeArray = [];
    for (let i = -30; i < 0; i++) {
        let d = moment().add(i, 'd').format('YYYY-MM-DD');
        timeArray.push(d);
    }

    const vulnerability = {
        x: timeArray,
        y: [
            96, 96, 96, 94, 96, 96, 95, 95, 94, 92,
            96, 96, 96, 94, 96, 93, 95, 97, 95, 96,
            96, 96, 96, 94, 96, 96, 95, 96, 94, 95
        ]
    };

    const compliance = {
        x: timeArray,
        y: [
            91, 91, 91, 90, 92, 90, 93, 92, 90, 91,
            92, 92, 92, 93, 92, 90, 93, 92, 91, 92,
            92, 92, 92, 91, 92, 93, 93, 92, 93, 93
        ]
    };

    const advisor = {
        x: timeArray,
        y: [
            88, 88, 87, 89, 88, 86, 89, 88, 89, 89,
            88, 88, 88, 87, 89, 88, 89, 88, 89, 87,
            86, 89, 90, 90, 90, 73, 73, 73, 74, 73
        ]
    };

    const subscription = {
        x: timeArray,
        y: [
            98, 98, 97, 99, 98, 99, 99, 98, 99, 99,
            98, 98, 98, 97, 99, 98, 99, 98, 99, 97,
            98, 98, 98, 97, 98, 97, 99, 98, 99, 98
        ]
    };

    return {
        vulnerability: vulnerability,
        compliance: compliance,
        advisor: advisor,
        subscription: subscription
    }
}


module.exports = pub;


