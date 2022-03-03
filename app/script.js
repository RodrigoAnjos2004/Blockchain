const _btc = 0.15;
const _eth = 0.2;
const _ltc = 2.05;

$(document).ready(function () {
  getCryptoPrices();
  getStocks();
});

function getCryptoPrices() {
  const url = "https://api.coinmarketcap.com/v1/ticker/?limit=10";
  data = $.ajax({
    type: "GET",
    url: url,
    dataType: "json",
    success: function (data) {
      var arr = [];
      for (var i = 0; i < data.length; i++) {
        if (
          data[i].id === "bitcoin" ||
          data[i].id === "ethereum" ||
          data[i].id === "litecoin"
        ) {
          arr.push(data[i]);
          arr.sort();
        }
      }

      if (arr[2].price_usd == 305 || arr[2].price_usd == 290) {
        alert("!!!!!");
      }

      let bwallet = Math.round(arr[0].price_usd * _btc);
      let ewallet = Math.round(arr[1].price_usd * _eth);
      let lwallet = Math.round(arr[2].price_usd * _ltc);

      $("#bitcoin .name").text(arr[0].name + "(" + arr[0].symbol + ")");
      $("#bitcoin .price").text("$" + arr[0].price_usd + " USD");
      $("#bitcoin .change").text(arr[0].percent_change_1h + "%");
      $("#bitcoin .worth").text("$" + bwallet);

      $("#ethereum .name").text(arr[1].name + "(" + arr[1].symbol + ")");
      $("#ethereum .price").text("$" + arr[1].price_usd + " USD");
      $("#ethereum .change").text(arr[1].percent_change_1h + "%");
      $("#ethereum .worth").text("$" + ewallet);

      $("#litecoin .name").text(arr[2].name + "(" + arr[2].symbol + ")");
      $("#litecoin .price").text("$" + arr[2].price_usd + " USD");
      $("#litecoin .change").text(arr[2].percent_change_1h + "%");
      $("#litecoin .worth").text("$" + lwallet);

      $("#total .name").text("Total: ");
      $("#total .price").text("");
      $("#total .change").text("");
      $("#total .worth").text("$" + (bwallet + ewallet + lwallet));

      for (var i = 0; i < arr.length; i++) {
        if (arr[i].percent_change_1h < 0) {
          $("#" + arr[i].id + " .change").addClass("negative");
          $("#" + arr[i].id + " .change").prepend("&#ff0000; ");
        } else {
          $("#" + arr[i].id + " .change").addClass("positive");
          $("#" + arr[i].id + " .change").prepend("&#8593; ");
        }
      }
    },
  });
}

function getStocks() {
  new TradingView.MediumWidget({
    container_id: "tv-medium-widget-5e6f9",
    symbols: [
      ["Apple", "AAPL "],
      ["Google", "GOOGL"],
      ["Microsoft", "MSFT"],
      ["Bitcoin", "COINBASE:BTCUSD|1y"],
      ["Ethereum", "COINBASE:ETHUSD|1y"],
      ["Litecoin", "COINBASE:LTCUSD|1y"],
    ],
    greyText: "Quotes by",
    gridLineColor: "#e9e9ea",
    fontColor: "#83888D",
    underLineColor: "#993399  ",
    trendLineColor: "#4bafe9",
    width: "100%",
    height: "750px",
    locale: "pt",
  });
}

setInterval(getCryptoPrices, 10000);

