const autoHe = extendContent(UnitType, "auto-he", {
	update(){
		this.super$update();
			
		this.health += this.weapon.bullet.damage;
		this.weapon.bullet.damage += 1;
		
	}
			
	
	
});

