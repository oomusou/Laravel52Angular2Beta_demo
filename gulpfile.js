var elixir = require('laravel-elixir');
var elixirTypscript = require('elixir-typescript');

elixir(function (mix) {
    mix.sass('app.scss');

    mix.copy('node_modules/angular2', 'public/angular2')
        .copy('node_modules/rxjs', 'public/rxjs')
        .copy('node_modules/systemjs', 'public/systemjs')
        .copy('node_modules/es6-promise', 'public/es6-promise')
        .copy('node_modules/es6-shim', 'public/es6-shim')
        .copy('node_modules/zone.js', 'public/zone.js');

    mix.typescript([
            'app.component.ts',
            'main.ts'
        ],
        'public/'
    );

    mix.browserSync({
        files: ['app/**/*', 'public/**/*', 'resources/views/**/*'],
        port: 5000,
        proxy: 'localhost:8000'
    });
});
