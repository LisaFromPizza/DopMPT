const registerButton = document.getElementById('registerButton');
registerButton.addEventListener('click', () => {
  window.location.href = '/views/register.html';
});

document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault(); 
  var countError = 0;
  var countErrorAdmin = 0;
  const formData = new FormData(this);
  const data = {
    Email_admin: formData.get('Email_admin'),
    Password_admin: formData.get('Password_admin')
  };

  const dataUser = {
    Email_User: formData.get('Email_admin'),
    Password_User: formData.get('Password_admin')
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data['Email_admin'])) {
    alert('Некорректный адрес электронной почты');
    return;
  }

  // Проверка пароля по заданным ограничениям
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,20}$/;
  if (!passwordRegex.test(data['Password_admin'])) {
    alert('Пароль должен содержать минимум одну заглавную и строчную букву, цифру, специальный символ и быть длиной от 8 до 20 символов');
    return;
  }
  try{
    fetch('http://localhost:3001/login', {
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
        countErrorAdmin = 1;
        throw new Error('Network response was not ok');
      }
      response.status = 200;
      return response.json();
    })
    .then(data => {
      console.log("Ответ сервера:", data);
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('userId', data.id); 
      localStorage.setItem('name', data.name); 
      localStorage.setItem('post', data.post);
      console.log('Tokens сохранены:', data.accessToken, data.refreshToken);
      window.location.href = '/views/allthemes.html';
    })
    .catch(error => {
      console.error('Проблема с извлечением данных:', error); 
    });
  }catch(err){
    console.error('Проблема с извлечением данных:', err); 
    alert('Пользователь не найден или заблокирован');
  }try{
    fetch('http://localhost:3001/loginuser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataUser)
    })
    .then(response => {
      if (!response.ok) {
        console.log(response);
        console.log(data);
        countError = 2;
        throw new Error('Network response was not ok');
      }
      response.status = 200;
      return response.json();
    })
    .then(data => {
      localStorage.setItem('userId', data.id); 
      localStorage.setItem('name', data.name); 
      localStorage.setItem('post', data.post); 
      window.location.href = '/views/allThemes.html';
    })
    .catch(error => {
      console.error('Проблема с извлечением данных:', error); 
      if(countError == 2){
        if(countErrorAdmin == 1){
        alert('Пользователь не найден или заблокирован');
        }
      }
    });
  }catch(err){
    console.error('Проблема с извлечением данных:', err); 
    alert('Пользователь не найден или заблокирован');
  }
});