(function () {
  var canvas,
    ctx,
    circ,
    nodes,
    mouse,
    SENSITIVITY,
    SIBLINGS_LIMIT,
    DENSITY,
    NODES_QTY,
    ANCHOR_LENGTH,
    MOUSE_RADIUS;

  // how close next node must be to activate connection (in px)
  // shorter distance == better connection (line width)
  SENSITIVITY = 100;
  // note that siblings limit is not 'accurate' as the node can actually have more connections than this value that's because the node accepts sibling nodes with no regard to their current connections this is acceptable because potential fix would not result in significant visual difference
  // more siblings == bigger node
  SIBLINGS_LIMIT = 10;
  // default node margin
  DENSITY = 50;
  // total number of nodes used (incremented after creation)
  NODES_QTY = 0;
  // avoid nodes spreading
  ANCHOR_LENGTH = 20;
  // highlight radius
  MOUSE_RADIUS = 200;

  circ = 2 * Math.PI;
  nodes = [];

  canvas = document.querySelector("canvas");
  resizeWindow();
  mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2,
  };
  ctx = canvas.getContext("2d");
  if (!ctx) {
    alert("Ooops! Your browser does not support canvas :'(");
  }

  function Node(x, y) {
    this.anchorX = x;
    this.anchorY = y;
    this.x = Math.random() * (x - (x - ANCHOR_LENGTH)) + (x - ANCHOR_LENGTH);
    this.y = Math.random() * (y - (y - ANCHOR_LENGTH)) + (y - ANCHOR_LENGTH);
    this.vx = Math.random() * 2 - 1;
    this.vy = Math.random() * 2 - 1;
    this.energy = Math.random() * 100;
    this.radius = Math.random();
    this.siblings = [];
    this.brightness = 0;
  }

  Node.prototype.drawNode = function () {
    var color = "rgba(255, 0, 0, " + this.brightness + ")";
    ctx.beginPath();
    ctx.arc(
      this.x,
      this.y,
      2 * this.radius + (2 * this.siblings.length) / SIBLINGS_LIMIT,
      0,
      circ
    );
    ctx.fillStyle = color;
    ctx.fill();
  };

  Node.prototype.drawConnections = function () {
    for (var i = 0; i < this.siblings.length; i++) {
      var color = "rgba(255, 0, 0, " + this.brightness + ")";
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.siblings[i].x, this.siblings[i].y);
      ctx.lineWidth = 1 - calcDistance(this, this.siblings[i]) / SENSITIVITY;
      ctx.strokeStyle = color;
      ctx.stroke();
    }
  };

  Node.prototype.moveNode = function () {
    this.energy -= 2;
    if (this.energy < 1) {
      this.energy = Math.random() * 100;
      if (this.x - this.anchorX < -ANCHOR_LENGTH) {
        this.vx = Math.random() * 2;
      } else if (this.x - this.anchorX > ANCHOR_LENGTH) {
        this.vx = Math.random() * -2;
      } else {
        this.vx = Math.random() * 4 - 2;
      }
      if (this.y - this.anchorY < -ANCHOR_LENGTH) {
        this.vy = Math.random() * 2;
      } else if (this.y - this.anchorY > ANCHOR_LENGTH) {
        this.vy = Math.random() * -2;
      } else {
        this.vy = Math.random() * 4 - 2;
      }
    }
    this.x += (this.vx * this.energy) / 100;
    this.y += (this.vy * this.energy) / 100;
  };

  function initNodes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    nodes = [];
    for (var i = DENSITY; i < canvas.width; i += DENSITY) {
      for (var j = DENSITY; j < canvas.height; j += DENSITY) {
        nodes.push(new Node(i, j));
        NODES_QTY++;
      }
    }
  }

  function calcDistance(node1, node2) {
    return Math.sqrt(
      Math.pow(node1.x - node2.x, 2) + Math.pow(node1.y - node2.y, 2)
    );
  }

  function findSiblings() {
    var node1, node2, distance;
    for (var i = 0; i < NODES_QTY; i++) {
      node1 = nodes[i];
      node1.siblings = [];
      for (var j = 0; j < NODES_QTY; j++) {
        node2 = nodes[j];
        if (node1 !== node2) {
          distance = calcDistance(node1, node2);
          if (distance < SENSITIVITY) {
            if (node1.siblings.length < SIBLINGS_LIMIT) {
              node1.siblings.push(node2);
            } else {
              var node_sibling_distance = 0;
              var max_distance = 0;
              var s;
              for (var k = 0; k < SIBLINGS_LIMIT; k++) {
                node_sibling_distance = calcDistance(node1, node1.siblings[k]);
                if (node_sibling_distance > max_distance) {
                  max_distance = node_sibling_distance;
                  s = k;
                }
              }
              if (distance < max_distance) {
                node1.siblings.splice(s, 1);
                node1.siblings.push(node2);
              }
            }
          }
        }
      }
    }
  }

  function redrawScene() {
    resizeWindow();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    findSiblings();
    var i, node, distance;
    for (i = 0; i < NODES_QTY; i++) {
      node = nodes[i];
      distance = calcDistance(
        {
          x: mouse.x,
          y: mouse.y,
        },
        node
      );
      if (distance < MOUSE_RADIUS) {
        node.brightness = 1 - distance / MOUSE_RADIUS;
      } else {
        node.brightness = 0;
      }
    }
    for (i = 0; i < NODES_QTY; i++) {
      node = nodes[i];
      if (node.brightness) {
        node.drawNode();
        node.drawConnections();
      }
      node.moveNode();
    }
    requestAnimationFrame(redrawScene);
  }

  function initHandlers() {
    document.addEventListener("resize", resizeWindow, false);
    canvas.addEventListener("mousemove", mousemoveHandler, false);
  }

  function resizeWindow() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function mousemoveHandler(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }

  initHandlers();
  initNodes();
  redrawScene();
})();
