export let Template = options => t => {
	t.$component = t.$component || {};

	if(options.url)
	{
		t.$component.templateUrl = options.url;
	}
	else if(options.inline)
	{
		t.$component.template = options.inline;
	}
}