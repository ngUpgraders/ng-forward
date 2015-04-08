export const Inject = ( ...dependencies ) => t => {
	t.$inject = t.$inject || [];

	t.$inject.push(...dependencies);
}