import { APP_ID, DirectiveResolver, NgZone, Provider, ViewResolver, PLATFORM_COMMON_PROVIDERS, PLATFORM_INITIALIZER } from 'angular2/core';
import { BROWSER_APP_COMMON_PROVIDERS } from 'angular2/src/platform/browser_common';
import { BrowserDomAdapter } from 'angular2/src/platform/browser/browser_adapter';
import { AnimationBuilder } from 'angular2/src/animate/animation_builder';
import { MockAnimationBuilder } from 'angular2/src/mock/animation_builder_mock';
import { MockDirectiveResolver } from 'angular2/src/mock/directive_resolver_mock';
import { MockViewResolver } from 'angular2/src/mock/view_resolver_mock';
import { MockLocationStrategy } from 'angular2/src/mock/mock_location_strategy';
import { LocationStrategy } from 'angular2/src/router/location/location_strategy';
import { MockNgZone } from 'angular2/src/mock/ng_zone_mock';
import { XHRImpl } from "angular2/src/platform/browser/xhr_impl";
import { XHR } from 'angular2/compiler';
import { TestComponentBuilder } from 'angular2/src/testing/test_component_builder';
import { BrowserDetection } from 'angular2/src/testing/utils';
import { ELEMENT_PROBE_PROVIDERS } from 'angular2/platform/common_dom';
import { CONST_EXPR } from 'angular2/src/facade/lang';
import { Log } from 'angular2/src/testing/utils';
function initBrowserTests() {
    BrowserDomAdapter.makeCurrent();
    BrowserDetection.setup();
}
/**
 * Default patform providers for testing without a compiler.
 */
export const TEST_BROWSER_STATIC_PLATFORM_PROVIDERS = CONST_EXPR([
    PLATFORM_COMMON_PROVIDERS,
    new Provider(PLATFORM_INITIALIZER, { useValue: initBrowserTests, multi: true })
]);
export const ADDITIONAL_TEST_BROWSER_PROVIDERS = CONST_EXPR([
    new Provider(APP_ID, { useValue: 'a' }),
    ELEMENT_PROBE_PROVIDERS,
    new Provider(DirectiveResolver, { useClass: MockDirectiveResolver }),
    new Provider(ViewResolver, { useClass: MockViewResolver }),
    Log,
    TestComponentBuilder,
    new Provider(NgZone, { useClass: MockNgZone }),
    new Provider(LocationStrategy, { useClass: MockLocationStrategy }),
    new Provider(AnimationBuilder, { useClass: MockAnimationBuilder }),
]);
/**
 * Default application providers for testing without a compiler.
 */
