'use strict';"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var parse_util_1 = require('angular2/src/compiler/parse_util');
var html_ast_1 = require('angular2/src/compiler/html_ast');
var lang_1 = require('angular2/src/facade/lang');
var message_1 = require('./message');
exports.I18N_ATTR = "i18n";
exports.I18N_ATTR_PREFIX = "i18n-";
/**
 * An i18n error.
 */
var I18nError = (function (_super) {
    __extends(I18nError, _super);
    function I18nError(span, msg) {
        _super.call(this, span, msg);
    }
    return I18nError;
}(parse_util_1.ParseError));
exports.I18nError = I18nError;
// Man, this is so ugly!
function partition(nodes, errors) {
    var res = [];
    for (var i = 0; i < nodes.length; ++i) {
        var n = nodes[i];
        var temp = [];
        if (_isOpeningComment(n)) {
            var i18n = n.value.substring(5).trim();
            i++;
            while (!_isClosingComment(nodes[i])) {
                temp.push(nodes[i++]);
                if (i === nodes.length) {
                    errors.push(new I18nError(n.sourceSpan, "Missing closing 'i18n' comment."));
                    break;
                }
            }
            res.push(new Part(null, null, temp, i18n, true));
        }
        else if (n instanceof html_ast_1.HtmlElementAst) {
            var i18n = _findI18nAttr(n);
            res.push(new Part(n, null, n.children, lang_1.isPresent(i18n) ? i18n.value : null, lang_1.isPresent(i18n)));
        }
        else if (n instanceof html_ast_1.HtmlTextAst) {
            res.push(new Part(null, n, null, null, false));
        }
    }
    return res;
}
exports.partition = partition;
var Part = (function () {
    function Part(rootElement, rootTextNode, children, i18n, hasI18n) {
        this.rootElement = rootElement;
        this.rootTextNode = rootTextNode;
        this.children = children;
        this.i18n = i18n;
        this.hasI18n = hasI18n;
    }
    Object.defineProperty(Part.prototype, "sourceSpan", {
        get: function () {
            if (lang_1.isPresent(this.rootElement))
                return this.rootElement.sourceSpan;
            else if (lang_1.isPresent(this.rootTextNode))
                return this.rootTextNode.sourceSpan;
            else
                return this.children[0].sourceSpan;
        },
        enumerable: true,
        configurable: true
    });
    Part.prototype.createMessage = function (parser) {
        return new message_1.Message(stringifyNodes(this.children, parser), meaning(this.i18n), description(this.i18n));
    };
    return Part;
}());
exports.Part = Part;
function _isOpeningComment(n) {
    return n instanceof html_ast_1.HtmlCommentAst && lang_1.isPresent(n.value) && n.value.startsWith("i18n:");
}
function _isClosingComment(n) {
    return n instanceof html_ast_1.HtmlCommentAst && lang_1.isPresent(n.value) && n.value == "/i18n";
}
function _findI18nAttr(p) {
    var i18n = p.attrs.filter(function (a) { return a.name == exports.I18N_ATTR; });
    return i18n.length == 0 ? null : i18n[0];
}
function meaning(i18n) {
    if (lang_1.isBlank(i18n) || i18n == "")
        return null;
    return i18n.split("|")[0];
}
exports.meaning = meaning;
function description(i18n) {
    if (lang_1.isBlank(i18n) || i18n == "")
        return null;
    var parts = i18n.split("|");
    return parts.length > 1 ? parts[1] : null;
}
exports.description = description;
function messageFromAttribute(parser, p, attr) {
    var expectedName = attr.name.substring(5);
    var matching = p.attrs.filter(function (a) { return a.name == expectedName; });
    if (matching.length > 0) {
        var value = removeInterpolation(matching[0].value, matching[0].sourceSpan, parser);
        return new message_1.Message(value, meaning(attr.value), description(attr.value));
    }
    else {
        throw new I18nError(p.sourceSpan, "Missing attribute '" + expectedName + "'.");
    }
}
exports.messageFromAttribute = messageFromAttribute;
function removeInterpolation(value, source, parser) {
    try {
        var parsed = parser.splitInterpolation(value, source.toString());
        if (lang_1.isPresent(parsed)) {
            var res = "";
            for (var i = 0; i < parsed.strings.length; ++i) {
                res += parsed.strings[i];
                if (i != parsed.strings.length - 1) {
                    res += "<ph name=\"" + i + "\"/>";
                }
            }
            return res;
        }
        else {
            return value;
        }
    }
    catch (e) {
        return value;
    }
}
exports.removeInterpolation = removeInterpolation;
function stringifyNodes(nodes, parser) {
    var visitor = new _StringifyVisitor(parser);
    return html_ast_1.htmlVisitAll(visitor, nodes).join("");
}
exports.stringifyNodes = stringifyNodes;
var _StringifyVisitor = (function () {
    function _StringifyVisitor(_parser) {
        this._parser = _parser;
        this._index = 0;
    }
    _StringifyVisitor.prototype.visitElement = function (ast, context) {
        var name = this._index++;
        var children = this._join(html_ast_1.htmlVisitAll(this, ast.children), "");
        return "<ph name=\"e" + name + "\">" + children + "</ph>";
    };
    _StringifyVisitor.prototype.visitAttr = function (ast, context) { return null; };
    _StringifyVisitor.prototype.visitText = function (ast, context) {
        var index = this._index++;
        var noInterpolation = removeInterpolation(ast.value, ast.sourceSpan, this._parser);
        if (noInterpolation != ast.value) {
            return "<ph name=\"t" + index + "\">" + noInterpolation + "</ph>";
        }
        else {
            return ast.value;
        }
    };
    _StringifyVisitor.prototype.visitComment = function (ast, context) { return ""; };
    _StringifyVisitor.prototype._join = function (strs, str) {
        return strs.filter(function (s) { return s.length > 0; }).join(str);
    };
    return _StringifyVisitor;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hhcmVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC1qYWtYbk1tTC50bXAvYW5ndWxhcjIvc3JjL2kxOG4vc2hhcmVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDJCQUEwQyxrQ0FBa0MsQ0FBQyxDQUFBO0FBQzdFLHlCQVFPLGdDQUFnQyxDQUFDLENBQUE7QUFDeEMscUJBQWlDLDBCQUEwQixDQUFDLENBQUE7QUFDNUQsd0JBQXNCLFdBQVcsQ0FBQyxDQUFBO0FBR3JCLGlCQUFTLEdBQUcsTUFBTSxDQUFDO0FBQ25CLHdCQUFnQixHQUFHLE9BQU8sQ0FBQztBQUV4Qzs7R0FFRztBQUNIO0lBQStCLDZCQUFVO0lBQ3ZDLG1CQUFZLElBQXFCLEVBQUUsR0FBVztRQUFJLGtCQUFNLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztJQUFDLENBQUM7SUFDdkUsZ0JBQUM7QUFBRCxDQUFDLEFBRkQsQ0FBK0IsdUJBQVUsR0FFeEM7QUFGWSxpQkFBUyxZQUVyQixDQUFBO0FBR0Qsd0JBQXdCO0FBQ3hCLG1CQUEwQixLQUFnQixFQUFFLE1BQW9CO0lBQzlELElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztJQUViLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDO1FBQ3RDLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqQixJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7UUFDZCxFQUFFLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekIsSUFBSSxJQUFJLEdBQW9CLENBQUUsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ3pELENB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bnQiOlsiaW1wb3J0IHtQYXJzZVNvdXJjZVNwYW4sIFBhcnNlRXJyb3J9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb21waWxlci9wYXJzZV91dGlsJztcbmltcG9ydCB7XG4gIEh0bWxBc3QsXG4gIEh0bWxBc3RWaXNpdG9yLFxuICBIdG1sRWxlbWVudEFzdCxcbiAgSHRtbEF0dHJBc3QsXG4gIEh0bWxUZXh0QXN0LFxuICBIdG1sQ29tbWVudEFzdCxcbiAgaHRtbFZpc2l0QWxsXG59IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb21waWxlci9odG1sX2FzdCc7XG5pbXBvcnQge2lzUHJlc2VudCwgaXNCbGFua30gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7TWVzc2FnZX0gZnJvbSAnLi9tZXNzYWdlJztcbmltcG9ydCB7UGFyc2VyfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9jaGFuZ2VfZGV0ZWN0aW9uL3BhcnNlci9wYXJzZXInO1xuXG5leHBvcnQgY29uc3QgSTE4Tl9BVFRSID0gXCJpMThuXCI7XG5leHBvcnQgY29uc3QgSTE4Tl9BVFRSX1BSRUZJWCA9IFwiaTE4bi1cIjtcblxuLyoqXG4gKiBBbiBpMThuIGVycm9yLlxuICovXG5leHBvcnQgY2xhc3MgSTE4bkVycm9yIGV4dGVuZHMgUGFyc2VFcnJvciB7XG4gIGNvbnN0cnVjdG9yKHNwYW46IFBhcnNlU291cmNlU3BhbiwgbXNnOiBzdHJpbmcpIHsgc3VwZXIoc3BhbiwgbXNnKTsgfVxufVxuXG5cbi8vIE1hbiwgdGhpcyBpcyBzbyB1Z2x5IVxuZXhwb3J0IGZ1bmN0aW9uIHBhcnRpdGlvbihub2RlczogSHRtbEFzdFtdLCBlcnJvcnM6IFBhcnNlRXJyb3JbXSk6IFBhcnRbXSB7XG4gIGxldCByZXMgPSBbXTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgKytpKSB7XG4gICAgbGV0IG4gPSBub2Rlc1tpXTtcbiAgICBsZXQgdGVtcCA9IFtdO1xuICAgIGlmIChfaXNPcGVuaW5nQ29tbWVudChuKSkge1xuICAgICAgbGV0IGkxOG4gPSAoPEh0bWxDb21tZW50QXN0Pm4pLnZhbHVlLnN1YnN0cmluZyg1KS50cmltKCk7XG4gICAgICBpKys7XG4gICAgICB3aGlsZSAoIV9pc0Nsb3NpbmdDb21tZW50KG5vZGVzW2ldKSkge1xuICAgICAgICB0ZW1wLnB1c2gobm9kZXNbaSsrXSk7XG4gICAgICAgIGlmIChpID09PSBub2Rlcy5sZW5ndGgpIHtcbiAgICAgICAgICBlcnJvcnMucHVzaChuZXcgSTE4bkVycm9yKG4uc291cmNlU3BhbiwgXCJNaXNzaW5nIGNsb3NpbmcgJ2kxOG4nIGNvbW1lbnQuXCIpKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmVzLnB1c2gobmV3IFBhcnQobnVsbCwgbnVsbCwgdGVtcCwgaTE4biwgdHJ1ZSkpO1xuXG4gICAgfSBlbHNlIGlmIChuIGluc3RhbmNlb2YgSHRtbEVsZW1lbnRBc3QpIHtcbiAgICAgIGxldCBpMThuID0gX2ZpbmRJMThuQXR0cihuKTtcbiAgICAgIHJlcy5wdXNoKG5ldyBQYXJ0KG4sIG51bGwsIG4uY2hpbGRyZW4sIGlzUHJlc2VudChpMThuKSA/IGkxOG4udmFsdWUgOiBudWxsLCBpc1ByZXNlbnQoaTE4bikpKTtcbiAgICB9IGVsc2UgaWYgKG4gaW5zdGFuY2VvZiBIdG1sVGV4dEFzdCkge1xuICAgICAgcmVzLnB1c2gobmV3IFBhcnQobnVsbCwgbiwgbnVsbCwgbnVsbCwgZmFsc2UpKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzO1xufVxuXG5leHBvcnQgY2xhc3MgUGFydCB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyByb290RWxlbWVudDogSHRtbEVsZW1lbnRBc3QsIHB1YmxpYyByb290VGV4dE5vZGU6IEh0bWxUZXh0QXN0LFxuICAgICAgICAgICAgICBwdWJsaWMgY2hpbGRyZW46IEh0bWxBc3RbXSwgcHVibGljIGkxOG46IHN0cmluZywgcHVibGljIGhhc0kxOG46IGJvb2xlYW4pIHt9XG5cbiAgZ2V0IHNvdXJjZVNwYW4oKTogUGFyc2VTb3VyY2VTcGFuIHtcbiAgICBpZiAoaXNQcmVzZW50KHRoaXMucm9vdEVsZW1lbnQpKVxuICAgICAgcmV0dXJuIHRoaXMucm9vdEVsZW1lbnQuc291cmNlU3BhbjtcbiAgICBlbHNlIGlmIChpc1ByZXNlbnQodGhpcy5yb290VGV4dE5vZGUpKVxuICAgICAgcmV0dXJuIHRoaXMucm9vdFRleHROb2RlLnNvdXJjZVNwYW47XG4gICAgZWxzZVxuICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW5bMF0uc291cmNlU3BhbjtcbiAgfVxuXG4gIGNyZWF0ZU1lc3NhZ2UocGFyc2VyOiBQYXJzZXIpOiBNZXNzYWdlIHtcbiAgICByZXR1cm4gbmV3IE1lc3NhZ2Uoc3RyaW5naWZ5Tm9kZXModGhpcy5jaGlsZHJlbiwgcGFyc2VyKSwgbWVhbmluZyh0aGlzLmkxOG4pLFxuICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbih0aGlzLmkxOG4pKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfaXNPcGVuaW5nQ29tbWVudChuOiBIdG1sQXN0KTogYm9vbGVhbiB7XG4gIHJldHVybiBuIGluc3RhbmNlb2YgSHRtbENvbW1lbnRBc3QgJiYgaXNQcmVzZW50KG4udmFsdWUpICYmIG4udmFsdWUuc3RhcnRzV2l0aChcImkxOG46XCIpO1xufVxuXG5mdW5jdGlvbiBfaXNDbG9zaW5nQ29tbWVudChuOiBIdG1sQXN0KTogYm9vbGVhbiB7XG4gIHJldHVybiBuIGluc3RhbmNlb2YgSHRtbENvbW1lbnRBc3QgJiYgaXNQcmVzZW50KG4udmFsdWUpICYmIG4udmFsdWUgPT0gXCIvaTE4blwiO1xufVxuXG5mdW5jdGlvbiBfZmluZEkxOG5BdHRyKHA6IEh0bWxFbGVtZW50QXN0KTogSHRtbEF0dHJBc3Qge1xuICBsZXQgaTE4biA9IHAuYXR0cnMuZmlsdGVyKGEgPT4gYS5uYW1lID09IEkxOE5fQVRUUik7XG4gIHJldHVybiBpMThuLmxlbmd0aCA9PSAwID8gbnVsbCA6IGkxOG5bMF07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtZWFuaW5nKGkxOG46IHN0cmluZyk6IHN0cmluZyB7XG4gIGlmIChpc0JsYW5rKGkxOG4pIHx8IGkxOG4gPT0gXCJcIikgcmV0dXJuIG51bGw7XG4gIHJldHVybiBpMThuLnNwbGl0KFwifFwiKVswXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlc2NyaXB0aW9uKGkxOG46IHN0cmluZyk6IHN0cmluZyB7XG4gIGlmIChpc0JsYW5rKGkxOG4pIHx8IGkxOG4gPT0gXCJcIikgcmV0dXJuIG51bGw7XG4gIGxldCBwYXJ0cyA9IGkxOG4uc3BsaXQoXCJ8XCIpO1xuICByZXR1cm4gcGFydHMubGVuZ3RoID4gMSA/IHBhcnRzWzFdIDogbnVsbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1lc3NhZ2VGcm9tQXR0cmlidXRlKHBhcnNlcjogUGFyc2VyLCBwOiBIdG1sRWxlbWVudEFzdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyOiBIdG1sQXR0ckFzdCk6IE1lc3NhZ2Uge1xuICBsZXQgZXhwZWN0ZWROYW1lID0gYXR0ci5uYW1lLnN1YnN0cmluZyg1KTtcbiAgbGV0IG1hdGNoaW5nID0gcC5hdHRycy5maWx0ZXIoYSA9PiBhLm5hbWUgPT0gZXhwZWN0ZWROYW1lKTtcblxuICBpZiAobWF0Y2hpbmcubGVuZ3RoID4gMCkge1xuICAgIGxldCB2YWx1ZSA9IHJlbW92ZUludGVycG9sYXRpb24obWF0Y2hpbmdbMF0udmFsdWUsIG1hdGNoaW5nWzBdLnNvdXJjZVNwYW4sIHBhcnNlcik7XG4gICAgcmV0dXJuIG5ldyBNZXNzYWdlKHZhbHVlLCBtZWFuaW5nKGF0dHIudmFsdWUpLCBkZXNjcmlwdGlvbihhdHRyLnZhbHVlKSk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEkxOG5FcnJvcihwLnNvdXJjZVNwYW4sIGBNaXNzaW5nIGF0dHJpYnV0ZSAnJHtleHBlY3RlZE5hbWV9Jy5gKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlSW50ZXJwb2xhdGlvbih2YWx1ZTogc3RyaW5nLCBzb3VyY2U6IFBhcnNlU291cmNlU3BhbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlcjogUGFyc2VyKTogc3RyaW5nIHtcbiAgdHJ5IHtcbiAgICBsZXQgcGFyc2VkID0gcGFyc2VyLnNwbGl0SW50ZXJwb2xhdGlvbih2YWx1ZSwgc291cmNlLnRvU3RyaW5nKCkpO1xuICAgIGlmIChpc1ByZXNlbnQocGFyc2VkKSkge1xuICAgICAgbGV0IHJlcyA9IFwiXCI7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhcnNlZC5zdHJpbmdzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIHJlcyArPSBwYXJzZWQuc3RyaW5nc1tpXTtcbiAgICAgICAgaWYgKGkgIT0gcGFyc2VkLnN0cmluZ3MubGVuZ3RoIC0gMSkge1xuICAgICAgICAgIHJlcyArPSBgPHBoIG5hbWU9XCIke2l9XCIvPmA7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiByZXM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN0cmluZ2lmeU5vZGVzKG5vZGVzOiBIdG1sQXN0W10sIHBhcnNlcjogUGFyc2VyKTogc3RyaW5nIHtcbiAgbGV0IHZpc2l0b3IgPSBuZXcgX1N0cmluZ2lmeVZpc2l0b3IocGFyc2VyKTtcbiAgcmV0dXJuIGh0bWxWaXNpdEFsbCh2aXNpdG9yLCBub2Rlcykuam9pbihcIlwiKTtcbn1cblxuY2xhc3MgX1N0cmluZ2lmeVZpc2l0b3IgaW1wbGVtZW50cyBIdG1sQXN0VmlzaXRvciB7XG4gIHByaXZhdGUgX2luZGV4OiBudW1iZXIgPSAwO1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9wYXJzZXI6IFBhcnNlcikge31cblxuICB2aXNpdEVsZW1lbnQoYXN0OiBIdG1sRWxlbWVudEFzdCwgY29udGV4dDogYW55KTogYW55IHtcbiAgICBsZXQgbmFtZSA9IHRoaXMuX2luZGV4Kys7XG4gICAgbGV0IGNoaWxkcmVuID0gdGhpcy5fam9pbihodG1sVmlzaXRBbGwodGhpcywgYXN0LmNoaWxkcmVuKSwgXCJcIik7XG4gICAgcmV0dXJuIGA8cGggbmFtZT1cImUke25hbWV9XCI+JHtjaGlsZHJlbn08L3BoPmA7XG4gIH1cblxuICB2aXNpdEF0dHIoYXN0OiBIdG1sQXR0ckFzdCwgY29udGV4dDogYW55KTogYW55IHsgcmV0dXJuIG51bGw7IH1cblxuICB2aXNpdFRleHQoYXN0OiBIdG1sVGV4dEFzdCwgY29udGV4dDogYW55KTogYW55IHtcbiAgICBsZXQgaW5kZXggPSB0aGlzLl9pbmRleCsrO1xuICAgIGxldCBub0ludGVycG9sYXRpb24gPSByZW1vdmVJbnRlcnBvbGF0aW9uKGFzdC52YWx1ZSwgYXN0LnNvdXJjZVNwYW4sIHRoaXMuX3BhcnNlcik7XG4gICAgaWYgKG5vSW50ZXJwb2xhdGlvbiAhPSBhc3QudmFsdWUpIHtcbiAgICAgIHJldHVybiBgPHBoIG5hbWU9XCJ0JHtpbmRleH1cIj4ke25vSW50ZXJwb2xhdGlvbn08L3BoPmA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBhc3QudmFsdWU7XG4gICAgfVxuICB9XG5cbiAgdmlzaXRDb21tZW50KGFzdDogSHRtbENvbW1lbnRBc3QsIGNvbnRleHQ6IGFueSk6IGFueSB7IHJldHVybiBcIlwiOyB9XG5cbiAgcHJpdmF0ZSBfam9pbihzdHJzOiBzdHJpbmdbXSwgc3RyOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBzdHJzLmZpbHRlcihzID0+IHMubGVuZ3RoID4gMCkuam9pbihzdHIpO1xuICB9XG59XG4iXX0=