import {baseWriter, providerWriter} from '../writers';

export const Inject = ( ...injects ) => t => {
	let dependencies = injects.map(injectable => {
		if(typeof injectable === 'string')
		{
			return injectable;
		}
		else {
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
}
