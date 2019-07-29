GenerationUtils.findSurface = function(x, y, z){
    while(y > 0 && World.getBlockID(x,y,z) == 0) y--;
    return {x:x, y:y, z:z};
}

var MicroWorld = new Dimension({
    name:"MicroWorld",
    
    generation:{
        layers:[
            { 
                range: [0, 2],
                noise: {
                    octaves: {
                        count: 4,
                        weight: 0.6,
                        scale: [1, 0.4, 1]
                    }
                },
                            
                gradient: [[-1, 1], [1, 1]],
                terrain: {
                    base: 7,
                }
            },
            { 
                range: [2, 30],
                noise: {
                    octaves: {
                        count: 4,
                        weight: 1,
                        scale: [1, 1, 1]
                    }
                },
                            
                gradient: [[-1, 1], [1, 1]],
                terrain: {
                    base: 1,
                }
            },
            { 
                range: [2, 80],
                noise: {
                    octaves: {
                        count: 1,
                        weight: 1,
                        scale: [.5, .5, .5]
                    }
                },
                            
                gradient: [
                    [-1, 0.9],
                    [-0.6, 0.3],
                    [-0.2, 0.7],
                    [0.2, 0.3],
                    [0.6, 1],
                    [1, .1]
                ],
                terrain: {
                    base: [1,0],
                    cover:{
                        height:4,
                        block:3,
                        top:2
                    }
                }
            },      
        ],
        
        decoration:{
            biome:127,
            features:false
        }
    }
});

Callback.addCallback("LevelLoaded", function(){
    if(!MicroWorld.isInDimension())
        MicroWorld.transferIn();
});

MicroWorld.debugTerrainSlice(200, 1, true);