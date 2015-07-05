import {providerWriter, componentWriter} from '../../writers';
import '../../tests/frameworks';
import {Directive} from './directive';

describe('@Directive Decorator', function(){
  it('should set the correct provider metadata', function(){
    @Directive({ selector: '[my-directive]' })
    class MyDirectiveCtrl{ }

    providerWriter.get('type', MyDirectiveCtrl).should.eql('directive');
    providerWriter.get('name', MyDirectiveCtrl).should.eql('myDirective');
  });

  it('should restrict the directive type', function(){
    @Directive({ selector: '[attr]' })
    class AttrCtrl{ }

    @Directive({ selector: '.class' })
    class ClassCtrl{ }

    componentWriter.get('restrict', AttrCtrl).should.eql('A');
    componentWriter.get('restrict', ClassCtrl).should.eql('C');
  });

  it('should set sensible defaults for attribute and class directives', function(){
    @Directive({ selector: '[my-directive]' })
    class DirCtrl{ }

    componentWriter.get('scope', DirCtrl).should.eql(false);
  });

  it('should throw an error if used with an element selector', function(){
    let decorate = () => {
      @Directive({ selector: 'my-component' })
      class MyComponentCtrl{ }
    };

    decorate.should.throw(Error);
  });
});
