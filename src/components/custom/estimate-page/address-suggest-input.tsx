'use client'

import React, { useEffect, useRef, useState } from 'react'
import type { AddressSuggestion } from '@/lib/address-suggest'

interface AddressSuggestInputProps {
  id: string
  value: string
  onChange: (value: string) => void
  onSelect: (suggestion: AddressSuggestion) => void
  className?: string
}

const MIN_QUERY_LENGTH = 3
const DEBOUNCE_MS = 250

export default function AddressSuggestInput({
  id,
  value,
  onChange,
  onSelect,
  className,
}: AddressSuggestInputProps) {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [message, setMessage] = useState<string | null>(null)
  const skipNextFetch = useRef(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (skipNextFetch.current) {
      skipNextFetch.current = false
      return
    }

    const query = value.trim()
    if (query.length < MIN_QUERY_LENGTH) {
      setSuggestions([])
      setOpen(false)
      setMessage(null)
      setLoading(false)
      return
    }

    const controller = new AbortController()
    const timer = window.setTimeout(async () => {
      setLoading(true)
      setMessage(null)
      try {
        const response = await fetch(`/api/address-suggest?q=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        })
        const data = (await response.json()) as {
          suggestions?: AddressSuggestion[]
          error?: string
        }
        if (!response.ok) {
          setSuggestions([])
          setMessage(data.error || 'Address search is unavailable')
          setOpen(true)
          return
        }
        const next = data.suggestions ?? []
        setSuggestions(next)
        setActiveIndex(-1)
        setMessage(next.length === 0 ? 'No matching addresses' : null)
        setOpen(true)
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setSuggestions([])
        setMessage('Address search is unavailable')
        setOpen(true)
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }, DEBOUNCE_MS)

    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [value])

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [])

  const choose = (suggestion: AddressSuggestion) => {
    skipNextFetch.current = true
    setOpen(false)
    setSuggestions([])
    onSelect(suggestion)
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((index) => Math.min(index + 1, suggestions.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((index) => Math.max(index - 1, 0))
    } else if (event.key === 'Enter' && suggestions.length > 0) {
      event.preventDefault()
      const pick = suggestions[activeIndex] ?? suggestions[0]
      choose(pick)
    } else if (event.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onFocus={() => {
          if (suggestions.length > 0 || message) setOpen(true)
        }}
        onKeyDown={onKeyDown}
        placeholder="Enter your street address"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        aria-controls={`${id}-suggestions`}
        className={className}
      />
      {open && (
        <ul
          id={`${id}-suggestions`}
          role="listbox"
          className="absolute z-30 mt-1 max-h-60 w-full overflow-auto rounded-md border-2 border-black bg-white shadow-lg"
        >
          {loading && suggestions.length === 0 && (
            <li className="px-4 py-2.5 text-sm text-gray-500">Searching addresses...</li>
          )}
          {suggestions.map((suggestion, index) => (
            <li key={`${suggestion.label}-${index}`} role="option" aria-selected={index === activeIndex}>
              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => choose(suggestion)}
                className={`block w-full px-4 py-2.5 text-left text-sm text-black cursor-pointer ${
                  index === activeIndex ? 'bg-black text-white' : 'hover:bg-gray-100'
                }`}
              >
                {suggestion.label}
              </button>
            </li>
          ))}
          {!loading && message && (
            <li className="px-4 py-2.5 text-sm text-gray-500">{message}</li>
          )}
        </ul>
      )}
    </div>
  )
}
