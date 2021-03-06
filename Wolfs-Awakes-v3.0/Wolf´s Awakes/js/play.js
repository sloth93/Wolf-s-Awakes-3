var playState = {
    
  
    
    //obtenemos una variable random
   //var x = game.world.randomX;
   //var y = game.world.randomY;


	 create: function() { 
        game.add.tileSprite(0, 0, 24000, 600, 'fondo');
         
         
  
        
    //array de enemigos :) para matar un rato
    
         
         
         
             var posicion; 
             var pociones;
    
   
    
 
     
    
        
    enemigosTotales = 30;
    enemigosVivos = 30;
        
    
    
    
		this.cursor = game.input.keyboard.createCursorKeys();
		game.input.keyboard.addKeyCapture([Phaser.Keyboard.UP, Phaser.Keyboard.DOWN, Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT]);
		this.wasd = {
			up: game.input.keyboard.addKey(Phaser.Keyboard.W),
			left: game.input.keyboard.addKey(Phaser.Keyboard.A),
			right: game.input.keyboard.addKey(Phaser.Keyboard.D)
		};

		game.global.score = 0;
		this.createWorld();
        
        this.stateScore = false;
        
		this.player = game.add.sprite(game.world.centerX-11500, game.world.centerY+600, 'player');
		game.physics.arcade.enable(this.player); 
		this.player.anchor.setTo(0.5, 0.5);
		this.player.body.gravity.y = 500;
		this.player.animations.add('right', [0, 1, 2, 3, 4, 5, 6], 14, true);
		//this.player.animations.add('left', [1, 2], 8, true);
        game.camera.follow(this.player);
        
        
        this.follower = game.add.sprite(game.world.centerX-11900, game.world.centerY+500, 'follower');
        game.physics.arcade.enable(this.follower);
        this.follower.enableBody = true;
        this.player.anchor.setTo(0.5, 0.5);
  
        this.turbo = 100;
        this.time = 500;
         

		this.enemies = game.add.group();
		this.enemies.enableBody = true;
		this.enemies.createMultiple(10, 'enemy');
        //enemies.push(this.enemies);
         
         
         
        
        //array de pociones
        this.pociones = game.add.group();
         this.ArrayPociones = [];
         this.pocion = null;
         this.powerUp();
        
        
        

        
        //Disparar
        this.balas = game.add.group();
        this.balas.enableBody = true;
        this.balas.physicsBodyType = Phaser.Physics.ARCADE;
        this.balas.createMultiple (100, 'laser');
        this.balas.setAll('anchor.x' , 0.5);
        this.balas.setAll('anchor.y' , 1);
        this.balas.setAll('outOfBoundSkill', true);
        this.balas.setAll('checkWorldBounds', true);
        this.balaTime = 1500;
        this.tecla = game.input.keyboard.addKey(Phaser.Keyboard.X);
        this.tecla2 = game.input.keyboard.addKey(Phaser.Keyboard.Z);
        this.tecla3 =  game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        
      
		this.scoreLabel = game.add.text(30, 30, 'score: 0', { font: '18px Arial', fill: '#ffffff' });	
       
         //Vidas
                      this.vidaLabel = game.add.text(30, 60, 'Vidas: 5', { font: '18px Arial', fill: '#ffffff' });
                      game.global.vida = 5;
        
        //Generador de vidas	
		              this.vidas = game.add.group();
		              this.vidas.enableBody = true;
		              this.vidas.createMultiple(30, 'corazon');
        //loop que crea las vidasR
                      game.time.events.loop(10000, this.addVida, this);
                      


    //crea los enemigos cada 2 segundos
        this.createWorld();
		game.time.events.loop(1200, this.addEnemy, this);
        
        

//for (var i = 0; i < 40; i++)
  //{
    //   enemies.create(game.world.randomX, game.world.randomY, 'loop');
  //}
//    }
        
        
        
		this.emitter = game.add.emitter(0, 0, 15);
		this.emitter.makeParticles('pixel');
		this.emitter.setYSpeed(-150, 150);
		this.emitter.setXSpeed(-150, 150);
		this.emitter.gravity = 0;

		this.jumpSound = game.add.audio('jump');
		this.coinSound = game.add.audio('coin');
		this.deadSound = game.add.audio('dead');	
		
		this.nextEnemy = 0;
        
      
        
        
        
 
	},
    
   

    
    follow: function(){
        
   
        
        
        
        
    },
    
    
    

	update: function() {
        
       
          //solo me pilla la primera pocion
		game.physics.arcade.overlap(this.player, this.ArrayPociones, this.takeCoin, null, this);
		game.physics.arcade.collide(this.player, this.layer);
		game.physics.arcade.collide(this.enemies, this.layer);
        game.physics.arcade.collide(this.follower, this.player, this.loseVida, null, this);
        
        
        
        //fisicas
   //Sistema per matar enemics disparant
        this.balas.forEachAlive(function(dispararBala){
            this.enemies.forEachAlive(function(enemy){
                game.physics.arcade.overlap(this.balas, this.enemies, this.enemyDie, null, this);
            },this);
        },this);
         //añadimos fisicas a las vidas
                      game.physics.arcade.collide(this.vidas, this.walls);
        //añadimos el contacto con el jugador
                      game.physics.arcade.overlap(this.player, this.vidas, this.takeVida, null, this);

	//	if (!this.player.inWorld) {
	//		this.playerDie();
	//	}

		this.movePlayer();
        this.follow();

		if (this.nextEnemy < game.time.now) {
			var start = 4000, end = 1000, score = 100;
			var delay = Math.max(start - (start-end)*game.global.score/score, end);
			    
			this.addEnemy();
			this.nextEnemy = game.time.now + delay;
            
            
            
            }


          if(this.tecla.isDown){
              this.dispararBala();
          }
        
         if(this.tecla2.isDown){
              this.dispararBala();
          }
        
        



	},
    
    
      enemyDie: function(bullet, enemy) {  
        bullet.kill();
        this.emitter.x = enemy.x;
        this.emitter.y = enemy.y;
        this.emitter.start(true, 600, null, 15);
        enemy.kill();
        
    },
    

    

	movePlayer: function() {
        
          
        
		
		 if (this.cursor.right.isDown || this.wasd.right.isDown) {
            this.follower.body.velocity.x = 200; 
			this.player.body.velocity.x = 200;
			this.player.animations.play('right');
		}
	
    
        
		if (this.cursor.up.isDown || this.wasd.up.isDown){
			this.jumpSound.play();
			this.player.body.velocity.y = -320;
		}
        
        if (this.cursor.down.isDown){
			this.player.body.velocity.y = 320;
		}
        
    
        if (this.tecla3.isDown){
            if(this.turbo > 0){
                
                    this.player.body.velocity.x = 400;
                   this.turbo-=1;
                   
                
            }
            } else {
             this.player.body.velocity.x = 200;
            }
        
        
	},

	addEnemy: function() {
		var enemy = this.enemies.getFirstDead();
	 var Grande = Phaser.Math.randomSign();
		if (!enemy) {
			return;
		}
        
  

                 enemy.anchor.setTo(0.5, 1);
		         enemy.reset(game.world.centerX, 0);
		         enemy.body.gravity.y = 500;
		         enemy.body.velocity.x = 100 * Phaser.Math.randomSign();
		         enemy.body.bounce.x = 1;
		         enemy.checkWorldBounds = true;
		         enemy.outOfBoundsKill = true;
                
                

        
	},

	takeCoin: function(player, pocion) {
        
        console.log('hoasfdffdsfds');
        this.coinSound.play();
        pocion.kill();
        
        
	
	},
    
    
    
    
    killsuperarLabel: function(){
               game.world.remove(this.superarLabel);
    
        
    },
    
    

    

	
	powerUp: function() {
        
        
 
        
        var powerUp_x = [6400,6700];
        var powerUp_y = [1350,1350];
        
		var powerUp_pos = [
			{x: 6400, y: 1350}, {x: 6500, y: 1350}, 
			{x: 6600, y: 1350}, {x: 6700, y: 1350}, 
			{x: 6800, y: 1350}, {x: 6900, y: 1350},
            {x: 7000, y: 1350}, {x: 7100, y: 1350}, 
            {x: 7200, y: 1350}, {x: 7300, y: 1350}, 
            {x: 7400, y: 1350}, {x: 7500, y: 1350}, 
            {x: 7700, y: 1350}, {x: 7900, y: 1350}, 
            {x: 8100, y: 1350}, {x: 8300, y: 1350}, 
		];
     
		for (var i = 0; i < powerUp_x.length; i++) {
                   
                    console.log(powerUp_x);
                    
                    this.pocion = this.pociones.create(powerUp_x[i],powerUp_y[i],'coin');    
                    
                    this.game.physics.arcade.enable(this.ArrayPociones);
                
                    this.ArrayPociones.push(this.pocion);
        
			  
            
    
        }
        
      
            
		},

		
		
	

                
                
                
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
      
    //funcion vidas
    addVida: function(){
      var vidax = this.vidas.getFirstDead();
        if (!vidax) {
			return;
		}
        
        vidax.anchor.setTo(0.5, 1);
		vidax.reset(game.world.centerX, 0);
		vidax.body.gravity.y = 300;
		vidax.body.velocity.x = 70 * Phaser.Math.randomSign();
		vidax.body.bounce.x = 1;
		vidax.checkWorldBounds = true;
		vidax.outOfBoundsKill = true;
        
    },
    
    
    
    dispararBala: function(){
        
        if(game.time.now > this.balaTime)
        {
            this.bala = this.balas.getFirstExists(false);
            
        if(this.bala){
              if(this.tecla.isDown){
                  this.bala.reset(this.player.x, this.player.y + 8);
                  this.bala.body.velocity.x = 400;
                  this.balaTime = game.time.now + 500;
              }else if (this.tecla2.isDown){
                  this.bala.reset(this.player.x, this.player.y + 8);
                  this.bala.body.velocity.x = -400;
                  this.balaTime = game.time.now + 500;
              } else {
                    this.bala.reset(this.player.x, this.player.y + 8);
                    this.bala.body.velocity.x = 400;
                    this.balaTime = game.time.now + 500;
        
              }
               
        }
    }
        
},
    
    
    
    
    loseVida: function(){
        
       
        	game.global.vida -= 1; 
		    this.vidaLabel.text = 'Vidas: ' + game.global.vida; 
            for (var i = 0; i<this.enemies.length; i++){
            this.enemies.getAt(i).kill();
            }
        
          if(game.global.vida < 0){
              game.state.start('menu');
          }
        
        
    },
    
    takeVida: function() {
        
		game.global.vida += 1; 
        this.vidaLabel.text = 'Vidas: ' + game.global.vida;
		   for (var i = 0; i<this.enemies.length; i++){
            this.vidas.getAt(i).kill();
            }
	},

	playerDie: function() {
	
		game.state.start('menu');
		

		this.deadSound.play();
		this.emitter.x = this.player.x;
		this.emitter.y = this.player.y;
		this.emitter.start(true, 600, null, 15);

		
	},

	startMenu: function() {
		game.state.start('menu');
	},

	createWorld: function() {
        
        
   
        this.map = this.game.add.tilemap('Runner');
        this.map.addTilesetImage('terrain','terreno');
        this.map.addTilesetImage('Ugly_cropped_lava_flow_make_a_better_1','lava');
        this.map.addTilesetImage('CaveBackground','cave1');
        this.map.addTilesetImage('CaveBaseForeground','cave2');
        this.map.addTilesetImage('CaveEntrance','cave3');
        this.map.addTilesetImage('CaveEntranceD','cave4');
        this.map.addTilesetImage('platshrooms','setas');
        this.map.addTilesetImage('Jungle_terrainwater','selva');
        this.map.addTilesetImage('stone','stone');
        
        
        this.layer = this.map.createLayer('Capa de Patrones 1');
        
        //this.game.add.sprite(0, 0, 'fondo');
        
       
        this.layer.resizeWorld();
        this.map.setCollisionBetween(1,5000);
    
	}
        

    
};