let Util = {
    data: null,
    toggleClass: function (elem, className) {
        if (elem)
            elem.classList.toggle(className);
    },
    getRandomInt: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
let DataSvc = {
    data: null,
    get(url) {
        return fetch(url, {
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, same-origin, *omit
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            redirect: 'follow', // manual, *follow, error
            referrer: 'no-referrer', // *client, no-referrer
        });
    }
}
let DataStorage = {
    data: null,
    setData(data) {
        this.data = data;
    },
    getData() {
        return this.data;
    }
}
export {
    Util,
    DataSvc,
    DataStorage

};