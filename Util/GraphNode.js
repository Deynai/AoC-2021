module.exports = function Node(val){
    this.value = val;
    this.links = [];

    Node.prototype.setValue = function(val){
        this.value = val;
    }

    Node.prototype.value = function(){
        return this.value;
    }

    Node.prototype.links = function(){
        return this.links;
    }

    Node.prototype.addLink = function(node){
        this.links.push(node);
    }
}