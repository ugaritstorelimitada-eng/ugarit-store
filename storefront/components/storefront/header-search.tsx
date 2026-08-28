"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Search, X, ArrowRight } from "lucide-react"
import { formatCLP, MOCK_PRODUCTS } from "@/lib/mock-products"
import { cn } from "@/lib/utils"

const SUGGESTION_LIMIT = 6

export function HeaderSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") ?? ""
  const [query, setQuery] = useState(initialQuery)
  const [isOpen, setIsOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Filtrar productos según query
  const results = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return MOCK_PRODUCTS.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q)
    ).slice(0, SUGGESTION_LIMIT)
  }, [query])

  // Cerrar al hacer click fuera
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", onClickOutside)
    return () => document.removeEventListener("mousedown", onClickOutside)
  }, [])

  // Atajo de teclado: ⌘K o Ctrl+K
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        inputRef.current?.focus()
        setIsOpen(true)
      }
      if (e.key === "Escape") {
        setIsOpen(false)
        inputRef.current?.blur()
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/tienda?q=${encodeURIComponent(query.trim())}`)
      setIsOpen(false)
      inputRef.current?.blur()
    }
  }

  function handleSelect(handle: string) {
    router.push(`/p/${handle}`)
    setQuery("")
    setIsOpen(false)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!isOpen) setIsOpen(true)
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setHighlighted((h) => Math.min(h + 1, results.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setHighlighted((h) => Math.max(h - 1, -1))
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (highlighted >= 0 && results[highlighted]) {
        handleSelect(results[highlighted].handle)
      } else {
        handleSubmit(e)
      }
    }
  }

  return (
    <div ref={containerRef} className="hidden md:flex flex-1 max-w-xl relative">
      <form
        onSubmit={handleSubmit}
        className={cn(
          "flex w-full items-center gap-2 rounded-full border bg-muted/40 px-4 h-10 transition-all",
          isOpen && "ring-2 ring-ring bg-background"
        )}
      >
        <Search className="h-4 w-4 text-muted-foreground shrink-0" />
        <input
          ref={inputRef}
          type="search"
          name="q"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
            setHighlighted(-1)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Buscar productos, software, marcas…"
          className="flex-1 bg-transparent outline-none text-sm"
          aria-label="Buscar productos"
          aria-autocomplete="list"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("")
              inputRef.current?.focus()
            }}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Limpiar"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <kbd className="hidden lg:inline-flex items-center gap-0.5 rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </form>

      {/* Sugerencias dropdown */}
      {isOpen && query.trim() && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-popover text-popover-foreground border rounded-lg shadow-lg z-50 overflow-hidden">
          {results.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground text-center">
              Sin resultados para <strong>&ldquo;{query}&rdquo;</strong>
            </div>
          ) : (
            <>
              <ul className="py-1" role="listbox">
                {results.map((product, i) => (
                  <li
                    key={product.id}
                    role="option"
                    aria-selected={highlighted === i}
                  >
                    <button
                      type="button"
                      onClick={() => handleSelect(product.handle)}
                      onMouseEnter={() => setHighlighted(i)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 text-left text-sm transition-colors",
                        highlighted === i ? "bg-accent" : "hover:bg-accent/50"
                      )}
                    >
                      <div className="relative w-10 h-10 rounded overflow-hidden bg-muted shrink-0">
                        {product.images[0] && (
                          <Image
                            src={product.images[0]}
                            alt={product.title}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="line-clamp-1 font-medium">{product.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {product.brand ?? product.category}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-ugarit-700 whitespace-nowrap">
                        {formatCLP(product.price)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
              <div className="border-t px-3 py-2 bg-muted/30">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full flex items-center justify-between text-sm text-muted-foreground hover:text-foreground"
                >
                  <span>Ver todos los resultados</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
