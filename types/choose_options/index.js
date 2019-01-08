const getUniqueId = require('../../utils/getUniqueId');

module.exports = (cardData, cardId) => {
  const { card, tags } = cardData;
  const uniqId = getUniqueId(card.question);

  const front = `
  <div id="${uniqId}_wrapper">
    <p>${card.question}</p>
    <div class="questions-wrapper"></div>
  </div>
  <button id="${uniqId}_checkBtn">Check</button>
  <script>
    var cardId = '${cardId}';
    var questionContainer = document.querySelector('.questions-wrapper');
    var cardAnswers = ${JSON.stringify(card.answers)};
    var cardOptions = cardAnswers
      .sort(function(el) { return Math.random() - 0.5; })
      .map(function(el) {
        return '<label class="is_not_checked should_be_' 
          + (el.correct ? 'checked' : 'unchecked') 
          + '"><input type="checkbox"/><span class="question-text">' 
          + el.text 
          + '</span></label>';})
      .join('<br />');
      
    var answersHTML = window[cardId] || cardOptions;
    if (!window[cardId]) {
      window[cardId] = cardOptions;  
    }
    
    questionContainer.innerHTML = answersHTML;
    var contentWrapper = document.querySelector('#${uniqId}_wrapper');
    var checkBtn = document.querySelector('#${uniqId}_checkBtn');
    checkBtn.addEventListener('click', function() { contentWrapper.classList.add('checked'); });
    contentWrapper.addEventListener('click', function(ev) {
      if(ev.target.tagName !== 'INPUT') { return; }
      var checked = ev.target.checked;
      ev.target.parentElement.classList[checked ? 'add' : 'remove']('is_checked');
      ev.target.parentElement.classList[checked ? 'remove' : 'add']('is_not_checked');
    });
  </script>
  <style>
    #${uniqId}_wrapper.checked {
      border: 1px solid lightgray;
      pointer-events: none;
    }
    .questions-wrapper { text-align: left; }
    .checked .should_be_checked.is_not_checked,
    .checked .should_be_unchecked.is_checked {
      border: 1px solid red;
    }
  </style>
  `;
  return {
    front,
    back: `<p>${card.comment}</p>`,
    tags: tags || [],
  };
};
