LIBRARY({
    name: "StructuresAPI", // по этому имени библиотека будет импортирована
    version: 1, // код версии должен быть целым числом больше 0, при каждом обновлении библиотеки его надо увеличивать и указывать в документации к ней
    shared: false, // если true, то библиотека будет глобальной
    api: "CoreEngine" // название API, которое использует библиотека
});

var StructuresAPI = {
	dir:"structures",
	structures:{},
	
	init:function(params){
		
	},
	
	get:function(name){
		if(!this.structures.hasOwnProperty(name)){
			if(FileTools.isExists(__dir__ + this.dir + "/" + name + ".struct"))
				this.structures[name] = JSON.parse(FileTools.ReadText(__dir__ + this.dir + "/" + name + ".struct"));
			else
				alert("Структура не найдена");
		}
		return this.structures[name];
	},
	
	save:function(name, obj){
		for(var i = 0; i < obj.length; i++){
			if(obj[i][3].data == 0)
				obj[i][3] = obj[i][3].id;
		}
		
		FileTools.WriteText(__dir__ + this.dir + "/" + name + ".struct", JSON.stringify(obj));
	},
	
	set:function(name, x, y, z){
		var str = this.get(name);
		for(var i = 0; i < str.length; i++){
			var block = str[i];
			var id, data = 0;
			
			if(typeof block[3] == "number"){
				id = block[3];
			}else{
				id = block[3].id || 2;
				data = block[3].data || block[3].meta || 0;
			}
			
			World.setBlock(x+block[0], y+block[1], z+block[2], id, data);
		}
	}
}

ModAPI.addAPICallback("WorldEdit", function(api){
	var WorldEdit = api;
	WorldEdit.addCommand({
		name:"/save",
		description:"Save structure",
		args:"<file_name>",
		selectedArea:true,
		event:function(args){
			var pos = WorldEdit.getPosition();
			var arr = [];
			
			for(x = pos.pos1.x; x <= pos.pos2.x; x++)
				for(y = pos.pos1.y; y <= pos.pos2.y; y++)
					for(z = pos.pos1.z; z <= pos.pos2.z; z++)
						arr.push([
							x - pos.pos1.x,
							y - pos.pos1.y,
							z - pos.pos1.z,
							World.getBlock(x,y,z)
						]);
				
			StructuresAPI.save(args[0], arr);
			Game.message("Сохранено в "+StructuresAPI.dir+"/"+args[0]+".struct");
		}
	});
});

EXPORT("StructuresAPI", StructuresAPI);