import annotate from '../util/annotate';
import clone from 'clone'

export const Require = (...components) => t => {
	annotate(t, '$component', {});
	annotate(t.$component, 'require', components);
	annotate(t, 'unpackRequires', function unpackRequires(resolved){
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
	});
}

function name(component){
	return component.replace(/(\?)/g, '').replace(/(\^)/g, '');
}