var totalSegments = 100;   // 752 = weapons  944 && 958 && 978 = mod name use and weapon name

var segmentOffset = 15;

const tempVec = new Vec2();
const tempVecB = new Vec2();
const tempVecC = new Vec2();
const tempVecD = new Vec2();

var persistantTiles = [];
//var expectedHealth = [];

/*const clearHoles = (array) => {
	return array != null;
};*/

const clearHoles = function(array){
	return array != null;
};

const updatePersistantTiles = () => {
	if(persistantTiles.length == 0 || Vars.state.is(GameState.State.menu) || Vars.state.isPaused()) return;
	persistantTiles = persistantTiles.filter(clearHoles);
	//expectedHealth = expectedHealth.filter(clearHoles);
	
	for(var i = 0; i < persistantTiles.length; i++){
		var tileB = persistantTiles[i];
		//var eHealth = expectedHealth[i];
		//if(tileB == null) continue;
		var entityB = tileB.ent();
		
		/*if(entityB != null && entityB.health() > Math.min(entityB.maxHealth() - 0.0001, Math.max(eHealth + 50, 0)) && !entityB.isDead() && tileB != null){
			entityB.kill();
			persistantTiles[i] = null;
			expectedHealth[i] = null;
		}else{
			persistantTiles[i] = null;
			expectedHealth[i] = null;
		};*/
		if(entityB != null && /*Mathf.equal(entityB.health(), entityB.maxHealth(), 9) &&*/ tileB != null){
			var lastHealth = entityB.health();
			//print("last:" + lastHealth);
			entityB.damage(5);
			//print(lastHealth + "/" + entityB.health);
			if(Mathf.equal(lastHealth, entityB.health, 0.001) || Mathf.equal(entityB.health, entityB.maxHealth(), 2)){
				//print(lastHealth + "/" + entityB.health);
				entityB.kill();
				//print("test");
			};
		};
		persistantTiles[i] = null;
	};
	//print(persistantTiles + "\n" + expectedHealth);
};

Events.on(EventType.ResetEvent, cons(event => {
	/*for(var i = 0; i < persistantTiles.length; i++){
		persistantTiles[i] = null;
	}*/
	persistantTiles = [];
}));

Events.on(EventType.Trigger.update, run(() => {updatePersistantTiles()}));

const segmentBullet = new BasicBulletType(8, 17, "shell");
segmentBullet.lifetime = 30;
segmentBullet.bulletWidth = 6;
segmentBullet.bulletHeight = 10;
segmentBullet.bulletShrink = 0.1;
segmentBullet.keepVelocity = false;
segmentBullet.frontColor = Pal.missileYellow;
segmentBullet.backColor = Pal.missileYellowBack;

const wormMissile = extend(BasicBulletType, {
	update(b){
		this.super$update(b);
		
		if(Mathf.chance(Time.delta() * 0.2)){
			Effects.effect(Fx.missileTrail, Pal.missileYellowBack, b.x, b.y, 2);
		};
		
		b.velocity().rotate(Mathf.sin(Time.time() + b.id * 4422, this.weaveScale, this.weaveMag) * Time.delta());
	}
});
wormMissile.speed = 8;
wormMissile.damage = 12;
wormMissile.bulletSprite = "missile";
wormMissile.weaveScale = 9;
wormMissile.weaveMag = 2;
wormMissile.homingPower = 1;
wormMissile.homingRang.e = 60;
wormMissile.splashDamage = 20;
womMissile.splashDamageRadius = 25;
wormMissile.hitEffect = Fx.hitMeltdown;
wormMissile.despawnEffect = Fx.none;
wormMissile.hitSize = 4;
wormMissile.lifetime = 24;
wormMissile.bulletWidth = 10;
wormMissile.bulletHeight = 16;
wormMissile.bulletShrink = 0.1;
wormMissile.keepVelocity = false;
wormMissile.frontColor = Pal.missileYellow;
wormMissile.backColor = Pal.missileYellowBack;

const tempRect = new Rect();

