import type { PokemonStat } from '../types/pokemon'

const SIZE = 300
const CX = SIZE / 2
const CY = SIZE / 2
const R = 110
const STAT_MAX = 200
const LEVELS = [0.25, 0.5, 0.75, 1]

interface RadarChartProps {
  statsA: PokemonStat[]
  statsB: PokemonStat[]
  colorA: string
  colorB: string
  labelA: string
  labelB: string
}

function polarToCart(angle: number, radius: number): [number, number] {
  const rad = ((angle - 90) * Math.PI) / 180
  return [CX + radius * Math.cos(rad), CY + radius * Math.sin(rad)]
}

function statPoints(stats: PokemonStat[], maxR: number): string {
  return stats
    .map((s, i) => {
      const angle = (360 / stats.length) * i
      const r = (Math.min(s.value, STAT_MAX) / STAT_MAX) * maxR
      const [x, y] = polarToCart(angle, r)
      return `${x},${y}`
    })
    .join(' ')
}

export default function RadarChart({ statsA, statsB, colorA, colorB, labelA, labelB }: RadarChartProps) {
  const axes = statsA.length

  return (
    <div className="flex flex-col items-center">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width={SIZE} height={SIZE} className="w-full max-w-[300px]">
        {/* Grid levels */}
        {LEVELS.map(l => (
          <polygon
            key={l}
            points={Array.from({ length: axes }, (_, i) => {
              const angle = (360 / axes) * i
              const [x, y] = polarToCart(angle, R * l)
              return `${x},${y}`
            }).join(' ')}
            fill="none"
            stroke="#dbe4ed"
            strokeWidth={1}
          />
        ))}

        {/* Axis lines */}
        {Array.from({ length: axes }, (_, i) => {
          const angle = (360 / axes) * i
          const [x, y] = polarToCart(angle, R)
          return <line key={i} x1={CX} y1={CY} x2={x} y2={y} stroke="#dbe4ed" strokeWidth={1} />
        })}

        {/* Data polygons */}
        <polygon
          points={statPoints(statsA, R)}
          fill={colorA}
          fillOpacity={0.25}
          stroke={colorA}
          strokeWidth={2}
        />
        <polygon
          points={statPoints(statsB, R)}
          fill={colorB}
          fillOpacity={0.25}
          stroke={colorB}
          strokeWidth={2}
        />

        {/* Stat labels */}
        {statsA.map((s, i) => {
          const angle = (360 / axes) * i
          const [x, y] = polarToCart(angle, R + 20)
          return (
            <text
              key={s.shortName}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={11}
              fontWeight={700}
              fill="#47464c"
            >
              {s.shortName}
            </text>
          )
        })}
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-2">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: colorA }} />
          <span className="text-xs font-semibold capitalize">{labelA}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: colorB }} />
          <span className="text-xs font-semibold capitalize">{labelB}</span>
        </div>
      </div>
    </div>
  )
}

export function RadarChartStatic({
  statsA, statsB, colorA, colorB,
}: {
  statsA: PokemonStat[]; statsB: PokemonStat[]; colorA: string; colorB: string
}) {
  const axes = statsA.length
  const svgSize = 260
  const cx = svgSize / 2
  const cy = svgSize / 2
  const r = 95

  function toCart(angle: number, radius: number): [number, number] {
    const rad = ((angle - 90) * Math.PI) / 180
    return [cx + radius * Math.cos(rad), cy + radius * Math.sin(rad)]
  }

  function pts(stats: PokemonStat[]): string {
    return stats
      .map((s, i) => {
        const angle = (360 / stats.length) * i
        const sr = (Math.min(s.value, STAT_MAX) / STAT_MAX) * r
        const [x, y] = toCart(angle, sr)
        return `${x},${y}`
      })
      .join(' ')
  }

  return (
    <svg viewBox={`0 0 ${svgSize} ${svgSize}`} width={svgSize} height={svgSize}>
      {LEVELS.map(l => (
        <polygon
          key={l}
          points={Array.from({ length: axes }, (_, i) => {
            const angle = (360 / axes) * i
            const [x, y] = toCart(angle, r * l)
            return `${x},${y}`
          }).join(' ')}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={1}
        />
      ))}
      {Array.from({ length: axes }, (_, i) => {
        const angle = (360 / axes) * i
        const [x, y] = toCart(angle, r)
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
      })}
      <polygon points={pts(statsA)} fill={colorA} fillOpacity={0.3} stroke={colorA} strokeWidth={2} />
      <polygon points={pts(statsB)} fill={colorB} fillOpacity={0.3} stroke={colorB} strokeWidth={2} />
      {statsA.map((s, i) => {
        const angle = (360 / axes) * i
        const [x, y] = toCart(angle, r + 18)
        return (
          <text key={s.shortName} x={x} y={y} textAnchor="middle" dominantBaseline="middle"
            fontSize={10} fontWeight={700} fill="rgba(255,255,255,0.6)">
            {s.shortName}
          </text>
        )
      })}
    </svg>
  )
}
