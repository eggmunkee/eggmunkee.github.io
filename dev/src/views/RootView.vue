<script setup>
</script>

<script>
export default {
    mounted() {
        try {
            const overlay1 = document.getElementsByClassName('overlay-z1')[0];
            const overlay2 = document.getElementsByClassName('overlay-z2')[0];
            const overlay3 = document.getElementsByClassName('overlay-z3')[0];
            this.removeBgClasses(overlay3);
            this.removeBgClasses(overlay2);
            this.removeBgClasses(overlay1);
            let cl = overlay1.classList;
            for (let c = 0; c < cl.length; c++) {
                let className = cl[c];
                if (className.startsWith('bg-')) {
                    cl.remove(className);
                    c--;
                }
            }
            cl.add('bg-root-aura');

            setTimeout(function() { 
                overlay3.classList.add('overlay-z3-25');
            }, 3000);
        }
        catch (e) {}
    },
    methods: {
        removeBgClasses(elem) {
            let cl = elem.classList;
            for (let c = 0; c < cl.length; c++) {
                let className = cl[c];
                if (className.startsWith('bg-')) {
                    cl.remove(className);
                    c--;
                }
            }
        },
    }
}
</script>

<template>
<div class="root-div">
    <h1 >
        <span class="big-heading">
            EGGMUNKEE <span class="major-slash">/</span>
        </span>
    </h1>

    <h2><span class="big-heading">Explore <RouterLink to="/">MUSIC</RouterLink> section</span></h2>
</div>
</template>

<style>
.bg-root-aura {
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-size: cover;
    background-position-x: center;
    background-position-y: bottom;
    background-attachment: fixed; 
    background-image: url('/assets/art/stochast/image-yQhU4.jpg');
}
</style>

<style scoped>
.under {
    text-decoration: underline;
}
.root-div {
    margin: 4em 0.5em;
    text-align: center;
    font-size: 12pt;
    font-family: 'Georgia' 'Comic Sans' 'Serif' serif;
    min-height: calc(min(50vh,400px));
}

h1, h2 {
    margin: 1em;
}


.root-div a {
  display: inline-block;
  padding: .25em;
  border-radius: 0.5em;
  font-weight: bolder;
  font-family:'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
  text-shadow: 0 0 0.25em rgb(40 20 10);
}

.major-slash {
  font-weight: bolder;
  font-size: 150%;
  line-height: 0.1;
  position: relative;
  top: 0.08em;
}

.big-heading {
    background: rgba(0,0,0,0.25);
    box-shadow: 0 0 1em .6em rgba(0,0,0,0.25);
    border-radius: 0.7em;
    padding: 0.25em;
}

</style>