module.exports = ({ card, tags }) => {
  return {
    front: card.question,
    back: card.comment,
    tags: tags || [],
  }
}