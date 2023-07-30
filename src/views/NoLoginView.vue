<template>
    <el-input type="text" :clearable="true" v-model="base64String" placeholder="__VIEWSTATE" style="padding-top: 10px;padding-bottom: 20px"/>
    <el-button type="primary" @click="siftString(base64String)">确定</el-button>
    <el-button type="text" @click.prevent="showTip = true" style="margin-right: 10px">如何获取__VIEWSTATE？</el-button>

    <show-score :result-list="resultList" :normal-string="normalString" />

    <el-dialog v-model="showTip" title="如何获取__VIEWSTATE？">
        <div>· 登录<a style="color: #409eff" href="http://124.160.107.91:6379/" target="_blank">教务网站</a>>信息查询>考试成绩查询</div>
        <div>· F12打开开发者工具>选择网络</div>
        <div>· 选择想要查询的学期>点击查询</div>
        <div>· 查询完成后找到“xscjcx_dq.aspx”开头的响应</div>
        <div>· 选择“载荷”>表单数据中会有一个“__VIEWSTATE”的项目，复制即可</div>
    </el-dialog>
</template>

<script>
import ShowScore from "@/components/ShowScore.vue";
import {defineComponent} from "vue";
import {passNum, base64ToString, siftString, splitCourse} from "@/utils/common";

export default defineComponent({
    components: {ShowScore},
    data() {
        return {
            base64String: '',
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
})
</script>

<style scoped>

</style>