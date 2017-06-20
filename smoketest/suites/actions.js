/*global describe, it module, require*/

const el = require('../elements.js');

module.exports = (nightmare) => {
    describe('Actions', () => {
        it('should be able to get to the System Modal through Actions', (done) => {
            nightmare
                .waitAndClick(el.nav.actions)
                .waitAll('nav')
                .waitAll('actions.page1')

                .waitAndClick(el.actions.page1.legend_security)
                .waitAll('nav')
                .waitAll('actions.page2')


                .waitAndClick(el.actions.page2.firstRuleInTable)
                .waitAll('nav')
                .waitAll('actions.page3')
                .getStash({
                    results: {},
                    selectors: {
                        ruleNamePage3: el.actions.page3.ruleTitle,
                        systemNamePage3: el.actions.page3.firstSystemInTable
                    }
                })
                .then((stash) => {
                    nightmare
                        .waitAndClick(el.actions.page3.firstSystemInTable)
                        .waitAll('nav')
                        .waitAll('systemModal')
                        .getStash({
                            results: stash.results,
                            selectors: {
                                ruleNameModal: el.systemModal.firstRule,
                                systemNameModal: el.systemModal.hostname
                            }
                        })
                        .then((stash) => {
                            stash.results.ruleNameModal.should.equal(`Security > ${stash.results.ruleNamePage3}`);
                            stash.results.systemNamePage3.should.equal(stash.results.systemNameModal);
                            nightmare.waitAndClick(el.systemModal.exButton)
                                .waitAll('nav')
                                .then(nightmare.myDone(done))
                                .catch(nightmare.myDone(done));
                        }).catch(nightmare.myDone(done));
                }).catch(nightmare.myDone(done));
        });
    });
};
