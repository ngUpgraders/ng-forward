import Metawriter from 'metawriter';

export let baseWriter = new Metawriter('$ng-decs');
export let providerWriter = new Metawriter('provider', baseWriter);
export let componentWriter = new Metawriter('component', baseWriter);