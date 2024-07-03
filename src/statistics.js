document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById('statisticsTableBody');
  // Массив с цветами для значений
  const backgroundColor = [
      'rgba(255, 26, 104, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(255, 206, 86, 0.2)',
      'rgba(75, 192, 192, 0.2)',
      'rgba(153, 102, 255, 0.2)',
      'rgba(255, 159, 64, 0.2)',
      'rgba(0, 0, 0, 0.2)'
  ];
  
  var labelViews = 'Просмотры';
  var labelComments = 'Комментарии';
  var labelsData = [];
  var dataViews = [];
  var dataComments = [];
  const id = localStorage.getItem('userId');
  console.log(id);
  // Функция для создания графиков
  async function chartCreateAll(dataStatistic) {
      const response = await fetch('http://localhost:3000/allthemes');
      if (!response.ok) {
        throw new Error('Ошибка при получении данных о темах');
      }
      const themes = await response.json();
      dataStatistic.forEach(statistic => {
          themes.forEach(theme => {
            if(theme.User_ID == id){
              if(statistic.Theme_ID == theme.ID_Theme){
                labelsData.push(formatDate(statistic.DateStatistics));
                for(let i = 0; i < labelsData.length; i++){
                  if(labelsData[i] == labelsData[i - 1]){// Условие для подсчета просмотрв и комментарие за одну дату
                      labelsData.splice(i, 1);
                      dataViews[dataViews.length - 1] += dataStatistic[i].Count_Watch;
                      dataComments[dataViews.length - 1] += dataStatistic[i].Count_Comments;
                      return;
                  }
                }
                dataViews.push(statistic.Count_Watch);
                dataComments.push(statistic.Count_Comments);
              }
            }
        });
      });
      // Для формирования графиков по просмотрам
      var data = {
          labels: labelsData,
          datasets: [{
          label: `${labelViews}`,
          data: dataViews,
          backgroundColor: backgroundColor[getRandomInRange(0, 7)],
          }]
      };
      // Для формирования графиков по количеству комментариев
      var dataComms = {
          labels: labelsData,
          datasets: [{
          label: `${labelComments}`,
          data: dataComments,
          backgroundColor: backgroundColor[getRandomInRange(0, 7)],
          }]
      };
      const config = {
          type: 'bar',
          data: data,
          options: {
          scales: {
              y: {
              beginAtZero: true
              }
          }
          }
      };
      const configComments = {
          type: 'bar',
          data: dataComms,
          options: {
          scales: {
              y: {
              beginAtZero: true
              }
          }
          }
      };
      // Создание графика по данным о просмотрах
      const myChart = new Chart(
          document.getElementById('myChart'),
          config
      );
      // Создание графика по данным о комментария
      const myChartComms = new Chart(
          document.getElementById('myChartComments'),
          configComments
      );
  }
  // Функция для получения статистики
    function fetchAndPopulateTable() {
      fetch('http://localhost:3000/statistics')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          userData = data; // Сохраняем исходные данные
          chartCreateAll(userData);
          populateTable(userData); // Заполняем таблицу исходными данными
        })
        .catch(error => {
          console.error('There has been a problem with your fetch operation:', error);
        });
    }
  
    fetchAndPopulateTable();
  
    // Функция для заполнения таблицы данными
    async function populateTable(data) {
      tableBody.innerHTML = ''; // Очищаем таблицу перед добавлением данных
      const id = localStorage.getItem('userId');
      console.log(id);
  
      const response = await fetch('http://localhost:3000/allthemes');
      if (!response.ok) {
        throw new Error('Ошибка при получении данных о темах');
      }
      const themes = await response.json();
  
      if (data.length === 0) {
        const noDataMessage = document.createElement('tr');
        noDataMessage.innerHTML = `<td colspan="4">Нет данных</td>`;
        tableBody.appendChild(noDataMessage);
        return;
      }
  
      data.forEach(statistic => {
        const row = document.createElement('tr');
        var themeTitle;
        var themeType;
        var themeTypeText;
        themes.forEach(theme => {
          if(theme.User_ID == id){
              if(statistic.Theme_ID == theme.ID_Theme){
                  themeTitle = theme.Title_Theme;
                  themeType = theme.TypeTheme_ID;
              }
      
              if(themeType === 1){
                  themeTypeText = 'Дисциплина';
              }
              else if(themeType === 2){
                  themeTypeText = 'Вопрос';
              }
              else if(themeType === 3){
                  themeTypeText = 'Тема для обсуждения';
              }
          }
          else{
              return;
          }
        });
        if(themeTitle == undefined){
          return;
        }else{
          row.innerHTML = `
              <td style="width: 100px; height: 30px; overflow-x: auto; margin-left: 20px;">${formatDate(statistic.DateStatistics)}</td>
              <td>${themeTitle}</td>
              <td>${themeTypeText}</td>
              <td>${statistic.Count_Watch || '-'}</td>
              <td>${statistic.Count_Comments || '-'}</td>
          `;
          tableBody.appendChild(row);
        }
      });
    }
    // Для форматирования даты
    function formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
      }
      // Для задания рандомного цвета на графике
      function getRandomInRange(min, max){
          return Math.floor(Math.random() * (max- min)) + min;
      }
  });