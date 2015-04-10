import clone from 'clone';
import annotate from '../util/annotate';

export const Inject = ( ...dependencies ) => t => {
	annotate(t, '$inject', dependencies);
}