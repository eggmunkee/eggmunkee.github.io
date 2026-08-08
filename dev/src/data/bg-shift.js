export default {
    methods: {
        loadBodyRefs(clearDisplay) {
            this.bodyRefs.appDiv = document.getElementById('app');
            this.bodyRefs.overlay1 = document.getElementsByClassName('overlay-z1')[0];
            this.bodyRefs.overlay2 = document.getElementsByClassName('overlay-z2')[0];
            this.bodyRefs.overlay3 = document.getElementsByClassName('overlay-z3')[0];
            if (clearDisplay) {
                this.bodyRefs.overlay1.style.display = '';
                this.bodyRefs.overlay2.style.display = '';
                this.bodyRefs.overlay3.style.display = '';
            }
        },
        /* Stochast methods */
        removeBgClasses(elem) {
            let cl = elem.classList;
            for (let c = 0; c < cl.length; c++) {
                let className = cl[c];
                if (className.startsWith('bg-') || className.startsWith('overlay-z3-') || className == 'high' || className == 'xtra') {
                    cl.remove(className);
                    c--;
                }
            }
            elem.style.backgroundImage = '';
        },
        setupBgClassesSlowFade(elem, idx, setFaded) {
            this.removeBgClasses(elem);
            elem.classList.add('bg-base');
            // if index is valid, set background image
            if (idx >= 0 && idx < this.bgImages.length)
                elem.style.backgroundImage = `url(${this.bgImages[idx]})`;
            else
                elem.style.backgroundImage = '';
            if (setFaded)
                elem.classList.add('bg-transp');
        },
        removeBgSlowFade() {
            // const overlay2 = document.getElementsByClassName('overlay-z2')[0];
            let o2cl = this.bodyRefs.overlay2.classList;
            if (o2cl.contains('bg-transp')) {
                o2cl.remove('bg-transp');
                o2cl.add('bg-fast-transition');
            }
        },
        incrementBgAnimSlowFade(reverse, forceTransition) {
            // get two overlay layers
            // const overlay1 = document.getElementsByClassName('overlay-z1')[0];
            // const overlay2 = document.getElementsByClassName('overlay-z2')[0];
            
            this.incrBgIndex(reverse || false);

            this.bgAnimEnFr = !this.bgAnimEnFr;

            if (forceTransition) {
                this.bgLayerToggle = 1;
                // this.removeBgClasses(this.bodyRefs.overlay1);
                // this.removeBgClasses(this.bodyRefs.overlay2);
            }

            // go from fading to changing images
            if (this.bgLayerToggle == 2) {
                this.bgLayerToggle = 1;
                // Set Fade out class anim on 2nd level Overlay
                this.bodyRefs.overlay2.classList.add('bg-transp');
                // clear and rebuild bg styles
                this.setupBgClassesSlowFade(this.bodyRefs.overlay1, this.currentBgIndex);
            }
            // step into fading
            else {
                this.bgLayerToggle = 2;
                // clear and rebuild bg styles - clears transparant anim class also
                this.setupBgClassesSlowFade(this.bodyRefs.overlay2, this.currentBgIndex);
            }
            
            if (forceTransition) {
                this.removeBgSlowFade();
            }
        },
        /* Stash methods */
        // Exects: animTimer and anim method
        startMultiAnimTimer() {
            let vm = this;
            if (this.animTimer != -1) {
                clearInterval(this.animTimer);
                this.animTimer = -1;
            }
            this.animTimer = setInterval(function() {
                if (!vm.animPaused)
                    vm.anim();
            }, 3750);   // 3750);
            this.$nextTick(function() {
                if (!this.animPaused)
                    this.anim();
            });
        },
        stopMultiAnimTimer() {
            if (this.animTimer != -1) {
                clearInterval(this.animTimer);
                this.animTimer = -1;
            }
        },
        // expects: start/stopMultiAnimTimer and bgStat
        setupBgClassesMulti(elem, faded) {
            elem.classList.add('bg-base-stash')
            if (faded) 
                elem.classList.add('bg-transp-stash')
        },
        removeBgClassesMulti(elem) {
            this.removeBgClasses(elem);
            elem.classList.remove('bg-base-stash')
            elem.classList.remove('bg-transp-stash')
        },
        showBgMulti() {
            this.startMultiAnimTimer();

            let o1 = document.getElementsByClassName('overlay-z1')[0];
            let o2 = document.getElementsByClassName('overlay-z2')[0];
            let o3 = document.getElementsByClassName('overlay-z3')[0];
            o1.style.display = '';
            o2.style.display = '';
            o3.style.display = '';
            o1.classList.remove('bg-base-stash-0')
            this.setupBgClassesMulti(o1, true);
            //o1.classList.add('bg-transp-stash')
            this.setupBgClassesMulti(o2, true);
            // o2.classList.add('bg-base-stash')
            // o2.classList.add('bg-transp-stash')
            this.setupBgClassesMulti(o3, true);
            // o3.classList.add('bg-base-stash')
            // o3.classList.add('bg-transp-stash')
            this.bgStat = true;
            if (this.uiStat !== undefined)
                this.uiStat = false;
        },
        hideBgMulti() {
            this.stopMultiAnimTimer();

            let o1 = document.getElementsByClassName('overlay-z1')[0];
            let o2 = document.getElementsByClassName('overlay-z2')[0];
            let o3 = document.getElementsByClassName('overlay-z3')[0];
            //o1.style.display = 'none';
            o2.style.display = 'none';
            o3.style.display = 'none';
            this.removeBgClassesMulti(o1);
            // o1.classList.remove('bg-base-stash')
            // o1.classList.remove('bg-transp-stash')
            // o1.classList.remove('high')
            // o1.classList.remove('extra')
            this.removeBgClassesMulti(o2);
            // o2.classList.remove('bg-base-stash')
            // o2.classList.remove('bg-transp-stash')
            // o2.classList.remove('high')
            // o2.classList.remove('extra')
            this.removeBgClassesMulti(o3);
            // o3.classList.remove('bg-base-stash')
            // o3.classList.remove('bg-transp-stash')
            // o3.classList.remove('high')
            // o3.classList.remove('extra')

            // Set default image on layer 1
            o1.classList.add('bg-base-stash-0')
            o1.style.backgroundImage = 'url(' + this.baseBgImg + ')';

            this.bgStat = false;
            if (this.uiStat !== undefined)
                this.uiStat = true;
        },
        incrementBgAnimMulti(src) {
            let overlay = null;
            let o1 = document.getElementsByClassName('overlay-z1')[0];
            let o2 = document.getElementsByClassName('overlay-z2')[0];
            let o3 = document.getElementsByClassName('overlay-z3')[0];
            
            // bg overlay to set - null of none this frame
            var i = this.srcIdx;
            if (i == 0)
                overlay = o1;
            else if (i == 2)
                overlay = o2;
            else if (i == 4)
                overlay = o3;

            if (i == 0) {
                
                o1.classList.remove('bg-transp-stash');
                
                o3.classList.add('xtra');

                
                
            }
            else if (i == 1) {
                o2.classList.add('bg-transp-stash');
                o2.classList.remove('high');
                              
                o3.classList.remove('xtra');
                o3.classList.add('high');
                
                
            }
            else if (i == 2) {
                
                o2.classList.remove('bg-transp-stash');
                
                
                o1.classList.add('xtra');
                
                
            }
            else if (i == 3) {
                o3.classList.add('bg-transp-stash');
                o3.classList.remove('high');

                
                o1.classList.add('high');
                o1.classList.remove('xtra');
                
            }
            else if (i == 4) {
                o3.classList.remove('bg-transp-stash');
                
                o2.classList.add('xtra');
                
                
            }
            else if (i == 5) {
                
                o1.classList.add('bg-transp-stash');
                o1.classList.remove('high');

                
                o2.classList.add('high');
                o2.classList.remove('xtra');
                
                
            }
            
            if (overlay) {
                overlay.style.backgroundImage = 'url(' + src + ')';
            }
        },
        loadImgsCapped(cap, imgAssets) {
            if (cap < 0) return;
            //let cap = 50;            
            let tempList = [];
            let target = cap > 0 ? tempList : this.imgUrls;
            for (const path in imgAssets) {
                target.push(path);
            }
            if (cap > 0 && target.length > 0) {
                for (let j=0; j < cap; j++) {
                    let imgIdx = Math.floor(Math.random() * target.length);
                    this.imgUrls.push(tempList[imgIdx]);
                    console.log(tempList[imgIdx]);
                }
            }
        },
        // Expects imgUrls array to store
        loadImgs() {
            let imgAssets = import.meta.glob('../../../docs/assets/art/extra/*.{png,jpg,jpeg}');
            this.loadImgsCapped(0, imgAssets);

            let imgAssets2 = import.meta.glob('../../../docs/assets/art/extra2/*.{png,jpg,jpeg}');
            this.loadImgsCapped(-1, imgAssets2);

            let imgAssets3 = import.meta.glob('../../../docs/assets/art/extra3/*.{png,jpg,jpeg}');
            this.loadImgsCapped(-1, imgAssets3);
        },
    }
}