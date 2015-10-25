import Metastore from './classes/metastore';

export const componentStore = new Metastore('$component');
export const providerStore = new Metastore('$provider');
export const bundleStore = new Metastore('$bundle');