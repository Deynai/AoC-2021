module.exports = function Queue(){
    this.elements = [];

    Queue.prototype.enqueue = function(element){
        this.elements.push(element);
    }

    Queue.prototype.enqueueSorted = function(element, comparator){
        
        if (this.elements.length == 0 || !comparator(element, this.elements[this.elements.length-1])) {
            this.elements.push(element);
            return;
        }

        if (comparator(element, this.elements[0])){
            this.elements.splice(0,0,element);
            return;
        }

        let minIndex = 0;
        let maxIndex = this.elements.length - 1;

        while (maxIndex - minIndex > 0){
            let middle = Math.floor((maxIndex + minIndex)/2)

            if (!comparator(element, this.elements[middle]) && comparator(element, this.elements[middle+1])){
                this.elements.splice(middle + 1, 0, element);
                return;
            }

            if (comparator(element, this.elements[middle])){
                maxIndex = middle;
            }
            else{
                minIndex = middle;
            }
        }
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