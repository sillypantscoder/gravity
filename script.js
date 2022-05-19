class Position {
	constructor(x, y) {
		this.x = Number(x)
		this.y = Number(y)
	}
}
class Planet {
	constructor(x, y, r, mass, brightness) {
		this.pos = new Position(Number(x), Number(y))
		this.radius = Number(r)
		this.mass = Number(mass)
		this.color = Number(brightness)
		this.elm = document.createElement("div")
		this.elm.classList.add("planet")
		this.elm.setAttribute("style", `--top: ${this.pos.y}px; --left: ${this.pos.x}px; --radius: ${this.radius}px; background-color: rgb(${this.color*255}, ${this.color*255}, ${this.color*255});`)
		document.body.appendChild(this.elm)
		this.velocity = new Position(0, 0)
		planets.push(this)
		if (max_height < this.pos.y + this.radius + 100) {
			max_height = this.pos.y + this.radius + 100
		}
	}
	update() {
		this.elm.setAttribute("style", `--top: ${this.pos.y}px; --left: ${this.pos.x}px; --radius: ${this.radius}px; background-color: rgb(${this.color*255}, ${this.color*255}, ${this.color*255});`)
	}
	gravity(player) {
		var thingy1 = player
		var thingy2 = this
		var dx = thingy2.pos.x - thingy1.pos.x
		var dy = thingy2.pos.y - thingy1.pos.y
		var distance = Math.sqrt((dx * dx) + (dy * dy))
		var direction = new Position(dx / distance, dy / distance)
		var force_strength = 1 * ((thingy1.mass * thingy2.mass) / (distance * distance))
		thingy1.velocity.x += force_strength * direction.x / thingy1.mass
		thingy1.velocity.y += force_strength * direction.y / thingy1.mass
	}
	checkCollision() {
		var thingy1 = player
		var thingy2 = this
		var dx = thingy2.pos.x - thingy1.pos.x
		var dy = thingy2.pos.y - thingy1.pos.y
		var distance = Math.sqrt((dx * dx) + (dy * dy))
		if (distance < thingy2.radius + thingy1.radius) {
			var direction = new Position(dx / distance, dy / distance)
			thingy1.velocity = new Position(-direction.x + thingy1.velocity.x - (0.1 * direction.y), -direction.y + thingy1.velocity.y - (0.1 * direction.x))
		}
	}
}
class Player extends Planet {
	constructor(x, y) {
		super(x, y, 10, 10, 0.7)
	}
	tick() {
		if (this.velocity.x >  500) this.velocity.x = 0
		if (this.velocity.x < -500) this.velocity.x = 0
		if (this.velocity.y >  500) this.velocity.y = 0
		if (this.velocity.y < -500) this.velocity.y = 0
		if (this.pos.x < 0) this.velocity.x = 1
		if (this.pos.x > 1275) this.velocity.x = -1
		if (this.pos.y < 0) this.velocity.y = 1
		if (this.pos.y > max_height) this.velocity.y = -1
		this.pos.x += this.velocity.x
		this.pos.y += this.velocity.y
		this.update()
		document.body.setAttribute("style", `--top: ${this.pos.y}px;`)
	}
}
class Bullet extends Player {
	constructor() {
		super(player.pos.x+1, player.pos.y+1)
		this.radius = 5
		this.mass = 1
		var dx = this.pos.x - MOUSE_X
		var dy = this.pos.y - (MOUSE_Y + player.pos.y)
		var distance = Math.sqrt((dx * dx) + (dy * dy))
		var direction = new Position(dx / distance, dy / distance)
		this.velocity = direction
		this.update()
	}
}
var MOUSE_X = 0
var MOUSE_Y = 0
var doGravity = true
var max_height = 0
var planets = []
new Planet(408, 396,  250, 3000, 0)
new Planet(889, 525,  100, 1000, 0)
new Planet(731, 895,  140, 100,  0)
new Planet(334, 1120, 10,  9000, 0)
new Planet(750, 1250, 100, 100,  0)
new Planet(775, 1675, 300, 100,  0)
new Planet(600, 2150, 100, 400,  0)
new Planet(450, 2170, 100, 200,  0)
new Planet(200, 2190, 100, 300,  0)
var player = new Player(103, 243)
//player.velocity.y = 1
function tick() {
	if (doGravity) {
		for (var i = 0; i < planets.length; i++) {
			if (planets[i] == player) continue;
			planets[i].gravity(player)
			planets[i].checkCollision(player)
		}
	}
	if (buttons.up) player.velocity.y -= 0.1
	if (buttons.down) player.velocity.y += 0.1
	if (buttons.left) player.velocity.x -= 0.1
	if (buttons.right) player.velocity.x += 0.1
	player.tick()
}
window.addEventListener("mousemove", (e) => {
	if (e.buttons == 1) {
		console.log(e.pageX, e.pageY)
		player.pos = new Position(e.clientX, e.clientY)
		player.update()
	}
	MOUSE_X = e.clientX
	MOUSE_Y = e.clientY
})
var buttons = {
	up: false,
	down: false,
	left: false,
	right: false
}
window.addEventListener("keydown", (e) => {
	switch (e.key) {
		case "ArrowUp":
			buttons.up = true
			e.preventDefault()
			break;
		case "ArrowDown":
			buttons.down = true
			e.preventDefault()
			break;
		case "ArrowLeft":
			buttons.left = true
			e.preventDefault()
			break;
		case "ArrowRight":
			buttons.right = true
			e.preventDefault()
			break;
		case "z":
			new Bullet()
			break;
	}
})
window.addEventListener("keyup", (e) => {
	switch (e.key) {
		case "ArrowUp":
			buttons.up = false
			break;
		case "ArrowDown":
			buttons.down = false
			break;
		case "ArrowLeft":
			buttons.left = false
			break;
		case "ArrowRight":
			buttons.right = false
			break;
	}
})
setInterval(tick, 40)