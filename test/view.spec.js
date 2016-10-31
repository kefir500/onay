unittest = true;

(function () {
  document.body.innerHTML =
    '<input id="input-card-number">' +
    '<input id="input-card-owner">' +
    '<button id="btn-add">Add Card</button>' +
    '<button id="btn-page-main">Go to Add Page</button>' +
    '<button id="btn-page-add">Go to Main Page</button>' +
    '<table id="cards"></table>' +
    '<div id="page-add"></div>' +
    '<div id="page-main"></div>' +
    '<span id="status"></span>' +
    '<span id="status-text"></span>' +
    '<span id="help"></span>';
}());

describe('View', function () {

  var btnAdd = document.getElementById('btn-add');
  var inputPan = document.getElementById('input-card-number');
  var inputOwner = document.getElementById('input-card-owner');

  beforeEach(function () {
    Model.clearCards();
  });

  it('adds cards to model', function () {
    expect(Model.findCardByPan(11111)).toBe(null);
    expect(Model.findCardByPan(22222)).toBe(null);
    inputPan.value = '11111';
    inputOwner.value = 'Batman';
    btnAdd.click();
    expect(Model.findCardByPan(11111)).not.toBe(null);
    expect(Model.findCardByPan(22222)).toBe(null);
    expect(Model.findCardByIndex(0)).not.toBe(undefined);
    expect(Model.findCardByIndex(1)).toBe(undefined);
    inputPan.value = '22222';
    inputOwner.value = 'Robin';
    btnAdd.click();
    expect(Model.findCardByPan(11111)).not.toBe(null);
    expect(Model.findCardByPan(22222)).not.toBe(null);
    expect(Model.findCardByIndex(0).owner).toBe('Batman');
    expect(Model.findCardByIndex(1).owner).toBe('Robin');
  });

  it('removes cards from model', function () {
    expect(Model.findCardByPan(11111)).toBe(null);
    expect(Model.findCardByPan(22222)).toBe(null);
    Model.addCard(11111, 'Kirk');
    Model.addCard(22222, 'Spock');
    expect(Model.findCardByPan(11111)).not.toBe(null);
    expect(Model.findCardByPan(22222)).not.toBe(null);
    document.querySelectorAll('[data-card-pan="11111"] .btn-delete')[0].click();
    expect(Model.findCardByPan(11111)).toBe(null);
    expect(Model.findCardByPan(22222)).not.toBe(null);
    expect(Model.findCardByIndex(0).owner).toBe('Spock');
  });
});
