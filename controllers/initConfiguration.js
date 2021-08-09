import Hero from './../models/Hero.js';
import Enemy from './../models/Enemy.js';
import Display from './../models/Display.js';
export function initConfiguration(titleScreen) {
    const display = new Display(document, 400, 1000);
    titleScreen(display);

    const airplane = new Hero(
        display.gameWindow.width * 0.025,
        display.gameWindow.height / 2,
        display.gameWindow.width * 0.04,
        display.gameWindow.height * 0.05,
        document.getElementById('vehicle'),
        'img',
        true,
        document
    );
    
    function EnemyBuilder(count, space, type) {
        switch (type) {
            case 0: 
            for (let i = 0; i <= count - 1; i += 1) {
                space += 50;
                const enemy1 = new Enemy(
                    display.gameWindow.width + space,
                    display.gameWindow.height,
                    display.gameWindow.width * 0.1 / 2,
                    display.gameWindow.height * 0.1,
                    document.getElementById('ufo'),
                    'img',
                    true,
                    {
                        width: 15,
                        height: 2,
                        shotSymbol: document.getElementById('shot_enemy1'),
                    },
                    1
                );
                display.addObject(enemy1);
            }
            break;
            case 1: 
            for (let i = 0; i <= count - 1; i += 1) {
                space += 50;
                const enemy2 = new Enemy(
                    display.gameWindow.width + space,
                    display.gameWindow.height,
                    display.gameWindow.width * 0.1 / 4,
                    display.gameWindow.height * 0.1 / 2,
                    document.getElementById('enemy2'),
                    'img',
                    true,
                    {
                        width: 5,
                        height: 5,
                        shotSymbol: document.getElementById('shot_enemy2'),
                    },
                    2
                );
                display.addObject(enemy2);
            };
            break;
        }
    }

    // EnemyBuilder(5, 50);
    display.addObject(airplane);

    return {
        display, 
        airplane,
        EnemyBuilder,
    }
}