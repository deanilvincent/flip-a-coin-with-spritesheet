import { render, screen, fireEvent, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import Home from '../page'

describe('Home Component', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  test('renders with initial state', () => {
    render(<Home />)
    // Check initial coin is visible
    expect(screen.getByAltText('Coin 1')).toBeInTheDocument()

    // Check button is enabled with correct text
    const button = screen.getByRole('button', { name: /flip a coin/i })
    expect(button).toBeInTheDocument()
    expect(button).not.toBeDisabled()
  })

  test('renders the coin flip button', () => {
    render(<Home />)
    const button = screen.getByRole('button', { name: /flip a coin/i })
    expect(button).toBeInTheDocument()
  })

  test('button should be disabled while flipping', () => {
    render(<Home />)
    const button = screen.getByRole('button', { name: /flip a coin/i })

    // Click the button to start flipping
    fireEvent.click(button)

    // Button should now be disabled and text should change
    expect(button).toBeDisabled()
    expect(button).toHaveTextContent('Flipping...')
  })

  test('coin index updates correctly when flipping starts', () => {
    render(<Home />)
    const button = screen.getByRole('button', { name: /flip a coin/i })

    // Simulate multiple flips to test both head->tail and tail->head transitions
    fireEvent.click(button)
    expect(screen.getByAltText(/Coin \d+/i)).toBeInTheDocument()

    // Fast forward
    act(() => {
      jest.runAllTimers()
    })

    // Second flip
    fireEvent.click(button)
    expect(screen.getByAltText(/Coin \d+/i)).toBeInTheDocument()
  })

  test('prevents multiple simultaneous flips', () => {
    render(<Home />)
    const button = screen.getByRole('button', { name: /flip a coin/i })

    // Start flipping
    fireEvent.click(button)

    // Try to click again while flipping
    fireEvent.click(button)

    // Should still be in flipping state with only one animation running
    expect(button).toBeDisabled()

    // Complete the animation
    act(() => {
      jest.runAllTimers()
    })

    // Now button should be enabled again
    expect(button).not.toBeDisabled()
  })

  test('animation completes and button becomes enabled again', () => {
    render(<Home />)
    const button = screen.getByRole('button', { name: /flip a coin/i })

    // Click the button to start flipping
    fireEvent.click(button)

    // Fast forward past all the timeouts
    act(() => {
      jest.runAllTimers()
    })

    // Button should be enabled again
    expect(button).not.toBeDisabled()
    expect(button).toHaveTextContent('Flip a coin')
  })

  test('correctly alternates between heads and tails', () => {
    render(<Home />)
    const button = screen.getByRole('button', { name: /flip a coin/i })

    // First flip - from heads (index 0) should go to tails (last index)
    fireEvent.click(button)

    // Run timers to complete the animation
    act(() => {
      jest.runAllTimers()
    })

    // Should now show tails (using the last image)
    expect(screen.getByAltText('Coin 11')).toBeInTheDocument()

    // Second flip - from tails back to heads
    fireEvent.click(button)

    // Run timers again
    act(() => {
      jest.runAllTimers()
    })

    // Should now show heads (first image)
    expect(screen.getByAltText('Coin 1')).toBeInTheDocument()
  })

  test('animation shows intermediate frames during flip', () => {
    render(<Home />)
    const button = screen.getByRole('button', { name: /flip a coin/i })

    // Start flipping from heads
    fireEvent.click(button)

    // Advance timer partially through animation
    act(() => {
      jest.advanceTimersByTime(100) // Advance by 100ms (2 frames at 50ms each)
    })

    // Should be showing an intermediate frame, not the first or last
    const coinImage = screen.getByAltText(/Coin \d+/i) as HTMLImageElement
    const coinNumber = parseInt(coinImage.alt.replace('Coin ', ''))
    expect(coinNumber).toBeGreaterThan(1)
    expect(coinNumber).toBeLessThan(11)
  })
})
