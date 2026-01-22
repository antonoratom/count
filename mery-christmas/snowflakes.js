console.log('test js ');

function result (obj, prop) {
    if (typeof obj[prop] === 'function') {
      return obj[prop]();
    } else {
      return obj[prop];
    }
  }
  
  class Vector {
    constructor() {
      let x = 0;
      let y = 0;
      if (arguments[0] instanceof Vector) {
        x = arguments[0].x;
        y = arguments[0].y;
      } else {
        x = arguments[0];
        y = arguments[1];
      }
      this.x = x || 0;
      this.y = y || 0;
    }
    
    add(vector) {
      this.x += vector.x;
      this.y += vector.y;
    }
    
    distanceTo(vector, abs) {
      var distance = Math.sqrt(Math.pow(this.x - vector.x, 2) + Math.pow(this.y - vector.y, 2));
      return (abs || false) ? Math.abs(distance) : distance;
    }
  }
  
  class Particle {
    constructor(options) {
      this.options = Object.assign({
        seed: 0
      }, options);
      
      this.position = new Vector(this.options.x, this.options.y);
      this.vector = new Vector(
        (Math.random() * this.options.speed * 2) - this.options.speed / 2,
        1 + Math.random() * this.options.speed 
      );
      this.rotation = this.options.rotation || 0;
  
      // Size
      this.options.size = this.options.size || 7;
      this.size = 1 + Math.random() * this.options.size;
      this.targetSize = this.options.targetSize || this.options.size;
  
      this.orbit = this.options.radius * 0.5 + (this.options.radius * 0.5 * Math.random());
    }
    
    update(mousePosition) {
      let timeIndex = Date.now() / 1000 + this.options.seed;
  
      let vector = new Vector(this.vector);
      
      // Add wiggle
      vector.x += (Math.sin(timeIndex) / 2); 
      
      this.position.add(vector); 
    }
  }
  
  class Animator {
    constructor(options) {
      this.options = Object.assign({
          emit: 1,
          maxParticles: 500,
          speed: 1,
          width: 400,
          height: 400,
          size: 7,
          ghostTrails: false
      }, options);
      this.el = this.options.el;
      this.ctx = this.el.getContext('2d');
      this.dpr = window.devicePixelRatio || 1;
      this.updateDimensions = this.updateDimensions.bind(this);
      this.updateMouse = this.updateMouse.bind(this);
      this.mouseLeave = this.mouseLeave.bind(this);
      this.loop = this.loop.bind(this);
      
      window.addEventListener('resize', this.updateDimensions);
      window.addEventListener('mousemove', this.updateMouse);
      window.addEventListener('mouseleave', this.mouseLeave);
      
    //   var gui = new dat.GUI();
  
    //   gui.add(this.options, 'speed', 1, 10);
    //   gui.add(this.options, 'emit', 1, 5);
    //   gui.add(this.options, 'maxParticles', 1, 1000);
    //   gui.add(this.options, 'size', 2, 8);
    //   gui.add(this.options, 'ghostTrails');
      
      this.updateDimensions();
      this.start();
    }
    
    updateMouse(event) {
      this.mouse = new Vector(event.clientX * this.dpr, event.clientY * this.dpr);
    }
    
    mouseLeave() {
      this.mouse = void 0;
    }
    
    start() {
        this.particles = [];
        this.running = true;
      
        // initial fill: create a full set of particles across the whole area
        for (let i = 0; i < this.options.maxParticles; i++) {
          this.addParticle(true);     // true => random Y
        }
      
        this.loop();
      }
    
    loop() {
      if (!this.running) {
        return;
      }
      
      if (!this._lastEmit || Date.now() - this._lastEmit > 30){
        if (this.particles.length < this.options.maxParticles) {
          for (let i = 0; i < this.options.emit; i++) {
            this.addParticle();
          }
        }
        this._lastEmit = Date.now();
      }
  
      this.update();
      this.clear();
      this.render();
      window.requestAnimationFrame(this.loop);
    }
    
    addParticle(initial = false) {
        let x = Math.random() * this.width * 1.1;
        let y;
      
        if (initial) {
          // anywhere inside current height
          y = Math.random() * this.height;
        } else {
          // from the top, like now
          y = this.options.size * -2;
        }
      
        var particle = new Particle({
          ...this.options,
          x: x,
          y: y,
          rotation: Math.random() * 360,
          seed: Math.random() * 10
        });
      
        this.particles.push(particle);
      }
      
    
    clear() {
      if(!this.options.ghostTrails) {
        this.ctx.clearRect(0, 0 , this.width, this.height);
      } else {
        this.ctx.globalCompositeOperation = 'multiply';
        this.ctx.rect(0, 0 , this.width, this.height);
        this.ctx.fillStyle = "rgba(33, 33, 33)";
        this.ctx.fill();
      }
    }
    
    unmount() {
      window.removeEventListener('resize', this.updateDimensions);
      this.el.removeEventListener('mousemove', this.updateMouse);
      this.el.removeEventListener('mouseleave', this.mouseLeave);
      this.running = false;
    }
    
    updateDimensions() {
      this.width = this.el.width = result(this.options, 'width') * this.dpr;
      this.height = this.el.height = result(this.options, 'height') * this.dpr;
      this.el.style.width = result(this.options, 'width') + 'px';
      this.el.style.height = result(this.options, 'height') + 'px';
    }
    
    update() {
      var index = -1;
      var length = this.particles.length;
      while (++index < length) {
        var point = this.particles[index];
        if (!point) {
          continue;
        }
        point.update(this.mouse);
  
        if (point.position.y > (this.height + this.options.size)) {
          this.particles.splice(index, 1);
        }
      } 
    }
    
    render() {
      let index = -1;
      let length = this.particles.length;
      this.ctx.globalCompositeOperation = 'lighten';
      while (++index < length) {
        let point = this.particles[index];
        let opacity = point.size / this.options.size;
        this.ctx.fillStyle = `rgba(200, 200, 200, ${opacity * 0.3})`;
        this.ctx.beginPath();
        this.ctx.arc(point.position.x, point.position.y, point.size, Math.PI * 2, 0, false);
        this.ctx.closePath();
        this.ctx.fill();
        
        this.ctx.beginPath();
        this.ctx.arc(point.position.x, point.position.y, point.size * 0.6, Math.PI * 2, 0, false);
        this.ctx.closePath();
        this.ctx.fill();
      }  
    }
  }
  
  new Animator({
    el: document.getElementById('canvas'),
    width: function () {
        // 'this' here is the options object; it has this.el
        return this.el.parentElement.clientWidth;
    },
    height: function () {
        return this.el.parentElement.clientHeight;
    }
});
  

