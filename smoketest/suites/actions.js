/*global describe, it module, require*/

const el = require('../elements.js');

module.exports = (nightmare) => {
    describe('Actions', () => {
        it('should be able to get to the System Modal through Actions', (done) => {
            nightmare
                .wrap('page one', (n) => {
                    n.waitAndClick(el.nav.actions)
                        .waitAll('nav')
                        .waitAll('actions.page1');
                })

                .wrap('page two', (n) => {
                    n.waitAndClick(el.actions.page1.legend_security)
                        .waitAll('nav')
                        .waitAll('actions.page2');
                })

                .wrap('page one', (n) => {
                    n.waitAndClick(el.actions.page2.firstRuleInTable)
                        .waitAll('nav')
                        .waitAll('actions.page3')
                        .evaluate((el) => {
                            return {
                                ruleNamePage3: document.querySelector(el.actions.page3.ruleTitle).textContent,
                                systemNamePage3: document.querySelector(el.actions.page3.firstSystemInTable).textContent
                            };
                        }, el);
                })
                .then((stash) => {
                    nightmare
                        .wrap('page three', (n) => {
                            n.waitAndClick(el.actions.page3.firstSystemInTable)
                                .waitAll('nav')
                                .waitAll('systemModal')
                                .evaluate((el, stash) => {
                                    stash.ruleNameModal = document.querySelector(el.systemModal.firstRule).textContent.trim();
                                    stash.systemNameModal =  document.querySelector(el.systemModal.hostname).textContent.trim();
                                    return stash;
                                }, el, stash);
                        })
                        .then((stash) => {
                            nightmare.wrap('system modal', (n) => {
                                stash.ruleNameModal.should.equal(`Security > ${stash.ruleNamePage3}`);
                                stash.systemNamePage3.should.equal(stash.systemNameModal);
                                n.waitAndClick(el.systemModal.exButton)
                                    .waitAll('nav')
                                    .then(done)
                                    .catch(done);
                            });
                        }).catch(done);
                }).catch(done);
        });
    });
};
