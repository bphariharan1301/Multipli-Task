'use client'
import React, { useEffect, useRef, useState } from 'react'

function debounce(cb: any, delay: any) {
  return setTimeout(() => {
    cb()
  }, delay)
}

function page() {
  const [query, setQuery] = useState('');
  const time = useRef<any>(null)
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchSearch = () => {
    console.log('Searching for...', query)
    setResult(query)
    setLoading(false)
  }

  useEffect(() => {
    if (time.current) {
      clearTimeout(time.current)
    }
    setLoading(true)
    time.current = debounce(fetchSearch, 2000)

    return () => {
      if (time.current) {
        clearTimeout(time.current)
      }
    }

  }, [query])

  const handleChange = (event: any) => {
    setQuery(event.target.value)
  }

  return (
    <>
      <input
        type='text'
        value={query}
        onChange={(event) => handleChange(event)}
        placeholder='Search...'
      />
      {
        loading && <p>Loading...</p>
      }
      <h1>
        Result: {result}
      </h1>
    </>
  )
}

export default page