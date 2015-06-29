var Assets = {
  _images: [
    "assets/player_down.png",
    "assets/player_up.png",
    "assets/player_left.png",
    "assets/player_right.png",
    "assets/tile.png",
    "assets/wall.png",
    "assets/chip.png",
    "assets/chip_door.png",
    "assets/goal.png",
    "assets/goal2.png",
    "assets/goal3.png",
    "assets/player_win.png",
    "assets/fire.png",
    "assets/fireball.png",
    "assets/key_blue.png",
    "assets/key_red.png",
    "assets/key_green.png",
    "assets/key_yellow.png",
    "assets/door_blue.png",
    "assets/door_red.png",
    "assets/door_green.png",
    "assets/door_yellow.png",
    "assets/killed_burned.png",
    "assets/killed_fire.png",
    "assets/help.png",
    "assets/boots_ice.png",
    "assets/boots_fire.png",
    "assets/boots_sticky.png",
    "assets/boots_water.png",
    "assets/ice.png",
    "assets/water.png",
    "assets/killed_water.png",
    "assets/ice_bottom_right.png",
    "assets/ice_bottom_left.png",
    "assets/ice_top_right.png",
    "assets/ice_top_left.png",
    "assets/roller_up.png",
    "assets/roller_down.png",
    "assets/roller_left.png",
    "assets/roller_right.png",
  ],
  images: {},
  loaded: 0,
  load: function() {
    images = this._images;

    for (var i = 0; i < images.length; i++) {
      temp = images[i].split("/");
      temp = temp[1].split(".");
      temp = temp[0];

      eval("Assets.images." + temp + " = new Image();");
      eval("Assets.images." + temp + ".src = '" + images[i] + "'");

      eval("Assets.images." + temp + ".onload = function() {Assets.loaded++;}");
    };
  },
  render: function() {
    Game.context.fillStyle = "rgb(220,220,220)";
    Game.context.fillRect(0, 0, Game.canvas.width, Game.canvas.height);

    Game.context.fillStyle = "rgb(0,0,0)";

    Game.context.font = "22px Monospace";
    text = "Please wait";
    textWidth = Game.context.measureText(text);
    posX = (Game.canvas.width / 2) - (textWidth.width / 2);
    posY = (Game.canvas.height / 2) - 18;
    Game.context.fillText(text, posX, posY);

    Game.context.font = "36px Monospace";
    text = "Loading assets";
    textWidth = Game.context.measureText(text);
    posX = (Game.canvas.width / 2) - (textWidth.width / 2);
    posY = (Game.canvas.height / 2) - 42;
    Game.context.fillText(text, posX, posY);


    if(Assets.loaded == Assets._images.length && Assets.done != true) {
      Assets.done = true;
      setTimeout(function() {
        Game.assetsLoaded = true;
      }, 750);
    }

    posX = (Game.canvas.width / 2) - (300 / 2);
    posY = (Game.canvas.height / 2);

    Game.context.fillStyle = "rgb(0,0,0)";
    Game.context.fillRect(posX-2, posY-2, 304, 24);

    Game.context.fillStyle = "rgb(0,175,0)";
    Game.context.fillRect(posX, posY, ((Assets.loaded / Assets._images.length) * 300), 20);

    Game.context.font = "18px Monospace";
    Game.context.fillStyle = "rgb(255,255,255)";
    text = Assets.loaded + ' of ' + Assets._images.length + ' done (' + Math.round((Assets.loaded / Assets._images.length) * 100) + "%)";
    textWidth = Game.context.measureText(text);
    posX = (Game.canvas.width / 2) - (textWidth.width / 2);
    Game.context.fillText(text, posX, posY + 16);
  }
}