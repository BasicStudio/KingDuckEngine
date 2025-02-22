var mainsheet = new Spritesheet("worldsheet.png", 100, 100)
var shadowsheet = new Spritesheet("worldsheetShadows.png", 100, 100)
var playerSprite = new Sprite(mainsheet, 1, 7, 100, 100)

setInterval(function(){
    playerSprite.changeColumnBy(1)
}, 1000)

var mainLayer = new Layer();

var Player = new Entity("player", 100, 120, 90);
playerSprite.updateCords((Player.x), (Player.y - 10))
//Player.showOutline();

const effect = new spriteEffect(playerSprite, Player.size, Player.size, 0, 1000, 100);
//const effect = new Effect(Player.size, Player.size, 0, 1000, 100);
effect.particleMoveSpeed = 2;
effect.particleColor = "yellow"
effect.particleSize = 50;

//grid map
var mapString = [
    "0 0 0 0 0",
    "0 0 1 0 0",
    "0 0 2 0 0"
]

var gridmap = new GridMap(0, 0, 100, mapString)
gridmap.listOfTriggers[0].setAction(()=>{
    log("wow")
})

//var playerReflection = new spriteReflection(playerSprite)
var playerShadow = new spriteShadow(shadowsheet, playerSprite)
playerShadow.yModifier = 1.5;
//playerShadow.strech = .5

var onlyLight = new Light(0, 0, 500)
var anotherLight = new Light(500, 200, 500)
playerShadow.addLightSource(onlyLight)
playerShadow.addLightSource(anotherLight)

var vCam = new Camera();

var wall1 = new Boundary(0, 0, 100);
wall1.showOutline();
var wall2 = new Boundary(100, -100, 100);
wall2.showOutline();

var map = new basicImage("map.png");

addEventListener("keydown", function(event){
    Player.keyDown(event)
})
addEventListener("keyup", function(event){
    Player.keyUp(event)
})

var firstText = new canvasText("JOHN!", "50px", 50, 50)
firstText.addNewFont("Plante", "Plante.ttf");
firstText.addNewFont("Dacherry", "Dacherry.otf");
firstText.changeFont("Dacherry")

mainLayer.addToLayer(map)
mainLayer.addToLayer(Player)
mainLayer.addToLayer(firstText)
//mainLayer.addToLayer(playerReflection)
mainLayer.addToLayer(playerShadow)
mainLayer.addToLayer(playerSprite)

// vCam.pan(5, 0, 6000, 30)

//loads and deletes player position in the localstorage
loadSavedObjectPosition(Player);

function animate(){
    //enterFullscreen();
    saveObjectPosition(Player)
    requestAnimationFrame(animate)
    map.changeSize(map.ImageObject.width/2, map.ImageObject.height/2)
    playerSprite.updateCords((Player.x), (Player.y - 10))
    //vCam.moveTowards(Player.x, Player.y, 5)
    vCam.attachCamera(Player, 50)
    context.save();
    clearCanvas();
    //vCam.zoom(2);
    vCam.animateCamera();
    effect.setSpawn(Player.x, Player.y)
    //effect.goUp();
    mainLayer.drawLayer();
    effect.render();
    gridmap.checkObjectCollidingBlock(Player)
    checkBoundaries(Player)
    drawBoundaries();
    checkTriggers(Player)
    drawTriggers();
    context.restore();
}

animate();
