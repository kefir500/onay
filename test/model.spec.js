unittest = true;

chrome = {
  storage: {
    sync: {
      get: function () {},
      set: function () {}
    }
  }
};

describe('Model', function () {

  beforeEach(function () {
    Model.clearCards();
  });

  it('prohibits duplicated card PAN', function () {
    expect(Model.addCard('11111', 'OWNER')).toBe(true);
    expect(Model.addCard('22222', 'OWNER')).toBe(true);
    expect(Model.addCard(33333, 'OWNER')).toBe(true);
    expect(Model.addCard(44444, 'OWNER')).toBe(true);
    expect(Model.addCard('  55555  ', 'OWNER')).toBe(true);

    expect(Model.addCard('11111', 'OWNER')).toBe(false);
    expect(Model.addCard(22222, 'OWNER')).toBe(false);
    expect(Model.addCard('33333', 'OWNER')).toBe(false);
    expect(Model.addCard(44444, 'OWNER')).toBe(false);
    expect(Model.addCard(55555, 'OWNER')).toBe(false);
  });

  it('handles invalid card PAN', function () {
    expect(Model.addCard('11111', 'OWNER')).toBe(true);
    expect(Model.addCard(22222, 'OWNER')).toBe(true);
    expect(Model.addCard('FOO', 'OWNER')).toBe(false);
    expect(Model.addCard('', 'OWNER')).toBe(false);
  });

  it('handles empty owner value', function () {
    expect(Model.addCard(11111)).toBe(false);
    expect(Model.addCard(22222, '')).toBe(false);
    expect(Model.addCard(33333, '   ')).toBe(false);
  });

  it('finds card by PAN', function () {
    Model.addCard(42, 'Deep Thought');
    Model.addCard(1138, 'Darth Vader');
    expect(Model.findCardByPan(42).owner).toBe('Deep Thought');
    expect(Model.findCardByPan(1138).owner).toBe('Darth Vader');
  });

  it('swaps card order', function () {
    Model.addCard(11111, 'Jim');
    Model.addCard(22222, 'Jimi');
    Model.addCard(33333, 'Janis');
    expect(Model.findCardByIndex(0).owner).toBe('Jim');
    expect(Model.findCardByIndex(1).owner).toBe('Jimi');
    expect(Model.findCardByIndex(2).owner).toBe('Janis');
    expect(Model.findCardByPan(11111).owner).toBe('Jim');
    expect(Model.findCardByPan(22222).owner).toBe('Jimi');
    expect(Model.findCardByPan(33333).owner).toBe('Janis');
    Model.swapCards(11111, 33333);
    expect(Model.findCardByIndex(0).owner).toBe('Janis');
    expect(Model.findCardByIndex(1).owner).toBe('Jimi');
    expect(Model.findCardByIndex(2).owner).toBe('Jim');
    expect(Model.findCardByPan(11111).owner).toBe('Jim');
    expect(Model.findCardByPan(22222).owner).toBe('Jimi');
    expect(Model.findCardByPan(33333).owner).toBe('Janis');
  });

  it('removes card by PAN', function () {
    Model.addCard(11111, 'The Good');
    Model.addCard(22222, 'The Bad');
    Model.addCard(33333, 'The Ugly');
    Model.removeCard(22222);
    expect(Model.findCardByPan(11111)).not.toBe(null);
    expect(Model.findCardByPan(22222)).toBe(null);
    expect(Model.findCardByPan(33333)).not.toBe(null);
    expect(Model.findCardByIndex(0).owner).toBe('The Good');
    expect(Model.findCardByIndex(1).owner).toBe('The Ugly');
  });

  it('removes all cards', function () {
    Model.addCard(11111, 'OWNER');
    Model.addCard(22222, 'OWNER');
    Model.addCard(33333, 'OWNER');
    expect(Model.findCardByPan(11111)).not.toBe(null);
    expect(Model.findCardByPan(22222)).not.toBe(null);
    expect(Model.findCardByPan(33333)).not.toBe(null);
    expect(Model.findCardByIndex(0)).not.toBe(undefined);
    Model.clearCards();
    expect(Model.findCardByPan(11111)).toBe(null);
    expect(Model.findCardByPan(22222)).toBe(null);
    expect(Model.findCardByPan(33333)).toBe(null);
    expect(Model.findCardByIndex(0)).toBe(undefined);
  });

  it('fetches balance', function (done) {
    Model.addCard('9643908503302335652', 'Real Card');
    Model.onBalanceUpdate = function (card) {
      expect(card.balance).toBeGreaterThan(0);
      done();
    };
    Model.onBalanceError = function () {
      done.fail();
    };
    Model.simulateHuman().then(function () {
      Model.fetchCardBalance(Model.findCardByPan('9643908503302335652'));
    });
  });
});
