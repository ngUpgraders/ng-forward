import annotate from '../util/annotate';

export const Transclude = t => {
	annotate(t, '$component', {});
	annotate(t.$component, 'transclude', true);
}