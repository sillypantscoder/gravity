class Position {
	constructor(x, y) {
		this.x = Number(x)
		this.y = Number(y)
	}
}
/**
 * A planet on the screen
 */
class Planet {
	/**
	 * Creates a new planet on the screen.
	 * @param {Number} x The x position of the planet
	 * @param {Number} y The y position of the planet
	 * @param {Number} r The radius of the planet
	 * @param {Number} mass The mass of the planet
	 * @param {Number} brightness The brightness of the planet
	 */
	constructor(x, y, r, mass, brightness) {
		// Stats
		this.pos = new Position(Number(x), Number(y))
		this.radius = Number(r)
		this.mass = Number(mass)
		this.color = Number(brightness)
		this.velocity = new Position(0, 0)
		// Element
		this.elm = document.createElement("div")
		this.elm.classList.add("planet")
		this.elm.setAttribute("style", `--top: ${this.pos.y}px; --left: ${this.pos.x}px; --radius: ${this.radius}px; background-color: rgb(${this.color*255}, ${this.color*255}, ${this.color*255});`)
		document.body.appendChild(this.elm)
		// Add to scene
		planets.push(this)
		if (max_height < this.pos.y + this.radius + 100) {
			max_height = this.pos.y + this.radius + 100
		}
	}
	/**
	 * Updates the location of the planet on the screen
	 */
	update() {
		this.elm.setAttribute("style", `--top: ${this.pos.y}px; --left: ${this.pos.x}px; --radius: ${this.radius}px; background-color: rgb(${this.color*255}, ${this.color*255}, ${this.color*255});`)
	}
	/**
	 * Applies gravity to the player
	 * @param {Player} player The player to apply gravity to
	 */
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
	/**
	 * Checks for a collision with the player
	 */
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
	/**
	 * Updates the player on the screen
	 */
	tick() {
		if (this.velocity.x >  500) this.velocity.x = 0
		if (this.velocity.x < -500) this.velocity.x = 0
		if (this.velocity.y >  500) this.velocity.y = 0
		if (this.velocity.y < -500) this.velocity.y = 0
		if (this.pos.x < 0) {
			this.velocity.x = 1
			buttons.left = false
			buttons.right = true
		}
		if (this.pos.x > 1275) {
			this.velocity.x = -1
			buttons.left = true
			buttons.right = false
		}
		if (this.pos.y < 0) {
			this.velocity.y = 1
			buttons.up = false
			buttons.down = true
		}
		if (this.pos.y > max_height) {
			this.velocity.y = -1
			buttons.up = true
			buttons.down = false
		}
		this.pos.x += this.velocity.x
		this.pos.y += this.velocity.y
		this.update()
		//document.body.setAttribute("style", `--top: ${this.pos.y}px;`)
		window.scrollTo(0, this.pos.y - window.innerHeight / 2)
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
// I like Python.
const random = {
	random: () => Math.random(),
	randint: (a, b) => Math.floor(Math.random() * (b - a + 1)) + a,
	choice: (a) => a[Math.floor(Math.random() * a.length)]
}

var MOUSE_X = 0
var MOUSE_Y = 0
var doGravity = true
var max_height = 0
var planets = []
//          X    Y    RAD  MASS BRIGHT
//          |    |     |     |   |
new Planet(408, 396,  250, 3000, 0)
new Planet(889, 525,  100, 1000, 0)
new Planet(731, 895,  140, 100,  0)
new Planet(334, 1120, 10,  9000, 0)
new Planet(750, 1250, 100, 100,  0)
new Planet(775, 1675, 300, 100,  0)
new Planet(600, 2150, 100, 400,  0)
new Planet(450, 2170, 100, 200,  0) //       X POSITION                   Y POSITION                 RADIUS                     MASS         BRIGHTNESS
new Planet(200, 2190, 100, 300,  0) //   _____________________    ________________________    ____________________    _____________________   |
var xh = max_height + 10 //             /                     \  /                        \  /                    \  /                     \  v
for (var i = 0; i < 30; i++) new Planet(random.randint(0, 1275), random.randint(xh, xh * 2), random.randint(0, 250), random.randint(0, 1500), 0)
var player = new Player(103, 243)
/**
 * Moves one frame ahead in the game
 */
function tick() {
	if (doGravity) {
		for (var i = 0; i < planets.length; i++) {
			if (planets[i] == player) continue;
			planets[i].gravity(player)
			planets[i].checkCollision(player)
		}
	}
	if (buttons.up) player.velocity.y -= 0.15
	if (buttons.down) player.velocity.y += 0.15
	if (buttons.left) player.velocity.x -= 0.15
	if (buttons.right) player.velocity.x += 0.15
	player.tick()
}
window.addEventListener("mousemove", (e) => {
	if (e.buttons == 1) {
		player.pos = new Position(e.clientX, e.clientY)
		player.update()
	}
	MOUSE_X = e.clientX
	MOUSE_Y = e.clientY
})
var buttons = {
	up: false,
	down: true,
	left: false,
	right: true
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
