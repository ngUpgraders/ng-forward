import {Service} from './providers/service';
import {appWriter, providerWriter} from '../writers';

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

	if(appWriter.has('$inject', t))
	{
		let parentInjects = appWriter.get('$inject', t);
		appWriter.set('$inject', [...dependencies, ...parentInjects], t);
	}
	else
	{
		appWriter.set('$inject', dependencies, t);
	}
};
