export type DrawingMode = "pen" | "highlighter" | "arrow" | "rectangle" | "circle" | "text" | "eraser"
export type DrawingColor = string
export type StrokeWidth = number

export interface DrawingSettings {
  mode: DrawingMode
  color: DrawingColor
  width: StrokeWidth
}

export interface Point {
  x: number
  y: number
}

export interface DrawingObject {
  id: string
  type: DrawingMode
  points: Point[]
  color: DrawingColor
  width: StrokeWidth
  text?: string
}

// Helper function to generate unique IDs for drawing objects
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}

// Helper function to draw an arrow
export function drawArrow(
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  color: string,
  width: number,
) {
  const headLength = 15 // length of head in pixels
  const dx = toX - fromX
  const dy = toY - fromY
  const angle = Math.atan2(dy, dx)

  // Draw the line
  ctx.beginPath()
  ctx.moveTo(fromX, fromY)
  ctx.lineTo(toX, toY)
  ctx.strokeStyle = color
  ctx.lineWidth = width
  ctx.stroke()

  // Draw the arrow head
  ctx.beginPath()
  ctx.moveTo(toX, toY)
  ctx.lineTo(toX - headLength * Math.cos(angle - Math.PI / 6), toY - headLength * Math.sin(angle - Math.PI / 6))
  ctx.lineTo(toX - headLength * Math.cos(angle + Math.PI / 6), toY - headLength * Math.sin(angle + Math.PI / 6))
  ctx.closePath()
  ctx.fillStyle = color
  ctx.fill()
}

// Helper function to draw a rectangle
export function drawRectangle(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  color: string,
  width: number,
) {
  const rectWidth = endX - startX
  const rectHeight = endY - startY

  ctx.beginPath()
  ctx.rect(startX, startY, rectWidth, rectHeight)
  ctx.strokeStyle = color
  ctx.lineWidth = width
  ctx.stroke()
}

// Helper function to draw a circle
export function drawCircle(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  color: string,
  width: number,
) {
  const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2))

  ctx.beginPath()
  ctx.arc(startX, startY, radius, 0, 2 * Math.PI)
  ctx.strokeStyle = color
  ctx.lineWidth = width
  ctx.stroke()
}
