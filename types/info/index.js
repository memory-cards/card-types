module.exports = ({ card, tags }) => {
  const back = `
    <p text-align="left">
      ${card.comment}
    </p>25
  `;

  return {
    front: card.question,
    back,
    tags: tags || [],
  }
}