import PARAMETERS from "./parameters";

export default class Dialogue extends Phaser.Scene{
    // Only works in the first room for some reason
    constructor() {
        super({ key: 'dialogue' });

        // Box dimensions (covering bottom 33%)
        this.boxWidth = PARAMETERS.GAME.WIDTH - PARAMETERS.DIALOGUE.SCALE_X;
        this.boxHeight = PARAMETERS.GAME.HEIGHT * PARAMETERS.DIALOGUE.SCALE_Y;
        this.boxX = PARAMETERS.DIALOGUE.OFFSET_X;
        this.boxY = PARAMETERS.GAME.HEIGHT - this.boxHeight - PARAMETERS.DIALOGUE.OFFSET_Y;
        this.dialogueText = null;
        this.dialogueBox = null;
        this.parentScene = null;
        this.line = "Taka taka MABOI";
        this.onComplete;
        console.log('Constructor Dialogue');
        this.optionWidth = PARAMETERS.GAME.WIDTH - 550;
        this.optionHeight = PARAMETERS.GAME.HEIGHT * 0.1;
        this.optionX = PARAMETERS.GAME.WIDTH*(1/2) + 20;
        this.optionY = this.boxY - this.optionHeight - 15;
        this.count = 0;
        this.speech = 0;
        this.choiceElements = []
    }
    
    init(info) {
        console.log('Init Dialogue, parent key:' + info.parent.key);
        console.log('Init Dialogue, next:' + info.next);
        this.parentKey = info.parent.key;
        this.line = info.next;
        this.onComplete = info.onComplete;
        this.choices = info.choices || [];
    }
    
    create(){
        this.parentScene = this.scene.get(this.parentKey);

        // Creates the blackbox of dialogue
        this.createBox();
        // Creates the text used in dialogue
        this.createText();

        
        this.input.on('pointermove', (pointer) => {
            let x = pointer.x, y = pointer.y;
            let i;
            for(i = 0; i < this.choiceElements.length; i++){
                if(x >= this.optionX && x <= this.optionX + this.optionWidth &&
                    y >= this.optionY - i*this.optionHeight*1.25 && y <= this.optionY + this.optionHeight - i*this.optionHeight*1.25
                ){
                    this.choiceElements[i].setAlpha(0.5);
                }
                else{
                    this.choiceElements[i].setAlpha(1);
                }
            }
        }, this.parentScene);

        // If the player clicks, we get out of the dialogue
        this.input.on('pointerdown', (pointer) => {
            this.count++;
            if(this.dialogueText.text.length == this.fullText.length || this.count == 2){
                if(this.choices.length == 0){
                    this.count = 0;
                    console.log("no options")
                    this.getOut();
                    if(this.onComplete) this.onComplete();
                }
                else {
                    let x = pointer.x, y = pointer.y;
                    let i;
                    for(i = 0; i < this.choices.length; i++){
                        if(x >= this.optionX && x <= this.optionX + this.optionWidth &&
                            y >= this.optionY - i*this.optionHeight*1.25 && y <= this.optionY + this.optionHeight - i*this.optionHeight*1.25
                        ){
                            this.count = 0;
                            this.getOut();
                            if(this.onComplete) this.onComplete(i);
                        }
                    }
                }
            }
            else {
                this.dialogueText.text = this.fullText;
            }
                
        });
    }
    
    update(){
        
    }

    getOut(){
        console.log('Dialogue click');
        this.parentScene.input.enabled = true;
        if (this.choiceText) {
            this.choiceText.forEach(choice => {
                choice.destroy();
            });
        }
        this.dialogueText.destroy();
        if (this.choiceElements) {
            this.choiceElements.forEach(choice => {
                choice.destroy();
            });
        }
        this.dialogueBox.destroy();
        this.scene.stop();
    }

