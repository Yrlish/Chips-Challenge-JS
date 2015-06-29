var Player = {
  posX: 0,
  posY: 0,
  moved: false,
  facing: 3,
  killedByFire: false,
  killedByWater: false,
  playable: false,
  seconds: 0,
  items: {
    key_red: 0,
    key_blue: 0,
    key_green: 0,
    key_yellow: 0,
    chips_left: 0,
    boots_fire: 0,
    boots_ice: 0,
    boots_water: 0,
    boots_sticky: 0,
  },
  reset: function() {
    Player.playable = true;
    Player.killedByFire = false;
    Player.killedByWater = false;
    Player.facing = 3;
    Player.items.chips_left = 0;
    Player.items.key_red = 0;
    Player.items.key_blue = 0;
    Player.items.key_green = 0;
    Player.items.key_yellow = 0;
    Player.items.boots_fire = 0;
    Player.items.boots_sticky = 0;
    Player.items.boots_water = 0;
    Player.items.boots_ice = 0;
  },
  moveLeft: function() {
    if(Player.playable == false) return;
    if(Levels.checkTile(Player.posX-1, Player.posY)) {
      Game.keys[37] = false;
      Player.facing = 0;
      Player.posX -= 1;
      clearTimeout(Player.timeout);
      Player.timeout = setTimeout(function() {
        Player.facing = 3;
      }, 1000);
    }
  },
  moveUp: function() {
    if(Player.playable == false) return;
    if(Levels.checkTile(Player.posX, Player.posY-1)) {
      Game.keys[38] = false;
      Player.facing = 1;
      Player.posY -= 1;
      clearTimeout(Player.timeout);
      Player.timeout = setTimeout(function() {
        Player.facing = 3;
      }, 1000);
    }
  },
  moveRight: function() {
    if(Player.playable == false) return;
    if(Levels.checkTile(Player.posX+1, Player.posY)) {
      Game.keys[39] = false;
      Player.facing = 2;
      Player.posX += 1;
      clearTimeout(Player.timeout);
      Player.timeout = setTimeout(function() {
        Player.facing = 3;
      }, 1000);
    }
  },
  moveDown: function() {
    if(Player.playable == false) return;
    if(Levels.checkTile(Player.posX, Player.posY+1)) {
      Game.keys[40] = false;
      Player.facing = 3;
      Player.posY += 1;
      clearTimeout(Player.timeout);
    }
  },
  render: function() {
    posX = Game.canvas.width/2 - 16;
    posY = Game.canvas.height/2 - 16;
    var asset;

    switch(Player.facing) {
      case 0:
        asset = Assets.images.player_left;
        break;
      case 1:
        asset = Assets.images.player_up;
        break;
      case 2:
        asset = Assets.images.player_right;
        break;
      default:
        asset = Assets.images.player_down;
        break;
    }

    if(Player.killedByFire == true)
      asset = Assets.images.killed_fire;
    if(Player.killedByWater == true)
      asset = Assets.images.killed_water;
    if(Levels.levelComplete == true)
      asset = Assets.images.player_win;

    Game.context.drawImage(asset, posX, posY);
  }
}