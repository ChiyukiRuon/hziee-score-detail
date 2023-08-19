<template>
    <el-input type="text" :clearable="true" v-model="base64String" placeholder="__VIEWSTATE" style="padding-top: 10px;padding-bottom: 20px"/>
    <el-button type="primary" @click="showScore(base64String)" style="margin-right: 15px">确定</el-button>
    <el-link :underline="false" type="primary" @click.prevent="showTip = true">如何获取__VIEWSTATE？</el-link>

    <show-score :result-list="resultList" :normalString="normalString" v-on="$attrs" />

    <el-dialog v-model="showTip" title="如何获取__VIEWSTATE？" :fullscreen="isMobile(500)">
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
import {passNum, base64ToString, siftString, splitCourse, isMobile} from "@/utils/common";

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
        isMobile,
        passNum,
        base64ToString,
        siftString,
        splitCourse,

        /**
         * 展示成绩
         *
         * @param {String} base64String Base64字符串
         * @return void
         * @author ChiyukiRuon
         * */
        showScore(base64String) {
            this.normalString = base64ToString(base64String)
            this.resultList = siftString(this.normalString)
        },

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