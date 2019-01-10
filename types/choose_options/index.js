const getUniqueId = require('../../utils/getUniqueId');

module.exports = ({ card, tags }) => {
  const cardId = getUniqueId(card.question);

  const front = `
  <div id="${cardId}_wrapper">
    <p>${card.question}</p>
    <div class="questions-wrapper"></div>
  </div>
  <button id="${cardId}_checkBtn">Check</button>
  <script>
    if (!window.memoryCards) {
      window.memoryCards = {};
    }
    
    var questionContainer = document.querySelector('.questions-wrapper');
    var cardAnswers = ${JSON.stringify(card.answers)};
    questionContainer.innerHTML = window.memoryCards['${cardId}'] || cardAnswers
      .sort(function(el) { return Math.random() - 0.5; })
      .map(function(el) {
        return '<label class="is_not_checked should_be_' 
          + (el.correct ? 'checked' : 'unchecked') 
          + '"><input type="checkbox"/><span class="question-text">' 
          + el.text 
          + '</span></label>';})
      .join('<br />');
      
    var contentWrapper = document.querySelector('#${cardId}_wrapper');
    var checkBtn = document.querySelector('#${cardId}_checkBtn');
    checkBtn.addEventListener('click', function() { contentWrapper.classList.add('checked'); });
    contentWrapper.addEventListener('click', function(ev) {
      if (ev.target.tagName !== 'INPUT') { return; }
        var isChecked = ev.target.checked;
        ev.target.parentElement.classList[isChecked ? 'add' : 'remove']('is_checked');
        ev.target.parentElement.classList[isChecked ? 'remove' : 'add']('is_not_checked');
        ev.target.setAttribute("checked", isChecked);
        window.memoryCards['${cardId}'] = questionContainer.innerHTML;
    });
  </script>
  <style>
    #${cardId}_wrapper.checked {
      border: 1px solid lightgray;
      pointer-events: none;
    }
    .questions-wrapper { text-align: left; }
    .checked .should_be_checked.is_not_checked {
      border: 1px solid forestgreen;
    }
    .checked .should_be_unchecked.is_checked {
      border: 1px solid rgb(255, 146, 146);
    }
  </style>
  `;

  const back = `
    <p>${card.comment}</p>
    <script>
      contentWrapper.classList.add('checked');
      delete window.memoryCards['${cardId}'];
    </script>
  `;

  return {
    front,
    back,
    tags: tags || [],
  };
};
