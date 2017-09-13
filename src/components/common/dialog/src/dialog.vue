<template>

    <!--<transition name="ha-dialog-fade">-->
        <div class="ha-dialogPop" :class="[dialogClass]">
            <div v-if="modal" class="ha-dialog__wrapper" @click='close()'></div>
            <div class="ha-dialog"  :style="dialogStyle">
                <div class="ha-dialog__header">
                    <slot name="title">
                        <span class="ha-dialog__title">{{title}}</span>
                    </slot>
                    <div class="ha-dialog__headerbtn"><i v-if="showClose" class="ha-dialog__close el-icon el-icon-close" @click='close()'></i></div>
                </div>
                <div class="ha-dialog__body" v-if="rendered"><slot></slot></div>
                <div class="ha-dialog__footer" v-if="$slots.footer"><slot name="footer"></slot></div>
            </div>
        </div>
    <!--</transition>-->
</template>

<script>

export default {
    name: 'Ha-Dialog',
    props: {
        title: {
            type: String,
            default: ''
        },

        showClose: {
            type: Boolean,
            default: true
        },
        rendered: {
            type: Boolean,
            default: true
        },
        modal: {
            type: Boolean,
            default: true
        },
        size: {
            type: String,
            default: 'small'
        },
        dialogClass : {
            type: String,
            default: ''
        },
        customClass: {
            type: String,
            default: ''
        },
        dialogStyle:{}
    },
    data() {
        return {

        };
    },

    computed: {
        sizeClass() {
            return 'ha-dialog--'+this.size;
        }
    },

    methods: {
        close() {
            this.$emit('close');
        }
    },

    mounted() {
//        this.$nextTick(() => {
//            this.$refs.dialog.scrollTop = 0;
//        });
    }
};
</script>
