import { LevelOpt, Rect, Vec2 } from "kaplay";
import { GAME_WIDTH, GAME_HEIGHT, GRAVITY, JUMP_FORCE, MOVE_SPEED } from "./constants";
import maps from "./maps";
import { k } from "./kaplayCtx";

const root = k.loadRoot('sprites/')
const blockSprite = k.loadSprite('block', 'block.png')
const playerSprite = k.loadSprite('player', 'player.png')
const portalSprite = k.loadSprite('portal', 'portal.png')

const game = k.scene('game', ({ lvl } = { lvl: 0 }) => {

    k.setGravity(GRAVITY)

    const player = k.add([
        k.sprite('player'),
        k.pos(40, 40),
        k.area(),
        k.scale(0.8),
        k.body(),
    ])

    k.onKeyPress('space', () => {
        if (player.isGrounded()) player.jump(JUMP_FORCE)
    })

    k.onKeyPress('up', () => {
        if (player.isGrounded()) player.jump(JUMP_FORCE)
    })

    k.onKeyDown('right', () => {
        player.move(MOVE_SPEED, 0)
    })

    k.onKeyDown('left', () => {
        player.move(-MOVE_SPEED, 0)
    })

    const lvlCfg: LevelOpt = {
        tileWidth: 32,
        tileHeight: 32,
        tiles: {
            'o': () => [k.sprite('block'), k.scale(1), k.area(), k.body({isStatic: true}), 'block'],
            'p': () => [k.sprite('portal'), k.scale(1), k.area({ scale: 0.6 }), k.body({isStatic: true}), 'portal'],
            'h': () => [k.sprite('block'), k.area(), k.opacity(0), k.body({isStatic: true}), 'hidden-block'],
            'f': () => [k.sprite('block'), k.area(), k.opacity(1), 'fake-block'],
        }
    }

    player.onCollide('portal', () => {
        if (lvl + 1 < maps.length) {
            k.go('game', { lvl: lvl + 1 })
        } else {
            k.go('win')
        }
    });

    player.onCollide('hidden-block', (hiddenBlock) => {
        hiddenBlock.opacity = 1
    })

    player.onCollide('fake-block', (fakeBlock) => {
        fakeBlock.opacity = 0.3
    })

    // player.action(() => {
    //     function getCamPos(playerPos, currentCamPos) {
    //         const newCamPos = { x: currentCamPos.x, y: currentCamPos.y }
    //         if ((playerPos.y / 2) > currentCamPos.y) {
    //             newCamPos.y = (playerPos.y / 2) + 128
    //         }
    //         if (playerPos.y < currentCamPos.y - (GAME_HEIGHT / 2)) {
    //             newCamPos.y = playerPos.y + (GAME_HEIGHT / 2) - 128

    //             if (newCamPos.y < GAME_HEIGHT / 2) newCamPos.y = GAME_HEIGHT / 2
    //         }
    //         return newCamPos
    //     }
    //     k.camPos({
    //         ...player.pos,
    //         ...getCamPos(player.pos, k.camPos())
    //     })
    // })

    const gameLevel = k.addLevel(maps[lvl], lvlCfg)
})

const welcomeScene = k.scene('welcome', () => {
    const startGameButton = k.add([
        k.text('Start Game'),
        k.scale(0.5),
        k.area({cursor: 'pointer', scale: 1}),
        k.pos(GAME_WIDTH / 2, GAME_HEIGHT / 2),
    ])

    startGameButton.onClick(() => k.go('game'))
})

const winScene = k.scene('win', () => {
    const winSign = k.add([
        k.text('Welcome to Mulnia'),
        k.scale(0.5),
        k.pos(GAME_WIDTH / 2, GAME_HEIGHT / 2),
    ])
})

k.go('welcome')
