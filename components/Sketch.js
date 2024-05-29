import React, { useEffect, useRef } from 'react'

const Sketch = () => {
    const sketchRef = useRef()

    useEffect(() => {
        let myp5

        import('p5').then((p5) => {
            const Sketch = (p) => {
                let squares = []
                let gridSize = 50 // Grid size for square movement

                p.setup = () => {
                    p.createCanvas(p.windowWidth, p.windowHeight)
                    p.noStroke()
                    // Align squares to a grid and create them
                    for (let i = 0; i < 10; i++) {
                        let x =
                            Math.floor(p.random(p.width / gridSize)) * gridSize
                        let y =
                            Math.floor(p.random(p.height / gridSize)) * gridSize
                        squares.push(new Square(p, x, y, gridSize))
                    }
                }

                p.draw = () => {
                    p.clear()
                    squares.forEach((square) => {
                        square.update()
                        square.display()
                    })
                }

                class Square {
                    constructor(p, x, y, size) {
                        this.p = p
                        this.x = x
                        this.y = y
                        this.size = size
                        this.cursor = new Cursor(p, this)
                        this.initiateMove()
                    }

                    initiateMove() {
                        // Decide the next movement direction randomly
                        this.targetX =
                            this.x +
                            (Math.random() > 0.5 ? this.size : -this.size) *
                                (Math.random() > 0.5 ? 1 : 0)
                        this.targetY =
                            this.y +
                            (Math.random() > 0.5 ? this.size : -this.size) *
                                (Math.random() <= 0.5 ? 1 : 0)
                        // Ensure the target position is within canvas bounds
                        this.targetX = Math.max(
                            0,
                            Math.min(this.p.width - this.size, this.targetX)
                        )
                        this.targetY = Math.max(
                            0,
                            Math.min(this.p.height - this.size, this.targetY)
                        )
                        this.moveStartTime = this.p.millis()
                    }

                    update() {
                        let elapsedTime =
                            (this.p.millis() - this.moveStartTime) / 1000 // Time for square movement
                        if (elapsedTime < 1) {
                            let easedT = easeInOutCubic(elapsedTime)
                            this.x = this.p.lerp(this.x, this.targetX, easedT)
                            this.y = this.p.lerp(this.y, this.targetY, easedT)
                        } else {
                            this.initiateMove() // Initiate a new move after completing the previous one
                        }
                        // Update cursor position independently of square's move completion
                        this.cursor.update()
                    }

                    display() {
                        this.p.fill(255, 30) // Semi-transparent white for square
                        this.p.square(this.x, this.y, this.size) // Display square
                        this.cursor.display() // Display cursor
                    }
                }

                // In the Cursor class, update the constructor and update method like this:
                class Cursor {
                    constructor(p, parentSquare) {
                        this.p = p
                        this.parentSquare = parentSquare
                        this.moveDuration = 1000 // Duration of cursor's movement, adjust as needed
                        this.lastMoveTime = -this.moveDuration // Initialize to trigger immediate first move
                        this.calculateTarget() // Initial target calculation
                    }

                    calculateTarget() {
                        // Define the target within the parent square boundaries
                        this.targetX = this.p.random(
                            this.parentSquare.x + 10,
                            this.parentSquare.x + this.parentSquare.size - 20
                        )
                        this.targetY = this.p.random(
                            this.parentSquare.y + 10,
                            this.parentSquare.y + this.parentSquare.size - 20
                        )
                        this.currentX = this.targetX // Update current to target for immediate effect
                        this.currentY = this.targetY
                    }

                    update() {
                        let timeSinceLastMove =
                            this.p.millis() - this.lastMoveTime
                        if (timeSinceLastMove >= this.moveDuration) {
                            this.lastMoveTime = this.p.millis() // Reset the move timer
                            this.calculateTarget() // Calculate new target position
                        }

                        // Adjust cursor position even when the square is not moving
                        let t = Math.min(
                            1,
                            timeSinceLastMove / this.moveDuration
                        ) // Ensure t is between 0 and 1
                        let easedT = easeInOutCubic(t)
                        this.currentX = this.p.lerp(
                            this.parentSquare.x + this.parentSquare.size / 2,
                            this.targetX,
                            easedT
                        )
                        this.currentY = this.p.lerp(
                            this.parentSquare.y + this.parentSquare.size / 2,
                            this.targetY,
                            easedT
                        )
                    }

                    display() {
                        // Use currentX and currentY for positioning instead of targetX and targetY
                        let safeX = this.p.constrain(
                            this.currentX,
                            this.parentSquare.x + 10,
                            this.parentSquare.x + this.parentSquare.size - 20
                        )
                        let safeY = this.p.constrain(
                            this.currentY,
                            this.parentSquare.y + 10,
                            this.parentSquare.y + this.parentSquare.size - 20
                        )

                        this.p.fill(0) // Solid black for cursor
                        this.p.triangle(
                            safeX,
                            safeY,
                            safeX + 10,
                            safeY,
                            safeX,
                            safeY + 10
                        )
                    }
                }

                function easeInOutCubic(t) {
                    return t < 0.5
                        ? 4 * t * t * t
                        : 1 - Math.pow(-2 * t + 2, 3) / 2
                }
            }

            myp5 = new p5.default(Sketch, sketchRef.current)
        })

        return () => {
            if (myp5) myp5.remove()
        }
    }, [])

    return <div ref={sketchRef}></div>
}

export default Sketch
