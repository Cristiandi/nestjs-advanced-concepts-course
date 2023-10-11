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

