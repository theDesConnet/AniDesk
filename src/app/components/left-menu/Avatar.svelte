<script>
    export let onClickCallback;
    export let avatar;
</script>

<button class="left-menu-profile" onclick='{onClickCallback}'>
    <img width="50" height="50" src={avatar} alt="avatar">
</button>

<style>
    .left-menu-profile img{
        border-radius: 100%;
    }

    .left-menu-profile {
        margin-bottom: 10px;
    }
</style>