const wormBullet = extend(BasicBulletType, {
	update(b){
		this.super$update(b);
		
		if(b.timer.get(1, 32767)){
			b.setData([b.getOwner(), b.getTeam()]);
		};
		
		if(b.getData() != null && (b.getOwner() != b.getData()[0] || b.getTeam() != b.getData()[1])) b.resetOwner(b.getData()[0], b.getData()[1]);
		
		/*b.hitbox(tempRect);
		Units.nearbyEnemies(b.getTeam(), tempRect.x, tempRect.y, tempRect.width, tempRect.height, cons(unit => {
			if(unit.getTeam() != b.getTeam()){
				var lastHealthC = unit.health();
				
				print(lastHealthC);
				
				unit.damage(1);
				
				print(lastHealthC + "/" + unit.health);
				
				if(Mathf.equal(lastHealthC, unit.health, 0.002)){
					print("killed");
					unit.kill();
				};
				
				//print("test");
				
				if(unit.health > 6000){
					unit.damage(Math.max((unit.health - 6000) * 1.3, 0));
					print(Math.max((unit.health - 6000) * 1.3, 0) + "#");
				};
			}
		}));*/
		
		b.velocity().rotate(Mathf.sin(Time.time() + b.id * 4422, this.weaveScale, this.weaveMag) * Time.delta());
	},
	
	hit(b, x, y){
		if(x == null || y == null) return;
		this.super$hit(b, x, y);
		
		b.hitbox(tempRect);
		Units.nearbyEnemies(b.getTeam(), tempRect.x, tempRect.y, tempRect.width, tempRect.height, cons(unit => {
			if(unit.getTeam() != b.getTeam()){
				var lastHealthC = unit.health();
				
				//print(lastHealthC);
				
				unit.damage(1);
				
				//print(lastHealthC + "/" + unit.health);
				
				if(Mathf.equal(lastHealthC, unit.health, 0.002)){
					//print("killed");
					unit.kill();
				};
				
				//print("test");
				
				if(unit.health > 7000){
					unit.damage(Math.max((unit.health - 7000) * 0.5, 0));
				};
			}
		}));
	},
	
	hitTile(b, tile){
		this.super$hitTile(b, tile);
		
		var entity = tile.ent();
		if(entity == null) return;
		
		var lastHealthb = entity.health();
		//print(lastHealthb);
		//var bulletDamage = this.damage + this.splashDamage;
		//var bulletDamageAlt = this.damage;
		//var expectedDamage = entity.health() - bulletDamageAlt;
		tile.block().handleBulletHit(entity, b);
		//print(lastHealthb + "/" + entity.health);
		if(Mathf.equal(lastHealthb, entity.health, 0.002)){
			entity.damage(this.damage * 2);
		};
		
		if(entity.maxHealth() > 8000){
			//bulletDamage += Math.max((entity.maxHealth() - 5000) * 4, 0);
			//expectedDamage = entity.health() - bulletDamageAlt;
			entity.damage(Math.max((entity.maxHealth() - 8000) * 4, 0));
		};
		if(persistantTiles.lastIndexOf(tile) == -1 && !entity.isDead()){
			persistantTiles.push(tile);
			//expectedHealth.push(expectedDamage);
		};
	}
});
wormBullet.speed = 7;
//wormBullet.damage = 40;
wormBullet.damage = 30;
wormBullet.bulletSprite = "shell";
wormBullet.weaveScale = 12;
wormBullet.weaveMag = 6;
wormBullet.homingPower = 1;
wormBullet.homingRange = 60;
wormBullet.splashDamage = 30;
wormBullet.splashDamageRadius = 20;
wormBullet.hitEffect = Fx.hitMeltdown;
wormBullet.despawnEffect = Fx.none;
wormBullet.hitSize = 4;
wormBullet.lifetime = 30;
wormBullet.pierce = true;
wormBullet.bulletWidth = 12;
wormBullet.bulletHeight = 21;
wormBullet.bulletShrink = 0.1;
//scourgeBullet.keepVelocity = false;
wormBullet.frontColor = Pal.missileYellow;
wormBullet.backColor = Pal.missileYellowBack;

//var trueBulletMultiplier = 1;

const bulletCollision = (owner, bullet, multiplier) => {
	//var threshold = Math.max(800 * owner.healthf(), 40);
	//var threshold = Math.max(30 * owner.healthf(), 30);
	//var threshold = Math.max(1400 * owner.healthf(), 130);
	//var threshold = Math.max(1500 * owner.healthf(), 280);
	
	var threshold = Math.max(4500 * owner.healthf(), 750);
	
	//print(multiplier);
	var damageMul = 1;
	var bulletType = bullet.getBulletType();
	var pierceB = bulletType.pierce ? 60 : 1;
	var tempBulletType = bulletType;
	for(var i = 0; i < 5; i++){
		if(tempBulletType.fragBullet != null){
			damageMul *= tempBulletType.fragBullets;
			tempBulletType = tempBulletType.fragBullet;
		};
	};
	var ownerBulletTypes = bulletType == wormBullet || bulletType == segmentBullet || bulletType == wormMissile;
	//print((bulletType.damage + bulletType.splashDamage) * damageMul);
	if(((bulletType.damage + bulletType.splashDamage) * pierceB * damageMul * multiplier > threshold) || ownerBulletTypes){
		var bulletOwner = bullet.getOwner();
		if(bulletOwner != null){
			var bulletAngle = Angles.angle(bullet.x, bullet.y, bulletOwner.x, bulletOwner.y);
			
			var tempB = Bullet.create(bulletType, bulletOwner, bulletOwner.getTeam(), bullet.x, bullet.y, bulletAngle);
			tempB.velocity(bulletType.speed, bulletAngle);
			if(tempB.getBulletType().speed < 1) tempB.set(bulletOwner.x, bulletOwner.y);
			//tempB.resetOwner(owner, owner.getTeam());
			tempB.resetOwner(bulletOwner, owner.getTeam());
			
			var overlay = Bullet.create(overlayBullet, owner, owner.getTeam(), bullet.x, bullet.y, 0);
			overlay.setData(tempB);
			
			bullet.deflect();
			//bullet.time(bulletType.lifetime);
			//owner.healBy(bulletType.damage + bulletType.splashDamage);
			bullet.velocity(bulletType.speed, bulletAngle);
			//bullet.resetOwner(owner, owner.getTeam());
			bullet.resetOwner(bulletOwner, owner.getTeam());
			//bullet.time(0);
		}else{
			bullet.scaleTime(bulletType.lifetime / 15);
		};
		//owner.healBy(((bulletType.damage + bulletType.splashDamage) / (totalSegments / 2)) + Math.min(bulletType.damage, 80));
		owner.getOrigin().health(owner.getOrigin().getLastHealth());
		//print("deflected");
	}
};

