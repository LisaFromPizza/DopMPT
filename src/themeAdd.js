window.addEventListener('DOMContentLoaded', async () => {
  const themeTitle = document.getElementById('Title_Theme');
  const themeDesc = document.getElementById('Description_Theme');
  const themeText = document.getElementById('Text_Theme');
  const themeType = document.getElementById('TypeTheme_ID');
  const addButton = document.getElementById('uploadAllFilesButton');

  themeTitle.addEventListener('input', () => {// Функция для отображения количества вводимых символов в заголовок темы и их проверки
    let lengthTitle = themeTitle.value.length;
    if(lengthTitle > 60){
        alert('В заголовок темы можно ввести только 60 символов!');
        return;
    }
    document.getElementById('outputTheme').textContent = `${0 + lengthTitle}/60`
  });
  themeDesc.addEventListener('input', () => {// Функция для отображения количества вводимых символов в описание темы и их проверки
      let lengthTitle = themeDesc.value.length;
      if(lengthTitle > 200){
          alert('В описание темы можно ввести только 200 символов!');
          return;
      }
      document.getElementById('outputDesc').textContent = `${0 + lengthTitle}/200`
  });

  addButton.addEventListener('click', createTheme);
  // Функция добавления темы в БД
  async function createTheme(){
    const userId = localStorage.getItem('userId');

    const themeTitleReg = /^.{1,60}/;
    if (!themeTitleReg.test(themeTitle.value)) {
      alert('В названии темы должно быть от 1 до 60 символов');
      return;
    }

    const themedescReg = /^.{1,200}/;
    if (!themedescReg.test(themeDesc.value)) {
      alert('В описании темы должно быть от 1 до 200 символов');
      return;
    }

    themeData = {
      Title_Theme: themeTitle.value,
      Description_Theme: themeDesc.value,
      Text_Theme: themeText.value,
      TypeTheme_ID: themeType.value,
      User_ID: userId,
      Access: '0'
    };
    try {
        const response = await fetch('http://localhost:3000/createtheme', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(themeData)
        });
    
        if (response.ok) {
          const result = await response.json();
          console.log(result.message);
          alert('Тема успешно добавлена');
    
        } else {
          throw new Error('Ошибка при добавлении темы');
        }
    } catch (error) {
      console.error('Произошла ошибка:', error);
      alert('Произошла ошибка при добавлении темы');
    }
  }
});