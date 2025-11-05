// Rendering functions for Jelly Volleyball

import type { Player, Ball, Court, GameState } from './types';

// Clear canvas
export function clearCanvas(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  ctx.clearRect(0, 0, width, height);
}

// Draw background (court)
export function drawCourt(ctx: CanvasRenderingContext2D, court: Court): void {
  // Sky background
  const gradient = ctx.createLinearGradient(0, 0, 0, court.height);
  gradient.addColorStop(0, '#87CEEB');
  gradient.addColorStop(1, '#E0F6FF');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, court.width, court.height);

  // Ground
  ctx.fillStyle = '#8B7355';
  ctx.fillRect(0, court.height - 20, court.width, 20);

  // Court markings
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 2;
  ctx.setLineDash([10, 5]);
  ctx.beginPath();
  ctx.moveTo(court.width / 2, court.height - 20);
  ctx.lineTo(court.width / 2, court.height);
  ctx.stroke();
  ctx.setLineDash([]);

  // Net
  drawNet(ctx, court);
}

// Draw net
function drawNet(ctx: CanvasRenderingContext2D, court: Court): void {
  const netX = court.width / 2;
  const netWidth = court.netWidth || 5;
  const netTop = court.height - court.netHeight;

  // Net post
  ctx.fillStyle = '#654321';
  ctx.fillRect(netX - netWidth / 2, netTop, netWidth, court.netHeight);

  // Net mesh
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.5;

  // Vertical lines
  for (let i = 0; i < 3; i++) {
    const x = netX - netWidth / 2 + (i * netWidth) / 2;
    ctx.beginPath();
    ctx.moveTo(x, netTop);
    ctx.lineTo(x, court.height);
    ctx.stroke();
  }

  // Horizontal lines
  const meshSpacing = 15;
  for (let y = netTop; y < court.height; y += meshSpacing) {
    ctx.beginPath();
    ctx.moveTo(netX - netWidth / 2 - 10, y);
    ctx.lineTo(netX + netWidth / 2 + 10, y);
    ctx.stroke();
  }

  ctx.globalAlpha = 1.0;

  // Net top
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(netX - netWidth / 2 - 5, netTop - 3, netWidth + 10, 6);
}

// Draw player with jelly wobble effect
export function drawPlayer(ctx: CanvasRenderingContext2D, player: Player): void {
  const { position, radius, wobbleOffset, color } = player;

  ctx.save();
  ctx.translate(position.x, position.y);

  // Draw jelly body (ellipse with wobble)
  ctx.beginPath();

  const numPoints = 20;
  for (let i = 0; i <= numPoints; i++) {
    const angle = (i / numPoints) * Math.PI * 2;
    const wobbleAmount = Math.sin(angle * 3) * 2;

    const r =
      radius + wobbleAmount + wobbleOffset.x * Math.cos(angle) + wobbleOffset.y * Math.sin(angle);

    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.closePath();

  // Fill with gradient
  const gradient = ctx.createRadialGradient(0, -radius / 3, 0, 0, 0, radius);
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, shadeColor(color, -30));

  ctx.fillStyle = gradient;
  ctx.fill();

  // Outline
  ctx.strokeStyle = shadeColor(color, -50);
  ctx.lineWidth = 3;
  ctx.stroke();

  // Eye highlights (make it look cute)
  const eyeY = -radius / 3;
  const eyeSpacing = radius / 3;

  // Left eye
  drawEye(ctx, -eyeSpacing, eyeY, radius / 8);
  // Right eye
  drawEye(ctx, eyeSpacing, eyeY, radius / 8);

  // Mouth
  ctx.strokeStyle = shadeColor(color, -80);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, radius / 4, radius / 3, 0.2, Math.PI - 0.2);
  ctx.stroke();

  ctx.restore();
}

// Draw eye
function drawEye(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
  // White part
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fill();

  // Black pupil
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(x, y, size / 2, 0, Math.PI * 2);
  ctx.fill();

  // Highlight
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(x - size / 4, y - size / 4, size / 4, 0, Math.PI * 2);
  ctx.fill();
}

// Draw ball
export function drawBall(ctx: CanvasRenderingContext2D, ball: Ball): void {
  const { position, radius } = ball;

  ctx.save();

  // Ball body
  const gradient = ctx.createRadialGradient(
    position.x - radius / 3,
    position.y - radius / 3,
    0,
    position.x,
    position.y,
    radius
  );
  gradient.addColorStop(0, '#FFFFFF');
  gradient.addColorStop(0.4, '#FFEB3B');
  gradient.addColorStop(1, '#FFC107');

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(position.x, position.y, radius, 0, Math.PI * 2);
  ctx.fill();

  // Ball outline
  ctx.strokeStyle = '#FF9800';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Ball pattern (lines)
  ctx.strokeStyle = '#FF9800';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(position.x, position.y, radius * 0.7, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

// Draw score
export function drawScore(
  ctx: CanvasRenderingContext2D,
  gameState: GameState,
  courtWidth: number
): void {
  ctx.font = 'bold 48px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  // Player 1 score (left)
  ctx.fillStyle = gameState.player1.color;
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 4;
  ctx.strokeText(gameState.score.player1.toString(), courtWidth / 4, 20);
  ctx.fillText(gameState.score.player1.toString(), courtWidth / 4, 20);

  // Player 2 score (right)
  ctx.fillStyle = gameState.player2.color;
  ctx.strokeText(gameState.score.player2.toString(), (courtWidth * 3) / 4, 20);
  ctx.fillText(gameState.score.player2.toString(), (courtWidth * 3) / 4, 20);

  // Divider
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText('-', courtWidth / 2, 20);
}

// Draw game over screen
export function drawGameOver(
  ctx: CanvasRenderingContext2D,
  winner: number,
  color: string,
  court: Court
): void {
  // Semi-transparent overlay
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(0, 0, court.width, court.height);

  // Winner text
  ctx.font = 'bold 64px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 6;
  const text = `Player ${winner} Wins!`;
  ctx.strokeText(text, court.width / 2, court.height / 2 - 40);

  ctx.fillStyle = color;
  ctx.fillText(text, court.width / 2, court.height / 2 - 40);

  // Instructions
  ctx.font = '24px Arial';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText('Press any key to play again', court.width / 2, court.height / 2 + 40);
}

// Utility function to shade a color
function shadeColor(color: string, percent: number): string {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, Math.min(255, (num >> 16) + amt));
  const G = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amt));
  const B = Math.max(0, Math.min(255, (num & 0x0000ff) + amt));
  const hex = ((R << 16) | (G << 8) | B).toString(16);
  return '#' + ('000000' + hex).slice(-6);
}
