<template>
    <div class="ha-formcard">
        <slot name="title">
            <div class="ha-formcard-title">{{title}}</div>
        </slot>
        <div class="ha-formcard-content" :style="bodyStyle">
            <slot></slot>
        </div>
    </div>

</template>

<script>
export default {
    name: 'haCard',
    props: ['title', 'bodyStyle']
};
</script>
