window.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const themeId = params.get('id');
    const postId = localStorage.getItem('post');
    const userId = localStorage.getItem('userId');
    const themeTitle = params.get('titleTheme');
    const themeDesc = params.get('Description_Theme');

    const noData = document.getElementById('noData');
    const themeTitleH = document.getElementById('Title_Theme');
    const themeDescGet = document.getElementById('Description_Theme');
    const commentText = document.getElementById('Comment_Text');
    const addButton = document.getElementById('addButton');

    themeTitleH.textContent = themeTitle;
    themeDescGet.textContent = themeDesc;

    const cardsContainer = document.querySelector('.cards-container');
    const allCards = [];
    let visibleCards = [];
    var commentToID;
    // Массиы с цветами для аватарок пользователей
    const backgroundColor = [
      'rgba(255, 26, 104, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(255, 206, 86, 0.2)',
      'rgba(75, 192, 192, 0.2)',
      'rgba(153, 102, 255, 0.2)',
      'rgba(255, 159, 64, 0.2)',
      'rgba(0, 0, 0, 0.2)'
    ];
    
    addButton.addEventListener('click', createNewComment);

    document.getElementById('rating').addEventListener('change', filterByThemeTypeCategory);
    // Конструкция для вывода комментариев
    try{
        const responseAuthor = await fetch('http://localhost:3000/allusers');
        if (!responseAuthor.ok) {
          throw new Error('Ошибка при получении данных об авторах');
        }
        const authors = await responseAuthor.json();

        const responseAuthorAdmin = await fetch('http://localhost:3000/alladmins');
        if (!responseAuthorAdmin.ok) {
          throw new Error('Ошибка при получении данных об авторах');
        }
        const authorsAdmins = await responseAuthorAdmin.json();

        const responseComments = await fetch('http://localhost:3000/comments');
        if (!responseComments.ok) {
          throw new Error('Ошибка при получении данных о комментариях');
        }
        const comments = await responseComments.json();
        // Цикл для создания карточки комментария
        comments.forEach(comment => {
            if(parseInt(comment.Theme_ID) == parseInt(themeId)){
              const delimiter = document.createElement('p');

              const card = document.createElement('div');
              card.classList.add('comment');
              if(comment.CommentTo_ID != null){card.classList.add('comment-answer');}

              const textCommentDiv = document.createElement('div');
              textCommentDiv.classList.add('textcomment');

              const avatarDiv = document.createElement('div');
              avatarDiv.style.backgroundColor = backgroundColor[getRandomInRange(0, 7)];
              avatarDiv.classList.add('avatar');

              const userName = document.createElement('a');
              authors.forEach(author => {
                  if(author.ID_User == comment.UserFrom_ID){
                      userName.textContent = `${author.Surname_User} ${author.Name_User}`;
                  }
              });
              authorsAdmins.forEach(author => {
                  if(author.ID_Administrator == comment.AdminFrom_ID){
                      userName.textContent = `${author.Surname_admin} ${author.Name_admin}`;
                  }
              });

              const commentText = document.createElement('label');
              commentText.textContent = comment.Comment_Text;

              const dateComment = document.createElement('p');
              dateComment.classList.add('dateComment');
              dateComment.textContent = formatDate(comment.Date_comment);

              const answerButton = document.createElement('button');
              answerButton.classList.add('answer-button');
              answerButton.textContent = "Ответить ⤴";
              answerButton.addEventListener('click', () => {
                  if(addButton.textContent == 'Добавить комментарий'){// Уссловие для создания ответа на комментария
                      addButton.textContent = 'Ответить';
                      answerButton.textContent = "Отменить";
                      commentToID = comment.ID_Comments;
                      document.getElementById('labelAnswerToComment').textContent =
                        `Добавление ответа на комменатрий "${commentText.textContent}" от ${userName.textContent}`;
                      console.log(userName.textContent, commentToID);
                  }
                  else if(addButton.textContent == 'Ответить'){// Условие для отправки ответа на комментарий
                      addButton.textContent = 'Добавить комментарий';
                      answerButton.textContent = "Ответить ⤴";
                      document.getElementById('labelAnswerToComment').textContent = '';
                      console.log("userName.textContent");
                  }
              });
              
              const deleteAnswerButton = document.createElement('button');
              deleteAnswerButton.classList.add('delete-answer-button');
              deleteAnswerButton.textContent = "Удалить";
              deleteAnswerButton.addEventListener('click', () => {
                if(postId == 2 || postId == 3){// Преподватели и студенты могут удалять только свои комментарии
                  if(userId != comment.UserFrom_ID){
                    alert('Вы не можете удалить этот комментарий');
                    return;
                  }
                }
                  const deleteCommentId = comment.ID_Comments;
                  console.log(deleteCommentId);
                  const confirmDelete = confirm('Комментарий будет недоступен для просмотра. Вы уверены?');
                  const requestData = {
                    Access: 1
                  };
              
                  if (confirmDelete) {// При подтверждении удаления, комментарий удаляется
                    fetch(`http://localhost:3000/deletecomment/${deleteCommentId}`, {
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
              });

              const accessInfo = document.createElement('p');
              accessInfo.classList.add('accessInfo');
              if(comment.Access == '0'){// Условие для отображения удаленных комментариев
                  accessInfo.textContent = '';
              }else{
                  accessInfo.textContent = 'Комментарий удален пользователем или администратором!';
              }

              textCommentDiv.appendChild(userName);
              textCommentDiv.appendChild(delimiter);
              textCommentDiv.appendChild(commentText);
              textCommentDiv.appendChild(dateComment);
              card.appendChild(avatarDiv);
              card.appendChild(textCommentDiv);
              card.appendChild(answerButton);
              card.appendChild(deleteAnswerButton);
              card.appendChild(accessInfo);

              allCards.push(card);
          }
        });
        visibleCards = [...allCards];
        
    }catch(error){
        throw new Error('Ошибка при получении данных о комментариях');
    }
    

    if(!(Array.isArray(visibleCards) && visibleCards.length)){// условие для отображения строки, если нет комментариев
        noData.textContent = "Еще нет комментариев. Можете оставить первый комментарий";
    }
    else{
        renderCards();
    }
    // Метод для рандомного выбора цвета аватарки
    function getRandomInRange(min, max){
      return Math.floor(Math.random() * (max- min)) + min;
    }
    // Метод для фильтрации комментариев
    async function filterByThemeTypeCategory() {
        const selectedCategory = document.getElementById('rating').value;
        const cards = Array.from(allCards); //  копию всех карточек
      
        cards.forEach(card => {
          const themeTypeElement = card.querySelector('.accessInfo'); 
          if (themeTypeElement) {
            const type = themeTypeElement.textContent;
      
            if (selectedCategory == 1) { // Все
              card.style.display = 'block';
            } else if (selectedCategory == 2) { // Доступные
              if (type == '') {
                card.style.display = 'block';
              } else {
                card.style.display = 'none';
              }
            } else if (selectedCategory == 3) { // Удаленные
              if (type == 'Комментарий удален пользователем или администратором!') {
                card.style.display = 'block';
              } else {
                card.style.display = 'none';
              }
            }
          }
        });
    }
    // Метод для отображения карточек
    function renderCards() {
        cardsContainer.innerHTML = '';
        visibleCards.forEach(card => {
        cardsContainer.appendChild(card);
        });
    }
    // Метод для форматирования даты
    function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    // Метод создания нового комментария или ответа
    async function createNewComment() {    
        const comment = commentText.value;
        const Text_ComReg = /^.{1,500}/;
        if (!Text_ComReg.test(comment)) {
          alert('В комментарии должно быть от 1 до 500 символов');
          return;
        }
        const userId = localStorage.getItem('userId');
        console.log(getCurrentDate(), comment, userId);

        if(addButton.textContent == 'Добавить комментарий'){
            userData = {
                Theme_ID: themeId,
                Comment_Text: comment,
                AdminFrom_ID: userId,
                Date_comment: getCurrentDate(),
                Access: '0'
              };
    
            try {
                const response = await fetch('http://localhost:3000/createcomment', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(userData)
                });
            
                if (response.ok) {
                  const result = await response.json();
                  console.log(result.message);
                  alert('Комментарий успешно добавлен');
            
                } else {
                  throw new Error('Ошибка при добавлении комментария');
                }
              } catch (error) {
                console.error('Произошла ошибка:', error);
                alert('Произошла ошибка при добавлении комментария');
              }
    
        }
        else if(addButton.textContent == 'Ответить'){
            createAnswerToComment();
        }
    }
    // Метод создания ответа на комментарий
    async function createAnswerToComment() {    
        console.log(commentToID);
        const comment = commentText.value;
        const Text_ComReg = /^.{1,500}/;
        if (!Text_ComReg.test(comment)) {
          alert('В комментарии должно быть от 1 до 500 символов');
          return;
        }
        const userId = localStorage.getItem('userId');
        console.log(getCurrentDate(), comment, userId, parseInt(commentToID));
        commentData = {
            Theme_ID: themeId,
            Comment_Text: comment,
            AdminFrom_ID: userId,
            CommentTo_ID: parseInt(commentToID),
            Date_comment: getCurrentDate(),
            Access: '0'
          };

        try {
            const response = await fetch('http://localhost:3000/createanswertocomment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(commentData)
            });
        
            if (response.ok) {
              const result = await response.json();
              console.log(result.message);
              alert('Комментарий успешно добавлен');
        
            } else {
              throw new Error('Ошибка при добавлении комментария');
            }
          } catch (error) {
            console.error('Произошла ошибка:', error);
            alert('Произошла ошибка при добавлении комментария');
          }
    }
    // Метод для получения текущей даты
    function getCurrentDate(){
        var today = new Date();
        var day = String(today.getDate()).padStart(2, '0');
        var month = String(today.getMonth() + 1).padStart(2, '0');
        var year = today.getFullYear();
        return `${year}-${month}-${day}`;
    }
});