const randomSort = require('../../utils/randomSort');
const getUniqueId = require('../../utils/getUniqueId');

module.exports = ({ card, tags }) => {
  const uniqId = getUniqueId(card.question);
  const questionsHtml = `<ol>${randomSort([...card.answers])
    .map(
      el =>
        `<li draggable="true" ondragend="dragEnd()" data-index="${card.answers.indexOf(
          el
        )}" ondragover="dragOver(event)" ondragstart="dragStart(event)">${el}</li>`
    )
    .join('')}</ol>`;

  const front = `
<style>
#${uniqId}_wrapper.checked {
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

<div id="${uniqId}_wrapper">
  <p>${card.question}</p>
  <div class="questions-wrapper">${questionsHtml}</div>
</div>

<button id="${uniqId}_checkBtn">Check</button>
<div id="log"></div>
<script>
var _el;
var log = document.querySelector('#log');

function dragOver(e) {
  if (isBefore(_el, e.target))
    e.target.parentNode.insertBefore(_el, e.target);
  else
    e.target.parentNode.insertBefore(_el, e.target.nextSibling);
}

function dragEnd() {
  _el = null;
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

var contentWrapper = document.querySelector('#${uniqId}_wrapper');
var checkBtn = document.querySelector('#${uniqId}_checkBtn');
checkBtn.addEventListener('click', function() {
  var elements = [].slice.call(contentWrapper.querySelectorAll('li[data-index]'));
  
  elements.forEach(function (el, index) {
    var dataIndex = +el.getAttribute('data-index');
    if (dataIndex !==  index) {
      el.classList.add('error');
    }
    el.setAttribute('value', dataIndex + 1);
  });
  contentWrapper.classList.add('checked');
});
</script>
  `;
  return {
    front,
    back: `<p>${card.comment}</p>`,
    tags: tags || [],
  };
};