    createBox() {
        console.log('Ping createBox');
        // Create a graphics object for the dialogue box
        this.dialogueBox = this.parentScene.add.graphics();

        // Shadow effect (soft white edges)
        this.dialogueBox.fillStyle(0xffffff, 0.7);
        this.dialogueBox.fillRoundedRect(this.boxX - 5, this.boxY - 5, this.boxWidth + 10, this.boxHeight + 10, 10);

        // Main black box
        this.dialogueBox.fillStyle(0x000000, 0.9);
        this.dialogueBox.fillRoundedRect(this.boxX, this.boxY, this.boxWidth, this.boxHeight, 10);
    }

    createText(){
        this.dialogueText = this.parentScene.add.text(
            this.boxX + 20, 
            this.boxY + 20,
            '', 
            {
            fontSize: "20px",
            fontFamily: "Comic Sans MS",
            color: "#ffffff",
            wordWrap: { width: this.boxWidth - 40, useAdvancedWrap: true }
        });

        this.fullText = this.getNextLine();

        this.currentCharIndex = 0;
        this.typeEvent = this.time.addEvent({
            delay: 50, // ms between each character
            callback: () => { 
                if (this.currentCharIndex < this.fullText.length && this.count == 0) {
                    this.playAudio(this.fullText[this.currentCharIndex].toLowerCase());
                    this.dialogueText.text += this.fullText[this.currentCharIndex];
                    this.currentCharIndex++;
                } 
                else {
                    
                    this.typeEvent.remove(); // Stop the event once all characters are shown
                    this.writeOptions();
                }
            },
            callbackScope: this,
            loop: true
        });
    }

    getNextLine(){
        return this.line;
    }

    writeOptions() {
        this.choiceText = [];
        this.choiceElements = [];
        this.currentOptionIndex = 0; // Track which choice is being typed
    
        this.typeNextOption(); // Start typing the first one
    }
    
    typeNextOption() {
        if (this.currentOptionIndex >= this.choices.length) {
            return; // All done
        }
    
        const index = this.currentOptionIndex;
        const texto = this.choices[index];

        // Create a graphics object for the dialogue box
        const optionBox = this.parentScene.add.graphics();

        // Shadow effect (soft white edges)
        optionBox.fillStyle(0xffffff, 0.7);
        optionBox.fillRoundedRect(this.optionX - 5, this.optionY - 5 - index*this.optionHeight*1.25, this.optionWidth + 10, this.optionHeight + 10, 10);

        // Main black box
        optionBox.fillStyle(0x000000, 0.9);
        optionBox.fillRoundedRect(this.optionX, this.optionY - index*this.optionHeight*1.25, this.optionWidth, this.optionHeight, 10);
        this.choiceElements.push(optionBox);
    
        const optionText = this.parentScene.add.text(
            this.optionX + 20,
            this.optionY + 20 - index * this.optionHeight * 1.25,
            '',
            {
                fontSize: "20px",
                fontFamily: "Comic Sans MS",
                color: "#ffffff",
                wordWrap: { width: this.optionWidth - 40, useAdvancedWrap: true }
            }
        );
    
        this.choiceText.push(optionText);
    
        let charIndex = 0;
    
        this.typeEvent = this.time.addEvent({
            delay: 50,
            callback: () => {
                if (charIndex < texto.length) {
                    this.playAudio(texto[charIndex].toLowerCase());
                    optionText.text += texto[charIndex];
                    charIndex++;
                } else {
                    this.typeEvent.remove();
                    this.currentOptionIndex++;
                    this.typeNextOption();
                    
                }
            },
            callbackScope: this,
            loop: true
        });
    }

    playAudio(character){
        
        let audio_file = this.getCharacterAudioFile(character);
        if(this.speech % 2 == 0 && audio_file !== null){
            let player = new Audio();
            player.src = audio_file;
            player.mozPreservesPitch = false;
            player.playbackRate = Math.random() * (2 - 1.5) + 1.5;
            player.play();
        }
        
    }

    getCharacterAudioFile(character){
        if (character.match(/[a-z]/i)) {
            this.speech++;
            return "./dialogue/" + character + ".wav";
        } else if (character == " ") {
            return null;
        } else {
            this.speech = 0;
            return "./dialogue/bebebese.wav";
        }
    }
}