window.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const themeId = params.get('id');
  const themeTitle = params.get('themeTitle');

  const themeTitleH = document.getElementById('Title_Theme');
  const themeTypeGet = document.getElementById('TypeTheme_ID');
  const themeDescGet = document.getElementById('Description_Theme');
  const themeTextGet = document.getElementById('Text_Theme');
  const themeAuthorGet = document.getElementById('User_ID');
  const themeFileGet = document.getElementById('Path_Files');

  const updateT = document.getElementById('update');
  const uploadT = document.getElementById('upload');
  const deleteT = document.getElementById('delete');

  const { PDFDocument, rgb } = PDFLib;

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
  
  try {
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

        themeTitleH.value = `${themeTitle}`;
        themeTypeGet.value = element.TypeTheme_ID;
        themeDescGet.textContent = element.Description_Theme;
        themeTextGet.textContent = element.Text_Theme;
        themeAuthorGet.textContent = author;
        if(pathFile == "#"){
          themeFileGet.href = '#';
        }else{
          themeFileGet.href = "../" + pathFile;
        }
        themeFileGet.textContent = "Название: " + titleFile;

        deleteT.addEventListener('click', (event) => {
          deleteTheme(themeId);
        });
        uploadT.addEventListener('click', (event) => {
          downloadFile();
        });
        updateT.addEventListener('click', () => {
          console.log(themeId);
          var userData = {};
        
          const Title_ThemeReg = /^.{1,60}/;
          if (!Title_ThemeReg.test(themeTitleH.value)) {
            alert('В заголовке темы должно быть от 1 до 60 символов');
            return;
          }

          const Desc_ThemeReg = /^.{1,200}/;
          if (!Desc_ThemeReg.test(themeDescGet.value)) {
            alert('В описании темы должно быть от 1 до 200 символов');
            return;
          }

          const Text_ThemeReg = /^.{1,2000}/;
          if (!Text_ThemeReg.test(themeTextGet.value)) {
            alert('В тексте темы должно быть от 1 до 2000 символов');
            return;
          }
          userData = {
            Text_Theme: themeTextGet.value,
            Description_Theme: themeDescGet.value,
            TypeTheme_ID: themeTypeGet.value,
            Title_Theme: themeTitleH.value
          };
        
          const confirmUpdate = confirm('Тема будет изменена. Вы уверены?');
      
            if (confirmUpdate) {
              fetch(`http://localhost:3000/updatetheme/${themeId}`, {
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
                console.error('Ошибка при отправке запроса:', error);
                alert('Ошибка при изменении записи в базе данных');
              });    
            }
        });

        async function downloadFile() {
          try{
            pdfUrl = `../${pathFile}`,
            pdfAttachmentBytes = await fetch(pdfUrl).then(res => res.arrayBuffer()),
    
            pdfDoc = await PDFDocument.create();
            var page = pdfDoc.addPage();

            const [pdf] = await pdfDoc.embedPdf(pdfAttachmentBytes);    
            page.drawPage(pdf);
            
            await pdfDoc.attach(pdfAttachmentBytes, `../${pathFile}`,
            {
                mimeType: 'application/pdf'
            });

            const pdfBytes = await pdfDoc.save();
        
            download(pdfBytes, `${titleFile}.pdf`, "application/pdf");
            alert('Скачивание завершено!');
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