let gameplayState = function(){
    this.score = 0;
    this.laneHeight = 0;
    this.selectedCard = null;
    this.asherahPole = null;
};


gameplayState.prototype.create = function() {
    console.log("Cards " + Cards.category);
    
    // Turn on physics before anything else
    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    // Set up heights for different area
    this.cardAreaHeight = 150;
    this.laneHeight = (game.world.height - this.cardAreaHeight) / 3.0;
    
    // debug line
    this.line1 = new Phaser.Line(0, this.laneHeight, game.world.width, this.laneHeight);
    this.line2 = new Phaser.Line(0, this.laneHeight*2, game.world.width, this.laneHeight*2);
    this.line3 = new Phaser.Line(0, this.laneHeight*3, game.world.width, this.laneHeight*3);
    
    console.log("Lane height " + this.laneHeight);
    
	//groups of friendly units on lanes
	this.friendlyUnit1 = game.add.group();
	this.friendlyUnit2 = game.add.group();
	this.friendlyUnit3 = game.add.group();
	
	this.friendlyUnit1.enableBody = true;
	this.friendlyUnit2.enableBody = true;
	this.friendlyUnit3.enableBody = true;
	
	//groups of enemy units on lanes
	this.enemyUnit1 = game.add.group();
	this.enemyUnit2 = game.add.group();
	this.enemyUnit3 = game.add.group();
	
	this.enemyUnit1.enableBody = true;
	this.enemyUnit2.enableBody = true;
	this.enemyUnit3.enableBody = true;

	
	
    // Set up timer
    this.gameplayTimer = game.time.create(true);
    this.gameplayTimer.add(180000, this.gotoGameWinState, this);
    this.gameplayTimer.start();
    
   
    
    //this.gameplayTimer
    
    //game.add.sprite(0,0, "sky");
    
    // Platforms
	/*
    this.platforms = game.add.group();
    this.platforms.enableBody = true;
    
    // Ground
    let ground = this.platforms.create(0, game.world.height - 64, "platform");
    ground.scale.setTo(2,2);
    ground.body.immovable = true;
    
    // Platforms
    let ledge = this.platforms.create(400, 400, "platform");
    ledge.body.immovable = true;
    ledge = this.platforms.create(-150, 250, "platform");
    ledge.body.immovable = true;
    */
    
    //Card group have to be declared first;
    this.tempCard = game.add.group();
    this.tempCard.enableBody = true;
    
    // Set up asherah pole
    this.asherahPole = new AsherahPole(game, 0, this.laneHeight*2, this);
   
    // Add input over and input out callback function
    
    // Timer UI
    this.scoreText = game.add.text(16,16,"Time Left: 3:00", {fontSize:"32px", fill:"#ffffff"});
	console.log(this);
    
    // Card information UI
    this.cardInfoText = game.add.text(game.world.width*0.75, this.laneHeight*3, "Card Info", {fontSize:"32px", fill:"#ffffff"});
    this.cardInfoText.alpha = 0;  // Hide when game starts
    
    //group of cards for the game
    this.permcard = game.add.group();
    
    let permycard = new Cards(this.game, 1, 1, this);
    permycard.inputEnabled = true;
    permycard.input.enableDrag();
    permycard.events.onDragStart.add(this.dragCardStart,this);
    permycard.events.onDragUpdate.add(this.dragCardUpdate,this);
    permycard.events.onDragStop.add(this.dragCardStop,this);
    this.permcard.add(permycard);
    for(let i = 2; i < 7; i++)
    {
        let rantemp = this.game.rnd.integerInRange(2,4);
        let cardtemp = new Cards(this.game, i, rantemp, this);
        cardtemp.inputEnabled = true;
        cardtemp.enableBody = true;
        cardtemp.input.enableDrag();
        cardtemp.events.onDragStart.add(this.dragCardStart,this);
        cardtemp.events.onDragUpdate.add(this.dragCardUpdate,this);
        cardtemp.events.onDragStop.add(this.dragCardStop,this);
      
        
        this.tempCard.add(cardtemp);
        
    }
    
    //Card Drag
    
    /*
    this.cursors = game.input.keyboard.createCursorKeys();
};
    
    // Score UI
    this.scoreText = game.add.text(16,16,"Score: 0", {fontSize:"32px", fill:"#ffffff"});
    */
	//add units to lanes by pressing Q,W,E (testing purpose)
	
	//looks like we don't need them now
	/*
    this.Qkey = game.input.keyboard.addKey(Phaser.Keyboard.Q);
	this.Wkey = game.input.keyboard.addKey(Phaser.Keyboard.W);
	this.Ekey = game.input.keyboard.addKey(Phaser.Keyboard.E);
	*/
};

