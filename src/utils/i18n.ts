import { useState, useEffect, useCallback } from 'react'

export type Locale = 'en' | 'ja' | 'zh-Hans' | 'ko' | 'fr' | 'de'

export const LOCALE_NAMES: Record<Locale, string> = {
  en: 'English',
  ja: '日本語',
  'zh-Hans': '中文',
  ko: '한국어',
  fr: 'Français',
  de: 'Deutsch',
}

export const POKEAPI_LANG_MAP: Record<Locale, string> = {
  en: 'en',
  ja: 'ja',
  'zh-Hans': 'zh-hans',
  ko: 'ko',
  fr: 'fr',
  de: 'de',
}

const STORAGE_KEY = 'justdex-locale'

const UI_STRINGS: Record<Locale, Record<string, string>> = {
  en: {
    search: 'Search Pokémon...',
    allTypes: 'All Types',
    allGens: 'All Generations',
    sortNumber: 'Sort: Number',
    sortName: 'Sort: A-Z',
    found: 'Pokémon found',
    loadMore: 'Load More',
    noResults: 'No Pokémon found matching your search.',
    loading: 'Loading Pokédex...',
    loadError: 'Failed to load Pokédex data',
    backToPokedex: 'Back to Pokédex',
    notFound: 'Pokémon not found',
    height: 'Height',
    weight: 'Weight',
    eggGroups: 'Egg Groups',
    baseStats: 'Base Stats',
    abilities: 'Abilities',
    evolutionChain: 'Evolution Chain',
    description: 'Description',
    primary: 'Primary',
    hidden: 'Hidden',
    teamBuilder: 'Team Builder',
    teamSubtitle: 'Build your dream team and share it',
    addPokemon: 'Add Pokémon',
    clearAll: 'Clear all',
    downloadCard: 'Download Card',
    share: 'Share',
    teamWeaknesses: 'Team Weaknesses',
    teamResistances: 'Team Resistances',
    immunities: 'Immunities',
    compare: 'Compare',
    compareSubtitle: 'Pick two Pokémon to compare stats and matchups',
    statsComparison: 'Stats Comparison',
    typeMatchup: 'Type Matchup',
    shareComparison: 'Share Comparison',
    pickFirst: 'Pick first',
    pickSecond: 'Pick second',
    choosePokemon: 'Choose Pokémon',
    searchHint: 'Type at least 2 characters',
    noSearchResults: 'No results',
    superEffective: 'Super effective',
    notVeryEffective: 'Not very effective',
    noEffect: 'No effect',
    neutralMatchup: 'Neutral matchup',
    stabMoves: "'s STAB moves vs opponent",
  },
  ja: {
    search: 'ポケモンを検索...',
    allTypes: 'すべてのタイプ',
    allGens: 'すべての世代',
    sortNumber: '並替: 番号',
    sortName: '並替: 名前',
    found: '匹のポケモン',
    loadMore: 'もっと見る',
    noResults: '一致するポケモンが見つかりません。',
    loading: 'ポケモン図鑑を読み込み中...',
    loadError: 'データの読み込みに失敗しました',
    backToPokedex: '図鑑に戻る',
    notFound: 'ポケモンが見つかりません',
    height: '高さ',
    weight: '重さ',
    eggGroups: 'タマゴグループ',
    baseStats: '種族値',
    abilities: '特性',
    evolutionChain: '進化',
    description: '説明',
    primary: '通常',
    hidden: '隠れ',
    teamBuilder: 'チームビルダー',
    teamSubtitle: 'チームを作って共有しよう',
    addPokemon: 'ポケモンを追加',
    clearAll: 'クリア',
    downloadCard: 'カードをダウンロード',
    share: '共有',
    teamWeaknesses: 'チームの弱点',
    teamResistances: 'チームの耐性',
    immunities: '無効',
    compare: '比較',
    compareSubtitle: '2匹のポケモンを比較',
    statsComparison: '種族値比較',
    typeMatchup: 'タイプ相性',
    shareComparison: '比較を共有',
    pickFirst: '1匹目を選ぶ',
    pickSecond: '2匹目を選ぶ',
    choosePokemon: 'ポケモンを選ぶ',
    searchHint: '2文字以上入力してください',
    noSearchResults: '結果なし',
    superEffective: '効果抜群',
    notVeryEffective: '効果いまひとつ',
    noEffect: '効果なし',
    neutralMatchup: '等倍',
    stabMoves: 'のタイプ一致技 vs 相手',
  },
  'zh-Hans': {
    search: '搜索宝可梦...',
    allTypes: '全部属性',
    allGens: '全部世代',
    sortNumber: '排序: 编号',
    sortName: '排序: 名称',
    found: '只宝可梦',
    loadMore: '加载更多',
    noResults: '没有找到匹配的宝可梦。',
    loading: '正在加载宝可梦图鉴...',
    loadError: '数据加载失败',
    backToPokedex: '返回图鉴',
    notFound: '未找到该宝可梦',
    height: '身高',
    weight: '体重',
    eggGroups: '蛋组',
    baseStats: '种族值',
    abilities: '特性',
    evolutionChain: '进化链',
    description: '描述',
    primary: '普通',
    hidden: '隐藏',
    teamBuilder: '队伍编辑器',
    teamSubtitle: '组建你的梦之队并分享',
    addPokemon: '添加宝可梦',
    clearAll: '清空',
    downloadCard: '下载卡片',
    share: '分享',
    teamWeaknesses: '队伍弱点',
    teamResistances: '队伍抗性',
    immunities: '免疫',
    compare: '对比',
    compareSubtitle: '选择两只宝可梦对比种族值和属性相性',
    statsComparison: '种族值对比',
    typeMatchup: '属性相性',
    shareComparison: '分享对比',
    pickFirst: '选择第一只',
    pickSecond: '选择第二只',
    choosePokemon: '选择宝可梦',
    searchHint: '请输入至少2个字符',
    noSearchResults: '无结果',
    superEffective: '效果拔群',
    notVeryEffective: '效果不佳',
    noEffect: '没有效果',
    neutralMatchup: '效果普通',
    stabMoves: '的本系技能 vs 对手',
  },
  ko: {
    search: '포켓몬 검색...',
    allTypes: '전체 타입',
    allGens: '전체 세대',
    sortNumber: '정렬: 번호',
    sortName: '정렬: 이름',
    found: '마리의 포켓몬',
    loadMore: '더 보기',
    noResults: '검색 결과가 없습니다.',
    loading: '포켓몬 도감 로딩 중...',
    loadError: '데이터 로드 실패',
    backToPokedex: '도감으로',
    notFound: '포켓몬을 찾을 수 없습니다',
    height: '키',
    weight: '몸무게',
    eggGroups: '알 그룹',
    baseStats: '종족값',
    abilities: '특성',
    evolutionChain: '진화',
    description: '설명',
    primary: '일반',
    hidden: '숨겨진',
    teamBuilder: '팀 빌더',
    teamSubtitle: '드림팀을 만들고 공유하세요',
    addPokemon: '포켓몬 추가',
    clearAll: '초기화',
    downloadCard: '카드 다운로드',
    share: '공유',
    teamWeaknesses: '팀 약점',
    teamResistances: '팀 내성',
    immunities: '면역',
    compare: '비교',
    compareSubtitle: '두 포켓몬의 능력치를 비교하세요',
    statsComparison: '종족값 비교',
    typeMatchup: '타입 상성',
    shareComparison: '비교 공유',
    pickFirst: '첫 번째 선택',
    pickSecond: '두 번째 선택',
    choosePokemon: '포켓몬 선택',
    searchHint: '2글자 이상 입력하세요',
    noSearchResults: '결과 없음',
    superEffective: '효과가 굉장',
    notVeryEffective: '효과가 별로',
    noEffect: '효과 없음',
    neutralMatchup: '보통 상성',
    stabMoves: '의 자속 기술 vs 상대',
  },
  fr: {
    search: 'Rechercher un Pokémon...',
    allTypes: 'Tous les types',
    allGens: 'Toutes les générations',
    sortNumber: 'Tri: Numéro',
    sortName: 'Tri: A-Z',
    found: 'Pokémon trouvés',
    loadMore: 'Charger plus',
    noResults: 'Aucun Pokémon trouvé.',
    loading: 'Chargement du Pokédex...',
    loadError: 'Échec du chargement',
    backToPokedex: 'Retour au Pokédex',
    notFound: 'Pokémon introuvable',
    height: 'Taille',
    weight: 'Poids',
    eggGroups: "Groupes d'Œufs",
    baseStats: 'Stats de base',
    abilities: 'Talents',
    evolutionChain: 'Chaîne d\'évolution',
    description: 'Description',
    primary: 'Principal',
    hidden: 'Caché',
    teamBuilder: 'Créateur d\'équipe',
    teamSubtitle: 'Créez votre équipe de rêve et partagez-la',
    addPokemon: 'Ajouter un Pokémon',
    clearAll: 'Tout effacer',
    downloadCard: 'Télécharger',
    share: 'Partager',
    teamWeaknesses: 'Faiblesses',
    teamResistances: 'Résistances',
    immunities: 'Immunités',
    compare: 'Comparer',
    compareSubtitle: 'Comparez les stats de deux Pokémon',
    statsComparison: 'Comparaison des stats',
    typeMatchup: 'Efficacité des types',
    shareComparison: 'Partager la comparaison',
    pickFirst: 'Choisir le premier',
    pickSecond: 'Choisir le second',
    choosePokemon: 'Choisir un Pokémon',
    searchHint: 'Tapez au moins 2 caractères',
    noSearchResults: 'Aucun résultat',
    superEffective: 'Super efficace',
    notVeryEffective: 'Pas très efficace',
    noEffect: 'Aucun effet',
    neutralMatchup: 'Matchup neutre',
    stabMoves: ' attaques STAB vs adversaire',
  },
  de: {
    search: 'Pokémon suchen...',
    allTypes: 'Alle Typen',
    allGens: 'Alle Generationen',
    sortNumber: 'Sortierung: Nummer',
    sortName: 'Sortierung: A-Z',
    found: 'Pokémon gefunden',
    loadMore: 'Mehr laden',
    noResults: 'Keine Pokémon gefunden.',
    loading: 'Pokédex wird geladen...',
    loadError: 'Daten konnten nicht geladen werden',
    backToPokedex: 'Zurück zum Pokédex',
    notFound: 'Pokémon nicht gefunden',
    height: 'Größe',
    weight: 'Gewicht',
    eggGroups: 'Ei-Gruppen',
    baseStats: 'Basiswerte',
    abilities: 'Fähigkeiten',
    evolutionChain: 'Entwicklungen',
    description: 'Beschreibung',
    primary: 'Primär',
    hidden: 'Versteckt',
    teamBuilder: 'Team-Planer',
    teamSubtitle: 'Erstelle dein Traumteam und teile es',
    addPokemon: 'Pokémon hinzufügen',
    clearAll: 'Alle löschen',
    downloadCard: 'Karte herunterladen',
    share: 'Teilen',
    teamWeaknesses: 'Team-Schwächen',
    teamResistances: 'Team-Resistenzen',
    immunities: 'Immunitäten',
    compare: 'Vergleichen',
    compareSubtitle: 'Vergleiche die Werte zweier Pokémon',
    statsComparison: 'Statuswerte-Vergleich',
    typeMatchup: 'Typ-Effektivität',
    shareComparison: 'Vergleich teilen',
    pickFirst: 'Erstes wählen',
    pickSecond: 'Zweites wählen',
    choosePokemon: 'Pokémon wählen',
    searchHint: 'Mindestens 2 Zeichen eingeben',
    noSearchResults: 'Keine Ergebnisse',
    superEffective: 'Sehr effektiv',
    notVeryEffective: 'Nicht sehr effektiv',
    noEffect: 'Keine Wirkung',
    neutralMatchup: 'Neutral',
    stabMoves: ' STAB-Attacken vs Gegner',
  },
}

