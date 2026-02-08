import { Player } from "./player"
import { zBuffer } from "../main"

export class Enemy {
    x: number
    y: number
    img: HTMLImageElement
    isLoaded: boolean = false

    constructor(x: number, y: number, texture_path: string) {
        this.x = x
        this.y = y
        this.img = new Image()
        this.img.src = `/${texture_path}.png`
        this.img.onload = () => {
            this.isLoaded = true
        }
    }

    draw(ctx: CanvasRenderingContext2D, player: Player) {
        if (!this.isLoaded) return

        // 1. Calculate relative position
        const dx = this.x - (player.x + 20)
        const dy = this.y - (player.y + 20)

        // 2. Distance to enemy (perpendicular to fix fish-eye and occlusion)
        const playerAngle = player.mouse_angle()
        const angleToSprite = Math.atan2(dy, dx)
        const distance = Math.sqrt(dx * dx + dy * dy)
        let spriteRelativeAngle = angleToSprite - playerAngle

        // Normalize angle to -PI to PI
        while (spriteRelativeAngle < -Math.PI) spriteRelativeAngle += Math.PI * 2
        while (spriteRelativeAngle > Math.PI) spriteRelativeAngle -= Math.PI * 2

        const distCorrected = distance * Math.cos(spriteRelativeAngle)

        // 4. Render sprite if in FOV
        const fov = Player.FOV
        if (Math.abs(spriteRelativeAngle) < fov + 0.5) {
            const screenHeight = 800
            const screenWidth = 800
            const offsetW = 800

            // Projection Scaling - Integer-aligned
            const spriteSize = Math.round(Math.abs(screenHeight / distCorrected) * 80)

            // X position on the 3D screen
            const xOffset = (spriteRelativeAngle / (fov * 2)) * screenWidth
            const screenX = offsetW + (screenWidth / 2) + xOffset - (spriteSize / 2)

            // Y position (centered) - Integer-aligned
            const screenY = Math.round((screenHeight / 2) - (spriteSize / 2))

            // Draw vertical slices to handle Z-buffer occlusion
            // Use Math.ceil to ensure we don't skip the last slice due to rounding
            for (let i = 0; i < spriteSize; i++) {
                const stripeX = Math.round(screenX + i)
                const bufferIndex = Math.floor(((stripeX - offsetW) / screenWidth) * Player.NUM_RAYS)

                // Only draw if within 3D screen and in front of the wall at this slice
                if (stripeX >= offsetW && stripeX < offsetW + screenWidth) {
                    // Corrected distance check: compare perpendicular dist * tileSize
                    if (distCorrected * 80 < zBuffer[bufferIndex] + 0.1) {
                        const texX = Math.floor((i / spriteSize) * this.img.width)
                        ctx.drawImage(
                            this.img,
                            texX, 0,                               // Source X (integer), Y
                            1, this.img.height,                    // Source Width 1, Height
                            stripeX, screenY,                      // Destination X, Y
                            1, spriteSize                          // Destination Width, Height
                        )
                    }
                }
            }
        }
    }
}
