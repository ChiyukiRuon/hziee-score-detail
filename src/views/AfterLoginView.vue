<template>
    <el-collapse v-model="semesterValue">
        <template v-for="(score, index) in scoreList" :key="index">
            <!-- TODO 在未展开界面显示成绩概览 -->
            <el-collapse-item
                :name="`${score.semester}-${score.term}`"
                :ref="`${score.semester}-${score.term}`"
            >
                <template #title>
                    {{ score.semester }}学年第{{ score.term }}学期
                    <span v-if="`${score.semester}-${score.term}` === semesterString">
                        <el-tag round size="small" effect="plain" style="margin-left: 10px">当前学期</el-tag>
                    </span>
                </template>
                <show-all-scores :base64-string="score.score" />
            </el-collapse-item>
        </template>
    </el-collapse>
</template>

<script>
import ShowAllScores from "@/components/ShowAllScores.vue";

export default {
    components: {ShowAllScores},
    props: {
        scoreList: Array,
        semesterString: String,
    },
    data() {
        return {
            semesterValue: this.semesterString
        }
    },
}
</script>

<style scoped>

</style>