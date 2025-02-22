(function(){
    //canvas
    var context = canvas.getContext("2d");

    window.context = context;

    //makes the canvas the size of the window
    var is_canvas_INTERNAL = false;
    function canvas_INTERNAL(){
        canvas.width = innerWidth
        canvas.height = innerHeight
        is_canvas_INTERNAL = true;
    }

    window.canvas_INTERNAL = canvas_INTERNAL;

    //simpify logging
    function log(logging){
        console.log(logging)
    }

    window.log = log;

    //mouse x and y position
    var mouse = {
        x: innerWidth / 2,
        y: innerHeight / 2
    }

    window.mouse = mouse;
    
    //canvas mouse x and y position
    var canvasMouse = {
        x: innerWidth / 2,
        y: innerHeight / 2
    }

    window.canvasMouse = canvasMouse;    

    //canvas mouse x and y position
    var virtualCameraMouse = {
        x: innerWidth / 2,
        y: innerHeight / 2,
        offsetX: 0,
        offsetY: 0
    }

    window.virtualCameraMouse = virtualCameraMouse;

    //keeps track of mouse position
    addEventListener('mousemove', (event) => {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
        canvasMouse.x = mouse.x - canvas.getBoundingClientRect().x;
        canvasMouse.y = mouse.y - canvas.getBoundingClientRect().y;
        //virtualCameraMouse is updated when the camera is updated in the animateCamera()
    })

    //resize canvas
    var virtualWidth = canvas.width;
    var virtualHeight = canvas.height;
    function resizeCanvas(){
        const scaleFactor = Math.min(
        window.innerWidth / virtualWidth,
        window.innerHeight / virtualHeight
        );
    
        const scaledWidth = virtualWidth * scaleFactor;
        const scaledHeight = virtualHeight * scaleFactor;
        
        // Calculate the offset based on the scaled canvas size
        const offsetX = (window.innerWidth - scaledWidth) / 2;
        const offsetY = (window.innerHeight - scaledHeight) / 2;
        
        // Set the transform properties to scale and translate the canvas
        canvas.style.transformOrigin = '0 0';
        canvas.style.transform = `scale(${scaleFactor}) translate(${offsetX}px, ${offsetY}px)`;
    
        const devicePixelRatio = window.devicePixelRatio || 1;
        canvas.width = virtualWidth * devicePixelRatio;
        canvas.height = virtualHeight * devicePixelRatio;
        context.scale(devicePixelRatio, devicePixelRatio);
    }
    resizeCanvas();
    window.addEventListener('resize', () => {resizeCanvas()})
    window.virtualWidth = virtualWidth
    window.virtualHeight = virtualHeight

    //clear canvas
    function clearCanvas(){
        context.clearRect(0, 0, canvas.width, canvas.height);    
    }

    window.clearCanvas = clearCanvas;

    //fullscreen
    function enterFullscreen() {
        if(canvas.requestFullscreen){
            canvas.requestFullscreen();
        } else if(canvas.mozRequestFullScreen){ 
            // Firefox
            canvas.mozRequestFullScreen();
        } else if(canvas.webkitRequestFullscreen){ 
            // Chrome, Safari and Opera
            canvas.webkitRequestFullscreen();
        } else if(canvas.msRequestFullscreen){ 
            // IE/Edge
            canvas.msRequestFullscreen();
        }
    }

    window.enterFullscreen = enterFullscreen;

    //layering system
    class Layer{
        constructor(){
            this.listOfObjects = [];
        }
        addToLayer(name){
            this.listOfObjects.push(name);
        }
        removeFromLayer(name){
            for(this.i = 0; this.i < this.listOfObjects.length; this.i++) {
                if(this.listOfObjects[this.i] == name){
                    this.listOfObjects.splice(this.i, 1)
                }
            }
        }
        drawLayer(){
            for(this.i = 0; this.i < this.listOfObjects.length; this.i++){
                this.listOfObjects[this.i].update();
            }
        }
    }

    window.Layer = Layer;

    //shadow system
    class Light{
        constructor(x, y, radius){
            this.x = x;
            this.y = y;
            this.radius = radius;
        }
        update(){
            this.x = x;
            this.y = y;
        }
    }

    window.Light = Light;

    class Shadow{
        constructor(attachTo, length, width){
            this.attachTo = attachTo;
            this.width = width;
            this.length = length;
            this.opacity = 0.5;
            this.lightSources = [];
            this.closestLight = 0;
            this.lightSourcesDistances = [];
            this.lightRadius = 0;
            this.xDistance = 0;
            this.yDistance = 0;
        }
        addLightSource(lightSource){
            this.lightSources.push(lightSource);
        }
        getDistance(x, y){
            this.xDistance = x - this.attachTo.x;
            this.yDistance = y - this.attachTo.y;
            
            return Math.sqrt(Math.pow(this.xDistance, 2) + Math.pow(this.yDistance, 2))
        }
        addListofLights(list){
            this.lightSources = list;
        }
        closestLightSource(){
            this.lightSourcesDistances = [];
            for(this.i = 0; this.i < this.lightSources.length; this.i++){
                this.lightSourcesDistances[this.i] = this.getDistance(this.lightSources[this.i].x, this.lightSources[this.i].y);
            }
            for(this.i = 0; this.i < this.lightSourcesDistances.length; this.i++){
                if(this.lightSourcesDistances[this.i] <= this.lightSourcesDistances[this.closestLight]){
                    this.closestLight = this.i;
                    this.lightRadius = this.lightSources[this.closestLight].radius;
                }
            }
        }
        changeShadowDepth(){
            this.closestLightSource();
            if(this.lightRadius - this.lightSourcesDistances[this.closestLight] <= 0){
                this.opacity = 0.1
            } else if(this.lightRadius - this.lightSourcesDistances[this.closestLight] <= this.lightRadius *.05){
                this.opacity = 0.15
            } else if(this.lightRadius - this.lightSourcesDistances[this.closestLight] <= this.lightRadius *.10){
                this.opacity = 0.2
            } else if(this.lightRadius - this.lightSourcesDistances[this.closestLight] <= this.lightRadius *.15){
                this.opacity = 0.25
            } else if(this.lightRadius - this.lightSourcesDistances[this.closestLight] <= this.lightRadius *.20){
                this.opacity = 0.3
            } else if(this.lightRadius - this.lightSourcesDistances[this.closestLight] <= this.lightRadius *.25){
                this.opacity = 0.35
            } else if(this.lightRadius - this.lightSourcesDistances[this.closestLight] <= this.lightRadius *.30){
                this.opacity = 0.4
            } else if(this.lightRadius - this.lightSourcesDistances[this.closestLight] <= this.lightRadius *.35){
                this.opacity = 0.45
            } else if(this.lightRadius - this.lightSourcesDistances[this.closestLight] <= this.lightRadius *.40){
                this.opacity = 0.5
            } else if(this.lightRadius - this.lightSourcesDistances[this.closestLight] <= this.lightRadius *.45){
                this.opacity = 0.5
            } else if(this.lightRadius - this.lightSourcesDistances[this.closestLight] <= this.lightRadius *.50){
                this.opacity = 0.6
            } else if(this.lightRadius - this.lightSourcesDistances[this.closestLight] <= this.lightRadius *.55){
                this.opacity = 0.6
            } else if(this.lightRadius - this.lightSourcesDistances[this.closestLight] <= this.lightRadius *.60){
                this.opacity = 0.7
            }
        }
        draw(){
            this.changeShadowDepth();
            context.save();
            context.beginPath();
            context.translate((this.attachTo.x)-this.length, (this.attachTo.y)-this.width);
            context.scale(this.length, this.width);
            context.fillStyle = 'rgb(0,0,0,' + this.opacity + ')';
            context.arc(1.55, 4.5, 1, 0, 2 * Math.PI, false);
            context.fill();
            context.closePath();
            context.restore();
        }
    }

    window.Shadow = Shadow;

    //spritesheet
    class Spritesheet{
        constructor(source, spriteX, spriteY){
            this.source = source;
            this.spriteX = spriteX;
            this.spriteY = spriteY;

            this.columnNumber = [];
            this.rowNumber = [];

            this.ImageObject = new Image();
            this.ImageObject.onload = () => {
                this.columns = 0;
                this.rows = 0;
        
                for(this.i = 0; this.i < this.ImageObject.width; this.i++){
                    if(this.i % this.spriteX == 1){
                        this.columns++
                        this.columnNumber[this.columns] = this.i;
                    }
                }
                for(this.i = 0; this.i < this.ImageObject.height; this.i++){
                    if(this.i % this.spriteY == 1){
                        this.rows++
                        this.rowNumber[this.rows] = this.i;
                    }
                }
            }
        
            this.ImageObject.src = source;

        }
    }

    window.Spritesheet = Spritesheet;

    //sprite
    class Sprite{
        constructor(Spritesheet, column, row, width, height){
            this.Spritesheet = Spritesheet;
            this.column = column;
            this.row = row;
            this.width = width;
            this.height = height;

            this.x = 0;
            this.y = 0;
        }
        draw(){
            context.save();
            context.drawImage(
                this.Spritesheet.ImageObject,
                this.Spritesheet.columnNumber[this.column],
                this.Spritesheet.rowNumber[this.row],
                this.Spritesheet.spriteX,
                this.Spritesheet.spriteY,
                this.x,
                this.y,
                this.width,
                this.height
              );
            context.restore();
        }
        updateCords(x, y){
            this.x = x;
            this.y = y;
        }
        changeColumnBy(amount){
            this.column = this.column + amount;
            if(this.column >= this.Spritesheet.columnNumber.length){
                this.column = 0;
                this.column = this.column + amount;
            }
        }
        changeRowBy(amount){
            this.row = this.row + amount;
            if(this.row >= this.Spritesheet.rowNumber.length){
                this.row = 0;
                this.row = this.row + amount;
            }
        }
        setColumn(columnNumber){
            this.column = columnNumber;
        }
        setRow(rowNumber){
            this.row = rowNumber;
        }
        update(){
            this.draw();
        }
    }

    window.Sprite = Sprite;

    //basic image
    class basicImage{
        constructor(source){
            this.source = source;

            this.x = 0;
            this.y = 0;

            this.ImageObject = new Image();
            this.ImageObject.onload = () => {
                this.width = this.ImageObject.width;
                this.height = this.ImageObject.height;
            };
            this.ImageObject.src = this.source;
        }
        changeSize(width, height){
            this.width = width;
            this.height = height;
        }
        updateCords(x, y){
            this.x = x;
            this.y = y;
        }
        draw(){
            context.save();
            context.drawImage(this.ImageObject, this.x, this.y, this.width, this.height);
            context.restore();
        }
        rotateBy(degree){
            context.rotate(degree * Math.PI / 180);
            this.draw();
            context.rotate((degree*-1) * Math.PI / 180);
        }
        update(){
            this.draw();
        }
    }

    window.basicImage = basicImage;

    //reflection 
    class basicReflection{
        constructor(image){
            this.image = image;
            this.angle = 0;
            this.shrink = .5;
            this.opacity = .5;
            
            this.x = this.image.x;
            this.y = this.image.y;

            this.xMultiplier = 1;
            this.yMultiplier = 1;
            
            this.ImageObject = this.image.ImageObject;
            this.ImageObject.src = this.image.ImageObject.src;
        }
        draw(){
            context.save();
            context.translate((this.x*this.xMultiplier), (this.y+this.ImageObject.height));
            context.scale(1, -1);
            context.transform(1, 0, Math.tan(Math.PI/this.angle), 1, 0, 0);
            context.scale(1, this.shrink);
            context.globalAlpha = this.opacity;
            context.drawImage(this.ImageObject, 0, -(this.ImageObject.height*this.yMultiplier));
            context.setTransform(1,0,0,1,0,0);
            context.restore();
        }
        update(){
            this.draw();
        }
    }

    window.basicReflection = basicReflection;

    class spriteReflection{
        constructor(sprite){
            this.sprite = sprite;
            this.angle = 0;
            this.shrink = .5;
            this.opacity = .5;
            
            this.x = this.sprite.x;
            this.y = this.sprite.y;
            this.height = this.sprite.height;
            this.width = this.sprite.width;
        }
        draw(){
            this.x = this.sprite.x;
            this.y = this.sprite.y;
            context.save();
            context.translate((this.x), (this.y + this.height));
            context.scale(1, -1);
            context.transform(1, 0, Math.tan(Math.PI/this.angle), 1, 0, 0);
            context.scale(1, this.shrink);
            context.globalAlpha = this.opacity;
            context.drawImage(this.sprite.Spritesheet.ImageObject, this.sprite.Spritesheet.columnNumber[this.sprite.column], this.sprite.Spritesheet.rowNumber[this.sprite.row], (this.sprite.Spritesheet.spriteX), (this.sprite.Spritesheet.spriteY), 0, -(this.height), this.width, this.height);
            context.setTransform(1,0,0,1,0,0);
            context.restore();
        }
        update(){
            this.draw();
        }
    }

    window.spriteReflection = spriteReflection;

    class spriteShadow{
        constructor(shadowSpritesheet, sprite){
            this.shadowSpritesheet = shadowSpritesheet;
            this.sprite = sprite;
            this.angle = 0;
            this.shrink = .5;
            this.strech = 0;
            this.opacity = .5;
            this.flipValue = -1;
            this.sector = 1;
            this.scaleX = Math.cos(this.angle*(Math.PI/180))*2;
            this.scaleY = Math.sin(this.angle*(Math.PI/180))*2;
            this.minScale = 1
            this.xModifier = 2
            this.yModifier = 1.2
            
            this.x = this.sprite.x;
            this.y = this.sprite.y;
            this.height = this.sprite.height;
            this.width = this.sprite.width;

            this.lightSources = [];
            this.closestLight = 0;
            this.lightSourcesDistances = [];
            this.lightRadius = 0;
            this.xDistance = 0;
            this.yDistance = 0;
        }
        addLightSource(lightSource){
            this.lightSources.push(lightSource);
        }
        getDistance(x, y){
            this.xDistance = x - this.sprite.x;
            this.yDistance = y - this.sprite.y;
            
            return Math.sqrt(Math.pow(this.xDistance, 2) + Math.pow(this.yDistance, 2))
        }
        addListofLights(list){
            this.lightSources = list;
        }
        closestLightSource(){
            this.lightSourcesDistances = [];
            for(this.i = 0; this.i < this.lightSources.length; this.i++){
                this.lightSourcesDistances[this.i] = this.getDistance(this.lightSources[this.i].x, this.lightSources[this.i].y);
            }
            for(this.i = 0; this.i < this.lightSourcesDistances.length; this.i++){
                if(this.lightSourcesDistances[this.i] <= this.lightSourcesDistances[this.closestLight]){
                    this.closestLight = this.i;
                    this.lightRadius = this.lightSources[this.closestLight].radius;
                }
            }
        }
        changeShadowDepth(){
            this.closestLightSource();
            if(this.lightRadius - this.lightSourcesDistances[this.closestLight] <= 0){
                this.opacity = 0
            } else if(this.lightRadius - this.lightSourcesDistances[this.closestLight] <= this.lightRadius *.05){
                this.opacity = 0.13
            } else if(this.lightRadius - this.lightSourcesDistances[this.closestLight] <= this.lightRadius *.10){
                this.opacity = 0.2
            } else if(this.lightRadius - this.lightSourcesDistances[this.closestLight] <= this.lightRadius *.15){
                this.opacity = 0.25
            } else if(this.lightRadius - this.lightSourcesDistances[this.closestLight] <= this.lightRadius *.20){
                this.opacity = 0.3
            } else if(this.lightRadius - this.lightSourcesDistances[this.closestLight] <= this.lightRadius *.25){
                this.opacity = 0.35
            } else if(this.lightRadius - this.lightSourcesDistances[this.closestLight] <= this.lightRadius *.30){
                this.opacity = 0.4
            } else if(this.lightRadius - this.lightSourcesDistances[this.closestLight] <= this.lightRadius *.35){
                this.opacity = 0.45
            } else if(this.lightRadius - this.lightSourcesDistances[this.closestLight] <= this.lightRadius *.40){
                this.opacity = 0.5
            } else if(this.lightRadius - this.lightSourcesDistances[this.closestLight] <= this.lightRadius *.45){
                this.opacity = 0.5
            } else if(this.lightRadius - this.lightSourcesDistances[this.closestLight] <= this.lightRadius *.50){
                this.opacity = 0.6
            } else if(this.lightRadius - this.lightSourcesDistances[this.closestLight] <= this.lightRadius *.55){
                this.opacity = 0.6
            } else if(this.lightRadius - this.lightSourcesDistances[this.closestLight] <= this.lightRadius *.60){
                this.opacity = 0.7
            }
        }
        changeAngle(){
            this.closestLightSource();
            this.xDistance = this.lightSources[this.closestLight].x-this.x;
			this.yDistance = this.lightSources[this.closestLight].y-this.y;
			this.radAngle = Math.atan2(this.yDistance, this.xDistance);
			this.angle = ((this.radAngle*360/(2*Math.PI))+90);
            context.rotate(this.angle * Math.PI / 180);
            if(this.angle >= 100){
                context.scale(-1, -1-this.strech);
            } else {
                context.scale(1, -1-this.strech);
            }
        }
        draw(){
            this.x = this.sprite.x+this.width/this.xModifier;
            this.y = this.sprite.y+this.height/this.yModifier;
            this.changeShadowDepth();
            context.save();
            context.translate((this.x), (this.y));
            this.changeAngle();
            context.globalAlpha = this.opacity;
            context.drawImage(this.shadowSpritesheet.ImageObject,
                this.shadowSpritesheet.columnNumber[this.sprite.column], 
                this.shadowSpritesheet.rowNumber[this.sprite.row], 
                (this.shadowSpritesheet.spriteX), 
                (this.shadowSpritesheet.spriteY), 
                -(this.width)*.5, 
                -(this.height), 
                this.width, 
                this.height
            );
            context.setTransform(1,0,0,1,0,0);
            context.restore();
        }
        update(){
            this.draw();
        }
    }

    window.spriteShadow = spriteShadow;

    class Particle {
        constructor(effect, moveSpeed, lifespan, size) {
            this.alive = true;
            this.fade = 1;
            this.fadeEffect = (lifespan/1000);
            while(this.fadeEffect >= 1){
                this.fadeEffect *= .10;
            }
            this.efffect = effect;
            this.size = size;
            this.spawnX = 0;
            this.spawnY = 0;
            this.x = Math.floor(Math.random() * this.efffect.width);
            this.y = Math.floor(Math.random() * this.efffect.height);
            this.speed = moveSpeed;
            this.speedX = Math.random() * this.speed-(this.speed/2);
            this.speedY = Math.random() * this.speed-(this.speed/2);
            this.startLifeCycle(lifespan);
        }
        startLifeCycle(lifespan){
            if(lifespan != 0){
                setTimeout(()=>{
                    this.alive = false;
                }, lifespan)
                setInterval(()=>{
                    if(this.fade >= 0.1){
                        this.fade -= this.fadeEffect;
                    }
                }, (lifespan*this.fadeEffect))
            }
        }
        draw() {
            context.save();
            context.globalAlpha = this.fade;
            context.translate((this.spawnX), (this.spawnY));
            context.fillRect(this.x, this.y, this.size, this.size);
            context.restore();
        }
        update() {
            if(this.alive){
                this.draw();
                this.x += this.speedX;
                this.y += this.speedY;
            }
        }
    }

    window.Particle = Particle;

    class Effect {
        constructor(width, height, amount, lifespan, spawnSpeed) {
            this.width = width;
            this.height = height;
            this.particles = [];
            this.numberOfParticles = amount;
            this.spawnSpeed = spawnSpeed;
            this.particleMoveSpeed = 5;
            this.particleColor = "black";
            this.particleSize = 5;
            if(this.numberOfParticles == 0){
                setInterval(()=>{
                    this.particles.push(new Particle(this, this.particleMoveSpeed, lifespan, this.particleSize));
                }, this.spawnSpeed)
            } else {
                for(let i = 0; i < this.numberOfParticles; i++) {
                    this.particles.push(new Particle(this, this.particleMoveSpeed, lifespan, this.particleSize));
                }
            }
        }
        goUp(){
            this.particles.forEach((particle) => {
                particle.speedY = Math.random() * -(this.particleMoveSpeed)-(this.particleMoveSpeed/2);
            });
        }
        goDown(){
            this.particles.forEach((particle) => {
                particle.speedY = Math.random() * (this.particleMoveSpeed)+(this.particleMoveSpeed/2);
            });
        }
        goLeft(){
            this.particles.forEach((particle) => {
                particle.speedX = Math.random() * -(this.particleMoveSpeed)-(this.particleMoveSpeed/2);
            });
        }
        goRight(){
            this.particles.forEach((particle) => {
                particle.speedX = Math.random() * (this.particleMoveSpeed)+(this.particleMoveSpeed/2);
            });
        }
        setSpawn(spawnX, spawnY){
            this.particles.forEach((particle) => {
                particle.spawnX = spawnX;
                particle.spawnY = spawnY;
            });
        }
        render(){
            context.save();
            this.particles.forEach((particle) => {
                context.fillStyle = this.particleColor;
                particle.update();
            });
            context.restore();
        }
        update(){
            this.render();
        }
    }

    window.Effect = Effect;

    class spriteParticle {
        constructor(sprite, effect, moveSpeed, lifespan, size){
            this.sprite = sprite;
            this.alive = true;
            this.fade = 1;
            this.fadeEffect = (lifespan/1000);
            while(this.fadeEffect >= 1){
                this.fadeEffect *= .10;
            }
            this.efffect = effect;
            this.size = size;
            this.spawnX = 0;
            this.spawnY = 0;
            this.x = Math.floor(Math.random() * this.efffect.width);
            this.y = Math.floor(Math.random() * this.efffect.height);
            this.speed = moveSpeed;
            this.speedX = Math.random() * this.speed-(this.speed/2);
            this.speedY = Math.random() * this.speed-(this.speed/2);
            this.startLifeCycle(lifespan);
        }
        startLifeCycle(lifespan){
            if(lifespan != 0){
                setTimeout(()=>{
                    this.alive = false;
                }, lifespan)
                setInterval(()=>{
                    if(this.fade >= 0.1){
                        this.fade -= this.fadeEffect;
                    }
                }, (lifespan*this.fadeEffect))
            }
        }
        draw() {
            context.save();
            context.globalAlpha = this.fade;
            context.translate((this.spawnX), (this.spawnY));
            context.drawImage(this.sprite.Spritesheet.ImageObject, this.sprite.Spritesheet.columnNumber[this.sprite.column], this.sprite.Spritesheet.rowNumber[this.sprite.row], (this.sprite.Spritesheet.spriteX), (this.sprite.Spritesheet.spriteY), this.x, this.y, this.size, this.size);
            context.restore();
        }
        update() {
            if(this.alive){
                this.draw();
                this.x += this.speedX;
                this.y += this.speedY;
            }
        }
    }

    window.spriteParticle = spriteParticle;

    class spriteEffect {
        constructor(sprite, width, height, amount, lifespan, spawnSpeed) {
            this.sprite = sprite;
            this.width = width;
            this.height = height;
            this.particles = [];
            this.numberOfParticles = amount;
            this.spawnSpeed = spawnSpeed;
            this.particleMoveSpeed = 5;
            this.particleColor = "black";
            this.particleSize = 5;
            if(this.numberOfParticles == 0){
                setInterval(()=>{
                    this.particles.push(new spriteParticle(this.sprite, this, this.particleMoveSpeed, lifespan, this.particleSize));
                }, this.spawnSpeed)
            } else {
                for(let i = 0; i < this.numberOfParticles; i++) {
                    this.particles.push(new spriteParticle(this.sprite, this, this.particleMoveSpeed, lifespan, this.particleSize));
                }
            }
        }
        goUp(){
            this.particles.forEach((particle) => {
                particle.speedY = Math.random() * -(this.particleMoveSpeed)-(this.particleMoveSpeed/2);
            });
        }
        goDown(){
            this.particles.forEach((particle) => {
                particle.speedY = Math.random() * (this.particleMoveSpeed)+(this.particleMoveSpeed/2);
            });
        }
        goLeft(){
            this.particles.forEach((particle) => {
                particle.speedX = Math.random() * -(this.particleMoveSpeed)-(this.particleMoveSpeed/2);
            });
        }
        goRight(){
            this.particles.forEach((particle) => {
                particle.speedX = Math.random() * (this.particleMoveSpeed)+(this.particleMoveSpeed/2);
            });
        }
        setSpawn(spawnX, spawnY){
            this.particles.forEach((particle) => {
                particle.spawnX = spawnX;
                particle.spawnY = spawnY;
            });
        }
        render(){
            context.save();
            this.particles.forEach((particle) => {
                context.fillStyle = this.particleColor;
                particle.update();
            });
            context.restore();
        }
        update(){
            this.render();
        }
    }

    window.spriteEffect = spriteEffect;

    class canvasButton{
        constructor(x, y, width, height){
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.touching = false;
        }
        whenClicked(action){
            if(canvasMouse.x >= this.x && canvasMouse.x <= this.x + this.width && canvasMouse.y >= this.y && canvasMouse.y <= this.y + this.height){
                this.touching = true;
                action();
            } else {
                this.touching = false;
            }
        }
        whenHovered(action){
            if(canvasMouse.x >= this.x && canvasMouse.x <= this.x + this.width && canvasMouse.y >= this.y && canvasMouse.y <= this.y + this.height){
                this.touching = true;
                action();
            } else {
                this.touching = false;
            }
        }
        whenReleased(action){
            if(canvasMouse.x >= this.x && canvasMouse.x <= this.x + this.width && canvasMouse.y >= this.y && canvasMouse.y <= this.y + this.height){
                action();
            }
        }
        draw(){
            context.save();
            context.beginPath();
            context.rect(this.x, this.y, this.width, this.height);
            context.stroke();
            context.closePath();
            context.restore();
        }
        update(){
            this.draw();
        }
    }

    window.canvasButton = canvasButton;

    //Text
    class canvasText{
        constructor(text, size, x, y){
            this.text = text;
            this.size = size;
            this.font = "Ariel"
            this.fontFamilies = [
                "Times New Roman",
                "Georgia",
                "Garamond",
                "Palatino Linotype",
                "Baskerville",
                "Arial",
                "Helvetica",
                "Verdana",
                "Tahoma",
                "Calibri",
                "Courier New",
                "Consolas",
                "Monaco",
                "Lucida Console",
                "Andale Mono",
                "Comic Sans MS",
                "Brush Script MT",
                "Snell Roundhand",
                "Zapfino",
                "Mistral",
                "Impact",
                "Papyrus",
                "Jokerman",
                "Chalkduster",
                "Curlz MT"
              ];
            this.x = x;
            this.y = y;
            context.font = this.size + " " + this.font
        }
        changeFont(fontName){
            this.font = fontName;
        }
        addNewFont(fontName, url){
            log("when adding new fonts ENSURE YOU HAVE A <style> TAG!")
            this.fontFamilies.push(fontName)
            document.getElementsByTagName("style")[0].sheet.insertRule('@font-face { font-family: \"' + fontName + '\"; src: url(' + url + '); }', 0)
        }
        draw(){
            context.font = this.size + " " + this.font
            context.fillText(this.text, this.x, this.y)
        }
        update(){
            this.draw();
        }
    }

    window.canvasText = canvasText;

    //Sound System
    class Sound {
        constructor(source, loop){
            this.audio = new Audio;
            this.source = source;
            this.loop = loop;

            this.audio.src = this.source;
            this.audio.loop = this.loop;
        }
        play(){
            this.audio.loop = this.loop;
            this.audio.play();
        }
    }

    window.Sound = Sound;

    class GridMap {
        constructor(x, y, sizeOfBlocks, mapArray){
            this.x = x;
            this.y = y;
            this.sizeOfBlocks = sizeOfBlocks;
            this.positionX = this.x;
            this.positionY = this.y;
            this.listOfBlocks = [];
            this.listOfBoundaries = [];
            this.listOfTriggers = [];
            this.mapArray = mapArray;
            this.oldCollidingBlock;
            this.newCollidingBlock;
            for(this.j = 0; this.j < this.mapArray.length; this.j++){
                for(this.k = 0; this.k < this.mapArray[this.j].length; this.k++){
                    if(this.mapArray[this.j].charAt(this.k) == "0"){
                        this.listOfBlocks.push({x: this.positionX, y: this.positionY, size: this.sizeOfBlocks})
                        this.positionX += this.sizeOfBlocks;
                    } else if(this.mapArray[this.j].charAt(this.k) == "1"){
                        this.listOfBlocks.push({x: this.positionX, y: this.positionY, size: this.sizeOfBlocks})
                        this.listOfBoundaries.push(new Boundary(this.positionX, this.positionY, this.sizeOfBlocks));
                        this.listOfBoundaries[this.listOfBoundaries.length-1].showOutline(1, "blue");
                        this.positionX += this.sizeOfBlocks;
                    } else if(this.mapArray[this.j].charAt(this.k) == "2"){
                        this.listOfBlocks.push({x: this.positionX, y: this.positionY, size: this.sizeOfBlocks})
                        this.listOfTriggers.push(new Trigger(this.positionX, this.positionY, this.sizeOfBlocks));
                        this.listOfTriggers[this.listOfTriggers.length-1].showOutline(1, "red");
                        this.positionX += this.sizeOfBlocks;
                    }
                }
                this.positionX = this.x;
                this.positionY += this.sizeOfBlocks;
            }
            log(this.listOfBlocks)
        }
        printCollidingBlock(object, block){
            this.newCollidingBlock = block;
            if(this.newCollidingBlock != this.oldCollidingBlock){
                log("Block: " + this.listOfBlocks.indexOf(block) + " is colliding with " + object)
                log("X: " + block.x + " Y:" + block.y)
                //log(block.size)
                this.oldCollidingBlock = this.newCollidingBlock
            }
        }
        checkObjectCollidingBlock(object){
            for(this.i = 0; this.i < this.listOfBlocks.length; this.i++){
                if(object.checkCollision(this.listOfBlocks[this.i])){
                    this.printCollidingBlock(object, this.listOfBlocks[this.i])
                }
            }
        }
    }

    window.GridMap = GridMap;

    //Entity
    class Entity{
        constructor(name, x, y, size){
            this.name = name;
            this.x = x;
            this.y = y;
            this.size = size;
            this.colliding = false;
            
            this.lastKey = "";
            this.speed = 5;
            this.pushBack = -(this.speed)
            this.leftXVelocity = 0;
            this.rightXVelocity = 0;
            this.upYVelocity = 0;
            this.downYVelocity = 0;
            this.TimeOfLeftXVelocity = 0;
            this.TimeOfRightXVelocity = 0;
            this.TimeOfUpYVelocity = 0;
            this.TimeOfDownYVelocity = 0;
            this.pressedKeys = {};
            this.controlLayout = ["w", "s", "a", "d"];

            this.target = null;
            this.turnRate = 0;
            this.agroRange = 0;
            this.moveX = 0;
            this.oppositeMoveX = 0;
            this.moveY = 0;
            this.oppositeMoveY = 0;
            this.distanceX = 0;
            this.distanceY = 0;
            this.distanceTotal = 0;
            this.moveDistanceX = 0;
            this.moveDistanceY = 0;
            this.totalmove = 0;
            
            this.lineThickness = 5;
            this.strokeColors = "green";
            this.hasOutline = false;
        }
        showOutline(){
            this.hasOutline = true;
        }
        updateCords(x, y){
            this.x = x;
            this.y = y;
        }
        draw(){
            if(this.hasOutline){
                context.save();
                context.beginPath();
                context.lineWidth = this.lineThickness;
                context.strokeStyle = this.strokeColors;
                context.rect(this.x, this.y, this.size, this.size);
                context.stroke();
                context.closePath();
                context.restore();
            } else {
                context.save();
                context.beginPath();
                context.rect(this.x, this.y, this.size, this.size);
                context.closePath();
                context.restore();
            }
        }
        update(){
            if(this.leftXVelocity != 0 && this.rightXVelocity != 0){
                if(this.TimeOfLeftXVelocity < this.TimeOfRightXVelocity){
                    this.rightXVelocity = 0;
                } else {
                    this.leftXVelocity = 0;
                }
            }
            if(this.upYVelocity != 0 && this.downYVelocity != 0){
                if(this.TimeOfUpYVelocity < this.TimeOfDownYVelocity){
                    this.downYVelocity = 0;
                } else {
                    this.upYVelocity = 0;
                }
            }

            this.x += this.leftXVelocity;
            this.x += this.rightXVelocity;
            this.y += this.upYVelocity;
            this.y += this.downYVelocity;

            this.draw();
        }
        checkCollision(rectangle){
            return !(this.x > rectangle.x + rectangle.size || this.x + this.size  < rectangle.x || this.y > rectangle.y + rectangle.size || this.y + this.size < rectangle.y );
        }
        collisionDetection(object){
            if(this.checkCollision(object)){
                this.colliding = true;
                

                if(this.upYVelocity < 0){
                    this.y -= this.pushBack;
                }

                if(this.downYVelocity > 0){
                    this.y += this.pushBack;
                }

                if(this.leftXVelocity < 0){
                    this.x -= this.pushBack;
                }

                if(this.rightXVelocity > 0){
                    this.x += this.pushBack;
                }
                

                if(this.target != null){
                    //top
                    if(this.oppositeMoveX == 0 && this.oppositeMoveY > 0){
                        this.y += this.oppositeMoveY;
                    }
                    //bottom
                    if(this.oppositeMoveX == 0 && this.oppositeMoveY < 0){
                        this.y += this.oppositeMoveY;
                    }
                    //left
                    if(this.oppositeMoveX > 0 && this.oppositeMoveY == 0){
                        this.x += this.oppositeMoveX;
                    }
                    //right
                    if(this.oppositeMoveX < 0 && this.oppositeMoveY == 0){
                        this.x += this.oppositeMoveX;
                    }
                    //top left
                    if(this.oppositeMoveX > 0 && this.oppositeMoveY > 0){
                        this.x += this.oppositeMoveX;
                    }
                    //top right
                    if(this.oppositeMoveX < 0 && this.oppositeMoveY > 0){
                        this.x += this.oppositeMoveX;
                    }
                    //bottom left
                    if(this.oppositeMoveX > 0 && this.oppositeMoveY < 0){
                        this.x += this.oppositeMoveX;
                    }
                    //bottom right
                    if(this.oppositeMoveX < 0 && this.oppositeMoveY < 0){
                        this.x += this.oppositeMoveX;
                    }
                }
            } else {
                this.colliding = false;
            }
        }
        keyDown(event){
            this.pressedKeys[event.key] = true;
            if(this.pressedKeys[this.controlLayout[0]]){
                this.upYVelocity = -this.speed;
                this.TimeOfUpYVelocity += 1;
            }
            if(this.pressedKeys[this.controlLayout[1]]){
                this.downYVelocity = this.speed;
                this.TimeOfDownYVelocity += 1;
            }
            if(this.pressedKeys[this.controlLayout[2]]){
                this.leftXVelocity = -this.speed;
                this.TimeOfLeftXVelocity += 1;
            }
            if(this.pressedKeys[this.controlLayout[3]]){
                this.rightXVelocity = this.speed;
                this.TimeOfRightXVelocity += 1;
            }
        }
        keyUp(event){
            if(this.lastKey != event.key){
                this.lastKey = event.key;
            }
            if(this.lastKey == this.controlLayout[0]){
                this.upYVelocity = 0;
                this.TimeOfUpYVelocity = 0;
                this.pressedKeys[this.lastKey] = false;
                if(this.TimeOfDownYVelocity > 0){
                    this.downYVelocity = this.speed;
                }
            } else if(this.lastKey == this.controlLayout[1]){
                this.downYVelocity = 0;
                this.TimeOfDownYVelocity = 0;
                this.pressedKeys[this.lastKey] = false;
                if(this.TimeOfUpYVelocity > 0){
                    this.upYVelocity = -this.speed;
                }
            } else if(this.lastKey == this.controlLayout[2]){
                this.leftXVelocity = 0;
                this.TimeOfLeftXVelocity = 0;
                this.pressedKeys[this.lastKey] = false;
                if(this.TimeOfRightXVelocity > 0){
                    this.rightXVelocity = this.speed;
                }
            } else if(this.lastKey == this.controlLayout[3]){
                this.rightXVelocity = 0;
                this.TimeOfRightXVelocity = 0;
                this.pressedKeys[this.lastKey] = false;
                if(this.TimeOfLeftXVelocity > 0){
                    this.leftXVelocity = -this.speed;
                }
            } else {
                // this.upYVelocity = 0;
                // this.downYVelocity = 0;
                // this.leftXVelocity = 0;
                // this.rightXVelocity = 0;
                // this.TimeOfUpYVelocity = 0;
                // this.TimeOfDownYVelocity = 0;
                // this.TimeOfLeftXVelocity = 0;
                // this.TimeOfRightXVelocity = 0;
                this.pressedKeys[this.lastKey] = false;
            }
        }
        goTowards(target, speed, turnRate, agroRange){
            this.target = target;
            this.speed = speed;
            this.turnRate = turnRate;
            this.agroRange = agroRange;
        
            this.moveX = 0;
            this.moveY = 0;

            this.distanceX = this.target.x-this.x;
            this.distanceY = this.target.y-this.y;
            
            this.distanceTotal = Math.sqrt(this.distanceX*this.distanceX+this.distanceY*this.distanceY);
            
            if(this.distanceTotal <= this.agroRange){
                this.moveDistanceX = this.turnRate*this.distanceX/this.distanceTotal;
                this.moveDistanceY = this.turnRate*this.distanceY/this.distanceTotal;
                this.moveX += this.moveDistanceX;
                this.moveY += this.moveDistanceY;
                this.totalmove = Math.sqrt(this.moveX*this.moveX+this.moveY*this.moveY);
                this.moveX = this.speed*this.moveX/this.totalmove;
                this.moveY = this.speed*this.moveY/this.totalmove;
                this.oppositeMoveX = -(this.moveX)*2
                this.oppositeMoveY = -(this.moveY)*2
                this.x += this.moveX;
                this.y += this.moveY;
            }
        }
    }

    window.Entity = Entity;
    
    class Camera{
        constructor(){
            this.offsetX = 0;
            this.offsetY = 0;
            this.moveX = 0;
            this.moveY = 0;
            this.panning = false;
            this.movementTimeout;
            this.movementInterval;
        }
        moveTowards(x, y, speed, modifier){
            this.speed = speed;
            
            this.targetX = x-(canvas.width/2-modifier);
            this.targetY = y-(canvas.height/2-modifier);

            this.distanceX = this.targetX-this.offsetX;
            this.distanceY = this.targetY-this.offsetY;
            
            this.distanceTotal = Math.sqrt(this.distanceX*this.distanceX+this.distanceY*this.distanceY);
            
            this.moveDistanceX = this.distanceX/this.distanceTotal;
            this.moveDistanceY = this.distanceY/this.distanceTotal;
            this.moveX += this.moveDistanceX;
            this.moveY += this.moveDistanceY;
            this.totalmove = Math.sqrt(this.moveX*this.moveX+this.moveY*this.moveY);
            this.moveX = this.speed*this.moveX/this.totalmove;
            this.moveY = this.speed*this.moveY/this.totalmove;
            if(this.distanceTotal <= 5){
                
            } else {
                this.offsetX += this.moveX;
                this.offsetY += this.moveY;
            }
        }
        pan(x, y, time, speed){
            //Time in milliseconds
            //Speed will be slower the longer it is
            this.panning = true;
            this.movementTimeout = setTimeout(() => {
                this.panning = false;
            }, time)
            this.movementInterval = setInterval(() => {
                if(this.panning){
                    this.offsetX += x;
                    this.offsetY += y;
                } else {
                    clearTimeout(this.movementTimeout)
                    clearInterval(this.movementInterval);
                }
            }, speed);
        }
        zoom(zooming){
            context.scale(zooming, zooming);
        }
        attachCamera(attachTo, modifier){
            this.updateMouseCords(attachTo.x, attachTo.y)
            this.offsetX = attachTo.x-(canvas.width/2-modifier);
            this.offsetY = attachTo.y-(canvas.height/2-modifier);
        }
        animateCamera(){        
            virtualCameraMouse.x = mouse.x - canvas.getBoundingClientRect().x + virtualCameraMouse.offsetX
            virtualCameraMouse.y = mouse.y - canvas.getBoundingClientRect().y + virtualCameraMouse.offsetY
        
            context.translate(-this.offsetX, -this.offsetY);
            context.clearRect(-this.offsetX, -this.offsetY, canvas.width, canvas.height);    
        }
        updateMouseCords(x, y){
            virtualCameraMouse.offsetX = x-(canvas.width/2)
            virtualCameraMouse.offsetY = y-(canvas.height/2)
        }
    }

    window.Camera = Camera;

    //Boundary
    var listOfBoundaries = [];

    class Boundary{
        constructor(x, y, size){
            this.x = x;
            this.y = y;
            this.size = size;
            this.colliding = false;
            this.lineThickness = 0;
            this.strokeColors = "";
            this.hasOutline = false;
            listOfBoundaries.push(this);
        }
        showOutline(){
            this.hasOutline = true;
        }
        showOutline(linewidth, strokeColor){
            this.lineThickness = linewidth;
            this.strokeColors = strokeColor;
            this.hasOutline = true;
        }
        updateCords(x, y){
            this.x = x;
            this.y = y;
        }
        draw(){
            if(this.hasOutline){
                context.save();
                context.beginPath();
                context.lineWidth = this.lineThickness;
                context.strokeStyle = this.strokeColors;
                context.rect(this.x, this.y, this.size, this.size);
                context.stroke();
                context.closePath();
                context.restore();
            } else {
                context.save();
                context.beginPath();
                context.rect(this.x, this.y, this.size, this.size);
                context.closePath();
                context.restore();
            }
        }
        update(){
            this.draw();
        }
        checkCollision(rectangle){
            return !(this.x > rectangle.x + rectangle.size || this.x + this.size  < rectangle.x || this.y > rectangle.y + rectangle.size || this.y + this.size < rectangle.y );
        }
        collisionDetection(object){
            if(this.checkCollision(object)){
                this.colliding = true;
            } else {
                this.colliding = false;
            }
        }
    }

    window.Boundary = Boundary;

    function checkBoundaries(entity){
        for(i = 0; i < listOfBoundaries.length; i++){
            entity.collisionDetection(listOfBoundaries[i])
        }
    }

    window.checkBoundaries = checkBoundaries;

    function drawBoundaries(){
        for(i = 0; i < listOfBoundaries.length; i++){
            listOfBoundaries[i].update();
        }
    }
    
    window.drawBoundaries = drawBoundaries;

    //game event triggers
    var listOfTriggers = [];

    class Trigger{
        constructor(x, y, size){
            this.x = x;
            this.y = y;
            this.size = size;
            this.colliding = false;
            this.lineThickness = 0;
            this.strokeColors = "";
            this.hasOutline = false;
            this.action;
            listOfTriggers.push(this);
        }
        setAction(action){
            this.action = action;
        }
        activate(){
            this.action();
        }
        showOutline(){
            this.hasOutline = true;
        }
        showOutline(linewidth, strokeColor){
            this.lineThickness = linewidth;
            this.strokeColors = strokeColor;
            this.hasOutline = true;
        }
        updateCords(x, y){
            this.x = x;
            this.y = y;
        }
        draw(){
            if(this.hasOutline){
                context.save();
                context.beginPath();
                context.lineWidth = this.lineThickness;
                context.strokeStyle = this.strokeColors;
                context.rect(this.x, this.y, this.size, this.size);
                context.stroke();
                context.closePath();
                context.restore();
            } else {
                context.save();
                context.beginPath();
                context.rect(this.x, this.y, this.size, this.size);
                context.closePath();
                context.restore();
            }
        }
        update(){
            this.draw();
        }
        checkCollision(rectangle){
            return !(this.x > rectangle.x + rectangle.size || this.x + this.size  < rectangle.x || this.y > rectangle.y + rectangle.size || this.y + this.size < rectangle.y );
        }
        collisionDetection(object){
            if(this.checkCollision(object)){
                this.colliding = true;
            } else {
                this.colliding = false;
            }
        }
    }

    window.Trigger = Trigger;

    function checkTriggers(entity){
        for(i = 0; i < listOfTriggers.length; i++){
            if(entity.checkCollision(listOfTriggers[i])){
                listOfTriggers[i].activate();
            }
        }
    }

    window.checkTriggers = checkTriggers;

    function drawTriggers(){
        for(i = 0; i < listOfTriggers.length; i++){
            listOfTriggers[i].update();
        }
    }
    
    window.drawTriggers = drawTriggers;

    function saveObjectPosition(object){
        localStorage.setItem("savedObjectXPosition", JSON.stringify(object.x));
        localStorage.setItem("savedObjectYPosition", JSON.stringify(object.y));
    }

    window.saveObjectPosition = saveObjectPosition;

    function loadSavedObjectPosition(object){
        if(localStorage.getItem("savedObjectXPosition") != "" && localStorage.getItem("savedObjectYPosition") != ""){
            object.x = JSON.parse(localStorage.getItem("savedObjectXPosition"));
            localStorage.setItem("savedObjectXPosition", "");
            object.y = JSON.parse(localStorage.getItem("savedObjectYPosition"));
            localStorage.setItem("savedObjectYPosition", "");
        }
    }

    window.loadSavedObjectPosition = loadSavedObjectPosition;

})();