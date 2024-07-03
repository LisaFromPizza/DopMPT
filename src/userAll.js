document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('usersTableBody');
    const userNameInput = document.getElementById('userName');
    document.getElementById('Reason_Block').readOnly = true;
  
    let userData = []; // Сюда будем сохранять исходные данные
  
    // Получение и заполнение таблицы данными
    function fetchAndPopulateTable() {
      fetch('http://localhost:3000/allusers')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          userData = data; // Сохраняем исходные данные
          populateTable(userData); // Заполняем таблицу исходными данными
        })
        .catch(error => {
          console.error('There has been a problem with your fetch operation:', error);
        });
    }
  
    fetchAndPopulateTable();
  
    // Функция для заполнения таблицы данными
    function populateTable(data) {
      tableBody.innerHTML = ''; // Очищаем таблицу перед добавлением данных
      var access;
      var post;
  
      if (data.length === 0) {
        const noDataMessage = document.createElement('tr');
        noDataMessage.innerHTML = `<td colspan="7">Нет данных</td>`;
        tableBody.appendChild(noDataMessage);
        return;
      }
  
      data.forEach(user => {
        const row = document.createElement('tr');
        if(user.Access == '0'){
            access = 'Есть';
        }else{
            access = 'Заблокирован';
        }
        if(user.Post_ID == 2){
          post = 'Преподаватель';
        }else if(user.Post_ID == 3){
          post = 'Студент';
        }
        row.innerHTML = `
          <td>${user.Surname_User}</td>
          <td>${user.Name_User}</td>
          <td>${user.Middle_User || '-'}</td>
          <td>${user.Email_User}</td>
          <td style="word-break: break-word;">⭑⭑⭑⭑⭑⭑⭑⭑⭑⭑</td>
          <td>${post}</td>
          <td>${access}</td>
          <td>${user.Reason_Block || '-'}</td>
          <td><button class="delete-btn" data-id="${user.ID_User}">Заблокировать</button></td>
        `;
        tableBody.appendChild(row);
      });
  
      // Назначаем обработчик события клика для кнопок удаления
      tableBody.addEventListener('click', (event) => {
        const clickedElement = event.target;
        if (clickedElement.classList.contains('delete-btn')) {
          const userId = clickedElement.getAttribute('data-id');
          if(clickedElement.textContent == 'Заблокировать'){
            clickedElement.textContent = 'Подтвердить';
            clickedElement.style.background = '#FFA200';
            const Reason_Block = document.getElementById('Reason_Block');
            document.getElementById('Reason_Block').readOnly = false;
            Reason_Block.addEventListener('input', () => {
              let lengthTitle = Reason_Block.value.length;
              if(lengthTitle > 200){
                  alert('В описание причины блокировки можно ввести только 200 символов!');
                  return;
              }
              document.getElementById('Reason_Block_Count').value = `${0 + lengthTitle}/200`
            });
          }
          else if(clickedElement.textContent == 'Подтвердить'){
            const Reason_Block = document.getElementById('Reason_Block');
            var al = 0;
            if(Reason_Block.value.length < 1){
              if(al == 0){
              alert('Укажите причину блокировки');
              al = 1;
              return;
              }
            }
            deleteUser(userId, Reason_Block.value);
            fetchAndPopulateTable();
            clickedElement.textContent = 'Заблокировать';
          }
        }
      });
    }
  
    // Функция для удаления пользователя
    function deleteUser(userId, Reason_Block) {
      const confirmDelete = confirm('Вы уверены, что хотите заблокировать этого пользователя?');
      
      const requestData = {
        Reason_Block: `${Reason_Block}`
      };

      if (confirmDelete) {
        fetch(`http://localhost:3000/blockuser/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestData)
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(() => {
            fetchAndPopulateTable(); // Обновляем данные после блокировки пользователя
            alert('Пользователь успешно заблокирован');
          })
          .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
          });
      }
    }
  
    // Функция для фильтрации таблицы по ФИО пользователя
    userNameInput.addEventListener('input', () => {
      const searchValue = userNameInput.value.toLowerCase().trim();
  
      const filteredData = userData.filter(user => {
        const fullName = `${user.Surname_User} ${user.Name_User} ${user.Middle_User || ''}`.toLowerCase();
        return fullName.includes(searchValue);
      });
  
      populateTable(filteredData); // Заполняем таблицу отфильтрованными данными
  
      if (filteredData.length === 0) {
        tableBody.innerHTML = ''; // Очищаем таблицу перед добавлением сообщения
        const noResultsMessage = document.createElement('tr');
        noResultsMessage.innerHTML = `<td colspan="6">Не найдено</td>`;
        tableBody.appendChild(noResultsMessage);
      }
    });
  });