const getUniqueId = require('../../utils/getUniqueId');
const helpers = require('../../utils/cardUtils/storageHelpers');

module.exports = ({ card, tags }) => {
  const cardId = getUniqueId(card.question);

  const front = `
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
        pointer-events: none;
      }

      #${cardId}_wrapper.checked + button {
        visibility: hidden;
      }

      #${cardId}_wrapper.checked li {
        background-color: rgb(132, 233, 162);
        border-color: white;
        border-radius: 6px;
      }
    
      #${cardId}_wrapper.checked li.error {
        background-color: rgb(226, 107, 107);
      }
    
      li[draggable] {
        border: 1px solid lightblue;
        padding: 5px;
        user-select: none;
      }
    
      [draggable].over {
        border: 2px dashed #000;
      }
    
      ol {
        text-align: left;
      }
    </style>
    
    <div id="${cardId}_wrapper">
      <p>${card.question}</p>
      <div class="questions-wrapper"></div>
    </div>
    <button id="${cardId}_checkBtn">Check</button>
    
    <script>
      window.memoryCards = window.memoryCards || {};

      var getItem = ${helpers.getItem};
      var setItem = ${helpers.setItem};
      var removeItem = ${helpers.removeItem};
      
      var _el;
    
      function getCardAnswersHTML() {
        var cardAnswers = ${JSON.stringify(card.answers)};
        var cardAnswersHTML = cardAnswers.slice()
          .sort(function(el) { return Math.random() - 0.5; })
          .map(function(el) {
            return '<li draggable="true" '
              + 'ondragend="dragEnd()" '
              + 'data-index="' + cardAnswers.indexOf(el) + '" '
              + 'ondragover="dragOver(event)" '
              + 'ondragstart="dragStart(event)">'
              + el
              + '</li>';
          })
          .join('');
    
        return '<ol>' + cardAnswersHTML + '</ol>';
      }
      
      var questionContainer = document.querySelector('.questions-wrapper');
      questionContainer.innerHTML = getItem('${cardId}') || getCardAnswersHTML();
      
      function dragOver(e) {
        var node = isBefore(_el, e.target) ? e.target : e.target.nextSibling;
        e.target.parentNode.insertBefore(_el, node);
      }
    
      function dragEnd() {
        _el = null;
        setItem('${cardId}', questionContainer.innerHTML)
      }
    
      function dragStart(e) {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", e.target.innerHTML);
        _el = e.target;
      }
    
      function isBefore(el1, el2) {
        if (el2.parentNode === el1.parentNode)
          for (var cur = el1.previousSibling; cur; cur = cur.previousSibling)
            if (cur === el2)
              return true;
        return false;
      }
    
      function checkAnswer() {
        var contentWrapper = document.querySelector('#${cardId}_wrapper');
        var elements = [].slice.call(contentWrapper.querySelectorAll('li[data-index]'));
        elements.forEach(function(el, index) {
          var dataIndex = +el.getAttribute('data-index');
          if (dataIndex !== index) {
            el.classList.add('error');
          }
          el.setAttribute('value', dataIndex + 1);
        });
        contentWrapper.classList.add('checked');
      }
    
      var checkBtn = document.querySelector('#${cardId}_checkBtn');
      checkBtn.addEventListener('click', checkAnswer);
      setItem('${cardId}', questionContainer.innerHTML)
    </script>
  `;

  const back = `
    <p>${card.comment}</p>
    <script>
      checkAnswer();
      removeItem('${cardId}');
    </script>
  `;

  return {
    front,
    back,
    tags: tags || [],
  };
};
