function JSUploader() {
    this.allFiles = [];
    var baseClass = this;

    this.addFiles = function(files) {
        $.each(files, function(i, file) {
            var temp = {file: file, progressTotal: 0, progressDone: 0, element: null, valid: false};

            temp.valid = (file.type == 'application/pdf'
                || file.type == 'image/jpeg'
                || file.type == 'image/jpg'
                || file.type == 'image/png') && file.size / 1024 / 1024 < 100;

            temp.element = baseClass.attachFileToView(temp);
            baseClass.allFiles.unshift(temp);
        });
    };

    this.uploadFile =  function(index) {
        var file = baseClass.allFiles[index];

        if(file.valid) {
            var data = new FormData();
            data.append('uploadFile', file.file);

            $.ajax({
                url: 'http://localhost:3002/upload',
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                type: 'POST',
                success: function (response) {
                    var message = file.element.find('td.message');
                    if (response.status == 'ok') {
                        message.html(response.text);
                        file.element.find('button.uploadButton').remove();
                        insertFiles(file.file.name);
                    }
                    else {
                        message.html(response.errors);
                    }
                },
                xhr: function () {
                    var xhr = $.ajaxSettings.xhr();

                    if (xhr.upload) {
                        console.log('xhr upload');

                        xhr.upload.onprogress = function (e) {
                            file.progressDone = e.position || e.loaded;
                            file.progressTotal = e.totalSize || e.total;
                            baseClass.updateFileProgress(index, file.progressDone, file.progressTotal, file.element);
                            baseClass.totalProgressUpdated();
                            console.log('xhr.upload progress: ' + file.progressDone + ' / ' + file.progressTotal + ' = ' + (Math.floor(file.progressDone / file.progressTotal * 1000) / 10) + '%');
                        };
                    }

                    return xhr;
                }
            });        
        }
    };

    this.uploadAllFiles =  function() {
        $.each(baseClass.allFiles, function(i, file) {
            baseClass.uploadFile(i);
        });
    };

    this.updateFileProgress = function(index, done, total, view) {
        var percent = (Math.floor(done/total*1000)/10);

        var progress = view.find('div.progress-bar');

        progress.width(percent + '%');
        progress.html(percent + '%');
    };

    this.updateTotalProgress = function(done, total) {
        var percent = (Math.floor(done/total*1000)/10);
        $('#progress').width(percent + '%');
        $('#progress').html(percent + '%');
    };

    this.totalProgressUpdated = function() {
        var done = 0.0;
        var total = 0.0;

        $.each(baseClass.allFiles, function(i, file) {
            done += file.progressDone;
            total += file.progressTotal;
        })

        baseClass.updateTotalProgress(done, total);
    };

    const insertFiles = async function(filename){
        const themeId = getThemeIdInserted();
        themeData = {
            Title_Files: filename,
            Path_Files: `files/${filename}`,
            Theme_ID: themeId
        };
        try {
            const response = await fetch('http://localhost:3000/filespost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(themeData)
            });
        
            if (response.ok) {
            const result = await response.json();
            console.log(result.message);              
            } else {
            throw new Error('Ошибка при добавлении файлов');
            }
        } catch (error) {
        console.error('Произошла ошибка:', error);
        alert('Произошла ошибка при добавлении файлов');
        }
    }

    this.attachFileToView = function(file) {
        var row = $('<tr>');
        row.hide();

        var isValidType  = (file.file.type == 'application/pdf'
            || file.file.type == 'image/jpeg'
            || file.file.type == 'image/jpg'
            || file.file.type == 'image/png');

        var isValidSize = file.file.size / 1024 / 1024 < 10;

        var preview = $('<td>');
        preview.width('100px');
        if(isValidType)
        {
            var img = $('<img>');
            img.attr('class', 'img-fullsize');

            var reader = new FileReader();
            reader.onload = function (e) {
                img.attr('src', e.target.result);
            }
            reader.readAsDataURL(file.file);

            preview.append(img);
        }

        var fileInfo = $('<td>');
        fileInfo.width('200px');

        var fileName = $('<div>');
        fileName.html(file.file.name);

        var fileType = $('<div>');
        fileType.html(file.file.type);

        var fileSize = $('<div>');
        var size = file.file.size;

        // if((file.file.size / 1024 / 1024) > 1.0) {
        //     fileSize.html(Math.floor(file.file.size / 1024 / 1024) + ' MB');
        // }
        // else if((file.file.size / 1024) > 1.0) {
        //     fileSize.html(Math.floor(file.file.size / 1024) + ' KB');
        // }
        // else {
            fileSize.html(file.file.size + ' bytes');
        // }


        fileInfo.append(fileName);
        fileInfo.append(fileType);
        fileInfo.append(fileSize);

        //create message column
        var messageColumn = $('<td>');
        messageColumn.attr('class', 'message');
        messageColumn.width('200px');
        if(!isValidType)
        {
            messageColumn.html('Неподдерживаемый mimetype ' + file.file.type);
        }
        if(!isValidSize) {
            messageColumn.html(messageColumn.html() + 'File size is ' + Math.floor(file.file.size / 1024 / 1024) + ' MB. Limit is2 MB.');
        }

        //create progress
        var progressColumn = $('<td>');
        progressColumn.attr('style', 'vertical-align: middle;');
        if(file.valid) {
            var progress = $('<div>');

            progress.attr('class', 'progress');

            var progressBar = $('<div>');
            progressBar.attr('class', 'progress-bar');
            progressBar.attr('role', 'progressbar');
            progressBar.html('0%');

            progress.append(progressBar);
            progressColumn.append(progress);
        }

        //create buttons
        var button1 = $('<td>');
        button1.attr('style', 'vertical-align: middle; width:50px');

        var uploadButton = $('<button>');
        uploadButton.attr('class', 'btn btn-primary uploadButton');
        uploadButton.html('Upload');
        uploadButton.click(function(){
            baseClass.uploadFile(row.index());
        });
        // if(file.valid) {
        //     button1.append(uploadButton);
        // }

        var button2 = $('<td>');
        button2.width('50px');

        var removeButton = $('<button>');
        removeButton.attr('class', 'close');
        removeButton.html('&times');
        removeButton.click(function(){
            baseClass.allFiles.splice(row.index(), 1);
            row.fadeOut(300, function(){
                $(this).remove();
            });
        });
        button2.append(removeButton);

        row.append(preview);
        row.append(fileInfo);
        row.append(messageColumn);
        row.append(progressColumn);
        row.append(button1);
        row.append(button2);
        row.fadeIn();

        $('#files').prepend(row);

        return row;
    };
}

