const storageHelpers = require('fs')
  .readFileSync(`${__dirname}/../../utils/cardUtils/storageHelpers.js`)
  .toString();
const getUniqueId = require('../../utils/getUniqueId');

module.exports = ({ card, tags }) => {
  const cardId = getUniqueId(card.question);
  const cardGuessesId = `${cardId}guesses`;

  const front = `
    <div id="${cardId}_wrapper">
      <div id="question"></div>
      <div class="questions-wrapper"></div>
    </div>
    <button id="${cardId}_checkBtn">Check</button>

    <script>
      var card = ${JSON.stringify(card)};
      var emptyGuessMark = '???';
      var emptyGuessMarkRegexp = /[?]{3}/g;

      window.memoryCards = window.memoryCards || {};

      ${storageHelpers}

      var question = document.querySelector('#question');
      question.innerHTML = getItem('${cardGuessesId}') || card.question.replace(emptyGuessMarkRegexp, getEmptyGuessItem());

      var questionContainer = document.querySelector('.questions-wrapper');
      var correctAnswersAmount = getCorrectAnswersAmount(card.question);
      var cardAnswers = getCorrectCardAnswers(card.answers);

      questionContainer.innerHTML = getItem('${cardId}') || cardAnswers
        .sort(function () { return Math.random() - 0.5; })
        .map(function (el) {
          return '<button class="answer_options"'
            + 'data-answer="' + (el.sequenceNumber !== undefined ? el.sequenceNumber : '') + '" '
            + '>'
            + el.text
            + '</button>';
        })
        .join('<br />');

      function getCorrectAnswersAmount(question) {
        return ((question || '').match(emptyGuessMarkRegexp) || []).length;
      }

      function getEmptyGuessItem() {
        return '<span class="guess">' + emptyGuessMark + '</span>';
      }

      function getCorrectCardAnswers(answers) {
        for (var i = 0; i < correctAnswersAmount; i++) {
          answers[i].sequenceNumber = i + 1;
        }
        return answers;
      }

      var guesses = question.getElementsByClassName('guess');
      var buttons = questionContainer.querySelectorAll('button');

      function showCurrentActiveGuess() {
        [].forEach.call(guesses, function(el) {
          el.classList.remove('active-guess');
        });
        for (var i = 0; i < guesses.length; i++) {
          if (guesses[i].innerHTML === emptyGuessMark) {
            guesses[i].classList.add('active-guess');
            break;
          }
        }
      }

      function checkAnswer() {
        var correctAnswers = cardAnswers
          .filter(function (el) {
            return el.sequenceNumber !== undefined;
          })
          .sort(function (a, b) {
            return a.sequenceNumber - b.sequenceNumber;
          });
        [].forEach.call(guesses, function (el, index) {
          el.classList.add(el.innerHTML === correctAnswers[index].text ? 'correct-guess' : 'incorrect-guess');
        });

        [].forEach.call(buttons, function (el) {
          el.innerHTML += '<span class="answer-mark">' + el.getAttribute('data-answer') + '</span>';
        });
        contentWrapper.classList.add('checked');
      }

      var checkBtn = document.querySelector('#${cardId}_checkBtn');
      checkBtn.addEventListener('click', checkAnswer);

      var contentWrapper = document.querySelector('#${cardId}_wrapper');
      contentWrapper.addEventListener('click', function (ev) {
        if (ev.target.tagName === 'BUTTON') {
          if (question.innerHTML.indexOf(emptyGuessMark) !== -1) {
            var activeGuess = question.querySelector('.active-guess');
            activeGuess.textContent = ev.target.textContent;
            ev.target.classList.add('selected-option');
            ev.target.disabled = true;
          } else if (correctAnswersAmount === 1) {
            var previousGuess = question.querySelector(".guess");
            previousGuess.textContent = ev.target.textContent;

            var previousButton = document.querySelector(".selected-option");
            if (previousButton) {
              previousButton.classList.remove("selected-option");
              previousButton.disabled = false;
            }
            ev.target.classList.add("selected-option");
            ev.target.disabled = true;
          }
          showCurrentActiveGuess();
        }
        
        if (ev.target.tagName === 'SPAN' && ev.target.classList.contains('guess')) {
          if (question.innerHTML.indexOf(ev.target.outerHTML) !== -1) {
            question.innerHTML = question.innerHTML.replace(ev.target.outerHTML, getEmptyGuessItem());
            
            if (ev.target.innerHTML !== emptyGuessMark) {
              for (var i = 0; i < buttons.length; i++) {
                if (buttons[i].innerHTML === ev.target.innerHTML) {
                  buttons[i].classList.remove('selected-option');
                  buttons[i].disabled = false;
                  break;
                }
              }
            }

            showCurrentActiveGuess();
          }
        }
        setItem('${cardId}', questionContainer.innerHTML)
        setItem('${cardGuessesId}', question.innerHTML)
      });
      showCurrentActiveGuess();
      setItem('${cardId}', questionContainer.innerHTML)
    </script>
    
    <style>
      html {
        font-size: 150%;
      }
      
      @media only screen and (max-device-width: 600px) {
        html {
          font-size: 70%;
        }
      }
        
      #${cardId}_wrapper.checked {
        border: 1px solid lightgray;
        pointer-events: none;
      }

      #question {
        font-size: 1rem;
      }

      .questions-wrapper {
        margin: 0 auto;
        width: 200px;
        text-align: left;
        font-size: 1rem;
      }

      .comments-wrapper {
        text-align: left;
        font-size: 1rem;
      }

      .answer_options {
        position: relative;
        width: 200px;
        margin-bottom: 5px;
        border-radius: 5px;
        min-height: 1rem;
      }

      .guess {
        background-color: rgb(215, 235, 228);
        border-radius: 2px;
        padding: 2px;
      }

      .active-guess {
        background-color: rgb(175, 218, 233);
      }

      .correct-guess {
        background-color: rgb(132, 233, 162);
      }

      .incorrect-guess {
        background-color: rgb(226, 107, 107);
      }

      .selected-option {
        background-color: rgba(202, 202, 202, 0.2);
        border-color: rgba(202, 202, 202, 0.2);
      }

      .answer-mark {
        opacity: 1;
        left: 5px;
        position: absolute;
        color: green;
      }
      
      code {
        padding: 1px;
        background-color: #f8f8f8;
        border-radius: 3px;
        font-size: 0.85rem;
        margin: 0;
        border: 1px solid #ccc;
      }

      pre code {
        border-width: 0;
      }

      div pre {
        overflow: overlay;
        text-align: left;
        white-space: pre-wrap;
        tab-size: 4;
        padding: 10px;
        display: block;
        background-color: #f8f8f8;
        border-radius: 3px;
        border: 1px solid #ccc;
        font-size: 0.85rem;
        margin: 10px;
      }
    </style>
  `;

  const back = `
    <div class="comments-wrapper">${card.comment}</div>
    <script>
      checkAnswer();
      removeItem('${cardId}');
      removeItem('${cardGuessesId}');
    </script>
  `;

  return {
    front,
    back,
    tags: tags || [],
  };
};
