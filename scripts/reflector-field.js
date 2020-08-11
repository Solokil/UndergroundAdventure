/*const refle = extendContent(UnitType, "reflector", {
	handleBulletHit(entity, bullet){
		
		/*
		const vec = new Vec2();
		
		vec.trns(Angles.angle(entity.x, entity.y, bullet.x, bullet.y), 1);
		
		if(Mathf.chance(this.reflectChance)){
			Lightning.create(entity.getTeam(), Color.valueOf(bullet.frontColor), bullet.damage, vec.x + entity.x, vec.y + entity.y, bullet.rot() + 180, this.lightningLength + Mathf.random(0, 4));
		}else 
                {
                        this.super$handleBulletHit(entity, bullet);
                }*/
	}
});

refle.reflectChance = 0.99;
refle.lightningLength = 10;
/*
