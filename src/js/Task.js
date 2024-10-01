export default class Task {
  constructor(container, headerText) {
    this.container = container;

    const tasks = document.createElement('div');
    tasks.classList.add('container-task');
    container.append(tasks);

    const header = document.createElement('div');
    header.classList.add('tasks_header');
    tasks.append(header);

    const tasksHeaderText = document.createElement('h4');
    tasksHeaderText.classList.add('tasks_header_text');
    tasksHeaderText.textContent = headerText;
    header.append(tasksHeaderText);

    const optionsBtn = document.createElement('span');
    optionsBtn.classList.add('task_header_options');
    optionsBtn.textContent = '...';
    header.append(optionsBtn);

    const taskList = document.createElement('div');
    taskList.classList.add('task_list');
    tasks.append(taskList);

    const addedCard = document.createElement('div');
    addedCard.classList.add('added_card');
    addedCard.textContent = '+ Add another card';
    tasks.append(addedCard);

    addedCard.addEventListener('click', (e) => this.onAddCardClick(e));

    taskList.addEventListener('mousedown', (e) => this.onMouseDownTask(e));

    this.tasks = tasks;
    this.taskList = taskList;
    this.addedCard = addedCard;

    this.drag = null;
    this.startX = 0;
    this.startY = 0;
  }

  onMouseDownTask(e) {
    e.preventDefault();

    if (e.button !== 0) return;

    const actualElement = e.target;

    if (!actualElement.classList.contains('task_card')) {
      return;
    }

    this.drag = actualElement;

    const rect = this.drag.getBoundingClientRect();
    this.startX = e.clientX - rect.left;
    this.startY = e.clientY - rect.top;

    this.previousNeighbour = this.drag.previousElementSibling;
    this.nextNeighbour = this.drag.nextElementSibling;

    this.placeholder = document.createElement('div');
    this.placeholder.style.width = `${this.drag.offsetWidth}px`;
    this.placeholder.style.height = `${this.drag.offsetHeight}px`;
    this.drag.parentNode.insertBefore(this.placeholder, this.drag);

    this.drag.classList.add('drag');

    this.drag.style.left = `${rect.left}px`;
    this.drag.style.top = `${rect.top}px`;
    this.drag.style.width = `${rect.width}px`;

    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    document.documentElement.addEventListener('mouseup', this.onMouseUp);
    document.documentElement.addEventListener('mousemove', this.onMouseMove);
  }

  onMouseMove(e) {
    if (!this.drag) return;

    const posX = e.clientX - this.startX;
    const posY = e.clientY - this.startY;
    this.drag.style.left = `${posX}px`;
    this.drag.style.top = `${posY}px`;

    const { target } = e;
    if (target.classList.contains('task_card')) {
      const rect = target.getBoundingClientRect();
      const dropY = e.clientY - rect.top;
      if (dropY > rect.height / 2) {
        target.parentNode.insertBefore(this.placeholder, target.nextSibling);
      } else {
        target.parentNode.insertBefore(this.placeholder, target);
      }
    }
  }

  onMouseUp(e) {
    if (!this.drag) return;

    this.drag.style = undefined;

    const { target } = e;
    let previous = target.previousElementSibling;
    if (previous && !previous.classList.contains('task_card')) {
      previous = null;
    }
    let next = target.nextElementSibling;
    if (next && !next.classList.contains('task_card')) {
      next = null;
    }

    const targetList = target.closest('.task_list');
    let container = targetList;

    if (!targetList) {
      previous = this.previousNeighbour;
      next = this.nextNeighbour;
      container = this.drag.parentNode;
    } else if (targetList && !previous && !next) {
      targetList.append(this.drag);
    }

    if (previous) {
      container.insertBefore(this.drag, previous.nextSibling);
    } else if (next) {
      container.insertBefore(this.drag, next);
    } else {
      container.append(this.drag);
    }

    this.drag.classList.remove('drag');

    if (this.placeholder && this.placeholder.parentNode) {
      this.placeholder.parentNode.removeChild(this.placeholder);
    }

    this.drag = null;
    this.placeholder = null;

    document.documentElement.removeEventListener('mouseup', this.onMouseUp);
    document.documentElement.removeEventListener('mouseover', this.onMouseMove);
  }

  onAddCardClick(e) {
    if (e.button !== 0) return;
    this.addCard();
  }

  addCard(textTask = undefined) {
    const card = document.createElement('div');
    card.classList.add('task_card');

    const tmp = document.createElement('div');
    tmp.classList.add('close_button_container');
    card.append(tmp);

    const closeButton = document.createElement('span');
    closeButton.classList.add('close_button');
    closeButton.innerText = '×';

    closeButton.addEventListener('click', (e) => {
      e.preventDefault();
      card.remove();
    });

    tmp.append(closeButton);

    const cardText = document.createElement('div');
    cardText.classList.add('content_card');
    if (!textTask) {
      cardText.innerText = 'Нажмите карандаш для редактирования';
    } else {
      cardText.setAttribute('contenteditable', 'true');
      cardText.innerText = textTask;
    }

    card.append(cardText);

    const cardTextEdit = document.createElement('div');
    cardTextEdit.classList.add('card_text_edit');
    cardTextEdit.innerHTML = '<svg aria-hidden="true" focusable="false" class="octicon octicon-pencil" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" style="display:inline-block;user-select:none;vertical-align:text-bottom;overflow:visible"><path d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25c.081-.286.235-.547.445-.758l8.61-8.61Zm.176 4.823L9.75 4.81l-6.286 6.287a.253.253 0 0 0-.064.108l-.558 1.953 1.953-.558a.253.253 0 0 0 .108-.064Zm1.238-3.763a.25.25 0 0 0-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 0 0 0-.354Z"></path></svg>';
    card.append(cardTextEdit);

    cardTextEdit.addEventListener('click', () => {
      if (cardText.getAttribute('contenteditable') === null) {
        cardText.textContent = '';
      }
      cardText.setAttribute('contenteditable', 'true');
      cardText.focus();
    });

    this.taskList.append(card);
  }
}
