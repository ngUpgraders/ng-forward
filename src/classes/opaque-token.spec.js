/*global describe,it */
import '../tests/frameworks';
import { OpaqueToken } from '../classes/opaque-token';
import { Component } from '../decorators/providers/component';
import { Inject } from '../decorators/inject';
import { provide } from '../classes/provider';
import { quickRootTestComponent } from '../tests/internal-utils';

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
      constructor(lives) {
        this.lives = lives;
      }
    }

    @Component({
      selector: 'game',
      providers: [provide(LIVES, {useValue: 3})],
      directives: [Player],
      template: `<player></player>`
    })
    class Game {}

    let root = quickRootTestComponent({ directives: [Game], template: `<game></game>` });
    root.debugElement.text().should.equal('3');
  })
});