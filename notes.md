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

## Implementing the Circuit Breaker pattern
In today's world, it's common for applications to make remote calls to services running in different processes or even different machines. In a distributed environment calls to remote resources and services can fail due a variety of reasons, such as network issues, timeouts, etc.
What could make matter wrorse is if you have many callers to a unresponsive supplier, it's possible your system run out of critical resources, leading to a cascading failure, accross multiple systems, also known as a snowball effect.
The circuit breaker pattern can prevent an application from repeatedly trying to execute an operation that's likely to fail.

## Building Configurable Modules 
Manually creating highly configurable, dynamic modules that expose async methods (be it registerAsync, forRootAsync) is quite complicated, especially for newcomers! You may have seen methods like these when working with official Nest packages such as "@nestjs/typeorm", "@nestjs/graphql", et cetera). In these packages you have certainly done things like TypeOrmModule.forRoot (or forRootAsync) when working with them.

If you have ever tried to create your own DynamicModule that accomplishes similar things, you may have realized it's not very straightforward and involves quite a bit of boilerplate! This is why Nest exposes a somewhat new class called the ConfigurableModuleBuilder. Which helps us facilitate and simplify this entire process, and lets us construct a module "blueprint" - all in just a few lines of code. While creating basic configurable modules is a pretty straightforward process, leveraging all the built-in features of the ConfigurableModuleBuilder might not be that obvious!

### register
When creating a module with register, we are expecting the module to be able to configure a Dynamic Module with a specific configuration or use only by the calling module. You can do this for as many modules as you want.

### forRoot
With forRoot, we are expecting to be able to configure a Dynamic Module once and reuse once and reuse that configuration in multiple places, though possibly unknowingly as it's abstracted away.

### forFeature
With forFeature, we are expecting to use the the configuration of a dynamic modules forRoot, but need to modify some configuration speficic to the calling module needs. Let's say for example, which repository this module should have access to or the context that a logger should use.

### async counterparts
All of these methods usually have an async counterpart as well. They typically achieve the same thing as their counterpart, but they use Nest dependency injection for the configuration in order to handle things asynchronously.

## Composition with Mixins
Along with traditional Object-oriented hierarchies, another popular way of building up classes from reusable components is to build them by combining simpler partial classes. This is known as the mixin pattern.

## What are Schematics?
A schematic is a template-based code generator that is a set of instructions for transforming a software project by generating or modifying code.
We can utilize these schematics to enforce architectural rules and conventions, making our projects consistent and inter-operative. Or we could create schematics to help us generate commonly-used code - shared services, modules, interfaces, health checks, docker files etc. 
For a more real-world example, with the help of schematics, we could reduce the amount of time we might need to setup all the boilerplate for creating a new microservice within our organization by creating a microservice schematic that generates all of the common code / loggers / tools / etc that we might commonly use in our organizations microservices. 

## Adding Custom Schematics 
In schematics, the virtual file system is represented by a Tree. A Tree data structure contains a base (or a set of files that already exists), as well as a staging area (which is a list of changes to be applied to that base).

When making modifications, we don't actually change the base itself, but add those modifications to the staging area.

A Rule object - defines a function that takes a Tree, applies transformations (more on transformations in a moment), and returns a new Tree. The main file for a schematic, which is that index.ts file, defines a set of rules that implement the schematic's logic.

A transformation is represented by an Action - of which there are four action types: Create, Rename, Overwrite, and Delete.

Each schematic runs in a context, represented by a SchematicContext object.

## Diving into DI sub-trees
Every NestJS app has at least one module, a root module, the root module is the starting point Nest uses to build the application dependency graph, which is the internal data structure Nest uses to resolve module and provider relationships and dependencies. In this directed graph, in which the edges have a direction, every module is effectively represented as a single node, importing another module or node instructs the Nest framework to create and edge between these two points in the graph. Although this graph is statically scoped and doesn't get recreated over time, meaning that only a single instance spans the entire application's life cycle, it is possible that it may contain modules or nodes that register non statically scooped providers. Specifically Request-scope providers.
Request scoped provider get instantiated dynamically upon receiving a signal, in terms of, for example, rest APIs, this signal would be an incoming HTTP request. However, for things like cron jobs, this signal would be the invocation of the job itself.
You can see that when it comes to how request scoped providers are invoked, it really depends on the context of an individual application. In reaction to that signal, NestJS constructs a so-called dependency injection subtree, that's associated with the given signal. For instanse, for an incoming HTTP request, it instantiates a new controller that declares a specific rule, this instance is created exclusively for that particular request and will be removed when the request processing has completed.
NestJS associates subtrees with their corresponding ID objects, and if the context ID gets garbage collected, so does the entire subtree. That means the subtrees are ephemeral, meaning that they are remove as their context ID is garbage collected.
Just keep en mind that if you keep track of the context ID, for example, by storing it in the static array or any other collection,  the subtree associated with that context object will never get removed.

## Understanding Durable Providers 
Request scope providers can sometimes lead to increased latency. Since we're having al least one request scope provider injected into let's say, a controller instance or deeper injected into on its providers, makes the controller request scoped as well.
It means it must be recreated or instantiated for each individual request and garbage collected afterwards.
For instance for 30000 requests in parallel, there will 30000 ephemeral controller instances and its request scope providers. 
Hacing a common provider that most providers depend on, for example a db connection, autocamically converts all those providers to a request scope. This can pose a challenge in multi-tenant applications.