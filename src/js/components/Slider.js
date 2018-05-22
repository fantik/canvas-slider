import { TweenMax } from 'gsap'
import { $window, Resp } from "../modules/dev/_helpers";
export default class Slider {
    
    constructor($class) {
        
        // create and append canvas into container
        this.$container = document.querySelector($class);
        this.canvas = {};
        this.canvas.elem = document.createElement('canvas');
        if ( Resp.isRetina ) {
            this.canvas.width = this.$container.offsetWidth;
            this.canvas.height = this.$container.offsetHeight;
            this.canvas.elem.width = this.canvas.width*2;
            this.canvas.elem.height = this.canvas.height*2;
            this.canvas.elem.style.width = `${this.$container.offsetWidth}px`;
            this.canvas.elem.style.height = `${this.$container.offsetHeight}px`;
            this.$container.appendChild(this.canvas.elem);
            this.ctx = this.canvas.elem.getContext('2d');
            this.ctx.scale(2,2);
        } else {
            this.canvas.width = this.$container.offsetWidth;
            this.canvas.height = this.$container.offsetHeight;
            this.canvas.elem.width = this.canvas.width;
            this.canvas.elem.height = this.canvas.height;
            this.$container.appendChild(this.canvas.elem);
            this.ctx = this.canvas.elem.getContext('2d');
        }
        
        
        // get all img in slider
        this.images = this.$container.getAttribute('data-images').split(',');
        // set first and next slides to show
        this.sliderCounter = 1;
        this.imageSrcCurrentSlide = this.images[0];
        this.imageSrcNextSlide = this.images[1];
        
        // params
        this.navDots = [];
        // y = a*x
        this.angle = ( -(this.canvas.height ) / (this.canvas.width) );
        this.autoplayStop = false;
        this.startShapePosition = {
            X: -50,
            Y: -50
        }
        this.currentSlideNumber = '1'
        // blur
        this.filterBlur = {
            value: 20
        }
        
        this.offsetMove = {
            value: this.canvas.height/2
        };
        
        this.xoff = {
            value: 0
        };
        this.xoffStart = {
            value: 0
        };
        
        this.globalAlpha = {
            value: 1
        };
        
        this.tl = new TimelineMax({paused:true});
        this.tlDots = new TimelineMax();
        this.tl2 = new TimelineMax();
        
        this.lines = [
            {
                moveX: 0.3,
                moveY: 0,
                x: 0,
                y: 0.3,
                inertia: 0.7
            },
            {
                moveX: 0.53,
                moveY: 0,
                x: 0,
                y: 0.53,
                inertia: 0.9
            },
            {
                moveX: 0.76,
                moveY: 0,
                x: 0,
                y: 0.76,
                inertia: 0.1
            },
            {
                moveX: 1,
                moveY: 0.23,
                x: 0.23,
                y: 1,
                inertia: 0.6
            },
            {
                moveX: 1,
                moveY: 0.46,
                x: 0.46,
                y: 1,
                inertia: 0.8
            },
            {
                moveX: 1,
                moveY: 0.7,
                x: 0.7,
                y: 1,
                inertia: 0.76
            },
            {
                moveX: 1,
                moveY: 0,
                x: 0,
                y: 1,
                inertia: 2.5
            }
        ],
        this.shapes = [
            {
                moveX: 0,
                moveY: 0,
                x1: 0.3,
                y1: 0,
                x2: 0,
                y2: 0.3,
                x3: 0,
                y3: 0,
                inertia: -this.getRandom(5, 15)
            },
            {
                moveX: 0.3,
                moveY: 0,
                x1: 0.53,
                y1: 0,
                x2: 0,
                y2: 0.53,
                x3: 0,
                y3: 0.3,
                inertia: this.getRandom(7, 9)
            },
            {
                moveX: 0.53,
                moveY: 0,
                x1: 0.76,
                y1: 0,
                x2: 0,
                y2: 0.76,
                x3: 0,
                y3: 0.53,
                inertia: -this.getRandom(2, 6)
            },
            {
                moveX: 0.76,
                moveY: 0,
                x1: 1,
                y1: 0,
                x2: 0,
                y2: 1,
                x3: 0,
                y3: 0.76,
                inertia: this.getRandom(2, 4)
            },
            {
                moveX: 1,
                moveY: 0,
                x1: 1,
                y1: 0.23,
                x2: 0.23,
                y2: 1,
                x3: 0,
                y3: 1,
                inertia: -this.getRandom(3, 7)
            },
            {
                moveX: 1,
                moveY: 0.23,
                x1: 1,
                y1: 0.46,
                x2: 0.46,
                y2: 1,
                x3: 0.23,
                y3: 1,
                inertia: this.getRandom(2, 3)
            },
            {
                moveX: 1,
                moveY: 0.46,
                x1: 1,
                y1: 0.7,
                x2: 0.7,
                y2: 1,
                x3: 0.46,
                y3: 1,
                inertia: -this.getRandom(2, 7)
            },
            {
                moveX: 1,
                moveY: 0.7,
                x1: 1,
                y1: 1,
                x2: 1,
                y2: 1,
                x3: 0.7,
                y3: 1,
                inertia: this.getRandom(5, 15)
            },
        ],
        this.onResize();
        this.init();
    }
    
