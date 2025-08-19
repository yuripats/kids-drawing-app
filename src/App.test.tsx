import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import HomePage from './components/HomePage'
import DrawingPage from './components/DrawingPage'
import { BrowserRouter } from 'react-router-dom'

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('HomePage', () => {
  it('renders home page content', () => {
    renderWithRouter(<HomePage />)
    expect(screen.getByText('🎨 Kids Drawing App')).toBeInTheDocument()
    expect(screen.getByText('Welcome to Your Creative Space!')).toBeInTheDocument()
  })

  it('renders feature cards', () => {
    renderWithRouter(<HomePage />)
    expect(screen.getByText('Touch & Draw')).toBeInTheDocument()
    expect(screen.getByText('Bright Colors')).toBeInTheDocument()
    expect(screen.getByText('Save Your Art')).toBeInTheDocument()
  })

  it('renders start drawing button', () => {
    renderWithRouter(<HomePage />)
    expect(screen.getByText('🖌️ Start Drawing!')).toBeInTheDocument()
  })
})

describe('DrawingPage', () => {
  it('renders drawing page content', () => {
    renderWithRouter(<DrawingPage />)
    expect(screen.getByText('🎨 Draw Something Amazing!')).toBeInTheDocument()
  })
})