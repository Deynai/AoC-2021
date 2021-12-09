module.exports = function HashSet(){
    this.elements = {};

    // add a hash helper so we can pass any element and it will work properly
    // i.e if we pass it [0,2] it converts the array into a hash before adding.

    HashSet.prototype.add = function(element){
        if (this.elements[element] !== undefined){
            throw console.error(`HashSet already contains element ${element}`);
        }
        else{
            this.elements[element] = true;
        }
    }

    HashSet.prototype.remove = function(element){
        delete this.elements[element];
    }

    HashSet.prototype.length = function(){
        return Object.keys(this.elements).length;
    }

    HashSet.prototype.contains = function(element){
        return this.elements[element] !== undefined;
    }
}