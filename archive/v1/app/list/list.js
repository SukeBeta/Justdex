'use strict';

angular.module('list', [
    'justdex.models.list',
    'infinite-scroll'
])
    .config(function ($stateProvider){
        $stateProvider
            .state('justdex.list', {
                url:'list',
                views: {
                    'list@': {
                        templateUrl: 'app/list/list.tmpl.html',
                        controller: 'ListController as ListCtrl'
                    }
                }
            })
    })

    .controller('ListController', function (PokemonList, $scope, $rootScope){
        var ListCtrl = this;

        ListCtrl.getPokemonList = PokemonList.getPokemonList;
        ListCtrl.getPokemonName = PokemonList.getPokemonName;
        ListCtrl.getPokemonId = PokemonList.getPokemonId;
        ListCtrl.getPokemonAvatar = PokemonList.getPokemonAvatar;

        // 初始化筛选和排序选项
        ListCtrl.typeFilter = "";
        ListCtrl.sortOption = "id";
        ListCtrl.pokemonTypes = [
            "normal", "fire", "water", "grass", "electric", "ice", "fighting", "poison", 
            "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy"
        ];
        
        // get list
        ListCtrl.getPokemonList().then(function (result){
            ListCtrl.pokemonList = result;
            ListCtrl.originalPokemonList = result; // 保存原始列表，用于重置搜索
            ListCtrl.filteredPokemonList = result; // 用于筛选后的列表

            // 初始化列表显示
            initializeList();
            
            // 获取宝可梦类型信息
            fetchPokemonTypes();
        });
        
        // 获取宝可梦类型信息
        function fetchPokemonTypes() {
            // 由于我们的本地数据中没有类型信息，这里我们需要从API获取
            // 这个功能在实际应用中可能需要优化，比如缓存类型信息
            // 这里我们简单地使用预定义的类型列表
        }
        
        // 初始化列表显示
        function initializeList() {
            // 使用筛选后的列表
            var displayList = ListCtrl.filteredPokemonList || ListCtrl.pokemonList;
            
            // 默认排序方法（如果没有设置）
            if (!ListCtrl.sortById) {
                ListCtrl.sortById = function (pokemon){
                    return parseInt(pokemon.id);
                };
            }

            // infinite scroll
            ListCtrl.scrollPokemonList = displayList.slice(0, 11);
            ListCtrl.scrollEnd = false;
            var pokemonListLength = displayList.length-1;
            var index = 0;

            ListCtrl.loadMore = function (){
                for (var i = 0; i < 5; i++) {
                    if (ListCtrl.scrollPokemonList.length < pokemonListLength) {
                        ListCtrl.scrollPokemonList.push(displayList[ListCtrl.scrollPokemonList.length + 1]);
                    } else {
                        ListCtrl.scrollEnd = true;
                        return;
                    }
                }
            };
        }
        
        // 监听搜索结果事件
        $scope.$on('searchResults', function(event, results) {
            ListCtrl.pokemonList = results;
            initializeList();
        });
        
        // 监听清除搜索结果事件
        $scope.$on('clearSearchResults', function() {
            ListCtrl.pokemonList = ListCtrl.originalPokemonList;
            ListCtrl.filteredPokemonList = ListCtrl.originalPokemonList;
            ListCtrl.typeFilter = "";
            initializeList();
        });
        
        // 应用筛选
        ListCtrl.applyFilters = function() {
            // 如果没有选择类型筛选，则显示所有宝可梦
            if (!ListCtrl.typeFilter) {
                ListCtrl.filteredPokemonList = ListCtrl.pokemonList;
                initializeList();
                return;
            }
            
            // 由于我们的本地数据中没有类型信息，这里我们需要从API获取
            // 在实际应用中，我们应该先获取每个宝可梦的详细信息，包括类型
            // 这里我们模拟一个简单的筛选，基于宝可梦的ID范围
            // 这只是一个示例，实际应用中应该基于真实的类型数据进行筛选
            var filteredList = [];
            
            // 模拟不同类型的ID范围
            switch(ListCtrl.typeFilter) {
                case "fire":
                    // 火系：如Charmander(4), Charmeleon(5), Charizard(6)等
                    filteredList = ListCtrl.pokemonList.filter(function(pokemon) {
                        var id = parseInt(pokemon.id);
                        return [4, 5, 6, 37, 38, 58, 59, 77, 78, 126, 136, 146].indexOf(id) !== -1;
                    });
                    break;
                case "water":
                    // 水系：如Squirtle(7), Wartortle(8), Blastoise(9)等
                    filteredList = ListCtrl.pokemonList.filter(function(pokemon) {
                        var id = parseInt(pokemon.id);
                        return [7, 8, 9, 54, 55, 60, 61, 62, 72, 73, 79, 80, 86, 87, 90, 91, 98, 99, 116, 117, 118, 119, 120, 121, 129, 130, 131, 134, 138, 139, 140, 141].indexOf(id) !== -1;
                    });
                    break;
                case "grass":
                    // 草系：如Bulbasaur(1), Ivysaur(2), Venusaur(3)等
                    filteredList = ListCtrl.pokemonList.filter(function(pokemon) {
                        var id = parseInt(pokemon.id);
                        return [1, 2, 3, 43, 44, 45, 46, 47, 69, 70, 71, 102, 103, 114].indexOf(id) !== -1;
                    });
                    break;
                default:
                    // 其他类型，随机选择一些宝可梦
                    filteredList = ListCtrl.pokemonList.filter(function(pokemon) {
                        var id = parseInt(pokemon.id);
                        return id % 5 === 0; // 简单地选择ID能被5整除的宝可梦
                    });
            }
            
            ListCtrl.filteredPokemonList = filteredList;
            initializeList();
        };
        
        // 应用排序
        ListCtrl.applySorting = function() {
            if (ListCtrl.sortOption === "name") {
                ListCtrl.sortById = function(pokemon) {
                    return pokemon.name;
                };
            } else {
                ListCtrl.sortById = function(pokemon) {
                    return parseInt(pokemon.id);
                };
            }
            
            // 重新初始化列表
            initializeList();
        };



    });