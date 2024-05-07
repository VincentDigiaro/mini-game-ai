




var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var player, perso1;
var cursors, spaceBar;
var isTouching = false; // Pour savoir si player touche perso1

function preload() {
    this.load.image('background', 'back.png');
    this.load.image('perso1', 'jean.png');
    this.load.image('perso2', 'chacha.png');
    this.load.spritesheet('player', 'char.png', {
        frameWidth: 27,
        frameHeight: 35,
    });
}

function create() {
    this.add.image(400, 300, 'background');

        this.anims.create({
        key: 'marcherUp',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 2 }),
        frameRate: 10,
        repeat: -1 // L'animation bouclera indéfiniment
    });
	
	    this.anims.create({
        key: 'marcherDown',
        frames: this.anims.generateFrameNumbers('player', { start: 3, end: 5 }),
        frameRate: 10,
        repeat: -1 // L'animation bouclera indéfiniment
    });
	
	this.anims.create({
        key: 'marcherRight',
        frames: this.anims.generateFrameNumbers('player', { start: 6, end: 8 }),
        frameRate: 10,
        repeat: -1 // L'animation bouclera indéfiniment
    });

    perso1 = this.physics.add.sprite(100, 100, 'perso1');
	perso1.setImmovable(true); // Empêche perso1 de se déplacer lors des collisions
    perso1.body.moves = false; // Désactive le déplacement physique de perso1
	
	perso2 = this.physics.add.sprite(300, 100, 'perso2');
	perso2.setImmovable(true); // Empêche perso1 de se déplacer lors des collisions
    perso2.body.moves = false; // Désactive le déplacement physique de perso1
	
	
	const detectionZone = this.add.zone(perso1.x, perso1.y, 80, 80); // Vous pouvez ajuster la taille
    this.physics.world.enable(detectionZone); // Active la physique pour cette zone
    detectionZone.body.setAllowGravity(false);
    detectionZone.body.moves = false;
	
	const detectionZone2 = this.add.zone(perso2.x, perso2.y, 80, 80); // Vous pouvez ajuster la taille
    this.physics.world.enable(detectionZone2); // Active la physique pour cette zone
    detectionZone2.body.setAllowGravity(false);
    detectionZone2.body.moves = false;
	
	
	
    player = this.physics.add.sprite(150, 100, 'player');
    player.setCollideWorldBounds(true);

    this.physics.add.collider(player, perso1);
	this.physics.add.overlap(player, detectionZone, function () {
		model = "jean"
        isTouching = true;
    }, null, this);

	this.physics.add.collider(player, perso2);
	this.physics.add.overlap(player, detectionZone2, function () {
		model = "chacha"
        isTouching = true;
    }, null, this);
	
	
    cursors = this.input.keyboard.createCursorKeys();
    ctrl = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE); // Écouter la barre d'espace
	this.input.keyboard.clearCaptures();
}

function update() {
    player.setVelocity(0);

    if (cursors.left.isDown) {
        player.anims.play('marcherRight', true);   
		player.flipX = false;
    } else if (cursors.right.isDown) {
        player.anims.play('marcherRight', true);
		player.flipX = true;
    } else if (cursors.up.isDown) {
        player.anims.play('marcherUp', true);
		player.flipX = false;
    } else if (cursors.down.isDown) {
        player.anims.play('marcherDown', true);
		player.flipX = false;
    } 
	
	if (cursors.left.isDown) {
        player.setVelocityX(-160);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
    } if (cursors.up.isDown) {
        player.setVelocityY(-160);
    } else if (cursors.down.isDown) {
        player.setVelocityY(160);
    } 
	
	

    if (ctrl.isDown && isTouching) {
        triggerFunction(); // Déclencher une fonction spécifique
    }
	

	if(!isTouching){
		chatBox.style.display = "none";	
		var output = document.getElementById("chatoutput");
        output.value = ""; 
	}
	 // Réinitialiser isTouching à chaque frame
	
    if (player.body.velocity.x == 0 && player.body.velocity.y == 0) {
        player.anims.stop();
    } else {
		isTouching = false;
	}

    
}

function triggerFunction() {
       var chatBox = document.getElementById("chatBox");
	   chatBox.style.display = "block"; // Affiche la fenêtre de chat
	   
	   var chatInput = document.getElementById("chatInput");
	   chatInput.focus(); // Met le focus sur le champ de saisie
	   

}

