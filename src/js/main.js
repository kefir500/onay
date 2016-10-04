function add_card(number, owner) {
  cards.push({ number: number, owner: owner, balance: '...' });
  save_cards();
  get_balance(cards[cards.length - 1]);
  return true;
}

function remove_card(id) {
  cards.splice(id, 1);
  save_cards();
}

function update_view(status) {
  var table = document.getElementById('cards');
  if (table) {
    while (table.firstChild) {
      table.removeChild(table.firstChild);
    }
    if (cards.length) {
      document.getElementById('header').style.display = 'none';
      var row;
      for (var i = 0; i < cards.length; ++i) {
        var id_delete = 'btn-delete-' + i;
        row = table.insertRow(table.rows.length);
        row.insertCell(0).innerHTML = '<h2>' + cards[i].owner + '</h2><h2 class="text-muted">' + cards[i].number + '</h2><h5><a href="#" id="' + id_delete + '">Удалить</a></h5>';
        row.insertCell(1).innerHTML = '<h1>' + cards[i].balance + '</h1>';
        document.getElementById(id_delete).card_id = i;
        document.getElementById(id_delete).addEventListener('click', function(e) {
          remove_card(e.target.card_id);
        }, false);
      }
      if (sync) {
        status = status ? status + '<br>' : '';
        row = table.insertRow(table.rows.length);
        var cell = row.insertCell(0);
        cell.colSpan = 2;
        cell.innerHTML = status + 'Последняя синхронизация: <b>' + sync.date + ' &ndash; ' + sync.time + '</b>';
      }
    } else {
      loaded();
    }
  }
}

function loaded() {
  var element;
  element = document.getElementById('header'); if (element) { element.style.display = 'block'; }
  element = document.getElementById('header-help'); if (element) { element.style.display = 'block'; }
  element = document.getElementById('header-loading'); if (element) { element.style.display = 'none'; }
}

function get_balance(card) {

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
            console.warn('Error fetching CSRF token: ' + xhr_card.status + ' ' + xhr_card.statusText);
            reject(xhr_csrf.statusText);
          }
        }
      });
      xhr_csrf.open('GET', 'https://cabinet.onay.kz');
      xhr_csrf.send();
    });
  }

  function fetch_balance(csrf) {
    return new Promise(function (resolve, reject) {
      var xhr_card = new XMLHttpRequest();
      xhr_card.addEventListener('readystatechange', function () {
        if (xhr_card.readyState === 4) {
          if (xhr_card.status === 200) {
            var json = JSON.parse(xhr_card.responseText).result;
            var balance = typeof(json.balance) !== 'undefined' ? json.balance / 100.0 : 'Ошибка';
            resolve(balance);
          } else {
            console.warn('Error fetching card balance: ' + xhr_card.status + ' ' + xhr_card.statusText);
            reject(xhr_card.statusText);
          }
        }
      });
      xhr_card.open('POST', 'https://cabinet.onay.kz/check');
      xhr_card.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr_card.send('pan=' + card.number + '&csrf=' + csrf);
    });
  }

  function fetch_logo() {
    return new Promise(function (resolve, reject) {
      // Simulate human behavior:
      var xhr_logo = new XMLHttpRequest();
      xhr_logo.addEventListener('readystatechange', function () {
        if (xhr_logo.readyState === 4) {
          resolve(xhr_logo.response);
        }
      });
      xhr_logo.open('GET', 'https://cabinet.onay.kz/content/img/SiteLogo.png');
      xhr_logo.send();
    });
  }

  fetch_logo().then(function () {
    return fetch_csrf();
  }).then(function (csrf) {
    return fetch_balance(csrf)
  }).then(function (balance) {
    card.balance = balance;
    save_cards();
    save_datetime();
  }).catch(function () {
    update_view('<span class="error">Не удалось проверить баланс. Попробуйте позже.</span>');
  });
}

function save_cards() {
  chrome.storage.sync.set({ cards: cards });
  update_view();
}

function save_datetime() {
  var dt = new Date();
  var day = ('0' + dt.getDate()).slice(-2);
  var month = ('0' + (dt.getMonth() + 1)).slice(-2);
  var year = ('0' + dt.getFullYear()).slice(-2);
  var hours = ('0' + dt.getHours()).slice(-2);
  var minutes = ('0' + dt.getMinutes()).slice(-2);
  var seconds = ('0' + dt.getSeconds()).slice(-2);
  sync = {
    date: day + '.' + month + '.' + year,
    time: hours + ':' + minutes + ':' + seconds
  };
  chrome.storage.sync.set({ sync: sync });
  update_view();
}

function load_settings() {
  chrome.storage.sync.get('sync', function(items) {
    sync = items.sync;
  });
  chrome.storage.sync.get('cards', function(items) {
    if (items.cards && items.cards.length) {
      cards = items.cards;
      update_view('<b>Загрузка...</b>');
      for (var i = 0; i < cards.length; ++i) {
        get_balance(cards[i]);
      }
    } else {
      loaded();
    }
  });
}

// Initialize:

var cards = [];
var sync = {};
load_settings();
