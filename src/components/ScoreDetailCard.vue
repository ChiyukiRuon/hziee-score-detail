<template>
    <el-card class="box-card" style="margin: 10px">
        <div>
            <el-text v-if="scoreDetail.isPass" size="large" style="font-weight: bold;">
                {{ scoreDetail.courseName }}
            </el-text>
            <el-text v-else type="danger" size="large" style="font-weight: bold;">{{ scoreDetail.courseName }}</el-text>
        </div>
        <div>
            <el-text size="small">学分：{{ scoreDetail.credits }}</el-text>
        </div>
        <div>
            <el-text>平时成绩：{{ scoreDetail.performanceScore || '无' }}</el-text>
        </div>
        <div v-for="(score, item) in scoreDetail.assessmentScore" :key="item">
            <el-text v-if="scoreDetail.assessmentScore.length === 1">卷面成绩：{{ score }}</el-text>
            <el-text v-else>考核成绩：{{ score }}</el-text>
        </div>
        <div>
            <el-text style="font-weight: bold">最终成绩：</el-text>
            <el-text v-if="scoreDetail.isPass" type="success" style="font-weight: bold;">
                {{ scoreDetail.finalScore }}
            </el-text>
            <el-text v-else type="danger" style="font-weight: bold;">{{ scoreDetail.finalScore }}</el-text>
        </div>
        <div v-if="scoreDetail.isRenovate">
            <el-text>重修</el-text>
        </div>
        <div>
            <el-text>{{ scoreDetail.college }}</el-text>
        </div>
    </el-card>
</template>

<script>
export default {
    props: {
        scoreDetail: null,
    },
}
</script>

<style scoped>
.box-card {
    display: flex;
    min-width: 180px;
    min-height: 250px;
}
</style>