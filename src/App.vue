<template>
    <el-container>
        <el-main>
            <el-divider content-position="left">登录教务自动获取__VIEWSTATE</el-divider>
            <el-form
                v-loading="isLoading"
                element-loading-text="获取成绩中..."
            >
                <el-form-item label="学号" prop="uid">
                    <el-input
                        @keydown.enter="focusPwdInput"
                        class="login-input"
                        type="text"
                        :clearable="true"
                        v-model="uid"
                        placeholder="学号"
                        maxlength="9" />
                </el-form-item>
                <el-form-item label="密码" prop="pwd">
                    <el-input
                        ref="pwd"
                        @keydown.enter="getAllScore(uid, pwd)"
                        class="login-input"
                        type="password"
                        :clearable="true"
                        :show-password="true"
                        v-model="pwd"
                        placeholder="密码" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click.prevent="getAllScore(uid, pwd)">
                        <span v-if="!isLogin">登录</span>
                        <span v-else>更新数据</span>
                    </el-button>
                    <el-button type="danger" @click.prevent="logout()" v-if="isLogin">退出</el-button>
                    <el-link
                        type="primary"
                        :underline="false"
                        @click.prevent="changeTipVisible"
                        style="padding-left: 15px"
                    >说明</el-link>
                </el-form-item>
            </el-form>

            <after-login-view :score-list="resultList" :semester-string="getCurrentSemester()" v-if="showScoreCard" />

            <el-divider content-position="left" v-if="!isLogin">手动获取__VIEWSTATE</el-divider>
            <no-login-view v-if="!isLogin" />
        </el-main>
        <el-footer class="footer">
            <div>
                <span class="footer-text">&copy; {{ this.getYear() }}
                    <a href="https://chiyukiruon.com" target="_blank">ChiyukiRuon</a>&nbsp;|&nbsp;
                </span>
                <span class="footer-text">
                    <a href="https://github.com/ChiyukiRuon/score-detail" target="_blank">Github</a>
                </span>
            </div>
        </el-footer>
        <div style="text-align: center; margin-bottom: 10px">
            <span class="footer-text">

            </span>
        </div>
    </el-container>

    <el-backtop :right="50" :bottom="60" />

    <el-dialog v-model="showTip" title="说明">
        <el-text
            size="large"
            type="primary"
            style="font-weight: bold"
        >常见问题 Q&A</el-text>
        <div class="question">Q:应该怎么看成绩</div>
        <div>A:一般有三个成绩,按顺序分别为平时分,卷面分以及最终成绩</div>
        <div class="question">Q:为什么除了平时分,卷面分,最终成绩还有别的成绩</div>
        <div>A:若这门课不是三个成绩,其它的则可能是验收成绩,实践成绩等,请结合实际课程具体情况具体分析</div>
        <div class="question">Q:为什么我没办法展开除了当前学期以外的别的学期的成绩</div>
        <div>A:手机浏览器访问可能会出现这种情况，遇到这种情况可以尝试刷新页面</div>
        <el-divider />
        <el-text
            size="large"
            type="primary"
            style="font-weight: bold"
        >免责声明 Disclaimer</el-text>
        <div>· 该项目不是杭州电子科技大学信息工程学院官方的项目，不代表杭州电子科技大学信息工程学院官方的任何立场和态度</div>
        <div>· 最终的考试成绩以教务系统为准，本项目仅供参考</div>
        <div>· 友情链接:
            <a href="https://www.hziee.edu.cn/" target="_blank" style="color: #409eff">杭州电子科技大学信息工程学院</a>
        </div>
        <el-divider />
        <el-text
            size="large"
            type="primary"
            style="font-weight: bold"
        >反馈 Feedback</el-text>
        <div>在使用本站的过程中遇到问题您可以:</div>
        <div>· 到本项目的Github页面<a href="https://github.com/ChiyukiRuon/hziee-score-detail/issues" target="_blank" style="color: #409eff">提出Issues</a></div>
        <div>· 联系<b>support@chiyukiruon.top</b>说明您的问题</div>
    </el-dialog>
</template>

