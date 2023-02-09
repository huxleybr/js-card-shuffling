// intentionally create a global
Deck = function Deck() {
  
  // TODO  : make appropriate vars settable
  var Suits     = ['c', 'h', 'd', 's'], 
      Pack      = [], 
      cardsOut  = [],
      cardCount = 52,
      rv = 6, // riffleVariance
      cv = 10, // cutVariance
      ov = 9, // overVariance
      nv = 2; // runVariance

  var Internal  = {

    remember : function(card) {
      cardsOut.push(card);
    },

    generatePack : function generatePack() {
      Pack = []; // clear pack

      for (var i = 4; i > 0 ; i--) {
        for (var j = 13; j > 0; j--) {

          var name, val = j, suit = Suits[i-1];
          switch(j) {
            case 1  : name = "A" + suit; break;
            case 11 : name = "J" + suit; break;
            case 12 : name = "Q" + suit; break;
            case 13 : name = "K" + suit; break;
            default : name  = j + suit; break;
          }

          Pack.push({ n : name, v : val, s : suit });

        }
      }

      return this;
    },

    riffle : function riffle() {
      var cutPos = Math.floor(Math.random()*rv)+( (cardCount-rv) / 2 );
      var splitPack = {
        left : Pack.splice(0, cutPos),
        right : Pack.splice(0, Pack.length)
      };
      
      var hand  = 'right',result = [], i = 52, cards;
      
      while(i > 0) {
        drop  = Math.floor(Math.random()*3)+1;
        
        if (drop >= splitPack[ hand ].length) {
          drop = splitPack[ hand ].length;
        } 
        
        cards = splitPack[ hand ].splice(0, drop);
        hand = (hand === 'left') ? 'right' : 'left';
        
        result = result.concat(cards);
        cards = [];
        i -= drop;
        
      }
      
      Pack = result;
      console.log(Pack.length+" after riffle");
      return this;
    },

    overHand : function overHand(run) {
      var cards, drop, result = [], i = cardCount;
      var variance = (run) ? nv : ov;
      
      while (i > 0) {
        drop = Math.floor(Math.random()*variance)+1;

        if (drop >= Pack.length) {
          drop = Pack.length;
        } 
          
        cards = Pack.splice(0, drop);

        result = result.concat(cards);
        cards = [];
        i -= drop;
        
      }
      
      Pack = result;
      console.log(Pack.length+" after over hand!");
      return this;
    },
    
    overHandRun : function overHandRun() {
          
          this.overHand(true);
          
          console.log(Pack.length+" after run");
          return this;
        },

    cut : function cut(fn) {
      var cutPos = Math.floor(Math.random()*cv)+(
        (cardCount-cv) / 2
      );
      var top     = Pack.slice(0, cutPos);
      var bottom = Pack.slice(cutPos, 52);

      Pack = bottom.concat(top);
      
      console.log(Pack.length+" after cut");
      if (fn && typeof(fn) === 'function') { fn(); }
      return this;
    }
      
  }; // end 'Internal'
  
  /* Public */
  this.methods = {
    getCardsOut : function cardsOut() {
      return cardsOut;
    },
    
    getPack : function showPack() {
      return Pack;
    },

    // Deal a  single Card from the deck
    dealOne : function deal(cb) {
        var card = Pack.shift();
      Internal.remember(card);
      
      if (cb && typeof(cb) === 'function') { cb(); }
      
      return card;
    },

    dealMany : function dealMany(num) {
      for (var i = 0; i < num; i++) {
        this.dealOne();
      }
    },
    
    burnOne : function burnOne() {
      var card = Pack.shift();
      Internal.remember(card);
      
      if (cb && typeof(cb) === 'function') { cb(); }
      
      return this;
    },

    // resets the deck
    proShuffle   : function shuffle(cb) {
      cardsOut = [];
      Internal.generatePack().cut().riffle().overHand().riffle()
                .overHandRun().riffle().overHand().riffle().overHandRun()
                .cut().riffle().overHand().riffle().overHandRun()
                .riffle().cut();
      

      if (cb && typeof(cb) === 'function') { cb(); }
    },
    
    getCardPoints : function(cardObj) {
      var val = cardObj.v;
      
      if (val > 10) { return 10; } 
      else if (val === 1) { return 11; } 
      else { return val;  }
    },
    
  }; // end Methods;
  
};

var MyCards = new Deck, players = 3, cardsPerHand = 2, hands={}, i;
console.log(MyCards);
MyCards.methods.proShuffle();
//console.log(MyCards.methods.getPack());


while(cardsPerHand--) {
  i = 0;
  while (i < players) {
    hands[i] = hands[i] || [];
    hands[i].push(MyCards.methods.dealOne());
    i++;
  }
}

console.log(hands);
console.log(MyCards.methods.getCardsOut());
