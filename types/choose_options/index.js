const getUniqueId = require('../../utils/getUniqueId');
const helpers = require('../../utils/cardUtils/storageHelpers');

module.exports = ({ card, tags }) => {
  const cardId = getUniqueId(card.question);

  const front = `
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
    
    var questionContainer = document.querySelector('.questions-wrapper');
    var cardAnswers = ${JSON.stringify(card.answers)};
    questionContainer.innerHTML = getItem('${cardId}') || cardAnswers
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
        setItem('${cardId}', questionContainer.innerHTML)
    });
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
      pointer-events: none;
    }
    .questions-wrapper { text-align: left; }
    .checked .should_be_checked.is_not_checked {
      background-color: rgb(132, 233, 162);
    }
    .checked .should_be_unchecked.is_checked {
      background-color: rgb(226, 107, 107);
    }
  </style>
  `;

  const back = `
    <p>${card.comment}</p>
    <script>
      contentWrapper.classList.add('checked');
      removeItem('${cardId}');
    </script>
  `;

  return {
    front,
    back,
    tags: tags || [],
  };
};