//PARTICLES START
window.requestAnimFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
        window.setTimeout(callback, 1000 / 60);
};

var canvas = document.getElementById('particles');
var ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var settings = {

    'basic': {

       'emission_rate': 1.5,
        'min_life': 6,
        'life_range': 2,
        'min_angle': 0,
        'angle_range': 360,
        'min_speed': 15,
        'speed_range': 15,
        'min_size': 1,
        'size_range': 20,
        'colour': '#FFD700',
        'fade_duration': 0.8 
    }
};

var ParticleGlow = function(x, y, angle, speed, life, size) {

    /* the particleGlow's position */

    this.pos = {

        x: x || 0,
        y: y || 0
    };

    /* set specified or default values */

    this.speed = speed || 5;

    this.life = life || 1;

    this.size = size || 2;

    this.lived = 0;

    /* the particleGlow's velocity */

    var radians = angle * Math.PI / 180;

    this.vel = {

        x: Math.cos(radians) * speed,
        y: -Math.sin(radians) * speed
    };
};

var Emitter = function(x, y, settings) {

    /* the emitter's position */

    this.pos = {

        x: x,
        y: y
    };

    /* set specified values */

    this.settings = settings;

    /* How often the emitter needs to create a particleGlow in milliseconds */

    this.emission_delay = 1000 / settings.emission_rate;

    /* we'll get to these later */

    this.last_update = 0;

    this.last_emission = 0;

    /* the emitter's particleGlow objects */

    this.particles = [];
};

Emitter.prototype.initialize = function() {
    // Calculate how many particles should exist based on emission rate and lifetime
    var maxLife = this.settings.min_life + this.settings.life_range;
    var initialParticleCount = Math.floor(this.settings.emission_rate * maxLife);
    
    for (var i = 0; i < initialParticleCount; i++) {
        var life = this.settings.min_life + Math.random() * this.settings.life_range;
        var particle = new ParticleGlow(
            Math.random() * canvas.width - canvas.width / 2,
            Math.random() * canvas.height - canvas.height / 2,
            this.settings.min_angle + Math.random() * this.settings.angle_range,
            this.settings.min_speed + Math.random() * this.settings.speed_range,
            life,
            this.settings.min_size + Math.random() * this.settings.size_range
        );
        
        // Set random lived time so particles are at different stages of life
        // Skip the fade-in period for initial particles
        particle.lived = this.settings.fade_duration + Math.random() * (life - this.settings.fade_duration * 2);
        
        this.particles.push(particle);
    }
};

