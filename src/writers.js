// # Metawriters
// metawriter is a simple utility written by me (@mikeryan52) for writing
// namespaced metadata to a class. Metawriter wraps the `Reflect.metadata` polyfill
// written by the TypeScript guys
import Metawriter from 'metawriter';

// This is the base writer. Rarely used other than to ensure that the other writers
// are under this library's namespace. Prevents collisions with other metadata-based
// libraries.
export const baseWriter = new Metawriter('$ng-decs');
// The providerWriter is responsible for setting the name and type of provider a
// class will become after parsed
export const providerWriter = new Metawriter('provider', baseWriter);
// The componentWriter is used to create the directive definition object.
export const componentWriter = new Metawriter('component', baseWriter);
// The appWriter is a new writer for ng-forward that writes information about how
// the bundle function should traverse a class. It sets the modules, providers, and
// traversal strategy that the class requires.
export const appWriter = new Metawriter('app', baseWriter);
