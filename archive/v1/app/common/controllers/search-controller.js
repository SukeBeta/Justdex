'use strict';

angular.module('justdex.controllers.search', [])
    .controller('SearchController', function($scope, $state, PokemonList) {
        // 初始化搜索查询
        $scope.searchQuery = '';
        
        // 搜索宝可梦
        $scope.searchPokemon = function() {
            if (!$scope.searchQuery || $scope.searchQuery.trim() === '') {
                return;
            }
            
            // 获取宝可梦列表并过滤
            PokemonList.getPokemonList().then(function(pokemonList) {
                var query = $scope.searchQuery.toLowerCase();
                var results = pokemonList.filter(function(pokemon) {
                    return pokemon.name.toLowerCase().indexOf(query) !== -1 || 
                           pokemon.id.toString().indexOf(query) !== -1;
                });
                
                // 如果只找到一个结果，直接导航到该宝可梦的详情页
                if (results.length === 1) {
                    $state.go('justdex.pokemon', { pokemon: results[0].name });
                } else if (results.length > 1) {
                    // 如果找到多个结果，可以在这里实现显示搜索结果列表的逻辑
                    // 这里我们简单地将搜索结果存储在$scope中，以便在列表视图中使用
                    $scope.searchResults = results;
                    $scope.$broadcast('searchResults', results);
                    $state.go('justdex.list', {});
                }
            });
        };
        
        // 清除搜索
        $scope.clearSearch = function() {
            $scope.searchQuery = '';
            $scope.searchResults = null;
            $scope.$broadcast('clearSearchResults');
        };
    });
