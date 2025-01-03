---
title: Guide
---

## Brief overview & Development guide

NuxtStore is a platform-agnostic ecommerce frontend solution that allows seamless integration with various ecommerce backends! It provides tools for building customizable, high-performance online storefronts.

This guide will provide you with an overview of the project structure, tools and best practices to help you get started quickly.

## Project Structure

This project follows a modular and scalable architecture, by decoupling the composable frontend from the server middleware allowing for easy collaboration among multiple teams and ensuring consistent development practices across the codebase.

The architecture includes the following apps:

- `server` - NuxtStore server middleware powered by **[Fastify](https://fastify.dev/)**
- `web` - A typescript based web application powered by **[Nuxt](https://nuxtjs.org)** and **[Vue](https://vuejs.org)**


> **Note**: These two standalone modules are capable of being integrated with any backend service with consistent APIs without extra configuration to setup. 

#### Web application

Web app follows a typical Nuxt.js directory [structure](https://nuxt.com/docs/guide/directory-structure/nuxt) with a few tweaks:

```shell

apps/
 └── root/
     ├── ...
     ├── assets/                  # Static assets
     ├── components/              
     │   ├── ecommerce/           # Ecommerce-specific components (ProductCard)
     │   ├── ...
     │   └── ui/                  # UI components (Header, Footer)
     ├── composables/             # Custom hooks composing reactive logic
     ├── constants/               
     │   ├── api.ts               # API-related constants (HTTP methods)
     │   └── ui.ts                # UI-related constants (colors, breakpoints)
     ├── data/                    # Static data or JSON files
     ├── layouts/                 # Layouts
     ├── middleware/              # Client route middleware (e.g auth)
     │   ├── auth.ts              
     │   └── ...
     ├── pages/                   # Pages
     │   ├── index.vue            # App home page component
     │   └── ...
     ├── plugins/                 # App plugins run on both client and server
     ├── public/                  # Public assets
     ├── server/                  # In-app backend server
     ├── shared/
     │   ├── types/               # Type definitions
     │   └── utils/               # Non-reactive helper functions
     ├── stores/                  # Pinia stores for state management
     │   ├── auth.store.ts        
     │   └── cart.store.ts        
     ├── tests/                   # Component and feature unit tests
     ├── eslint.config.mjs        # Linter rules
     ├── features.json            # Feature flags
     ├── app.vue                  # Application entry point
     ├── nuxt.config.ts           # Nuxt.js configuration
     ├── package.json             # Package entry point
     ├── tailwind.config.js       # TailwindCSS configuration
     ├── tsconfig.json            # TypeScript configuration
     ├── vitest.config.ts         # Vitest configuration
     └── ...

```

List of essential directories:

- `components/ecommerce` NuxtStore UI components, like `ProductCard` or `Review`
- `stores` Pinia store containing global state, getters and mutators
- `composables` Contains reusable composition functions, e.g. data fetchers and stateful helpers
- `shared` Contains types and utilities [shared](https://github.com/nuxt/nuxt/releases/tag/v3.14.0) across client and server e.g `product.type.ts`. Auto-import support will follow in next major release.
- `tests` Contains mocks for components, composables and store actions

## Guide

This project follows a few conventions to help with organizing your code:

- Each function is located in a dedicated module and exported from the `index.ts` file.
- In this nuxt application, avoid importing auto-imported APIs (ref, onMounted etc.) and PrimeVue components (Dialog, Carousel etc.)
- Names are short, descriptive and must follow our consistent naming convention ([guide](https://docs.vaah.dev/guide/code))
- Follow this [nuxt guide](https://docs.vaah.dev/guide/nuxt) to avoid common mistakes and comply with industry standard practices
- Functions (including composables and utils) are exported using explicit named exports instead of anonymous exports
- Actions or functions are defined following the trivial function definitions (`func() { }`) **instead of arrow functions** (`const func = () => { }`) to create visible distinction between constants and methods
- This project follows [gitflow](https://docs.vaah.dev/guide/git) as the branching strategy
- Feature branch name must follow a simple convention such as
`feature/<purpose>-<page_name>-<subject>`. Subject can be component or specific feature 
(e.g **ui-cart-summary**, **ui-layout-footer**, **flow-checkout-payment**, **action-cart-quantity**)
- [JS doc comments](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html) are added at necessary places to define the structure of a complex entity or explain the construct of a method  

> **Note:** In order to add code comments, we prefix the action with a `@` for contributors reference such as **@todo:** or **@debug:** 

### Components

NuxtStore UI leverages [PrimeVue](https://primevue.org/) as the building blocks of storefront components. All components are auto-imported by their name (no path-prefix) and are located inside subfolders in the `components` directory.

- Introduction to project components:

  - Representational components that are designed to fulfill project requirements
  - Each component name must be prefixed with **"Ns"** (e.g **NsProductCard**)
  - TypeScript types are located inside the SFC for ease of access and coupling
  - Tests for components are located in the `/tests/components` folder (e.g **NsUserAddress.spec.ts**)
  - Folders inside /components must follow their purpose 

Expected file/folder structure:

```shell
components/
 └── ui/
     └── NsHeader.vue
     └── ...
 └── ecommerce/
     └── NsCartItem.vue
     └── ...
 └── forms/
     └── NsSignUpForm.vue
     └── ...
 └── ...
```

For more information about available NuxtStore components for Vue (Nuxt), check out [documentation]().

- **Convention:**

    - Vue (Nuxt) components should follow `Pascal case` pattern (`CategoryFilters`, `Heading`)
    - The types for component's props should be named `{Component}Props` and exist in the same SFC as the component. For example, `GalleryProps` or `HeadingProps`
    - Line of code in a single file component must not exceed 200 (formatted)

- **Prop Declaration:** In vue, there are multiple ways to define component props especially with typescript. [[checkout official docs](https://vuejs.org/guide/typescript/composition-api.html#typing-component-props)] To ensure consistency and still allow customisability, we have adopted the following pattern.

    - Multiword props are defined in `camelCase` and passed in template as `kebab-case`

Example:
```ts
export type CartActionProps = {
    icon?: string,
    label?: string,
    ...
};

const props = withDefaults(defineProps<CartActionProps>(), {
    icon: "pi pi-cart",
    label: "Add to cart"
});
```

### State Management

We are using [Pinia state management](https://pinia.vuejs.org/ssr/nuxt.html) to lock the data responsibility along with the composition functions (composables).

- Pinia stores are defined in the style of [Setup stores](https://pinia.vuejs.org/core-concepts/#Setup-Stores), keeping performance and modern standards in view
- Each store file must end with a `.store.ts` extension
- Store methods are as modular and reusable as possible and do not perform side effects. If required, new action is created in order to handle `post{Action}` (e.g **addToCart** , **postAddToCart**)
- [`useState`](https://nuxt.com/docs/getting-started/state-management) is used in very narrow context where creating global store for shared state doesn't make sense
- Sequentially a store structure should have state >> getters >> actions for readability

### Composables

Composables are useful when stateful logic has to be reused across components - e.g. controlling component state or leverage lifecycle hooks or accessing DOM api.
Project composables are located on top level inside the `composables/` directory. 

**Convention:**
- Each composable should be prefixed with `use` keyword (`useCartStatus`)
- Composables should follow `camelCase` pattern (`useProductReviews`)
- Composables follow single responsibility principle. Avoid calling side effects inside composables
- This project inherits most of the composables from [vueuse](https://vueuse.org/guide/best-practice.html) library. Always search for an already available `vueuse` composable before writing on own for common tasks or DOM manipulation. 
- [Composables](https://vuejs.org/guide/reusability/composables.html#conventions-and-best-practices) should only be called in synchronous environment and on top level. Remember to clean attached event handlers or timeouts if defined inside a composable using vue's unmount hooks
- Built-in Nuxt composables must be called in the right context to avoid critical errors such as [Nuxt instance unavailable](https://nuxt.com/docs/guide/concepts/auto-imports#vue-and-nuxt-composables)

> **Note:** State connected to the certain composable is read-only and reactive. They are modified by the internal modifiers (setters)

### Utils

Main purpose of utils is to encapsulate non-reactive helper method logic and draw a semantic boundary between reactive composables and other auto-imported utility functions. Utils are contained inside the Shared/ folder. This project follows some simple conventions for utils:

- Project utils end with a `.utils.ts` extension (e.g format.utils.ts, wishlist.utils.ts)
- `utils/index.utils.ts` contains all the shared functions across all contexts/features (e.g **isEqual\<T\>(a,b)** compares two entities for equality) 
- Named exports are preferred over default export (e.g export function cleanUserInput(){ })
- One utility method can have multiple exports, allowing relevant functions to be grouped together
- Utility functions are synchronous and do not communicate with any reactive source (store/composables)

### Localization

NuxtStore ships with a basic setup for i18n localization powered by the [Nuxt-i18n](https://i18n.nuxtjs.org) library. Project locale translations are stored in `locale/[namespace].json` files. Translations are grouped by _features_, and imported only where required to minimize bundle size.
Refer to the [Nuxt-i18n](https://i18n.nuxtjs.org) documentation for translating content with SSR support.

### Testing

The project provides a basic setup for testing TypeScript code with [Vitest](https://vitest.dev/) and [Vue Test Utils](https://test-utils.vuejs.org/guide/) for testing Vue (Nuxt) components and [pinia stores](https://pinia.vuejs.org/cookbook/testing.html#Mocking-the-returned-value-of-an-action).

Testing configuration files: (runs on nuxt environment and `happy-dom`)

- `vitest.config.ts` - Test runner config file

Testing commands:

- `npm run unittest` - Run all the test scripts in the project (in watch mode by default)
- `npm run unittest <Component>` - Run specific component/feature mocks

### Conventions enforced by automated tooling

To help you code with best practices in mind, this boilerplate comes with some automated tooling.

- All test descriptions follow naming convention `test('should <component>... ')`
- Automatic code linting is managed by [nuxt-eslint-module](https://eslint.nuxt.com/packages/config)

### Cache control

As the initial Nuxt setup is not caching images generated by `NuxtImg`, the `nuxt.config.ts` in this repository has been extended to cache those images as well (by setting proper headers):

```ts
routeRules: {
  '/_ipx/**': { headers: { 'cache-control': `public, max-age=31536000, immutable` } },
  '/icons/**': { headers: { 'cache-control': `public, max-age=31536000, immutable` } },
  '/favicon.ico': { headers: { 'cache-control': `putypescriptblic, max-age=31536000, immutable` } },
},
```

You can read about more possible rules in the [Nuxt documentation](https://nuxt.com/docs/guide/concepts/rendering#hybrid-rendering).

#### More about performance

Additional performance good practices and vue project guide can be found [HERE](https://docs.vaah.dev/guide/vue-and-nuxt-performance-improvement).

### Recommended IDE setup

1. Visual Studio Code (with prettier_extension @`v9.14.0` exact and the latest version of microsoft eslint_extension)
2. webstorm (for developers comfortable in jetbrains IDE like phpstorm with no extra configuration - 
[ws_eslint_customisation_guide](https://www.jetbrains.com/help/webstorm/eslint.html#ws_js_eslint_activate))