// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock canvas API
const mockContext = {
  // Basic drawing methods
  fillRect: jest.fn(),
  clearRect: jest.fn(),
  fillText: jest.fn(),
  strokeText: jest.fn(),
  measureText: jest.fn(() => ({ width: 10 })),
  drawImage: jest.fn(),
  
  // Path methods
  beginPath: jest.fn(),
  closePath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  bezierCurveTo: jest.fn(),
  quadraticCurveTo: jest.fn(),
  arc: jest.fn(),
  arcTo: jest.fn(),
  ellipse: jest.fn(),
  rect: jest.fn(),
  
  // Path rendering
  fill: jest.fn(),
  stroke: jest.fn(),
  clip: jest.fn(),
  
  // State methods
  save: jest.fn(),
  restore: jest.fn(),
  
  // Transformations
  rotate: jest.fn(),
  scale: jest.fn(),
  translate: jest.fn(),
  transform: jest.fn(),
  setTransform: jest.fn(),
  resetTransform: jest.fn(),
  
  // Styles and colors
  fillStyle: '',
  strokeStyle: '',
  font: '',
  textAlign: 'start',
  textBaseline: 'alphabetic',
  direction: 'inherit',
  lineWidth: 1,
  lineCap: 'butt',
  lineJoin: 'miter',
  miterLimit: 10,
  
  // Canvas properties
  canvas: document.createElement('canvas'),
  getContextAttributes: jest.fn(() => ({
    alpha: true,
    desynchronized: false,
    colorSpace: 'srgb',
    willReadFrequently: false
  })),
  globalAlpha: 1,
  globalCompositeOperation: 'source-over',
  
  // Image data
  createImageData: jest.fn(() => ({ width: 1, height: 1, data: new Uint8ClampedArray(4) })),
  getImageData: jest.fn(() => ({ width: 1, height: 1, data: new Uint8ClampedArray(4) })),
  putImageData: jest.fn(),
  
  // Gradients and patterns
  createLinearGradient: jest.fn(() => ({
    addColorStop: jest.fn()
  })),
  createRadialGradient: jest.fn(() => ({
    addColorStop: jest.fn()
  })),
  createPattern: jest.fn(() => null),
  
  // Shadows
  shadowBlur: 0,
  shadowColor: 'rgba(0, 0, 0, 0)',
  shadowOffsetX: 0,
  shadowOffsetY: 0,
  
  // Pixel manipulation
  isPointInPath: jest.fn(() => false),
  isPointInStroke: jest.fn(() => false)
} as unknown as CanvasRenderingContext2D;

// Override the getContext method
HTMLCanvasElement.prototype.getContext = jest.fn((contextId: string) => {
  if (contextId === '2d') {
    return mockContext;
  }
  return null;
}) as unknown as HTMLCanvasElement['getContext']; 