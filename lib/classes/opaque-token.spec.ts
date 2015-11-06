/*global describe,it */
import '../tests/frameworks';
import { OpaqueToken } from './opaque-token';
import { Component } from '../decorators/component';
import { Inject } from '../decorators/inject';
import { provide } from './provider';
import { quickFixture } from '../tests/utils';

describe("Opaque Token", () => {
  it('creates a simple token object', () => {
    new OpaqueToken('foo').toString().should.eql('Token foo');
  });

  it('works using example from docs', () => {
    let LIVES = new OpaqueToken('threshold');

    @Component({
      selector: 'player',
      template: `{{player.lives}}`
    })
    @Inject(LIVES)
    class Player {
      constructor(private lives) {}
    }

    @Component({
      selector: 'game',
      providers: [provide(LIVES, {useValue: 3})],
      directives: [Player],
      template: `<player></player>`
    })
    class Game {}

    let fixture = quickFixture({ directives: [Game], template: `<game></game>` });
    fixture.debugElement.text().should.equal('3');
  })
});