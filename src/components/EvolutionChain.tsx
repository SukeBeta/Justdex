import { Link } from 'react-router-dom'
import type { EvolutionNode } from '../types/pokemon'

export default function EvolutionChain({
  root,
  currentId,
}: {
  root: EvolutionNode
  currentId: number
}) {
  const paths = collectPaths(root)

  if (paths.length === 0) return null

  if (paths.length === 1) {
    return <EvolutionPath stages={paths[0]} currentId={currentId} />
  }

  return (
    <div className="flex flex-col gap-6">
      {paths.map((path, i) => (
        <div key={i} className={i > 0 ? 'border-t border-surface-variant pt-6' : ''}>
          <EvolutionPath stages={path} currentId={currentId} />
        </div>
      ))}
    </div>
  )
}

function collectPaths(node: EvolutionNode): EvolutionNode[][] {
  if (node.evolvesTo.length === 0) {
    return [[node]]
  }

  const paths: EvolutionNode[][] = []
  for (const child of node.evolvesTo) {
    for (const subPath of collectPaths(child)) {
      paths.push([node, ...subPath])
    }
  }
  return paths
}

function EvolutionPath({ stages, currentId }: { stages: EvolutionNode[]; currentId: number }) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
      {stages.map((stage, i) => {
        const isCurrent = stage.id === currentId
        const sizeClass = isCurrent ? 'w-24 h-24 sm:w-28 sm:h-28' : 'w-18 h-18 sm:w-22 sm:h-22'

        return (
          <div key={stage.id} className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
            {i > 0 && (
              <>
                <div className="hidden sm:flex flex-col items-center text-surface-tint">
                  <span className="material-symbols-outlined text-[28px] opacity-50">arrow_forward_ios</span>
                  {stage.minLevel && (
                    <span className="font-bold text-[10px] uppercase tracking-widest mt-1 opacity-70">
                      Lvl {stage.minLevel}
                    </span>
                  )}
                </div>
                <div className="sm:hidden text-surface-tint rotate-90 my-0.5">
                  <span className="material-symbols-outlined text-[20px] opacity-50">arrow_forward_ios</span>
                </div>
              </>
            )}

            <Link to={`/pokemon/${stage.name}`} className="flex flex-col items-center gap-1.5 group">
              <div
                className={`${sizeClass} rounded-full bg-surface-container-high border-4 shadow-md flex items-center justify-center p-1.5 ${
                  isCurrent
                    ? 'border-primary-fixed ring-4 ring-primary-fixed/30'
                    : 'border-surface-container-lowest'
                }`}
              >
                <img
                  alt={stage.name}
                  src={stage.spriteUrl}
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="text-center">
                <p className="font-bold text-label-caps text-on-surface-variant opacity-70">
                  #{String(stage.id).padStart(3, '0')}
                </p>
                <p className={`font-semibold text-chip-text text-on-surface capitalize ${isCurrent ? 'font-bold' : ''}`}>
                  {stage.name}
                </p>
              </div>
            </Link>
          </div>
        )
      })}
    </div>
  )
}
