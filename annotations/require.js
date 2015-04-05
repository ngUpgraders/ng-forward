export let Require = (...components) => t => {
	t.$component = t.$component || {};

	t.$component.require = components;

	t.unpackRequiredComponents = function(resolved){
		let unpacked = {};

		if(components.length > 1)
		{
			for(let i = 0; i < components.length; i++)
			{
				unpacked[components[i]] = resolved[i];
			}
		}
		else
		{
			unpacked[components[0]] = resolved;
		}

		return unpacked;
	};
}