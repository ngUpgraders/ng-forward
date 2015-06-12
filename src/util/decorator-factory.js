import {providerWriter} from '../writers';

export default type => maybeT => {
	if(typeof maybeT === 'string')
	{
		return t => {
			providerWriter.set('type', type, t);
			providerWriter.set('name', maybeT, t);
		};
	}
	else
	{
		providerWriter.set('type', type, maybeT);
		providerWriter.set('name', maybeT.name, maybeT);
	}
}