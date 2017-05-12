/*
 *  本地存储封装，项目中其他地方不要直接使用localStorage和sessionStorage，统一使用封装。
 *  简化接口，字符串json转换。
 * */
export default {
    global: {
        get(key){
            return window.globalStorage ? window.globalStorage[key] : null;
        },
        set(key, jsonValue){
            window.globalStorage = window.globalStorage ? window.globalStorage : {};
            window.globalStorage[key] = jsonValue;
        },
        remove(key){
            if(window.globalStorage){
                delete  window.globalStorage[key];
            }
        }
    },
    local: {
        get(key){
            let strValue = localStorage.getItem(key);
            return JSON.parse(strValue);
        },
        set(key, jsonValue){
            var strValue = JSON.stringify(jsonValue);
            localStorage.setItem(key, strValue)
        },
        remove(key){
            localStorage.removeItem(key);
        }
    },
    // 范峻植修改,暂时修改一下后面重构framework时还原
    // session: {
    //     get(key){
    //         let strValue = sessionStorage.getItem(key);
    //         return JSON.parse(strValue);
    //     },
    //     set(key, jsonValue){
    //         var strValue = JSON.stringify(jsonValue);
    //         sessionStorage.setItem(key, strValue)
    //     },
    //     remove(key){
    //         sessionStorage.removeItem(key);
    //     },
    //     removeAll() {
    //         sessionStorage.clear();
    //     }
    // }
    session: {
        get(key){
            let strValue = localStorage.getItem(key);
            return JSON.parse(strValue);
        },
        set(key, jsonValue){
            var strValue = JSON.stringify(jsonValue);
            localStorage.setItem(key, strValue)
        },
        remove(key){
            localStorage.removeItem(key);
        },
        removeAll() {
            localStorage.clear();
        }
    }
}
