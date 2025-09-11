'use strict';

angular.module('justdex.models.pokemon', ['justdex.services.storage'])
    .service('PokemonModel', function ($http, StorageService){
        var model = this;

        // 定义缓存键
        var POKEMON_GROUP_KEY = 'justdex_pokemon_group';
        var EVOLUTION_GROUP_KEY = 'justdex_evolution_group';
        var POKEMON_DETAILS_KEY_PREFIX = 'justdex_pokemon_detail_';
        var POKEMON_TYPES_KEY = 'justdex_pokemon_types';
        
        // 缓存过期时间设置
        var ONE_DAY = 24 * 60 * 60 * 1000; // 24小时
        var ONE_WEEK = 7 * ONE_DAY;        // 一周
        
        // 初始化本地数据
        model.localPokemonGroup = null;
        model.localEvolutionData = null;
        model.pokemonTypes = null;
        
        // 清除过期缓存
        StorageService.clearExpiredItems();
        
        // 获取宝可梦列表数据
        function loadPokemonGroup() {
            // 尝试从缓存获取
            var cachedData = StorageService.getItem(POKEMON_GROUP_KEY);
            
            if (cachedData) {
                model.localPokemonGroup = cachedData;
                return Promise.resolve(cachedData);
            } else {
                // 如果缓存中没有，从服务器获取
                return $http.get('data/data.json').then(function (result) {
                    model.localPokemonGroup = result.data;
                    // 缓存数据，设置一周过期
                    StorageService.setItem(POKEMON_GROUP_KEY, result.data, ONE_WEEK);
                    return result.data;
                });
            }
        }
        
        // 获取进化链数据
        function loadEvolutionData() {
            // 尝试从缓存获取
            var cachedData = StorageService.getItem(EVOLUTION_GROUP_KEY);
            
            if (cachedData) {
                model.localEvolutionData = cachedData;
                return Promise.resolve(cachedData);
            } else {
                // 如果缓存中没有，从服务器获取
                return $http.get('data/evolution_group_data.json').then(function (result) {
                    model.localEvolutionData = result.data;
                    // 缓存数据，设置一周过期
                    StorageService.setItem(EVOLUTION_GROUP_KEY, result.data, ONE_WEEK);
                    return result.data;
                });
            }
        }
        
        // 初始化数据
        loadPokemonGroup();
        loadEvolutionData();

        // 获取宝可梦详情（根据名称）
        model.getPokemonDetailByName = function (pokemonName){
            // 转换为小写
            var pokemonName = pokemonName.toLowerCase();
            
            // 首先检查是否有本地数据
            if (!model.localPokemonGroup) {
                return loadPokemonGroup().then(function() {
                    return fetchPokemonDetailByName(pokemonName);
                });
            } else {
                return fetchPokemonDetailByName(pokemonName);
            }
        };
        
        // 内部方法：根据名称获取宝可梦详情
        function fetchPokemonDetailByName(pokemonName) {
            var id;
            
            // 从本地数据中获取ID
            _.find(model.localPokemonGroup, function (item) {
                if (item.name === pokemonName) {
                    id = item.id;
                }
            });
            
            if (!id) return Promise.resolve(null);
            
            // 使用ID获取详细信息
            return model.getPokemonDetailById(id);
        }

        // 获取宝可梦详情（根据ID）
        model.getPokemonDetailById = function (pokemonId){
            if (!pokemonId) return Promise.resolve(null);
            
            // 检查缓存
            var cacheKey = POKEMON_DETAILS_KEY_PREFIX + pokemonId;
            var cachedData = StorageService.getItem(cacheKey);
            
            if (cachedData) {
                // 如果有缓存，直接返回
                return Promise.resolve(cachedData);
            } else {
                // 如果没有缓存，从API获取
                return $http.get('https://pokeapi.co/api/v2/pokemon/' + pokemonId)
                    .then(function (result) {
                        // 格式化数据
                        var formattedData = model.formatPokemonData(result.data);
                        // 缓存数据，设置一天过期
                        StorageService.setItem(cacheKey, formattedData, ONE_DAY);
                        return formattedData;
                    })
                    .catch(function(error) {
                        console.error('获取宝可梦详情失败:', error);
                        return null;
                    });
            }
        };

        // get name
        model.getPokemonName = function (pokemon){
            return pokemon.name;
        };

        // get string id
        model.getPokemonId = function (pokemon){
            var id = pokemon.pkdx_id;

            if (id < 10){
                id = '00' + id;
            } else if (id < 100) {
                id = '0' + id
            }

            return id;
        };

        // get avatar
        model.getPokemonAvatar = function (pokemon){
            // path
            var avatarFilePath = 'assets/images/icons-pixel/';
            var avatar = pokemon.pkdx_id;

            if (avatar < 10){
                avatar = '00' + avatar;
            } else if (avatar < 100) {
                avatar = '0' + avatar
            }

            return avatarFilePath + avatar + 'e.png';
        };

        // get types
        model.getPokemonTypes = function (pokemon){
            return pokemon.types;
        };


        // get height
        model.getPokemonHeight = function (pokemon){
            return pokemon.height;
        };

        // get weight
        model.getPokemonWeight = function (pokemon){
            return pokemon.weight;
        };

        // get abilities
        model.getPokemonAbilities = function (pokemon){
            return pokemon.abilities;
        };

        // get egg groups
        model.getPokemonEggGroups = function (pokemon){
            return pokemon.egg_groups;
        };

        // 获取宝可梦进化组
        model.getPokemonEvolutionGroup = function (pokemon) {
            // 首先检查是否有本地进化数据
            if (!model.localEvolutionData) {
                return loadEvolutionData().then(function() {
                    return getEvolutionGroupFromLocal(pokemon);
                });
            } else {
                return Promise.resolve(getEvolutionGroupFromLocal(pokemon));
            }
        };
        
        // 从本地数据获取进化组
        function getEvolutionGroupFromLocal(pokemon) {
            if (!pokemon || !pokemon.pkdx_id) return [];
            
            var group = model.localEvolutionData ? model.localEvolutionData[parseInt(pokemon.pkdx_id)-1] : null;
            return group || [];
        }
        
        // 获取宝可梦的进化链
        model.getEvolutionChain = function(pokemonId) {
            if (!pokemonId) return Promise.resolve([]);
            
            // 检查缓存
            var cacheKey = 'justdex_evolution_chain_' + pokemonId;
            var cachedData = StorageService.getItem(cacheKey);
            
            if (cachedData) {
                // 如果有缓存，直接返回
                return Promise.resolve(cachedData);
            } else {
                // 如果没有缓存，从API获取
                return $http.get('https://pokeapi.co/api/v2/pokemon-species/' + pokemonId)
                    .then(function(speciesResult) {
                        var evolutionChainUrl = speciesResult.data.evolution_chain.url;
                        return $http.get(evolutionChainUrl);
                    })
                    .then(function(evolutionResult) {
                        // 解析进化链数据
                        var chain = evolutionResult.data.chain;
                        var evolutionIds = [];
                        
                        // 递归函数来提取进化链中的所有宝可梦ID
                        function extractEvolutionIds(chain) {
                            // 从URL中提取ID
                            var urlParts = chain.species.url.split('/');
                            var id = parseInt(urlParts[urlParts.length - 2]);
                            evolutionIds.push(id);
                            
                            // 处理进化形态
                            if (chain.evolves_to && chain.evolves_to.length > 0) {
                                chain.evolves_to.forEach(function(evolution) {
                                    extractEvolutionIds(evolution);
                                });
                            }
                        }
                        
                        extractEvolutionIds(chain);
                        
                        // 缓存数据，设置一周过期
                        StorageService.setItem(cacheKey, evolutionIds, ONE_WEEK);
                        return evolutionIds;
                    })
                    .catch(function(error) {
                        console.error('获取进化链失败:', error);
                        return [];
                    });
            }
        };

        // ============================================================
        //                       basic stats
        // ============================================================
        // get hp
        model.getPokemonHp = function (pokemon){
            return pokemon.hp;
        };

        // get attack
        model.getPokemonAttack = function (pokemon){
            return pokemon.attack;
        };

        // get defense
        model.getPokemonDefense = function (pokemon){
            return pokemon.defense;
        };

        // get special attack
        model.getPokemonSpAtk = function (pokemon){
            return pokemon.sp_atk;
        };

        // get special defense
        model.getPokemonSpDef = function (pokemon){
            return pokemon.sp_def;
        };

        // get speed
        model.getPokemonSpeed = function (pokemon){
            return pokemon.speed;
        };

        // get total
        model.getPokemonTotal = function (pokemon){
            return pokemon.total;
        };

        // get egg cycles
        model.getPokemonEggCycles = function (pokemon){
            return pokemon.egg_cycles || 0;
        };
        
        // Format Pokemon data from v2 API to match our app's structure
        model.formatPokemonData = function(pokemonData) {
            // Create a formatted pokemon object that matches our app's structure
            var formattedPokemon = {
                name: pokemonData.name,
                pkdx_id: pokemonData.id,
                height: pokemonData.height / 10, // Convert to meters
                weight: pokemonData.weight / 10, // Convert to kg
                abilities: [],
                types: [],
                egg_groups: [],
                egg_cycles: 0,
                hp: 0,
                attack: 0,
                defense: 0,
                sp_atk: 0,
                sp_def: 0,
                speed: 0,
                total: 0
            };
            
            // Extract abilities
            if (pokemonData.abilities) {
                formattedPokemon.abilities = pokemonData.abilities.map(function(ability) {
                    return ability.ability.name;
                });
            }
            
            // Extract types
            if (pokemonData.types) {
                formattedPokemon.types = pokemonData.types.map(function(type) {
                    return type.type.name;
                });
            }
            
            // Extract stats
            if (pokemonData.stats) {
                pokemonData.stats.forEach(function(stat) {
                    switch(stat.stat.name) {
                        case 'hp':
                            formattedPokemon.hp = stat.base_stat;
                            break;
                        case 'attack':
                            formattedPokemon.attack = stat.base_stat;
                            break;
                        case 'defense':
                            formattedPokemon.defense = stat.base_stat;
                            break;
                        case 'special-attack':
                            formattedPokemon.sp_atk = stat.base_stat;
                            break;
                        case 'special-defense':
                            formattedPokemon.sp_def = stat.base_stat;
                            break;
                        case 'speed':
                            formattedPokemon.speed = stat.base_stat;
                            break;
                    }
                });
                
                // Calculate total
                formattedPokemon.total = formattedPokemon.hp + 
                                        formattedPokemon.attack + 
                                        formattedPokemon.defense + 
                                        formattedPokemon.sp_atk + 
                                        formattedPokemon.sp_def + 
                                        formattedPokemon.speed;
            }
            
            // We need to make an additional API call to get egg groups
            // This will be handled separately if needed
            
            return formattedPokemon;
        };

        // ============================================================
        //                       evolution
        // ============================================================
        model.getEvolutionPokemon = function (pokemon){
            //var pokemonIdGroup = model.getPokemonEvolutionGroup(pokemon);
            //var pokemons = [];
            //
            //console.log(pokemonIdGroup);
            //var i = 0;
            //function getPokemon(){
            //    model.getPokemonDetailById(pokemonIdGroup[i]).then(function(result){
            //        console.log(i, result);
            //        pokemons.push(result);
            //        i++;
            //
            //        if (i <pokemonIdGroup.length) {
            //            getPokemon();
            //        }
            //    });
            //}
            //getPokemon();
            //
            //console.log('Finished ');
            //return pokemons;
        };
    });