gameplayState.prototype.update = function(){
	
    // Update group
//    this.updateGroup(this.friendlyUnit1);
//	this.updateGroup(this.friendlyUnit2);
//	this.updateGroup(this.friendlyUnit3);
    
	//faito
	//simply do health - enemy_damage
    game.physics.arcade.overlap(this.friendlyUnit1, this.enemyUnit1, this.fight ,null, this);
	game.physics.arcade.overlap(this.friendlyUnit2, this.enemyUnit2, this.fight ,null, this);
	game.physics.arcade.overlap(this.friendlyUnit3, this.enemyUnit3, this.fight ,null, this);
	
	/*
	if(this.Qkey.isDown){
		console.log("q pressed");
		this.addUnit(this.friendlyUnit1, 0);
	}
	if(this.Wkey.isDown){
		console.log("w pressed");
		this.addUnit(this.friendlyUnit2, 1);
	}
	if(this.Ekey.isDown){
		console.log("w pressed");
		this.addUnit(this.friendlyUnit3, 2);
	}
	*/
	this.laneUpdate(this.friendlyUnit1);
	this.laneUpdate(this.friendlyUnit2);
	this.laneUpdate(this.friendlyUnit3);
	//this.updateCards(this.tempCard);

    // Update timer
    this.scoreText.text = "Time Left: " + this.msToTime(this.gameplayTimer.duration);
	
    
};
/*
	parameters:
		group - the friendlyUnit group this unit would join
		mult - a variable used to control spawning position

	units are actually added into the group when the constructor of 
	basicUnit is called
*/
gameplayState.prototype.addUnit = function(group, mult) {
	new basicUnit(group , 0, 40 + this.laneHeight*mult);
};

gameplayState.prototype.render = function(){
    game.debug.geom(this.line1);
    game.debug.geom(this.line2);
    game.debug.geom(this.line3);
};

gameplayState.prototype.gotoGameWinState = function(){
    game.state.start("GameWin");
};

gameplayState.prototype.StartCooldown = function(Cards)
{
    Cards.activated = false;
}
// On input down on card
gameplayState.prototype.showHideCardInfo = function(sprite, pointer) {
    
    this.cardInfoText.alpha = 1;
    
    if (this.selectedCard === sprite) {
        // hide card's info
        this.cardInfoText.alpha = 0;
        console.log("Hide card info");
        this.selectedCard = null;
    }
    else {
        
        if (this.selectedCard !== null) {
            // place it back(maybe) or other necessary changes for the original selected card
        }
        // Show currect selected card's info
        this.cardInfoText.alpha = 1;
        
        // Change text based the sprite player is selecting
        console.log("Show card info");
        
        this.selectedCard = sprite;
    }
};

// Card draging effect
gameplayState.prototype.dragCardStart = function(Cards, pointer, dragX, dragY) {
    Cards.alpha = 0.5;
};

gameplayState.prototype.dragCardUpdate = function(Cards, pointer, dragX, dragY, snapPoint) {
    
};

