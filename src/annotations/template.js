import annotate from '../util/annotate';

export const Template = ( options = {} ) => t => {
	annotate(t, '$component');

	if(t.$component.templateUrl)
	{
		delete t.$component.templateUrl;
	}
	if(t.$component.template)
	{
		delete t.$component.template;
	}

	if(options.url)
	{
		t.$component.templateUrl = options.url;
	}
	else if(options.inline)
	{
		t.$component.template = options.inline;
	}
}