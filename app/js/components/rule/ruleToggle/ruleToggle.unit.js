/*global describe, it, require*/
'use strict';

const should = require('should');
const sinon = require('sinon');
const ruleToggle = require('./ruleToggle.directive');
const unit = require('../../../../../unit');

describe('ruleToggle', () => {
    describe('init()', () => {
        const gettextCatalog = {
            getString: (str) => { return str; }
        };

        it('should Ignore Rule', () => {
            const scope = {};
            ruleToggle.pub.init(scope, gettextCatalog);
            scope.text.should.equal(ruleToggle.priv.text.IGNORE_RULE);
        });

        it('should Unignore Rule', () => {
            const scope = {
                rule: {
                    ack_id: 1235
                }
            };

            ruleToggle.pub.init(scope, gettextCatalog);
            scope.text.should.equal(ruleToggle.priv.text.UNIGNORE_RULE);
        });
    });

    describe('ackAction()', () => {
        it('should delete an ack', () => {
            const scope = {
                rule: {
                    ack_id: 1234
                }
            };

            const ack = {
                deleteAck: sinon.spy()
            };

            ruleToggle.pub.ackAction(scope, ack)();

            ack.deleteAck.should.be.calledOnce();
            ack.deleteAck.should.be.calledWith({ id: 1234 });
            should(scope.rule.ack_id).equal(null);
        });

        it('create an ack', function (done) {
            const scope = {
                rule: {
                    ack_id: null
                }
            };

            const ack = {
                createAck: sinon.stub()
            };

            ack.createAck.resolves({id: 'fdsa'});

            ruleToggle.pub.ackAction(scope, ack)();

            ack.createAck.should.be.calledOnce();
            ack.createAck.should.be.calledWith(scope.rule);

            unit.utils.asyncHack(() => {
                should(scope.rule.ack_id).equal('fdsa');
                done();
            });
        });
    });
});
