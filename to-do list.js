// Получаем необходимые элементы
const searchBar = document.querySelector('.search-bar');
const taskInput = searchBar.querySelector('.add-task');
const addTaskButton = searchBar.querySelector('.button-do');
const taskList = document.querySelector('.task-list');
const trashIcon = searchBar.querySelector('span'); // Иконка 🗑️ для очистки списка

// Функция добавления новой задачи
function addTask(text) {
    if (!text || text.trim() === '') return; // Проверяем, не пустой ли текст

    // Создаём новый элемент задачи
    const taskItem = document.createElement('div');
    taskItem.className = 'task-item';

    // HTML для новой задачи, включая ваш дизайн с вертикальной линией
    taskItem.innerHTML = `
        <input class="check-box" type="checkbox">
        <span class="task-text">${text}</span>
        <div class="verticalLine-item">/</div>
        <div class="task-icons">
            <span class="icon" onclick="editTask(this)">⚙️</span>
            <span class="icon" onclick="deleteTask(this)">🗑️</span>
        </div>
    `;

    // Добавляем задачу в список после search-bar
    taskList.insertBefore(taskItem, taskList.querySelector('.task-item') || null);

    // Очищаем поле ввода
    taskInput.value = '';
}

// Обработчик клика по кнопке "Создать новое дело"
addTaskButton.addEventListener('click', () => {
    const taskText = taskInput.value.trim();
    addTask(taskText);
});

// Обработчик нажатия Enter в поле ввода
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const taskText = taskInput.value.trim();
        addTask(taskText);
    }
});

// Функция удаления задачи (для иконки 🗑️ в .task-item)
function deleteTask(icon) {
    const taskItem = icon.closest('.task-item');
    if (taskItem) {
        taskItem.remove();
    }
}

// Функция редактирования задачи (для иконки ⚙️)
function editTask(icon) {
    const taskItem = icon.closest('.task-item');
    const taskText = taskItem.querySelector('.task-text');
    const currentText = taskText.textContent;

    // Создаём поле ввода для редактирования
    const input = document.createElement('input');
    input.value = currentText;
    input.className = 'edit-input';
    input.style.width = '200px'; // Примерная ширина для ввода
    input.style.borderRadius = '5px';
    input.style.padding = '5px';
    input.style.background = 'rgba(255, 255, 255, 0.1)'; // Соответствует вашему дизайну
    input.style.color = 'white'; // Белый текст для контраста

    // Заменяем текст на поле ввода
    taskText.replaceWith(input);

    // Фокус на поле ввода
    input.focus();

    // Обработчик нажатия Enter для сохранения изменений
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const newText = input.value.trim();
            if (newText) {
                const newSpan = document.createElement('span');
                newSpan.className = 'task-text';
                newSpan.textContent = newText;
                input.replaceWith(newSpan);
            }
        }
    });

    // Обработчик потери фокуса (если пользователь кликает вне поля)
    input.addEventListener('blur', () => {
        const newText = input.value.trim();
        if (newText) {
            const newSpan = document.createElement('span');
            newSpan.className = 'task-text';
            newSpan.textContent = newText;
            input.replaceWith(newSpan);
        } else {
            input.replaceWith(taskText); // Восстанавливаем оригинальный текст, если поле пустое
        }
    });
}

// Функция очистки всего списка задач (по клику на иконку 🗑️ в search-bar)
trashIcon.addEventListener('click', () => {
    const taskItems = taskList.querySelectorAll('.task-item');
    taskItems.forEach(item => item.remove());
});

// Обработчик изменения состояния checkbox (отметка задачи как выполненной/невыполненной)
taskList.addEventListener('change', (e) => {
    if (e.target.className === 'check-box') {
        const taskItem = e.target.closest('.task-item');
        const taskText = taskItem.querySelector('.task-text');
        if (e.target.checked) {
            taskText.style.textDecoration = 'line-through'; // Зачёркиваем текст
            taskText.style.opacity = '0.5'; // Снижаем непрозрачность
        } else {
            taskText.style.textDecoration = 'none'; // Убираем зачёркивание
            taskText.style.opacity = '1'; // Восстанавливаем непрозрачность
        }
    }
});

    // Функция для форматирования времени с ведущими нулями (например, 09:15:00)
    function padZero(num) {
        return num.toString().padStart(2, '0');
    }

    // Функция для получения дня недели и даты на русском
    function getFormattedDate() {
        const now = new Date();
        const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
        const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
        
        const dayOfWeek = days[now.getDay()];
        const day = now.getDate();
        const month = months[now.getMonth()];
        const year = now.getFullYear();

        return `${dayOfWeek}, ${day} ${month}`;
    }

    // Функция для получения текущего времени в формате ЧЧ:ММ:СС
    function getFormattedTime() {
        const now = new Date();
        const hours = padZero(now.getHours());
        const minutes = padZero(now.getMinutes());
        const seconds = padZero(now.getSeconds());
        return `${hours}:${minutes}:${seconds}`;
    }

    // Функция обновления даты и времени
    function updateDateTime() {
        const date2Element = document.querySelector('.date2');
        const timeElement = document.querySelector('.time');

        if (date2Element && timeElement) {
            date2Element.textContent = getFormattedDate();
            timeElement.textContent = getFormattedTime();
        }
    }

    // Обновляем дату и время сразу при загрузке страницы
    updateDateTime();

    // Обновляем каждую секунду (1000 мс)
    setInterval(updateDateTime, 1000);
