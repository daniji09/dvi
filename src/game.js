import PARAMETERS from "./parameters.js";
import Boot from './boot.js';
import Dialogue from './dialogue.js';
import End from './end.js';
import D1_Test from './dungeons/d1/d1_test.js';
import D1_1 from './dungeons/d1/d1_1.js';
import D1_2 from './dungeons/d1/d1_2.js';
import D1_3 from './dungeons/d1/d1_3.js';
import D1_4 from './dungeons/d1/d1_4.js';
import D1_5 from './dungeons/d1/d1_5.js';
import D1_6 from './dungeons/d1/d1_6.js';
import D1_7 from './dungeons/d1/d1_7.js';
import D1_8 from './dungeons/d1/d1_8.js';
import D1_9 from './dungeons/d1/d1_9.js';
import D1_10 from './dungeons/d1/d1_10.js';
import D1_11 from './dungeons/d1/d1_11.js';
import D1_MID from './dungeons/d1/d1_mid.js';
import D1_BOOTS from './dungeons/d1/d1_boots.js';
import D1_PIT from './dungeons/d1/d1_pit.js';
import D1_BOSS from './dungeons/d1/d1_boss.js';
import D2_1 from './dungeons/d2/d2_1.js';
import D2_2 from './dungeons/d2/d2_2.js';
import D2_3 from './dungeons/d2/d2_3.js';
import D2_4 from './dungeons/d2/d2_4.js';
import D2_5 from './dungeons/d2/d2_5.js';
import D2_6 from './dungeons/d2/d2_6.js';
import D2_7 from './dungeons/d2/d2_7.js';
import D2_8 from './dungeons/d2/d2_8.js';
import D2_9 from './dungeons/d2/d2_9.js';
import D2_10 from './dungeons/d2/d2_10.js';
import D2_BOSS from './dungeons/d2/d2_boss.js';
import DF_1 from './dungeons/df/df_1.js';
import MENU from './menu.js';
import Phaser from 'phaser';

/**
 * Inicio del juego en Phaser. Creamos el archivo de configuración del juego y creamos
 * la clase Game de Phaser, encargada de crear e iniciar el juego.
 */
let config = {
    type: Phaser.AUTO,
    width: PARAMETERS.GAME.WIDTH,
    height: PARAMETERS.GAME.HEIGHT,
    parent: 'juego',
    scale: {
        //mode: Phaser.Scale.FIT,  
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY
    },
    pixelArt: true,
    scene: [Boot, D1_Test, Dialogue, MENU, D1_1, D1_2, D1_MID, D1_3, D1_4, D1_PIT,
            D1_5, D1_6, D1_7, D1_8, D1_9, D1_10, D1_11, D1_BOOTS, D1_BOSS,
            D2_1, D2_2, D2_3, D2_4, D2_5, D2_6, D2_7, D2_8, D2_9, D2_10, D2_BOSS, 
            DF_1, End],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: PARAMETERS.GAME.DEBUG
        }
    }
};

new Phaser.Game(config);
