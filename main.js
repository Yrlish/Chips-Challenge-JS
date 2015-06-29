window.onload = function() {
  try {
    Game.run();
  } catch(e) {
    console.log(e.stack);
  }
}

var Game = {
  config: {
    fps: 60,
    width: function() {return Levels.properties.width * Levels.properties.tile.width},
    height: function() {return Levels.properties.height * Levels.properties.tile.height},
    levels: 2,
  },
  run: function() {
    Game.block = document.createElement("div");
    Game.block.style.margin = "0 auto";
    Game.block.style.position = "relative";
    Game.block.style.display = "table";
    document.body.appendChild(Game.block);

    // Create the canvas element and get the context object
    document.body.style.font = "16px Monospace";
    Game.canvas = document.createElement("canvas");
    Game.canvas.height = Game.config.height();
    Game.canvas.width = Game.config.width();
    Game.canvas.style.border = "1px solid black";
    Game.block.appendChild(Game.canvas);
    Game.context = Game.canvas.getContext("2d");

    Game.info = document.createElement("div");
    Game.info.className = "info";
    Game.info.style.position = "absolute";
    Game.info.style.top = 0;
    Game.info.style.right = "-260px";
    Game.info.style.width = "250px";
    Game.block.appendChild(Game.info);

    Game.info2 = document.createElement("div");
    Game.info2.className = "info2";
    Game.info2.style.position = "absolute";
    Game.info2.style.top = 0;
    Game.info2.style.left = "-210px";
    Game.info2.style.width = "200px";
    Game.block.appendChild(Game.info2);

    Game.bottom = document.createElement('div');
    Game.bottom.style.textAlign = "center";
    Game.block.appendChild(Game.bottom);

    // Create the keys array.
    Game.keys = new Array(256);
    for (var i = 0; i < Game.keys.length; i++) {
      Game.keys[i] = false;
    };

    date = new Date()
    Game.timer = date.getTime();
    Game.frames = 0;
    Game.fps = 0;

    // Key listener
    document.addEventListener('keydown', function(event) {
      Game.keys[event.keyCode] = true;
      console.log(event.keyCode + " down");
    });
    document.addEventListener('keyup', function(event) {
      Game.keys[event.keyCode] = false;
      console.log(event.keyCode + " up");
    });

    Levels.setupLevel(1);

    // Load resources
    Assets.load();

    Game.updateInterval = setInterval("Game.update()", 1000 / Game.config.fps);
  },
  update: function() {
    if(Game.assetsLoaded != undefined) {
      if(Game.keys[82] == true) {
        Levels.setupLevel(Game.currentLevel);
        Game.keys[82] = false;
      }
      if(Game.keys[37] == true && Game.keys[38] == false && Game.keys[39] == false && Game.keys[40] == false)
        Player.moveLeft();
      if(Game.keys[37] == false && Game.keys[38] == true && Game.keys[39] == false && Game.keys[40] == false)
        Player.moveUp();
      if(Game.keys[37] == false && Game.keys[38] == false && Game.keys[39] == true && Game.keys[40] == false)
        Player.moveRight();
      if(Game.keys[37] == false && Game.keys[38] == false && Game.keys[39] == false && Game.keys[40] == true)
        Player.moveDown();

      help = "<b>Level " + Game.currentLevel + "</b><br>";
      help+= eval("Levels.help.lvl" + Game.currentLevel);
      help+= "<br><br>";
      help+= "<b>Controls:</b><br>";
      help+= "Arrow keys - Move<br>";
      help+= "R - Restart level<br>";
      Game.info2.innerHTML = help;

      stats = "<table>";
      stats += "<tr><td width=\"160\">Chips left:</td><td>" + Player.items.chips_left + "</td></tr>";
      //stats += "<tr><td>Seconds played:</td><td>" + Player.seconds + "</td></tr>";
      if(Player.items.key_red > 0)
        stats += "<tr><td>Red keys:</td><td>" + Player.items.key_red + "</td></tr>";
      if(Player.items.key_blue > 0)
        stats += "<tr><td>Blue keys:</td><td>" + Player.items.key_blue + "</td></tr>";
      if(Player.items.key_green > 0)
        stats += "<tr><td>Green keys:</td><td>" + Player.items.key_green + "</td></tr>";
      if(Player.items.key_yellow > 0)
        stats += "<tr><td>Yellow keys:</td><td>" + Player.items.key_yellow + "</td></tr>";
      if(Player.items.boots_fire > 0)
        stats += "<tr><td>Yellow keys:</td><td>" + Player.items.boots_fire + "</td></tr>";
      if(Player.items.boots_ice > 0)
        stats += "<tr><td>Yellow keys:</td><td>" + Player.items.boots_ice + "</td></tr>";
      if(Player.items.boots_water > 0)
        stats += "<tr><td>Yellow keys:</td><td>" + Player.items.boots_water + "</td></tr>";
      if(Player.items.boots_sticky > 0)
        stats += "<tr><td>Yellow keys:</td><td>" + Player.items.boots_sticky + "</td></tr>";
      stats += "<tr><td> </td></tr>";
      stats += "<tr><th>Debug</th></tr>";
      stats += "<tr><td>PlayerX</td><td>" + Player.posX + "</td></tr>";
      stats += "<tr><td>PlayerY</td><td>" + Player.posY + "</td></tr>";
      stats += "<tr><td>fps</td><td>" + Game.fps + "</td></tr>";
      stats += "</table>"
      Game.info.innerHTML = stats;

      if(Game.respawnCounter != null) {
       Game.bottom.innerHTML = "(re)loading level in " + Game.respawnCounter + " seconds...<br><br>Game created by <a href=\"http://ylar.se\" target=\"_blank\">Dennis Yrlish</a> (@Yrlish)";
      } else {
        Game.bottom.innerHTML = "Game created by <a href=\"http://ylar.se\" target=\"_blank\">Dennis Yrlish</a> (@Yrlish)<br>The game only has two levels.";
      }

    }
    
    this.render();

    date = new Date();
    if (date.getTime() - Game.timer > 1000) {
      Game.timer += 1000;
      Game.fps = Game.frames;
      Game.frames = 0;

      //if(Player.playable == true && Levels.dead != true && Levels.levelLoaded == true && Levels.levelComplete == false)
      //  Player.seconds++;

      if(Game.respawnCounter == undefined)
        Game.respawnCounter = null;
      if(Game.respawnCounter == 0)
        Game.respawnCounter = null;
      if(Game.respawnCounter != null)
        Game.respawnCounter -= 1;

      if(Game.goalTick == undefined)
        Game.goalTick = 0;
      Game.goalTick++;
      if(Game.goalTick == 3)
        Game.goalTick = 0;
    }    
  },
  render: function() {
    if(Game.assetsLoaded == undefined) {
      Assets.render();
      return;
    }

    Levels.render();

    if(Levels.levelLoaded == true)
      Player.render();

    Game.frames++;
  },
};




