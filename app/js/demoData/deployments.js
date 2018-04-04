const moment = require('moment');
const storedData = require('./storedData');

const pub = {};

pub.getDemoDeployment = () => {
    let deployment = {
        name:'US East Cloud',
        region:'AWS US-East-2',
        type:'OpenShift',
        issues: true,
        ratings: generateRatings(),
        ratings_history: generateRatingsHistory()
    };

    if (storedData.isFixed()) {
        deployment.issues = false;
        deployment.ratings.advisor.score = 76;
        deployment.ratings.advisor.passed = 69;
        deployment.ratings.advisor.failed = 21;
        deployment.ratings.advisor.state = 'moderate';
        let a = deployment.ratings_history.advisor.y;
        a[a.length - 1] = 72;
    }

    return deployment;
};

function generateRatings() {
    return {
        vulnerability: {
            secure: 982,
            vulnerable: 218,
            state: 'moderate',
            score: 82
        },

        compliance: {
            compliant: 816,
            nonCompliant: 218,
            state: 'moderate',
            score: 78
        },

        advisor: {
            passed: 52,
            failed: 38,
            state: 'critical',
            score: 58
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
    for (let i = -30; i < -3; i++) {
        let d = moment().add(i, 'd').format('YYYY-MM-DD');
        timeArray.push(d);
    }

    timeArray.push(moment().subtract(3, 'd').format('YYYY-MM-DD'));
    timeArray.push(moment().subtract(2, 'd').format('YYYY-MM-DD'));
    timeArray.push(moment().subtract(1, 'd').format('YYYY-MM-DD'));

    const vulnerability = {
        x: timeArray,
        y: [
            88, 88, 88, 84, 88, 81, 89, 88, 80, 82,
            88, 88, 88, 84, 88, 83, 89, 87, 80, 82,
            88, 88, 88, 84, 88, 80, 89, 86, 84, 82
        ]
    };

    const compliance = {
        x: timeArray,
        y: [
            71, 71, 71, 70, 72, 70, 73, 72, 70, 69,
            72, 72, 72, 73, 72, 70, 73, 72, 71, 68,
            72, 72, 72, 71, 72, 73, 73, 75, 76, 78
        ]
    };

    const advisor = {
        x: timeArray,
        y: [
            73, 73, 73, 74, 74, 74, 75, 78, 77, 76,
            78, 75, 74, 76, 75, 74, 75, 75, 76, 75,
            76, 76, 75, 77, 78, 77, 76, 58, 60, 58
        ]
    };

    const subscription = {
        x: timeArray,
        y: [
            98, 98, 97, 99, 98, 96, 99, 98, 99, 99,
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


