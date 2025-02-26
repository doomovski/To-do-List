document.addEventListener('DOMContentLoaded', function() {
    const buttonsContainer = document.querySelector('.nav-buttons');
    let buttons = document.querySelectorAll('.nav-buttons .button, .nav-buttons .button-create');
    const taskList = document.querySelector('.task-list');
    const searchBar = document.querySelector('.search-bar');
    const taskInput = searchBar.querySelector('.add-task');
    const addTaskButton = searchBar.querySelector('.button-do');
    const trashIcon = searchBar.querySelector('span');
    
    let activeGroup = 'today';
    const tasksByGroup = {
        'today': [],
        'tomorrow': []
    };

    // Функция обновления слушателей кнопок
    function updateButtonListeners() {
        buttons = document.querySelectorAll('.nav-buttons .button, .nav-buttons .button-create');
        buttons.forEach(button => {
            button.removeEventListener('click', handleButtonClick);
            button.addEventListener('click', handleButtonClick);
        });
    }

    // Обработчик клика по кнопкам
    function handleButtonClick() {
        buttons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');

        const groupName = this.getAttribute('data-group');
        if (groupName) {
            activeGroup = groupName;
            renderTasks();
        }
    }

    // Отрисовка задач текущей группы с анимацией
    function renderTasks() {
        const tasks = tasksByGroup[activeGroup] || [];
        const taskItems = taskList.querySelectorAll('.task-item');
        taskItems.forEach(item => item.remove());

        tasks.forEach(task => {
            const taskItem = document.createElement('div');
            taskItem.className = 'task-item';
            taskItem.innerHTML = `
                <input class="check-box" type="checkbox" ${task.completed ? 'checked' : ''}>
                <span class="task-text" style="text-decoration: ${task.completed ? 'line-through' : 'none'}; opacity: ${task.completed ? '0.5' : '1'}">${task.text}</span>
                <div class="verticalLine-item">/</div>
                <div class="task-icons">
                    <span class="icon" onclick="editTask(this)">⚙️</span>
                    <span class="icon" onclick="deleteTask(this)">🗑️</span>
                </div>
            `;
            taskList.appendChild(taskItem);
            // Применяем анимацию к каждому новому элементу
            taskItem.style.animation = 'slideUp 0.3s ease-out forwards';
        });
    }

    // Создание новой группы
    document.querySelector('.button-create').addEventListener('click', function() {
        const newGroupName = prompt('Введите название новой группы:');
        if (!newGroupName || newGroupName.trim() === '') return;

        const groupId = newGroupName.toLowerCase().replace(/\s+/g, '-');
        if (tasksByGroup[groupId]) {
            alert('Группа с таким названием уже существует!');
            return;
        }

        // Создаем новую кнопку
        const newButton = document.createElement('div');
        newButton.className = 'button';
        newButton.textContent = newGroupName;
        newButton.setAttribute('data-group', groupId);
        buttonsContainer.insertBefore(newButton, this);

        // Инициализируем пустой массив задач для новой группы
        tasksByGroup[groupId] = [];

        // Активируем новую группу
        buttons.forEach(btn => btn.classList.remove('active'));
        newButton.classList.add('active');
        activeGroup = groupId;
        renderTasks();

        updateButtonListeners();
    });

    // Инициализация
    buttons.forEach(button => button.addEventListener('click', handleButtonClick));
    if (buttons.length > 0) {
        buttons[0].classList.add('active');
        buttons[0].setAttribute('data-group', 'today');
        buttons[1].setAttribute('data-group', 'tomorrow');
        renderTasks();
    }

    // Добавление задачи с анимацией
    function addTask(text) {
        if (!text || text.trim() === '') return;

        if (!tasksByGroup[activeGroup]) tasksByGroup[activeGroup] = [];
        tasksByGroup[activeGroup].unshift({ text, completed: false });

        renderTasks();
        
        // Находим последний добавленный .task-item для анимации
        const taskItems = taskList.querySelectorAll('.task-item');
        const lastTaskItem = taskItems[taskItems.length - 1];
        if (lastTaskItem) {
            lastTaskItem.style.animation = 'slideUp 0.3s ease-out forwards';
        }

        taskInput.value = '';
    }

    addTaskButton.addEventListener('click', () => addTask(taskInput.value.trim()));
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask(taskInput.value.trim());
    });

    // Удаление задачи с анимацией
    window.deleteTask = function (icon) {
        const taskItem = icon.closest('.task-item');
        const taskText = taskItem.querySelector('.task-text').textContent;
    
        // Добавляем класс анимации удаления
        taskItem.classList.add('removing');
    
        // Ждем окончания анимации, затем удаляем элемент из DOM
        setTimeout(() => {
            taskItem.remove(); // Удаляем элемент
            tasksByGroup[activeGroup] = tasksByGroup[activeGroup].filter(task => task.text !== taskText);
            renderTasks();
        }, 300); // 0.3s — длительность анимации
    };
    

    // Редактирование задачи
    window.editTask = function(icon) {
        const taskItem = icon.closest('.task-item');
        const taskText = taskItem.querySelector('.task-text');
        const currentText = taskText.textContent;

        const input = document.createElement('input');
        input.value = currentText;
        input.className = 'edit-input';
        input.style.cssText = 'width: 200px; border-radius: 5px; padding: 5px; background: rgba(255, 255, 255, 0.1); color: white;';

        taskText.replaceWith(input);
        input.focus();

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && input.value.trim()) {
                const newText = input.value.trim();
                const taskIndex = tasksByGroup[activeGroup].findIndex(task => task.text === currentText);
                if (taskIndex !== -1) {
                    tasksByGroup[activeGroup][taskIndex].text = newText;
                    renderTasks();
                }
            }
        });

        input.addEventListener('blur', () => {
            const newText = input.value.trim();
            if (newText) {
                const taskIndex = tasksByGroup[activeGroup].findIndex(task => task.text === currentText);
                if (taskIndex !== -1) {
                    tasksByGroup[activeGroup][taskIndex].text = newText;
                    renderTasks();
                }
            } else {
                renderTasks();
            }
        });
    };

    // Очистка списка текущей группы
    trashIcon.addEventListener('click', () => {
        tasksByGroup[activeGroup] = [];
        renderTasks();
    });

    // Обработчик checkbox
    taskList.addEventListener('change', (e) => {
        if (e.target.className === 'check-box') {
            const taskItem = e.target.closest('.task-item');
            const taskText = taskItem.querySelector('.task-text').textContent;
            const taskIndex = tasksByGroup[activeGroup].findIndex(task => task.text === taskText);
            if (taskIndex !== -1) {
                tasksByGroup[activeGroup][taskIndex].completed = e.target.checked;
                renderTasks();
            }
        }
    });

    // Дата и время
    function padZero(num) {
        return num.toString().padStart(2, '0');
    }

    function getFormattedDate() {
        const now = new Date();
        const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
        const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
        return `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]}`;
    }

    function getFormattedTime() {
        const now = new Date();
        return `${padZero(now.getHours())}:${padZero(now.getMinutes())}:${padZero(now.getSeconds())}`;
    }

    function updateDateTime() {
        const date2Element = document.querySelector('.date2');
        const timeElement = document.querySelector('.time');
        if (date2Element && timeElement) {
            date2Element.textContent = getFormattedDate();
            timeElement.textContent = getFormattedTime();
        }
    }

    updateDateTime();
    setInterval(updateDateTime, 1000);

});