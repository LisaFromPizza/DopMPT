window.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const themeId = params.get('id');
  const themeTitle = params.get('titleTheme');
  const userId = localStorage.getItem('userId');
  const postId = localStorage.getItem('post');

  const themeTitleH = document.getElementById('Title_Theme');
  const themeTypeGet = document.getElementById('TypeTheme_ID');
  const themeDescGet = document.getElementById('Description_Theme');
  const themeTextGet = document.getElementById('Text_Theme');
  const themeAuthorGet = document.getElementById('User_ID');
  const themeFileGetDiv = document.getElementById('files');

  const updateT = document.getElementById('update');
  const deleteT = document.getElementById('delete');

  const { PDFDocument, rgb } = PDFLib;
  // Функция удаления темы
  function deleteTheme(themeId) {
    const confirmDelete = confirm('Тема будет недоступна для просмотра. Вы уверены?');
    const requestData = {
      Access: 1
    };

    if (confirmDelete) {
      fetch(`http://localhost:3000/deletetheme/${themeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
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
        console.error('Ошибка при отправке запроса:', error);
        alert('Ошибка при изменении записи в базе данных');
      });    
    }
  }

  try {// Отображение темы
    console.log(themeId);
    const response = await fetch('http://localhost:3000/allthemes');
    if (!response.ok) {
      throw new Error('Ошибка при получении темы');
    }

    const responseAuthor = await fetch('http://localhost:3000/allusers');
    if (!response.ok) {
      throw new Error('Ошибка при получении данных об авторах');
    }
    const authors = await responseAuthor.json();

    const responseFile = await fetch('http://localhost:3000/files');
    if (!response.ok) {
      throw new Error('Ошибка при получении данных о файлах');
    }
    const files = await responseFile.json();

    const themeInfo = document.createElement('div');
    themeInfo.classList.add('left-section');

    const themeData = await response.json();
    themeData.forEach(element => {
      if(element.ID_Theme === parseInt(themeId)){
        var typeTheme = "";
        var author = "";
        let pathFile = '';
        let titleFile = '';
        var pathFiles = [];
        var titleFiles = [];
        
        if(element.Text_Theme == null){
          element.Text_Theme = '! Текст отсутствует !';
        }

        if(element.TypeTheme_ID === 1){
          typeTheme = "Дисциплина";
        }else if(element.TypeTheme_ID === 2){
          typeTheme = "Вопрос";
        }else{
          typeTheme = "Тема для обсуждения";
        }
        
        authors.forEach(auth => {
          if(auth.ID_User == parseInt(element.User_ID)){
            author = `${auth.Surname_User + ' ' + auth.Name_User}`;
          }
        });

        files.forEach(f => {
          if(f.Theme_ID == parseInt(themeId)){
            pathFiles.push(`${f.Path_Files}`);
            titleFiles.push(`${f.Title_Files}`);
          }else {
            titleFile = "Нет доступных файлов!";
            pathFile = "#";
          }
        });

        console.log(element.Description_Theme);
        themeTitleH.value = `${themeTitle}`;
        themeTypeGet.value = element.TypeTheme_ID;
        themeDescGet.textContent = element.Description_Theme;
        themeTextGet.textContent = element.Text_Theme;
        themeAuthorGet.textContent = author;
        for(let i = 0; i < pathFiles.length; i++){
          const aFile = document.createElement('a');
          aFile.href = `../${pathFiles[i]}`;
          aFile.text = `Название: ${titleFiles[i]}`;
          themeFileGetDiv.appendChild(aFile);
          themeFileGetDiv.appendChild(document.createElement('p'));

          const uploadButton = document.createElement('button');
          uploadButton.classList.add('buttonU');
          uploadButton.textContent = "Скачать"
          themeFileGetDiv.appendChild(uploadButton);
          uploadButton.addEventListener('click', () => {// Сохранение файлов
            downloadFile(pathFiles[i], titleFiles[i]);
          });
          themeFileGetDiv.appendChild(document.createElement('p'));
        }


        deleteT.addEventListener('click', (event) => {
          if(postId == 2 || postId == 3){
            if(element.User_ID != userId){
              alert("Вы не можете удалить эту тему");
              return;
            }
          }
          deleteTheme(themeId);
        });

        updateT.addEventListener('click', (event) => {
          if(postId == 2 || postId == 3){
            if(element.User_ID != userId){
              alert("Вы не можете редактировать эту тему");
              return;
            }
          }
          window.location.href = `themeEdit.html?id=${themeId}&themeTitle=${themeTitle}&TypeTheme_ID=${element.TypeTheme_ID}
          &Description_Theme=${element.Description_Theme}&Text_Theme=${element.Text_Theme}&author=${author}
          &pathFile=${pathFile}&titleFile=${titleFile}`;
        });
        // Функция загрузки файла на компьютер пользователя
        async function downloadFile(path, title) {
          try{
            pdfUrl = `../${path}`,
            pdfAttachmentBytes = await fetch(pdfUrl).then(res => res.arrayBuffer()),
    
            pdfDoc = await PDFDocument.create();
            var page = pdfDoc.addPage();

            const [pdf] = await pdfDoc.embedPdf(pdfAttachmentBytes);    
            page.drawPage(pdf);
            
            await pdfDoc.attach(pdfAttachmentBytes, `../${path}`,
            {
                mimeType: 'application/pdf'
            });

            const pdfBytes = await pdfDoc.save();
        
            download(pdfBytes, `${title}.pdf`, "application/pdf");
            alert('Скачивание начато!');
          }catch(e){
            alert('Ошибка при скачивании файла!');
          }
          }          
      }
    });
  } catch (error) {
    console.error('Ошибка при получении темы:', error);
  }
});