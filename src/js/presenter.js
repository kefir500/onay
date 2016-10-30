(function () {

  Model.onAdd = function (card) {
    View.addCard(card);
  };

  Model.onBalanceUpdate = function (card) {
    View.setCardBalance(card);
    console.info(card.owner + ': ' + card.balance);
  };

  Model.onBalanceLoading = function (card) {
    View.setCardLoading(card);
  };

  Model.onBalanceError = function (card, error) {
    View.setCardError(card);
    View.setStatus('<span class="error">Не удалось проверить баланс. Попробуйте позже.</span>');
    console.warn(card.owner + ': ' + error);
  };

  Model.onDateUpdate = function (date) {
    View.setLastUpdate(date);
  };

  View.onRemove = function (card) {
    Model.removeCard(card);
  };

  View.onSwap = function (pan1, pan2) {
    Model.swapCards(pan1, pan2);
  };

  Model.loadCards();
  Model.loadDate();

  document.getElementById('btn-add').addEventListener('click', function () {
    var number = document.getElementById('input-card-number');
    var owner = document.getElementById('input-card-owner');
    if (Model.addCard(number.value, owner.value)) {
      number.value = '';
      owner.value = '';
      View.showMainPage();
    }
  }, false);

  document.getElementById('btn-page-main').addEventListener('click', function () {
    View.showMainPage();
  }, false);

  document.getElementById('btn-page-add').addEventListener('click', function () {
    View.showAddPage();
  }, false);

}());
