'use client'

import Image from 'next/image'
import { useState } from 'react'
import styles from './components/Home.module.css'

export default function Home () {
  const coinImages = Array.from(
    { length: 11 },
    (_, i) => `/images/coins/${i + 1}.png`
  )

  const [currentCoinIndex, setCurrentCoinIndex] = useState(0)
  const [isFlipping, setIsFlipping] = useState(false)

  const flipTheCoin = () => {
    if (isFlipping) return

    setIsFlipping(true)

    // if the current index is greater than 0, then it means it's the tail otherwise it's the head which is the index 0
    setCurrentCoinIndex(currentCoinIndex > 0 ? coinImages.length - 1 : 0)

    const animateFlip = () => {
      for (let i = 0; i < coinImages.length - 1; i++) {
        setTimeout(() => {
          if (currentCoinIndex === coinImages.length - 1) {
            setCurrentCoinIndex(prevIndex => prevIndex - 1)
          } else {
            setCurrentCoinIndex(prevIndex => prevIndex + 1)
          }
        }, i * 50)
      }

      setTimeout(() => {
        setIsFlipping(false)
      }, coinImages.length * 50)
    }

    animateFlip()
  }

  return (
    <div
      className={`h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 ${styles.container}`}
    >
      <div className='flex items-center justify-center h-full'>
        <div className='flex flex-col gap-7 justify-center items-center'>
          <div className='relative w-[10rem] h-[10rem]'>
            <Image
              src={coinImages[currentCoinIndex]}
              alt={`Coin ${currentCoinIndex + 1}`}
              fill
              className='object-contain'
            />
          </div>

          <button
            type='button'
            onClick={flipTheCoin}
            className={`rounded-2xl cursor-pointer disabled:opacity-50 hover:opacity-80 duration-300 active:opacity-50 text-2xl bg-pink-50 text-black px-10 py-2`}
            disabled={isFlipping}
          >
            {isFlipping ? 'Flipping...' : 'Flip a coin'}
          </button>
        </div>
      </div>

      <p className=' text-center absolute transform left-1/2 -translate-x-1/2  z-10 bottom-5'>
        Show “Heads” or “Tails” after the flip by{' '}
        <a
          href='https://github.com/deanilvincent'
          className='underline'
          target='_blank'
        >
          https://github.com/deanilvincent | Mark Deanil Vicente
        </a>
      </p>
    </div>
  )
}
