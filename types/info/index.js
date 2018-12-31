module.exports = ({ card, tags }) => {
  const back = `
    <p class="wrapper">
      ${card.comment}
    </p>
    
    <style>
      .wrapper {
        text-align: left
      }  
    </style>
  `;

  return {
    front: card.question,
    back,
    tags: tags || [],
  }
}