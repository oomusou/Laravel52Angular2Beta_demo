'use strict';"use strict";
var lang_1 = require('angular2/src/facade/lang');
var exceptions_1 = require('angular2/src/facade/exceptions');
var collection_1 = require('angular2/src/facade/collection');
var constants_1 = require('./constants');
var pipe_lifecycle_reflector_1 = require('./pipe_lifecycle_reflector');
var binding_record_1 = require('./binding_record');
var directive_record_1 = require('./directive_record');
/**
 * Indicates that the result of a {@link PipeMetadata} transformation has changed even though the
 * reference
 * has not changed.
 *
 * The wrapped value will be unwrapped by change detection, and the unwrapped value will be stored.
 *
 * Example:
 *
 * ```
 * if (this._latestValue === this._latestReturnedValue) {
 *    return this._latestReturnedValue;
 *  } else {
 *    this._latestReturnedValue = this._latestValue;
 *    return WrappedValue.wrap(this._latestValue); // this will force update
 *  }
 * ```
 */
var WrappedValue = (function () {
    function WrappedValue(wrapped) {
        this.wrapped = wrapped;
    }
    WrappedValue.wrap = function (value) {
        var w = _wrappedValues[_wrappedIndex++ % 5];
        w.wrapped = value;
        return w;
    };
    return WrappedValue;
}());
exports.WrappedValue = WrappedValue;
var _wrappedValues = [
    new WrappedValue(null),
    new WrappedValue(null),
    new WrappedValue(null),
    new WrappedValue(null),
    new WrappedValue(null)
];
var _wrappedIndex = 0;
/**
 * Represents a basic change from a previous to a new value.
 */
