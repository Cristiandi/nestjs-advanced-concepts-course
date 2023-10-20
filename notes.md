# NESTJS ADVANCED CONCEPTS COURSE

## Debugging Common Errors

### Dependency Injection related errors
When you're a having an error related to some dependencies in some of your modules, you can use this command to debug it:
```bash
NEST_DEBUG=true npm run start:dev
```
This will show you more descriptive logs about what's going on.

**InternalCoreModule** is and internal framework module, thart gets imported automatically into every module, providing us access to classes like Reflector. ModuleRef and many others.

### Circular Dependency related errors
it can arise when two providers depend on each other or TypeScript files depend on each other, whether that's exported varibles, constants, functions, classes, etc.

For this kind of erros we can use **Madge** which is a tool that can help us to visualize the dependencies between our files. So to use it we could run the following command:

```bash
npx madge dist/main.js --circular # this will show us the circular dependencies
npx madge dist/main.js --image graph.png # this will generate an image with the dependencies
```
## Explicit vs Implicit Dependencies

### Implicit Dependencies
We refer to it as implicit dependencies because the framework is in charge of reading the constructors metadata and the retrival of the Provider class reference itself. So we don't have to do anything else.

### Explicit Dependencies
We refer to it as explicit dependencies because we have to explicitly tell NestJS what we want to inject. We do this by using the @Inject() decorator.

## Lazy-loading Modules 
By default, modules are eagerly loaded, which means that as soon as the application starts, all the modules are loaded. Wheter or not they are immediately needed.

While this is fine for most applications, it can be a problem for applications or workers running in a serverless environment, where having little to no startup latency or cold start is crucial.

Lazy loading can help decrease bootstrap time by loading only the modules required by specific serverless function invocation.

### Lazy-loading use cases
Most commonlly, you will see lazy loaded modules in situations where your worker, cron job, lamda, serverless function or webhooks must trigger different services or different logic based on any given input arguments.

On the other hand, if you have a monolithic application, you may not need to lazy load your modules, where the startup time is rather irrelevant.

## Accessing IoC container 
Oftentimes when building integration and generic libraries, we requiere access to the applications inversion of control or IOC container in order to introspect all the registred providers and controllers.

## Worker Threads in Action
Worker threads help us offload CPU intensive tasks, away from the event loop so that they can be executed parallelly in a non-blocking manner. Although they do not help us much with I/O intensive work. Since the Node.js built-in asynchronous I/O operations are much more efficient themselves.

### Isolated V8 environment
Each worker thread has its own isolated V8 environment, context, event loop, event queue, etc. However, they can share memory by transferring arraybuffers instances or sharing shared arraybuffer instances with one another. Also, a worker and parent can communicate with each other through a messaging channel.

*** Note that in Node.js it's important to differentiate between CPU intensive, long running, event loop blocking and I/O operations, such as HTTP requests and querying a database, etc. ***