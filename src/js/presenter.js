model.onAdd = function (card) {
  view.addCard(card);
};

model.onBalanceUpdate = function (card) {
  view.setCardBalance(card);
  console.info(card.owner + ': ' + card.balance);
};

model.onBalanceLoading = function (card) {
  view.setCardLoading(card);
};

model.onBalanceError = function (card, error) {
  view.setCardError(card);
  view.setStatus('<span class="error">Не удалось проверить баланс. Попробуйте позже.</span>');
  console.warn(card.owner + ': ' + error);
};

model.onDateUpdate = function (date) {
  view.setLastUpdate(date);
};

view.onRemove = function (card) {
  model.removeCard(card);
};

model.loadCards();
model.loadDate();

document.getElementById('btn-add').addEventListener('click', function () {
  var number = document.getElementById('input-card-number');
  var owner = document.getElementById('input-card-owner');
  if (number.value && owner.value) {
    model.addCard(number.value, owner.value);
    number.value = '';
    owner.value = '';
    view.showMainPage();
  }
}, false);

document.getElementById('btn-page-main').addEventListener('click', function () {
  view.showMainPage();
}, false);

document.getElementById('btn-page-add').addEventListener('click', function () {
  view.showAddPage();
}, false);
