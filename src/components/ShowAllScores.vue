<template>
    <div v-if="resultList.length !== 0">
        <el-text class="mx-1" size="large">共提取出{{ resultList.length }}门课程数据,</el-text>
        <el-text class="mx-1" size="large">通过{{ passNum(resultList) }}门</el-text>
    </div>
    <div class="card-container">
        <span v-for="(course, index) in resultList" :key="index">
            <score-detail-card :score-detail="course" v-if="isMobile(500)" />
        </span>
        <el-table v-if="!isMobile(500)" empty-text="无数据" :data="resultList" stripe style="width: 100%">
            <el-table-column prop="courseName" label="科目">
                <template #default="scope">
                    <el-text v-if="!scope.row.isPass" type="danger" style="font-weight: bold;">
                        {{ scope.row.courseName }}
                    </el-text>
                    <el-text v-else style="font-weight: bold;">
                        {{ scope.row.courseName }}
                    </el-text>
                    <el-tag size="small" type="info" round effect="plain" v-if="scope.row.isRenovate" style="margin-bottom: 3px;margin-left: 2px">
                        重修
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="finalScore" label="最终成绩" width="100px">
                <template #default="scope">
                    <el-text v-if="scope.row.isPass" type="success" style="font-weight: bold;">
                        {{ scope.row.finalScore }}
                    </el-text>
                    <el-text v-else type="danger" style="font-weight: bold;">
                        {{ scope.row.finalScore }}
                    </el-text>
                </template>
            </el-table-column>
            <el-table-column prop="performanceScore" label="平时成绩" width="100px" />
            <el-table-column prop="assessmentScore" label="考核成绩">
                <template #header>
                    考核成绩
                    <el-tooltip placement="top">
                        <template #content>
                            <div>为什么会有多个考核成绩？</div>
                            <div>对于大部分科目而言，单个考核成绩就意味着期末考试卷面分</div>
                            <div>根据不同的课程，多个考核成绩可能意味着验收成绩，实践成绩等</div>
                        </template>
                        <el-text style="margin-left: 5px;color: #409eff">(?)</el-text>
                    </el-tooltip>
                </template>
                <template #default="scope">
                    <span v-for="(item, index) in scope.row.assessmentScore" :key="index" style="margin-right: 10px">
                        {{item}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="credits" label="学分" width="80px" />
            <el-table-column prop="college" label="开课学院" width="130px" />
        </el-table>
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
import {passNum, base64ToString, siftString, splitCourse, isMobile} from "@/utils/common";

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
        isMobile,
        passNum,
        base64ToString,
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
        this.normalString = base64ToString(this.base64String)
        this.resultList = siftString(this.normalString)
        console.log(this.resultList)
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