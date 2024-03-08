import React, { useEffect, useRef } from 'react';

// Easing function for a punchy ease-in-out effect
const easeInOutCubic = (t) => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

const Sketch = () => {
  const sketchRef = useRef();

  useEffect(() => {
    let myp5;

    import('p5').then((p5) => {
      const Sketch = (p) => {
        let squares = [];
        let gridSize = 50; // Size of the grid step

        p.setup = () => {
          p.createCanvas(p.windowWidth, p.windowHeight);
          p.noStroke();
          // Create some squares representing UI elements
          for (let i = 0; i < 10; i++) {
            squares.push(new Square(p, p.random(p.width), p.random(p.height), gridSize));
          }
        };

        p.draw = () => {
          p.clear(); // Clear the background to make it transparent
          squares.forEach((square) => {
            square.update();
            square.display();
          });
        };

        class Square {
          constructor(p, x, y, size) {
            this.p = p;
            this.x = x;
            this.y = y;
            this.size = size;
            this.targetX = x;
            this.targetY = y;
            this.moving = false;
            this.moveDuration = 2000; // Duration of the move in milliseconds
            this.moveStartTime = p.millis();
            this.cursor = new Cursor(p, x, y, size);
          }

          update() {
            // Update the cursor's position within the square
            this.cursor.update();
            
            // Update square's position
            if (this.moving && p.millis() - this.moveStartTime < this.moveDuration) {
              let moveEase = easeInOutCubic((p.millis() - this.moveStartTime) / this.moveDuration);
              this.x = p.lerp(this.x, this.targetX, moveEase);
              this.y = p.lerp(this.y, this.targetY, moveEase);
            } else {
              this.initiateMove();
            }
          }

          initiateMove() {
            let direction = p.floor(p.random(4));
            let moveX = 0;
            let moveY = 0;
            switch (direction) {
              case 0: moveY = -this.size; break; // up
              case 1: moveX = this.size; break;  // right
              case 2: moveY = this.size; break;  // down
              case 3: moveX = -this.size; break; // left
            }
            
            this.targetX = p.constrain(this.x + moveX, 0, p.width - this.size);
            this.targetY = p.constrain(this.y + moveY, 0, p.height - this.size);
            this.moveStartTime = p.millis();
            this.moving = true;
          }

          display() {
            p.fill(255, 30); // Semi-transparent white
            p.square(this.x, this.y, this.size, 5); // Rounded corners
            // Display the cursor
            this.cursor.display(this.x, this.y);
          }
        }

        class Cursor {
          constructor(p, x, y, squareSize) {
            this.p = p;
            this.x = x;
            this.y = y;
            this.squareSize = squareSize;
            this.targetX = this.x;
            this.targetY = this.y;
            this.padding = 10;
            this.moveDuration = 1000; // Duration of the move in milliseconds
            this.moveStartTime = -1;
            this.moving = false;
          }

          update() {
            // If the cursor is not moving, initiate a new move
            if (!this.moving || this.p.millis() - this.moveStartTime > this.moveDuration) {
              this.targetX = this.p.random(this.padding, this.squareSize - this.padding);
              this.targetY = this.p.random(this.padding, this.squareSize - this.padding);
              this.moveStartTime = this.p.millis();
              this.moving = true;
            } else {
              // Animate the movement with easing
              let t = (this.p.millis() - this.moveStartTime) / this.moveDuration;
              if (t < 1) {
                let ease = easeInOutCubic(t);
                this.x = this.p.lerp(this.x, this.targetX, ease);
                this.y = this.p.lerp(this.y, this.targetY, ease);
              } else {
                this.moving = false;
              }
            }
          }

          display(squareX, squareY) {
            // Draw the cursor as a right-angled triangle
            this.p.fill(0, 100); // Semi-transparent black
            this.p.triangle(
              squareX + this.padding, squareY + this.padding, // right angle vertex
              squareX + this.padding, squareY, // top vertex
              squareX, squareY + this.padding  // left vertex
            );
          }
        }
      };

      myp5 = new p5.default(Sketch, sketchRef.current);
    });

    return () => {
      myp5?.remove();
    };
  }, []);

  return <div ref={sketchRef}></div>;
};

export default Sketch;