//const tempRect = new Rect();

const overlayBullet = extend(BasicBulletType, {
	update(b){
		var otherBullet = b.getData();
		if(otherBullet == null){
			b.time(this.lifetime);
			return;
		};
		var otherBType = otherBullet.getBulletType();
		if(otherBullet.getOwner() instanceof Unit){
			otherBullet.hitbox(tempRect);
			Units.nearbyEnemies(b.getTeam(), tempRect.x, tempRect.y, tempRect.width, tempRect.height, cons(unit => {
				if(unit == otherBullet.getOwner()){
					unit.damage(otherBullet.damage());
					unit.velocity().add(Tmp.v3.set(unit.getX(), unit.getY()).sub(otherBullet.x, otherBullet.y).setLength(otherBType.knockback / unit.mass()));
					unit.applyEffect(otherBType.status, otherBType.statusDuration);
					otherBType.hit(otherBullet, otherBullet.x, otherBullet);
					if(!otherBType.pierce){
						b.time(this.lifetime);
						otherBullet.time(otherBType.lifetime);
					};
				}
			}));
		}
	},
	
	despawned(b){},
	
	hit(b){},
	
	hit(b, x, y){},
	
	draw(b){}
});
overlayBullet.speed = 0.0001;
overlayBullet.damage = 0;
overlayBullet.collidesTiles = false;
overlayBullet.pierce = true;
overlayBullet.lifetime = 10 * 60;