    init() {
        this.render();
        this.drawSlideNumber();
        this.createDots();
    }
    
    getRandom(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    
    drawLines() {
        let _that = this;
        for ( let i = 0; i< _that.lines.length; i++) {
            _that.ctx.beginPath();
            _that.ctx.moveTo(this.canvas.width*_that.lines[i].moveX ,this.canvas.height*_that.lines[i].moveY);
            _that.ctx.lineTo(this.canvas.width*_that.lines[i].x ,this.canvas.height*_that.lines[i].y);
            _that.ctx.lineWidth = 1;
            _that.ctx.strokeStyle = 'rgba(120,120,120,0.5)';
            _that.ctx.fillStyle = 'rgba(120,120,120,0.5)';
            _that.ctx.stroke();
        }
        this.drawLinesDots();
        this.drawNumberLine();
    }
    
    drawLinesDots() {
        let _that = this;
        // _that.ctx.globalAlpha = 1;
        for ( let i = 0; i< _that.lines.length; i++) {
            _that.ctx.beginPath();
            _that.ctx.moveTo(this.canvas.width*_that.lines[i].moveX - this.offsetMove.value*_that.lines[i].inertia,this.canvas.height*_that.lines[i].moveY - this.offsetMove.value*this.angle*_that.lines[i].inertia);
            _that.ctx.lineTo(this.canvas.width*_that.lines[i].moveX - this.offsetMove.value*_that.lines[i].inertia - 15,this.canvas.height*_that.lines[i].moveY - this.offsetMove.value*this.angle*_that.lines[i].inertia - 15*this.angle);
            _that.ctx.lineWidth = 4;
            _that.ctx.strokeStyle = 'rgba(56,177,56,0.8)';
            _that.ctx.fillStyle = 'rgba(56,177,56,0.8)';
            _that.ctx.stroke();
        }
    }
    
    drawNumberLine() {
        let _that = this;
        _that.ctx.beginPath();
        _that.ctx.moveTo(0 + _that.canvas.width*0.046875, _that.canvas.height + _that.canvas.width*0.046875*this.angle);
        _that.ctx.lineTo(  _that.canvas.width*0.09875 - 15,this.canvas.height + _that.canvas.width*0.09875*this.angle - 15*this.angle);
        _that.ctx.lineWidth = 1;
        _that.ctx.strokeStyle = 'rgba(255,255,255,0.7)';
        _that.ctx.fillStyle = 'rgba(255,255,255,0.7)';
        _that.ctx.stroke();
    }
    
    cutShape = () => {
        
        let _that = this;
        this.nextSlide = new Image();
        this.nextSlide.src = this.imageSrcNextSlide;
        
        this.currentSlide = new Image();
        this.currentSlide.src = this.imageSrcCurrentSlide;
        
        let a = _that.angle;
        
        _that.currentSlide.onload = function(){
    
            
            // back image
            _that.ctx.clearRect(0, 0, _that.canvas.width, _that.canvas.height);
            _that.ctx.save();
            _that.drawImageProp(_that.ctx, _that.nextSlide, -150, -150, _that.canvas.width +200,_that.canvas.height+200, 0, 0 );
            _that.ctx.restore();
        // for ( let i = 0; i< _that.shapes.length; i++) {
        //     _that.ctx.save();
        //     _that.ctx.globalAlpha = _that.globalAlpha.value;
        //     // _that.ctx.filter = 'brightness(0.5)';
        //     _that.ctx.beginPath();
        //     _that.ctx.moveTo(_that.canvas.width*_that.shapes[i].moveX, _that.canvas.height*_that.shapes[i].moveY);
        //     _that.ctx.lineTo(_that.canvas.width*_that.shapes[i].x1, _that.canvas.height*_that.shapes[i].y1);
        //     _that.ctx.lineTo(_that.canvas.width*_that.shapes[i].x2, _that.canvas.height*_that.shapes[i].y2);
        //     _that.ctx.lineTo(_that.canvas.width*_that.shapes[i].x3, _that.canvas.height*_that.shapes[i].y3);
        //     _that.ctx.closePath();
        //     _that.ctx.clip();
        //     _that.drawImageProp(_that.ctx, _that.nextSlide, _that.xoff.value*_that.shapes[i].inertia -150, a*_that.xoff.value*_that.shapes[i].inertia -150, _that.canvas.width +150,_that.canvas.height +150, 0, 0 )
        //     _that.ctx.restore();
        // }
            
        for ( let i = 0; i< _that.shapes.length; i++) {
            _that.ctx.save();
            _that.ctx.globalAlpha = _that.globalAlpha.value;
            // _that.ctx.filter = 'brightness(0.5)';
            _that.ctx.beginPath();
            _that.ctx.moveTo(_that.canvas.width*_that.shapes[i].moveX, _that.canvas.height*_that.shapes[i].moveY);
            _that.ctx.lineTo(_that.canvas.width*_that.shapes[i].x1, _that.canvas.height*_that.shapes[i].y1);
            _that.ctx.lineTo(_that.canvas.width*_that.shapes[i].x2, _that.canvas.height*_that.shapes[i].y2);
            _that.ctx.lineTo(_that.canvas.width*_that.shapes[i].x3, _that.canvas.height*_that.shapes[i].y3);
            _that.ctx.closePath();
            _that.ctx.clip();
            _that.drawImageProp(_that.ctx, _that.currentSlide, _that.xoff.value*_that.shapes[i].inertia -150, a*_that.xoff.value*_that.shapes[i].inertia -150, _that.canvas.width +200,_that.canvas.height +200, 0, 0 )
            _that.ctx.restore();
        }
            // add overlay
            _that.ctx.save();
            _that.ctx.globalAlpha = '0.5';
            _that.ctx.rect(0,0,_that.canvas.width, _that.canvas.height)
            _that.ctx.fillStyle = '#000';
            _that.ctx.fill();
            _that.ctx.restore();
            _that.drawLines();
            _that.drawSlideNumber();
        }
    
        
        
    }
    
    // cover img in canvas (for responsive)
    drawImageProp(ctx, img, x, y, w, h, offsetX, offsetY) {
        
        if (arguments.length === 2) {
            x = y = 0;
            w = ctx.canvas.width;
            h = ctx.canvas.height;
        }
        
        // default offset is center
        offsetX = typeof offsetX === "number" ? offsetX : 0.5;
        offsetY = typeof offsetY === "number" ? offsetY : 0.5;
        
        // keep bounds [0.0, 1.0]
        if (offsetX < 0) offsetX = 0;
        if (offsetY < 0) offsetY = 0;
        if (offsetX > 1) offsetX = 1;
        if (offsetY > 1) offsetY = 1;
        
        var iw = img.width,
            ih = img.height,
            r = Math.min(w / iw, h / ih),
            nw = iw * r,   // new prop. width
            nh = ih * r,   // new prop. height
            cx, cy, cw, ch, ar = 1;
        
        // decide which gap to fill
        if (nw < w) ar = w / nw;
        if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh;  // updated
        nw *= ar;
        nh *= ar;
        
        // calc source rectangle
        cw = iw / (nw / w);
        ch = ih / (nh / h);
        
        cx = (iw - cw) * offsetX;
        cy = (ih - ch) * offsetY;
        
        // make sure source rectangle is valid
        if (cx < 0) cx = 0;
        if (cy < 0) cy = 0;
        if (cw > iw) cw = iw;
        if (ch > ih) ch = ih;
        
        // fill image in dest. rectangle
        ctx.drawImage(img, cx, cy, cw, ch,  x, y, w, h);
    }
    
    render() {
        let _that = this;
        const OVER_VALUE = 1.5;
        requestAnimationFrame(this.cutShape);
        // reset tween
        // this.tl.time(0.6);
        // _that.drawSlideNumber();
        this.tl
            .to(this.xoff, 3, {
                value: _that.canvas.width * OVER_VALUE,
                ease: Power4.easeIn,
                onUpdate: this.cutShape,
                onComplete: changeImageTrigger
            })
            .to(this.filterBlur, 2, {
                value: 0 ,
                ease: Power4.easeInOut,
                onUpdate: this.cutShape
            }, '-=3 ')
            .to(this.globalAlpha, 1.5, {
                value: 0 ,
                ease: Power4.easeIn,
                onUpdate: this.cutShape
            }, '-=3 ');
        _that.sliderCounter++;
        _that.drawSlideNumber();
        // console.log(_that.navDots.indexOf(_that.$dotsLi));
        // let changeImageTrigger = setTimeout( function() {
        //     _that.changeImg();
        // }, 8000);
        function changeImageTrigger() {
            // if ( _that.sliderCounter - 1 < _that.images.length - 1 ) {
            //     _that.imageSrcNextSlide = _that.images[_that.sliderCounter];
            //     _that.imageSrcCurrentSlide = _that.images[_that.sliderCounter - 1];
            // } else {
            //     _that.imageSrcNextSlide = _that.images[0];
            //     _that.imageSrcCurrentSlide = _that.images[_that.sliderCounter - 1];
            //     _that.sliderCounter = 0;
            // }
            // _that.xoff.value = 20;
            // _that.tl2.time(0);
            // _that.tl2
            //     .to(_that.xoff, 3, {
            //         value: 20,
            //         ease: Power4.easeIn,
            //         onUpdate: _that.cutShape
            //     })
            
            setTimeout( () => {
                _that.changeImg();
            }, 100)
            
        };
        
        
            // document.body.onkeyup = function(e){
            //
            //     if(e.keyCode == 67){
            //         _that.autoplayStop === false;
            //         _that.tl.play();
            //         _that.tl.time(0);
            //     }
            // }
        window.addEventListener('scroll', function() {
            let yPos = window.pageYOffset;
            if ( yPos < _that.canvas.height) {
                _that.tlDots
                    .to(_that.offsetMove, 0.2,{
                        value: _that.canvas.height/2 + yPos*0.8,
                        overwrite: true,
                        onUpdate: _that.cutShape
                    })
            }
        })
        _that.autoplayStop === false;
        _that.tl.play();
    }
    
    
    changeImg = () => {
        let _that = this;
        if ( _that.autoplayStop === true ) return;
        // autoplay
        
        if ( _that.sliderCounter - 1 < _that.images.length - 1 ) {
            _that.imageSrcNextSlide = _that.images[_that.sliderCounter];
            _that.imageSrcCurrentSlide = _that.images[_that.sliderCounter - 1];
        } else {

            _that.imageSrcNextSlide = _that.images[0];
            _that.imageSrcCurrentSlide = _that.images[_that.sliderCounter - 1];
            _that.sliderCounter = 0;
        }
        // this.tl.time(0.6);
        // TimelineMax.log
        TweenMax.fromTo(_that.tl,0.5,{time:0},{time:0.6})
        this.tl.pause();
        setTimeout( () => {
            _that.render();
        }, 4000)
        // this.render();
        
    }
    
    drawSlideNumber() {
        let _that = this;
        if ( _that.navDots.length ) {
            for (let i = 0; i < _that.navDots.length;i++) {
                _that.navDots[i].classList.remove('active');
                _that.navDots[_that.sliderCounter - 1].classList.add('active')
            }
        }
        
        if ( _that.sliderCounter === 0 ) {
            _that.ctx.fillStyle = 'rgba(56,177,56,0.8)';
            _that.ctx.font = "26px RobotoLight";
            _that.ctx.fillText(`0${_that.images.length}`,_that.canvas.width*0.046875,_that.canvas.height*0.90);
        } else {
            _that.ctx.fillStyle = 'rgba(56,177,56,0.8)';
            _that.ctx.font = "26px RobotoLight";
            _that.ctx.fillText(`0${_that.sliderCounter}`,_that.canvas.width*0.046875,_that.canvas.height*0.90);
        }
        
    }
    createDots() {
        let _that = this;
        _that.$dotsContainer = document.createElement('ul');
        _that.$dotsContainer.classList.add('navContainer');
        for (let i = 0; i < _that.images.length;i++) {
            _that.$dotsLi = document.createElement('li');
            _that.$dotsLink = document.createElement('a');
            _that.$dotsLink.setAttribute('href','#');
            _that.$dotsLink.classList.add('navLink');
            _that.$dotsLi.classList.add('navItem');
            _that.$dotsLi.appendChild(_that.$dotsLink);
            _that.navDots.push(_that.$dotsLi);
            _that.$container.appendChild(_that.$dotsContainer);
            _that.$dotsContainer.classList.add('navContainer');
            _that.$dotsContainer.appendChild(_that.$dotsLi)
        }
    }
    onResize() {
        let _that = this;
        // change canvas size and reinit()
        if ( window.innerWidth < 1020 ) return
        window.addEventListener('resize', () => {
            this.canvas.width = this.$container.offsetWidth;
            this.canvas.height = this.$container.offsetHeight;
            this.canvas.elem.width = this.canvas.width;
            this.canvas.elem.height = this.canvas.height;
            _that.init();
        });
    }
}