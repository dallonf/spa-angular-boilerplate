# Single-Page-App Angular Boilerplate

## High-level features

- Immediately start hacking with AngularJS and a NodeJS backend
- Full LiveReload support
- Grunt build process will concatenate and minify all of your code, including HTML templates and stylesheets
- Just add JavaScript files to your project. They'll be automatically detected and loaded in the right order. Why should you have to add a `<script>` tag?
- Includes HTML5 Boilerplate
- Supports [ng-annotate](https://github.com/olov/ng-annotate), so you don't have to add DI metadata manually

## How to use

Download the source of this project, and run the following to install dependencies:

    npm install
    grunt bower

To start testing and developing, run `grunt`. (That is, the default task) A server will start at `localhost:3000` and your default browser will automatically open to that page. The grunt task will also automatically compile LESS and act as a LiveReload server. Just make changes to the code and they'll show up.

To add a new dependency to your app, run `grunt bowerAdd:[packageName]` (example: `grunt bowerAdd:moment`).

Whenever you modify `bower.json`, you should also run `grunt bower`.

### How to make a production build

To make an optimized production build, run `grunt build`. This will output static files to the `build/` directory. You can test this build by running `node app`.

If you haven't created any Node APIs, you can distribute the `build/` directory as your final app.

## Why not Yeoman?

[Yeoman Angular Generator](https://github.com/yeoman/generator-angular) is a similar project which is definitely more mature at this time. Here are some reasons why SPA-Angular fits my personal workflow better:

- Yeoman doesn't really have the concept of a backend, as far as I can tell
- Personal preference: I use LESS, Yeoman uses Sass
- SPA-Angular does more concatenation and minification (the Yeoman Angular project doesn't currently optimize your HTML templates, although it's on their roadmap)
- I *really* don't like adding `<script src>` tags to my HTML. Technically, Yeoman takes care of that with generators, but it's opinionated about how you organize your project files.

## Internet Explorer Support

I opted to not support IE8 and below with this boilerplate in order to keep things clean. However, it's not too difficult to add IE8 support if you need it:

- Add [conditional classes](http://www.paulirish.com/2008/conditional-stylesheets-vs-css-hacks-answer-neither/) to the `<html>` tag
- Switch jQuery to the 1.x branch (2.x actively drops IE8 support)
- Switch AngularJS to the 1.2.x branch (1.3.x [passively drops IE8 support](http://blog.angularjs.org/2013/12/angularjs-13-new-release-approaches.html))
- Avoid using directives as tags (e.g. `<div ng-view>` instead of `<ng-view>`)

## Wishlist

These are not necessarily in priority order.

- Refactor JavaScript scanning into an NPM module
- Spritesheet generation
- Support for Jade templates?
- Boilerplate for Karma tests
- Use [grunt-bacon](https://github.com/DallonF/grunt-bacon) for more concise build scripts.
- Implement sourcemap support for stylesheets
- Convert into Yeoman generator (competing directly with the official Angular generator?)
