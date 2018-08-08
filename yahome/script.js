// after load DOM start listen click events
document.addEventListener('DOMContentLoaded', ()=>{
  console.log('loaded');
  // listen on cards click
  [...document.querySelectorAll('.card')].forEach(card=>{
    card.addEventListener('click', openModal);
  });
  // listen on nav link click
  [...document.querySelectorAll('.nav__item')].forEach(item=>{
    item.addEventListener('click', navMenuClickHandler);
  });
  // listen on favorites menu click
  let devicesMenu = document.querySelector('.devices__favorites-menu');
  devicesMenu.addEventListener('click', devicesMenuClickHandler);
});

// open modal popup function
function openModal(event) {
  let card = event.target.closest('.card');
  let modal = document.getElementById('modal-window');
  let main = document.getElementById('main-window');
  let name = this.querySelector('.card__name span').textContent;
  let message = this.querySelector('.card__text span').textContent;
  let image = modal.querySelector('.modal__image');
  let imagePath = this.querySelector('.card__icon img').getAttribute('src');
  let modes = modal.querySelector('.modal__modes');

  // set modal name and message
  modal.querySelector('.modal__name span').textContent = name.length > 30 ? name.slice(0, 29) + '...' : name;
  modal.querySelector('.modal__message span').textContent = message;

  // check type by class of cards
  let type = 'unknown';
  if (card.classList.contains('light')) type = 'light';
  else if (card.classList.contains('temperature')) type = 'temp';
  else if (card.classList.contains('floor')) type = 'floor';

  // change widget icon
  image.setAttribute('src', `${imagePath.slice(0, imagePath.indexOf('@'))}@2x.png`);

  // change mode list
  if (type === 'light') changeList(modes, 'Вручную_Дневной Свет_Холодный Свет_Рассвет');
  if (type === 'temp') changeList(modes, 'Вручную_Холодно_Тепло_Жарко');

  // add blur class to main
  main.classList.add('blur');

  // open modal and set modal type (to change css of control)
  modal.className = 'modal modal_active';
  modal.classList.add(`modal_${type}`);
  let control = modal.querySelector('.modal__control-nav');

  // add events listeners to contol
  control.addEventListener('input', controlMoveHandler);
  control.addEventListener('touchmove', controlMoveHandler);

  // add close events listeners to backdrop and 2 buttons
  modal.addEventListener('click', closeModal);
  modal.querySelector('.modal__button-done').addEventListener('click', closeModal);
  modal.querySelector('.modal__button-cancel').addEventListener('click', closeModal);
}

// close popup funcion
function closeModal(event) {
  let modal = document.getElementById('modal-window');

  // check that click on buttons or backdrop
  if (event.target !== modal && !event.target.classList.contains('modal__button') && !event.target.parentNode.classList.contains('modal__button')) return;

  // remove blur from main content
  let main = document.getElementById('main-window');
  main.classList.remove('blur');

  // close modal removing modal-active class
  modal.className = 'modal';
}

// function to select clicked navigation menu item
function navMenuClickHandler(event) {
  document.querySelectorAll('.nav__item').forEach(el=>{ el.classList.remove('nav__item-active'); });
  event.target.classList.add('nav__item-active');
}

// function to select mode menu in favorites
function devicesMenuClickHandler(event) {
  let width = document.documentElement.clientWidth;
  if (width < 1300) {
    this.classList.toggle('favorites__menu-toggle');
  }
  this.parentNode.querySelectorAll('.favorites__menu-item').forEach(el=>{ el.classList.remove('favorites__menu-item_active'); });
  event.target.classList.add('favorites__menu-item_active');
}


// function to change control on modal window
function controlMoveHandler(event) {
  let modal = document.getElementById('modal-window');
  let floor = modal.classList.contains('modal_floor');

  // if floor, change data on cotrol, else in widget
  let text = floor ? modal.querySelector('.modal__control-data') : modal.querySelector('.modal__widget .widget__text');
  let value = parseFloat(event.target.value);
  let node = event.target;

  // if floor move control in a circle
  if (floor) {
    node.style.backgroundPositionX = 80 - 80 * Math.cos(Math.PI * (value - 10) / 27 + Math.PI / 2) + 'px';
    node.style.backgroundPositionY = 80 - 80 * Math.sin(Math.PI * (value - 10) / 27 + Math.PI / 2) + 'px';
  }
  text.textContent = value > 0 ? '+' + value : value;
}

function changeList(node, list) {
  // empty node
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }

  // add items to list
  list.split('_').forEach((el, ind)=>{
    let child = document.createElement('li');
    child.className = `text text_bold text_bold_small modal__mode ${ind === 0 ? 'modal__mode-active' : ''}`;
    child.textContent = el;
    node.appendChild(child);
  });
}
