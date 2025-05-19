<script>
    export let ageRate;
</script>

<div class="age-rate">{utils.getAgeRate(ageRate)}</div>

<style>
    .age-rate {
        margin-left: 10px;
        font-size: 12px;
        color: var(--background-color);
        background-color: var(--main-text-color);
        border-radius: 6px;
        padding-right: 5px;
        padding-left: 5px;
        padding-top: 2px;
        padding-bottom: 2px;
        font-weight: bold;
        align-items: center;
        max-height: 20px;
    }
</style>