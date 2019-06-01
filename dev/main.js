/*Core*/
IDRegistry.genBlockID("core");
Block.createBlock("core", [{
    name: "Core", 
    texture: [
        ["generator", 0]
    ], 
    inCreative: true //(добавлять ли данную вариацию блока в креатив)
}]);

Callback.addCallback("ItemUse", function(c, i, b){
	if(i.id == 288)
		StructuresAPI.set("a", c.x, c.y, c.z);
	
	if(i.id == 280)
		StructuresAPI.set("a", c.x, c.y, c.z, StructuresAPI.ROTATE_RANDOM);
	
	if(i.id == 262)
		alert(StructuresAPI.getStructures("a", c.x, c.y, c.z));
	
});