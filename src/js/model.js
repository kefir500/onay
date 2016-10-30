var Model = (function () {

  var cards = [];

  var model = {

    addCard: function (number, owner) {
      if (number != parseInt(number, 10)) {
        console.warn('Invalid card number.');
        return false;
      }
      if (!(owner && owner.trim().length)) {
        console.warn('Invalid card owner.');
        return false;
      }
      if (this.findCardByPan(number)) {
        console.warn('Card ' + number + ' is already in the list');
        return false;
      }
      var card = {
        number: number,
        owner: owner,
        balance: 0
      };
      cards.push(card);
      this.onAdd(card);
      this.saveCards();
      this.fetchCardBalance(card);
      return true;
    },

    findCardByPan: function (number) {
      for (var i = 0; i < cards.length; ++i) {
        if (cards[i].number == number) {
          return cards[i];
        }
      }
      return null;
    },

    findCardByIndex: function (index) {
      // This function is currently used only in unit tests.
      return cards[index];
    },

    swapCards: function (pan1, pan2) {
      var id1 = cards.indexOf(this.findCardByPan(pan1));
      var id2 = cards.indexOf(this.findCardByPan(pan2));
      if (id1 >= 0 && id2 >= 0) {
        var buffer = cards[id1];
        cards[id1] = cards[id2];
        cards[id2] = buffer;
        this.saveCards();
        return true;
      } else {
        return false;
      }
    },

    removeCard: function (pan) {
      cards.splice(cards.indexOf(this.findCardByPan(pan)), 1);
      this.saveCards();
    },

    fetchCardBalance: function (card) {
      function fetch_csrf() {
        return new Promise(function (resolve, reject) {
          var xhr_csrf = new XMLHttpRequest();
          xhr_csrf.addEventListener('readystatechange', function () {
            if (xhr_csrf.readyState === 4) {
              if (xhr_csrf.status === 200) {
                var response = new DOMParser().parseFromString(xhr_csrf.responseText, 'text/html');
                var csrf = encodeURIComponent(response.getElementById('csrftoken').value);
                resolve(csrf);
              } else {
                reject('Error fetching CSRF token: ' + xhr_csrf.status + ' ' + xhr_csrf.statusText);
              }
            }
          });
          xhr_csrf.open('GET', 'https://cabinet.onay.kz');
          xhr_csrf.send();
        });
      }

      function fetch_balance(pan, csrf) {
        return new Promise(function (resolve, reject) {
          var xhr_card = new XMLHttpRequest();
          xhr_card.addEventListener('readystatechange', function () {
            if (xhr_card.readyState === 4) {
              if (xhr_card.status === 200) {
                var json = JSON.parse(xhr_card.responseText).result;
                if (json.balance != null) {
                  resolve(json.balance / 100.0);
                } else {
                  reject('Error fetching card balance: improper JSON response');
                }
              } else {
                reject('Error fetching card balance: ' + xhr_card.status + ' ' + xhr_card.statusText);
              }
            }
          });
          xhr_card.open('POST', 'https://cabinet.onay.kz/check');
          xhr_card.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
          xhr_card.send('pan=' + pan + '&csrf=' + csrf);
        });
      }

      model.onBalanceLoading(card);
      fetch_csrf().then(function (csrf) {
        return fetch_balance(card.number, csrf).then(function (balance) {
          card.balance = balance;
          model.onBalanceUpdate(card);
          model.saveCards();
          model.saveDate();
        });
      }).catch(function (error) {
        model.onBalanceError(card, error);
      });
    },

    simulateHuman: function () {
      return new Promise(function (resolve, reject) {
        // Simulate human behavior:
        var xhr_logo = new XMLHttpRequest();
        xhr_logo.addEventListener('readystatechange', function () {
          if (xhr_logo.readyState === 2) {
            resolve(xhr_logo.response);
          }
        });
        xhr_logo.open('HEAD', 'https://cabinet.onay.kz/content/img/SiteLogo.png');
        xhr_logo.send();
      });
    },

    loadCards: function () {
      chrome.storage.sync.get('cards', function (data) {
        if (data.cards && data.cards.length) {
          cards = data.cards;
          cards.forEach(function (card) {
            model.onAdd(card);
            model.onBalanceLoading(card);
          });
          model.simulateHuman().then(function () {
            cards.forEach(function (card) {
              model.fetchCardBalance(card);
            });
          });
        }
      });
    },

    saveCards: function () {
      chrome.storage.sync.set({
        'cards': cards
      });
    },

    loadDate: function () {
      chrome.storage.sync.get('lastSync', function (data) {
        if (data.lastSync) {
          model.onDateUpdate(data.lastSync);
        }
      });
    },

    saveDate: function () {
      var dt = new Date();
      var day = ('0' + dt.getDate()).slice(-2);
      var month = ('0' + (dt.getMonth() + 1)).slice(-2);
      var year = ('0' + dt.getFullYear()).slice(-2);
      var hours = ('0' + dt.getHours()).slice(-2);
      var minutes = ('0' + dt.getMinutes()).slice(-2);
      var seconds = ('0' + dt.getSeconds()).slice(-2);
      var datetime = {
        date: day + '.' + month + '.' + year,
        time: hours + ':' + minutes + ':' + seconds
      };
      chrome.storage.sync.set({
        lastSync: datetime
      });
      this.onDateUpdate(datetime);
      return datetime;
    },

    onAdd: function (card) {
      // Fired when a new card is added.
    },

    onBalanceUpdate: function (card) {
      // Fired when a card balance is updated.
    },

    onBalanceLoading: function (card) {
      // Fired when a card balance is loading.
    },

    onBalanceError: function (card) {
      // Fired on card balance fetch error.
    }
  };

  return model;

}());
