# Single-Page-App Angular Boilerplate

**This project is under development! It is not ready for use**

## High-level features

- Immediately start hacking with AngularJS and a NodeJS backend
- Grunt build process will concatenate and minify all of your code, including HTML templates and stylesheets
- Just add JavaScript files to your project. They'll be automatically detected and loaded in the right order. Why should you have to add a `<script>` tag? 
- Includes HTML5 Boilerplate

## How to use

Download the source of this project, and run `npm install` to install dependencies.

To run a server for local development, run `node dev`. If you need to test on a browser that's not compatible with client-side LESS compilation (that would be <IE9, for example), use the `--less` parameter (`node dev --less`).

## Why not Yeoman?

[Yeoman Angular Generator](https://github.com/yeoman/generator-angular) is a similar project which is definitely more mature at this time. Here are some reasons why SPA-Angular fits my personal workflow better:

- Yeoman doesn't really have the concept of a backend, as far as I can tell
- Personal preference: I use LESS, Yeoman uses Sass
- SPA-Angular does more concatenation and minification (the Yeoman Angular project doesn't currently optimize your HTML templates, although it's on their roadmap)
- I *really* don't like adding `<script src>` tags to my HTML. Technically, Yeoman takes care of that with generators, but it's opinionated about how you organize your project files.

## Wishlist

- Refactor JavaScript scanning into an NPM module
- Use `ngmin` to remove the need for manual DI annotations
- Spritesheet generation
- Support for Jade templates
- `grunt watch` support for LESS, jshint, Livereload, and other handy things
- Support for Bower components
- Boilerplate for Karma tests
- TypeScript support?