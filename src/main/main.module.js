import {
    Util,
    DataSvc,
    DataStorage
} from './util.service';

require('./main.style.styl');

const DATA_URL = 'http://itunes.apple.com';
let RECORD_TPL = null;
const validateFields = {
    artist: 'Jack',
    limit: 4,
    errorVisible: false
}

window.onInit = function () {

}


function _setError(elm, cls) {
    if (!validateFields.errorVisible) {
        Util.toggleClass(elm, cls);
        validateFields.errorVisible = true;
    }
}
window.openNav = function () {
    document.getElementById("overlayWin").style.width = "100%";
}

window.closeNav = function () {
    document.getElementById("overlayWin").style.width = "0";
}

window.validateForm = function (form) {
    let errElm = document.getElementById('fError');

    if (form["artist"].value.trim('') === "" || form["trackno"].value === "") {
        errElm.innerHTML = 'Please enter form values';
        _setError(errElm, 'hide');
    } else if (form["artist"].value.toLowerCase() !== validateFields.artist.toLowerCase()) {
        errElm.innerHTML = `Track name is not <b>${validateFields.artist}</b>. Please enter track name as <b>${validateFields.artist}</b>.`;
        _setError(errElm, 'hide');
    } else if (form["trackno"].value != validateFields.limit) {
        errElm.innerHTML = `Track limit is not <b>${validateFields.limit}</b>. Please enter track limit to <b>${validateFields.limit}</b>.`;;
        _setError(errElm, 'hide');
    } else {
        errElm.innerHTML = `Data is loading. Please wait`;
        _setError(errElm, 'hide');
        Util.toggleClass(document.getElementById('submitbtn'), 'hide');
        let uri = `${DATA_URL}/search?term=${form["artist"].value}&limit=${form["trackno"].value}`;

        DataSvc.get(uri)
            .then(function (response) {
                return response.json();
            })
            .catch(error => console.error('Error:', error))
            .then(response => {
                DataStorage.setData(response);
                toggleDefaultWindow();
                toggleRecordWindow();
                _setRecordData(form);
                closeNav();
            });
    }
}

/***********************************/
window.toggleDefaultWindow = function () {
    Util.toggleClass(document.getElementById('default-window'), 'hide');
}

window.toggleRecordWindow = function () {
    Util.toggleClass(document.getElementById('records-container'), 'hide');
}

function _setRecordData(form) {
    let parentCon = document.querySelector('#record-content');
    if (!RECORD_TPL) {
        RECORD_TPL = document.querySelector('.record');
        parentCon.removeChild(RECORD_TPL); // now Template is removed
    }
    parentCon.innerHTML = '';

    let titleParent = document.querySelector('#records-container');
    titleParent.getElementsByClassName('track-search-for')[0].innerText = `"${form["artist"].value}"`;

    var data = DataStorage.getData().results;
    data.forEach(function (data, index) {
        addnode(parentCon, RECORD_TPL, data);
    })

}

function addnode(parentCon, childNode, data) {
    let con = childNode.cloneNode(true)

    con.getElementsByClassName('artist-name')[0].innerText = data.artistName;
    con.getElementsByClassName('track-name')[0].innerText = data.trackName;
    con.getElementsByClassName('track-desc')[0].innerText = data.shortDescription || data.longDescription;
    con.getElementsByClassName('track-img')[0].src = data.artworkUrl100 || data.artworkUrl60 || data.artworkUrl30

    con.getElementsByClassName('record-thumbnail-circle')[0].className += ` grad${Util.getRandomInt(1, 8)}`;

    parentCon.appendChild(con);
}

window.resetDefaults = function () {
    toggleDefaultWindow();
    toggleRecordWindow();
    _resetForm();
}

function _resetForm() {
    validateFields.errorVisible = false;
    document.forms['nameform']["artist"].value = '';
    document.forms['nameform']["trackno"].value = '';

    let errElm = document.getElementById('fError');
    errElm.innerHTML = ``;
    Util.toggleClass(errElm, 'hide');
    Util.toggleClass(document.getElementById('submitbtn'), 'hide');
}