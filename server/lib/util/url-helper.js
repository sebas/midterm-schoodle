
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}


module.exports = function urlGenerator(){
     let rndStr = "";
     const charset = '0123456789ABCDEFGHIJLKNOPQRSTVYXZabcdefghiklmnopqrstvyzx';

     for (let i = 0; i < 10; i++) {
       const index = getRandomInt(charset.length);
       rndStr += charset.charAt(index);
     }

     return rndStr;
}