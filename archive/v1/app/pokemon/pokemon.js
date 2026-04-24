'use strict';

angular.module('pokemon', [
    'justdex.models.pokemon'
])
    .config(function ($stateProvider){
        $stateProvider
            .state('justdex.pokemon', {
                url: 'pokemon/:pokemon',
                views: {
                    'pokemon@': {
                        templateUrl: 'app/pokemon/pokemon.tmpl.html',
                        controller: 'PokemonController as PokemonCtrl'
                    }
                }
            })
    })

    .controller('PokemonController', function ($state, $stateParams, PokemonModel){
        var PokemonCtrl = this;
        PokemonCtrl.getPokemonDetailByName = PokemonModel.getPokemonDetailByName;
        PokemonCtrl.getPokemonDetailById = PokemonModel.getPokemonDetailById;

        // read pokemon detail who from url params
        PokemonCtrl.getPokemonDetailByName($stateParams.pokemon).then(function (result){
            // check data is successfully fetched;
            PokemonCtrl.pokemon = result;
            var pokemon = PokemonCtrl.pokemon;

            if (PokemonCtrl.pokemon === null){
                $state.go('justdex.list', {});
            } else {
                // ============================================================
                //                     pokemon query method
                // ============================================================
                PokemonCtrl.getPokemonName = PokemonModel.getPokemonName;
                PokemonCtrl.getPokemonId = PokemonModel.getPokemonId;
                PokemonCtrl.getPokemonAvatar = PokemonModel.getPokemonAvatar;
                PokemonCtrl.getPokemonHeight = PokemonModel.getPokemonHeight;
                PokemonCtrl.getPokemonWeight = PokemonModel.getPokemonWeight;
                PokemonCtrl.getPokemonAbilities = PokemonModel.getPokemonAbilities;
                PokemonCtrl.getPokemonEggGroups = PokemonModel.getPokemonEggGroups;
                PokemonCtrl.getPokemonEggCycles = PokemonModel.getPokemonEggCycles;
                PokemonCtrl.getPokemonTypes = PokemonModel.getPokemonTypes;
                PokemonCtrl.getPokemonEvolutionGroup = PokemonModel.getPokemonEvolutionGroup;

                // basic stats
                PokemonCtrl.getPokemonAttack = PokemonModel.getPokemonAttack;
                PokemonCtrl.getPokemonHp = PokemonModel.getPokemonHp;
                PokemonCtrl.getPokemonDefense = PokemonModel.getPokemonDefense;
                PokemonCtrl.getPokemonSpAtk = PokemonModel.getPokemonSpAtk;
                PokemonCtrl.getPokemonSpDef = PokemonModel.getPokemonSpDef;
                PokemonCtrl.getPokemonSpeed = PokemonModel.getPokemonSpeed;
                PokemonCtrl.getPokemonTotal = PokemonModel.getPokemonTotal;

                // ============================================================
                //                     get pokemon detail
                // ============================================================

                // get basic
                PokemonCtrl.pokemonName = PokemonCtrl.getPokemonName(pokemon);
                PokemonCtrl.pokemonId = PokemonCtrl.getPokemonId(pokemon);
                PokemonCtrl.pokemonAvatar = PokemonCtrl.getPokemonAvatar(pokemon);
                PokemonCtrl.pokemonHeight = PokemonCtrl.getPokemonHeight(pokemon);
                PokemonCtrl.pokemonWeight = PokemonCtrl.getPokemonWeight(pokemon);
                PokemonCtrl.pokemonAbilities = PokemonCtrl.getPokemonAbilities(pokemon);
                PokemonCtrl.pokemonEggGroups= PokemonCtrl.getPokemonEggGroups(pokemon);
                PokemonCtrl.pokemonEggCycles = PokemonCtrl.getPokemonEggCycles(pokemon);
                PokemonCtrl.pokemonTypes = PokemonCtrl.getPokemonTypes(pokemon);

                // get basic stats
                PokemonCtrl.pokemonAttack  = PokemonCtrl.getPokemonAttack(pokemon);
                PokemonCtrl.pokemonHp = PokemonCtrl.getPokemonHp(pokemon);
                PokemonCtrl.pokemonDefense = PokemonCtrl.getPokemonDefense(pokemon);
                PokemonCtrl.pokemonSpAtk = PokemonCtrl.getPokemonSpAtk(pokemon);
                PokemonCtrl.pokemonSpDef= PokemonCtrl.getPokemonSpDef(pokemon);
                PokemonCtrl.pokemonSpeed = PokemonCtrl.getPokemonSpeed(pokemon);
                PokemonCtrl.pokemonTotal = PokemonCtrl.getPokemonTotal(pokemon);

                // draw Chart
                PokemonCtrl.drawChart = function (basic, total){
                    var percentage,
                        basic = parseInt(basic),
                        total = parseInt(total),
                        color = 'darkred',
                        isHigherThanNormal = false;

                    if (basic > total) {
                        percentage = 100;
                        isHigherThanNormal = true;
                    } else {
                        percentage = Math.round((basic/total)*100);
                    }

                    // sett color
                    if (percentage <= 10) {
                        color = '#028AA0';
                    } else if (percentage <= 25) {
                        color = '#01a0ba';
                    } else if (percentage <= 50) {
                        color = '#00B9D4';
                    } else if (percentage <= 75) {
                        color = '#00d1f0';
                    } else if (percentage <= 100) {
                        color = '#28e4ff';
                        if (isHigherThanNormal) {
                            color = '#6aecff';
                        }
                    }

                    return {percentage: percentage, color: color};
                };

                PokemonCtrl.drawChartHp = PokemonCtrl.drawChart(PokemonCtrl.pokemonHp, 200);
                PokemonCtrl.drawChartAttack = PokemonCtrl.drawChart(PokemonCtrl.pokemonAttack, 180);
                PokemonCtrl.drawChartDefense = PokemonCtrl.drawChart(PokemonCtrl.pokemonDefense, 180);
                PokemonCtrl.drawChartSpAtk = PokemonCtrl.drawChart(PokemonCtrl.pokemonSpAtk, 180);
                PokemonCtrl.drawChartSpDef = PokemonCtrl.drawChart(PokemonCtrl.pokemonSpDef, 180);
                PokemonCtrl.drawChartSpeed = PokemonCtrl.drawChart(PokemonCtrl.pokemonSpeed, 180);

                // Test: color
                //PokemonCtrl.drawChartHp = PokemonCtrl.drawChart(20, 200);
                //PokemonCtrl.drawChartAttack = PokemonCtrl.drawChart(40, 180);
                //PokemonCtrl.drawChartDefense = PokemonCtrl.drawChart(90, 180);
                //PokemonCtrl.drawChartSpAtk = PokemonCtrl.drawChart(135, 180);
                //PokemonCtrl.drawChartSpDef = PokemonCtrl.drawChart(180, 180);
                //PokemonCtrl.drawChartSpeed = PokemonCtrl.drawChart(200, 180);

                // ============================================================
                //                     Evolution chain
                // ============================================================
                // 获取宝可梦的进化链
                PokemonCtrl.pokemonEvolutionChain = PokemonCtrl.getPokemonEvolutionGroup(pokemon);
                PokemonCtrl.pokemonEvolutionGroup = [];
                
                // 如果本地数据中有进化链，使用本地数据
                if (PokemonCtrl.pokemonEvolutionChain && PokemonCtrl.pokemonEvolutionChain.length > 0) {
                    // 插入进化链中的宝可梦到组中
                    var i = 0, len = PokemonCtrl.pokemonEvolutionChain.length;
                    for (; i < len; i++){
                        PokemonCtrl.getPokemonDetailById(PokemonCtrl.pokemonEvolutionChain[i])
                            .then(function (result){
                                if (result){
                                    for (var i = 0; i < PokemonCtrl.pokemonEvolutionChain.length; i++) {
                                        if (PokemonCtrl.pokemonEvolutionChain[i] == result.pkdx_id) {
                                            PokemonCtrl.pokemonEvolutionGroup[i] = result;
                                            return true;
                                        }
                                    }
                                }
                            });
                    }
                } else {
                    // 如果本地数据中没有进化链，从API获取
                    PokemonModel.getEvolutionChain(pokemon.pkdx_id).then(function(evolutionIds) {
                        PokemonCtrl.pokemonEvolutionChain = evolutionIds;
                        
                        // 获取进化链中每个宝可梦的详细信息
                        evolutionIds.forEach(function(id, index) {
                            PokemonCtrl.getPokemonDetailById(id)
                                .then(function(result) {
                                    if (result) {
                                        PokemonCtrl.pokemonEvolutionGroup[index] = result;
                                    }
                                });
                        });
                    });
                }

                // filter null array item when ng repeat
                PokemonCtrl.exist = function (item){
                    if (item !== null && item !== undefined) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        });


    });