module.exports = function Stack(){
    this.elements = [];

    Stack.prototype.add = function(element){
        this.elements.push(element);
    }

    Stack.prototype.pop = function(){
        if(this.isEmpty) { return undefined; }
        
        let val = this.elements.at(-1);
        this.elements.splice(-1, 1);
        return val;
    }

    Stack.prototype.isEmpty = function(){
        return this.elements.length === 0;
    }

    Stack.prototype.peek = function(){
        return !this.isEmpty() ? this.elements.at(-1) : undefined;
    }

    Stack.prototype.length = function(){
        return this.elements.length;
    }

    Stack.prototype.contains = function(element){
        for (let i = 0; i < this.elements.length; i++){
            if (this.elements[i] === element) { return true; }
        }
        return false;
    }
}