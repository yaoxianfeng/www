<template>

    <div class="ha-rate_groups">
        <div v-for="item in rate_data" class="ha-rate_groups_box">
            <div class="ha-rate_group-item">
                <div class="ha-rate_group-item_lable">{{item.name}}</div>
                <el-rate
                        v-model="item.value"
                        disabled="disabled"
                        disabled-void-icon-class ="el-icon-star-off"
                        text-template="{value}">
                </el-rate>
            </div>
        </div>
    </div>


</template>

<script>
    export default {
        name: 'ha-rate-group',
        props: {
            rate_data: Array,
            disabled: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {

            };
        },

        computed: {

        },

        methods: {

        },

        mounted() {

        }
    };
</script>
