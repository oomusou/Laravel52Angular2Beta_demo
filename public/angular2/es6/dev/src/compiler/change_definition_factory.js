import { ListWrapper, StringMapWrapper } from 'angular2/src/facade/collection';
import { isPresent } from 'angular2/src/facade/lang';
import { reflector } from 'angular2/src/core/reflection/reflection';
import { DirectiveIndex, BindingRecord, DirectiveRecord, ChangeDetectionStrategy, ChangeDetectorDefinition } from 'angular2/src/core/change_detection/change_detection';
import { PropertyBindingType, templateVisitAll } from './template_ast';
import { LifecycleHooks } from 'angular2/src/core/linker/interfaces';
export function createChangeDetectorDefinitions(componentType, componentStrategy, genConfig, parsedTemplate) {
    var pvVisitors = [];
    var visitor = new ProtoViewVisitor(null, pvVisitors, componentStrategy);
    templateVisitAll(visitor, parsedTemplate);
    return createChangeDefinitions(pvVisitors, componentType, genConfig);
}
class ProtoViewVisitor {
    constructor(parent, allVisitors, strategy) {
        this.parent = parent;
        this.allVisitors = allVisitors;
        this.strategy = strategy;
        this.nodeCount = 0;
        this.boundElementCount = 0;
        this.variableNames = [];
        this.bindingRecords = [];
        this.eventRecords = [];
        this.directiveRecords = [];
        this.viewIndex = allVisitors.length;
        allVisitors.push(this);
    }
    visitEmbeddedTemplate(ast, context) {
        this.nodeCount++;
        this.boundElementCount++;
        templateVisitAll(this, ast.outputs);
        for (var i = 0; i < ast.directives.length; i++) {
            ast.directives[i].visit(this, i);
        }
        var childVisitor = new ProtoViewVisitor(this, this.allVisitors, ChangeDetectionStrategy.Default);
        // Attention: variables present on an embedded template count towards
        // the embedded template and not the template anchor!
        templateVisitAll(childVisitor, ast.vars);
        templateVisitAll(childVisitor, ast.children);
        return null;
    }
    visitElement(ast, context) {
        this.nodeCount++;
        if (ast.isBound()) {
            this.boundElementCount++;
        }
        templateVisitAll(this, ast.inputs, null);
        templateVisitAll(this, ast.outputs);
        templateVisitAll(this, ast.exportAsVars);
        for (var i = 0; i < ast.directives.length; i++) {
            ast.directives[i].visit(this, i);
        }
        templateVisitAll(this, ast.children);
        return null;
    }
    visitNgContent(ast, context) { return null; }
    visitVariable(ast, context) {
        this.variableNames.push(ast.name);
        return null;
    }
    visitEvent(ast, directiveRecord) {
        var bindingRecord = isPresent(directiveRecord) ?
            BindingRecord.createForHostEvent(ast.handler, ast.fullName, directiveRecord) :
            BindingRecord.createForEvent(ast.handler, ast.fullName, this.boundElementCount - 1);
        this.eventRecords.push(bindingRecord);
        return null;
    }
    visitElementProperty(ast, directiveRecord) {
        var boundElementIndex = this.boundElementCount - 1;
        var dirIndex = isPresent(directiveRecord) ? directiveRecord.directiveIndex : null;
        var bindingRecord;
        if (ast.type === PropertyBindingType.Property) {
            bindingRecord =
                isPresent(dirIndex) ?
                    BindingRecord.createForHostProperty(dirIndex, ast.value, ast.name) :
                    BindingRecord.createForElementProperty(ast.value, boundElementIndex, ast.name);
        }
        else if (ast.type === PropertyBindingType.Attribute) {
            bindingRecord =
                isPresent(dirIndex) ?
                    BindingRecord.createForHostAttribute(dirIndex, ast.value, ast.name) :
                    BindingRecord.createForElementAttribute(ast.value, boundElementIndex, ast.name);
        }
        else if (ast.type === PropertyBindingType.Class) {
            bindingRecord =
                isPresent(dirIndex) ?
                    BindingRecord.createForHostClass(dirIndex, ast.value, ast.name) :
                    BindingRecord.createForElementClass(ast.value, boundElementIndex, ast.name);
        }
        else if (ast.type === PropertyBindingType.Style) {
            bindingRecord =
                isPresent(dirIndex) ?
                    BindingRecord.createForHostStyle(dirIndex, ast.value, ast.name, ast.unit) :
                    BindingRecord.createForElementStyle(ast.value, boundElementIndex, ast.name, ast.unit);
        }
        this.bindingRecords.push(bindingRecord);
        return null;
    }
    visitAttr(ast, context) { return null; }
    visitBoundText(ast, context) {
        var nodeIndex = this.nodeCount++;
        this.bindingRecords.push(BindingRecord.createForTextNode(ast.value, nodeIndex));
        return null;
    }
    visitText(ast, context) {
        this.nodeCount++;
        return null;
    }
    visitDirective(ast, directiveIndexAsNumber) {
        var directiveIndex = new DirectiveIndex(this.boundElementCount - 1, directiveIndexAsNumber);
        var directiveMetadata = ast.directive;
        var outputsArray = [];
        StringMapWrapper.forEach(ast.directive.outputs, (eventName, dirProperty) => outputsArray.push([dirProperty, eventName]));
        var directiveRecord = new DirectiveRecord({
            directiveIndex: directiveIndex,
            callAfterContentInit: directiveMetadata.lifecycleHooks.indexOf(LifecycleHooks.AfterContentInit) !== -1,
            callAfterContentChecked: directiveMetadata.lifecycleHooks.indexOf(LifecycleHooks.AfterContentChecked) !== -1,
            callAfterViewInit: directiveMetadata.lifecycleHooks.indexOf(LifecycleHooks.AfterViewInit) !== -1,
            callAfterViewChecked: directiveMetadata.lifecycleHooks.indexOf(LifecycleHooks.AfterViewChecked) !== -1,
            callOnChanges: directiveMetadata.lifecycleHooks.indexOf(LifecycleHooks.OnChanges) !== -1,
            callDoCheck: directiveMetadata.lifecycleHooks.indexOf(LifecycleHooks.DoCheck) !== -1,
            callOnInit: directiveMetadata.lifecycleHooks.indexOf(LifecycleHooks.OnInit) !== -1,
            callOnDestroy: directiveMetadata.lifecycleHooks.indexOf(LifecycleHooks.OnDestroy) !== -1,
            changeDetection: directiveMetadata.changeDetection,
            outputs: outputsArray
        });
        this.directiveRecords.push(directiveRecord);
        templateVisitAll(this, ast.inputs, directiveRecord);
        var bindingRecords = this.bindingRecords;
        if (directiveRecord.callOnChanges) {
            bindingRecords.push(BindingRecord.createDirectiveOnChanges(directiveRecord));
        }
        if (directiveRecord.callOnInit) {
            bindingRecords.push(BindingRecord.createDirectiveOnInit(directiveRecord));
        }
        if (directiveRecord.callDoCheck) {
            bindingRecords.push(BindingRecord.createDirectiveDoCheck(directiveRecord));
        }
        templateVisitAll(this, ast.hostProperties, directiveRecord);
        templateVisitAll(this, ast.hostEvents, directiveRecord);
        templateVisitAll(this, ast.exportAsVars);
        return null;
    }
    visitDirectiveProperty(ast, directiveRecord) {
        // TODO: these setters should eventually be created by change detection, to make
        // it monomorphic!
        var setter = reflector.setter(ast.directiveName);
        this.bindingRecords.push(BindingRecord.createForDirective(ast.value, ast.directiveName, setter, directiveRecord));
        return null;
    }
}
function createChangeDefinitions(pvVisitors, componentType, genConfig) {
    var pvVariableNames = _collectNestedProtoViewsVariableNames(pvVisitors);
    return pvVisitors.map(pvVisitor => {
        var id = `${componentType.name}_${pvVisitor.viewIndex}`;
        return new ChangeDetectorDefinition(id, pvVisitor.strategy, pvVariableNames[pvVisitor.viewIndex], pvVisitor.bindingRecords, pvVisitor.eventRecords, pvVisitor.directiveRecords, genConfig);
    });
}
function _collectNestedProtoViewsVariableNames(pvVisitors) {
    var nestedPvVariableNames = ListWrapper.createFixedSize(pvVisitors.length);
    pvVisitors.forEach((pv) => {
        var parentVariableNames = isPresent(pv.parent) ? nestedPvVariableNames[pv.parent.viewIndex] : [];
        nestedPvVariableNames[pv.viewIndex] = parentVariableNames.concat(pv.variableNames);
    });
    return nestedPvVariableNames;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhbmdlX2RlZmluaXRpb25fZmFjdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtb1hETzRwMnYudG1wL2FuZ3VsYXIyL3NyYy9jb21waWxlci9jaGFuZ2VfZGVmaW5pdGlvbl9mYWN0b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJPQUFPLEVBQUMsV0FBVyxFQUFFLGdCQUFnQixFQUFDLE1BQU0sZ0NBQWdDO09BQ3JFLEVBQUMsU0FBUyxFQUFVLE1BQU0sMEJBQTBCO09BQ3BELEVBQUMsU0FBUyxFQUFDLE1BQU0seUNBQXlDO09BRTFELEVBQ0wsY0FBYyxFQUNkLGFBQWEsRUFDYixlQUFlLEVBQ2YsdUJBQXVCLEVBQ3ZCLHdCQUF3QixFQUd6QixNQUFNLHFEQUFxRDtPQUdyRCxFQUlMLG1CQUFtQixFQUduQixnQkFBZ0IsRUFTakIsTUFBTSxnQkFBZ0I7T0FDaEIsRUFBQyxjQUFjLEVBQUMsTUFBTSxxQ0FBcUM7QUFFbEUsZ0RBQ0ksYUFBa0MsRUFBRSxpQkFBMEMsRUFDOUUsU0FBa0MsRUFBRSxjQUE2QjtJQUNuRSxJQUFJLFVBQVUsR0FBRyxFQUFFLENBQUM7SUFDcEIsSUFBSSxPQUFPLEdBQUcsSUFBSSxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLGlCQUFpQixDQUFDLENBQUM7SUFDeEUsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLGNBQWMsQ0FBQyxDQUFDO0lBQzFDLE1BQU0sQ0FBQyx1QkFBdUIsQ0FBQyxVQUFVLEVBQUUsYUFBYSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQ3ZFLENBQUM7QUFFRDtJQVNFLFlBQW1CLE1BQXdCLEVBQVMsV0FBK0IsRUFDaEUsUUFBaUM7UUFEakMsV0FBTSxHQUFOLE1BQU0sQ0FBa0I7UUFBUyxnQkFBVyxHQUFYLFdBQVcsQ0FBb0I7UUFDaEUsYUFBUSxHQUFSLFFBQVEsQ0FBeUI7UUFScEQsY0FBUyxHQUFXLENBQUMsQ0FB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Q0FBQyxRQUFRLEVBQUUsZUFBZSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsRUFBRSxTQUFTLENBQUMsY0FBYyxFQUN0RixTQUFTLENBQUMsWUFBWSxFQUFFLFNBQVMsQ0FBQyxnQkFBZ0IsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUVyRSxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFFRCwrQ0FBK0MsVUFBOEI7SUFDM0UsSUFBSSxxQkFBcUIsR0FBZSxXQUFXLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN2RixVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRTtRQUNwQixJQUFJLG1CQUFtQixHQUNuQixTQUFTLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxHQUFHLHFCQUFxQixDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQzNFLHFCQUFxQixDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsR0FBRyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQ3JGLENBQUMsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxDQUFDLHFCQUFxQixDQUFDO0FBQy9CLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0xpc3RXcmFwcGVyLCBTdHJpbmdNYXBXcmFwcGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2NvbGxlY3Rpb24nO1xuaW1wb3J0IHtpc1ByZXNlbnQsIGlzQmxhbmt9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge3JlZmxlY3Rvcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvcmVmbGVjdGlvbi9yZWZsZWN0aW9uJztcblxuaW1wb3J0IHtcbiAgRGlyZWN0aXZlSW5kZXgsXG4gIEJpbmRpbmdSZWNvcmQsXG4gIERpcmVjdGl2ZVJlY29yZCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yRGVmaW5pdGlvbixcbiAgQ2hhbmdlRGV0ZWN0b3JHZW5Db25maWcsXG4gIEFTVFdpdGhTb3VyY2Vcbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvY2hhbmdlX2RldGVjdGlvbi9jaGFuZ2VfZGV0ZWN0aW9uJztcblxuaW1wb3J0IHtDb21waWxlRGlyZWN0aXZlTWV0YWRhdGEsIENvbXBpbGVUeXBlTWV0YWRhdGF9IGZyb20gJy4vZGlyZWN0aXZlX21ldGFkYXRhJztcbmltcG9ydCB7XG4gIFRlbXBsYXRlQXN0LFxuICBFbGVtZW50QXN0LFxuICBCb3VuZFRleHRBc3QsXG4gIFByb3BlcnR5QmluZGluZ1R5cGUsXG4gIERpcmVjdGl2ZUFzdCxcbiAgVGVtcGxhdGVBc3RWaXNpdG9yLFxuICB0ZW1wbGF0ZVZpc2l0QWxsLFxuICBOZ0NvbnRlbnRBc3QsXG4gIEVtYmVkZGVkVGVtcGxhdGVBc3QsXG4gIFZhcmlhYmxlQXN0LFxuICBCb3VuZEVsZW1lbnRQcm9wZXJ0eUFzdCxcbiAgQm91bmRFdmVudEFzdCxcbiAgQm91bmREaXJlY3RpdmVQcm9wZXJ0eUFzdCxcbiAgQXR0ckFzdCxcbiAgVGV4dEFzdFxufSBmcm9tICcuL3RlbXBsYXRlX2FzdCc7XG5pbXBvcnQge0xpZmVjeWNsZUhvb2tzfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9saW5rZXIvaW50ZXJmYWNlcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVDaGFuZ2VEZXRlY3RvckRlZmluaXRpb25zKFxuICAgIGNvbXBvbmVudFR5cGU6IENvbXBpbGVUeXBlTWV0YWRhdGEsIGNvbXBvbmVudFN0cmF0ZWd5OiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgICBnZW5Db25maWc6IENoYW5nZURldGVjdG9yR2VuQ29uZmlnLCBwYXJzZWRUZW1wbGF0ZTogVGVtcGxhdGVBc3RbXSk6IENoYW5nZURldGVjdG9yRGVmaW5pdGlvbltdIHtcbiAgdmFyIHB2VmlzaXRvcnMgPSBbXTtcbiAgdmFyIHZpc2l0b3IgPSBuZXcgUHJvdG9WaWV3VmlzaXRvcihudWxsLCBwdlZpc2l0b3JzLCBjb21wb25lbnRTdHJhdGVneSk7XG4gIHRlbXBsYXRlVmlzaXRBbGwodmlzaXRvciwgcGFyc2VkVGVtcGxhdGUpO1xuICByZXR1cm4gY3JlYXRlQ2hhbmdlRGVmaW5pdGlvbnMocHZWaXNpdG9ycywgY29tcG9uZW50VHlwZSwgZ2VuQ29uZmlnKTtcbn1cblxuY2xhc3MgUHJvdG9WaWV3VmlzaXRvciBpbXBsZW1lbnRzIFRlbXBsYXRlQXN0VmlzaXRvciB7XG4gIHZpZXdJbmRleDogbnVtYmVyO1xuICBub2RlQ291bnQ6IG51bWJlciA9IDA7XG4gIGJvdW5kRWxlbWVudENvdW50OiBudW1iZXIgPSAwO1xuICB2YXJpYWJsZU5hbWVzOiBzdHJpbmdbXSA9IFtdO1xuICBiaW5kaW5nUmVjb3JkczogQmluZGluZ1JlY29yZFtdID0gW107XG4gIGV2ZW50UmVjb3JkczogQmluZGluZ1JlY29yZFtdID0gW107XG4gIGRpcmVjdGl2ZVJlY29yZHM6IERpcmVjdGl2ZVJlY29yZFtdID0gW107XG5cbiAgY29uc3RydWN0b3IocHVibGljIHBhcmVudDogUHJvdG9WaWV3VmlzaXRvciwgcHVibGljIGFsbFZpc2l0b3JzOiBQcm90b1ZpZXdWaXNpdG9yW10sXG4gICAgICAgICAgICAgIHB1YmxpYyBzdHJhdGVneTogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kpIHtcbiAgICB0aGlzLnZpZXdJbmRleCA9IGFsbFZpc2l0b3JzLmxlbmd0aDtcbiAgICBhbGxWaXNpdG9ycy5wdXNoKHRoaXMpO1xuICB9XG5cbiAgdmlzaXRFbWJlZGRlZFRlbXBsYXRlKGFzdDogRW1iZWRkZWRUZW1wbGF0ZUFzdCwgY29udGV4dDogYW55KTogYW55IHtcbiAgICB0aGlzLm5vZGVDb3VudCsrO1xuICAgIHRoaXMuYm91bmRFbGVtZW50Q291bnQrKztcbiAgICB0ZW1wbGF0ZVZpc2l0QWxsKHRoaXMsIGFzdC5vdXRwdXRzKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFzdC5kaXJlY3RpdmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBhc3QuZGlyZWN0aXZlc1tpXS52aXNpdCh0aGlzLCBpKTtcbiAgICB9XG5cbiAgICB2YXIgY2hpbGRWaXNpdG9yID1cbiAgICAgICAgbmV3IFByb3RvVmlld1Zpc2l0b3IodGhpcywgdGhpcy5hbGxWaXNpdG9ycywgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuRGVmYXVsdCk7XG4gICAgLy8gQXR0ZW50aW9uOiB2YXJpYWJsZXMgcHJlc2VudCBvbiBhbiBlbWJlZGRlZCB0ZW1wbGF0ZSBjb3VudCB0b3dhcmRzXG4gICAgLy8gdGhlIGVtYmVkZGVkIHRlbXBsYXRlIGFuZCBub3QgdGhlIHRlbXBsYXRlIGFuY2hvciFcbiAgICB0ZW1wbGF0ZVZpc2l0QWxsKGNoaWxkVmlzaXRvciwgYXN0LnZhcnMpO1xuICAgIHRlbXBsYXRlVmlzaXRBbGwoY2hpbGRWaXNpdG9yLCBhc3QuY2hpbGRyZW4pO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgdmlzaXRFbGVtZW50KGFzdDogRWxlbWVudEFzdCwgY29udGV4dDogYW55KTogYW55IHtcbiAgICB0aGlzLm5vZGVDb3VudCsrO1xuICAgIGlmIChhc3QuaXNCb3VuZCgpKSB7XG4gICAgICB0aGlzLmJvdW5kRWxlbWVudENvdW50Kys7XG4gICAgfVxuICAgIHRlbXBsYXRlVmlzaXRBbGwodGhpcywgYXN0LmlucHV0cywgbnVsbCk7XG4gICAgdGVtcGxhdGVWaXNpdEFsbCh0aGlzLCBhc3Qub3V0cHV0cyk7XG4gICAgdGVtcGxhdGVWaXNpdEFsbCh0aGlzLCBhc3QuZXhwb3J0QXNWYXJzKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFzdC5kaXJlY3RpdmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBhc3QuZGlyZWN0aXZlc1tpXS52aXNpdCh0aGlzLCBpKTtcbiAgICB9XG4gICAgdGVtcGxhdGVWaXNpdEFsbCh0aGlzLCBhc3QuY2hpbGRyZW4pO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgdmlzaXROZ0NvbnRlbnQoYXN0OiBOZ0NvbnRlbnRBc3QsIGNvbnRleHQ6IGFueSk6IGFueSB7IHJldHVybiBudWxsOyB9XG5cbiAgdmlzaXRWYXJpYWJsZShhc3Q6IFZhcmlhYmxlQXN0LCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHRoaXMudmFyaWFibGVOYW1lcy5wdXNoKGFzdC5uYW1lKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHZpc2l0RXZlbnQoYXN0OiBCb3VuZEV2ZW50QXN0LCBkaXJlY3RpdmVSZWNvcmQ6IERpcmVjdGl2ZVJlY29yZCk6IGFueSB7XG4gICAgdmFyIGJpbmRpbmdSZWNvcmQgPVxuICAgICAgICBpc1ByZXNlbnQoZGlyZWN0aXZlUmVjb3JkKSA/XG4gICAgICAgICAgICBCaW5kaW5nUmVjb3JkLmNyZWF0ZUZvckhvc3RFdmVudChhc3QuaGFuZGxlciwgYXN0LmZ1bGxOYW1lLCBkaXJlY3RpdmVSZWNvcmQpIDpcbiAgICAgICAgICAgIEJpbmRpbmdSZWNvcmQuY3JlYXRlRm9yRXZlbnQoYXN0LmhhbmRsZXIsIGFzdC5mdWxsTmFtZSwgdGhpcy5ib3VuZEVsZW1lbnRDb3VudCAtIDEpO1xuICAgIHRoaXMuZXZlbnRSZWNvcmRzLnB1c2goYmluZGluZ1JlY29yZCk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICB2aXNpdEVsZW1lbnRQcm9wZXJ0eShhc3Q6IEJvdW5kRWxlbWVudFByb3BlcnR5QXN0LCBkaXJlY3RpdmVSZWNvcmQ6IERpcmVjdGl2ZVJlY29yZCk6IGFueSB7XG4gICAgdmFyIGJvdW5kRWxlbWVudEluZGV4ID0gdGhpcy5ib3VuZEVsZW1lbnRDb3VudCAtIDE7XG4gICAgdmFyIGRpckluZGV4ID0gaXNQcmVzZW50KGRpcmVjdGl2ZVJlY29yZCkgPyBkaXJlY3RpdmVSZWNvcmQuZGlyZWN0aXZlSW5kZXggOiBudWxsO1xuICAgIHZhciBiaW5kaW5nUmVjb3JkO1xuICAgIGlmIChhc3QudHlwZSA9PT0gUHJvcGVydHlCaW5kaW5nVHlwZS5Qcm9wZXJ0eSkge1xuICAgICAgYmluZGluZ1JlY29yZCA9XG4gICAgICAgICAgaXNQcmVzZW50KGRpckluZGV4KSA/XG4gICAgICAgICAgICAgIEJpbmRpbmdSZWNvcmQuY3JlYXRlRm9ySG9zdFByb3BlcnR5KGRpckluZGV4LCBhc3QudmFsdWUsIGFzdC5uYW1lKSA6XG4gICAgICAgICAgICAgIEJpbmRpbmdSZWNvcmQuY3JlYXRlRm9yRWxlbWVudFByb3BlcnR5KGFzdC52YWx1ZSwgYm91bmRFbGVtZW50SW5kZXgsIGFzdC5uYW1lKTtcbiAgICB9IGVsc2UgaWYgKGFzdC50eXBlID09PSBQcm9wZXJ0eUJpbmRpbmdUeXBlLkF0dHJpYnV0ZSkge1xuICAgICAgYmluZGluZ1JlY29yZCA9XG4gICAgICAgICAgaXNQcmVzZW50KGRpckluZGV4KSA/XG4gICAgICAgICAgICAgIEJpbmRpbmdSZWNvcmQuY3JlYXRlRm9ySG9zdEF0dHJpYnV0ZShkaXJJbmRleCwgYXN0LnZhbHVlLCBhc3QubmFtZSkgOlxuICAgICAgICAgICAgICBCaW5kaW5nUmVjb3JkLmNyZWF0ZUZvckVsZW1lbnRBdHRyaWJ1dGUoYXN0LnZhbHVlLCBib3VuZEVsZW1lbnRJbmRleCwgYXN0Lm5hbWUpO1xuICAgIH0gZWxzZSBpZiAoYXN0LnR5cGUgPT09IFByb3BlcnR5QmluZGluZ1R5cGUuQ2xhc3MpIHtcbiAgICAgIGJpbmRpbmdSZWNvcmQgPVxuICAgICAgICAgIGlzUHJlc2VudChkaXJJbmRleCkgP1xuICAgICAgICAgICAgICBCaW5kaW5nUmVjb3JkLmNyZWF0ZUZvckhvc3RDbGFzcyhkaXJJbmRleCwgYXN0LnZhbHVlLCBhc3QubmFtZSkgOlxuICAgICAgICAgICAgICBCaW5kaW5nUmVjb3JkLmNyZWF0ZUZvckVsZW1lbnRDbGFzcyhhc3QudmFsdWUsIGJvdW5kRWxlbWVudEluZGV4LCBhc3QubmFtZSk7XG4gICAgfSBlbHNlIGlmIChhc3QudHlwZSA9PT0gUHJvcGVydHlCaW5kaW5nVHlwZS5TdHlsZSkge1xuICAgICAgYmluZGluZ1JlY29yZCA9XG4gICAgICAgICAgaXNQcmVzZW50KGRpckluZGV4KSA/XG4gICAgICAgICAgICAgIEJpbmRpbmdSZWNvcmQuY3JlYXRlRm9ySG9zdFN0eWxlKGRpckluZGV4LCBhc3QudmFsdWUsIGFzdC5uYW1lLCBhc3QudW5pdCkgOlxuICAgICAgICAgICAgICBCaW5kaW5nUmVjb3JkLmNyZWF0ZUZvckVsZW1lbnRTdHlsZShhc3QudmFsdWUsIGJvdW5kRWxlbWVudEluZGV4LCBhc3QubmFtZSwgYXN0LnVuaXQpO1xuICAgIH1cbiAgICB0aGlzLmJpbmRpbmdSZWNvcmRzLnB1c2goYmluZGluZ1JlY29yZCk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgdmlzaXRBdHRyKGFzdDogQXR0ckFzdCwgY29udGV4dDogYW55KTogYW55IHsgcmV0dXJuIG51bGw7IH1cbiAgdmlzaXRCb3VuZFRleHQoYXN0OiBCb3VuZFRleHRBc3QsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgdmFyIG5vZGVJbmRleCA9IHRoaXMubm9kZUNvdW50Kys7XG4gICAgdGhpcy5iaW5kaW5nUmVjb3Jkcy5wdXNoKEJpbmRpbmdSZWNvcmQuY3JlYXRlRm9yVGV4dE5vZGUoYXN0LnZhbHVlLCBub2RlSW5kZXgpKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICB2aXNpdFRleHQoYXN0OiBUZXh0QXN0LCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHRoaXMubm9kZUNvdW50Kys7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgdmlzaXREaXJlY3RpdmUoYXN0OiBEaXJlY3RpdmVBc3QsIGRpcmVjdGl2ZUluZGV4QXNOdW1iZXI6IG51bWJlcik6IGFueSB7XG4gICAgdmFyIGRpcmVjdGl2ZUluZGV4ID0gbmV3IERpcmVjdGl2ZUluZGV4KHRoaXMuYm91bmRFbGVtZW50Q291bnQgLSAxLCBkaXJlY3RpdmVJbmRleEFzTnVtYmVyKTtcbiAgICB2YXIgZGlyZWN0aXZlTWV0YWRhdGEgPSBhc3QuZGlyZWN0aXZlO1xuICAgIHZhciBvdXRwdXRzQXJyYXkgPSBbXTtcbiAgICBTdHJpbmdNYXBXcmFwcGVyLmZvckVhY2goXG4gICAgICAgIGFzdC5kaXJlY3RpdmUub3V0cHV0cyxcbiAgICAgICAgKGV2ZW50TmFtZTogc3RyaW5nLCBkaXJQcm9wZXJ0eTogc3RyaW5nKSA9PiBvdXRwdXRzQXJyYXkucHVzaChbZGlyUHJvcGVydHksIGV2ZW50TmFtZV0pKTtcbiAgICB2YXIgZGlyZWN0aXZlUmVjb3JkID0gbmV3IERpcmVjdGl2ZVJlY29yZCh7XG4gICAgICBkaXJlY3RpdmVJbmRleDogZGlyZWN0aXZlSW5kZXgsXG4gICAgICBjYWxsQWZ0ZXJDb250ZW50SW5pdDpcbiAgICAgICAgICBkaXJlY3RpdmVNZXRhZGF0YS5saWZlY3ljbGVIb29rcy5pbmRleE9mKExpZmVjeWNsZUhvb2tzLkFmdGVyQ29udGVudEluaXQpICE9PSAtMSxcbiAgICAgIGNhbGxBZnRlckNvbnRlbnRDaGVja2VkOlxuICAgICAgICAgIGRpcmVjdGl2ZU1ldGFkYXRhLmxpZmVjeWNsZUhvb2tzLmluZGV4T2YoTGlmZWN5Y2xlSG9va3MuQWZ0ZXJDb250ZW50Q2hlY2tlZCkgIT09IC0xLFxuICAgICAgY2FsbEFmdGVyVmlld0luaXQ6XG4gICAgICAgICAgZGlyZWN0aXZlTWV0YWRhdGEubGlmZWN5Y2xlSG9va3MuaW5kZXhPZihMaWZlY3ljbGVIb29rcy5BZnRlclZpZXdJbml0KSAhPT0gLTEsXG4gICAgICBjYWxsQWZ0ZXJWaWV3Q2hlY2tlZDpcbiAgICAgICAgICBkaXJlY3RpdmVNZXRhZGF0YS5saWZlY3ljbGVIb29rcy5pbmRleE9mKExpZmVjeWNsZUhvb2tzLkFmdGVyVmlld0NoZWNrZWQpICE9PSAtMSxcbiAgICAgIGNhbGxPbkNoYW5nZXM6IGRpcmVjdGl2ZU1ldGFkYXRhLmxpZmVjeWNsZUhvb2tzLmluZGV4T2YoTGlmZWN5Y2xlSG9va3MuT25DaGFuZ2VzKSAhPT0gLTEsXG4gICAgICBjYWxsRG9DaGVjazogZGlyZWN0aXZlTWV0YWRhdGEubGlmZWN5Y2xlSG9va3MuaW5kZXhPZihMaWZlY3ljbGVIb29rcy5Eb0NoZWNrKSAhPT0gLTEsXG4gICAgICBjYWxsT25Jbml0OiBkaXJlY3RpdmVNZXRhZGF0YS5saWZlY3ljbGVIb29rcy5pbmRleE9mKExpZmVjeWNsZUhvb2tzLk9uSW5pdCkgIT09IC0xLFxuICAgICAgY2FsbE9uRGVzdHJveTogZGlyZWN0aXZlTWV0YWRhdGEubGlmZWN5Y2xlSG9va3MuaW5kZXhPZihMaWZlY3ljbGVIb29rcy5PbkRlc3Ryb3kpICE9PSAtMSxcbiAgICAgIGNoYW5nZURldGVjdGlvbjogZGlyZWN0aXZlTWV0YWRhdGEuY2hhbmdlRGV0ZWN0aW9uLFxuICAgICAgb3V0cHV0czogb3V0cHV0c0FycmF5XG4gICAgfSk7XG4gICAgdGhpcy5kaXJlY3RpdmVSZWNvcmRzLnB1c2goZGlyZWN0aXZlUmVjb3JkKTtcblxuICAgIHRlbXBsYXRlVmlzaXRBbGwodGhpcywgYXN0LmlucHV0cywgZGlyZWN0aXZlUmVjb3JkKTtcbiAgICB2YXIgYmluZGluZ1JlY29yZHMgPSB0aGlzLmJpbmRpbmdSZWNvcmRzO1xuICAgIGlmIChkaXJlY3RpdmVSZWNvcmQuY2FsbE9uQ2hhbmdlcykge1xuICAgICAgYmluZGluZ1JlY29yZHMucHVzaChCaW5kaW5nUmVjb3JkLmNyZWF0ZURpcmVjdGl2ZU9uQ2hhbmdlcyhkaXJlY3RpdmVSZWNvcmQpKTtcbiAgICB9XG4gICAgaWYgKGRpcmVjdGl2ZVJlY29yZC5jYWxsT25Jbml0KSB7XG4gICAgICBiaW5kaW5nUmVjb3Jkcy5wdXNoKEJpbmRpbmdSZWNvcmQuY3JlYXRlRGlyZWN0aXZlT25Jbml0KGRpcmVjdGl2ZVJlY29yZCkpO1xuICAgIH1cbiAgICBpZiAoZGlyZWN0aXZlUmVjb3JkLmNhbGxEb0NoZWNrKSB7XG4gICAgICBiaW5kaW5nUmVjb3Jkcy5wdXNoKEJpbmRpbmdSZWNvcmQuY3JlYXRlRGlyZWN0aXZlRG9DaGVjayhkaXJlY3RpdmVSZWNvcmQpKTtcbiAgICB9XG4gICAgdGVtcGxhdGVWaXNpdEFsbCh0aGlzLCBhc3QuaG9zdFByb3BlcnRpZXMsIGRpcmVjdGl2ZVJlY29yZCk7XG4gICAgdGVtcGxhdGVWaXNpdEFsbCh0aGlzLCBhc3QuaG9zdEV2ZW50cywgZGlyZWN0aXZlUmVjb3JkKTtcbiAgICB0ZW1wbGF0ZVZpc2l0QWxsKHRoaXMsIGFzdC5leHBvcnRBc1ZhcnMpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHZpc2l0RGlyZWN0aXZlUHJvcGVydHkoYXN0OiBCb3VuZERpcmVjdGl2ZVByb3BlcnR5QXN0LCBkaXJlY3RpdmVSZWNvcmQ6IERpcmVjdGl2ZVJlY29yZCk6IGFueSB7XG4gICAgLy8gVE9ETzogdGhlc2Ugc2V0dGVycyBzaG91bGQgZXZlbnR1YWxseSBiZSBjcmVhdGVkIGJ5IGNoYW5nZSBkZXRlY3Rpb24sIHRvIG1ha2VcbiAgICAvLyBpdCBtb25vbW9ycGhpYyFcbiAgICB2YXIgc2V0dGVyID0gcmVmbGVjdG9yLnNldHRlcihhc3QuZGlyZWN0aXZlTmFtZSk7XG4gICAgdGhpcy5iaW5kaW5nUmVjb3Jkcy5wdXNoKFxuICAgICAgICBCaW5kaW5nUmVjb3JkLmNyZWF0ZUZvckRpcmVjdGl2ZShhc3QudmFsdWUsIGFzdC5kaXJlY3RpdmVOYW1lLCBzZXR0ZXIsIGRpcmVjdGl2ZVJlY29yZCkpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cblxuZnVuY3Rpb24gY3JlYXRlQ2hhbmdlRGVmaW5pdGlvbnMocHZWaXNpdG9yczogUHJvdG9WaWV3VmlzaXRvcltdLCBjb21wb25lbnRUeXBlOiBDb21waWxlVHlwZU1ldGFkYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2VuQ29uZmlnOiBDaGFuZ2VEZXRlY3RvckdlbkNvbmZpZyk6IENoYW5nZURldGVjdG9yRGVmaW5pdGlvbltdIHtcbiAgdmFyIHB2VmFyaWFibGVOYW1lcyA9IF9jb2xsZWN0TmVzdGVkUHJvdG9WaWV3c1ZhcmlhYmxlTmFtZXMocHZWaXNpdG9ycyk7XG4gIHJldHVybiBwdlZpc2l0b3JzLm1hcChwdlZpc2l0b3IgPT4ge1xuICAgIHZhciBpZCA9IGAke2NvbXBvbmVudFR5cGUubmFtZX1fJHtwdlZpc2l0b3Iudmlld0luZGV4fWA7XG4gICAgcmV0dXJuIG5ldyBDaGFuZ2VEZXRlY3RvckRlZmluaXRpb24oXG4gICAgICAgIGlkLCBwdlZpc2l0b3Iuc3RyYXRlZ3ksIHB2VmFyaWFibGVOYW1lc1twdlZpc2l0b3Iudmlld0luZGV4XSwgcHZWaXNpdG9yLmJpbmRpbmdSZWNvcmRzLFxuICAgICAgICBwdlZpc2l0b3IuZXZlbnRSZWNvcmRzLCBwdlZpc2l0b3IuZGlyZWN0aXZlUmVjb3JkcywgZ2VuQ29uZmlnKTtcblxuICB9KTtcbn1cblxuZnVuY3Rpb24gX2NvbGxlY3ROZXN0ZWRQcm90b1ZpZXdzVmFyaWFibGVOYW1lcyhwdlZpc2l0b3JzOiBQcm90b1ZpZXdWaXNpdG9yW10pOiBzdHJpbmdbXVtdIHtcbiAgdmFyIG5lc3RlZFB2VmFyaWFibGVOYW1lczogc3RyaW5nW11bXSA9IExpc3RXcmFwcGVyLmNyZWF0ZUZpeGVkU2l6ZShwdlZpc2l0b3JzLmxlbmd0aCk7XG4gIHB2VmlzaXRvcnMuZm9yRWFjaCgocHYpID0+IHtcbiAgICB2YXIgcGFyZW50VmFyaWFibGVOYW1lczogc3RyaW5nW10gPVxuICAgICAgICBpc1ByZXNlbnQocHYucGFyZW50KSA/IG5lc3RlZFB2VmFyaWFibGVOYW1lc1twdi5wYXJlbnQudmlld0luZGV4XSA6IFtdO1xuICAgIG5lc3RlZFB2VmFyaWFibGVOYW1lc1twdi52aWV3SW5kZXhdID0gcGFyZW50VmFyaWFibGVOYW1lcy5jb25jYXQocHYudmFyaWFibGVOYW1lcyk7XG4gIH0pO1xuICByZXR1cm4gbmVzdGVkUHZWYXJpYWJsZU5hbWVzO1xufVxuIl19