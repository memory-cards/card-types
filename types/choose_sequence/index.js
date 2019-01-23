const getUniqueId = require('../../utils/getUniqueId');

function addCodeTags(inputText) {
  const regexp = /```(.|[^`]+)```/gs;
  let outputText = inputText.replace(/{/g, '{<br/>');
  outputText = outputText.replace(/;/g, ';<br/>');
  let result = regexp.exec(outputText);
  while (result !== null) {
    const stringWithCodeTags = `<br/><code>${result[1]}</code><br/>`;
    outputText = outputText.replace(result[0], stringWithCodeTags);
    result = regexp.exec(outputText);
  }
  return outputText;
}

module.exports = ({ card, tags }) => {
  const cardId = getUniqueId(card.question);
  const refactoredCard = {
    ...card,
    question: addCodeTags(card.question),
    comment: addCodeTags(card.comment),
  };

  const front = `
    <div id="${cardId}_wrapper">
      <p id="question"></p>
      <div class="questions-wrapper"></div>
    </div>
    <button id="${cardId}_checkBtn">Check</button>

    <script>
      var card = ${JSON.stringify(refactoredCard)};

      if (!window.memoryCards) {
        window.memoryCards = {};
      }

      var question = document.querySelector('#question');
      question.innerHTML = card.question;

      var questionContainer = document.querySelector('.questions-wrapper');
      var cardAnswers = card.answers;
      questionContainer.innerHTML = window.memoryCards['${cardId}'] || cardAnswers
        .sort(function (el) { return Math.random() - 0.5; })
        .map(function (el) {
          return '<button class="answer_options ' + el.text + '"'
            + 'data-answer="' + (el.sequenceNumber !== undefined ? el.sequenceNumber + 1 : '') + '" '
            + '>'
            + el.text
            + '</button>';
        })
        .join('<br />');

      function checkAnswer() {
        var correctAnswers = cardAnswers
          .filter(function (el) {
            return el.sequenceNumber !== undefined;
          })
          .sort(function (a, b) {
            return a.sequenceNumber - b.sequenceNumber;
          });
        var guesses = question.getElementsByClassName('guess');
        [].forEach.call(guesses, function (el, index) {
          el.classList.add(el.innerHTML === correctAnswers[index].text ? 'correct-guess' : 'incorrect-guess');
        });

        var elements = [].slice.call(questionContainer.querySelectorAll('button'));
        elements.forEach(function (el, index) {
          el.innerHTML += '<span class="answer-mark">' + el.getAttribute('data-answer') + '</span>';
        });
        contentWrapper.classList.add('checked');
      }

      var checkBtn = document.querySelector('#${cardId}_checkBtn');
      checkBtn.addEventListener('click', checkAnswer);

      var contentWrapper = document.querySelector('#${cardId}_wrapper');
      contentWrapper.addEventListener('click', function (ev) {
        var delimiter = '???';
        if (ev.target.tagName === 'BUTTON' && question.innerHTML.indexOf(delimiter) !== -1) {
          question.innerHTML = question.innerHTML.replace(delimiter, '<span class="guess">' + ev.target.innerHTML + '</span>');
          ev.target.classList.add('selected-option');
          ev.target.disabled = true;
        }

        if (ev.target.tagName === 'SPAN' && ev.target.classList.contains('guess')) {
          if (question.innerHTML.indexOf(ev.target.outerHTML) !== -1) {
            question.innerHTML = question.innerHTML.replace(ev.target.outerHTML, delimiter);

            var btn = questionContainer.querySelector('.' + ev.target.innerHTML);
            btn.disabled = false;
            btn.classList.remove('selected-option');
          }
        }
        window.memoryCards['${cardId}'] = questionContainer.innerHTML;
      });
      window.memoryCards['${cardId}'] = questionContainer.innerHTML;
    </script>
    
    <style>
      #${cardId}_wrapper.checked {
        border: 1px solid lightgray;
        pointer-events: none;
      }

      .questions-wrapper {
        text-align: left;
      }

      .answer_options {
        position: relative;
        width: 200px;
        margin-bottom: 5px;
        border-radius: 5px;
      }

      .guess {
        background-color: lightblue;
        border-radius: 2px;
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
      
      p {
        text-align: left;
      }
      
      code {
        background-color: rgba(27,31,35,.05);
        border-radius: 3px;
        font-size: 85%;
        margin: 0;
      }
    </style>
  `;

  const back = `
    <p>${refactoredCard.comment}</p>
    <script>
      checkAnswer();
      delete window.memoryCards['${cardId}'];
    </script>
  `;

  return {
    front,
    back,
    tags: tags || [],
  };
};
