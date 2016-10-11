var view = {

  addCard: function (card) {
    document.getElementById('help').style.display = 'none';
    var table = document.getElementById('cards');
    var row = table.insertRow(table.rows.length);
    row.setAttribute('draggable', 'true');
    row.setAttribute('data-card-id', table.rows.length - 1);
    row.addEventListener('dragstart', dragStart, false);
    row.addEventListener('dragenter', dragEnter, false);
    row.addEventListener('dragover', dragOver, false);
    row.addEventListener('dragend', dragEnd, false);
    row.addEventListener('drop', dragDrop, false);
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
  },

  onSwap: function () {
    // Fired when two cards are swapped.
  }
};

var dragElement;
var prevDropArea;

function dragStart(event) {
  this.classList.add('drag');
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/html', this.innerHTML);
  dragElement = this;
}

function dragEnter(event) {
  if (prevDropArea) {
    prevDropArea.classList.remove('drop');
  }
  prevDropArea = this;
  this.classList.add('drop');
}

function dragOver(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
}

function dragEnd(event) {
  this.classList.remove('drag');
  prevDropArea.classList.remove('drop');
}

function dragDrop(event) {
  event.stopPropagation();
  if (dragElement !== this) {
    var dragId = dragElement.getAttribute('data-card-id');
    var dropId = this.getAttribute('data-card-id');
    dragElement.innerHTML = this.innerHTML;
    this.innerHTML = event.dataTransfer.getData('text/html');
    view.onSwap(dragId, dropId);
  }
}
