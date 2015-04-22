import annotate from '../util/annotate';
import is from 'is-js';

export const Transclude = t => {
	if(is.string(t))
	{
		return function(realT){
			annotate(realT, '$component', {});
			annotate(realT.$component, 'transclude', t);
		}
	}
	else
	{
		annotate(t, '$component', {});
		annotate(t.$component, 'transclude', true);
	}
}