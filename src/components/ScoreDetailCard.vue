<template>
    <el-card class="box-card" style="margin: 10px">
        <div v-for="(item, index) in scoreList" :key="index" class="text item">
            <el-text size="large" v-if="index === 4 " style="font-weight: bold">{{ item.trimStart().replace(/^\d/g, "") }}</el-text>    <!-- 判断是否为科目名称 -->
            <el-text size="small" v-if="isCredits(item) && index > 4">学分：{{ item.trimStart() }}</el-text>   <!-- 判断学分 -->
            <span v-if="index > 4 && index !== 5 && index !== 6 && item !== 'd' && !isCredits(item)">   <!-- 判断是否是最终成绩 -->
                <span v-if="isFinalScore(scoreList, index)">
                    <el-text style="font-weight: bold">最终成绩：</el-text>
                    <el-text v-if="isPass(item)" type="success"  style="font-weight: bold;">{{ item.trimStart() }}</el-text>
                    <el-text v-else type="danger"  style="font-weight: bold;">{{ item.trimStart() }}</el-text>
                </span>
                <el-text v-else>{{ item.trimStart() }}</el-text>    <!-- 除了最终成绩以外的其他成绩 -->
            </span>
        </div>
    </el-card>
</template>

<script>
import {isCredits, isFinalScore, isPass} from "@/utils/common";

export default {
    props: {
        scoreList: null,
    },
    methods: {
        isPass,
        isFinalScore,
        isCredits,
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