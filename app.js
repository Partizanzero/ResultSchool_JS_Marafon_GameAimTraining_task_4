/*  Игра AIM Training Game с 3-мя экранами! 
- научимся работать с большим потоком данных, 
- правильно декомпозировать проект,
- работать с таймерами,
- узнаем, как случайным образом выбирать позицию и размер элементов языка JS.
*/

/* ---- ПЕРЕМЕННЫЕ ----  */

//получаем ноду ссылки "Начать игру"
const startBtn = document.querySelector("#start");
//получаем ноды всех экранов
const screens = document.querySelectorAll(".screen");
//получаем ноду блока ul с кнопками выбора времени
const timeList = document.querySelector("#time-list");
//получаем ноду c отсчетом времени
const timeEl = document.querySelector("#time");
//получаем ноду игровой доски(поля)
const board = document.querySelector("#board");
//счетчик времени
let time = 0;
//счетчик очков игры
let score = 0;
//массив цветов, которые могут быть назначены кружкам
const colors = [
  "#89F800",
  "#00E4B1",
  "#FFF700",
  "#F40063",
  "#529600",
  "#00896B",
  "#9A9500",
  "#93003B",
];

/* ---- ОБРАБОТЧИКИ СОБЫТИЙ ----  */

/* вешаем обработчик событий на ссылку "Начать игру" */
startBtn.addEventListener("click", (event) => {
  //отменяем дефолтные обработчики браузера
  event.preventDefault();
  //добавляем первому экрану класс up (элемент с навешанным классом up -"улетает" наверх)
  screens[0].classList.add("up");
});

/* вешаем обработчик событий на блок с кнопками выбора времени (делегирование событий) */
timeList.addEventListener("click", (event) => {
  //event.target – это исходный элемент, на котором произошло событие, в процессе всплытия он неизменен.
  //если у элемента, по которому мы кликнули, есть класс time-btn (т.е. это кнопка выбора времени)
  //то получаем через data атрибут кол-во времени у кнопки, переводим этот атрибут в число и присваиваем его счетчику времени
  // getAttribute - позволяет получить значение заданного атрибута у тега
  if (event.target.classList.contains("time-btn")) {
    time = parseInt(event.target.getAttribute("data-time"));
    screens[1].classList.add("up");
    startGame();
  }
});

/* вешаем обработчик на клик по игровому полю */
board.addEventListener("click", (event) => {
  //если клик был по кружочку, то увеличиваем счет очков игры,
  //затем удаляем этот кружок и создаем новый на рандомном месте игрового поля
  if (event.target.classList.contains("circle")) {
    score++;
    event.target.remove();
    createRandomCircle();
  }
});

/* ---- ФУНКЦИИ ----  */
/* Ф-я запуска игры*/
function startGame() {
  //запускаем ф-ю таймера каждую секунду, чтобы шел отсчет времени
  //setInterval - ставит ф-ю в !!!очередь на исполнение!!!
  setInterval(decreaseTime, 1000);
  //выводим кружок
  createRandomCircle();
  //выводим в HTML текущее значение времени
  setTime(time);
}

/* Ф-я реализации таймера 
если таймер = 0, то завершаем игру, иначе - играем
*/
function decreaseTime() {
  if (time === 0) {
    finishGame();
  } else {
    //уменьшаем текущий счетчик времени на 1
    let current = --time;
    //для секнд меньше 10-ти добавляем ноль перед цифрой для красоты
    if (current < 10) {
      current = `0${current}`;
    }
    //выводим в HTML полученное значение времени
    setTime(current);
  }
}

/* ф-я подставления в ноду c отсчетом времени, полученного из кликнутой кнопки времени */
function setTime(value) {
  timeEl.innerHTML = `00:${value}`;
}

/* ф-я добавления рандомных кружков в игровое поле*/
function createRandomCircle() {
  //создаем div для кружка
  const circle = document.createElement("div");

  //получаем рандомные размеры кружка в заданном диапазоне значений от 10 до 60px
  const size = getRundomNumber(10, 60);

  //получаем размеры игрового поля, чтобы кружок не вышел за его пределы ({ width, height } - деструктуризация)
  //деструктуризация в ES6 - позволяет извлечь из объекта отдельные значения в переменные или константы
  //getBoundingClientRect() - возвращает объект DOMRect, который содержит размеры элемента и его положение относительно видимой области просмотра
  const { width, height } = board.getBoundingClientRect();

  //вписываем наш кружок в размеры игрового поля
  const x = getRundomNumber(0, width - size);
  const y = getRundomNumber(0, height - size);

  //создаем div с кружком класс "circle"
  circle.classList.add("circle");
  //задаем размеры кружка
  circle.style.width = `${size}px`;
  circle.style.height = `${size}px`;
  //у кружка в css задан position: absolute, зададим ему смещение по top и left
  circle.style.top = `${y}px`;
  circle.style.left = `${x}px;`;

  setColor(circle);

  //добавляем кружок на игровое поле
  board.append(circle);
}

/* Ф-я получения рандомных размеров кружка */
function getRundomNumber(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

/* Ф-я получения рандомного цвета кружка */
function getRandomColor() {
  //получаем случайный индекс для элемента из массива цветов
  //Math.random() - генерирует псевдослучайное число от 0 до 1 (не включительно).
  //округляем, чтобы получить целое число (случайный индекс для элемента): floor() — округление в меньшую сторону
  //возвращаем элемент со сгенерированным динамически индексом (случайный цвет)
  return colors[Math.floor(Math.random() * colors.length)];
}

/* Ф-я установки цвета крукжа */
function setColor(element) {
  //получаем случайный цвет для кружка
  const color = getRandomColor();
  //назначаем этот случайный цвет кружку через стиль.
  //cв-во «backgroundColor» используется для возврата цвета указанного элемента.
  element.style.backgroundColor = color;
}

/* Ф-я завершения игры*/
function finishGame() {
  //удаляем заголовок с отображением времени
  //parentNode - полностью удалит родительский элемент <h3>, а не только span с отображением времени
  timeEl.parentNode.classList.add("hide");
  //выводим на игровое поле сообщение о счете игры
  board.innerHTML = `<h1>Cчет: <span class="primary">${score}</span></h1>`;
}