export const TEST_BROWSER_STATIC_APPLICATION_PROVIDERS = CONST_EXPR([
    BROWSER_APP_COMMON_PROVIDERS,
    new Provider(XHR, { useClass: XHRImpl }),
    ADDITIONAL_TEST_BROWSER_PROVIDERS
]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJvd3Nlcl9zdGF0aWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLW9YRE80cDJ2LnRtcC9hbmd1bGFyMi9wbGF0Zm9ybS90ZXN0aW5nL2Jyb3dzZXJfc3RhdGljLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJPQUFPLEVBQ0wsTUFBTSxFQUNOLGlCQUFpQixFQUNqQixNQUFNLEVBQ04sUUFBUSxFQUNSLFlBQVksRUFDWix5QkFBeUIsRUFDekIsb0JBQW9CLEVBQ3JCLE1BQU0sZUFBZTtPQUNmLEVBQUMsNEJBQTRCLEVBQUMsTUFBTSxzQ0FBc0M7T0FDMUUsRUFBQyxpQkFBaUIsRUFBQyxNQUFNLCtDQUErQztPQUV4RSxFQUFDLGdCQUFnQixFQUFDLE1BQU0sd0NBQXdDO09BQ2hFLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSwwQ0FBMEM7T0FDdEUsRUFBQyxxQkFBcUIsRUFBQyxNQUFNLDJDQUEyQztPQUN4RSxFQUFDLGdCQUFnQixFQUFDLE1BQU0sc0NBQXNDO09BQzlELEVBQUMsb0JBQW9CLEVBQUMsTUFBTSwwQ0FBMEM7T0FDdEUsRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLGdEQUFnRDtPQUN4RSxFQUFDLFVBQVUsRUFBQyxNQUFNLGdDQUFnQztPQUVsRCxFQUFDLE9BQU8sRUFBQyxNQUFNLHdDQUF3QztPQUN2RCxFQUFDLEdBQUcsRUFBQyxNQUFNLG1CQUFtQjtPQUU5QixFQUFDLG9CQUFvQixFQUFDLE1BQU0sNkNBQTZDO09BRXpFLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSw0QkFBNEI7T0FFcEQsRUFBQyx1QkFBdUIsRUFBQyxNQUFNLDhCQUE4QjtPQUU3RCxFQUFDLFVBQVUsRUFBQyxNQUFNLDBCQUEwQjtPQUU1QyxFQUFDLEdBQUcsRUFBQyxNQUFNLDRCQUE0QjtBQUU5QztJQUNFLGlCQUFpQixDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ2hDLGdCQUFnQixDQUFDLEtBQUssRUFBRSxDQUFDO0FBQzNCLENBQUM7QUFFRDs7R0FFRztBQUNILE9BQU8sTUFBTSxzQ0FBc0MsR0FDL0MsVUFBVSxDQUFDO0lBQ1QseUJBQXlCO0lBQ3pCLElBQUksUUFBUSxDQUFDLG9CQUFvQixFQUFFLEVBQUMsUUFBUSxFQUFFLGdCQUFnQixFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUMsQ0FBQztDQUM5RSxDQUFDLENBQUM7QUFFUCxPQUFPLE1BQU0saUNBQWlDLEdBQzFDLFVBQVUsQ0FBQztJQUNULElBQUksUUFBUSxDQUFDLE1BQU0sRUFBRSxFQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUMsQ0FBQztJQUNyQyx1QkFBdUI7SUFDdkIsSUFBSSxRQUFRLENBQUMsaUJBQWlCLEVBQUUsRUFBQyxRQUFRLEVBQUUscUJBQXFCLEVBQUMsQ0FBQztJQUNsRSxJQUFJLFFBQVEsQ0FBQyxZQUFZLEVBQUUsRUFBQyxRQUFRLEVBQUUsZ0JBQWdCLEVBQUMsQ0FBQztJQUN4RCxHQUFHO0lBQ0gsb0JBQW9CO0lBQ3BCLElBQUksUUFBUSxDQUFDLE1BQU0sRUFBRSxFQUFDLFFBQVEsRUFBRSxVQUFVLEVBQUMsQ0FBQztJQUM1QyxJQUFJLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxFQUFDLFFBQVEsRUFBRSxvQkFBb0IsRUFBQyxDQUFDO0lBQ2hFLElBQUksUUFBUSxDQUFDLGdCQUFnQixFQUFFLEVBQUMsUUFBUSxFQUFFLG9CQUFvQixFQUFDLENBQUM7Q0FDakUsQ0FBQyxDQUFDO0FBRVA7O0dBRUc7QUFDSCxPQUFPLE1BQU0seUNBQXlDLEdBQ2xELFVBQVUsQ0FBQztJQUNULDRCQUE0QjtJQUM1QixJQUFJLFFBQVEsQ0FBQyxHQUFHLEVBQUUsRUFBQyxRQUFRLEVBQUUsT0FBTyxFQUFDLENBQUM7SUFDdEMsaUNBQWlDO0NBQ2xDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIEFQUF9JRCxcbiAgRGlyZWN0aXZlUmVzb2x2ZXIsXG4gIE5nWm9uZSxcbiAgUHJvdmlkZXIsXG4gIFZpZXdSZXNvbHZlcixcbiAgUExBVEZPUk1fQ09NTU9OX1BST1ZJREVSUyxcbiAgUExBVEZPUk1fSU5JVElBTElaRVJcbn0gZnJvbSAnYW5ndWxhcjIvY29yZSc7XG5pbXBvcnQge0JST1dTRVJfQVBQX0NPTU1PTl9QUk9WSURFUlN9IGZyb20gJ2FuZ3VsYXIyL3NyYy9wbGF0Zm9ybS9icm93c2VyX2NvbW1vbic7XG5pbXBvcnQge0Jyb3dzZXJEb21BZGFwdGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvcGxhdGZvcm0vYnJvd3Nlci9icm93c2VyX2FkYXB0ZXInO1xuXG5pbXBvcnQge0FuaW1hdGlvbkJ1aWxkZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9hbmltYXRlL2FuaW1hdGlvbl9idWlsZGVyJztcbmltcG9ydCB7TW9ja0FuaW1hdGlvbkJ1aWxkZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9tb2NrL2FuaW1hdGlvbl9idWlsZGVyX21vY2snO1xuaW1wb3J0IHtNb2NrRGlyZWN0aXZlUmVzb2x2ZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9tb2NrL2RpcmVjdGl2ZV9yZXNvbHZlcl9tb2NrJztcbmltcG9ydCB7TW9ja1ZpZXdSZXNvbHZlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL21vY2svdmlld19yZXNvbHZlcl9tb2NrJztcbmltcG9ydCB7TW9ja0xvY2F0aW9uU3RyYXRlZ3l9IGZyb20gJ2FuZ3VsYXIyL3NyYy9tb2NrL21vY2tfbG9jYXRpb25fc3RyYXRlZ3knO1xuaW1wb3J0IHtMb2NhdGlvblN0cmF0ZWd5fSBmcm9tICdhbmd1bGFyMi9zcmMvcm91dGVyL2xvY2F0aW9uL2xvY2F0aW9uX3N0cmF0ZWd5JztcbmltcG9ydCB7TW9ja05nWm9uZX0gZnJvbSAnYW5ndWxhcjIvc3JjL21vY2svbmdfem9uZV9tb2NrJztcblxuaW1wb3J0IHtYSFJJbXBsfSBmcm9tIFwiYW5ndWxhcjIvc3JjL3BsYXRmb3JtL2Jyb3dzZXIveGhyX2ltcGxcIjtcbmltcG9ydCB7WEhSfSBmcm9tICdhbmd1bGFyMi9jb21waWxlcic7XG5cbmltcG9ydCB7VGVzdENvbXBvbmVudEJ1aWxkZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy90ZXN0aW5nL3Rlc3RfY29tcG9uZW50X2J1aWxkZXInO1xuXG5pbXBvcnQge0Jyb3dzZXJEZXRlY3Rpb259IGZyb20gJ2FuZ3VsYXIyL3NyYy90ZXN0aW5nL3V0aWxzJztcblxuaW1wb3J0IHtFTEVNRU5UX1BST0JFX1BST1ZJREVSU30gZnJvbSAnYW5ndWxhcjIvcGxhdGZvcm0vY29tbW9uX2RvbSc7XG5cbmltcG9ydCB7Q09OU1RfRVhQUn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcblxuaW1wb3J0IHtMb2d9IGZyb20gJ2FuZ3VsYXIyL3NyYy90ZXN0aW5nL3V0aWxzJztcblxuZnVuY3Rpb24gaW5pdEJyb3dzZXJUZXN0cygpIHtcbiAgQnJvd3NlckRvbUFkYXB0ZXIubWFrZUN1cnJlbnQoKTtcbiAgQnJvd3NlckRldGVjdGlvbi5zZXR1cCgpO1xufVxuXG4vKipcbiAqIERlZmF1bHQgcGF0Zm9ybSBwcm92aWRlcnMgZm9yIHRlc3Rpbmcgd2l0aG91dCBhIGNvbXBpbGVyLlxuICovXG5leHBvcnQgY29uc3QgVEVTVF9CUk9XU0VSX1NUQVRJQ19QTEFURk9STV9QUk9WSURFUlM6IEFycmF5PGFueSAvKlR5cGUgfCBQcm92aWRlciB8IGFueVtdKi8+ID1cbiAgICBDT05TVF9FWFBSKFtcbiAgICAgIFBMQVRGT1JNX0NPTU1PTl9QUk9WSURFUlMsXG4gICAgICBuZXcgUHJvdmlkZXIoUExBVEZPUk1fSU5JVElBTElaRVIsIHt1c2VWYWx1ZTogaW5pdEJyb3dzZXJUZXN0cywgbXVsdGk6IHRydWV9KVxuICAgIF0pO1xuXG5leHBvcnQgY29uc3QgQURESVRJT05BTF9URVNUX0JST1dTRVJfUFJPVklERVJTOiBBcnJheTxhbnkgLypUeXBlIHwgUHJvdmlkZXIgfCBhbnlbXSovPiA9XG4gICAgQ09OU1RfRVhQUihbXG4gICAgICBuZXcgUHJvdmlkZXIoQVBQX0lELCB7dXNlVmFsdWU6ICdhJ30pLFxuICAgICAgRUxFTUVOVF9QUk9CRV9QUk9WSURFUlMsXG4gICAgICBuZXcgUHJvdmlkZXIoRGlyZWN0aXZlUmVzb2x2ZXIsIHt1c2VDbGFzczogTW9ja0RpcmVjdGl2ZVJlc29sdmVyfSksXG4gICAgICBuZXcgUHJvdmlkZXIoVmlld1Jlc29sdmVyLCB7dXNlQ2xhc3M6IE1vY2tWaWV3UmVzb2x2ZXJ9KSxcbiAgICAgIExvZyxcbiAgICAgIFRlc3RDb21wb25lbnRCdWlsZGVyLFxuICAgICAgbmV3IFByb3ZpZGVyKE5nWm9uZSwge3VzZUNsYXNzOiBNb2NrTmdab25lfSksXG4gICAgICBuZXcgUHJvdmlkZXIoTG9jYXRpb25TdHJhdGVneSwge3VzZUNsYXNzOiBNb2NrTG9jYXRpb25TdHJhdGVneX0pLFxuICAgICAgbmV3IFByb3ZpZGVyKEFuaW1hdGlvbkJ1aWxkZXIsIHt1c2VDbGFzczogTW9ja0FuaW1hdGlvbkJ1aWxkZXJ9KSxcbiAgICBdKTtcblxuLyoqXG4gKiBEZWZhdWx0IGFwcGxpY2F0aW9uIHByb3ZpZGVycyBmb3IgdGVzdGluZyB3aXRob3V0IGEgY29tcGlsZXIuXG4gKi9cbmV4cG9ydCBjb25zdCBURVNUX0JST1dTRVJfU1RBVElDX0FQUExJQ0FUSU9OX1BST1ZJREVSUzogQXJyYXk8YW55IC8qVHlwZSB8IFByb3ZpZGVyIHwgYW55W10qLz4gPVxuICAgIENPTlNUX0VYUFIoW1xuICAgICAgQlJPV1NFUl9BUFBfQ09NTU9OX1BST1ZJREVSUyxcbiAgICAgIG5ldyBQcm92aWRlcihYSFIsIHt1c2VDbGFzczogWEhSSW1wbH0pLFxuICAgICAgQURESVRJT05BTF9URVNUX0JST1dTRVJfUFJPVklERVJTXG4gICAgXSk7XG4iXX0=