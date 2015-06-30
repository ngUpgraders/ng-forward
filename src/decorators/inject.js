import {baseWriter} from '../writers';

export const Inject = ( ...dependencies ) => t => {
	if(baseWriter.has('$inject', t))
	{
		let parentInjects = baseWriter.get('$inject', t);
		baseWriter.set('$inject', [...dependencies, ...parentInjects], t);
	}
	else
	{
		baseWriter.set('$inject', dependencies, t);
	}
}