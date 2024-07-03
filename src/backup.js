const backupButton = document.getElementById('backupButton');
const Hours = document.getElementById('Hours');
const Minutes = document.getElementById('Minutes');
// Добавление кнопки события для создания бэкапа базы данных
backupButton.addEventListener('click', () => {   
    userData = {
      Hours: Hours.value,
      Minutes: Minutes.value
    }
    try {
      const response = fetch('http://localhost:3000/downloadBackup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
        alert('Время сохранено');
    } catch (error) {
      console.error('Произошла ошибка:', error);
    }
});