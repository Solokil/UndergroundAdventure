const refle = extendContent(UnitType, "reflector", {
	handleBulletHit(entity, bullet){
		
		
		const vec = new Vec2();
		
		vec.trns(Angles.angle(entity.x, entity.y, bullet.x, bullet.y), this.size * Vars.tilesize / 2);
		
		if(Mathf.chance(this.reflectChance)){
			Bullet.create(entity.getTeam(), Color.valueOf("a9d8ff"), this.lightningDamage, vec.x + entity.x, vec.y + entity.y, bullet.rot() + 180, this.lightningLength + Mathf.random(0, 4));
		}else 
                {this.super$handleBulletHit(entity, bullet);}
	}
});

refle.reflectChance = 0.99;
