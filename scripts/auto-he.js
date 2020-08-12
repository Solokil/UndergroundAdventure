const autoHe = extendContent(UnitType, "auto-he", {
	update(){
		this.super$update();
			
		this.health += his.weapon.bullet.damage;
		his.weapon.bullet.damage += 1
		
	}
			
	
	
});

