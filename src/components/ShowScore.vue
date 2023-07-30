<template>
    <span v-if="resultList.length !== 0">
        <br /><el-text class="mx-1" size="large">共提取出{{ resultList.length - 1 }}门课程数据</el-text>
    </span>
    <div class="card-container">
        <span v-for="(course, index) in resultList" :key="index">
            <span v-if="index !== 0">
                <score-detail-card :score-list="course" />
            </span>
        </span>
    </div>
    <div class="mistake-btn" v-if="resultList.length > 0">
        <span v-if="!showOriginData">
            <el-button type="text" @click.prevent="this.switchShowOriginData()" style="padding-right: 40px">数据有误？点击查看原始数据</el-button>
        </span>
        <span v-else>
            <el-link :underline="false" type="primary" @click.prevent="this.switchShowOriginData()" style="padding-right: 40px">点击关闭</el-link>
        </span>
    </div>
    <div v-if="showOriginData">
        <el-input type="textarea" :readonly="true" :autosize="{ minRows: 10 }" v-model="normalString"></el-input>
    </div>
</template>

<script>
import {defineComponent} from "vue";
import ScoreDetailCard from "@/components/ScoreDetailCard.vue";

export default defineComponent({
    components: {ScoreDetailCard},
    props: {
        resultList: Array,
        normalString: String,
    },
    data() {
        return {
            showTip: false,
            showOriginData: false,
        }
    },
    methods: {
        /**
         * 切换原始数据的显示
         *
         * @return Boolean
         * @author ChiyukiRuon
         * */
        switchShowOriginData() {
            this.showOriginData = !this.showOriginData
            return !this.showOriginData
        },
    },
})
</script>

<style scoped>
.card-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
}
</style>