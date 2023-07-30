<template>
    <span v-if="resultList.length !== 0">
        <br />
        <el-text class="mx-1" size="large">共提取出{{ resultList.length - 1 }}门课程数据,</el-text>
        <el-text class="mx-1" size="large">通过{{ passNum(resultList) }}门</el-text>
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
            <el-link
                type="primary"
                :underline="false"
                @click.prevent="this.switchShowOriginData()"
                style="padding-right: 40px"
            >数据有误？点击查看原始数据</el-link>
        </span>
        <span v-else>
            <el-link
                type="primary"
                :underline="false"
                @click.prevent="this.switchShowOriginData()"
                style="padding-right: 40px"
            >点击关闭</el-link>
        </span>
    </div>
    <div v-if="showOriginData">
        <el-input type="textarea" :readonly="true" :autosize="{ minRows: 10 }" v-model="normalString"></el-input>
    </div>
</template>

<script>
import {defineComponent} from "vue";
import ScoreDetailCard from "@/components/ScoreDetailCard.vue";
import {passNum, base64ToString, siftString, splitCourse} from "@/utils/common";

export default defineComponent({
    components: {ScoreDetailCard},
    props: {
        base64String: String,
    },
    data() {
        return {
            normalString: '',
            resultList: [],
            showTip: false,
            showOriginData: false,
        }
    },
    methods: {
        passNum,
        base64ToString,
        siftString,
        splitCourse,

        /**
         * 切换原始数据的可见性
         * @return {Boolean} 是否可见
         * @author ChiyukiRuon
         * */
        switchShowOriginData() {
            this.showOriginData = !this.showOriginData
            return !this.showOriginData
        },
    },
    mounted() {
        this.siftString(this.base64String)
    }
})
</script>

<style scoped>
.card-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
}
</style>