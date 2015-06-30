import {componentWriter} from '../../writers';

export const Require = (...components) => t => {
	if(componentWriter.has('require', t))
	{
		let oldRequires = componentWriter.get('require', t);
		componentWriter.set('require', [...oldRequires, ...components], t);
	}
	else
	{
		componentWriter.set('require', components, t);
	}
}