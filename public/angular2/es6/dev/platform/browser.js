export { AngularEntrypoint } from 'angular2/src/core/angular_entrypoint';
export { BROWSER_PROVIDERS, CACHED_TEMPLATE_PROVIDER, ELEMENT_PROBE_PROVIDERS, ELEMENT_PROBE_PROVIDERS_PROD_MODE, inspectNativeElement, BrowserDomAdapter, By, Title, DOCUMENT, enableDebugTools, disableDebugTools } from 'angular2/src/platform/browser_common';
import { isPresent, CONST_EXPR } from 'angular2/src/facade/lang';
import { BROWSER_PROVIDERS, BROWSER_APP_COMMON_PROVIDERS } from 'angular2/src/platform/browser_common';
import { COMPILER_PROVIDERS } from 'angular2/compiler';
import { platform, reflector } from 'angular2/core';
import { ReflectionCapabilities } from 'angular2/src/core/reflection/reflection_capabilities';
import { XHRImpl } from "angular2/src/platform/browser/xhr_impl";
import { XHR } from 'angular2/compiler';
import { Provider } from 'angular2/src/core/di';
/**
 * An array of providers that should be passed into `application()` when bootstrapping a component.
 */
export const BROWSER_APP_PROVIDERS = CONST_EXPR([
    BROWSER_APP_COMMON_PROVIDERS,
    COMPILER_PROVIDERS,
    new Provider(XHR, { useClass: XHRImpl }),
]);
/**
 * Bootstrapping for Angular applications.
 *
 * You instantiate an Angular application by explicitly specifying a component to use
 * as the root component for your application via the `bootstrap()` method.
 *
 * ## Simple Example
 *
 * Assuming this `index.html`:
 *
 * ```html
 * <html>
 *   <!-- load Angular script tags here. -->
 *   <body>
 *     <my-app>loading...</my-app>
 *   </body>
 * </html>
 * ```
 *
 * An application is bootstrapped inside an existing browser DOM, typically `index.html`.
 * Unlike Angular 1, Angular 2 does not compile/process providers in `index.html`. This is
 * mainly for security reasons, as well as architectural changes in Angular 2. This means
 * that `index.html` can safely be processed using server-side technologies such as
 * providers. Bindings can thus use double-curly `{{ syntax }}` without collision from
 * Angular 2 component double-curly `{{ syntax }}`.
 *
 * We can use this script code:
 *
 * {@example core/ts/bootstrap/bootstrap.ts region='bootstrap'}
 *
 * When the app developer invokes `bootstrap()` with the root component `MyApp` as its
 * argument, Angular performs the following tasks:
 *
 *  1. It uses the component's `selector` property to locate the DOM element which needs
 *     to be upgraded into the angular component.
 *  2. It creates a new child injector (from the platform injector). Optionally, you can
 *     also override the injector configuration for an app by invoking `bootstrap` with the
 *     `componentInjectableBindings` argument.
 *  3. It creates a new `Zone` and connects it to the angular application's change detection
 *     domain instance.
 *  4. It creates an emulated or shadow DOM on the selected component's host element and loads the
 *     template into it.
 *  5. It instantiates the specified component.
 *  6. Finally, Angular performs change detection to apply the initial data providers for the
 *     application.
 *
 *
 * ## Bootstrapping Multiple Applications
 *
 * When working within a browser window, there are many singleton resources: cookies, title,
 * location, and others. Angular services that represent these resources must likewise be
 * shared across all Angular applications that occupy the same browser window. For this
 * reason, Angular creates exactly one global platform object which stores all shared
 * services, and each angular application injector has the platform injector as its parent.
 *
 * Each application has its own private injector as well. When there are multiple
 * applications on a page, Angular treats each application injector's services as private
 * to that application.
 *
 * ## API
 *
 * - `appComponentType`: The root component which should act as the application. This is
 *   a reference to a `Type` which is annotated with `@Component(...)`.
 * - `customProviders`: An additional set of providers that can be added to the
 *   app injector to override default injection behavior.
 *
 * Returns a `Promise` of {@link ComponentRef}.
 */
