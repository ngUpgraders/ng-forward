import {componentWriter} from '../../writers';

export const Transclude = maybeT => {
	if(typeof maybeT === 'string' || typeof maybeT === 'boolean')
	{
		return t => componentWriter.set('transclude', maybeT, t);
	}
	else
	{
		componentWriter.set('transclude', true, maybeT);
	}
};