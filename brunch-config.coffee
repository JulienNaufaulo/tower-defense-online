module.exports = config:
    files:
        javascripts: joinTo:
            'js/libraries.js': /^bower_components/
            'js/app.js': /^app/
        stylesheets: joinTo: 'css/app.css'
        templates: joinTo: 'js/app.js'
    server:
        run: yes