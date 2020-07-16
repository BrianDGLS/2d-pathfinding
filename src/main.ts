const $canvas = document.createElement('canvas')
document.body.appendChild($canvas)

const ctx = $canvas.getContext('2d') as CanvasRenderingContext2D

const SCREEN_WIDTH = ($canvas.width = 512)
const SCREEN_HEIGHT = ($canvas.height = 288)

const MOUSE = { x: 0, y: 0, click: { x: 0, y: 0 } }

const TILE_SIZE = 32
const MAX_COLUMNS = SCREEN_WIDTH / TILE_SIZE
const MAX_ROWS = SCREEN_HEIGHT / TILE_SIZE

const GRID: number[][] = []
for (let i = 0; i < MAX_ROWS; i++) {
  const row = []
  for (let j = 0; j < MAX_COLUMNS; j++) {
    row.push(0)
  }
  GRID.push(row)
}
enum GRID_KEY {
  BLANK,
  WALL,
  PLAYER,
}

const PLAYER_COORDINATES = [8, 8]
interface GameObject {
  x: number
  y: number
  width: number
  height: number
}
function collisionDetected(a: GameObject, b: GameObject): boolean {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y
}

function renderGrid(ctx: CanvasRenderingContext2D, grid: number[][]) {
  for (const [rowIndex, row] of grid.entries()) {
    for (const [columnIndex, column] of row.entries()) {
      ctx.save()
      ctx.translate(columnIndex * TILE_SIZE, rowIndex * TILE_SIZE)

      const tile: GameObject = {
        width: TILE_SIZE,
        height: TILE_SIZE,
        x: columnIndex * TILE_SIZE,
        y: rowIndex * TILE_SIZE,
      }
      const mouse: GameObject = { width: 1, height: 1, y: MOUSE.y, x: MOUSE.x }
      const click: GameObject = { width: 1, height: 1, y: MOUSE.click.y, x: MOUSE.click.x }
      if (collisionDetected(tile, mouse)) {
        ctx.strokeRect(0, 0, TILE_SIZE, TILE_SIZE)
      }

      if (collisionDetected(tile, click)) {
        ctx.fillStyle = 'rgba(255, 60, 155, .3)'
        ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE)
      }

      if (column in GRID_KEY) {
        switch (column) {
          case GRID_KEY.PLAYER:
            ctx.fillStyle = 'blue'
            ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE)
            break
          case GRID_KEY.WALL:
            ctx.fillStyle = 'black'
            ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE)
            break
          default:
            ctx.font = '12px Monospace'
            const yDiff = PLAYER_COORDINATES[1] - rowIndex
            const xDiff = PLAYER_COORDINATES[0] - columnIndex
            const distance = Math.abs(xDiff) + Math.abs(yDiff)
            ctx.fillText(`${distance}`, 0, 12)
        }
      }
      ctx.restore()
    }
  }
}

function gameLoop(ctx: CanvasRenderingContext2D) {
  requestAnimationFrame(() => gameLoop(ctx))
  ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)
  renderGrid(ctx, GRID)
}

const Main = (function () {
  $canvas.addEventListener('mousemove', (e) => {
    MOUSE.x = e.clientX
    MOUSE.y = e.clientY
  })
  $canvas.addEventListener('click', (e) => {
    MOUSE.click = { x: e.clientX, y: e.clientY }
  })
  GRID[PLAYER_COORDINATES[1]][PLAYER_COORDINATES[0]] = GRID_KEY.PLAYER
  gameLoop(ctx)
})()
