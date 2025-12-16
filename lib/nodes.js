"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nodes = void 0;
var Nodes = /** @class */ (function () {
    function Nodes(nodes) {
        this.nodes = nodes;
        this.nodeIndex = -1;
    }
    Nodes.prototype.size = function () {
        return this.nodes.length;
    };
    Nodes.prototype.next = function () {
        this.nodeIndex++;
        if (this.nodeIndex >= this.nodes.length) {
            return null;
        }
        return this.nodes[this.nodeIndex];
    };
    Nodes.prototype.get = function (index) {
        if (index === -1) {
            return this.nodes.length > 0 ? this.nodes[this.nodes.length - 1] : null;
        }
        if (index < 0 || index >= this.nodes.length) {
            return null;
        }
        return this.nodes[index];
    };
    return Nodes;
}());
exports.Nodes = Nodes;
//# sourceMappingURL=nodes.js.map