import {ElMessage} from "element-plus";

/**
 * 判断是否为学分
 *
 * @param {Number} num 数字
 * @return {Boolean} 是否是学分
 * @author ChiyukiRuon
 * */
export function isCredits(num) {
    const regex = /^(\d|\d\.\d|\.\d|\d\.)$/
    return num.match(regex) !== null && num !== 0
}

/**
 * 判断是否为最终成绩
 *
 * @param {Array} list 成绩列表
 * @param {Number} index 需要判断元素在列表中的位置
 * @return {Boolean} 是否是最终成绩
 * @author ChiyukiRuon
 * */
export function isFinalScore(list, index) {
    const keywords = ['不及格', '不合格', '合格', '及格', '良好', '中等', '优秀',]

    const nextIndex = index + 1
    const currentElement = list[index]
    const nextElement = list[nextIndex]

    if (!nextElement) {
        if (/^\d{2}$/.test(currentElement)) {
            return true
        }

        return keywords.includes(currentElement)
    }

    return !!(currentElement !== '是' && (nextElement === '是' || /(学院|学部)/.test(nextElement)))
}

/**
 * 判断是否通过
 *
 * @param {String || Number} score 成绩
 * @return {Boolean} 是否通过
 * @author ChiyukiRuon
 * */
export function isPass(score) {
    if (/^\d{2}$/.test(score)) {
        return Number(score) >= 60
    }else {
        const keywords = ['合格', '及格', '良好', '中等', '优秀',]
        return keywords.includes(score)
    }
}

/**
 * 判断是否为小屏
 *
 * @param {Number} screenWidth 窗口宽度
 * @return {Boolean} 当前窗口宽度是否小于给定的值
 * @author ChiyukiRuon
 * */
export function isMobile(screenWidth) {
    return window.innerWidth < screenWidth
}

/**
 * 计算通过的学科数
 *
 * @param {Array} list 成绩列表
 * @return {Number} 通过的学科数
 * @author ChiyukiRuon
 * */
export function passNum(list) {
    let num = 0
    for (let i in list) {
        if (list[i].isPass) {
            num++
        }
    }

    return num
}

/**
 * Base64解码
 *
 * @param {String} base64String 从教务获取的base64字符串
 * @return {String || void} 若字符串符合要求则返回解码后的字符串，否则返回空
 * @author ChiyukiRuon
 * */
export function base64ToString(base64String) {
    let normalString = ''
    if (base64String === '') {
        ElMessage.error('输入为空')
        return
    }
    try {
        normalString = new TextDecoder().decode(Uint8Array.from(atob(base64String), (c) => c.charCodeAt(0)))
    } catch (e) {
        ElMessage.error('请输入正确的__VIEWSTATE')
        return
    }

    return normalString
}

/**
 * 筛选出需要的内容
 *
 * @param {String} string base64解码后的成绩字符串
 * @return {Array} 保留主要信息的列表
 * @author ChiyukiRuon
 * */
export  function siftString(string) {
    const regex = /[\u4e00-\u9fa5a-zA-Z0-9\-()（）.+\s]+(?=dd)/g;
    const result = string.match(regex).map(str => str.replace(/dd$/, ''));

    splitCourse(result)

    return splitCourse(result)
}

/**
 * 分割各个课程
 *
 * @param {Array} courseList 一个学期里的所有成绩
 * @return {Array} 按课程分组的成绩列表
 * @author ChiyukiRuon
 * */
export function splitCourse(courseList) {
    const regex = /([\d-]+)-[a-zA-Z0-9-]+-\d+/;
    const result = [];
    let currentSection = [];

    for (let i = 0; i < courseList.length; i++) {
        const item = courseList[i];
        const match = item.match(regex);

        if (match) {
            if (currentSection.length > 0) {
                result.push(currentSection);
                currentSection = [];
            }
        }

        currentSection.push(item);
    }

    if (currentSection.length > 0) {
        result.push(currentSection);
    }

    // this.resultList = formatResultData(result)

    // console.log(result)
    return formatResultData(result);
}

/**
 * 格式化成绩数据
 *
 * @param {Array} courseList 按课程分割好的成绩列表
 * @return {Array} 格式化后的成绩列表
 * @author ChiyukiRuon
 * */
export function formatResultData(courseList) {
    const resultList = []
    for (let i = 1;i < courseList.length;i++) {
        const item = {}
        const assessmentScore = []
        for (let j = 0;j < courseList[i].length;j++) {
            let courseListItem = courseList[i]
            if (j === 0) {
                item.courseId = courseListItem[j]
            }
            if (j === 4) {
                item.courseName = courseListItem[j].trimStart().replace(/^\d/g, "")
            }
            if (isCredits(courseListItem[j]) && j > 4) {
                item.credits = courseListItem[j].trimStart()
            }
            if (j > 6 && courseListItem[j] !== 'd' && !isCredits(courseListItem[j])) {
                if (isFinalScore(courseListItem, j)) {
                    item.finalScore = courseListItem[j].trimStart()
                    item.isPass = isPass(courseListItem[j])
                }else if (isCredits(courseListItem[j-1])) {
                    item.performanceScore = courseListItem[j].trimStart()
                }else {
                    if (courseListItem[j] === '是') {
                        item.isRenovate = courseListItem[j] === '是'
                    }else if (courseListItem[j].match(/(学院|学部)/)) {
                        item.college = courseListItem[j].trimStart()
                    }else {
                        assessmentScore.push(courseListItem[j].trimStart())
                    }
                }
            }
        }
        item.assessmentScore = assessmentScore
        resultList.push(item)
    }

    // console.log(resultList)
    return resultList
}