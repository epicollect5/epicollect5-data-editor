import React from 'react';


// From http://goo.gl/htCroU
const decodeHtml = function (html) {
    var txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
};

const EC5Readme = ({ answer, onInputChange, input }) => (

    <div>
        <span dangerouslySetInnerHTML={{ __html: decodeHtml(input.question) }}></span>
    </div>

);

EC5Readme.propTypes = {
    answer: React.PropTypes.string,
    onInputChange: React.PropTypes.func,
    input: React.PropTypes.object
};

export default EC5Readme;
