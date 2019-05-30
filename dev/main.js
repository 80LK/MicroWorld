Callback.addCallback("ItemUse", function(c, i, b){
	if(i.id == 288)
		StructuresAPI.set("a", c.x, c.y, c.z);
	
	if(i.id == 280)
		StructuresAPI.set("a", c.x, c.y, c.z, StructuresAPI.ROTATE_RANDOM);
	
});