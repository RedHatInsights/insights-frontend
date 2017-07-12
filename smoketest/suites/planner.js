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
                        .wait(750) // seems like we just needed to wait a few ms after clicking for the XHR request to go through
                        .then(() => {
                            const id   = newName.match(/\(([0-9]*)\)$/)[1];
                            const url  = `https://access.redhat.com/r/insights/v2/maintenance/${id}`;
                            const opts = { auth: `${env.TEST_USERNAME}:${env.TEST_PASSWORD}` };

                            // todo should not use the prod url here
                            got.delete(url, opts)
                                .then(nightmare.myDone(done, `Error: plan ${id} still exists!`))
                                .catch((e) => {
                                    if (e.statusCode === 404) {
                                        // should 404, dis good pass the test
                                        nightmare.myDone(done)();
                                        return;
                                    }
                                    // if any other code fail
                                    nightmare.myDone(done)(e);
                                });
                        })
                        .catch(nightmare.myDone(done));
                }).catch(nightmare.myDone(done));
        });
    });
};
