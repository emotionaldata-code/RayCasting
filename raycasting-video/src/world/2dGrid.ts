import { map } from "./map"

export const WIDHT = 1600
export const HEIGHT = 800
const nTilesH = 10
const nTilesW = 10

export class Grid2D {
    size: number
    map: number[][]
    constructor(size: number = HEIGHT) {
        this.size = size
        this.map = map
    }

    drawWindow(ctx: CanvasRenderingContext2D) {
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(WIDHT, 0)
        ctx.lineTo(WIDHT, HEIGHT)
        ctx.lineTo(0, HEIGHT)
        ctx.lineTo(0, 0)
        ctx.stroke()
    }

    drawGrid(ctx: CanvasRenderingContext2D) {
        const step = this.size / nTilesH
        for (let i = 0; i < nTilesH + 1; i++) {
            ctx.beginPath()
            ctx.moveTo(0, i * step)
            ctx.lineTo(this.size, i * step)
            ctx.stroke()
        }
        for (let i = 0; i < nTilesW + 1; i++) {
            ctx.beginPath()
            ctx.moveTo(i * step, 0)
            ctx.lineTo(i * step, this.size)
            ctx.stroke()
        }
    }

    drawMap(ctx: CanvasRenderingContext2D) {
        const step = this.size / nTilesH
        for (let i = 0; i < nTilesH; i++) {
            for (let j = 0; j < nTilesW; j++) {
                if (this.map[i][j] === 1) {
                    ctx.fillStyle = "gray"
                    ctx.fillRect(j * step, i * step, step, step)
                }
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = "white"
        // draw window
        this.drawWindow(ctx)
        // draw MAP
        this.drawMap(ctx)
        // draw grid
        this.drawGrid(ctx)

    }




}