const OFFSET_W = 800
const LINEWIDHT = 800 / 240
const SCREEN_HEIGHT = 800

export function RenderRay3D(ctx: CanvasRenderingContext2D, distance: number, counter: number, side: number) {
    // Shading: Y-side cuts are darker

    // Proper wall height calculation
    const lineHeight = Math.min(SCREEN_HEIGHT, (80 * SCREEN_HEIGHT) / (distance || 1))

    // Centering the wall vertically
    const drawStart = (SCREEN_HEIGHT / 2) - (lineHeight / 2)

    //draw the floor
    ctx.fillStyle = "#533303ff"
    ctx.fillRect(counter * LINEWIDHT + OFFSET_W - (LINEWIDHT / 2), drawStart + lineHeight,
        LINEWIDHT + 1, SCREEN_HEIGHT - drawStart - lineHeight)

    //draw the ceiling
    ctx.fillStyle = "#02b2b8ff"
    ctx.fillRect(counter * LINEWIDHT + OFFSET_W - (LINEWIDHT / 2), 0, LINEWIDHT + 1, drawStart)

    //draw the wall
    ctx.fillStyle = side === 1 ? "#666" : "#aaa"
    ctx.fillRect(counter * LINEWIDHT + OFFSET_W - (LINEWIDHT / 2), drawStart, LINEWIDHT + 1, lineHeight)

}