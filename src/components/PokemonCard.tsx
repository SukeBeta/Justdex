import { Link } from 'react-router-dom'
import type { PokemonListItem } from '../types/pokemon'
import TypeBadge from './TypeBadge'

export default function PokemonCard({ pokemon }: { pokemon: PokemonListItem }) {
  const padId = `#${String(pokemon.id).padStart(3, '0')}`

  return (
    <Link
      to={`/pokemon/${pokemon.name}`}
      className="relative bg-surface-container-lowest rounded-2xl p-6 pt-16 shadow-card hover:shadow-card-hover transition-shadow duration-300 border border-outline-variant/30 flex flex-col items-center group cursor-pointer"
    >
      <div className="absolute top-4 left-6 text-outline font-bold text-label-caps">
        {padId}
      </div>
      <div className="w-28 h-28 mb-3 -mt-14 z-10 relative">
        <img
          alt={pokemon.name}
          src={pokemon.spriteUrl}
          className="w-full h-full object-contain drop-shadow-md group-hover:-translate-y-2 transition-transform duration-300"
          loading="lazy"
        />
      </div>
      <h2 className="text-h2 text-on-surface mb-2 text-center capitalize">
        {pokemon.name}
      </h2>
      <div className="flex gap-2 justify-center flex-wrap">
        {pokemon.types.map(t => (
          <TypeBadge key={t} type={t} />
        ))}
      </div>
    </Link>
  )
}
