import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'

const MIN_WIDTH = 80
const MIN_EXPANDED_WIDTH = 240
const COLLAPSE_THRESHOLD = (MIN_WIDTH + MIN_EXPANDED_WIDTH) / 2
const DEFAULT_WIDTH = 340
const MAX_WIDTH = 600
const MIN_CHAT_WIDTH = 320

export function useSidebarResize() {
  const layoutRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{
    pointerId: number
    startX: number
    startWidth: number
    currentWidth: number
  } | null>(null)
  const [preferredWidth, setPreferredWidth] = useState(DEFAULT_WIDTH)
  const [layoutWidth, setLayoutWidth] = useState(MAX_WIDTH + MIN_CHAT_WIDTH)
  const [isResizing, setIsResizing] = useState(false)
  const maxWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, layoutWidth - MIN_CHAT_WIDTH))
  const width = Math.min(preferredWidth, maxWidth)
  const detailsOpacity = Math.max(
    0,
    Math.min(1, (width - MIN_WIDTH) / (COLLAPSE_THRESHOLD - MIN_WIDTH)),
  )

  useEffect(() => {
    const layout = layoutRef.current
    if (!layout) return

    const observer = new ResizeObserver(([entry]) => {
      if (entry) setLayoutWidth(entry.contentRect.width)
    })
    observer.observe(layout)
    return () => observer.disconnect()
  }, [])

  function resize(nextWidth: number) {
    const clampedWidth = Math.max(MIN_WIDTH, Math.min(maxWidth, nextWidth))
    setPreferredWidth(clampedWidth)
    return clampedWidth
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (!event.isPrimary || event.button !== 0) return

    event.preventDefault()
    event.currentTarget.focus()
    event.currentTarget.setPointerCapture(event.pointerId)
    const startWidth = event.currentTarget.parentElement?.getBoundingClientRect().width ?? width
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startWidth,
      currentWidth: startWidth,
    }
    resize(startWidth)
    setIsResizing(true)
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return

    drag.currentWidth = resize(drag.startWidth + event.clientX - drag.startX)
  }

  function stopResizing(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return

    const releasedWidth = event.type === 'pointercancel' ? drag.startWidth : drag.currentWidth
    resize(
      releasedWidth < COLLAPSE_THRESHOLD ? MIN_WIDTH : Math.max(MIN_EXPANDED_WIDTH, releasedWidth),
    )

    dragRef.current = null
    setIsResizing(false)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const nextWidth = {
      ArrowLeft: width <= MIN_EXPANDED_WIDTH ? MIN_WIDTH : Math.max(MIN_EXPANDED_WIDTH, width - 20),
      ArrowRight: Math.max(MIN_EXPANDED_WIDTH, width + 20),
      Home: MIN_WIDTH,
      End: maxWidth,
      Enter: width === MIN_WIDTH ? DEFAULT_WIDTH : MIN_WIDTH,
    }[event.key]

    if (nextWidth === undefined) return
    event.preventDefault()
    resize(nextWidth)
  }

  return {
    layoutRef,
    width,
    detailsOpacity,
    isResizing,
    separatorProps: {
      role: 'separator',
      tabIndex: 0,
      'aria-label': 'Ширина списка чатов',
      'aria-orientation': 'vertical' as const,
      'aria-controls': 'chat-sidebar',
      'aria-valuemin': MIN_WIDTH,
      'aria-valuemax': maxWidth,
      'aria-valuenow': width,
      'aria-valuetext': `${Math.round(width)} пикселей`,
      title: 'Потяните, чтобы изменить ширину. Двойной щелчок для исходной ширины.',
      onPointerDown,
      onPointerMove,
      onPointerUp: stopResizing,
      onPointerCancel: stopResizing,
      onLostPointerCapture: stopResizing,
      onKeyDown,
      onDoubleClick: () => resize(DEFAULT_WIDTH),
    },
  }
}
