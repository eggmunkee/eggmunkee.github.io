<script setup>
    import AMHighlight from './AMHighlight.vue';
</script>

<template>
    <div class="am-highlights">
        <AMHighlight title="Join The Movement">
            <p>
                We are a group of like-minded individuals who are tired of the
                direction our country is headed. We are taking action to make
                our voices heard and to make a difference in our communities.
            </p>
            <p class="ref-p">
                Site: <a href="https://www.americamission.com" target="_blank">American Mission</a>
            </p>
        </AMHighlight>

        <AMHighlight title="Organize On Twitter / X">
            <p>
                Regular wrap up and topic Twitter spaces are for information 
                sharing, calls to action, and networking for grassroots work.
            </p>
            <p class="ref-p">
                Site: <a href="https://twitter.com/americamission_" target="_blank">Twitter Account</a>
            </p>
        </AMHighlight>

        <AMHighlight title="Get Involved and Active Locally">
            <p>
                We are organizing locally to make a difference in our communities.
                We are working to get involved in local politics and to make a
                difference in our communities. Becoming a Precinct Committeeman or Chair
                is the first best option if a seat is available. Second best is Precinct
                Captain or Block Captain to assist your neighborhood information sharing
                and voter mobilization.
            </p>
            <p class="ref-p">
                Site: <a href="https://www.precinctstrategy.com" target="_blank">Precinct Strategy</a>
            </p>
        </AMHighlight>

        <hr/>

        <AMHighlight title="Under Development">
            Thanks for visiting. (December 2023)
        </AMHighlight>

    </div>
</template>

<style scoped>
    .ref-p {
        font-size: 0.8rem;
        text-align: right;
    }
</style>
