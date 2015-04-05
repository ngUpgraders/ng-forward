export function Inject(...dependencies){
	return t => {
		let allDependencies = [];

		if(t.$inject)
		{
			allDependencies.concat(t.$inject);
		}

		allDependencies.concat(dependencies);

		t.$inject = allDependencies;
	};
}