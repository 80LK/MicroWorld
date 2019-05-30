LIBRARY({
    name: "StructuresAPI", // по этому имени библиотека будет импортирована
    version: 1, // код версии должен быть целым числом больше 0, при каждом обновлении библиотеки его надо увеличивать и указывать в документации к ней
    shared: false, // если true, то библиотека будет глобальной
    api: "CoreEngine" // название API, которое использует библиотека
});

var StructuresAPI = {
	ROTATE_NONE:0,
	
	ROTATE_90Y: 1,
	ROTATE_180Y:2,
	ROTATE_270Y:3,
	
	ROTATE_90X: 4,
	ROTATE_180X:5,
	ROTATE_270X:6,
	
	ROTATE_90Z: 7,
	ROTATE_180Z:8,
	ROTATE_270Z:9,
	
	ROTATE_RANDOM:[0,1,2,3,4,5,6,7,8,9],
	
	dir:"structures",
	structures:{},
	
	init:function(params){
		
	},
	
	get:function(name){
		if(!this.structures.hasOwnProperty(name)){
			var path = __dir__ + this.dir + "/" + name + ".struct";
			
			if(FileTools.isExists(path))
				this.structures[name] = JSON.parse(FileTools.ReadText(path));
			else{
				alert("Структура \""+name+"\" не найдена");
				return false;
			}
		}
		return this.structures[name];
	},
	
	save:function(name, obj){
		for(var i = 0; i < obj.length; i++){
			if(obj[i][3].data == 0)
				obj[i][3] = obj[i][3].id;
		}
		
		this.structures[name] = obj;
		FileTools.WriteText(__dir__ + this.dir + "/" + name + ".struct", JSON.stringify(obj));
	},
	
	set:function(name, x, y, z, rotate){
		if(rotate === undefined)rotate = StructuresAPI.ROTATE_NONE;
		if(rotate instanceof Array){
			if(rotate.indexOf(StructuresAPI.ROTATE_NONE) == -1)
				rotate.push(StructuresAPI.ROTATE_NONE);
			
			rotate = rotate[Math.round(rand(0, rotate.length-1))];
		}
		
		var arr = this.get(name);
		
		if(arr === false)return false;
		
		for(var i = 0; i < arr.length; i++){
			var block = arr[i];
			var id, data = 0;
			
			if(typeof block[3] == "number"){
				id = block[3];
			}else{
				id = block[3].id || 2;
				data = block[3].data || block[3].meta || 0;
			}
			
			switch(rotate){
				case StructuresAPI.ROTATE_NONE:
					World.setBlock(x+block[0], y+block[1], z+block[2], id, data);
				break;
				
				case StructuresAPI.ROTATE_90Y:
					World.setBlock(x+block[2], y+block[1], z-block[0], id, data);
				break;
				case StructuresAPI.ROTATE_180Y:
					World.setBlock(x-block[0], y+block[1], z-block[2], id, data);
				break;
				case StructuresAPI.ROTATE_270Y:
					World.setBlock(x-block[2], y+block[1], z+block[0], id, data);
				break;
				
				case StructuresAPI.ROTATE_90X:
					World.setBlock(x+block[0], y-block[2], z+block[1], id, data);
				break;
				case StructuresAPI.ROTATE_180X:
					World.setBlock(x+block[0], y-block[1], z-block[2], id, data);
				break;
				case StructuresAPI.ROTATE_270X:
					World.setBlock(x+block[0], y+block[2], z-block[1], id, data);
				break;
				
				case StructuresAPI.ROTATE_90Z:
					World.setBlock(x-block[1], y+block[0], z+block[2], id, data);
				break;
				case StructuresAPI.ROTATE_180Z:
					World.setBlock(x-block[0], y-block[1], z+block[2], id, data);
				break;
				case StructuresAPI.ROTATE_270Z:
					World.setBlock(x+block[1], y-block[0], z+block[2], id, data);
				break;
				
				
			}
		}
	}
}

ModAPI.addAPICallback("WorldEdit", function(WorldEdit){
	WorldEdit.addCommand({
		name:"/save",
		description:"Save structure.",
		args:"<file_name> [-a] [-x] [-y] [-z]",
		selectedArea:true,
		event:function(args){
			var pos = WorldEdit.getPosition();
			var arr = [];
			
			var center_x = args.indexOf("-x")!=-1 ? args[args.indexOf("-x") + 1] : pos.pos1.x;
			var center_y = args.indexOf("-y")!=-1 ? args[args.indexOf("-y") + 1] : pos.pos1.y;
			var center_z = args.indexOf("-z")!=-1 ? args[args.indexOf("-z") + 1] : pos.pos1.z;
			
			for(x = pos.pos1.x; x <= pos.pos2.x; x++)
				for(y = pos.pos1.y; y <= pos.pos2.y; y++)
					for(z = pos.pos1.z; z <= pos.pos2.z; z++){
						var block = World.getBlock(x,y,z);
						if(args.indexOf("-a") == -1 && block.id == 0) continue;
						
						arr.push([
							x - center_x,
							y - center_y,
							z - center_z,
							block
						]);
					}
				
			StructuresAPI.save(args[0], arr);
			Game.message(Translation.sprintf("Saved to %s", StructuresAPI.dir+"/"+args[0]+".struct"));
		}
	});
});

function rand(min, max){
	if(min === undefined)min=0;
	if(max === undefined)max=min+1;
	
	return (max-min) * Math.random() + min;
}

/*Language*/
Translation.addTranslation("Saved to %s",{
	ru:"Сохранено в %s",
	en:"Saved to %s",
});
Translation.addTranslation("Save structure.",{
	ru:"Сохранить структуру.",
	en:"Save structure.",
});

if(!Translation.sprintf){
	Translation.sprintf = function(original, ...rpls){
		var str = Translation.translate(original);
		for(var i = 0; i < rpls.length; i++){
			str.replace("%s", rpls[i]);
		}
	};
}

EXPORT("StructuresAPI", StructuresAPI);