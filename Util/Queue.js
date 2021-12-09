module.exports = function Queue(){
    this.elements = [];

    Queue.prototype.enqueue = function(element){
        this.elements.push(element);
    }

    Queue.prototype.dequeue = function(){
        return this.elements.shift();
    }

    Queue.prototype.isEmpty = function(){
        return this.elements.length === 0;
    }

    Queue.prototype.peek = function(){
        return !this.isEmpty() ? this.elements[0] : undefined;
    }

    Queue.prototype.length = function(){
        return this.elements.length;
    }

    Queue.prototype.contains = function(element){
        for (let i = 0; i < this.elements.length; i++){
            if (this.elements[i] === element) { return true; }
        }
        return false;
    }
}