const wormSegment = prov(() => {
	wormSegmentB = extend(FlyingUnit, {
		update(){
			if((this.getParentUnit() == null || (this.getParentUnit().isDead() && this.getParentUnit() != null)) && !this.isDead()){
				//this.kill();
				this.remove();
			};
			
			if(this.isDead()){
				this.remove();
				return;
			};
			
			this.health = this.getTrueParentUnit().health();
			
			if(Vars.net.client()){
				this.interpolate();
				this.status.update(this);
				return;
			};
			
			this.updateTargeting();
			
			this.state.update();
			//this.updateVelocityStatus();
			
			if(this.target != null) this.behavior();
			
			//this.super$update();
			
			//this.updateRotation();
			
			//this.updatePosition();
		},
		
		collision(other, x, y){
			//this.getTrueParentUnit().setCollidedBool(false);
			this.getTrueParentUnit().setExplosionCounter(0);
			
			this.setLastHealth(this.getTrueParentUnit().health());
			
			this.super$collision(other, x, y);
			
			if(other instanceof DamageTrait && other instanceof Bullet){
				if(other.getBulletType().pierce) other.scaleTime(other.getBulletType().damage / 10);
				
				if(other.getOwner() instanceof Lightning && other.getData() > 0){
					//print(other.getData());
					this.healBy((other.getData() / 20) * Math.max(this.getTrueParentUnit().getBulletMultiplier() / 32, 1));
				};
				
				bulletCollision(this, other, this.getTrueParentUnit().getBulletMultiplier());
			};
			//this.super$collision(other, x, y);
		},
		
		isDead(){
			if(this.getParentUnit() == null) return true;
			return this.getParentUnit().isDead();
		},
		
		drawSize(){
			if(!this.getDrawerUnit()) return this.getType().hitsize * 10;
			return (segmentOffset * totalSegments) * 2;
		},
		
		drawCustom(){
			this.super$drawAll();
			
			if(this.getParentUnit() == null) return;
			
			this.getParentUnit().drawCustom();
		},
		
		drawAll(){
			if(this.getDrawerUnit()){
				this.drawCustom();
			};
		},
		
		updateCustom(){
			if(this.getTrueParentUnit() != null){
				this.hitTime = this.getTrueParentUnit().getHitTime();
			};
			
			this.updateRotation();
			
			this.updatePosition();
			
			this.updateVelocityStatus();
			
			if(this.getChildUnit() == null) return;
			
			this.getChildUnit().updateCustom();
		},
		
		damage(amount){
			if(this.getTrueParentUnit() == null) return;
			this.getTrueParentUnit().damage(amount);
		},
		
		healBy(amount){
			if(this.getTrueParentUnit() == null) return;
			this.getTrueParentUnit().healBy(amount);
		},
		
		setChildUnit(a){
			this._childUnit = a;
		},
		
		getDrawerUnit(){
			return this._drawer;
		},
		
		setDrawerUnit(a){
			this._drawer = a;
		},
		
		getChildUnit(){
			if(this._childUnit != null && this._childUnit instanceof Number){
				if(this._childUnit == -1){
					this._childUnit = null;
					return null;
				};
				this.setChildUnit(Vars.unitGroup.getByID(this._childUnit));
			};
			
			return this._childUnit;
		},
		
		setParentUnit(a){
			this._parentUnit = a;
		},
		
		setTrueParentUnit(a){
			this._trueParentUnit = a;
		},
		
		getParentUnit(){
			if(this._parentUnit != null && this._parentUnit instanceof Number){
				if(this._parentUnit == -1){
					this._parentUnit = null;
					return null
				};
				this.setTrueParentUnit(Vars.unitGroup.getByID(this._parentUnit));
			};
			
			return this._parentUnit;
		},
		
		getTrueParentUnit(){
			if(this._trueParentUnit != null && this._trueParentUnit instanceof Number){
				if(this._trueParentUnit == -1){
					this._trueParentUnit = null;
					return null
				};
				this.setTrueParentUnit(Vars.unitGroup.getByID(this._trueParentUnit));
			};
			
			return this._trueParentUnit;
		},
		
		/*drawWeapons(){
			for(var s = 0; s < 2; s++){
				sign = Mathf.signs[s];
				var tra = this.rotation - 90;
				var traB = this.weaponAngles[s];
				//print(this.type.weapon.region);
				//var trY = -this.type.weapon.getRecoil(this, sign > 0) + this.type.weaponOffsetY;
				var trY = this.type.weaponOffsetY;
				var w = -sign * this.type.weapon.region.getWidth() * Draw.scl;
				
				tempVecD.trns(traB, -this.type.weapon.getRecoil(this, sign > 0));
				
				Draw.rect(this.type.weapon.region,
				this.x + Angles.trnsx(tra, this.getWeapon().width * sign, trY) + tempVecD.x,
				this.y + Angles.trnsy(tra, this.getWeapon().width * sign, trY) + tempVecD.y, w, this.type.weapon.region.getHeight() * Draw.scl, this.weaponAngles[s] - 90);
			}
		},*/
		
		getOrigin(){
			return this.getTrueParentUnit();
		},
		
		setLastHealth(a){
			if(this.getTrueParentUnit() == null) return;
			
			this.getTrueParentUnit().setLastHealth(a);
		},
		
		getLastHealth(){
			if(this.getTrueParentUnit() == null) return 0;
			
			return this.getTrueParentUnit().getLastHealth();
		},
		
		getWeaponID(){
			return this._weaponId;
		},
		
		getWeapon(){
			return this.getWeaponID();
		},
		
		setWeapon(a){
			this._weaponId = a;
		},
		
		drawWeapons(){
			for(var s = 0; s < 2; s++){
				sign = Mathf.signs[s];
				var tra = this.rotation - 90;
				var traB = this.weaponAngles[s];
				//print(this.type.weapon.region);
				//var trY = -this.type.weapon.getRecoil(this, sign > 0) + this.type.weaponOffsetY;
				var trY = this.type.weaponOffsetY;
				var w = -sign * this.getWeapon().region.getWidth() * Draw.scl;
				
				tempVecD.trns(traB, -this.getWeapon().getRecoil(this, sign > 0));
				
				Draw.rect(this.getWeapon().region,
				this.x + Angles.trnsx(tra, this.getWeapon().width * sign, trY) + tempVecD.x,
				this.y + Angles.trnsy(tra, this.getWeapon().width * sign, trY) + tempVecD.y, w, this.getWeapon().region.getHeight() * Draw.scl, this.weaponAngles[s] - 90);
			}
		},
		
		drawUnder(){
		},
		
		/*updatePosition(){
			if(this.getParentUnit() == null) return;
			var parentB = this.getParentUnit();
			
			tempVecB.trns(this.rotation, segmentOffset / 2);
			tempVecB.add(this.x, this.y);
			tempVec.trns(this.getParentUnit().rotation - 180, segmentOffset / 2);
			//tempVec.trns(parentB.velocity().angle() - 180, segmentOffset / 2);
			tempVec.add(parentB.x, parentB.y);
			
			var dst = Mathf.dst(tempVecB.x, tempVecB.y, tempVec.x, tempVec.y);
			
			var angle = Angles.angle(tempVecB.x, tempVecB.y, tempVec.x, tempVec.y);
			
			tempVec.setZero();
			tempVecB.setZero();
			
			tempVec.trns(angle, dst);
			//tempVecB.set(tempVec);
			//tempVecB.scl(0.5);
			//tempVecB.limit(1);
			
			//this.velocity().add(tempVecB.x, tempVecB.y);
			
			tempVec.add(this.x, this.y);
			
			this.set(tempVec.x, tempVec.y);
			
			tempVec.setZero();
			//tempVecB.setZero()
		},*/
		
		/*updatePosition(){
			if(this.getParentUnit() == null || this.getTrueParentUnit() == null) return;
			
			//this.updatePositionAlt();
			
			var parentB = this.getParentUnit();
			
			var dst = Mathf.dst(this.x, this.y, parentB.x, parentB.y) - segmentOffset;
			
			var angle = Angles.angle(this.x, this.y, parentB.x, parentB.y);
			var vel = this.velocity();
			
			if(!Mathf.within(this.x, this.y, parentB.x, parentB.y, segmentOffset)){
				tempVec.trns(angle, dst);
				
				tempVecB.trns(angle, parentB.velocity().len());
				
				vel.add(tempVecB.x, tempVecB.y);
				if(Mathf.within(this.x + vel.x, this.y + vel.y, parentB.x, parentB.y, segmentOffset)){
					this.moveBy(-tempVec.x, -tempVec.y);
				};
				this.moveBy(tempVec.x, tempVec.y);
			};
			dst = Mathf.dst(this.x, this.y, parentB.x, parentB.y) - segmentOffset;
			if(dst < 0){
				angle = Angles.angle(this.x, this.y, parentB.x, parentB.y);
				tempVec.trns(angle, dst);
				//vel.add(tempVec.x, tempVec.y);
				this.moveBy(tempVec.x / 4, tempVec.y / 4);
			};
		},*/
		
		updatePosition(){
			if(this.getParentUnit() == null || this.getTrueParentUnit() == null) return;
			
			//this.updatePositionAlt();
			
			var parentB = this.getParentUnit();
			
			var dst = Mathf.dst(this.x, this.y, parentB.x, parentB.y) - segmentOffset;
			
			tempVecC.trns(parentB.velocity().angle() + 180, segmentOffset / 2.5);
			
			var angle = Angles.angle(this.x, this.y, parentB.x + tempVecC.x, parentB.y + tempVecC.y);
			var vel = this.velocity();
			
			if(!Angles.near(angle, parentB.rotation, 20)) angle = Mathf.slerp(angle, parentB.rotation, Mathf.clamp((Angles.angleDist(angle, parentB.rotation) - 20) / 40) * 0.3 * Mathf.clamp(Time.delta(), 0, 1));
			
			/*if(!Angles.within(this.rotation, parentB.rotation, 5)){
				angle = Mathf.slerp(angle, parentB.rotation, 0.1);
				//var nextB = Angles.angleDist(this.rotation, parentB.rotation);
				//print(this.id + ": " + nextB);
			};*/
			if(!Mathf.within(this.x, this.y, parentB.x, parentB.y, segmentOffset * 5)) this.set(parentB.x, parentB.y);
			
			if(!Mathf.within(this.x, this.y, parentB.x, parentB.y, segmentOffset)){
				tempVec.trns(angle, dst);
				
				//tempVecB.trns(angle, parentB.velocity().len());
				tempVecB.trns(angle, Math.max(parentB.velocity().len(), this.velocity().len()));
				
				vel.add(tempVecB.x * Time.delta(), tempVecB.y * Time.delta());
				if(Mathf.within(this.x + vel.x, this.y + vel.y, parentB.x, parentB.y, segmentOffset)){
					this.moveBy(-tempVec.x / 1.1, -tempVec.y / 1.1);
				};
				this.moveBy(tempVec.x / 1.01, tempVec.y / 1.01);
			};
			dst = Mathf.dst(this.x, this.y, parentB.x, parentB.y) - segmentOffset;
			if(dst < 0){
				angle = Angles.angle(this.x, this.y, parentB.x, parentB.y);
				tempVec.trns(angle, dst);
				//vel.add(tempVec.x, tempVec.y);
				this.moveBy(tempVec.x / 4, tempVec.y / 4);
			};
		},
		
		/*updatePositionAlt(){
			var parentB = this.getParentUnit();
			
			tempVecB.trns(parentB.velocity().angle() - 180, segmentOffset / 2);
			tempVecB.add(parentB.x, parentB.y);
			
			tempVec.trns(this.rotation, segmentOffset / 2);
			tempVec.add(this.x, this.y);
			
			var dst1 = Mathf.dst(tempVec.x, tempVec.y, tempVecB.x, tempVecB.y) / Time.delta();
			var angle1 = Angles.angle(tempVec.x, tempVec.y, tempVecB.x, tempVecB.y);
			
			tempVec.trns(parentB.velocity().angle() - 180, segmentOffset / 2);
			tempVec.add(parentB.x, parentB.y);
			
			var angle2 = Angles.angle(this.x, this.y, tempVec.x, tempVec.y);
			
			//var angle3 = Angles.angle(this.x, this.y, parentB.x, parentB.y);
			
			this.velocity().trns(angle2, parentB.velocity().len());
			
			if(dst1 > 0.002){
				
				if(Angles.near(angle1, this.velocity().angle(), 12)){
					///*8888888]
					 <this.velocity().trns(angle1, parentB.velocity().len() + dst1);
				};
				
				//tempVec.trns(angle1, dst1);
				//tempVec.trns(parentB.velocity().len() - 180, segmentOffset / 2);
				//tempVec.add(parentB.x, parentB.y);
				//tempVecB.trns(this.rotation - 180, segmentOffset / 2);
				//tempVec.add(tempVecB);
				//this.set(tempVec.x, tempVec.y);
				//this.moveBy(tempVec.x, tempVec.y);
			};
			tempVec.setZero();
			tempVecB.setZero();
		},*/
		
		updateRotation(){
			if(this.getParentUnit() == null) return;
			tempVec.trns(this.getParentUnit().rotation - 180, (segmentOffset / 4));
			tempVec.add(this.getParentUnit().x, this.getParentUnit().y);
			//tempVec.set(this.getParentUnit().x, this.getParentUnit().y);
			this.rotation = Angles.angle(this.x, this.y, tempVec.x, tempVec.y);
			tempVec.setZero();
		},
		
		/*added(){
			this.super$added();
			
			this.repairItself();
		},*/
	});
	//scourgeSegmentB.repaired = false;
	//scourgeSegmentB.parentID = -1;
	wormSegmentB.setWeapon(null);
	wormSegmentB.setDrawerUnit(false);
	wormSegmentB.setParentUnit(null);
	wormSegmentB.setTrueParentUnit(null);
	wormSegmentB.setChildUnit(null);
	return wormSegmentB;
});

