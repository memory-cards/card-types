module.exports = ({ card, tags }) => {
  const back = `
    <p class="wrapper">
      ${card.comment}
    </p>
    
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

  return {
    front: card.question,
    back,
    tags: tags || [],
  };
};
