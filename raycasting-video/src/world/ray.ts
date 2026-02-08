import { map } from "./map"
import { RenderRay3D } from "./3dRender"
import { zBuffer } from "../main"

export function drawRay(ctx: CanvasRenderingContext2D, start_x: number, start_y: number,
    angle: number, counter: number, playerAngle: number) {
    const tileSize = 80
    const mapWidth = map[0].length
    const mapHeight = map.length

    let rayDirX = Math.cos(angle)
    let rayDirY = Math.sin(angle)

    // Current grid position
    let mapX = Math.floor(start_x / tileSize)
    let mapY = Math.floor(start_y / tileSize)

    // Distance the ray has to travel from one x or y-side to next x or y-side
    let deltaDistX = Math.abs(1 / rayDirX)
    let deltaDistY = Math.abs(1 / rayDirY)

    let stepX: number
    let stepY: number
    let sideDistX: number
    let sideDistY: number
    let hit = 0

    // Calculate step and initial sideDist
    if (rayDirX < 0) {
        stepX = -1
        sideDistX = (start_x / tileSize - mapX) * deltaDistX
    } else {
        stepX = 1
        sideDistX = (mapX + 1.0 - start_x / tileSize) * deltaDistX
    }

    if (rayDirY < 0) {
        stepY = -1
        sideDistY = (start_y / tileSize - mapY) * deltaDistY
    } else {
        stepY = 1
        sideDistY = (mapY + 1.0 - start_y / tileSize) * deltaDistY
    }

    let side = 0 // 0 for X-side, 1 for Y-side
    let maxDistance = 20 // Maximum grid cells to check to prevent infinite loops

    // DDA loop
    for (let i = 0; i < maxDistance; i++) {
        // Jump to next grid square
        if (sideDistX < sideDistY) {
            sideDistX += deltaDistX
            mapX += stepX
            side = 0
        } else {
            sideDistY += deltaDistY
            mapY += stepY
            side = 1
        }

        // Check if out of bounds
        if (mapX < 0 || mapX >= mapWidth || mapY < 0 || mapY >= mapHeight) break

        // Check if ray hit a wall
        if (map[mapY][mapX] > 0) {
            hit = 1
            break
        }
    }

    // Calculate distance projected on camera direction
    let dist: number
    if (side === 0) {
        dist = (sideDistX - deltaDistX)
    } else {
        dist = (sideDistY - deltaDistY)
    }

    // Corrected distance for 3D rendering (fish-eye correction)
    const correctedDist = dist * Math.cos(angle - playerAngle)

    // Store distance in Z-buffer for sprite occlusion
    zBuffer[counter] = correctedDist * tileSize

    ctx.beginPath()
    ctx.strokeStyle = "red"
    ctx.moveTo(start_x, start_y)
    ctx.lineTo(start_x + rayDirX * dist * tileSize, start_y + rayDirY * dist * tileSize)
    ctx.stroke()

    RenderRay3D(ctx, correctedDist * tileSize, counter, side)
}
