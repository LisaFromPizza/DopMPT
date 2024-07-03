async function submitForm(event) {// Регистрация пользователя
    event.preventDefault();
  
    const form = document.getElementById('userForm');
    const formData = new FormData(form);
    const userData = {};
  
    for (let [key, value] of formData.entries()) {
      userData[key] = value;
    }
  
    // Проверка адреса электронной почты
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData['Email_User'])) {
      alert('Некорректный адрес электронной почты');
      return;
    }
  
    // Проверка пароля по заданным ограничениям
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,20}$/;
    if (!passwordRegex.test(userData['Password_User'])) {
      alert('Пароль должен содержать минимум одну заглавную и строчную букву, цифру, специальный символ и быть длиной от 8 до 20 символов');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/registeruser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log(result.message);
        alert('Пользователь успешно добавлен');
        window.location.href = '/views/authorization.html';
  
      } else {
        throw new Error('Ошибка при добавлении пользователя');
      }
    } catch (error) {
      console.error('Произошла ошибка:', error);
      alert('Произошла ошибка при добавлении пользователя');
    }
  }
  // Показ/скрытие пароля
  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('showPasswordButton').addEventListener('click', () => {
      const passwordField = document.getElementById("Password_admin");
      const showPasswordButton = document.getElementById("showPasswordButton");
      
      if (passwordField.type === "password") {
        passwordField.type = "text";
        showPasswordButton.textContent = "Скрыть пароль";
      } else {
        passwordField.type = "password";
        showPasswordButton.textContent = "Показать пароль";
      }
    });
  });