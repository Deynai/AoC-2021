module.exports = function Grid(grid){
    this.grid = grid;
    
    Grid.prototype.iterate = function(callback){
        for(let i = 0; i < grid.length; i++){
            for(let j = 0; j < grid[0].length; j++){
                callback(i, j);
            }
        }
    }

    Grid.prototype.grid = function(){
        return this.grid;
    }
}