var SimpleChange = (function () {
    function SimpleChange(previousValue, currentValue) {
        this.previousValue = previousValue;
        this.currentValue = currentValue;
    }
    /**
     * Check whether the new value is the first value assigned.
     */
    SimpleChange.prototype.isFirstChange = function () { return this.previousValue === ChangeDetectionUtil.uninitialized; };
    return SimpleChange;
}());
exports.SimpleChange = SimpleChange;
function _simpleChange(previousValue, currentValue) {
    return new SimpleChange(previousValue, currentValue);
}
/* tslint:disable:requireParameterType */
var ChangeDetectionUtil = (function () {
    function ChangeDetectionUtil() {
    }
    ChangeDetectionUtil.arrayFn0 = function () { return []; };
    ChangeDetectionUtil.arrayFn1 = function (a1) { return [a1]; };
    ChangeDetectionUtil.arrayFn2 = function (a1, a2) { return [a1, a2]; };
    ChangeDetectionUtil.arrayFn3 = function (a1, a2, a3) { return [a1, a2, a3]; };
    ChangeDetectionUtil.arrayFn4 = function (a1, a2, a3, a4) { return [a1, a2, a3, a4]; };
    ChangeDetectionUtil.arrayFn5 = function (a1, a2, a3, a4, a5) { return [a1, a2, a3, a4, a5]; };
    ChangeDetectionUtil.arrayFn6 = function (a1, a2, a3, a4, a5, a6) { return [a1, a2, a3, a4, a5, a6]; };
    ChangeDetectionUtil.arrayFn7 = function (a1, a2, a3, a4, a5, a6, a7) { return [a1, a2, a3, a4, a5, a6, a7]; };
    ChangeDetectionUtil.arrayFn8 = function (a1, a2, a3, a4, a5, a6, a7, a8) {
        return [a1, a2, a3, a4, a5, a6, a7, a8];
    };
    ChangeDetectionUtil.arrayFn9 = function (a1, a2, a3, a4, a5, a6, a7, a8, a9) {
        return [a1, a2, a3, a4, a5, a6, a7, a8, a9];
    };
    ChangeDetectionUtil.operation_negate = function (value) { return !value; };
    ChangeDetectionUtil.operation_add = function (left, right) { return left + right; };
    ChangeDetectionUtil.operation_subtract = function (left, right) { return left - right; };
    ChangeDetectionUtil.operation_multiply = function (left, right) { return left * right; };
    ChangeDetectionUtil.operation_divide = function (left, right) { return left / right; };
    ChangeDetectionUtil.operation_remainder = function (left, right) { return left % right; };
    ChangeDetectionUtil.operation_equals = function (left, right) { return left == right; };
    ChangeDetectionUtil.operation_not_equals = function (left, right) { return left != right; };
    ChangeDetectionUtil.operation_identical = function (left, right) { return left === right; };
    ChangeDetectionUtil.operation_not_identical = function (left, right) { return left !== right; };
    ChangeDetectionUtil.operation_less_then = function (left, right) { return left < right; };
    ChangeDetectionUtil.operation_greater_then = function (left, right) { return left > right; };
    ChangeDetectionUtil.operation_less_or_equals_then = function (left, right) { return left <= right; };
    ChangeDetectionUtil.operation_greater_or_equals_then = function (left, right) { return left >= right; };
    ChangeDetectionUtil.cond = function (cond, trueVal, falseVal) { return cond ? trueVal : falseVal; };
    ChangeDetectionUtil.mapFn = function (keys) {
        function buildMap(values) {
            var res = collection_1.StringMapWrapper.create();
            for (var i = 0; i < keys.length; ++i) {
                collection_1.StringMapWrapper.set(res, keys[i], values[i]);
            }
            return res;
        }
        switch (keys.length) {
            case 0:
                return function () { return []; };
            case 1:
                return function (a1) { return buildMap([a1]); };
            case 2:
                return function (a1, a2) { return buildMap([a1, a2]); };
            case 3:
                return function (a1, a2, a3) { return buildMap([a1, a2, a3]); };
            case 4:
                return function (a1, a2, a3, a4) { return buildMap([a1, a2, a3, a4]); };
            case 5:
                return function (a1, a2, a3, a4, a5) { return buildMap([a1, a2, a3, a4, a5]); };
            case 6:
                return function (a1, a2, a3, a4, a5, a6) { return buildMap([a1, a2, a3, a4, a5, a6]); };
            case 7:
                return function (a1, a2, a3, a4, a5, a6, a7) { return buildMap([a1, a2, a3, a4, a5, a6, a7]); };
            case 8:
                return function (a1, a2, a3, a4, a5, a6, a7, a8) { return buildMap([a1, a2, a3, a4, a5, a6, a7, a8]); };
            case 9:
                return function (a1, a2, a3, a4, a5, a6, a7, a8, a9) {
                    return buildMap([a1, a2, a3, a4, a5, a6, a7, a8, a9]);
                };
            default:
                throw new exceptions_1.BaseException("Does not support literal maps with more than 9 elements");
        }
    };
    ChangeDetectionUtil.keyedAccess = function (obj, args) { return obj[args[0]]; };
    ChangeDetectionUtil.unwrapValue = function (value) {
        if (value instanceof WrappedValue) {
            return value.wrapped;
        }
        else {
            return value;
        }
    };
    ChangeDetectionUtil.changeDetectionMode = function (strategy) {
        return constants_1.isDefaultChangeDetectionStrategy(strategy) ? constants_1.ChangeDetectionStrategy.CheckAlways :
            constants_1.ChangeDetectionStrategy.CheckOnce;
    };
    ChangeDetectionUtil.simpleChange = function (previousValue, currentValue) {
        return _simpleChange(previousValue, currentValue);
    };
    ChangeDetectionUtil.isValueBlank = function (value) { return lang_1.isBlank(value); };
    ChangeDetectionUtil.s = function (value) { return lang_1.isPresent(value) ? "" + value : ''; };
    ChangeDetectionUtil.protoByIndex = function (protos, selfIndex) {
        return selfIndex < 1 ?
            null :
            protos[selfIndex - 1]; // self index is shifted by one because of context
    };
    ChangeDetectionUtil.callPipeOnDestroy = function (selectedPipe) {
        if (pipe_lifecycle_reflector_1.implementsOnDestroy(selectedPipe.pipe)) {
            selectedPipe.pipe.ngOnDestroy();
        }
    };
    ChangeDetectionUtil.bindingTarget = function (mode, elementIndex, name, unit, debug) {
        return new binding_record_1.BindingTarget(mode, elementIndex, name, unit, debug);
    };
    ChangeDetectionUtil.directiveIndex = function (elementIndex, directiveIndex) {
        return new directive_record_1.DirectiveIndex(elementIndex, directiveIndex);
    };
    ChangeDetectionUtil.looseNotIdentical = function (a, b) { return !lang_1.looseIdentical(a, b); };
    ChangeDetectionUtil.devModeEqual = function (a, b) {
        if (collection_1.isListLikeIterable(a) && collection_1.isListLikeIterable(b)) {
            return collection_1.areIterablesEqual(a, b, ChangeDetectionUtil.devModeEqual);
        }
        else if (!collection_1.isListLikeIterable(a) && !lang_1.isPrimitive(a) && !collection_1.isListLikeIterable(b) &&
            !lang_1.isPrimitive(b)) {
            return true;
        }
        else {
            return lang_1.looseIdentical(a, b);
        }
    };
    ChangeDetectionUtil.uninitialized = lang_1.CONST_EXPR(new Object());
    return ChangeDetectionUtil;
}());
exports.ChangeDetectionUtil = ChangeDetectionUtil;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhbmdlX2RldGVjdGlvbl91dGlsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC1qYWtYbk1tTC50bXAvYW5ndWxhcjIvc3JjL2NvcmUvY2hhbmdlX2RldGVjdGlvbi9jaGFuZ2VfZGV0ZWN0aW9uX3V0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHFCQVFPLDBCQUEwQixDQUFDLENBQUE7QUFDbEMsMkJBQTRCLGdDQUFnQyxDQUFDLENBQUE7QUFDN0QsMkJBTU8sZ0NBQWdDLENBQUMsQ0FBQTtBQUV4QywwQkFBd0UsYUFBYSxDQUFDLENBQUE7QUFDdEYseUNBQWtDLDRCQUE0QixDQUFDLENBQUE7QUFDL0QsK0JBQTRCLGtCQUFrQixDQUFDLENBQUE7QUFDL0MsaUNBQTZCLG9CQUFvQixDQUFDLENBQUE7QUFJbEQ7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBaUJHO0FBQ0g7SUFDRSxzQkFBbUIsT0FBWTtRQUFaLFlBQU8sR0FBUCxPQUFPLENBQUs7SUFBRyxDQUFDO0lBRTVCLGlCQUFJLEdBQVgsVUFBWSxLQUFVO1FBQ3BCLElBQUksQ0FBQyxHQUFHLGNBQWMsQ0FBQyxhQUFhLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUM1QyxDQUFDLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztRQUNsQixNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQUNILG1CQUFDO0FBQUQsQ0FBQyxBQVJELElBUUM7QUFSWSxvQkFBWSxlQVF4QixDQUFBO0FBRUQsSUFBSSxjQUFjLEdBQUc7SUFDbkIsSUFBSSxZQUFZLENBQUMsSUFBSSxDQUFDO0lBQ3RCLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQztJQUN0QixJQUFJLFlBQVksQ0FBQyxJQUFJLENBQUM7SUFDdEIsSUFBSSxZQUFZLENBQUMsSUFBSSxDQUFDO0lBQ3RCLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQztDQUN2QixDQUFDO0FBRUYsSUFBSSxhQUFhLEdBQUcsQ0FBQyxDQUFDO0FBRXRCOztHQUVHO0FBQ0g7SUFDRSxzQkFBbUIsYUFBa0IsRUFBUyxZQUFpQjtRQUE1QyxrQkFBYSxHQUFiLGFBQWEsQ0FBSztRQUFTLGlCQUFZLEdBQVosWUFBWSxDQUFLO0lBQUcsQ0FBQztJQUVuRTs7T0FFRztJQUNILG9DQUFhLEdBQWIsY0FBMkIsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLEtBQUssbUJBQW1CLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztJQUMvRixtQkFBQztBQUFELENBQUMsQUFQRCxJQU9DO0FBUFksb0JBQVksZUFPeEIsQ0FBQTtBQUVELHVCQUF1QixhQUFhLEVBQUUsWUFBWTtJQUNoRCxNQUFNLENBQUMsSUFBSSxZQUFZLENBQUMsYUFBYSxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQ3ZELENBQUM7QUFFRCx5Q0FBeUM7QUFDekM7SUFBQTtJQWdJQSxDQUFDO0lBN0hRLDRCQUFRLEdBQWYsY0FBMkIsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDaEMsNEJBQVEsR0FBZixVQUFnQixFQUFFLElBQVcsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3BDLDRCQUFRLEdBQWYsVUFBZ0IsRUFBRSxFQUFFLEVBQUUsSUFBVyxNQUFNLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVDLDRCQUFRLEdBQWYsVUFBZ0IsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLElBQVcsTUFBTSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDcEQsNEJBQVEsR0FBZixVQUFnQixFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLElBQVcsTUFBTSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVELDRCQUFRLEdBQWYsVUFBZ0IsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBVyxNQUFNLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3BFLDRCQUFRLEdBQWYsVUFBZ0IsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLElBQVcsTUFBTSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUUsNEJBQVEsR0FBZixVQUFnQixFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLElBQVcsTUFBTSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3BGLDRCQUFRLEdBQWYsVUFBZ0IsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7UUFDNUMsTUFBTSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFDTSw0QkFBUSxHQUFmLFVBQWdCLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtRQUNoRCxNQUFNLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFB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K0hsRSwwQkFBQztBQUFELENBQUMsQUFoSUQsSUFnSUM7QUFoSVksMkJBQW1CLHNCQWdJL0IsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENPTlNUX0VYUFIsXG4gIGlzUHJlc2VudCxcbiAgaXNCbGFuayxcbiAgVHlwZSxcbiAgU3RyaW5nV3JhcHBlcixcbiAgbG9vc2VJZGVudGljYWwsXG4gIGlzUHJpbWl0aXZlXG59IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge0Jhc2VFeGNlcHRpb259IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvZXhjZXB0aW9ucyc7XG5pbXBvcnQge1xuICBMaXN0V3JhcHBlcixcbiAgTWFwV3JhcHBlcixcbiAgU3RyaW5nTWFwV3JhcHBlcixcbiAgaXNMaXN0TGlrZUl0ZXJhYmxlLFxuICBhcmVJdGVyYWJsZXNFcXVhbFxufSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2NvbGxlY3Rpb24nO1xuaW1wb3J0IHtQcm90b1JlY29yZH0gZnJvbSAnLi9wcm90b19yZWNvcmQnO1xuaW1wb3J0IHtDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgaXNEZWZhdWx0Q2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3l9IGZyb20gJy4vY29uc3RhbnRzJztcbmltcG9ydCB7aW1wbGVtZW50c09uRGVzdHJveX0gZnJvbSAnLi9waXBlX2xpZmVjeWNsZV9yZWZsZWN0b3InO1xuaW1wb3J0IHtCaW5kaW5nVGFyZ2V0fSBmcm9tICcuL2JpbmRpbmdfcmVjb3JkJztcbmltcG9ydCB7RGlyZWN0aXZlSW5kZXh9IGZyb20gJy4vZGlyZWN0aXZlX3JlY29yZCc7XG5pbXBvcnQge1NlbGVjdGVkUGlwZX0gZnJvbSAnLi9waXBlcyc7XG5cblxuLyoqXG4gKiBJbmRpY2F0ZXMgdGhhdCB0aGUgcmVzdWx0IG9mIGEge0BsaW5rIFBpcGVNZXRhZGF0YX0gdHJhbnNmb3JtYXRpb24gaGFzIGNoYW5nZWQgZXZlbiB0aG91Z2ggdGhlXG4gKiByZWZlcmVuY2VcbiAqIGhhcyBub3QgY2hhbmdlZC5cbiAqXG4gKiBUaGUgd3JhcHBlZCB2YWx1ZSB3aWxsIGJlIHVud3JhcHBlZCBieSBjaGFuZ2UgZGV0ZWN0aW9uLCBhbmQgdGhlIHVud3JhcHBlZCB2YWx1ZSB3aWxsIGJlIHN0b3JlZC5cbiAqXG4gKiBFeGFtcGxlOlxuICpcbiAqIGBgYFxuICogaWYgKHRoaXMuX2xhdGVzdFZhbHVlID09PSB0aGlzLl9sYXRlc3RSZXR1cm5lZFZhbHVlKSB7XG4gKiAgICByZXR1cm4gdGhpcy5fbGF0ZXN0UmV0dXJuZWRWYWx1ZTtcbiAqICB9IGVsc2Uge1xuICogICAgdGhpcy5fbGF0ZXN0UmV0dXJuZWRWYWx1ZSA9IHRoaXMuX2xhdGVzdFZhbHVlO1xuICogICAgcmV0dXJuIFdyYXBwZWRWYWx1ZS53cmFwKHRoaXMuX2xhdGVzdFZhbHVlKTsgLy8gdGhpcyB3aWxsIGZvcmNlIHVwZGF0ZVxuICogIH1cbiAqIGBgYFxuICovXG5leHBvcnQgY2xhc3MgV3JhcHBlZFZhbHVlIHtcbiAgY29uc3RydWN0b3IocHVibGljIHdyYXBwZWQ6IGFueSkge31cblxuICBzdGF0aWMgd3JhcCh2YWx1ZTogYW55KTogV3JhcHBlZFZhbHVlIHtcbiAgICB2YXIgdyA9IF93cmFwcGVkVmFsdWVzW193cmFwcGVkSW5kZXgrKyAlIDVdO1xuICAgIHcud3JhcHBlZCA9IHZhbHVlO1xuICAgIHJldHVybiB3O1xuICB9XG59XG5cbnZhciBfd3JhcHBlZFZhbHVlcyA9IFtcbiAgbmV3IFdyYXBwZWRWYWx1ZShudWxsKSxcbiAgbmV3IFdyYXBwZWRWYWx1ZShudWxsKSxcbiAgbmV3IFdyYXBwZWRWYWx1ZShudWxsKSxcbiAgbmV3IFdyYXBwZWRWYWx1ZShudWxsKSxcbiAgbmV3IFdyYXBwZWRWYWx1ZShudWxsKVxuXTtcblxudmFyIF93cmFwcGVkSW5kZXggPSAwO1xuXG4vKipcbiAqIFJlcHJlc2VudHMgYSBiYXNpYyBjaGFuZ2UgZnJvbSBhIHByZXZpb3VzIHRvIGEgbmV3IHZhbHVlLlxuICovXG5leHBvcnQgY2xhc3MgU2ltcGxlQ2hhbmdlIHtcbiAgY29uc3RydWN0b3IocHVibGljIHByZXZpb3VzVmFsdWU6IGFueSwgcHVibGljIGN1cnJlbnRWYWx1ZTogYW55KSB7fVxuXG4gIC8qKlxuICAgKiBDaGVjayB3aGV0aGVyIHRoZSBuZXcgdmFsdWUgaXMgdGhlIGZpcnN0IHZhbHVlIGFzc2lnbmVkLlxuICAgKi9cbiAgaXNGaXJzdENoYW5nZSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMucHJldmlvdXNWYWx1ZSA9PT0gQ2hhbmdlRGV0ZWN0aW9uVXRpbC51bmluaXRpYWxpemVkOyB9XG59XG5cbmZ1bmN0aW9uIF9zaW1wbGVDaGFuZ2UocHJldmlvdXNWYWx1ZSwgY3VycmVudFZhbHVlKTogU2ltcGxlQ2hhbmdlIHtcbiAgcmV0dXJuIG5ldyBTaW1wbGVDaGFuZ2UocHJldmlvdXNWYWx1ZSwgY3VycmVudFZhbHVlKTtcbn1cblxuLyogdHNsaW50OmRpc2FibGU6cmVxdWlyZVBhcmFtZXRlclR5cGUgKi9cbmV4cG9ydCBjbGFzcyBDaGFuZ2VEZXRlY3Rpb25VdGlsIHtcbiAgc3RhdGljIHVuaW5pdGlhbGl6ZWQ6IE9iamVjdCA9IENPTlNUX0VYUFI8T2JqZWN0PihuZXcgT2JqZWN0KCkpO1xuXG4gIHN0YXRpYyBhcnJheUZuMCgpOiBhbnlbXSB7IHJldHVybiBbXTsgfVxuICBzdGF0aWMgYXJyYXlGbjEoYTEpOiBhbnlbXSB7IHJldHVybiBbYTFdOyB9XG4gIHN0YXRpYyBhcnJheUZuMihhMSwgYTIpOiBhbnlbXSB7IHJldHVybiBbYTEsIGEyXTsgfVxuICBzdGF0aWMgYXJyYXlGbjMoYTEsIGEyLCBhMyk6IGFueVtdIHsgcmV0dXJuIFthMSwgYTIsIGEzXTsgfVxuICBzdGF0aWMgYXJyYXlGbjQoYTEsIGEyLCBhMywgYTQpOiBhbnlbXSB7IHJldHVybiBbYTEsIGEyLCBhMywgYTRdOyB9XG4gIHN0YXRpYyBhcnJheUZuNShhMSwgYTIsIGEzLCBhNCwgYTUpOiBhbnlbXSB7IHJldHVybiBbYTEsIGEyLCBhMywgYTQsIGE1XTsgfVxuICBzdGF0aWMgYXJyYXlGbjYoYTEsIGEyLCBhMywgYTQsIGE1LCBhNik6IGFueVtdIHsgcmV0dXJuIFthMSwgYTIsIGEzLCBhNCwgYTUsIGE2XTsgfVxuICBzdGF0aWMgYXJyYXlGbjcoYTEsIGEyLCBhMywgYTQsIGE1LCBhNiwgYTcpOiBhbnlbXSB7IHJldHVybiBbYTEsIGEyLCBhMywgYTQsIGE1LCBhNiwgYTddOyB9XG4gIHN0YXRpYyBhcnJheUZuOChhMSwgYTIsIGEzLCBhNCwgYTUsIGE2LCBhNywgYTgpOiBhbnlbXSB7XG4gICAgcmV0dXJuIFthMSwgYTIsIGEzLCBhNCwgYTUsIGE2LCBhNywgYThdO1xuICB9XG4gIHN0YXRpYyBhcnJheUZuOShhMSwgYTIsIGEzLCBhNCwgYTUsIGE2LCBhNywgYTgsIGE5KTogYW55W10ge1xuICAgIHJldHVybiBbYTEsIGEyLCBhMywgYTQsIGE1LCBhNiwgYTcsIGE4LCBhOV07XG4gIH1cblxuICBzdGF0aWMgb3BlcmF0aW9uX25lZ2F0ZSh2YWx1ZSk6IGFueSB7IHJldHVybiAhdmFsdWU7IH1cbiAgc3RhdGljIG9wZXJhdGlvbl9hZGQobGVmdCwgcmlnaHQpOiBhbnkgeyByZXR1cm4gbGVmdCArIHJpZ2h0OyB9XG4gIHN0YXRpYyBvcGVyYXRpb25fc3VidHJhY3QobGVmdCwgcmlnaHQpOiBhbnkgeyByZXR1cm4gbGVmdCAtIHJpZ2h0OyB9XG4gIHN0YXRpYyBvcGVyYXRpb25fbXVsdGlwbHkobGVmdCwgcmlnaHQpOiBhbnkgeyByZXR1cm4gbGVmdCAqIHJpZ2h0OyB9XG4gIHN0YXRpYyBvcGVyYXRpb25fZGl2aWRlKGxlZnQsIHJpZ2h0KTogYW55IHsgcmV0dXJuIGxlZnQgLyByaWdodDsgfVxuICBzdGF0aWMgb3BlcmF0aW9uX3JlbWFpbmRlcihsZWZ0LCByaWdodCk6IGFueSB7IHJldHVybiBsZWZ0ICUgcmlnaHQ7IH1cbiAgc3RhdGljIG9wZXJhdGlvbl9lcXVhbHMobGVmdCwgcmlnaHQpOiBhbnkgeyByZXR1cm4gbGVmdCA9PSByaWdodDsgfVxuICBzdGF0aWMgb3BlcmF0aW9uX25vdF9lcXVhbHMobGVmdCwgcmlnaHQpOiBhbnkgeyByZXR1cm4gbGVmdCAhPSByaWdodDsgfVxuICBzdGF0aWMgb3BlcmF0aW9uX2lkZW50aWNhbChsZWZ0LCByaWdodCk6IGFueSB7IHJldHVybiBsZWZ0ID09PSByaWdodDsgfVxuICBzdGF0aWMgb3BlcmF0aW9uX25vdF9pZGVudGljYWwobGVmdCwgcmlnaHQpOiBhbnkgeyByZXR1cm4gbGVmdCAhPT0gcmlnaHQ7IH1cbiAgc3RhdGljIG9wZXJhdGlvbl9sZXNzX3RoZW4obGVmdCwgcmlnaHQpOiBhbnkgeyByZXR1cm4gbGVmdCA8IHJpZ2h0OyB9XG4gIHN0YXRpYyBvcGVyYXRpb25fZ3JlYXRlcl90aGVuKGxlZnQsIHJpZ2h0KTogYW55IHsgcmV0dXJuIGxlZnQgPiByaWdodDsgfVxuICBzdGF0aWMgb3BlcmF0aW9uX2xlc3Nfb3JfZXF1YWxzX3RoZW4obGVmdCwgcmlnaHQpOiBhbnkgeyByZXR1cm4gbGVmdCA8PSByaWdodDsgfVxuICBzdGF0aWMgb3BlcmF0aW9uX2dyZWF0ZXJfb3JfZXF1YWxzX3RoZW4obGVmdCwgcmlnaHQpOiBhbnkgeyByZXR1cm4gbGVmdCA+PSByaWdodDsgfVxuICBzdGF0aWMgY29uZChjb25kLCB0cnVlVmFsLCBmYWxzZVZhbCk6IGFueSB7IHJldHVybiBjb25kID8gdHJ1ZVZhbCA6IGZhbHNlVmFsOyB9XG5cbiAgc3RhdGljIG1hcEZuKGtleXM6IGFueVtdKTogYW55IHtcbiAgICBmdW5jdGlvbiBidWlsZE1hcCh2YWx1ZXMpOiB7W2s6IC8qYW55Ki8gc3RyaW5nXTogYW55fSB7XG4gICAgICB2YXIgcmVzID0gU3RyaW5nTWFwV3JhcHBlci5jcmVhdGUoKTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7ICsraSkge1xuICAgICAgICBTdHJpbmdNYXBXcmFwcGVyLnNldChyZXMsIGtleXNbaV0sIHZhbHVlc1tpXSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIHN3aXRjaCAoa2V5cy5sZW5ndGgpIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgcmV0dXJuICgpID0+IFtdO1xuICAgICAgY2FzZSAxOlxuICAgICAgICByZXR1cm4gKGExKSA9PiBidWlsZE1hcChbYTFdKTtcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgcmV0dXJuIChhMSwgYTIpID0+IGJ1aWxkTWFwKFthMSwgYTJdKTtcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgcmV0dXJuIChhMSwgYTIsIGEzKSA9PiBidWlsZE1hcChbYTEsIGEyLCBhM10pO1xuICAgICAgY2FzZSA0OlxuICAgICAgICByZXR1cm4gKGExLCBhMiwgYTMsIGE0KSA9PiBidWlsZE1hcChbYTEsIGEyLCBhMywgYTRdKTtcbiAgICAgIGNhc2UgNTpcbiAgICAgICAgcmV0dXJuIChhMSwgYTIsIGEzLCBhNCwgYTUpID0+IGJ1aWxkTWFwKFthMSwgYTIsIGEzLCBhNCwgYTVdKTtcbiAgICAgIGNhc2UgNjpcbiAgICAgICAgcmV0dXJuIChhMSwgYTIsIGEzLCBhNCwgYTUsIGE2KSA9PiBidWlsZE1hcChbYTEsIGEyLCBhMywgYTQsIGE1LCBhNl0pO1xuICAgICAgY2FzZSA3OlxuICAgICAgICByZXR1cm4gKGExLCBhMiwgYTMsIGE0LCBhNSwgYTYsIGE3KSA9PiBidWlsZE1hcChbYTEsIGEyLCBhMywgYTQsIGE1LCBhNiwgYTddKTtcbiAgICAgIGNhc2UgODpcbiAgICAgICAgcmV0dXJuIChhMSwgYTIsIGEzLCBhNCwgYTUsIGE2LCBhNywgYTgpID0+IGJ1aWxkTWFwKFthMSwgYTIsIGEzLCBhNCwgYTUsIGE2LCBhNywgYThdKTtcbiAgICAgIGNhc2UgOTpcbiAgICAgICAgcmV0dXJuIChhMSwgYTIsIGEzLCBhNCwgYTUsIGE2LCBhNywgYTgsIGE5KSA9PlxuICAgICAgICAgICAgICAgICAgIGJ1aWxkTWFwKFthMSwgYTIsIGEzLCBhNCwgYTUsIGE2LCBhNywgYTgsIGE5XSk7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgQmFzZUV4Y2VwdGlvbihgRG9lcyBub3Qgc3VwcG9ydCBsaXRlcmFsIG1hcHMgd2l0aCBtb3JlIHRoYW4gOSBlbGVtZW50c2ApO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBrZXllZEFjY2VzcyhvYmosIGFyZ3MpOiBhbnkgeyByZXR1cm4gb2JqW2FyZ3NbMF1dOyB9XG5cbiAgc3RhdGljIHVud3JhcFZhbHVlKHZhbHVlOiBhbnkpOiBhbnkge1xuICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFdyYXBwZWRWYWx1ZSkge1xuICAgICAgcmV0dXJuIHZhbHVlLndyYXBwZWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgY2hhbmdlRGV0ZWN0aW9uTW9kZShzdHJhdGVneTogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kpOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSB7XG4gICAgcmV0dXJuIGlzRGVmYXVsdENoYW5nZURldGVjdGlvblN0cmF0ZWd5KHN0cmF0ZWd5KSA/IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LkNoZWNrQWx3YXlzIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuQ2hlY2tPbmNlO1xuICB9XG5cbiAgc3RhdGljIHNpbXBsZUNoYW5nZShwcmV2aW91c1ZhbHVlOiBhbnksIGN1cnJlbnRWYWx1ZTogYW55KTogU2ltcGxlQ2hhbmdlIHtcbiAgICByZXR1cm4gX3NpbXBsZUNoYW5nZShwcmV2aW91c1ZhbHVlLCBjdXJyZW50VmFsdWUpO1xuICB9XG5cbiAgc3RhdGljIGlzVmFsdWVCbGFuayh2YWx1ZTogYW55KTogYm9vbGVhbiB7IHJldHVybiBpc0JsYW5rKHZhbHVlKTsgfVxuXG4gIHN0YXRpYyBzKHZhbHVlOiBhbnkpOiBzdHJpbmcgeyByZXR1cm4gaXNQcmVzZW50KHZhbHVlKSA/IGAke3ZhbHVlfWAgOiAnJzsgfVxuXG4gIHN0YXRpYyBwcm90b0J5SW5kZXgocHJvdG9zOiBQcm90b1JlY29yZFtdLCBzZWxmSW5kZXg6IG51bWJlcik6IFByb3RvUmVjb3JkIHtcbiAgICByZXR1cm4gc2VsZkluZGV4IDwgMSA/XG4gICAgICAgICAgICAgICBudWxsIDpcbiAgICAgICAgICAgICAgIHByb3Rvc1tzZWxmSW5kZXggLSAxXTsgIC8vIHNlbGYgaW5kZXggaXMgc2hpZnRlZCBieSBvbmUgYmVjYXVzZSBvZiBjb250ZXh0XG4gIH1cblxuICBzdGF0aWMgY2FsbFBpcGVPbkRlc3Ryb3koc2VsZWN0ZWRQaXBlOiBTZWxlY3RlZFBpcGUpOiB2b2lkIHtcbiAgICBpZiAoaW1wbGVtZW50c09uRGVzdHJveShzZWxlY3RlZFBpcGUucGlwZSkpIHtcbiAgICAgICg8YW55PnNlbGVjdGVkUGlwZS5waXBlKS5uZ09uRGVzdHJveSgpO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBiaW5kaW5nVGFyZ2V0KG1vZGU6IHN0cmluZywgZWxlbWVudEluZGV4OiBudW1iZXIsIG5hbWU6IHN0cmluZywgdW5pdDogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICBkZWJ1Zzogc3RyaW5nKTogQmluZGluZ1RhcmdldCB7XG4gICAgcmV0dXJuIG5ldyBCaW5kaW5nVGFyZ2V0KG1vZGUsIGVsZW1lbnRJbmRleCwgbmFtZSwgdW5pdCwgZGVidWcpO1xuICB9XG5cbiAgc3RhdGljIGRpcmVjdGl2ZUluZGV4KGVsZW1lbnRJbmRleDogbnVtYmVyLCBkaXJlY3RpdmVJbmRleDogbnVtYmVyKTogRGlyZWN0aXZlSW5kZXgge1xuICAgIHJldHVybiBuZXcgRGlyZWN0aXZlSW5kZXgoZWxlbWVudEluZGV4LCBkaXJlY3RpdmVJbmRleCk7XG4gIH1cblxuICBzdGF0aWMgbG9vc2VOb3RJZGVudGljYWwoYTogYW55LCBiOiBhbnkpOiBib29sZWFuIHsgcmV0dXJuICFsb29zZUlkZW50aWNhbChhLCBiKTsgfVxuXG4gIHN0YXRpYyBkZXZNb2RlRXF1YWwoYTogYW55LCBiOiBhbnkpOiBib29sZWFuIHtcbiAgICBpZiAoaXNMaXN0TGlrZUl0ZXJhYmxlKGEpICYmIGlzTGlzdExpa2VJdGVyYWJsZShiKSkge1xuICAgICAgcmV0dXJuIGFyZUl0ZXJhYmxlc0VxdWFsKGEsIGIsIENoYW5nZURldGVjdGlvblV0aWwuZGV2TW9kZUVxdWFsKTtcblxuICAgIH0gZWxzZSBpZiAoIWlzTGlzdExpa2VJdGVyYWJsZShhKSAmJiAhaXNQcmltaXRpdmUoYSkgJiYgIWlzTGlzdExpa2VJdGVyYWJsZShiKSAmJlxuICAgICAgICAgICAgICAgIWlzUHJpbWl0aXZlKGIpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcblxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbG9vc2VJZGVudGljYWwoYSwgYik7XG4gICAgfVxuICB9XG59XG4iXX0=