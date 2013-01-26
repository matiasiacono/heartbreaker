function Composite() {
	var self = this;
	var components = [];
	this.visible = true;
	
	this.add = function(obj) {
		components.push(obj);
	}
	
	this.get = function(i) {
		return components[i];
	}
	
	this.update = function(delta) {				
		for (var index in components) {
			components[index].update(delta);
		}
	}
	
	this.draw = function(context) {
		for (var index in components) {
			components[index].draw(context);
		}
	}
}