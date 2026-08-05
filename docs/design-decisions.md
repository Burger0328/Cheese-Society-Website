# Design Decisions

## Static multi-page architecture

The site uses separate HTML documents so each page remains directly addressable, works without JavaScript, and can be deployed to any static host. The tradeoff is duplication in the shared header, navigation, metadata, and footer.

Relative asset paths require extra care because root pages and pages under `guide/` resolve URLs from different directories. Keeping the directory structure shallow and running automated link checks reduces the chance of broken stylesheets, images, and navigation.

## CSS organization

Shared design values live in one token file. Reset and base rules establish predictable defaults; site-level rules control the shared header, navigation, buttons, focus states, and footer; individual layout files handle only the structure unique to a page type.

CSS cascade layers make that separation explicit and reduce specificity conflicts. Native browser features such as popovers, dialogs, details elements, and view transitions provide progressive enhancement without a framework.

## Future evolution

If the content grew, the repeated page shell and cheese-family pages would be good candidates for a static-site generator or Web Components. Cheese information could move into structured data and be rendered through a reusable template. For the current scope, hand-authored HTML keeps the code transparent and demonstrates a strong foundation in browser standards.
