'use client'

import { useState } from 'react'

interface DownloadButtonProps {
  photoUrl: string
  filename: string
}

export default function DownloadButton({ photoUrl, filename }: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (isDownloading) return

    setIsDownloading(true)

    try {
      const response = await fetch(photoUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading photo:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={isDownloading}
      className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm p-2 hover:bg-white transition-all duration-150 opacity-0 group-hover:opacity-100 disabled:opacity-50"
      style={{ 
        color: '#6b7280',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}
      aria-label="Download high-res photo"
    >
      {isDownloading ? (
        <svg 
          className="w-5 h-5 animate-spin" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
      )}
    </button>
  )
}
