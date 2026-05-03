import { useState } from 'react'
import './PresentButton.css'

export default function PresentButton({ active, onClick }) {
  const [animating, setAnimating] = useState(false)

  const handleClick = (e) => {
  if (active || animating) return  // animating auch abfangen

  // Ripple
  const btn = e.currentTarget
  const ripple = document.createElement('div')
  ripple.className = 'pb-ripple'
  const r = 60
  const rect = btn.getBoundingClientRect()
  ripple.style.cssText = `width:${r*2}px;height:${r*2}px;left:${e.clientX - rect.left - r}px;top:${e.clientY - rect.top - r}px`
  btn.appendChild(ripple)
  requestAnimationFrame(() => ripple.classList.add('go'))
  ripple.addEventListener('animationend', () => ripple.remove())

  setAnimating(true)
  setTimeout(() => {
    //setAnimating(false)
    onClick?.()   // erst JETZT den Store updaten
  }, 500)         // etwas länger damit Animation fertig ist
}

  return (
    <button
      className={`pb-btn ${animating ? 'animating' : ''} ${active || animating ? 'done' : ''}`}
      onClick={handleClick}
    >
      <div className="pb-fill" />
      <div className="pb-content">
        <svg className="pb-check" viewBox="0 0 18 18">
          <path d="M3 9l4.5 4.5L15 5" />
        </svg>
        <span className="pb-label">Anwesend</span>
      </div>
    </button>
  )
}