export function useLocale() {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null
    if (saved && saved in LOCALE_NAMES) return saved
    const browserLang = navigator.language
    if (browserLang.startsWith('ja')) return 'ja'
    if (browserLang.startsWith('zh')) return 'zh-Hans'
    if (browserLang.startsWith('ko')) return 'ko'
    if (browserLang.startsWith('fr')) return 'fr'
    if (browserLang.startsWith('de')) return 'de'
    return 'en'
  })

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l)
    localStorage.setItem(STORAGE_KEY, l)
  }, [])

  return { locale, setLocale }
}

export function t(locale: Locale, key: string): string {
  return UI_STRINGS[locale]?.[key] ?? UI_STRINGS.en[key] ?? key
}

let _pokemonNames: Record<string, Record<string, string>> | null = null
let _loadingPromise: Promise<void> | null = null

export async function loadPokemonNames(): Promise<Record<string, Record<string, string>>> {
  if (_pokemonNames) return _pokemonNames

  if (!_loadingPromise) {
    _loadingPromise = fetch(`${import.meta.env.BASE_URL}data/pokemon-names.json`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(data => { _pokemonNames = data })
      .catch(() => { _pokemonNames = {} })
  }

  await _loadingPromise
  return _pokemonNames!
}

export function usePokemonNames() {
  const [names, setNames] = useState<Record<string, Record<string, string>>>({})

  useEffect(() => {
    loadPokemonNames().then(setNames)
  }, [])

  return names
}

export function getPokemonName(
  names: Record<string, Record<string, string>>,
  englishName: string,
  locale: Locale,
): string {
  if (locale === 'en') return englishName
  return names[englishName]?.[POKEAPI_LANG_MAP[locale]] ?? englishName
}
