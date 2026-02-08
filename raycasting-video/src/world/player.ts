import { drawRay } from "./ray"

let mouseX = 0
let mouseY = 0

document.addEventListener("mousemove", (e) => {
    const game = document.getElementById("game") as HTMLCanvasElement
    if (!game) return
    const rect = game.getBoundingClientRect()
    mouseX = e.clientX - rect.left
    mouseY = e.clientY - rect.top
})


export class Player {
    x: number
    y: number
    fov: number
    constructor(x: number, y: number, fov: number) {
        this.x = x
        this.y = y
        this.fov = fov
    }

    mouse_angle() {
        return Math.atan2(mouseY - (this.y + 20), mouseX - (this.x + 20))
    }


    static FOV = Math.PI / 6
    static NUM_RAYS = 240

    drawFOV(ctx: CanvasRenderingContext2D) {
        const mouse_angle = this.mouse_angle()

        const start_angle = mouse_angle - Player.FOV
        const step = (Player.FOV * 2) / Player.NUM_RAYS

        for (let i = 0; i < Player.NUM_RAYS; i++) {
            const ray_angle = start_angle + i * step
            drawRay(ctx, this.x + 20, this.y + 20, ray_angle, i, mouse_angle)
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "green"
        ctx.fillRect(this.x, this.y, 40, 40)

        // draw FOV
        this.drawFOV(ctx)
    }
}