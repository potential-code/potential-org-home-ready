/** Deterministic 9x9 verification pattern drawn from the certificate id (QR stand-in, no library). */
export function VerifyMark({ id, size = 88 }: { id: string; size?: number }) {
  let h = 0
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) >>> 0
  const cells: [number, number][] = []
  for (let y = 0; y < 9; y++)
    for (let x = 0; x < 9; x++) {
      const corner = (x < 3 && y < 3) || (x > 5 && y < 3) || (x < 3 && y > 5)
      h = (h * 1103515245 + 12345) >>> 0
      if (corner ? x % 2 === 0 || y % 2 === 0 : h % 3 === 0) cells.push([x, y])
    }
  return (
    <svg viewBox="0 0 9 9" width={size} height={size} role="img" aria-hidden className="text-ink">
      <rect width="9" height="9" className="fill-white" />
      {cells.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" className="fill-current" />
      ))}
    </svg>
  )
}