export function bootstrap(appComponentType, customProviders) {
    reflector.reflectionCapabilities = new ReflectionCapabilities();
    let appProviders = isPresent(customProviders) ? [BROWSER_APP_PROVIDERS, customProviders] : BROWSER_APP_PROVIDERS;
    return platform(BROWSER_PROVIDERS).application(appProviders).bootstrap(appComponentType);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJvd3Nlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtb1hETzRwMnYudG1wL2FuZ3VsYXIyL3BsYXRmb3JtL2Jyb3dzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsU0FBUSxpQkFBaUIsUUFBTyxzQ0FBc0MsQ0FBQztBQUN2RSxTQUNFLGlCQUFpQixFQUNqQix3QkFBd0IsRUFDeEIsdUJBQXVCLEVBQ3ZCLGlDQUFpQyxFQUNqQyxvQkFBb0IsRUFDcEIsaUJBQWlCLEVBQ2pCLEVBQUUsRUFDRixLQUFLLEVBQ0wsUUFBUSxFQUNSLGdCQUFnQixFQUNoQixpQkFBaUIsUUFDWixzQ0FBc0MsQ0FBQztPQUV2QyxFQUFPLFNBQVMsRUFBRSxVQUFVLEVBQUMsTUFBTSwwQkFBMEI7T0FDN0QsRUFDTCxpQkFBaUIsRUFDakIsNEJBQTRCLEVBQzdCLE1BQU0sc0NBQXNDO09BQ3RDLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSxtQkFBbUI7T0FDN0MsRUFBZSxRQUFRLEVBQUUsU0FBUyxFQUFDLE1BQU0sZUFBZTtPQUN4RCxFQUFDLHNCQUFzQixFQUFDLE1BQU0sc0RBQXNEO09BQ3BGLEVBQUMsT0FBTyxFQUFDLE1BQU0sd0NBQXdDO09BQ3ZELEVBQUMsR0FBRyxFQUFDLE1BQU0sbUJBQW1CO09BQzlCLEVBQUMsUUFBUSxFQUFDLE1BQU0sc0JBQXNCO0FBRTdDOztHQUVHO0FBQ0gsT0FBTyxNQUFNLHFCQUFxQixHQUEyQyxVQUFVLENBQUM7SUFDdEYsNEJBQTRCO0lBQzVCLGtCQUFrQjtJQUNsQixJQUFJLFFBQVEsQ0FBQyxHQUFHLEVBQUUsRUFBQyxRQUFRLEVBQUUsT0FBTyxFQUFDLENBQUM7Q0FDdkMsQ0FBQyxDQUFDO0FBRUg7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FtRUc7QUFDSCwwQkFDSSxnQkFBc0IsRUFDdEIsZUFBd0Q7SUFDMUQsU0FBUyxDQUFDLHNCQUFzQixHQUFHLElBQUksc0JBQXNCLEVBQUUsQ0FBQztJQUNoRSxJQUFJLFlBQVksR0FDWixTQUFTLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsRUFBRSxlQUFlLENBQUMsR0FBRyxxQkFBcUIsQ0FBQztJQUNsRyxNQUFNLENBQUMsUUFBUSxDQUFDLGlCQUFpQixDQUFDLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQzNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQge0FuZ3VsYXJFbnRyeXBvaW50fSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9hbmd1bGFyX2VudHJ5cG9pbnQnO1xuZXhwb3J0IHtcbiAgQlJPV1NFUl9QUk9WSURFUlMsXG4gIENBQ0hFRF9URU1QTEFURV9QUk9WSURFUixcbiAgRUxFTUVOVF9QUk9CRV9QUk9WSURFUlMsXG4gIEVMRU1FTlRfUFJPQkVfUFJPVklERVJTX1BST0RfTU9ERSxcbiAgaW5zcGVjdE5hdGl2ZUVsZW1lbnQsXG4gIEJyb3dzZXJEb21BZGFwdGVyLFxuICBCeSxcbiAgVGl0bGUsXG4gIERPQ1VNRU5ULFxuICBlbmFibGVEZWJ1Z1Rvb2xzLFxuICBkaXNhYmxlRGVidWdUb29sc1xufSBmcm9tICdhbmd1bGFyMi9zcmMvcGxhdGZvcm0vYnJvd3Nlcl9jb21tb24nO1xuXG5pbXBvcnQge1R5cGUsIGlzUHJlc2VudCwgQ09OU1RfRVhQUn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7XG4gIEJST1dTRVJfUFJPVklERVJTLFxuICBCUk9XU0VSX0FQUF9DT01NT05fUFJPVklERVJTXG59IGZyb20gJ2FuZ3VsYXIyL3NyYy9wbGF0Zm9ybS9icm93c2VyX2NvbW1vbic7XG5pbXBvcnQge0NPTVBJTEVSX1BST1ZJREVSU30gZnJvbSAnYW5ndWxhcjIvY29tcGlsZXInO1xuaW1wb3J0IHtDb21wb25lbnRSZWYsIHBsYXRmb3JtLCByZWZsZWN0b3J9IGZyb20gJ2FuZ3VsYXIyL2NvcmUnO1xuaW1wb3J0IHtSZWZsZWN0aW9uQ2FwYWJpbGl0aWVzfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9yZWZsZWN0aW9uL3JlZmxlY3Rpb25fY2FwYWJpbGl0aWVzJztcbmltcG9ydCB7WEhSSW1wbH0gZnJvbSBcImFuZ3VsYXIyL3NyYy9wbGF0Zm9ybS9icm93c2VyL3hocl9pbXBsXCI7XG5pbXBvcnQge1hIUn0gZnJvbSAnYW5ndWxhcjIvY29tcGlsZXInO1xuaW1wb3J0IHtQcm92aWRlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvZGknO1xuXG4vKipcbiAqIEFuIGFycmF5IG9mIHByb3ZpZGVycyB0aGF0IHNob3VsZCBiZSBwYXNzZWQgaW50byBgYXBwbGljYXRpb24oKWAgd2hlbiBib290c3RyYXBwaW5nIGEgY29tcG9uZW50LlxuICovXG5leHBvcnQgY29uc3QgQlJPV1NFUl9BUFBfUFJPVklERVJTOiBBcnJheTxhbnkgLypUeXBlIHwgUHJvdmlkZXIgfCBhbnlbXSovPiA9IENPTlNUX0VYUFIoW1xuICBCUk9XU0VSX0FQUF9DT01NT05fUFJPVklERVJTLFxuICBDT01QSUxFUl9QUk9WSURFUlMsXG4gIG5ldyBQcm92aWRlcihYSFIsIHt1c2VDbGFzczogWEhSSW1wbH0pLFxuXSk7XG5cbi8qKlxuICogQm9vdHN0cmFwcGluZyBmb3IgQW5ndWxhciBhcHBsaWNhdGlvbnMuXG4gKlxuICogWW91IGluc3RhbnRpYXRlIGFuIEFuZ3VsYXIgYXBwbGljYXRpb24gYnkgZXhwbGljaXRseSBzcGVjaWZ5aW5nIGEgY29tcG9uZW50IHRvIHVzZVxuICogYXMgdGhlIHJvb3QgY29tcG9uZW50IGZvciB5b3VyIGFwcGxpY2F0aW9uIHZpYSB0aGUgYGJvb3RzdHJhcCgpYCBtZXRob2QuXG4gKlxuICogIyMgU2ltcGxlIEV4YW1wbGVcbiAqXG4gKiBBc3N1bWluZyB0aGlzIGBpbmRleC5odG1sYDpcbiAqXG4gKiBgYGBodG1sXG4gKiA8aHRtbD5cbiAqICAgPCEtLSBsb2FkIEFuZ3VsYXIgc2NyaXB0IHRhZ3MgaGVyZS4gLS0+XG4gKiAgIDxib2R5PlxuICogICAgIDxteS1hcHA+bG9hZGluZy4uLjwvbXktYXBwPlxuICogICA8L2JvZHk+XG4gKiA8L2h0bWw+XG4gKiBgYGBcbiAqXG4gKiBBbiBhcHBsaWNhdGlvbiBpcyBib290c3RyYXBwZWQgaW5zaWRlIGFuIGV4aXN0aW5nIGJyb3dzZXIgRE9NLCB0eXBpY2FsbHkgYGluZGV4Lmh0bWxgLlxuICogVW5saWtlIEFuZ3VsYXIgMSwgQW5ndWxhciAyIGRvZXMgbm90IGNvbXBpbGUvcHJvY2VzcyBwcm92aWRlcnMgaW4gYGluZGV4Lmh0bWxgLiBUaGlzIGlzXG4gKiBtYWlubHkgZm9yIHNlY3VyaXR5IHJlYXNvbnMsIGFzIHdlbGwgYXMgYXJjaGl0ZWN0dXJhbCBjaGFuZ2VzIGluIEFuZ3VsYXIgMi4gVGhpcyBtZWFuc1xuICogdGhhdCBgaW5kZXguaHRtbGAgY2FuIHNhZmVseSBiZSBwcm9jZXNzZWQgdXNpbmcgc2VydmVyLXNpZGUgdGVjaG5vbG9naWVzIHN1Y2ggYXNcbiAqIHByb3ZpZGVycy4gQmluZGluZ3MgY2FuIHRodXMgdXNlIGRvdWJsZS1jdXJseSBge3sgc3ludGF4IH19YCB3aXRob3V0IGNvbGxpc2lvbiBmcm9tXG4gKiBBbmd1bGFyIDIgY29tcG9uZW50IGRvdWJsZS1jdXJseSBge3sgc3ludGF4IH19YC5cbiAqXG4gKiBXZSBjYW4gdXNlIHRoaXMgc2NyaXB0IGNvZGU6XG4gKlxuICoge0BleGFtcGxlIGNvcmUvdHMvYm9vdHN0cmFwL2Jvb3RzdHJhcC50cyByZWdpb249J2Jvb3RzdHJhcCd9XG4gKlxuICogV2hlbiB0aGUgYXBwIGRldmVsb3BlciBpbnZva2VzIGBib290c3RyYXAoKWAgd2l0aCB0aGUgcm9vdCBjb21wb25lbnQgYE15QXBwYCBhcyBpdHNcbiAqIGFyZ3VtZW50LCBBbmd1bGFyIHBlcmZvcm1zIHRoZSBmb2xsb3dpbmcgdGFza3M6XG4gKlxuICogIDEuIEl0IHVzZXMgdGhlIGNvbXBvbmVudCdzIGBzZWxlY3RvcmAgcHJvcGVydHkgdG8gbG9jYXRlIHRoZSBET00gZWxlbWVudCB3aGljaCBuZWVkc1xuICogICAgIHRvIGJlIHVwZ3JhZGVkIGludG8gdGhlIGFuZ3VsYXIgY29tcG9uZW50LlxuICogIDIuIEl0IGNyZWF0ZXMgYSBuZXcgY2hpbGQgaW5qZWN0b3IgKGZyb20gdGhlIHBsYXRmb3JtIGluamVjdG9yKS4gT3B0aW9uYWxseSwgeW91IGNhblxuICogICAgIGFsc28gb3ZlcnJpZGUgdGhlIGluamVjdG9yIGNvbmZpZ3VyYXRpb24gZm9yIGFuIGFwcCBieSBpbnZva2luZyBgYm9vdHN0cmFwYCB3aXRoIHRoZVxuICogICAgIGBjb21wb25lbnRJbmplY3RhYmxlQmluZGluZ3NgIGFyZ3VtZW50LlxuICogIDMuIEl0IGNyZWF0ZXMgYSBuZXcgYFpvbmVgIGFuZCBjb25uZWN0cyBpdCB0byB0aGUgYW5ndWxhciBhcHBsaWNhdGlvbidzIGNoYW5nZSBkZXRlY3Rpb25cbiAqICAgICBkb21haW4gaW5zdGFuY2UuXG4gKiAgNC4gSXQgY3JlYXRlcyBhbiBlbXVsYXRlZCBvciBzaGFkb3cgRE9NIG9uIHRoZSBzZWxlY3RlZCBjb21wb25lbnQncyBob3N0IGVsZW1lbnQgYW5kIGxvYWRzIHRoZVxuICogICAgIHRlbXBsYXRlIGludG8gaXQuXG4gKiAgNS4gSXQgaW5zdGFudGlhdGVzIHRoZSBzcGVjaWZpZWQgY29tcG9uZW50LlxuICogIDYuIEZpbmFsbHksIEFuZ3VsYXIgcGVyZm9ybXMgY2hhbmdlIGRldGVjdGlvbiB0byBhcHBseSB0aGUgaW5pdGlhbCBkYXRhIHByb3ZpZGVycyBmb3IgdGhlXG4gKiAgICAgYXBwbGljYXRpb24uXG4gKlxuICpcbiAqICMjIEJvb3RzdHJhcHBpbmcgTXVsdGlwbGUgQXBwbGljYXRpb25zXG4gKlxuICogV2hlbiB3b3JraW5nIHdpdGhpbiBhIGJyb3dzZXIgd2luZG93LCB0aGVyZSBhcmUgbWFueSBzaW5nbGV0b24gcmVzb3VyY2VzOiBjb29raWVzLCB0aXRsZSxcbiAqIGxvY2F0aW9uLCBhbmQgb3RoZXJzLiBBbmd1bGFyIHNlcnZpY2VzIHRoYXQgcmVwcmVzZW50IHRoZXNlIHJlc291cmNlcyBtdXN0IGxpa2V3aXNlIGJlXG4gKiBzaGFyZWQgYWNyb3NzIGFsbCBBbmd1bGFyIGFwcGxpY2F0aW9ucyB0aGF0IG9jY3VweSB0aGUgc2FtZSBicm93c2VyIHdpbmRvdy4gRm9yIHRoaXNcbiAqIHJlYXNvbiwgQW5ndWxhciBjcmVhdGVzIGV4YWN0bHkgb25lIGdsb2JhbCBwbGF0Zm9ybSBvYmplY3Qgd2hpY2ggc3RvcmVzIGFsbCBzaGFyZWRcbiAqIHNlcnZpY2VzLCBhbmQgZWFjaCBhbmd1bGFyIGFwcGxpY2F0aW9uIGluamVjdG9yIGhhcyB0aGUgcGxhdGZvcm0gaW5qZWN0b3IgYXMgaXRzIHBhcmVudC5cbiAqXG4gKiBFYWNoIGFwcGxpY2F0aW9uIGhhcyBpdHMgb3duIHByaXZhdGUgaW5qZWN0b3IgYXMgd2VsbC4gV2hlbiB0aGVyZSBhcmUgbXVsdGlwbGVcbiAqIGFwcGxpY2F0aW9ucyBvbiBhIHBhZ2UsIEFuZ3VsYXIgdHJlYXRzIGVhY2ggYXBwbGljYXRpb24gaW5qZWN0b3IncyBzZXJ2aWNlcyBhcyBwcml2YXRlXG4gKiB0byB0aGF0IGFwcGxpY2F0aW9uLlxuICpcbiAqICMjIEFQSVxuICpcbiAqIC0gYGFwcENvbXBvbmVudFR5cGVgOiBUaGUgcm9vdCBjb21wb25lbnQgd2hpY2ggc2hvdWxkIGFjdCBhcyB0aGUgYXBwbGljYXRpb24uIFRoaXMgaXNcbiAqICAgYSByZWZlcmVuY2UgdG8gYSBgVHlwZWAgd2hpY2ggaXMgYW5ub3RhdGVkIHdpdGggYEBDb21wb25lbnQoLi4uKWAuXG4gKiAtIGBjdXN0b21Qcm92aWRlcnNgOiBBbiBhZGRpdGlvbmFsIHNldCBvZiBwcm92aWRlcnMgdGhhdCBjYW4gYmUgYWRkZWQgdG8gdGhlXG4gKiAgIGFwcCBpbmplY3RvciB0byBvdmVycmlkZSBkZWZhdWx0IGluamVjdGlvbiBiZWhhdmlvci5cbiAqXG4gKiBSZXR1cm5zIGEgYFByb21pc2VgIG9mIHtAbGluayBDb21wb25lbnRSZWZ9LlxuICovXG5leHBvcnQgZnVuY3Rpb24gYm9vdHN0cmFwKFxuICAgIGFwcENvbXBvbmVudFR5cGU6IFR5cGUsXG4gICAgY3VzdG9tUHJvdmlkZXJzPzogQXJyYXk8YW55IC8qVHlwZSB8IFByb3ZpZGVyIHwgYW55W10qLz4pOiBQcm9taXNlPENvbXBvbmVudFJlZj4ge1xuICByZWZsZWN0b3IucmVmbGVjdGlvbkNhcGFiaWxpdGllcyA9IG5ldyBSZWZsZWN0aW9uQ2FwYWJpbGl0aWVzKCk7XG4gIGxldCBhcHBQcm92aWRlcnMgPVxuICAgICAgaXNQcmVzZW50KGN1c3RvbVByb3ZpZGVycykgPyBbQlJPV1NFUl9BUFBfUFJPVklERVJTLCBjdXN0b21Qcm92aWRlcnNdIDogQlJPV1NFUl9BUFBfUFJPVklERVJTO1xuICByZXR1cm4gcGxhdGZvcm0oQlJPV1NFUl9QUk9WSURFUlMpLmFwcGxpY2F0aW9uKGFwcFByb3ZpZGVycykuYm9vdHN0cmFwKGFwcENvbXBvbmVudFR5cGUpO1xufVxuIl19