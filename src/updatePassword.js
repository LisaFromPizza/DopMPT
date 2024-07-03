window.addEventListener('DOMContentLoaded', async () => {
    const id = localStorage.getItem('userId');
    const postId = localStorage.getItem('post');
    console.log(id);

    const Password_admin = document.getElementById('Password_admin');
    const Password_admin_Confirm = document.getElementById('Password_admin_Confirm');

    const showPasswordButton = document.getElementById('showPasswordButton');
    const showConfirmPasswordButton = document.getElementById('showConfirmPasswordButton');
    const saveButton = document.getElementById('saveButton');

    showPasswordButton.addEventListener('click', () => {// Показ/скрытие пароля
        const passwordField = document.getElementById("Password_admin");
        
        if (passwordField.type === "password") {
          passwordField.type = "text";
          showPasswordButton.textContent = "Скрыть пароль";
        } else {
          passwordField.type = "password";
          showPasswordButton.textContent = "Показать пароль";
        }
    });

    showConfirmPasswordButton.addEventListener('click', () => {// Показ/скрытие подтверждающего пароля
        const passwordField = document.getElementById("Password_admin_Confirm");
        
        if (passwordField.type === "password") {
          passwordField.type = "text";
          showConfirmPasswordButton.textContent = "Скрыть пароль";
        } else {
          passwordField.type = "password";
          showConfirmPasswordButton.textContent = "Показать пароль";
        }
    });

    saveButton.addEventListener('click', () => {// Сохранение нового пароля
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,20}$/;
      if (!passwordRegex.test(Password_admin.value)) {
        alert('Пароль должен содержать минимум одну заглавную и строчную букву, цифру, специальный символ и быть длиной от 8 до 20 символов');
        return;
      }
      if(Password_admin.value != Password_admin_Confirm.value){
        alert('Пароли не совпадают');
        return;
      }

      if(postId == 1){// Для администраторов
        const data = {
          ID_Administrator: id,
          Password_admin: Password_admin.value
        };
      
        fetch('http://localhost:3001/updatepassword', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
        .then(response => {
          if (!response.ok) {
            console.log(response);
            console.log(data);
            throw new Error('Network response was not ok');
          }
          response.status = 200;
          return response.json();
        })
        .then(data => {
          window.location.href = 'profile.html';
        })
        .catch(error => {
          alert('Пользователь не найден');
          console.error('Проблема с извлечением данных:', error); 
        });  
      }else{// Для преподавателей/студентов
        const confirmDelete = confirm('Вы уверены, что хотите изменить пароль?');
        const requestData = {
          Password_User: Password_admin.value
        };
        if (confirmDelete) {
          fetch(`http://localhost:3000/updateuserpassword/${id}`, {
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
              alert('Пароль успешно изменен');
              window.location.href = 'profile.html';
            })
            .catch(error => {
              console.error('There has been a problem with your fetch operation:', error);
            });
        }
      }
    });
});