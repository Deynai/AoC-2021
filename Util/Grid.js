module.exports = function Grid(grid){
    this.grid = grid;
    
    Grid.prototype.iterate = function(callback){
        for(let i = 0; i < grid.length; i++){
            for(let j = 0; j < grid[0].length; j++){
                callback(i, j);
            }
        }
    }

    Grid.prototype.height = function(){
        return this.grid.length;
    }

    Grid.prototype.width = function(){
        return grid.length > 0 ? this.grid[0].length : undefined;
    }

    Grid.prototype.isValid = function(i, j){
        return i >= 0 && i < this.height() && j >= 0 && j < this.width();
    }

    Grid.prototype.grid = function(){
        return this.grid;
    }
}