'use strict';

angular.module('justdex.services.storage', [])
    .service('StorageService', function() {
        var service = this;
        var CACHE_VERSION = 'v1.0.0'; // 缓存版本，用于在API或数据结构变更时清除旧缓存
        var DEFAULT_EXPIRATION = 24 * 60 * 60 * 1000; // 默认缓存过期时间：24小时
        
        // 检查浏览器是否支持localStorage
        service.isAvailable = function() {
            try {
                var testKey = '__test__';
                localStorage.setItem(testKey, testKey);
                localStorage.removeItem(testKey);
                return true;
            } catch(e) {
                console.warn('localStorage不可用:', e);
                return false;
            }
        };
        
        // 设置带有过期时间的数据
        service.setItem = function(key, value, expirationTime) {
            if (!service.isAvailable()) return false;
            
            var now = new Date().getTime();
            var expiration = expirationTime || DEFAULT_EXPIRATION;
            var item = {
                value: value,
                version: CACHE_VERSION,
                timestamp: now,
                expiration: now + expiration
            };
            
            try {
                localStorage.setItem(key, JSON.stringify(item));
                return true;
            } catch(e) {
                console.error('存储数据失败:', e);
                // 如果存储失败（可能是存储空间已满），尝试清除过期数据
                service.clearExpiredItems();
                try {
                    localStorage.setItem(key, JSON.stringify(item));
                    return true;
                } catch(e) {
                    console.error('即使清除过期数据后，存储仍然失败:', e);
                    return false;
                }
            }
        };
        
        // 获取数据，如果过期或版本不匹配则返回null
        service.getItem = function(key) {
            if (!service.isAvailable()) return null;
            
            try {
                var itemStr = localStorage.getItem(key);
                if (!itemStr) return null;
                
                var item = JSON.parse(itemStr);
                var now = new Date().getTime();
                
                // 检查版本和过期时间
                if (item.version !== CACHE_VERSION || now > item.expiration) {
                    localStorage.removeItem(key);
                    return null;
                }
                
                return item.value;
            } catch(e) {
                console.error('获取数据失败:', e);
                return null;
            }
        };
        
        // 移除数据
        service.removeItem = function(key) {
            if (!service.isAvailable()) return false;
            
            try {
                localStorage.removeItem(key);
                return true;
            } catch(e) {
                console.error('移除数据失败:', e);
                return false;
            }
        };
        
        // 清除所有数据
        service.clear = function() {
            if (!service.isAvailable()) return false;
            
            try {
                localStorage.clear();
                return true;
            } catch(e) {
                console.error('清除所有数据失败:', e);
                return false;
            }
        };
        
        // 清除过期数据
        service.clearExpiredItems = function() {
            if (!service.isAvailable()) return false;
            
            try {
                var now = new Date().getTime();
                for (var i = 0; i < localStorage.length; i++) {
                    var key = localStorage.key(i);
                    var itemStr = localStorage.getItem(key);
                    
                    if (itemStr) {
                        try {
                            var item = JSON.parse(itemStr);
                            // 检查是否是我们的缓存项（有version和expiration字段）
                            if (item.version && item.expiration) {
                                // 如果版本不匹配或已过期，则移除
                                if (item.version !== CACHE_VERSION || now > item.expiration) {
                                    localStorage.removeItem(key);
                                }
                            }
                        } catch(e) {
                            // 如果解析失败，跳过此项
                            continue;
                        }
                    }
                }
                return true;
            } catch(e) {
                console.error('清除过期数据失败:', e);
                return false;
            }
        };
    });