const wormMain = prov(() => {
	wormMainB = extend(FlyingUnit, {
		update(){
			this.super$update();
			
			//if(this.getCollidedBool()) this.setCollidedBool(false);
			if(this.getExplosionCounter() != 0) this.setExplosionCounter(0);
			
			if(this.getChildUnit() != null) this.getChildUnit().updateCustom();
			//print(this.health() + "/" + this.maxHealth());
			if(this.getTimer().get(5, 5)){
				var bulletsCounted = 0;
				var scanRange = 220;
				Vars.bulletGroup.intersect(this.x - scanRange, this.y - scanRange, scanRange * 2, scanRange * 2, cons(b => {
					if(Mathf.within(this.x, this.y, b.x, b.y, scanRange) && b.getTeam() != this.getTeam()){
						bulletsCounted += 1;
					}
				}));
				
				//trueBulletMultiplier = Math.max(bulletsCounted, 1);
				this.setBulletMultiplier(Math.max(bulletsCounted, 1));
				//print(this.getBulletMultiplier());
			};
		},
		
		added(){
			this.super$added();
			
			//if(!this.loaded) this.trueHealth = this.getType().health * totalSegments;
			//unitTypeArray = [scourgeUnitSegment, scourgeUnitSegment, scourgeUnitMissile, scourgeUnitDestroyer];
			this.setLastHealth(this.health());
			
			weaponArray = [wormSegWeap, wormSegWeap, wormSegSwarmer, wormSegDestroyer];  // weapons
			
			if(/*!this.loaded*/ true){
				this.trueHealth = this.getType().health * totalSegments;
				var parent = this;
				//var weaponArray = [scourgeSegWeap, scourgeSegWeap, scourgeSegSwarmer,scourgeSegDestroyer];
				for(var i = 0; i < totalSegments; i++){
					type = i < totalSegments - 1 ? wormUnitSegment : wormUnitTail;
					//type = i < totalSegments - 1 ? (i % 2) == 0 ? scourgeUnitMissile : scourgeUnitSegment : scourgeUnitTail;
					//type = i < totalSegments - 1 ? unitTypeArray[i % unitTypeArray.length] : scourgeUnitTail;
					
					base = type.create(this.getTeam());
					base.setParentUnit(parent);
					base.setTrueParentUnit(this);
					base.setDrawerUnit(type == scourgeUnitTail);
					base.setWeapon(weaponArray[i % weaponArray.length]);
					base.add();
					//base.set(this.x + Mathf.random(12), this.y + Mathf.random(12));
					//print(this.rotation);
					tempVec.trns(this.rotation + 180, (segmentOffset * i));
					base.set(this.x + tempVec.y, this.y + tempVec.y);
					base.rotation = this.rotation;
					parent.setChildUnit(base);
					parent = base;
				}
			};
		},
		
		getBulletMultiplier(){
			return this._bulletMultiplier;
		},
		
		setBulletMultiplier(a){
			this._bulletMultiplier = a;
		},
		
		getHitTime(){
			return this.hitTime;
		},
		
		getOrigin(){
			return this;
		},
		
		/*getCollidedBool(){
			return this._collidedBool;
		},
		
		setCollidedBool(a){
			this._collidedBool = a;
		},*/
		
		setLastHealth(a){
			this._lastHealth = a;
		},
		
		getLastHealth(){
			return this._lastHealth;
		},
		
		getExplosionCounter(){
			return this._expCounter;
		},
		
		setExplosionCounter(a){
			this._expCounter = a;
		},
		
		collision(other, x, y){
			//this.setCollidedBool(false);
			this.setLastHealth(this.health());
			
			//print(this.health);
			
			this.setExplosionCounter(0);
			
			this.super$collision(other, x, y);
			
			//print(this.health);
			
			if(other instanceof DamageTrait && other instanceof Bullet){
				if(other.getBulletType().pierce) other.scaleTime(other.getBulletType().damage / 10);
				
				if(other.getOwner() instanceof Lightning && other.getData() > 0){
					//print(other.getData());
					this.healBy((other.getData() / 20) * Math.max(this.getBulletMultiplier() / 32, 1));
				};
				
				bulletCollision(this, other, this.getBulletMultiplier());
			};
			
			//print(this.health);
			//this.super$collision(other, x, y);
			
			//print(this.health);
		},
		
		calculateDamage(amount){
			/*if(this.getCollidedBool()){
				print("test");
				return 1;
			};*/
			//print(this.getExplosionCounter());
			
			//this.setCollidedBool(true);
			
			var trueAmount = amount;
			//if(amount >= 3000) trueAmount = Math.max(6000 - amount, Math.log(amount) * 2);
			if(amount >= 3000) trueAmount = 3000 + (Math.log(amount - 2999) * 20);
			
			var counter = Mathf.clamp(1 - (this.getExplosionCounter() / (totalSegments / 5)));
			
			//print(this.getExplosionCounter());
			
			this.setExplosionCounter(this.getExplosionCounter() + 1);
			
			//print((trueAmount / (totalSegments / 2)) * Mathf.clamp(1 - this.status.getArmorMultiplier() / 100) * counter);
			//return (trueAmount / (totalSegments / 2)) * Mathf.clamp(1 - this.status.getArmorMultiplier() / 100);
			return (trueAmount / (totalSegments / 2)) * Mathf.clamp(1 - this.status.getArmorMultiplier() / 100) * counter;
		},
		
		/*health(){
			var healthTotal = 0;
			var child = this;
			for(var i = 0; i < totalSegments; i++){
				//if(child == null) break;
				healthTotal += child.health;
				child = child.getChildUnit();
				if(child == null) break;
			};
			
			return healthTotal;
			//print(this.health() + "/" + this.maxHealth());
		},
		
		maxHealth(){
			var healthTotal = 0;
			var child = this;
			for(var i = 0; i < totalSegments; i++){
				//if(child == null) break;
				healthTotal += this.getType().health;
				//child = child.getChildUnit();
				//if(child == null) break;
			};
			
			return healthTotal * Vars.state.rules.unitHealthMultiplier;
		},*/
		
		drawCustom(){
			this.drawAll();
		},
		
		drawUnder(){
		},
		
		/*maxHealth(){
			return this.getType().health * totalSegments * Vars.state.rules.unitHealthMultiplier;
		},*/
		
		getParentUnit(){
			return null;
		},
		
		setChildUnit(a){
			this._childUnit = a;
		},
		
		getChildUnit(){
			if(this._childUnit != null && this._childUnit instanceof Number){
				if(this._childUnit == -1){
					this._childUnit = null;
					return null;
				};
				
				this.setChildUnit(Vars.unitGroup.getByID(this._childUnit));
			};
			
			return this._childUnit;
		}
	});
	//scourgeMainB.trueHealth = 0;
	wormMainB.setLastHealth(0);
	wormMainB.setExplosionCounter(0);
	//scourgeMainB.setCollidedBool(false);
	wormMainB.timer = new Interval(6);
	wormMainB.setChildUnit(null);
	wormMainB.setBulletMultiplier(1);
	return wormMainB;
})

