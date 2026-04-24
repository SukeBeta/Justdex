'use strict';

angular.module('justdex.models.list', ['justdex.services.storage'])
    .service('PokemonList', function ($http, StorageService){
        var model = this;

        // 缓存键和过期时间
        var POKEMON_LIST_CACHE_KEY = 'justdex_pokemon_list';
        var ONE_WEEK = 7 * 24 * 60 * 60 * 1000; // 一周
        
        // 获取宝可梦列表
        model.getPokemonList = function (){
            // 检查缓存
            var cachedData = StorageService.getItem(POKEMON_LIST_CACHE_KEY);
            
            if (cachedData) {
                // 如果有缓存，直接返回
                return Promise.resolve(cachedData);
            } else {
                // 如果没有缓存，从服务器获取
                return $http.get('data/data.json')
                    .then(function (result){
                        // 缓存数据，设置一周过期
                        StorageService.setItem(POKEMON_LIST_CACHE_KEY, result.data, ONE_WEEK);
                        return result.data;
                    })
                    .catch(function(error) {
                        console.error('获取宝可梦列表失败:', error);
                        return [];
                    });
            }
        };

        // return pokemon name
        model.getPokemonName = function (pokemon){
            return pokemon.name;
        };

        // return pokemon id
        model.getPokemonId = function (pokemon){
            var idSource = pokemon.id, id;

            if (idSource < 10) {
                id = '00' + idSource;
            } else if (idSource < 100) {
                id = '0' + idSource;
            } else {
                return '#'+idSource;
            }
            return '#'+id;
        };

        // return pokemon avatar file name via file name same with pokemon id
        model.getPokemonAvatar = function (pokemon){
            // path
            var avatarFilePath = 'assets/images/icons-pixel/';
            var avatar = pokemon.id;

            if (avatar < 10) {
                avatar = '00' + avatar;
            } else if (avatar < 100) {
                avatar = '0' + avatar;
            }

            return avatarFilePath + avatar + 'e.png';
        };
    });