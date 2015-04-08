export const Require = (...components) => t => {
	t.$component = t.$component || {};

	t.$component.require = components;

	t.unpackRequires = function(resolved){
		let unpacked = {};

		if(components.length > 1)
		{
			for(let i = 0; i < components.length; i++)
			{
				unpacked[name(components[i])] = resolved[i];
			}
		}
		else
		{
			unpacked[name(components[0])] = resolved;
		}

		return unpacked;
	};
}

function name(component){
	return component.replace(/(\?)/g, '').replace(/(\^)/g, '');
}