const wormSegWeap = extendContent(Weapon, "worm-segment-equip", {
	load(){
		this.region = Core.atlas.find("underground-adventure-worm-segment-equip");
	}
});

wormSegWeap.reload = 10;
wormSegWeap.alternate = true;
wormSegWeap.length = 6;
wormSegWeap.width = 13;
wormSegWeap.ignoreRotation = true;
wormmSegWeap.bullet = segmentBullet;
wormSegWeap.shootSound = Sounds.shootSnap;

const wormSegDestroyer = extendContent(Weapon, "worm-segment-destroyer", {
	load(){
		this.region = Core.atlas.find("underground-adventure-worm-segment-destroyer");
	}
});

wormSegDestroyer.reload = 30;
wormSegDestroyer.alternate = true;
wormSegDestroyer.length = 8;
wormSegDestroyer.width = 19;
wormSegDestroyer.spacing = 0;
wormSegDestroyer.shots = 6;
wormSegDestroyer.recoil = 5.5;
//wormSegDestroyer.recoil = 12.5;
wormSegDestroyer.inaccuracy = 4;
wormSegDestroyer.shotDelay = 3;
wormSegDestroyer.ignoreRotation = true;
wormSegDestroyer.bullet = wormBullet;
wormSegDestroyer.shootSound = Sounds.artillery;

