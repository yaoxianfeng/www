<template>
    <div class="ha-search">
        <i class="ha-search_icon el-icon-search" v-if="icon" @click="handleIconClick">
        </i>
        <input class="ha-input" :placeholder="placeholder"
               :readonly="readonly" :maxlength="maxlength"
               :minlength="minlength" v-model="currentValue"
               ref="input" :name="name" @keyup.13="handleKeyEnterup"
               @change="handleChange"
               @focus="handleFocus"
               @blur="handleBlur"
               @keyup="handleKeyup" >
    </div>
</template>
<script>
export default {
    props: {
        value: [String, Number],
        placeholder: String,
        readonly: Boolean,
        icon: Boolean,
        name: String,
        maxlength: Number,
        minlength: Number
    },
    data() {
        return {
        }
    },
    components: {

    },
    methods: {
        handleChange(event) {
            const value = event.target.value;
            this.$emit('change', value);
        },
        handleFocus(event) {
            this.$emit('', event);
        },
        handleBlur(event) {
            this.$emit('blur', event);
        },
        handleIconClick(event) {
            this.$emit('icon-click', event);
        },
        handleKeyEnterup(event) {
            this.$emit('keyupEnter', event);
        },
        handleKeyup(event) {
            this.$emit('keyup', event);
        }
    },
    computed: {
        currentValue: {
            get: function() {
                return this.value;

            },
            set: function(val) {
                this.$emit("input", val)
            }
        }
    },
    created() {

    },
    mounted() {

    }
}
</script>
<style lang="">
.ha-search {
    width: 100%;
    height: 100%;
    position: relative;
}

.ha-input {
    width: 100%;
    height: 36px;
    box-sizing: border-box;
    padding-right: 30px;
    padding-left: 10px;
    background: rgba(39, 94, 139, 0.3);
    color: #1f2d3d;
    display: inline-block;
    background-image: none;
    outline: none;
    border: 1px solid #275e8b;
}

.ha-search_icon {
    display: block;
    position: absolute;
    transform: translate(0, -50%);
    right: 10px;
    top: 50%;
    color: #2a6e9d;
}
</style>
