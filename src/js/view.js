var view = {

  addCard: function (card) {
    document.getElementById('help').style.display = 'none';
    var table = document.getElementById('cards');
    var row = table.insertRow(table.rows.length);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    cell1.innerHTML = '<h2>' + card.owner + '</h2><h2 class="muted">' + card.number + '</h2>';
    cell2.innerHTML = '<h1 id="card-balance-' + card.number + '">' + card.balance + '</h1>';
    var btnDelete = document.createElement('h5');
    btnDelete.innerHTML = '<a href="#">Удалить</a>';
    cell1.appendChild(btnDelete);
    // Remove card:
    btnDelete.addEventListener('click', function () {
      row.remove();
      view.onRemove(card);
    }, false);
  },

  setCardBalance: function (card) {
    var field = document.getElementById('card-balance-' + card.number);
    if (field) {
      field.innerHTML = card.balance;
      return true;
    } else {
      return false;
    }
  },

  setCardError: function (card) {
    var field = document.getElementById('card-balance-' + card.number);
    if (field) {
      field.innerHTML = '<span class="error">' + card.balance + '</span>';
      return true;
    } else {
      return false;
    }
  },

  setCardLoading: function (card) {
    var field = document.getElementById('card-balance-' + card.number);
    if (field) {
      field.innerHTML = '<div class="loading"></div>';
      return true;
    } else {
      return false;
    }
  },

  setStatus: function (message) {
    if (message) {
      document.getElementById('status').style.display = 'block';
      document.getElementById('status-text').style.display = 'block';
      document.getElementById('status-text').innerHTML = message;
    } else {
      document.getElementById('status-text').style.display = 'none';
      document.getElementById('status-text').innerHTML = message;
    }
  },

  setLastUpdate: function (datetime) {
    document.getElementById('status').style.display = 'block';
    document.getElementById('status-date').innerHTML = 'Последняя синхронизация: <b>' + datetime.date + ' &ndash; ' + datetime.time + '</b>';
  },

  showMainPage: function () {
    document.getElementById('page-add').style.display = 'none';
    document.getElementById('page-main').style.display = 'block';
  },

  showAddPage: function () {
    document.getElementById('page-main').style.display = 'none';
    document.getElementById('page-add').style.display = 'block';
  },

  onRemove: function () {
    // Fired when "Remove" button is clicked.
  }
};
