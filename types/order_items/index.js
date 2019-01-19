const getUniqueId = require('../../utils/getUniqueId');

module.exports = ({ card, tags }) => {
  const cardId = getUniqueId(card.question);

  const front = `
    <style>
      #${cardId}_wrapper.checked {
        border: 2px solid lightgray;
        pointer-events: none;
      }
    
      li[draggable].error {
        border-color: red;
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
      var _el;
      
      if (!window.memoryCards) {
          window.memoryCards = {};
      }
    
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
      questionContainer.innerHTML = window.memoryCards['${cardId}'] || getCardAnswersHTML();
      
      function dragOver(e) {
        var node = isBefore(_el, e.target) ? e.target : e.target.nextSibling;
        e.target.parentNode.insertBefore(_el, node);
      }
    
      function dragEnd() {
        _el = null;
        window.memoryCards['${cardId}'] = questionContainer.innerHTML;
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
      window.memoryCards['${cardId}'] = questionContainer.innerHTML;
    </script>
  `;

  const back = `
    <p>${card.comment}</p>
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