const wormSegSwarmer = extendContent(Weapon, "worm-segment-swarmer", {
	load(){
		this.region = Core.atlas.find("underground-adventure-worm-segment-swarmer");
	}
});

wormSegSwarmer.reload = 20;
wormSegSwarmer.alternate = true;
wormSegSwarmer.spacing = 8;
wormSegSwarmer.shots = 6;
wormSegSwarmer.length = 8;
wormSegSwarmer.width = 19;
wormSegSwarmer.ignoreRotation = true;
wormSegSwarmer.bullet = wormMissile;
wormSegSwarmer.shootSound = Sounds.missile;

const wormHeadWeap = extendContent(Weapon, "worm-head-equip", {});

wormHeadWeap.reload = 30;
wormHeadWeap.alternate = true;
wormHeadWeap.spacing = 3;
wormHeadWeap.shots = 30;
wormHeadWeap.length = 16;
woormHeadWeap.width = 0;
wormHeadWeap.ignoreRotation = false;
wormHeadWeap.bullet = scourgeBullet;
wormHeadWeap.shootSound = Sounds.artillery;

const loadImmunities = unitType => {
	var statuses = Vars.content.getBy(ContentType.status);
	statuses.each(cons(stat => {
		if(stat != null){
			unitType.immunities.add(stat);
		}
	}));
};

