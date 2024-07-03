window.addEventListener('DOMContentLoaded', async () => {// Функция для вывод меню на всех страницаъ
    const postUser = localStorage.getItem('post');
    const menu = document.querySelector('.aside-left');
    if(postUser == 1){// Для администраторов
        menu.innerHTML = `
        <p>
        <a href="../views/allUsers.html">Пользователи</a>
        <a href="../views/registerAdmin.html">Сотрудники</a>
        <a href="../views/allThemes.html"><span>Все темы</span></a>
        <a href="../views/backup.html"><span>Резервная копия</span></a>
        <a href="../views/statistics.html"><span>Статистика</span></a>
        </p>
        `;
    }else if(postUser == 2 || postUser == 3){// Для преподавателей и студентов
        menu.innerHTML = `
        <p>
        <a href="../views/addTheme.html">Добавить тему</a>
        <a href="../views/allThemes.html"><span>Все темы</span></a>
        <a href="../views/statistics.html"><span>Статистика</span></a>
        </p>
        `;
    }
});