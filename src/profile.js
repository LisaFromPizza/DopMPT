window.addEventListener('DOMContentLoaded', async () => {
    const id = localStorage.getItem('userId');
    const postUserLocal = localStorage.getItem('post');

    const surnameUser = document.getElementById('Surname_admin');
    const nameUser = document.getElementById('Name_admin');
    const middleNameUser = document.getElementById('Middle_admin');
    const passwordUser = document.getElementById('Password_admin');
    const emailUser = document.getElementById('Email_admin');
    const postUser = document.getElementById('Post_ID');

    const saveButton = document.getElementById('saveButton');
    const deleteButton = document.getElementById('delete');
    const logoutButton = document.getElementById('logout');
    const updatePasswordButton = document.getElementById('updatePassword');

    updatePasswordButton.addEventListener('click', () => {// Метод переадресации на страницу изменения пароля
        window.location.href = `updatepassword.html`;
    });
    // Метод изменения профиля
    saveButton.addEventListener('click', () => {
        var userData = {};
        // Проверка корректности фамилии
        const surnameUser_Reg = /^.{1,30}/;
        if (!surnameUser_Reg.test(surnameUser.value)) {
          alert('В фамилии должно быть от 1 до 30 символов');
          return;
        }
        // Проверка корректности имения
        const nameUser_Reg = /^.{1,30}/;
        if (!nameUser_Reg.test(nameUser.value)) {
          alert('В имени должно быть от 1 до 30 символов');
          return;
        }
        // Проверка корректности почты
        const emailUser_Reg = /^.{1,50}/;
        if (!emailUser_Reg.test(emailUser.value)) {
          alert('В почте должно быть от 1 до 50 символов');
          return;
        }
        // Проверка корректности почты
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailUser.value)) {
          alert('Некорректный адрес электронной почты');
          return;
        }

          if(postUserLocal == 1){// Для администратора
            const confirmPostAdmin = confirm('Если вы измените роль, то не сможете поменять ее обратно. Для этого надо будет обратиться по почте в разделе помощь. Вы уверены?');
            const confirmUpdate = confirm('Данные будут изменены. Вы уверены?');
            if(postUser.value == 2 || postUser.value == 3){
              if(!confirmPostAdmin){
                return;
              }
            }
            userData = {
              Surname_admin: surnameUser.value,
              Name_admin: nameUser.value,
              Middle_admin: middleNameUser.value,
              Email_admin: emailUser.value,
              Post_ID: postUser.value
            };

            if (confirmUpdate) {
              fetch(`http://localhost:3000/updateuser/${id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
              })
              .then(response => {
                if (!response.ok) {
                  throw new Error('Ошибка при изменении записи в базе данных');
                }
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                  return response.json(); // Если ответ JSON, парсим его
                } else {
                  return response.text(); // Если не JSON, возвращаем как текст
                }
              })
              .then(data => {
                if (typeof data === 'object') {
                  const returnBack = confirm('Запись успешно изменена. Желаете вернуться назад?');
                  if (returnBack) {
                    window.history.back();
                  }
                } else {
                  console.log('Текстовый ответ:', data);
                  const returnBack = confirm('Запись успешно изменена. Желаете вернуться назад?');
                  if (returnBack) {
                    window.history.back();
                  }
                }
              })
              .catch(error => {
                  console.log(error);
                console.error('Ошибка при отправке запроса:', error);
                alert('Ошибка при изменении записи в базе данных');
              });    
            }
          }else if(postUserLocal == 2 || postUserLocal == 3){// Для преподавателя и студента
            if(postUser.value == 1){
              alert('У вас нет доступа для смены роли на "Администртор');
              return;
            }
            if(postUserLocal == 2){
              if(postUser.value == 3){
                const confirmTeacher = confirm('При смене роли на "Студент", вы сможете добавлять в темы только Вопросы. Вы уверены?');
                if(!confirmTeacher){
                  return;
                }
              }
            }
            userData = {
              Surname_User: surnameUser.value,
              Name_User: nameUser.value,
              Middle_User: middleNameUser.value,
              Email_User: emailUser.value,
              Post_ID: postUser.value
            };
          
            const confirmUpdate = confirm('Данные будут изменены. Вы уверены?');
        
              if (confirmUpdate) {
                fetch(`http://localhost:3000/updateuserprofile/${id}`, {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(userData)
                })
                .then(response => {
                  if (!response.ok) {
                    throw new Error('Ошибка при изменении записи в базе данных');
                  }
                  const contentType = response.headers.get('content-type');
                  if (contentType && contentType.includes('application/json')) {
                    return response.json(); // Если ответ JSON, парсим его
                  } else {
                    return response.text(); // Если не JSON, возвращаем как текст
                  }
                })
                .then(data => {
                  if (typeof data === 'object') {
                    const returnBack = confirm('Запись успешно изменена. Желаете вернуться назад?');
                    if (returnBack) {
                      window.history.back();
                    }
                  } else {
                    console.log('Текстовый ответ:', data);
                    const returnBack = confirm('Запись успешно изменена. Желаете вернуться назад?');
                    if (returnBack) {
                      window.history.back();
                    }
                  }
                })
                .catch(error => {
                    console.log(error);
                  console.error('Ошибка при отправке запроса:', error);
                  alert('Ошибка при изменении записи в базе данных');
                });    
              }
          }
    });

    logoutButton.addEventListener('click', () => {// Выход
        window.location = "../views/authorization.html";
    });

    deleteButton.addEventListener('click', () => {// Удаление профиля
        const confirmDelete = confirm('Вы уверены, что хотите удалить профиль?');

        if(postUserLocal == 1){// Для администратора
          if (confirmDelete) {
            fetch(`http://localhost:3000/userPosts/${id}`, {
              method: 'DELETE'
            })
              .then(response => {
                if (!response.ok) {
                  throw new Error('Network response was not ok');
                }
                return response.json();
              })
              .then(() => {
                alert('Пользователь успешно удален');
                window.location = "../views/authorization.html";
              })
              .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
              });
          }
        }else if(postUserLocal == 2 || postUserLocal == 3){// Для преподаввателя и студента
          const requestData = {
            Reason_Block: `Блокировка пользователем`
          };
          if (confirmDelete) {
            fetch(`http://localhost:3000/blockuser/${id}`, {
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
    });
    if(postUserLocal == 1){// Вывод данных администратора
      fetch(`http://localhost:3000/admin/${id}`)
      .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(userData => {
          console.log('Данные пользователя:', userData);
          surnameUser.value = userData.Surname_admin;
          nameUser.value = `${userData.Name_admin}`;
          middleNameUser.value = `${userData.Middle_admin}`;
          passwordUser.value = `${userData.Password_admin}`;
          emailUser.value = ` ${userData.Email_admin}`;
          postUser.value = `${userData.Post_ID}`;
        })
        .catch(error => {
          console.error('Проблема с получением данных пользователя:', error);
        });
        saveButton.addEventListener('click', () => {
          console.log(surnameUser.value);
        });
    }else if(postUserLocal == 2 || postUserLocal == 3){// Вывод данных преподавателей и студентов
      fetch(`http://localhost:3000/user/${id}`)
      .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(userData => {
          console.log('Данные пользователя:', userData);
          surnameUser.value = userData.Surname_User;
          nameUser.value = `${userData.Name_User}`;
          middleNameUser.value = `${userData.Middle_User}`;
          passwordUser.value = `${userData.Password_User}`;
          emailUser.value = `${userData.Email_User}`;
          postUser.value = userData.Post_ID;
          localStorage.setItem('post', userData.Post_ID);
        })
        .catch(error => {
          console.error('Проблема с получением данных пользователя:', error);
        });
    }
});