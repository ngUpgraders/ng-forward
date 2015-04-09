import clone from 'clone';

export const Inject = ( ...dependencies ) => t => {
	t.$inject = t.$inject ? clone(t.$inject) : [];

	t.$inject.push(...dependencies);
}