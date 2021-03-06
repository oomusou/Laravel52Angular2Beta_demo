'use strict';"use strict";
var location_strategy_1 = require('angular2/src/router/location/location_strategy');
var path_location_strategy_1 = require('angular2/src/router/location/path_location_strategy');
var router_1 = require('angular2/src/router/router');
var route_registry_1 = require('angular2/src/router/route_registry');
var location_1 = require('angular2/src/router/location/location');
var lang_1 = require('angular2/src/facade/lang');
var core_1 = require('angular2/core');
var exceptions_1 = require('angular2/src/facade/exceptions');
/**
 * The Platform agnostic ROUTER PROVIDERS
 */
exports.ROUTER_PROVIDERS_COMMON = lang_1.CONST_EXPR([
    route_registry_1.RouteRegistry,
    lang_1.CONST_EXPR(new core_1.Provider(location_strategy_1.LocationStrategy, { useClass: path_location_strategy_1.PathLocationStrategy })),
    location_1.Location,
    lang_1.CONST_EXPR(new core_1.Provider(router_1.Router, {
        useFactory: routerFactory,
        deps: lang_1.CONST_EXPR([route_registry_1.RouteRegistry, location_1.Location, route_registry_1.ROUTER_PRIMARY_COMPONENT, core_1.ApplicationRef])
    })),
    lang_1.CONST_EXPR(new core_1.Provider(route_registry_1.ROUTER_PRIMARY_COMPONENT, { useFactory: routerPrimaryComponentFactory, deps: lang_1.CONST_EXPR([core_1.ApplicationRef]) }))
]);
function routerFactory(registry, location, primaryComponent, appRef) {
    var rootRouter = new router_1.RootRouter(registry, location, primaryComponent);
    appRef.registerDisposeListener(function () { return rootRouter.dispose(); });
    return rootRouter;
}
function routerPrimaryComponentFactory(app) {
    if (app.componentTypes.length == 0) {
        throw new exceptions_1.BaseException("Bootstrap at least one component before injecting Router.");
    }
    return app.componentTypes[0];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyX3Byb3ZpZGVyc19jb21tb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLWpha1huTW1MLnRtcC9hbmd1bGFyMi9zcmMvcm91dGVyL3JvdXRlcl9wcm92aWRlcnNfY29tbW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxrQ0FBK0IsZ0RBQWdELENBQUMsQ0FBQTtBQUNoRix1Q0FBbUMscURBQXFELENBQUMsQ0FBQTtBQUN6Rix1QkFBaUMsNEJBQTRCLENBQUMsQ0FBQTtBQUM5RCwrQkFBc0Qsb0NBQW9DLENBQUMsQ0FBQTtBQUMzRix5QkFBdUIsdUNBQXVDLENBQUMsQ0FBQTtBQUMvRCxxQkFBK0IsMEJBQTBCLENBQUMsQ0FBQTtBQUMxRCxxQkFBb0QsZUFBZSxDQUFDLENBQUE7QUFDcEUsMkJBQTRCLGdDQUFnQyxDQUFDLENBQUE7QUFFN0Q7O0dBRUc7QUFDVSwrQkFBdUIsR0FBVSxpQkFBVSxDQUFDO0lBQ3ZELDhCQUFhO0lBQ2IsaUJBQVUsQ0FBQyxJQUFJLGVBQVEsQ0FBQyxvQ0FBZ0IsRUFBRSxFQUFDLFFBQVEsRUFBRSw2Q0FBb0IsRUFBQyxDQUFDLENBQUM7SUFDNUUsbUJBQVE7SUFDUixpQkFBVSxDQUFDLElBQUksZUFBUSxDQUNuQixlQUFNLEVBQ047UUFDRSxVQUFVLEVBQUUsYUFBYTtRQUN6QixJQUFJLEVBQUUsaUJBQVUsQ0FBQyxDQUFDLDhCQUFhLEVBQUUsbUJBQVEsRUFBRSx5Q0FBd0IsRUFBRSxxQkFBYyxDQUFDLENBQUM7S0FDdEYsQ0FBQyxDQUFDO0lBQ1AsaUJBQVUsQ0FBQyxJQUFJLGVBQVEsQ0FDbkIseUNBQXdCLEVBQ3hCLEVBQUMsVUFBVSxFQUFFLDZCQUE2QixFQUFFLElBQUksRUFBRSxpQkFBVSxDQUFDLENBQUMscUJBQWMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO0NBQ3RGLENBQUMsQ0FBQztBQUVILHVCQUF1QixRQUF1QixFQUFFLFFBQWtCLEVBQUUsZ0JBQXNCLEVBQ25FLE1BQXNCO0lBQzNDLElBQUksVUFBVSxHQUFHLElBQUksbUJBQVUsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLGdCQUFnQixDQUFDLENBQUM7SUFDdEUsTUFBTSxDQUFDLHVCQUF1QixDQUFDLGNBQU0sT0FBQSxVQUFVLENBQUMsT0FBTyxFQUFFLEVBQXBCLENBQW9CLENBQUMsQ0FBQztJQUMzRCxNQUFNLENBQUMsVUFBVSxDQUFDO0FBQ3BCLENBQUM7QUFFRCx1Q0FBdUMsR0FBbUI7SUFDeEQsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuQyxNQUFNLElBQUksMEJBQWEsQ0FBQywyREFBMkQsQ0FBQyxDQUFDO0lBQ3ZGLENBQUM7SUFDRCxNQUFNLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMvQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtMb2NhdGlvblN0cmF0ZWd5fSBmcm9tICdhbmd1bGFyMi9zcmMvcm91dGVyL2xvY2F0aW9uL2xvY2F0aW9uX3N0cmF0ZWd5JztcbmltcG9ydCB7UGF0aExvY2F0aW9uU3RyYXRlZ3l9IGZyb20gJ2FuZ3VsYXIyL3NyYy9yb3V0ZXIvbG9jYXRpb24vcGF0aF9sb2NhdGlvbl9zdHJhdGVneSc7XG5pbXBvcnQge1JvdXRlciwgUm9vdFJvdXRlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL3JvdXRlci9yb3V0ZXInO1xuaW1wb3J0IHtSb3V0ZVJlZ2lzdHJ5LCBST1VURVJfUFJJTUFSWV9DT01QT05FTlR9IGZyb20gJ2FuZ3VsYXIyL3NyYy9yb3V0ZXIvcm91dGVfcmVnaXN0cnknO1xuaW1wb3J0IHtMb2NhdGlvbn0gZnJvbSAnYW5ndWxhcjIvc3JjL3JvdXRlci9sb2NhdGlvbi9sb2NhdGlvbic7XG5pbXBvcnQge0NPTlNUX0VYUFIsIFR5cGV9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge0FwcGxpY2F0aW9uUmVmLCBPcGFxdWVUb2tlbiwgUHJvdmlkZXJ9IGZyb20gJ2FuZ3VsYXIyL2NvcmUnO1xuaW1wb3J0IHtCYXNlRXhjZXB0aW9ufSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2V4Y2VwdGlvbnMnO1xuXG4vKipcbiAqIFRoZSBQbGF0Zm9ybSBhZ25vc3RpYyBST1VURVIgUFJPVklERVJTXG4gKi9cbmV4cG9ydCBjb25zdCBST1VURVJfUFJPVklERVJTX0NPTU1PTjogYW55W10gPSBDT05TVF9FWFBSKFtcbiAgUm91dGVSZWdpc3RyeSxcbiAgQ09OU1RfRVhQUihuZXcgUHJvdmlkZXIoTG9jYXRpb25TdHJhdGVneSwge3VzZUNsYXNzOiBQYXRoTG9jYXRpb25TdHJhdGVneX0pKSxcbiAgTG9jYXRpb24sXG4gIENPTlNUX0VYUFIobmV3IFByb3ZpZGVyKFxuICAgICAgUm91dGVyLFxuICAgICAge1xuICAgICAgICB1c2VGYWN0b3J5OiByb3V0ZXJGYWN0b3J5LFxuICAgICAgICBkZXBzOiBDT05TVF9FWFBSKFtSb3V0ZVJlZ2lzdHJ5LCBMb2NhdGlvbiwgUk9VVEVSX1BSSU1BUllfQ09NUE9ORU5ULCBBcHBsaWNhdGlvblJlZl0pXG4gICAgICB9KSksXG4gIENPTlNUX0VYUFIobmV3IFByb3ZpZGVyKFxuICAgICAgUk9VVEVSX1BSSU1BUllfQ09NUE9ORU5ULFxuICAgICAge3VzZUZhY3Rvcnk6IHJvdXRlclByaW1hcnlDb21wb25lbnRGYWN0b3J5LCBkZXBzOiBDT05TVF9FWFBSKFtBcHBsaWNhdGlvblJlZl0pfSkpXG5dKTtcblxuZnVuY3Rpb24gcm91dGVyRmFjdG9yeShyZWdpc3RyeTogUm91dGVSZWdpc3RyeSwgbG9jYXRpb246IExvY2F0aW9uLCBwcmltYXJ5Q29tcG9uZW50OiBUeXBlLFxuICAgICAgICAgICAgICAgICAgICAgICBhcHBSZWY6IEFwcGxpY2F0aW9uUmVmKTogUm9vdFJvdXRlciB7XG4gIHZhciByb290Um91dGVyID0gbmV3IFJvb3RSb3V0ZXIocmVnaXN0cnksIGxvY2F0aW9uLCBwcmltYXJ5Q29tcG9uZW50KTtcbiAgYXBwUmVmLnJlZ2lzdGVyRGlzcG9zZUxpc3RlbmVyKCgpID0+IHJvb3RSb3V0ZXIuZGlzcG9zZSgpKTtcbiAgcmV0dXJuIHJvb3RSb3V0ZXI7XG59XG5cbmZ1bmN0aW9uIHJvdXRlclByaW1hcnlDb21wb25lbnRGYWN0b3J5KGFwcDogQXBwbGljYXRpb25SZWYpOiBUeXBlIHtcbiAgaWYgKGFwcC5jb21wb25lbnRUeXBlcy5sZW5ndGggPT0gMCkge1xuICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKFwiQm9vdHN0cmFwIGF0IGxlYXN0IG9uZSBjb21wb25lbnQgYmVmb3JlIGluamVjdGluZyBSb3V0ZXIuXCIpO1xuICB9XG4gIHJldHVybiBhcHAuY29tcG9uZW50VHlwZXNbMF07XG59XG4iXX0=