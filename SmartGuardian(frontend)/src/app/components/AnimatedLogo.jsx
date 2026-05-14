import React from 'react'
import '../../styles/AnimatedLogo.css'

const AnimatedLogo = () => {
  return (
 /* From Uiverse.io by VashonG */ 
<svg viewBox="0 0 128 128" height="128" width="128" className="star">
  <defs>
    <filter id="star-glow">
      <feGaussianBlur stdDeviation="1.5" result="coloredBlur"></feGaussianBlur>
      <feMerge>
        <feMergeNode in="coloredBlur"></feMergeNode>
        <feMergeNode in="SourceGraphic"></feMergeNode>
      </feMerge>
    </filter>
    <linearGradient y2="1" x2="0" y1="0" x1="0" id="star-grad">
      <stop stopColor="#111" offset="0%"></stop>
      <stop stopColor="#111" offset="100%"></stop>
    </linearGradient>
    <mask id="star-mask">
      <rect fill="url(#star-grad)" height="128" width="128" y="0" x="0"></rect>
    </mask>
  </defs>
  <g
    strokeWidth="2"
    strokeLinejoin="round"
    strokeLinecap="round"
    fill="none"
  >
    <g stroke="hsla(223,90%,50%,0.2)">
      <polygon
        points="64 49 66.322 58.992 71.071 56.929 69.008 61.678 79 64 69.008 66.322 71.071 71.071 66.322 69.008 64 79 61.678 69.008 56.929 71.071 58.992 66.322 49 64 58.992 61.678 56.929 56.929 61.678 58.992 64 49"
      ></polygon>
      <polygon
        points="64 34 68.644 53.983 78.142 49.858 74.017 59.356 94 64 74.017 68.644 78.142 78.142 68.644 74.017 64 94 59.356 74.017 49.858 78.142 53.983 68.644 34 64 53.983 59.356 49.858 49.858 59.356 53.983 64 34"
      ></polygon>
      <polygon
        points="64 19 70.966 48.975 85.213 42.787 79.025 57.034 109 64 79.025 70.966 85.213 85.213 70.966 79.025 64 109 57.034 79.025 42.787 85.213 48.975 70.966 19 64 48.975 57.034 42.787 42.787 57.034 48.975 64 19"
      ></polygon>
      <polygon
        points="64 4 73.287 43.966 92.284 35.716 84.034 54.713 124 64 84.034 73.287 92.284 92.284 73.287 84.034 64 124 54.713 84.034 35.716 92.284 43.966 73.287 4 64 43.966 54.713 35.716 35.716 54.713 43.966 64 4"
      ></polygon>
    </g>
    <g filter="url(#star-glow)">
      <g stroke="hsl(223,90%,50%)">
        <polygon
          points="64 49 66.322 58.992 71.071 56.929 69.008 61.678 79 64 69.008 66.322 71.071 71.071 66.322 69.008 64 79 61.678 69.008 56.929 71.071 58.992 66.322 49 64 58.992 61.678 56.929 56.929 61.678 58.992 64 49"
          strokeDasharray="31 93"
          className="star__stroke"
        ></polygon>
        <polygon
          points="64 34 68.644 53.983 78.142 49.858 74.017 59.356 94 64 74.017 68.644 78.142 78.142 68.644 74.017 64 94 59.356 74.017 49.858 78.142 53.983 68.644 34 64 53.983 59.356 49.858 49.858 59.356 53.983 64 34"
          strokeDasharray="62 186"
          className="star__stroke star__stroke--2"
        ></polygon>
        <polygon
          points="64 19 70.966 48.975 85.213 42.787 79.025 57.034 109 64 79.025 70.966 85.213 85.213 70.966 79.025 64 109 57.034 79.025 42.787 85.213 48.975 70.966 19 64 48.975 57.034 42.787 42.787 57.034 48.975 64 19"
          strokeDasharray="93 279"
          className="star__stroke star__stroke--3"
        ></polygon>
        <polygon
          points="64 4 73.287 43.966 92.284 35.716 84.034 54.713 124 64 84.034 73.287 92.284 92.284 73.287 84.034 64 124 54.713 84.034 35.716 92.284 43.966 73.287 4 64 43.966 54.713 35.716 35.716 54.713 43.966 64 4"
          strokeDasharray="124 372"
          className="star__stroke star__stroke--4"
        ></polygon>
      </g>
      <g mask="url(#star-mask)" stroke="hsl(283,90%,50%)">
        <polygon
          points="64 49 66.322 58.992 71.071 56.929 69.008 61.678 79 64 69.008 66.322 71.071 71.071 66.322 69.008 64 79 61.678 69.008 56.929 71.071 58.992 66.322 49 64 58.992 61.678 56.929 56.929 61.678 58.992 64 49"
          strokeDasharray="31 93"
          className="star__stroke"
        ></polygon>
        <polygon
          points="64 34 68.644 53.983 78.142 49.858 74.017 59.356 94 64 74.017 68.644 78.142 78.142 68.644 74.017 64 94 59.356 74.017 49.858 78.142 53.983 68.644 34 64 53.983 59.356 49.858 49.858 59.356 53.983 64 34"
          strokeDasharray="62 186"
          className="star__stroke star__stroke--2"
        ></polygon>
        <polygon
          points="64 19 70.966 48.975 85.213 42.787 79.025 57.034 109 64 79.025 70.966 85.213 85.213 70.966 79.025 64 109 57.034 79.025 42.787 85.213 48.975 70.966 19 64 48.975 57.034 42.787 42.787 57.034 48.975 64 19"
          strokeDasharray="93 279"
          className="star__stroke star__stroke--3"
        ></polygon>
        <polygon
          points="64 4 73.287 43.966 92.284 35.716 84.034 54.713 124 64 84.034 73.287 92.284 92.284 73.287 84.034 64 124 54.713 84.034 35.716 92.284 43.966 73.287 4 64 43.966 54.713 35.716 35.716 54.713 43.966 64 4"
          strokeDasharray="124 372"
          className="star__stroke star__stroke--4"
        ></polygon>
      </g>
    </g>
  </g>
</svg>

  )
}

export default AnimatedLogo
