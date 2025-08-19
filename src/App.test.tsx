import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders welcome message', () => {
    render(<App />)
    expect(screen.getByText('🎨 Kids Drawing App')).toBeInTheDocument()
    expect(screen.getByText('Welcome to Your Creative Space!')).toBeInTheDocument()
  })

  it('renders feature cards', () => {
    render(<App />)
    expect(screen.getByText('Touch & Draw')).toBeInTheDocument()
    expect(screen.getByText('Bright Colors')).toBeInTheDocument()
    expect(screen.getByText('Save Your Art')).toBeInTheDocument()
  })

  it('renders coming soon features', () => {
    render(<App />)
    expect(screen.getByText('Coming Soon')).toBeInTheDocument()
    expect(screen.getByText('AI Stencils')).toBeInTheDocument()
    expect(screen.getByText('Mobile App')).toBeInTheDocument()
  })
})