const refle = extendContent(Unit, "advance-alloy-wall-large", {
	handleBulletHit(entity, bullet){
		this.super$handleBulletHit(entity, bullet);
		
		const vec = new Vec2();
		
		vec.trns(Angles.angle(entity.x, entity.y, bullet.x, bullet.y), this.size * Vars.tilesize / 2);
		
		if(Mathf.chance(this.lightningChance)){
			Lightning.create(entity.getTeam(), Color.valueOf("a9d8ff"), this.lightningDamage, vec.x + entity.x, vec.y + entity.y, bullet.rot() + 180, this.lightningLength + Mathf.random(0, 4));
		}
	}
});

refle.lightningChance = 0.1;
refle.lightningDamage = 17;
refle.lightningLength = 15;