<script>
    import NoLoginView from "@/views/NoLoginView.vue";
    import Cookies from 'js-cookie';
    import {ref} from "vue";
    import axios from "axios";
    import {ElMessage, ElNotification} from "element-plus";
    import AfterLoginView from "@/views/AfterLoginView.vue";
    import packageJson from "../package.json"

    // 显示Cookie提示
    const disclaimer = () => {
        ElNotification({
            title: '免责声明',
            message: '<div>该项目不是杭州电子科技大学信息工程学院官方的项目，不代表杭州电子科技大学信息工程学院官方的任何立场和态度.</div>' +
                '<div>最终的考试成绩以教务系统为准，本项目仅供参考.</div>',
            dangerouslyUseHTMLString: true,
            type: 'warning',
            duration: 0,
            position: 'bottom-right',
        })
    }

    // 免责声明
    const cookieNotification = () => {
        ElNotification({
            title: 'Cookie使用',
            message: '在您使用<b>登录教务自动获取成绩</b>的功能时,本网站会将您的<b>学号</b>及<b>密码</b>以Cookie形式保存在本地',
            dangerouslyUseHTMLString: true,
            type: 'warning',
            duration: 4500,
            position: 'bottom-right',
        })
    }

    export default {
        components: {AfterLoginView, NoLoginView},
        setup() {
            const isLoading = ref(false)
            const isLogin = ref(false)
            const showScoreCard = ref(false)
            const resultList = ref([])

            /**
             * 获取学生的所有成绩
             *
             * @param {String} uid 学号
             * @param {String} pwd 密码
             * @return void
             * @author ChiyukiRuon
             * */
            function getAllScore(uid, pwd) {
                uid = uid.split(" ").join("")
                pwd = pwd.split(" ").join("")
                if (uid === '' || uid === undefined) {
                    ElMessage.warning('请输入学号')
                    return
                }else if (pwd === '' || pwd === undefined) {
                    ElMessage.warning('请输入密码')
                    return
                }
                isLoading.value = true
                showScoreCard.value = false
                axios.get(`https://scoredetail-api.chiyukiruon.top/get_score?uid=${uid}&pwd=${pwd}`)
                    .then(
                        response => {
                            resultList.value = response.data
                            Cookies.set('uid', uid, { expires: 30 })
                            Cookies.set('pwd', pwd, { expires: 30 })
                            isLoading.value = false
                            isLogin.value = true
                            showScoreCard.value = true
                        }
                    )
                    .catch(
                        error => {
                            isLoading.value = false
                            showScoreCard.value = false
                            console.error(error)
                            ElMessage.error(error)
                        }
                    )
            }

            return {
                isLoading,
                isLogin,
                showScoreCard,
                resultList,
                getAllScore,
            }
        },
        data() {
            return {
                uid: '',
                pwd: '',
                showTip: false,
            }
        },
        methods: {
            /**
             * 回车聚焦到密码输入框
             *
             * @return void
             * @author ChiyukiRuon
             * */
            focusPwdInput() {
                this.$refs.pwd.focus()
            },

            /**
             * 退出登录，清除Cookie
             * 
             * @return {void}
             * @author ChiyukiRuon
             * */
            logout() {
                Cookies.remove('uid')
                Cookies.remove('pwd')
                this.uid = ''
                this.pwd = ''
                this.isLogin = false
                this.showScoreCard = false
                ElMessage.success("退出登陆")
                location.reload()
            },

            /**
             * 切换提示提示可见性
             * 
             * @return {void}
             * @author ChiyukiRuon
             * */
            changeTipVisible() {
                this.showTip = !this.showTip
            },

            /**
             * 获取当前年份
             * 
             * @return {Number}
             * @author ChiyukiRuon
             * */
            getYear() {
                return new Date().getFullYear();
            },

            /**
             * 获取当前学年
             * 
             * @return {String}
             * @author ChiyukiRuon
             * */
            getCurrentSemester() {
                const now = new Date();
                const year = now.getFullYear();
                const month = now.getMonth() + 1;

                if (month >= 11 || month <= 9) {
                    // 当前学年的上半学期
                    return `${year - 1}-${year}-2`;
                } else {
                    // 当前学年的下半学期
                    return `${year}-${year + 1}-1`;
                }
            },
        },
        mounted() {
            // 判断是否存有Cookie
            if (Cookies.get('uid') !== undefined && Cookies.get('pwd') !== undefined) {
                this.uid = Cookies.get('uid')
                this.pwd = Cookies.get('pwd')
                this.isLogin = true
                this.getAllScore(this.uid, this.pwd)
                Cookies.set('uid', Cookies.get('uid'), { expires: 30 })
                Cookies.set('pwd', Cookies.get('pwd'), { expires: 30 })
            }else {
                disclaimer()
                setTimeout(function (){
                    cookieNotification()
                }, 2000)
            }

            // 版权及版本信息
            const VERSION = packageJson.version
            console.log("   _____ _     _             _    _ \n" +
                "  / ____| |   (_)           | |  (_)\n" +
                " | |    | |__  _ _   _ _   _| | ___ \n" +
                " | |    | '_ \\| | | | | | | | |/ / |\n" +
                " | |____| | | | | |_| | |_| |   <| |\n" +
                "  \\_____|_| |_|_|\\__, |\\__,_|_|\\_\\_|\n" +
                "                  __/ |             \n" +
                "                 |___/              \n" +
                "score-detail-v" + VERSION + "\n" +
                "ChiyukiRuon@https://chiyukiruon.com")
        }
    }
</script>

<style scoped>
.login-input {
    max-width: 250px;
}

.footer {
    height: 25px;
    display: flex;
    justify-content: center;
    text-align: center;
}

.footer-text {
    flex-shrink: 1;
}

.question {
    font-weight: bold;
    margin-top: 10px;
}
</style>
