import '../tests/frameworks';
import {providerStore, componentStore} from '../writers';
import {Directive} from './directive';

describe('@Directive Decorator', function(){
  it('should set the correct provider metadata', function(){
    @Directive({ selector: '[my-directive]' })
    class MyDirectiveCtrl{ }

    providerStore.get('type', MyDirectiveCtrl).should.eql('directive');
    providerStore.get('name', MyDirectiveCtrl).should.eql('myDirective');
  });

  it('should restrict the directive type', function(){
    @Directive({ selector: '[attr]' })
    class AttrCtrl{ }

    componentStore.get('restrict', AttrCtrl).should.eql('A');
  });

  it('should throw an error if used with an element selector', function(){
    let decorate = () => {
      @Directive({ selector: 'my-component' })
      class MyComponentCtrl{ }
    };

    decorate.should.throw(Error);
  });
});
