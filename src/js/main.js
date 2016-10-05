// View:

function generateCardsView() {
  var table = document.getElementById('cards');
  while (table.firstChild) {
    table.removeChild(table.firstChild);
  }
  if (cards && cards.length) {
    document.getElementById('help').style.display = 'none';
    for (var i = 0; i < cards.length; ++i) {
      var deleteID = 'btn-delete-' + i;
      var row = table.insertRow(table.rows.length);
      row.insertCell(0).innerHTML = '<h2>' + cards[i].owner + '</h2><h2 class="muted">' + cards[i].number + '</h2><h5><a href="#" id="' + deleteID + '">Удалить</a></h5>';
      row.insertCell(1).innerHTML = '<h1 id="card-balance-' + cards[i].number + '">' + cards[i].balance + '</h1>';
      document.getElementById(deleteID).cardID = i;
      document.getElementById(deleteID).addEventListener('click', function (e) {
        removeCard(e.target.cardID);
      }, false);
    }
  } else {
    document.getElementById('help').style.display = 'block';
  }
}

function viewCardBalance(card) {
  var field = document.getElementById('card-balance-' + card.number);
  if (field) {
    field.innerHTML = card.balance;
    return true;
  } else {
    return false;
  }
}

function viewCardError(card) {
  var field = document.getElementById('card-balance-' + card.number);
  if (field) {
    field.innerHTML = '<span class="error">' + card.balance + '</span>';
    return true;
  } else {
    return false;
  }
}

function viewCardLoading(card) {
  var field = document.getElementById('card-balance-' + card.number);
  if (field) {
    field.innerHTML = '<div class="loading"></div>';
    return true;
  } else {
    return false;
  }
}

function viewCardRemove(card) {
  var field = document.getElementById('card-balance-' + card.number).parentNode;
  if (field) {
    field.parentNode.remove();
    return true;
  } else {
    return false;
  }
}

function updateStatusText(message) {
  if (message) {
    document.getElementById('status').style.display = 'block';
    document.getElementById('status-text').style.display = 'block';
    document.getElementById('status-text').innerHTML = message;
  } else {
    document.getElementById('status-text').style.display = 'none';
    document.getElementById('status-text').innerHTML = message;
  }
}

function updateStatusDate(lastSync) {
  document.getElementById('status').style.display = 'block';
  document.getElementById('status-date').innerHTML = 'Последняя синхронизация: <b>' + lastSync.date + ' &ndash; ' + lastSync.time + '</b>';
}

// Cards:

function addCard(number, owner) {
  if (number != parseInt(number, 10)) {
    console.warn('Invalid card format.');
    return false;
  }
  cards.forEach(function (card) {
    if (card.number === number) {
      console.warn('Card ' + number + ' is already in the list');
      return false;
    }
  });
  var card = {
    number: number,
    owner: owner,
    balance: 0
  }
  cards.push(card);
  generateCardsView();
  saveCards();
  getCardBalance(card);
  return true;
}

function removeCard(id) {
  if (cards && cards.length > id) {
    viewCardRemove(cards[id]);
    cards.splice(id, 1);
    saveCards();
  }
}

// Server:

function getCardBalance(card) {

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
            reject('Error fetching CSRF token: ' + xhr_card.status + ' ' + xhr_card.statusText);
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
              reject('Error fetching card balance: imporper JSON response');
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

  viewCardLoading(card);
  fetch_csrf().then(function (csrf) {
    return fetch_balance(card.number, csrf).then(function (balance) {
      card.balance = balance;
      saveCards();
      viewCardBalance(card);
      updateStatusDate(saveDate());
      console.info(card.owner + ': ' + card.balance);
    });
  }).catch(function (error) {
    viewCardError(card);
    updateStatusText('<span class="error">Не удалось проверить баланс. Попробуйте позже.</span>');
    console.warn(card.owner + ': ' + error);
  });
}

function simulateHuman() {
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
}

// Storage:

function saveCards() {
  chrome.storage.sync.set({'cards': cards});
}

function saveDate() {
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
  chrome.storage.sync.set({lastSync: datetime});
  return datetime;
}

function loadCards(callback) {
  chrome.storage.sync.get('cards', callback);
}

function loadDate(callback) {
  chrome.storage.sync.get('lastSync', callback);
}

// Initialize:

var cards = [];

loadCards(function (data) {
  if (data.cards && data.cards.length) {
    cards = data.cards;
    generateCardsView(cards);
    loadDate(function (data) {
      if (data.lastSync) {
        updateStatusDate(data.lastSync);
      }
    });
    simulateHuman().then(function () {
      cards.forEach(function (card) {
        getCardBalance(card);
      });
    });
  }
});

document.getElementById('btn-page-add').addEventListener('click', function () {
  document.getElementById('page-main').style.display = 'none';
  document.getElementById('page-add').style.display = 'block';
}, false);
