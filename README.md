# ng-forward

![ng-forward logo](https://raw.githubusercontent.com/ngUpgraders/ng-forward/master/ng-forward-logo.png)

[![Build Status](https://travis-ci.org/ngUpgraders/ng-forward.svg?branch=master)](https://travis-ci.org/ngUpgraders/ng-forward)
[![npm version](https://badge.fury.io/js/ng-forward.svg)](https://badge.fury.io/js/ng-forward)  [![dependencies](https://david-dm.org/ngUpgraders/ng-forward.svg)](https://david-dm.org/ngUpgraders/ng-forward)
[![Join the chat at https://gitter.im/ngUpgraders/ng-forward](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/ngUpgraders/ng-forward?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Plunkr TypeScript](https://img.shields.io/badge/plunkr-typescript-blue.svg)](http://plnkr.co/edit/ktxXKHyHQ5DLcixe6kpO?p=preview)
[![Plunkr Babel](https://img.shields.io/badge/plunkr-babel-blue.svg)](http://plnkr.co/edit/FScTw1byVpQEJHGQ7zLW?p=preview)

***ng-forward*** is the default solution for people who want to start writing code using Angular 2 conventions and styles that runs today on Angular 1.3+.

***ng-forward*** is a collaboration between authors of previous Angular decorator libraries. It's development is assisted and promoted by the Angular team. Ng-forward can be used as part of an upgrade strategy, which may also include [ng-upgrade](http://angularjs.blogspot.com/2015/08/angular-1-and-angular-2-coexistence.html).

We are targeting four types of developers:
- Those who do not know if or when they will upgrade to Angular 2, but they want all the benefits of organizing their code into Components
- Those who are starting Angular 1.x projects today who want the easiest possible upgrade path to Angular 2 and the best Angular 1 code.
- Those who want a production safe way to prepare their Angular 1 projects **now** for the easiest possible upgrade path **later**.
- Those who are actively migrating to Angular 2, who'd like to use ng-forward as the first step in their migration strategy. Once you've used ng-forward to update all the syntax in your project, you can then optionally use [ng-upgrade](http://angularjs.blogspot.com/2015/08/angular-1-and-angular-2-coexistence.html) or go straight to Angular 2.

*Currently in the Alpha phase, please contribute: [ng-forward issues](https://github.com/ngUpgraders/ng-forward/issues)* 

### Found a bug? 
Please [submit an issue](https://github.com/ngUpgraders/ng-forward/issues) with a plunkr that reproduces the bug. Here's an ng-forward starter plunkr ([TypeScript](http://plnkr.co/edit/ktxXKHyHQ5DLcixe6kpO?p=preview) or [Babel](http://plnkr.co/edit/FScTw1byVpQEJHGQ7zLW?p=preview)) that you can fork.

## Install

**NPM**: 
```sh
npm i --save ng-forward@latest reflect-metadata
```

**CDN**: 
```html
<script src="https://npmcdn.com/ng-forward/ng-forward.dist.min.js"></script>
```

## Learn

- Read the [Walk-Through](https://github.com/ngUpgraders/ng-forward/blob/master/Walkthrough.md)
- Open the [API Reference](https://github.com/ngUpgraders/ng-forward/blob/master/API.md)
- Play around in Plunkr ([TypeScript](http://plnkr.co/edit/ktxXKHyHQ5DLcixe6kpO?p=preview) or [Babel](http://plnkr.co/edit/FScTw1byVpQEJHGQ7zLW?p=preview))
- Explore the [TodoMVC app](https://github.com/ngUpgraders/ng-forward-playground)

## FAQ

#### What is the difference between the official Angular upgrade strategy (ng-upgrade) and ng-forward?

From the words of Pete Bacon Darwin (@petebacondarwin), Angular 1 Lead Developer:
> [We suggest] that ng-forward could be used as part of an upgrade strategy, which could also include ng-upgrade. I think the jury is still out on the very best strategy and I expect that there isn't a one size fits all solution.

> [We give] equal sway to the two projects and I think there is value in developers considering both. [There] are a variety of options available, of which ng-forward plays a part; that ng-forward can also be used even whether or not upgrade is your aim, as it can make you ng1 code and development cleaner.

#### I'm using an existing decorator library. What are my options for converting to ng-forward?

Conversion options will depend on the specific library you're using and the author of that library. However, all of the following library's authors were involved in creating ng-forward.

AngularDecorators - @MikeRyan52 (which is also the codebase ng-forward descended from)

A1Atscript - @hannahhoward

Angular2 Now - @pbastowski

NgDecorate - @Mitranim

#### How will ng-forward accomodate changes in the Angular 2.x API?

The Angular 2.x API has changed a lot and is hopefully starting to stabilize. However, obviously there will be more changes before final release.

Our goal in ng-forward will be to adjust to changes and provide the same level of deprecation support and breaking changes as Angular 2.

#### Does ng-forward support all Angular 2.x features?

No. Definitely not. In addition to some of the differences called out above, there are several other features that are simply not possible to implement using Angular 1.x as a base. We'll trying to add what we can over time, but something will just have to wait for Angular 2.x

#### What does a migration from regular Angular 1 code to ng-forward code look like?

Here's an example of the steps you might take:
- [Before Migration](https://gist.github.com/timkindberg/2c9ae631ee1a7428e421)
- [Part 1 A](https://gist.github.com/timkindberg/95166e525685db1f6394) /  [Part 1 B](https://gist.github.com/timkindberg/af2e4f84420dd334e4cd)
- [Part 2 A](https://gist.github.com/timkindberg/78226481690a20f9f2a0) / [Part 2 B](https://gist.github.com/timkindberg/78226481690a20f9f2a0)
- [After Migration](https://gist.github.com/timkindberg/73280001a84a15370ade)

#### How do I use ui-router with ng-forward?
Use the [@StateConfig](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#stateconfig) and [@Resolve](https://github.com/ngUpgraders/ng-forward/blob/master/API.md#resolve) decorators.

Also check out [@brandonroberts](https://github.com/brandonroberts) [ng-forward-ui-router-example](https://github.com/brandonroberts/ng-forward-ui-router-example) repo.

#### Do you support writing in plain ES5?

Our goal is to support the ES5 syntax used by Angular 2.x. Currently, this part of ng-forward is not well developed but we intend to support it in the future. Follow this issue: https://github.com/ngUpgraders/ng-forward/pull/60

#### Who made this library?

Core contributors so far are @MikeRyan52, @timkindberg, @petebacondarwin, and @hannahhoward
