module.exports = ({ card, tags }) => {
  const back = `
    <p align="justify">
      ${card.comment}
    </p>
  `;

  return {
    front: card.question,
    back,
    tags: tags || [],
  }
}