import {Service} from './providers/service';
import {baseWriter, providerWriter} from '../writers';

export const Inject = ( ...injects ) => t => {
	let dependencies = injects.map(injectable => {
		if(typeof injectable === 'string')
		{
			return injectable;
		}
		else if(providerWriter.has('type', injectable))
		{
			return providerWriter.get('name', injectable);
		}
		else if(typeof injectable === 'function')
		{
			Service(injectable);
			return providerWriter.get('name', injectable);
		}
	});

	if(baseWriter.has('$inject', t))
	{
		let parentInjects = baseWriter.get('$inject', t);
		baseWriter.set('$inject', [...dependencies, ...parentInjects], t);
	}
	else
	{
		baseWriter.set('$inject', dependencies, t);
	}
};
