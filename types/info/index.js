module.exports = ({ card, tags }) => {
  const front = `
    ${card.question}
    <style>
      html {
        font-size: 150%;
      }
      
      @media only screen and (max-device-width: 600px) {
        html {
          font-size: 70%;
        }
      }

      .wrapper {
        text-align: left
      }
    </style>
  `;
  const back = `
    <p class="wrapper">
      ${card.comment}
    </p>
  `;

  return {
    front,
    back,
    tags: tags || [],
  };
};