const wormUnitTail = extendContent(UnitType, "mass-destroyer-worm-tail", {
	init(){
		this.super$init();
		
		loadImmunities(this);
	},
	
	isHidden(){
		return true;
	}
});

wormUnitTail.localizedName = "Mass Micro Worm Tail";
wormUnitTail.create(wormSegment);
wormUnitTail.weapon = wormSegWeap;
wormUnitTail.engineSize = 0;
wormUnitTail.engineOffset = 0;
wormUnitTail.flying = true;
wormUnitTail.rotateWeapon = true;
wormUnitTail.shootCone = 360;
wormUnitTail.health = 32767;
wormUnitTail.mass = 11;
wormUnitTail.hitsize = segmentOffset / 1.5;
wormUnitTail.speed = 0;
wormUnitTail.drag = 0.075;
wormUnitTail.attackLength = 130;
wormUnitTail.range = 150;
wormUnitTail.maxVelocity = 1.05;

const wormUnitSegment = extendContent(UnitType, "mass-destroyer-worm-segment", {
	init(){
		this.super$init();
		
		loadImmunities(this);
	},
	
	load(){
		this.super$load();
		
		weaponArray = [wormSegSwarmer, wormSegDestroyer];
		
		for(var s = 0; s < weaponArray.length; s++){
			weaponArray[s].load();
		}
	},
	
	isHidden(){
		return true;
	}
});

wormUnitSegment.localizedName = "Mass Micro Worm Segment";
wormUnitSegment.create(wormSegment);
wormUnitSegment.weapon = wormSegWeap;
wormUnitSegment.engineSize = 0;
wormUnitSegment.engineOffset = 0;
wormUnitSegment.flying = true;
wormUnitSegment.rotateWeapon = true;
wormUnitSegment.shootCone = 360;
wormUnitSegment.health = 4500;
wormUnitSegment.mass = 11;
wormUnitSegment.hitsize = segmentOffset / 1.5;
wormUnitSegment.speed = 0;
wormUnitSegment.drag = 0.075;
wormUnitSegment.attackLength = 30;
wormUnitSegment.range = 150;
wormUnitSegment.maxVelocity = 1.05;

const wormUnit = extendContent(UnitType, "mass-destroyer-worm", {
	init(){
		this.super$init();
		
		loadImmunities(this);
	},
	
	displayInfo(table){
		table.table(cons(title => {
			title.addImage(this.icon(Cicon.xlarge)).size(8 * 6);
			title.add("[accent]" + this.localizedName).padLeft(5);
		}));
		
		table.row();
		
		table.addImage().height(3).color(Color.lightGray).pad(15).padLeft(0).padRight(0).fillX();
		
		table.row();
		
		if(this.description != null){
			table.add(this.displayDescription()).padLeft(5).padRight(5).width(400).wrap().fillX();
			table.row();

			table.addImage().height(3).color(Color.lightGray).pad(15).padLeft(0).padRight(0).fillX();
			table.row();
		};
		
		table.left().defaults().fillX();

		table.add(Core.bundle.format("unit.health", this.health));
		table.row();
		table.add(Core.bundle.format("unit.speed", Strings.fixed(this.speed, 1)));
		table.row();
		var resistance = (1 - (1 / (totalSegments / 2))) * 100;
		table.add("Damage Resistance: " + resistance.toFixed(1) + "%").color(Color.lightGray);
		table.row();
		table.row();
	}
});

wormUnit.localizedName = "Mass Micro Worm";
wormUnit.create(wormMain);
wormUnit.description = "A micro version of mass destroyer, very easy to defeat, and llow damage... just cool";
wormUnit.weapon = wormHeadWeap;
wormUnit.engineSize = 0;
wormUnit.engineOffset = 0;
wormUnit.flying = true;
wormUnit.health = 4000;
wormUnit.mass = 11;
wormUnit.hitsize = segmentOffset / 1.5;
wormUnit.speed = 0.07;
wormUnit.drag = 0.09;
wormUnit.attackLength = 60;
wormUnit.range = 180;
wormUnit.maxVelocity = 1.05;
wormUnit.shootCone = 180;
wormUnit.rotatespeed = 1;
wormUnit.baseRotateSpeed = 0.5;

/*const tempFac = extendContent(UnitFactory, "temp-factory", {});
tempFac.unitType = wormUnit;*/
