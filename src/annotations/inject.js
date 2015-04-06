export function Inject(...dependencies){
	return t => {
		t.$inject = t.$inject || [];

		t.$inject.push(...dependencies);
	};
}