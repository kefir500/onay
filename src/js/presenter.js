function isTest() {
  return typeof unittest !== 'undefined' && unittest == true;
}

(function () {

  Model.onAdd = function (card) {
    View.addCard(card.number, card.owner);
    View.setCardBalance(card.number, card.balance);
  };

  Model.onBalanceUpdate = function (card) {
    View.setCardBalance(card.number, card.balance);
    console.info(card.owner + ': ' + card.balance);
  };

  Model.onBalanceLoading = function (card) {
    View.setCardLoading(card.number);
  };

  Model.onBalanceError = function (card, error) {
    View.setCardBalance(card.number, card.balance);
    View.setCardError(card.number);
    View.setStatus('<span class="error">Не удалось проверить баланс. Попробуйте позже.</span>');
    console.warn(card.owner + ': ' + error);
  };

  Model.onDateUpdate = function (date) {
    View.setLastUpdate(date);
  };

  View.onAdd = function (pan, owner) {
    if (Model.addCard(pan, owner)) {
      View.showMainPage();
    } else {
      // TODO Error
    }
  };

  View.onRemove = function (pan) {
    Model.removeCard(pan);
  };

  View.onSwap = function (pan1, pan2) {
    Model.swapCards(pan1, pan2);
  };

  if (!isTest()) {
    Model.loadCards();
    Model.loadDate();
  }

}());
