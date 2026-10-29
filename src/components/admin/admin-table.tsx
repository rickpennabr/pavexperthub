'use client'

import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type MouseEvent as ReactMouseEvent, type ReactNode } from 'react'
import { ArrowDown, ArrowUp, ArrowUpAZ, ArrowDownAZ, ChevronDown, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'

const PAGE_SIZE = 25

export interface AdminColumn<T> {
  id: string
  header: string
  className?: string
  cell: (row: T) => ReactNode
  sortValue?: (row: T) => string | number
  filterValue?: (row: T) => string
}

interface AdminTableProps<T> {
  columns: AdminColumn<T>[]
  rows: T[]
  rowKey: (row: T) => string
  itemLabel: string
  emptyLabel: string
  /** Clears the selection when search or an external filter changes. */
  resetKey?: string
  onEdit?: (row: T) => void
  onDelete?: (rows: T[]) => void
}

type SortState = { id: string; direction: 'asc' | 'desc' }
type ActiveCell = { rowId: string; columnId: string }
type MenuState =
  | { kind: 'column'; id: string; top: number; left: number }
  | { kind: 'row'; id: string; top: number; left: number }

function textOf<T>(column: AdminColumn<T>, row: T) {
  if (column.filterValue) return column.filterValue(row)
  const value = column.sortValue?.(row)
  return value == null ? '' : String(value)
}

function displayValue(value: string) {
  const trimmed = value.trim()
  return trimmed === '' || trimmed === '—' ? '(Blank)' : value
}

function compareValues(left: string | number, right: string | number) {
  if (typeof left === 'number' && typeof right === 'number') return left - right
  return String(left).localeCompare(String(right), undefined, { numeric: true, sensitivity: 'base' })
}

function passesFilters<T>(row: T, columns: AdminColumn<T>[], filters: Record<string, Set<string>>) {
  return columns.every((column) => {
    const allowed = filters[column.id]
    if (!allowed) return true
    return allowed.has(textOf(column, row))
  })
}

function isInteractive(target: EventTarget | null) {
  return target instanceof Element && Boolean(target.closest('button, a, input, textarea, select, label, [data-sheet-menu]'))
}

function summary(shown: number, total: number, itemLabel: string) {
  const noun = total === 1 ? itemLabel : `${itemLabel}s`
  if (shown === total) return `${shown} ${noun}`
  return `${shown} of ${total} ${noun}`
}

export async function deleteSelected<T>(
  items: T[],
  remove: (item: T) => Promise<{ ok: boolean; error?: string }>,
  fallback: string,
) {
  for (const item of items) {
    const result = await remove(item)
    if (!result.ok) return result.error || fallback
  }
  return null
}

export function AdminTable<T>({
  columns,
  rows,
  rowKey,
  itemLabel,
  emptyLabel,
  resetKey = '',
  onEdit,
  onDelete,
}: AdminTableProps<T>) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [sort, setSort] = useState<SortState | null>(null)
  const [columnFilters, setColumnFilters] = useState<Record<string, Set<string>>>({})
  const [page, setPage] = useState(0)
  const [menu, setMenu] = useState<MenuState | null>(null)
  const [valueQuery, setValueQuery] = useState('')
  const [active, setActive] = useState<ActiveCell | null>(null)
  const [copied, setCopied] = useState(false)
  const anchorRef = useRef<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const headerCheckRef = useRef<HTMLInputElement>(null)
  const copiedTimer = useRef<number | null>(null)
  const resetSeen = useRef(resetKey)

  const filtered = useMemo(() => {
    const next = rows.filter((row) => passesFilters(row, columns, columnFilters))
    if (!sort) return next
    const column = columns.find((item) => item.id === sort.id)
    if (!column?.sortValue) return next
    const direction = sort.direction === 'asc' ? 1 : -1
    return [...next].sort((left, right) => compareValues(column.sortValue!(left), column.sortValue!(right)) * direction)
  }, [rows, columns, columnFilters, sort])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount - 1)
  const pageRows = filtered.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE)
  const pageIds = pageRows.map((row) => rowKey(row))
  const allChecked = pageIds.length > 0 && pageIds.every((id) => selected.has(id))
  const someChecked = pageIds.some((id) => selected.has(id))
  const selectedRows = filtered.filter((row) => selected.has(rowKey(row)))

  useEffect(() => {
    if (headerCheckRef.current) headerCheckRef.current.indeterminate = someChecked && !allChecked
  }, [someChecked, allChecked])

  useEffect(() => {
    if (resetSeen.current === resetKey) return
    resetSeen.current = resetKey
    setSelected(new Set())
    setActive(null)
    setPage(0)
    anchorRef.current = null
  }, [resetKey])

  useEffect(() => {
    if (page !== safePage) setPage(safePage)
  }, [page, safePage])

  const idsKey = rows.map((row) => rowKey(row)).join('\0')
  useEffect(() => {
    const valid = new Set(idsKey.split('\0').filter(Boolean))
    setSelected((current) => {
      let changed = false
      const next = new Set<string>()
      current.forEach((id) => {
        if (valid.has(id)) next.add(id)
        else changed = true
      })
      return changed ? next : current
    })
  }, [idsKey])

  useEffect(() => {
    if (!menu) return
    function onPointer(event: MouseEvent) {
      const target = event.target
      if (!(target instanceof Node)) return
      if (menuRef.current?.contains(target)) return
      if (target instanceof Element && target.closest('[data-menu-trigger]')) return
      setMenu(null)
    }
    function onScroll(event: Event) {
      const target = event.target
      if (target instanceof Node && menuRef.current?.contains(target)) return
      setMenu(null)
    }
    window.addEventListener('mousedown', onPointer)
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('mousedown', onPointer)
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', onScroll)
    }
  }, [menu])

  useEffect(() => {
    setValueQuery('')
  }, [menu?.kind, menu && 'id' in menu ? menu.id : ''])

  function placeMenu(kind: MenuState['kind'], id: string, anchor: HTMLElement): MenuState {
    const rect = anchor.getBoundingClientRect()
    const width = kind === 'column' ? 280 : 180
    return {
      kind,
      id,
      top: rect.bottom + 6,
      left: Math.max(8, Math.min(rect.right - width, window.innerWidth - width - 8)),
    }
  }

  function toggleMenu(kind: MenuState['kind'], id: string, anchor: HTMLElement) {
    setMenu((current) => (current?.kind === kind && current.id === id ? null : placeMenu(kind, id, anchor)))
  }

  function selectRows(id: string, mode: 'add' | 'remove' | 'toggle' | 'range') {
    const ids = filtered.map((row) => rowKey(row))
    setSelected((current) => {
      if (mode === 'range') {
        const anchor = anchorRef.current && ids.includes(anchorRef.current) ? anchorRef.current : id
        const startIndex = ids.indexOf(anchor)
        const endIndex = ids.indexOf(id)
        const [start, end] = startIndex < endIndex ? [startIndex, endIndex] : [endIndex, startIndex]
        const range = new Set<string>()
        for (let index = start; index <= end; index += 1) range.add(ids[index])
        return range
      }
      const next = new Set(current)
      if (mode === 'add') next.add(id)
      else if (mode === 'remove') next.delete(id)
      else if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
    if (mode !== 'range') anchorRef.current = id
  }

  function togglePage(checked: boolean) {
    setSelected((current) => {
      const next = new Set(current)
      pageIds.forEach((id) => {
        if (checked) next.add(id)
        else next.delete(id)
      })
      return next
    })
  }

  function toggleSort(column: AdminColumn<T>, direction?: 'asc' | 'desc') {
    if (!column.sortValue) return
    setSort((current) => {
      if (direction) return { id: column.id, direction }
      if (current?.id !== column.id) return { id: column.id, direction: 'asc' }
      return { id: column.id, direction: current.direction === 'asc' ? 'desc' : 'asc' }
    })
    if (direction) setMenu(null)
  }

  function uniqueValues(column: AdminColumn<T>) {
    const counts = new Map<string, number>()
    rows.forEach((row) => {
      if (!passesFilters(row, columns.filter((item) => item.id !== column.id), columnFilters)) return
      const value = textOf(column, row)
      counts.set(value, (counts.get(value) ?? 0) + 1)
    })
    return Array.from(counts.keys()).sort((left, right) => displayValue(left).localeCompare(displayValue(right), undefined, { numeric: true, sensitivity: 'base' }))
  }

  function toggleFilterValue(columnId: string, value: string, allValues: string[]) {
    setColumnFilters((current) => {
      const next = new Set(current[columnId] ?? allValues)
      if (next.has(value)) next.delete(value)
      else next.add(value)
      if (next.size === allValues.length) {
        const rest = { ...current }
        delete rest[columnId]
        return rest
      }
      return { ...current, [columnId]: next }
    })
    setSelected(new Set())
    setPage(0)
    setActive(null)
  }

  function clearFilter(columnId: string) {
    setColumnFilters((current) => {
      const rest = { ...current }
      delete rest[columnId]
      return rest
    })
    setSelected(new Set())
    setPage(0)
  }

  function flashCopied() {
    setCopied(true)
    if (copiedTimer.current) window.clearTimeout(copiedTimer.current)
    copiedTimer.current = window.setTimeout(() => setCopied(false), 1500)
  }

  function copySelection() {
    const chosen = filtered.filter((row) => selected.has(rowKey(row)))
    let text = ''
    if (chosen.length > 0) {
      const header = columns.map((column) => column.header).join('\t')
      const lines = chosen.map((row) => columns.map((column) => textOf(column, row).replace(/\s+/g, ' ').trim()).join('\t'))
      text = [header, ...lines].join('\n')
    } else if (active) {
      const row = filtered.find((item) => rowKey(item) === active.rowId)
      const column = columns.find((item) => item.id === active.columnId)
      if (!row || !column) return false
      text = textOf(column, row)
    } else {
      return false
    }
    navigator.clipboard.writeText(text).then(flashCopied).catch(() => undefined)
    return true
  }

  function moveActive(key: string, shift: boolean) {
    if (pageRows.length === 0 || columns.length === 0) return
    const rowIndex = Math.max(0, pageRows.findIndex((row) => rowKey(row) === active?.rowId))
    const columnIndex = Math.max(0, columns.findIndex((column) => column.id === active?.columnId))
    let nextRow = rowIndex
    let nextColumn = columnIndex
    if (!active && (key === 'ArrowDown' || key === 'ArrowRight')) {
      nextRow = 0
      nextColumn = 0
    } else if (key === 'ArrowDown') nextRow = Math.min(pageRows.length - 1, rowIndex + 1)
    else if (key === 'ArrowUp') nextRow = Math.max(0, rowIndex - 1)
    else if (key === 'ArrowRight') nextColumn = Math.min(columns.length - 1, columnIndex + 1)
    else if (key === 'ArrowLeft') nextColumn = Math.max(0, columnIndex - 1)
    const row = pageRows[nextRow]
    const column = columns[nextColumn]
    if (!row || !column) return
    const id = rowKey(row)
    setActive({ rowId: id, columnId: column.id })
    if (shift && (key === 'ArrowUp' || key === 'ArrowDown')) {
      if (!anchorRef.current) anchorRef.current = active?.rowId ?? id
      selectRows(id, 'range')
    }
    containerRef.current
      ?.querySelector(`[data-sheet-cell="${CSS.escape(`${id}:${column.id}`)}"]`)
      ?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      event.preventDefault()
      if (menu) setMenu(null)
      else {
        setSelected(new Set())
        setActive(null)
      }
      return
    }
    if (event.target instanceof Element && event.target.closest('[data-sheet-menu]')) return
    const meta = event.ctrlKey || event.metaKey
    if (meta && event.key.toLowerCase() === 'a') {
      event.preventDefault()
      setSelected(new Set(pageIds))
      return
    }
    if (meta && event.key.toLowerCase() === 'c') {
      if (copySelection()) event.preventDefault()
      return
    }
    if (event.key === 'Enter' && active && onEdit) {
      const row = filtered.find((item) => rowKey(item) === active.rowId)
      if (row) {
        event.preventDefault()
        onEdit(row)
      }
      return
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault()
      moveActive(event.key, event.shiftKey)
    }
  }

  function onCellClick(event: ReactMouseEvent<HTMLTableCellElement>, row: T, column: AdminColumn<T>) {
    if (isInteractive(event.target)) return
    const id = rowKey(row)
    containerRef.current?.focus({ preventScroll: true })
    if (event.shiftKey) {
      selectRows(id, 'range')
      setActive({ rowId: id, columnId: column.id })
      return
    }
    if (event.ctrlKey || event.metaKey) {
      selectRows(id, 'toggle')
      setActive({ rowId: id, columnId: column.id })
      return
    }
    if (active?.rowId === id && active.columnId === column.id) {
      onEdit?.(row)
      return
    }
    anchorRef.current = id
    setActive({ rowId: id, columnId: column.id })
  }

  const menuColumn = menu?.kind === 'column' ? columns.find((column) => column.id === menu.id) : undefined
  const menuValues = menuColumn ? uniqueValues(menuColumn) : []
  const shownValues = menuValues.filter((value) => displayValue(value).toLowerCase().includes(valueQuery.trim().toLowerCase()))
  const menuRow = menu?.kind === 'row' ? rows.find((row) => rowKey(row) === menu.id) : undefined
  const activeFilters = Object.entries(columnFilters)

  return (
    <div ref={containerRef} tabIndex={0} onKeyDown={onKeyDown} className="outline-none focus-visible:ring-2 focus-visible:ring-red-500">
      {selectedRows.length > 0 && (
        <div className="mb-3 flex items-center justify-between gap-2 rounded-md border-2 border-black bg-white px-3 py-2">
          <span className="text-sm font-bold">{selectedRows.length} selected</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setSelected(new Set())
                anchorRef.current = null
              }}
              className="rounded-md border-2 border-black bg-white px-3 py-1.5 text-sm font-bold hover:border-red-500 hover:text-red-600"
            >
              Clear
            </button>
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(selectedRows)}
                className="rounded-md border-2 border-red-600 bg-red-600 px-4 py-1.5 text-sm font-bold text-white hover:border-black hover:bg-black"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      )}

      {activeFilters.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {activeFilters.map(([columnId, values]) => {
            const column = columns.find((item) => item.id === columnId)
            const label = values.size === 1 ? displayValue(Array.from(values)[0]) : `${values.size} selected`
            return (
              <button
                key={columnId}
                type="button"
                onClick={() => clearFilter(columnId)}
                className="rounded-full border-2 border-black bg-white px-3 py-1 text-xs font-bold hover:border-red-500"
              >
                {column?.header}: {label} ×
              </button>
            )
          })}
        </div>
      )}

      <div className="overflow-hidden rounded-lg border-2 border-red-500 bg-white">
        <div className="max-h-[calc(100vh-18rem)] overflow-auto">
          <table className="w-full min-w-[720px] border-separate border-spacing-0 text-left text-sm">
            <thead>
              <tr>
                {onDelete && (
                  <th className="sticky top-0 left-0 z-30 w-12 border-b border-red-500 bg-black px-3 py-3">
                    <input
                      ref={headerCheckRef}
                      type="checkbox"
                      checked={allChecked}
                      onChange={(event) => togglePage(event.target.checked)}
                      aria-label="Select all visible rows"
                      className="h-4 w-4 cursor-pointer accent-red-600"
                    />
                  </th>
                )}
                {columns.map((column) => {
                  const sorted = sort?.id === column.id
                  const filteredColumn = Boolean(columnFilters[column.id])
                  return (
                    <th
                      key={column.id}
                      className={`sticky top-0 z-20 border-b border-red-500 bg-black px-4 py-2 text-xs font-bold tracking-wide text-white ${column.className ?? ''}`}
                    >
                      <div className="flex items-center gap-1">
                        {column.sortValue ? (
                          <button
                            type="button"
                            onClick={() => toggleSort(column)}
                            className="flex min-w-0 flex-1 items-center gap-1 text-left uppercase"
                          >
                            <span className="truncate">{column.header}</span>
                            {sorted && (sort.direction === 'asc' ? <ArrowUp className="h-3.5 w-3.5 shrink-0 text-red-400" /> : <ArrowDown className="h-3.5 w-3.5 shrink-0 text-red-400" />)}
                          </button>
                        ) : (
                          <span className="min-w-0 flex-1 truncate uppercase">{column.header}</span>
                        )}
                        {(column.sortValue || column.filterValue) && (
                          <button
                            type="button"
                            data-menu-trigger
                            aria-label={`${column.header} column menu`}
                            onClick={(event) => toggleMenu('column', column.id, event.currentTarget)}
                            className="relative rounded p-0.5 hover:bg-white/15"
                          >
                            <ChevronDown className="h-3.5 w-3.5" />
                            {filteredColumn && <span className="absolute top-0 right-0 h-1.5 w-1.5 rounded-full bg-red-500" />}
                          </button>
                        )}
                      </div>
                    </th>
                  )
                })}
                {(onEdit || onDelete) && (
                  <th className="sticky top-0 right-0 z-30 w-12 border-b border-red-500 bg-black px-2 py-3" />
                )}
              </tr>
            </thead>
            <tbody>
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + (onDelete ? 1 : 0) + (onEdit || onDelete ? 1 : 0)} className="px-4 py-12 text-center text-sm text-neutral-600">
                    {rows.length === 0 ? emptyLabel : 'No rows match these filters.'}
                  </td>
                </tr>
              ) : (
                pageRows.map((row) => {
                  const id = rowKey(row)
                  const checked = selected.has(id)
                  return (
                    <tr key={id} className="group" aria-selected={checked}>
                      {onDelete && (
                        <td className={`sticky left-0 z-10 w-12 border-b border-neutral-200 px-3 py-3 ${checked ? 'bg-red-50' : 'bg-white'} group-hover:bg-red-50`} onClick={(event) => event.stopPropagation()} onDoubleClick={(event) => event.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={checked}
                            aria-label="Select row"
                            onClick={(event) => {
                              event.stopPropagation()
                              if (event.shiftKey) {
                                event.preventDefault()
                                selectRows(id, 'range')
                              }
                            }}
                            onChange={(event) => {
                              if (event.nativeEvent instanceof MouseEvent && event.nativeEvent.shiftKey) return
                              selectRows(id, event.target.checked ? 'add' : 'remove')
                            }}
                            className="h-4 w-4 cursor-pointer accent-red-600"
                          />
                        </td>
                      )}
                      {columns.map((column) => {
                        const isActive = active?.rowId === id && active.columnId === column.id
                        const label = textOf(column, row)
                        return (
                          <td
                            key={column.id}
                            data-sheet-cell={`${id}:${column.id}`}
                            title={label.length > 48 ? label : undefined}
                            onClick={(event) => onCellClick(event, row, column)}
                            onDoubleClick={() => onEdit?.(row)}
                            className={`border-b border-neutral-200 px-4 py-3 align-middle text-black ${checked ? 'bg-red-50' : 'bg-white'} group-hover:bg-red-50 ${isActive ? 'shadow-[inset_0_0_0_2px_#dc2626]' : ''} ${column.className ?? ''}`}
                          >
                            {column.cell(row)}
                          </td>
                        )
                      })}
                      {(onEdit || onDelete) && (
                        <td className={`sticky right-0 z-10 w-12 border-b border-neutral-200 px-2 py-3 text-right ${checked ? 'bg-red-50' : 'bg-white'} group-hover:bg-red-50`}>
                          <button
                            type="button"
                            data-menu-trigger
                            aria-label="Row actions"
                            onClick={(event) => {
                              event.stopPropagation()
                              toggleMenu('row', id, event.currentTarget)
                            }}
                            className="rounded-md p-1 text-black hover:bg-black hover:text-white"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </td>
                      )}
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between gap-3 text-xs font-medium text-neutral-600">
        <span>{summary(filtered.length, rows.length, itemLabel)}{copied ? ' · Copied' : ''}</span>
        {pageCount > 1 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={safePage === 0}
              onClick={() => setPage(safePage - 1)}
              className="inline-flex items-center gap-1 rounded-md border-2 border-black bg-white px-2 py-1 font-bold text-black disabled:opacity-40"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Previous
            </button>
            <span>
              {safePage + 1} / {pageCount}
            </span>
            <button
              type="button"
              disabled={safePage >= pageCount - 1}
              onClick={() => setPage(safePage + 1)}
              className="inline-flex items-center gap-1 rounded-md border-2 border-black bg-white px-2 py-1 font-bold text-black disabled:opacity-40"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {menu?.kind === 'column' && menuColumn && (
        <div
          ref={menuRef}
          data-sheet-menu
          style={{ top: menu.top, left: menu.left }}
          className="fixed z-[70] w-[280px] rounded-lg border-2 border-black bg-white p-2 text-sm text-black shadow-2xl"
        >
          {menuColumn.sortValue && (
            <>
              <button type="button" onClick={() => toggleSort(menuColumn, 'asc')} className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left font-bold hover:bg-red-50">
                <ArrowUpAZ className="h-4 w-4" />
                Sort A to Z
              </button>
              <button type="button" onClick={() => toggleSort(menuColumn, 'desc')} className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left font-bold hover:bg-red-50">
                <ArrowDownAZ className="h-4 w-4" />
                Sort Z to A
              </button>
            </>
          )}
          {menuColumn.filterValue && (
            <div className={menuColumn.sortValue ? 'mt-2 border-t border-neutral-200 pt-2' : ''}>
              <input
                value={valueQuery}
                onChange={(event) => setValueQuery(event.target.value)}
                placeholder="Filter values..."
                className="mb-2 h-8 w-full rounded-md border-2 border-red-500 px-2 text-xs outline-none"
              />
              <div className="max-h-48 space-y-1 overflow-y-auto">
                {shownValues.length === 0 && <p className="px-2 py-1 text-xs text-neutral-500">No matching values.</p>}
                {shownValues.map((value) => {
                  const checked = !columnFilters[menuColumn.id] || columnFilters[menuColumn.id].has(value)
                  return (
                    <label key={value || '(blank)'} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 hover:bg-red-50">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleFilterValue(menuColumn.id, value, menuValues)}
                        className="h-4 w-4 accent-red-600"
                      />
                      <span className="truncate">{displayValue(value)}</span>
                    </label>
                  )
                })}
              </div>
              <button
                type="button"
                disabled={!columnFilters[menuColumn.id]}
                onClick={() => clearFilter(menuColumn.id)}
                className="mt-2 w-full rounded-md px-2 py-1.5 text-left text-xs font-bold text-red-600 disabled:opacity-40"
              >
                Clear filter
              </button>
            </div>
          )}
        </div>
      )}

      {menu?.kind === 'row' && menuRow && (
        <div
          ref={menuRef}
          data-sheet-menu
          style={{ top: menu.top, left: menu.left }}
          className="fixed z-[70] w-[180px] rounded-lg border-2 border-black bg-white p-1 text-sm shadow-2xl"
        >
          {onEdit && (
            <button
              type="button"
              onClick={() => {
                setMenu(null)
                onEdit(menuRow)
              }}
              className="block w-full rounded-md px-3 py-2 text-left font-bold hover:bg-red-50"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={() => {
                setMenu(null)
                onDelete([menuRow])
              }}
              className="block w-full rounded-md px-3 py-2 text-left font-bold text-red-600 hover:bg-red-50"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  )
}
