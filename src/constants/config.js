/**
 * Get XSRF token from cookie
 * @returns {string}
 */
function getXsrfToken () {

    const cookies = document.cookie.split(';');
    let token = '';

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].split('=');
        if (cookie[0].trim() === 'XSRF-TOKEN') {
            token = decodeURIComponent(cookie[1]);
        }
    }
    return token;
}

const config = {
    DEBUG_MODE: false,
    STAND_ALONE: process.env.NODE_ENV !== 'production', //For debugging outside of Laravel(production)
    APP_NAME: 'Epicollect5',
    API_EXTERNAL_URL: '/api',
    API_INTERNAL_URL: '/api/internal',
    PROJECT_URL: '/project',
    DATASETS_URL: '/datasets/',
    ENTRIES_URL: '/entries',
    UPLOAD_URL: '/web-upload',
    UNIQUENESS_URL: '/unique-answer',
    FILE_UPLOAD_URL: '/web-upload-file',
    TEMP_MEDIA_URL: '/temp-media',
    MEDIA_URL: '/media',
    DATA_VIEWER_URL: '/data',
    DATA_VIEWER_RESTORE: '?restore=1',

    //ESRI satellite -> https://wiki.openstreetmap.org/wiki/Esri#Legal_permissions
    ESRI_TILES_PROVIDER_SATELLITE: 'https://ibasemaps-api.arcgis.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}?token=' + process.env.REACT_APP_ESRI_API_TOKEN,
    //https://www.arcgis.com/home/item.html?id=10df2279f9684e4a9f6a7f08febac2a9
    ESRI_TILES_PROVIDER_ATTRIBUTION: 'Powered by Esri | Esri, Maxar, Earthstar Geographics, and the GIS User Community',

    OPENTOPO_TILES_PROVIDER: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    OPENTOPO_TILES_ATTRIBUTION:
        'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        'SRTM | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA)',

    //carto
    CARTO_LIGHT_TILES_PROVIDER: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
    CARTO_TILES_ATTRIBUTION: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>',

    CARTO_DARK_TILES_PROVIDER:
        'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png',

    CARTO_DARK_TILES_ATTRIBUTION:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, ' +
        '&copy; <a href="https://carto.com/attribution">CARTO</a>',

    //osm tiles
    OSM_TILES_PROVIDER: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    OSM_TILES_ATTRIBUTION: 'Map data &copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',

    JWT: '',
    FETCH_OPTIONS: {
        headers: {
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': getXsrfToken()
        },
        credentials: 'same-origin'
    },
    language: 'en',
    UPLOAD_STOPPING_ERROR_CODES: [
        'ec5_11',
        'ec5_50',
        'ec5_51',
        'ec5_54',
        'ec5_70',
        'ec5_71',
        'ec5_77',
        'ec5_78',
        'ec5_116',
        'ec5_132',
        'ec5_201',
        'ec5_202',
        'ec5_250'
    ]
};

export default config;
