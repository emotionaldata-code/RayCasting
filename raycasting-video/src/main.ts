import { Grid2D, WIDHT, HEIGHT } from "./world/2dGrid";
import { Player } from "./world/player";
import { Enemy } from "./world/enemy";

const game = document.getElementById("game") as HTMLCanvasElement
const ctx = game.getContext("2d") as CanvasRenderingContext2D
ctx.imageSmoothingEnabled = false

game.style.backgroundColor = "black";
game.width = WIDHT
game.height = HEIGHT

export const zBuffer = new Array(Player.NUM_RAYS).fill(0)

const grid = new Grid2D()
grid.draw(ctx)

const player = new Player(WIDHT / 4, HEIGHT / 2, 2 * Math.PI / 3)
player.draw(ctx)

const enemy = new Enemy(300, 300, "enemy")

const keys: { [key: string]: boolean } = {}

document.addEventListener("keydown", (e) => {
    keys[e.key] = true
})

document.addEventListener("keyup", (e) => {
    keys[e.key] = false
})

function handleInput() {
    const speed = 5
    if (keys["w"]) player.y -= speed
    if (keys["s"]) player.y += speed
    if (keys["a"]) player.x -= speed
    if (keys["d"]) player.x += speed
}

function animate() {
    ctx.clearRect(0, 0, WIDHT, HEIGHT)
    handleInput()
    grid.draw(ctx)
    player.draw(ctx)
    enemy.draw(ctx, player)
    requestAnimationFrame(animate)
}
animate()