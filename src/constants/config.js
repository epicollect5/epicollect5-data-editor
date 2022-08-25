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


    //high contrast maps http://maps.stamen.com
    STAMEN_HIGH_CONTRAST_TILES_PROVIDER: 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.png',
    STAMEN_TILES_ATTRIBUTION: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',

    //MAPBOX outdoors tiles
    MAPBOX_OUTDOORS_TILES_PROVIDER: 'https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/tiles/{z}/{x}/{y}?access_token=' + process.env.REACT_APP_MAPBOX_API_TOKEN,
    //Mapbox satellite imagery
    MAPBOX_TILES_PROVIDER_SATELLITE: 'https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=' + process.env.REACT_APP_MAPBOX_API_TOKEN,
    MAPBOX_TILES_ATTRIBUTION: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',

    //carto
    CARTO_LIGHT_TILES_PROVIDER: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
    CARTO_TILES_ATTRIBUTION: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>',

    //osm tiles
    OSM_TILES_PROVIDER: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    OSM_TILES_ATTRIBUTION: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',

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
