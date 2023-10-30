import {
    createApp
} from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'
import Cookies from 'https://cdn.jsdelivr.net/npm/js-cookie@3.0.5/+esm'
import mdui from 'https://cdn.jsdelivr.net/npm/mdui@1.0.2/+esm'

createApp({
    data() {
        return {
            title: 'Edge Sidebar Site',
            siteList: [],
            addSitePageDialog: null,
            dialogData: {
                form: {
                    icon: '',
                    url: '',
                    name: ''
                },
                invalid: {
                    icon: '',
                    url: '',
                    name: ''
                },
            },
            defaultDialogData: {
                form: {
                    icon: '',
                    url: '',
                    name: ''
                },
                invalid: {
                    icon: '',
                    url: '',
                    name: ''
                },
            },
            editIndex: -1,
        }
    },
    mounted() {
        this.initDialog()
        this.loadSiteList()
    },
    methods: {
        initDialog() {
            this.addSitePageDialog = new mdui.Dialog(this.$refs.addSitePageDialogRefs)
        },
        loadSiteList() {
            this.siteList.splice(0, this.siteList.length)
            const siteListJson = Cookies.get('siteList')
            console.log('siteList', siteListJson);
            if (siteListJson) {
                const siteList = JSON.parse(siteListJson)
                for (const siteInfo of siteList) {
                    this.siteList.push(siteInfo)
                }
            }
        },
        goToNewSite(siteInfo) {
            // window.open(siteInfo.url)
            window.location.href = siteInfo.url
        },
        openAddSitePageDialog() {
            // 清除对话框内容
            this.cleanDialogData()
            this.editIndex = -1
            // 打开对话框
            this.addSitePageDialog.open()
        },
        confirmAddSitePage() {
            // 验证添加的内容
            if (!this.validateDialogData()) return
            // 判断是添加还是修改
            const siteInfo = JSON.parse(JSON.stringify(this.dialogData.form))
            if (this.editIndex >= 0) {
                // 修改
                this.siteList.splice(this.editIndex, 1, siteInfo)
            } else {
                // 将site添加到siteList
                this.siteList.push(siteInfo)
            }
            // 将siteList保存到cookie
            Cookies.set('siteList', JSON.stringify(this.siteList), {
                expires: 3650
            })
            // 关闭对话框
            this.addSitePageDialog.close()
        },
        validateDialogData() {
            let valid = true
            const form = this.dialogData.form
            // icon不可为空且需要是一个url，使用正则表达式验证
            if (!form.icon || !form.icon.match(/^(http|https|file):\/+.*\.(png|jpg|jpeg|gif|svg)$/)) {
                this.dialogData.invalid.icon = '请输入正确的icon地址'
                valid = false
            } else {
                this.dialogData.invalid.icon = ''
            }
            // url不可为空且需要是一个url，使用正则表达式验证
            if (!form.url || !form.url.match(/^(http|https):\/\/.*$/)) {
                this.dialogData.invalid.url = '请输入正确的url地址'
                valid = false
            } else {
                this.dialogData.invalid.url = ''
            }
            // name不可为空
            if (!form.name) {
                this.dialogData.invalid.name = '请输入名称'
                valid = false
            } else {
                this.dialogData.invalid.name = ''
            }
            return valid
        },
        cleanDialogData() {
            this.dialogData = JSON.parse(JSON.stringify(this.defaultDialogData))
        },
        deleteCurrentSite(index) {
            this.siteList.splice(index, 1)
            Cookies.set('siteList', JSON.stringify(this.siteList), {
                expires: 3650
            })
        },
        editCurrentSite(index) {
            const siteInfo = this.siteList[index]
            this.dialogData.form = JSON.parse(JSON.stringify(siteInfo))
            this.editIndex = index
            this.addSitePageDialog.open()
        },
    },
}).mount('#app')
