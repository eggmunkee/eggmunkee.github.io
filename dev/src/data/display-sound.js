export default {
    methods: {
        _middleCoalateIndex(index, length) {
            const dir = index % 2 == 0;
            const resIndex = Math.floor(
                Math.floor((length - 1) / 2.0) // middle index
                + (dir ? 1.0 : -1.0) * Math.floor(index / 2.0)
            );
            return resIndex;
        }, 
        middleCoalateIndex(index, length) {
            const halfIdx = Math.floor(length / 2.0);
            const dir = index >= halfIdx; // maps to even res index
            const halfDiff = Math.abs(index - halfIdx); // index of just even/odd set 0,1,2 (0,2,4), |-1|,|-2|,|-3| (1,3,5)
            const resIndex = Math.max(0, Math.min(length - 1, Math.floor(
                dir ? (halfDiff * 2) 
                    : (1 + (halfDiff - 1) * 2)
            )));
            return resIndex;
        },
        /* -- DECLARATIVE WORKUP
            <div style="position: relative; height: 1em; z-index: -1;">
                <div v-if="audioFreqData" style="" class="audio-freq-data-cont">
                    <div v-for="(i) in (audioFreqData.length-1)" :key="i" style="" class="audio-freq-data-slice">
                        <div :style="{height: (0.0, audioFreqData[middleCoalateIndex(i,audioFreqData.length)] + 100.0)+'%'}" style="" class="audio-freq-bar-freq" />
                        
                        <div v-if="i < audioTimeData.length" :style="{height: ((((1.0 - Math.abs((Math.floor(audioTimeData.length/2.0) - i)/Math.floor(audioTimeData.length/2.0))) * 0.5)+audioTimeData[i]) * 100.0) + '%'}" style="" class="audio-freq-bar-time" />  <!-- 'calc(' + (Math.max(0.0, (0.5+audioTimeData[i]) * 100.0))+'% - 2em)' -->
                    </div>
                </div>
            </div>
            -- precalc and store in data - audioFreqDataDisplay [] and audioTimeDataDisplay []
        */
       buildAudioFreqTimeDisplay() {
            if (!this.audioFreqData || !this.audioTimeData) {
                this.audioFreqDataDisplay = [];
                this.audioTimeDataDisplay = [];
                return;
            }

            // const commonLen = Math.min(this.audioFreqData.length, this.audioTimeData.length);
            // for (let i=0; i < commonLen; i++) {

            // }

       }
    }
}