Emitter.prototype.update = function() {

    /* set the last_update variable to now if it's the first update */

    if (!this.last_update) {

        this.last_update = Date.now();

        return;
    }

    /* get the current time */

    var time = Date.now();

    /* work out the milliseconds since the last update */

    var dt = time - this.last_update;

    /* add them to the milliseconds since the last particleGlow emission */

    this.last_emission += dt;

    /* set last_update to now */

    this.last_update = time;

    /* check if we need to emit a new particleGlow */

    if (this.last_emission > this.emission_delay) {

        /* find out how many particles we need to emit */

        var i = Math.floor(this.last_emission / this.emission_delay);

        /* subtract the appropriate amount of milliseconds from last_emission */

        this.last_emission -= i * this.emission_delay;

        while (i--) {

            /* calculate the particleGlow's properties based on the emitter's settings */

            this.particles.push(
                new ParticleGlow(
                    Math.random() * canvas.width - canvas.width / 2,
                    Math.random() * canvas.height - canvas.height / 2,
                    this.settings.min_angle + Math.random() * this.settings.angle_range,
                    this.settings.min_speed + Math.random() * this.settings.speed_range,
                    this.settings.min_life + Math.random() * this.settings.life_range,
                    this.settings.min_size + Math.random() * this.settings.size_range
                )
            );
        }
    }

    /* convert dt to seconds */

    dt /= 1000;

    /* loop through the existing particles */

    var i = this.particles.length;

    while (i--) {

        var particleGlow = this.particles[i];

        /* skip if the particleGlow is dead */

        if (particleGlow.dead) {
            
            /* remove the particleGlow from the array */
            this.particles.splice(i, 1);
            
            continue;   
        }

        /* add the seconds passed to the particleGlow's life */

        particleGlow.lived += dt;

        /* check if the particleGlow should be dead */

        if (particleGlow.lived >= particleGlow.life) {

            particleGlow.dead = true;

            continue;
        }

        /* calculate the particleGlow's new position based on the seconds passed */

        particleGlow.pos.x += particleGlow.vel.x * dt;
        particleGlow.pos.y += particleGlow.vel.y * dt;

        /* ⭐ Calculate absolute position on canvas */
        var x = this.pos.x + particleGlow.pos.x;
        var y = this.pos.y + particleGlow.pos.y;

        /* ⭐ Bounce off borders - check collision with canvas edges */
        
        // Left border
        if (x - particleGlow.size < 0) {
            particleGlow.vel.x = Math.abs(particleGlow.vel.x); // Move right
            particleGlow.pos.x = -this.pos.x + particleGlow.size; // Keep inside
        }
        
        // Right border
        if (x + particleGlow.size > canvas.width) {
            particleGlow.vel.x = -Math.abs(particleGlow.vel.x); // Move left
            particleGlow.pos.x = canvas.width - this.pos.x - particleGlow.size; // Keep inside
        }
        
        // Top border
        if (y - particleGlow.size < 0) {
            particleGlow.vel.y = Math.abs(particleGlow.vel.y); // Move down
            particleGlow.pos.y = -this.pos.y + particleGlow.size; // Keep inside
        }
        
        // Bottom border
        if (y + particleGlow.size > canvas.height) {
            particleGlow.vel.y = -Math.abs(particleGlow.vel.y); // Move up
            particleGlow.pos.y = canvas.height - this.pos.y - particleGlow.size; // Keep inside
        }

        /* Recalculate position after bounce adjustments */
        x = this.pos.x + particleGlow.pos.x;
        y = this.pos.y + particleGlow.pos.y;

        /* Calculate opacity based on fade in/out */
        var opacity = 1;
        var fadeDuration = this.settings.fade_duration;
        
        // Fade in at the beginning
        if (particleGlow.lived < fadeDuration) {
            opacity = particleGlow.lived / fadeDuration;
        }
        // Fade out at the end
        else if (particleGlow.lived > particleGlow.life - fadeDuration) {
            opacity = (particleGlow.life - particleGlow.lived) / fadeDuration;
        }
        
        // Ensure opacity is between 0 and 1
        opacity = Math.max(0, Math.min(1, opacity));

        /* draw the particleGlow with glow effect */

        // Apply glow effect
        ctx.shadowBlur = 30;
        ctx.shadowColor = this.settings.colour;
        
        // Apply opacity
        ctx.globalAlpha = opacity;
        
        ctx.fillStyle = this.settings.colour;
        ctx.beginPath();
        ctx.arc(x, y, particleGlow.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Reset shadow and alpha for next frame
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
    }
};

var emitter = new Emitter(canvas.width / 2, canvas.height / 2, settings.basic);

emitter.initialize();

function loop() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    emitter.update();

    requestAnimFrame(loop);
}

loop();
