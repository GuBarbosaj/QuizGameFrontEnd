//Function that starts the quiz
function startGame(){
    //Variable global to control the issue number 
    number = 0
    getQuizModel()
    getQuizQuestions()
}

//Function that performs a request AJAX, and loads the quiz form on the screen
function getQuizModel(){
    let ajax = new XMLHttpRequest()
    ajax.open('GET', 'quiz_model.html')
    ajax.onreadystatechange = () => {
        if(ajax.readyState == 4 && ajax.status == 200) {
            $('#sub_main').empty()
            $('#sub_main').append(ajax.responseText)
          }
        }
    ajax.send()
}

//Function that performs a request AJAX, and retrieves the questions and answers from the API
function getQuizQuestions(){
    //API url
    let url = 'http://localhost:8080/quiz'
    let ajax = new XMLHttpRequest()
    ajax.open('GET', url)
    ajax.onreadystatechange = () => {
        if(ajax.readyState == 4 && ajax.status == 200) {
            let questionsJSONText = ajax.responseText
            questionsJSONObj = JSON.parse(questionsJSONText)
            putQuestions(questionsJSONObj, number)
          }
        }
    ajax.send()
}

//Function that based on the number of the question, puts the question and alternatives in the form.
function putQuestions(obj, number){
    $('#qid').empty()
    $('#qid').append(number+1 + ') ' + obj[number].question)

    let radios = document.getElementsByName("q_answer");

    //Clean the radio buttons checks
    for (let i = 0; i < radios.length; i++) {
        radios[i].checked = false
    }
    //Cleans up the previous alternatives, and places the new ones 
    $('#q1').empty()
    $('#q1').append(obj[number].answers[0])
    $('#q2').empty()
    $('#q2').append(obj[number].answers[1])
    $('#q3').empty()
    $('#q3').append(obj[number].answers[2])
    $('#q4').empty()
    $('#q4').append(obj[number].answers[3])
}

//Function to restart the game
function resetGame(){
    startGame()
    let overlay = document.getElementById('overlay');
    overlay.style.display = "none";
}

//Function to return to the game
function backGame(){
    let overlay = document.getElementById('overlay');
    overlay.style.display = "none";
}

//Function that edits the overlay in case of victory
function win(){
    let overlay = document.getElementById("overlay")
    $('#text').empty()
    $('#text').append('Você ganhou o jogo!')
    $('#btn_overlay').attr('onclick', 'resetGame()')
    $('#btn_overlay').attr('value', 'Reiniciar jogo')
    overlay.style.display = "block"
}

//Function that edits the overlay in case of defeat
function lose(){
    let overlay = document.getElementById("overlay")
    $('#text').empty()
    $('#text').append('Você perdeu o jogo!')
    $('#btn_overlay').attr('onclick', 'resetGame()')
    $('#btn_overlay').attr('value', 'Reiniciar jogo')
    overlay.style.display = "block"
}

//Function that edits the overlay in case of radio buttons not checked
function notChecked(){
    let overlay = document.getElementById("overlay")
    $('#text').empty()
    $('#text').append('Selecione uma alternativa!')
    $('#btn_overlay').attr('onclick', 'backGame()')
    $('#btn_overlay').attr('value', 'Voltar pro jogo')
    overlay.style.display = "block"
}

//Function that checks if you have a radio button checked, and if so, checks that the answer is right
function check(){
    let radios = document.getElementsByName("q_answer");
    let right = false;
    let checked = false;

    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked){
            checked = true;
            if(radios[i].value == questionsJSONObj[number].correct+1){
                right = true;    
            }
        }
    }

    if(right){
        number++
        if(number<5){
            putQuestions(questionsJSONObj, number)  
        }else{
            win()
        }
    }else if(checked){
        lose()
    }else{
        notChecked()
    }
}