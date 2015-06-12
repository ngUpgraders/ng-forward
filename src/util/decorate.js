// Applies a stream of decorators to a target
export default (...params) => {
	let decorators = params;
	let target = decorators.pop();

	for(let decorator of decorators){
		decorator(target);
	}

	return target;
};