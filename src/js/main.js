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
  var row;
  if (table) {
    while (table.firstChild) { table.removeChild(table.firstChild); }
    if (cards.length) {
      document.getElementById('header').style.display = 'none';
      for (var i = 0; i < cards.length; ++i) {
        var id_delete = 'btn-delete-' + i;
        row = table.insertRow(table.rows.length);
        row.insertCell(0).innerHTML = '<h2>' + cards[i].owner + '</h2><h2 class="text-muted">' + cards[i].number + '</h2><h5><a href="#" id="' + id_delete + '">Удалить</a></h5>';
        row.insertCell(1).innerHTML = '<h1>' + cards[i].balance + '</h1>';
        document.getElementById(id_delete).card_id = i;
        document.getElementById(id_delete).addEventListener('click', function(e) { remove_card(e.target.card_id); }, false);
      }
      if (sync) {
        status = status ? status + '<br>' : '';
        row = table.insertRow(table.rows.length);
        var cell = row.insertCell(0);
        cell.colSpan = 2;
        cell.innerHTML = status + 'Последняя синхронизация: <b>' + sync.date + ' &ndash; ' + sync.time + '</b>';
      }
    }
    else {
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
  var xhr = new XMLHttpRequest();
  xhr.addEventListener('readystatechange', function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        var json = JSON.parse(JSON.parse(xhr.responseText).filecontent).result;
        card.balance = typeof(json.balance) !== 'undefined' ? json.balance / 100.0 : 'Ошибка';
        console.info(card.owner + ': ' + json.type);
        save_cards();
        save_datetime();
      }
      else {
        update_view('<span class="error">Не удалось проверить баланс. Попробуйте позже.</span>');
      }
    }
  });
  xhr.open('POST', 'http://www.onay.kz/balance.json?pan=' + card.number);
  xhr.send();
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
  chrome.storage.sync.get('cards', function(items) {
    if (items.cards && items.cards.length) {
      cards = items.cards;
      for (var i = 0; i < cards.length; ++i) {
        get_balance(cards[i]);
      }
    }
    else {
      loaded();
    }
  });
  chrome.storage.sync.get('sync', function(items) {
    sync = items.sync;
  });
}

// Initialize:

var cards = [];
var sync = {};
load_settings();