gameplayState.prototype.dragCardStop = function(Cards, pointer) {
    let mouseY = pointer.y;
    
    // May need to invoke some functions to take effect of card or take it back to card area
    Cards.alpha = 1;
    
    // Deselect cards when they are placed in lanes
    if (mouseY < this.laneHeight*3) {
        Cards.deSelect();
    }
    
    //ONLY for card id of 1, the permanent card
    if(Cards.id === 1 && Cards.activated === false)
    {
        if ( mouseY <this.laneHeight) {
            console.log("Lane1");
            this.addUnit(this.friendlyUnit1, 0);
            Cards.x = Cards.savedx;
            Cards.y = Cards.savedy;
            Cards.activated = true;
            Cards.startcd();
        }
        else if (this.laneHeight<=mouseY && mouseY <this.laneHeight*2) {
            console.log("Lane2");
            this.addUnit(this.friendlyUnit2, 1);
            Cards.x = Cards.savedx;
            Cards.y = Cards.savedy;
            Cards.activated = true;
            Cards.startcd();

        }
        else if (this.laneHeight*2<=mouseY && mouseY <this.laneHeight*3) {
            console.log("Lane3");
            this.addUnit(this.friendlyUnit3, 2);
            Cards.x = Cards.savedx;
            Cards.y = Cards.savedy;
            Cards.activated = true;
            Cards.startcd();

        }
        else if (this.laneHeight*3<=mouseY ) {
            console.log("Cards");
            // Back to original position
            Cards.x = Cards.savedx;
            Cards.y = Cards.savedy;

        }
        else {
            console.log("None");
        }
    }
    else if (Cards.id ===1)
    {
        Cards.x = Cards.savedx;
        Cards.y = Cards.savedy;
    }
    else if(Cards.id !== 1)
    {
        if ( mouseY <this.laneHeight) {
            console.log("Lane1");
            Cards.useAbility(this.friendlyUnit1, this.enemyUnit1);
        }
        else if (this.laneHeight<=mouseY && mouseY <this.laneHeight*2) {
            console.log("Lane2");
            Cards.useAbility(this.friendlyUnit2, this.enemyUnit2);
        }
        else if (this.laneHeight*2<=mouseY && mouseY <this.laneHeight*3) {
            console.log("Lane3");
            Cards.useAbility(this.friendlyUnit3, this.enemyUnit3);
        }
        else if (this.laneHeight*3<=mouseY ) {
            console.log("Cards");
            // Back to original position
            Cards.x = Cards.savedx;
            Cards.y = Cards.savedy;
        }
        else {
            console.log("None");
        }
        
        if (mouseY < this.laneHeight*3) {
            for(i= Cards.num -1; i < this.tempCard.length; i++)
            {
               //game.physics.arcade.moveToXY(this.tempCard.children[i], this.tempCard.children[i].x -240, this.tempCard.children[i].y, 5, 100);
                this.tempCard.children[i].x -= 240;
                this.tempCard.children[i].num -= 1;
                this.tempCard.children[i].savedx -= 240;
                this.tempCard.children[i].lastx -= 240;
                //this.tempCard[i].num -= 1;
             
                //this.tempCard.children[i].shift();
            }
            this.tempCard.remove(Cards);

            Cards.kill();
        }

    }
    
    
};

gameplayState.prototype.fight = function(unit, enemy){
	//stop both sides
	unit.body.velocity.x = 0;
	enemy.body.velocity.x = 0;
	unit.health -= enemy.damage;
	enemy.health -= unit.damage;
};
gameplayState.prototype.laneUpdate = function(group){
	if (group.length > 0){
		//console.log("------------------------");
		//iterate through all elements except last one
//		while(group.cursorIndex < group.length - 1){
//			//show unit health (testing purpose)
//			//console.log(group.cursor.body.x);
//			if(group.cursor.body.x > game.world.width || group.cursor.health <= 0){
//				console.log(group.length);
//				console.log("kill");
//				group.cursor.kill();
//				group.remove(group.cursor);
//				console.log(group.length);
//			}
//			group.next();
//			
//		}
		//now it's the last one
		//console.log(group.cursor.body.x);
//		if(group.cursor.body.x > game.world.width || group.cursor.health <= 0){
//			console.log(group.length);
//			console.log("kill");
//			group.cursor.kill();
//			group.remove(group.cursor);
//			console.log(group.length);
//			if(group.length === 0){
//				group.destroy(true,true);
//			}
//			else{
//				group.next();
//			}
//		}
	}
};
gameplayState.prototype.updateCards = function(tempCard){
   
    for(i = 0; i < tempCard.length; i++)
    {
        if(tempCard.children[i].body.velocity.x < 0)
        {
            tempCard.children[i].stop();
            //tempCard.children[i].x = tempCard.children[i].lastx;
            
        }

    }


};
gameplayState.prototype.msToTime = function(s) {
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;
    if (secs < 10) {
        return mins + ':0' + secs;
    }
    else {
        return mins + ':' + secs;
    }
};