var uploader = new JSUploader();

$(document).ready(function()
{
    const themeTitle = document.getElementById('Title_Theme');
    const themeDesc = document.getElementById('Description_Theme');
    const themeText = document.getElementById('Text_Theme');
    const themeType = document.getElementById('TypeTheme_ID');
    const addButton = document.getElementById('uploadAllFilesButton');
    const post = localStorage.getItem('post');
    if(post == 3){
        themeType.value = 2;
        themeType.disabled = true;
    }
  
    themeTitle.addEventListener('input', () => {
      let lengthTitle = themeTitle.value.length;
      if(lengthTitle > 60){
          alert('В заголовок темы можно ввести только 60 символов!');
          return;
      }
      document.getElementById('outputTheme').textContent = `${0 + lengthTitle}/60`
    });
    themeDesc.addEventListener('input', () => {
        let lengthTitle = themeDesc.value.length;
        if(lengthTitle > 200){
            alert('В описание темы можно ввести только 200 символов!');
            return;
        }
        document.getElementById('outputDesc').textContent = `${0 + lengthTitle}/200`
    });
  
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

    async function getThemeIdInserted(){
        var themeId;
        fetch(`http://localhost:3000/themeid/${userId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(userData => {
          console.log('Данные пользователя:', userData);
          themeId = userData.ID_Theme;
        })
        .catch(error => {
          console.error('Проблема с получением данных пользователя:', error);
        });
        return themeId;
    }

    $("#addFilesButton").click(function() {
        $("#uploadFiles").replaceWith($("#uploadFiles").clone(true));
        $("#uploadFiles").click();
    });

    $("#uploadAllFilesButton").click(function() {
        createTheme();
        uploader.uploadAllFiles();
    });

    $("#uploadFiles").change(function() {
        var files = this.files;

        uploader.addFiles(files);
    });

});

