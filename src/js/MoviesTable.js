export default class MoviesTable {
  constructor(tableElem, json) {
    try {
      this.defaultOrder = JSON.parse(json);
    } catch (err) {
      throw new Error('Некорректный JSON');
    }

    if (tableElem.tagName === 'TABLE') {
      this.tableElem = tableElem;
    } else {
      throw new Error('Переданный элемент не является таблицей');
    }

    this.actualOrder = [...this.defaultOrder];
    this.addEventListeners();
  }

  renderTable() {
    const propsByOrder = ['id', 'title', 'year', 'imdb'];
    const tbody = this.tableElem.getElementsByTagName('tbody')[0];
    const tbodyNew = document.createElement('tbody');

    for (const movie of this.actualOrder) {
      const row = document.createElement('tr');

      for (const prop of propsByOrder) {
        const cell = document.createElement('td');
        let cellText = '';
        switch (prop) {
          case 'year':
            cellText = `(${movie[prop]})`;
            break;
          case 'imdb':
            cellText = `imdb: ${movie[prop].toFixed(2)}`;
            break;
          default:
            cellText = movie[prop];
        }
        cell.textContent = cellText;
        row.appendChild(cell);
      }
      tbodyNew.appendChild(row);
    }
    tbody.replaceWith(tbodyNew);
  }

  addEventListeners() {
    this.tableElem.addEventListener('click', (e) => this.changeSorting(e.target));
  }

  changeSorting(target) {
    if (!target.classList.contains('table-header')) {
      return;
    }

    const activeSorting = this.tableElem.querySelector('[data-sort-direction]');
    if (activeSorting && activeSorting !== target) {
      delete activeSorting.dataset.sortDirection;
    }

    this.switchSortDirection(target);

    switch (target.dataset.sortDirection) {
      case undefined:
        this.actualOrder = [...this.defaultOrder];
        break;
      case 'ascending':
        this.sortArray(this.actualOrder, target.dataset.name);
        break;
      case 'descending':
        this.actualOrder.reverse();
    }
    this.renderTable();
  }

  switchSortDirection(target) {
    switch (target.dataset.sortDirection) {
      case undefined:
        target.dataset.sortDirection = 'ascending';
        break;
      case 'ascending':
        target.dataset.sortDirection = 'descending';
        break;
      case 'descending':
        delete target.dataset.sortDirection;
    }
  }

  sortArray(arr, sortBy) {
    arr.sort((a, b) => {
      let aName = a[sortBy];
      let bName = b[sortBy];

      if (sortBy === 'title') {
        return aName.localeCompare(bName, 'ru');
      }

      if (+aName < +bName) return -1;
      if (+aName > +bName) return 1;
      return 0;
    });
  }
}
