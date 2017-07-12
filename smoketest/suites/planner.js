/*global describe, it module, require, process*/

const env   = process.env;
const got   = require('got');
const el    = require('../elements.js');
const funcs = require('../funcs');

module.exports = (nightmare) => {
    describe('Planner', () => {
        it('should let you create a plan', (done) => {
            const name = `SmokeTest_${funcs.getRandomString(20)}`;

            nightmare
                // nav to planner
                .waitAndClick(el.nav.planner)
                .waitAll('nav')

                // click create plan
                .waitAndClick(el.planner.createPlan)
                .waitAll('planner.createModal')

                // insert title
                .insert(el.planner.createModal.name, name)
                .waitAndClick(el.planner.createModal.firstAction) // .check() does not work in our app
                .waitAndClick(el.planner.createModal.save)

                // verify the name is now changed
                .wait(el.planner.openPlan.name)
                .evaluate((el) => {
                    return document.querySelector(el.planner.openPlan.name).textContent;
                }, el)
                .then((newName) => {
                    newName.should.match(new RegExp(`^${name}.*`));
                    nightmare
                        .waitAndClick(el.planner.openPlan.delete)
                        .waitAndClick(el.planner.swal.yes)
                        // .then(nightmare.myDone(done))
                        .catch(nightmare.myDone(done));
                    // TODO confirm delete

                    // delete wasnt working, retying here
                    // TODO fix this ^
                    // this is just a call to prod for cleanup
                    // a hack to prevent a mess
                    // it is not good test code
                    const id = newName.match(/\(([0-9]*)\)$/)[1];
                    got.delete(`https://access.redhat.com/r/insights/v2/maintenance/${id}`, {
                        auth: `${env.TEST_USERNAME}:${env.TEST_PASSWORD}`
                    }).finally(() => {
                        nightmare.myDone(done);
                    });
                }).catch(nightmare.myDone(done));
        });
    });
};
