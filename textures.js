"use strict";
let atlasData, spriteSheet;

async function loadTextures()
{
    atlasData = {
        frames: {
            tank_level1_1: {
                frame: {x: 0, y: 0, w: 16, h: 16},
                sourceSize: {w: 16, h: 16},
                spriteSourceSize: {x: 0, y: 0, w: 16, h: 16}
            },
            tank_level1_2: {
                frame: {x: 16, y: 0, w: 16, h: 16},
                sourceSize: {w: 16, h: 16},
                spriteSourceSize: {x: 0, y: 0, w: 16, h: 16}
            },
            tank_level2_1: {
                frame: {x: 0, y: 16, w: 16, h: 16},
                sourceSize: {w: 16, h: 16},
                spriteSourceSize: {x: 0, y: 0, w: 16, h: 16}
            },
            tank_level2_2: {
                frame: {x: 16, y: 16, w: 16, h: 16},
                sourceSize: {w: 16, h: 16},
                spriteSourceSize: {x: 0, y: 0, w: 16, h: 16}
            },
            tank_level3_1: {
                frame: {x: 0, y: 32, w: 16, h: 16},
                sourceSize: {w: 16, h: 16},
                spriteSourceSize: {x: 0, y: 0, w: 16, h: 16}
            },
            tank_level3_2: {
                frame: {x: 16, y: 32, w: 16, h: 16},
                sourceSize: {w: 16, h: 16},
                spriteSourceSize: {x: 0, y: 0, w: 16, h: 16}
            },
            tank_level4_1: {
                frame: {x: 0, y: 48, w: 16, h: 16},
                sourceSize: {w: 16, h: 16},
                spriteSourceSize: {x: 0, y: 0, w: 16, h: 16}
            },
            tank_level4_2: {
                frame: {x: 16, y: 48, w: 16, h: 16},
                sourceSize: {w: 16, h: 16},
                spriteSourceSize: {x: 0, y: 0, w: 16, h: 16}
            },
            de_1: {
                frame: {x: 259, y: 130, w: 11, h: 11},
                sourceSize: {w: 11, h: 11},
                spriteSourceSize: {x: 10, y: 10, w: 22, h: 22}
            },
            de_2: {
                frame: {x: 272, y: 129, w: 15, h: 15},
                sourceSize: {w: 15, h: 15},
                spriteSourceSize: {x: 8, y: 8, w: 30, h: 30}
            },
            de_3: {
                frame: {x: 288, y: 128, w: 16, h: 16},
                sourceSize: {w: 16, h: 16},
                spriteSourceSize: {x: 8, y: 8, w: 32, h: 32}
            },
            de_4: {
                frame: {x: 304, y: 128, w: 32, h: 32},
                sourceSize: {w: 32, h: 32},
                spriteSourceSize: {x: 8, y: 8, w: 64, h: 64}
            },
            de_5: {
                frame: {x: 336, y: 128, w: 32, h: 32},
                sourceSize: {w: 32, h: 32},
                spriteSourceSize: {x: 8, y: 8, w: 64, h: 64}
            },
            terrain0: {
                frame: {x: 256, y: 88, w: 8, h: 8},
                sourceSize: {w: 8, h: 8},
                spriteSourceSize: {x: 0, y: 0, w: 8, h: 8}
            },
            terrain1: {
                frame: {x: 256, y: 0, w: 8, h: 8},
                sourceSize: {w: 8, h: 8},
                spriteSourceSize: {x: 0, y: 0, w: 8, h: 8}
            },
            terrain2: {
                frame: {x: 256, y: 16, w: 8, h: 8},
                sourceSize: {w: 8, h: 8},
                spriteSourceSize: {x: 0, y: 0, w: 8, h: 8}
            },
            terrain3: {
                frame: {x: 272, y: 32, w: 8, h: 8},
                sourceSize: {w: 8, h: 8},
                spriteSourceSize: {x: 0, y: 0, w: 8, h: 8}
            },
            terrain4: {
                frame: {x: 256, y: 48, w: 8, h: 8},
                sourceSize: {w: 8, h: 8},
                spriteSourceSize: {x: 0, y: 0, w: 8, h: 8}
            },
            bullet: {
                frame: {x: 321, y: 101, w: 8, h: 8},
                sourceSize: {w: 8, h: 8},
                spriteSourceSize: {x: 0, y: 0, w: 8, h: 8}
            },
            consumable_star: {
                frame: {x: 304, y: 112, w: 16, h: 16},
                sourceSize: {w: 16, h: 16},
                spriteSourceSize: {x: 0, y: 0, w: 16, h: 16}
            }
        },
        meta: {
            image: 'textures.png',
            format: 'RGBA8888',
            size: {w: 400, h: 256},
            scale: 1
        },
        animations: {
            tank1: ['tank_level1_1', 'tank_level1_2'],
            tank2: ['tank_level2_1', 'tank_level2_2'],
            tank3: ['tank_level3_1', 'tank_level3_2'],
            tank4: ['tank_level4_1', 'tank_level4_2'], //array of frames by name
            bullet_death: ['de_1', 'de_2', 'de_3'], //array of frames by name
            tank_death: ['de_1', 'de_2', 'de_3', 'de_4', 'de_5'], //array of frames by name
        }
    }


        // Create the SpriteSheet from data and image
    spriteSheet = new PIXI.Spritesheet(
        PIXI.BaseTexture.from(atlasData.meta.image),
        atlasData
    );

    await spriteSheet.parse();

    console.log(spriteSheet);

}