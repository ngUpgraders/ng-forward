/**
 * OpaqueToken is used with provide() to bind a const. It allows the dev
 * to avoid using a string.
 *
 * @example
 *
 ```
 let LIVES = new OpaqueToken('threshold');

 @Component({
   selector: 'player',
   template: `Lives Left: {{player.lives}}`
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
 ```
 */
export class OpaqueToken {
  constructor(_desc) { this._desc = _desc }
  toString() { return `Token ${this._desc}`; }
}