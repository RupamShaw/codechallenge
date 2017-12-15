/* eslint-env jquery*/

$(() => {

    $.get('/api/v1/people', people => {
        const mautocomp = document.getElementById('mauto');
        mautocomp.setAttribute('src', JSON.stringify(people));
    });

});
