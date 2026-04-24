// Yunen He 2014 (SukeBeta)

var justdex = angular.module("justdexApp", [
	'ui.router',
	'ngMaterial',
	'pasvaz.bindonce',
	'list',
	'pokemon',
	'justdex.controllers.search'
])
	.config(function($stateProvider,$urlRouterProvider) {
		$stateProvider
			.state('justdex',{
				url:'/',
				abstract: true
			});

		$urlRouterProvider.otherwise('/list');
	});
