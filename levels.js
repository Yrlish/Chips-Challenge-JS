var Levels = {
  properties: {
    width:  11,
    height: 11,
    tile: {
      width:  32,
      height: 32,
    },
  },
  tiles: null,
  tileType: {
    TILE: 0,
    WALL: 1,
    FIRE: 2,
    FIREBALL: 3,
    KILLED_FIRE: 4,
    CHIP: 5,
    DOOR_GREEN: 6,
    DOOR_BLUE: 7,
    DOOR_RED: 8,
    DOOR_YELLOW: 9,
    KEY_GREEN: 10,
    KEY_BLUE: 11,
    KEY_RED: 12,
    KEY_YELLOW: 13,
    GOAL: 14,
    CHIP_DOOR: 15,
    HELP: 16,
    KILLED_FIREBALL: 17,
    PLAYER: 18,
    WATER: 19,
    ICE: 20,
    ICE_BOTTOM_RIGHT: 21,
    ICE_BOTTOM_LEFT: 22,
    ICE_TOP_RIGHT: 23,
    ICE_TOP_LEFT: 24,
    KILLED_WATER: 25,
    BOOTS_WATER: 26,
    BOOTS_FIRE: 27,
    BOOTS_ICE: 28,
    BOOTS_STICKY: 29,
  },
  setupLevel: function(level) {
    if(level != undefined) {
      if(Levels.levelLoaded == undefined)
        Levels.levelLoaded = false;

      var ajax;
      if (window.XMLHttpRequest) ajax = new XMLHttpRequest();
      else ajax = new ActiveXObject("Microsoft.XMLHTTP");

      ajax.onreadystatechange = function() {
        if (ajax.readyState == 4 & ajax.status == 200) {
          var data = JSON.parse(ajax.responseText);
          Levels.properties.width = data.layers[0].width;
          Levels.properties.height = data.layers[0].height;

          Levels.tiles = new Array(Levels.properties.width);
          for (var y = 0; y < Levels.properties.width; y++) {
            Levels.tiles[y] = new Array(Levels.properties.height);
          }

          pos = 0;

          for (var y = 0; y < Levels.properties.height; y++) {
            for (var x = 0; x < Levels.properties.width; x++) {
              Levels.tiles[x][y] = (data.layers[0].data[pos] - 1);
              pos++;

              if(Levels.tiles[x][y] == Levels.tileType.PLAYER) {
                Levels.tiles[x][y] = Levels.tileType.TILE;
                Player.posX = x;
                Player.posY = y;
              }
              if(Levels.tiles[x][y] == Levels.tileType.CHIP)
                Player.items.chips_left++;
            }
          }
          Levels.levelLoaded = true;
          document.body.focus();

        }
      }

      Levels.levelComplete = false;
      Levels.levelLoaded = false;
      Game.currentLevel = level;
      Levels.tiles = null;
      Player.reset();

      ajax.open("GET", "levels/level" + level + ".json", true);
      ajax.send();
    }
  },
  checkTile: function(x, y) {
    //return true;
    tileType = this.tiles[x][y];
    switch(tileType) {
      case this.tileType.TILE:
        return true;
      case this.tileType.CHIP:
        Player.items.chips_left--;
        this.tiles[x][y] = this.tileType.TILE;
        return true;
      case this.tileType.CHIP_DOOR:
        if(Player.items.chips_left == 0) {
          this.tiles[x][y] = this.tileType.TILE;
          return true;
        }
        return false;
      case this.tileType.GOAL:
        Levels.win();
        return true;
      case this.tileType.KEY_GREEN:
        Player.items.key_green++;
        this.tiles[x][y] = this.tileType.TILE;
        return true;
      case this.tileType.DOOR_GREEN:
        if(Player.items.key_green > 0) {
          Player.items.key_green--;
          this.tiles[x][y] = this.tileType.TILE;
          return true;
        }
        return false;
      case this.tileType.KEY_RED:
        Player.items.key_red++;
        this.tiles[x][y] = this.tileType.TILE;
        return true;
      case this.tileType.DOOR_RED:
        if(Player.items.key_red > 0) {
          Player.items.key_red--;
          this.tiles[x][y] = this.tileType.TILE;
          return true;
        }
        return false;
      case this.tileType.KEY_BLUE:
        Player.items.key_blue++;
        this.tiles[x][y] = this.tileType.TILE;
        return true;
      case this.tileType.DOOR_BLUE:
        if(Player.items.key_blue > 0) {
          Player.items.key_blue--;
          this.tiles[x][y] = this.tileType.TILE;
          return true;
        }
        return false;
      case this.tileType.KEY_YELLOW:
        Player.items.key_yellow++;
        this.tiles[x][y] = this.tileType.TILE;
        return true;
      case this.tileType.DOOR_YELLOW:
        if(Player.items.key_yellow > 0) {
          Player.items.key_yellow--;
          this.tiles[x][y] = this.tileType.TILE;
          return true;
        }
        return false;
      case this.tileType.FIRE:
        if(Player.items.boots_fire == 0)
          Levels.die("fire");
        return true;
      case this.tileType.WATER:
        if(Player.items.boots_water == 0)
          Levels.die("water");
        return true;
      case this.tileType.BOOTS_FIRE:
        Player.items.boots_fire++;
        this.tiles[x][y] = this.tileType.TILE;
        return true;
      case this.tileType.BOOTS_ICE:
        Player.items.boots_ice++;
        this.tiles[x][y] = this.tileType.TILE;
        return true;
      case this.tileType.BOOTS_WATER:
        Player.items.boots_water++;
        this.tiles[x][y] = this.tileType.TILE;
        return true;
      case this.tileType.BOOTS_STICKY:
        Player.items.boots_sticky++;
        this.tiles[x][y] = this.tileType.TILE;
        return true;

      default:
        return false;
    }
  },
  help: {
    lvl1: "Collect chips to get past the chips socket. Use keys to open doors.",
    lvl2: "Don't step on the fire.",
  },
  die: function(str) {
    Player.playable = false;
    if(str == "fire")
      Player.killedByFire = true;
    if(str == "water")
      Player.killedByWater = true;
    if(Levels.dead != true) {
      Levels.dead = true;
      Game.respawnCounter = 3;
      setTimeout(function() {
        Levels.dead = false;
        Levels.setupLevel(Game.currentLevel);
      }, 3000);      
    }
  },
  win: function() {
    if(Levels.levelComplete == false) {
      Levels.levelComplete = true;
      Player.playable = false;
      Game.respawnCounter = 3;
      setTimeout(function() {
        Levels.setupLevel(Game.currentLevel + 1);
      }, 3000);
    }
  },
  render: function() {
    Game.context.fillStyle = "rgb(220,220,220)";
    Game.context.fillRect(0, 0, Game.canvas.width, Game.canvas.height);

    if(Levels.levelLoaded == false) {
      Game.context.fillStyle = "rgb(0,0,0)";

      Game.context.font = "26px Monospace";
      text = "Loading level...";
      textWidth = Game.context.measureText(text);
      posX = (Game.canvas.width / 2) - (textWidth.width / 2);
      posY = (Game.canvas.height / 2);
      Game.context.fillText(text, posX, posY);

      return;
    }

    for(var x = 0; x < Levels.properties.width; x++) {
      for(var y = 0; y < Levels.properties.height; y ++) {
        var tileType = Levels.tiles[x][y];
        var asset;

        if(tileType == Levels.tileType.GOAL) {
          if(Game.goalTick == 0)
            asset = Assets.images.goal;
          if(Game.goalTick == 1)
            asset = Assets.images.goal2;
          if(Game.goalTick == 2)
            asset = Assets.images.goal3;
        }
        else if(tileType == Levels.tileType.TILE)
          asset = Assets.images.tile;
        else if(tileType == Levels.tileType.WALL)
          asset = Assets.images.wall;
        else if(tileType == Levels.tileType.CHIP)
          asset = Assets.images.chip;
        else if(tileType == Levels.tileType.CHIP_DOOR)
          asset = Assets.images.chip_door;
        else if(tileType == Levels.tileType.FIREBALL)
          asset = Assets.images.fireball;
        else if(tileType == Levels.tileType.FIRE)
          asset = Assets.images.fire;
        else if(tileType == Levels.tileType.DOOR_RED)
          asset = Assets.images.door_red;
        else if(tileType == Levels.tileType.DOOR_BLUE)
          asset = Assets.images.door_blue;
        else if(tileType == Levels.tileType.DOOR_GREEN)
          asset = Assets.images.door_green;
        else if(tileType == Levels.tileType.DOOR_YELLOW)
          asset = Assets.images.door_yellow;
        else if(tileType == Levels.tileType.KEY_RED)
          asset = Assets.images.key_red;
        else if(tileType == Levels.tileType.KEY_BLUE)
          asset = Assets.images.key_blue;
        else if(tileType == Levels.tileType.KEY_GREEN)
          asset = Assets.images.key_green;
        else if(tileType == Levels.tileType.KEY_YELLOW)
          asset = Assets.images.key_yellow;
        else if(tileType == Levels.tileType.HELP)
          asset = Assets.images.help;
        else if(tileType == Levels.tileType.WATER)
          asset = Assets.images.water;
        else if(tileType == Levels.tileType.ICE)
          asset = Assets.images.ice;
        else if(tileType == Levels.tileType.ICE_BOTTOM_RIGHT)
          asset = Assets.images.ice_bottom_right;
        else if(tileType == Levels.tileType.ICE_BOTTOM_LEFT)
          asset = Assets.images.ice_bottom_left;
        else if(tileType == Levels.tileType.ICE_TOP_RIGHT)
          asset = Assets.images.ice_top_right;
        else if(tileType == Levels.tileType.ICE_TOP_LEFT)
          asset = Assets.images.ice_top_left;
        else if(tileType == Levels.tileType.BOOTS_ICE)
          asset = Assets.images.boots_ice;
        else if(tileType == Levels.tileType.BOOTS_FIRE)
          asset = Assets.images.boots_fire;
        else if(tileType == Levels.tileType.BOOTS_WATER)
          asset = Assets.images.boots_water;
        else if(tileType == Levels.tileType.BOOTS_STICKY)
          asset = Assets.images.boots_sticky;
        else 
          asset = Assets.images.tile;


        posX = (x-1) * Levels.properties.tile.width + ((Game.canvas.width)/2 - (Player.posX * Levels.properties.tile.width)) + Levels.properties.tile.width/2;
        posY = (y-1) * Levels.properties.tile.height + ((Game.canvas.height)/2 - (Player.posY * Levels.properties.tile.height)) + Levels.properties.tile.height/2;

        //posX = x * Levels.properties.tile.width + ((Game.canvas.width/2) - (Levels.properties.width * Levels.properties.tile.width)/2);
        //posY = y * Levels.properties.tile.height + ((Game.canvas.height/2) - (Levels.properties.height * Levels.properties.tile.height)/2);
        if(Math.abs( Player.posX - x ) < 6 && Math.abs( Player.posY - y ) < 6)
          Game.context.drawImage(asset, posX, posY);
      }
    }
  }
}

