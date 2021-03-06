//assume we have units stored in groups
//and each lane has its own group of friendly units and enemy units
//lane is an int -- 1, 2 or 3

let basicEnemyUnit = function(group, lane_x, lane_y, lane_id, pole, class_id){
	this.lane_x = lane_x;
	this.lane_y = lane_y;
    this.speed = 100;
    this.pole = pole;
    this.class_id = class_id;
	this.create();
    
	this.unit.lane_id = lane_id;
   
   
  
	console.log("enemy unit constructor:");
	console.log(group);
	group.add(this.unit);
};

basicEnemyUnit.prototype.create = function(){
	//assume picture has been loaded in gameplayState
	//go with murph for now
	console.log("creating basic unit");
	console.log(this);
   
     if(this.class_id === 1)
         {
	this.unit = game.add.sprite(this.lane_x, this.lane_y, "invader");
         }
    else{
        this.unit = game.add.sprite(this.lane_x, this.lane_y, "invader2");
    }
     this.unit.class_id = this.class_id;
    // Create Animations 
    //this.unit.animations.add("spawn", [0,1,2,3,4,5,6,7,8], 10, false);
    if (this.class_id === 1) {
        this.unit.animations.add("idle", [0], 10, true);
        this.unit.animations.add("run", [1,2,3,4], 10, true);
        this.unit.animations.add("combat", [5,0,6,7], 10, true);
        this.unit.animations.add("death", [8,9,10], 10, false);
        this.unit.animations.add("divineDeath", [11,12,13,14,15,16], 10, false);
    }
    else if (this.class_id === 2) {
        this.unit.animations.add("idle", [0], 10, true);
        this.unit.animations.add("run", [1,2,3,4], 10, true);
        this.unit.animations.add("combat", [5,6,7,8], 10, true);
        this.unit.animations.add("death", [9,10,11], 10, false);
        this.unit.animations.add("divineDeath", [12,13,14,15,16,17], 10, false);
    }
    this.unit.deadBySpell = false;
	this.unit.in_fight = false;
	this.unit.go_fight = false;
	this.unit.attacking_enemy = null;
    if(this.classid === 1){
    this.unit.atkspd = 500; //attack every 0.5 sec
    }
    else{
        this.unit.atkspd = 250;
    }
    //pole related variable
	this.unit.attacking_pole = false;
	this.unit.go_atk_pole = false;
   
    
	//make them weak for now
	this.unit.health = 200;
    this.unit.maxHealth = 200;
	this.unit.atkdmg = 50;
    //archer stats
    
	game.physics.arcade.enable(this.unit);
	this.unit.body.velocity.x = 0;
    this.unit.speed = this.speed;
    this.unit.animations.play("idle")
	this.unit.in_lane = false;
	this.unit.alive = true;
	this.unit.in_shift = false;
	//some random number
	this.unit.prev_velo_x = -100;
	this.unit.prev_velo_y = -100;
    
    // Load sound effects
    this.unit.attack_snd = game.add.audio("attack");
    this.unit.attack_snd.volume = 0.75;
    this.unit.fireball_snd = game.add.audio("fireball");
    
     if(this.class_id === 2)
        {
        this.unit.health = 150;
        this.unit.maxHealth = 150;
	    this.unit.atkdmg = 1;
        this.unit.body.setSize( 1024, 180, -500, 0)
		//530            sprite:196        298//  
		//////////////////////
		//                  //
		//////////////////////
        }
    // For wall
    this.unit.is_Stucked = false;
    this.unit.startStucked = function() {
        if (!this.in_fight && !this.is_Stucked) {
            this.is_Stucked = true;
            this.prev_velo_x = this.body.velocity.x;
            this.prev_velo_y = this.body.velocity.y;
			this.animations.play("idle");
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;
        }
    };
    this.unit.stopStucked = function() {
        if (this.is_Stucked) {
            this.is_Stucked = false;
			//this.animations.play("run");
            this.body.velocity.x = this.prev_velo_x;
            this.body.velocity.y = this.prev_velo_y;
        }
    };
    
    // For damage all effect
    this.unit.meteorMask = game.add.sprite(140,200,"meteor");
    this.unit.meteorMask.origin = [-985,-925];
    this.unit.meteorMask.target = [140, 200];
    this.unit.meteorMask.speed = 1300;
    this.unit.meteorMask.dealtDamage = 10000;
    this.unit.meteorMask.anchor.set(0.5,1);
    this.unit.meteorMask.animations.add("flying",[0,1,2],8,true);
    this.unit.meteorMask.animations.add("impact", [3,4,5,6,7],8,false);
    this.unit.meteorMask.alpha = 0;
    
    this.unit.addChild(this.unit.meteorMask);
    this.unit.meteorDamageAnim = function(amount) {
        //this.damage(amount);
        this.meteorMask.dealtDamage = amount;
        this.meteorMask.position.x = this.meteorMask.origin[0];
        this.meteorMask.position.y = this.meteorMask.origin[1];
        this.meteorMask.alpha = 1;
        this.meteorMask.animations.play("flying");
    }
    
    // For selecting effect
    this.unit.isSelected = false;
    this.unit.selectingTime = 0;
    this.unit.alphaToTime = function(time) {
        return Math.cos(4 * Math.PI * time) * 0.4 + 0.6; 
    };
    this.unit.startSelecting = function() {
        this.isSelected = true;
    };
    this.unit.stopSelecting = function() {
        this.isSelected = false;
    };
    this.unit.startSelectingOnLane = function(id) {
        if (this.lane_id === id) {
            this.isSelected = true;
        }
    };
    this.unit.stopSelectingOnLane = function(id) {
        if (this.lane_id === id) {
            this.isSelected = false;
        }
    };
    
    // Kill lane_id matches
    this.unit.killOnLane = function(id) {
        if (this.lane_id === id) {
            this.deadBySpell = true;
            this.fireball_snd.play();
            this.damage(10000);
        }
    };
    
    // Debug UI
    this.unit.isDebug = true;
    if (this.unit.isDebug) {
        this.unit.debugText = game.add.text(115,0,"health", {fontSize:"28px", fill:"#ffffff"});
        this.unit.addChild(this.unit.debugText);
    }
    // Override update function
    this.unit.update = function(){
        
        // Debug
        if (this.isDebug) {
            this.debugText.text = Math.max(0,Math.ceil(this.health)) + " / " + this.maxHealth;
        }
        
		//console.log("unit health: " + this.health);
            
			//going from (350, 397.5) to (1936, 45) @ 100
			//dx = 1486
			//dy = 270
        
        // Animate flying meteor
        if (this.meteorMask.animations.currentAnim.name === "flying") {
            console.log("meteor speed " + (this.meteorMask.speed * game.time.elapsed));
            this.meteorMask.position.x += this.meteorMask.speed * game.time.elapsed / 1000;
            this.meteorMask.position.y += this.meteorMask.speed * game.time.elapsed / 1000;
            
            if (this.meteorMask.position.x >= this.meteorMask.target[0] && this.meteorMask.position.y >= this.meteorMask.target[1]) {
                this.meteorMask.position.x = this.meteorMask.target[0];
                this.meteorMask.position.y = this.meteorMask.target[1];
                this.meteorMask.animations.play("impact");
                this.fireball_snd.play();
                this.damage(this.meteorMask.dealtDamage);
            }
        }
        
        // Hide meteor effect
        if (this.meteorMask.animations.currentAnim.name === "impact" && this.meteorMask.animations.currentAnim.isFinished) {
            this.meteorMask.alpha = 0;
        }
        
        // Changing alpha if this is selected
        if (this.isSelected) {
            this.selectingTime += game.time.elapsed/1000;
            this.alpha = this.alphaToTime(this.selectingTime);
        }
        else {
            this.selectingTime = 0;
            this.alpha = 1;
        }
		
		this.velo_x_mult = 1486.0/325.0;
		//start moving
		if(this.animations.currentAnim.name === "idle" && !(this.is_Stucked)){
			this.body.velocity.x = -18 * (this.velo_x_mult) - 40;
			this.animations.play("run");
		}
           
		//turn towards the pole
        if(this.lane_id === 0 && !(this.in_lane) && !(this.in_shift)){
            if(this.class_id === 1)
                {
			if(this.body.x <= 493.293538461538){
				this.in_shift = true;
				this.body.velocity.y = 135;
				this.body.velocity.x = -((18 * (this.velo_x_mult)) - 20);
			}
                }
            else 
                {
                    
                    
           if(this.body.x <= 493.293538461538 - 500){
                
				this.in_shift = true;
				this.body.velocity.y = 135;
				this.body.velocity.x = -((18 * (this.velo_x_mult)) - 20);
                
			}
                }
        }
		else if(this.lane_id === 2 && !(this.in_lane) && !(this.in_shift)){
            if(this.class_id === 1)
                {
			if(this.body.x <= 502.63876923076873){
				this.in_shift = true;
				this.body.velocity.y = -135;
				this.body.velocity.x = -((18 * (this.velo_x_mult)) - 20);
			}
                }
            else
                {
            if(this.body.x <= 502.63876923076873 - 500){
                 this.body.velocity.x = 0;
               
                
				this.in_shift = true;
				this.body.velocity.y = -135;
				this.body.velocity.x = -((18 * (this.velo_x_mult)) - 20);
                
			}
                    
                }
		}
		//now at center lane
		//this section should also be triggered once
		if(this.body.y <= (402.5 - 60) && this.body.y >= (392.5 - 60) && this.lane_id !== 1 && !(this.in_lane)){
            if(this.class_id === 1)
                {
			this.body.velocity.y = 0;
			this.body.velocity.x = -18 * (this.velo_x_mult) - 40;
			this.in_lane = true;
                }
              else
                {
            if(this.body.x <= 502.63876923076873 - 500){
                 this.body.velocity.x = 0;
                this.animations.play("idle");
            }
		}
        }
		
		if(this.animations.currentAnim.name === "combat"){
			if(this.animations.currentFrame.index === 7 && !(this.attacked)){
                this.attack_snd.play();
                if(this.class_id === 1)
                    {
				        this.attacked = true;
                        this.attacking_enemy.damage(this.atkdmg);
                    }
				console.log("attack");
                if(this.class_id === 2)
                    {
                        let arrow = game.add.sprite(this.body.x + 550, this.body.y + 88, "arrow");
                        game.physics.arcade.enable(arrow);
                        arrow.enableBody = true;
                        arrow.body.velocity.x = -600;
                        game.arrow.add(arrow);
                    }
			
			}
			else if(this.animations.currentFrame.index !== 7){
				this.attacked = false;
			}
		}
		
		if(this.in_fight){
			if(this.attacking_enemy.alive === false){
				
				this.animations.play("run");
				if(this.body.y <= 402.5 && this.body.y >= 392.5){
					this.body.velocity.y = 0;
				}
				else{
					this.body.velocity.y = this.prev_velo_y;
				}
				this.body.velocity.x = this.prev_velo_x;
				
				this.in_fight = false;
			}
		}
		
		//fighting
		if(this.go_fight){
			this.enter_fight();
			this.go_fight = false;
		}
		
		//go attack the pole
		if(this.go_atk_pole){
			this.go_atk_pole = false;
			this.start_atk_pole();
		}
		
		//killed
        if(this.health <= 0 && ((this.animations.currentAnim.name === "death") || (this.animations.currentAnim.name === "divineDeath")) && this.animations.currentAnim.isFinished){
			this.alive = false;
            this.kill();
            this.parent.remove(this);
            this.destroy();
        }
		
    };
	//override damage
	this.unit.damage = function(amount){
		if(this.alive){
			this.health -= amount;
			console.log("enemy health: " + this.health);
			if(this.health <= 0){
                this.body.velocity.x=0;
                this.body.velocity.y=0;

                if (this.deadBySpell) {
                    this.animations.play("divineDeath");
                } 
                else {
				    this.animations.play("death", 10, false, true);
                }
			}
		}
	}
    this.unit.enter_fight = function(){
		this.animations.play("combat");
    	this.in_fight = true;
        this.attacking_pole = false;
		this.prev_velo_x = this.body.velocity.x;
		this.prev_velo_y = this.body.velocity.y;
		this.body.velocity.x = 0;
		this.body.velocity.y = 0;
    }
	this.unit.start_atk_pole = function(){
		this.in_fight = false;
		this.attacking_pole = true;
		this.animations.play("combat");
		this.prev_velo_x = 0;
		this.prev_velo_y = 0;
		this.body.velocity.x = 0;
		this.body.velocity.y = 0;
	}
    // Play run animation
    
    this.unit.animations.play("spawn");
    
    this.unit.events.onKilled.add(this.pole.addEnergyonKill, this.pole);

};