<template>
  <div class="uploader-wrapper">
      <el-button size="small" type="primary" :id="buttonId">点击上传</el-button>
      <span slot="tip" class="el-upload__tip tip-text" v-if="showHint">
        {{ this.hint }}
      </span>
    <div class="upload-list" id="uploadList" v-if="showFileList">
      <div class="upload-item" v-for="file in uploadList" :key="file.id">
        <div
          class="file-name el-upload-list__item"
          @mouseenter="setFocusing(true)"
          @mouseleave="setFocusing(false)"
        >
          <a class="el-upload-list__item-name">
            <i class="el-icon-document"></i>{{ file.name }}
          </a>
          <i
            class="'el-icon-upload-success"
            :class="{ 'el-icon-circle-check': !focusing }"
          ></i>
          <i class="el-icon-close" @click="handleFileRemove(file)"></i>
        </div>
        <!-- 进度条 -->
        <el-progress
          v-if="showProcess"
          class="upload-item-progress"
          :stroke-width="2"
          :percentage="file.percent"
          :width="320"
        ></el-progress>
      </div>
    </div>
  </div>
</template>

<script>
import api from './api/houseVideo'
require('qiniu-js/dist/qiniu.min.js')

export default {
  name: 'Uploader',
  computed: {
    /** 如果传了filters值，将其值拼接为字符串用以提示 */
    fileType: function () {
      let extStr = ''
      this.mimeTypes.map((item, index) => {
        const appendStr = index < this.mimeTypes.length - 1 ? ',' : ''
        extStr += item.extensions + appendStr
      })
      return extStr.replaceAll(',', '、')
    },
    /** 提示语 */
    hint: function () {
      const typeLimit = this.fileType ? `仅支持${this.fileType}格式文件，` : ''
      const sizeLimit = `大小不超过${this.maxSize}`
      const numLimit = this.maxNum ? `，最多上传${this.maxNum}个文件` : ''
      return typeLimit + sizeLimit + numLimit
    }
  },
  props: {
    /** 上传按钮id */
    buttonId: {
      type: String,
      default: 'uploadBtn'
    },
    /** 空间名 */
    bucketName: {
      type: String,
      default: 'saas-file'
    },
    /** 域名 */
    domain: {
      type: String,
      default: 'https://saasyun.qfangimg.com'
    },
    /** 单个最大文件体积限制 */
    maxSize: {
      type: String,
      default: '50mb'
    },
    /** 最大文件数量, 0视为无限制 */
    maxNum: {
      type: Number,
      default: 10
    },
    /** 分块上传时，每块的体积 */
    chunkSize: {
      type: String,
      default: '4mb'
    },
    /** 上传失败最大重试次数 */
    maxRetries: {
      type: Number,
      default: 3
    },
    /** 是否自动上传 */
    autoStart: {
      type: Boolean,
      default: true
    },
    /** 多传 */
    multiSelection: {
      type: Boolean,
      default: false
    },
    /** 是否显示提示语 */
    showHint: {
      type: Boolean,
      default: false
    },
    /** 是否显示文件列表 */
    showFileList: {
      type: Boolean,
      default: true
    },
    /** 显示文件列表时，是否显示进度条 */
    showProcess: {
      type: Boolean,
      default: true
    },
    /** 文件检查函数 */
    beforeUploadChecker: {
      type: Function
    },
    /** 用来限定上传文件的类型，为一个数组。
     * 该数组的每个元素又是一个对象，该对象有title和extensions两个属性：
     * title为该过滤器的名称，extensions为文件扩展名，有多个时用逗号隔开。
     * 如传空数组，即不做限制。 */
    mimeTypes: {
      type: Array,
      default: function () {
        return [
          { title: 'Image files', extensions: 'png,jpg' },
          { title: 'Office files', extensions: 'pdf,excel,word' }
        ]
      }
    }
  },
  data () {
    return {
      uploader: null,
      token: '',
      uploadList: [], // 列表
      focusing: false
    }
  },
  mounted () {
    this.getToken().then(res => {
      this.token = res.responseBody
      this.initUpload()
    })
    /**
     * emit提示语
     * @property {String} hint
     */
    this.$emit('get-hint', this.hint)
  },
  methods: {
    // 获取token
    getToken (value) {
      // TODO promise有点多余
      return new Promise(async (resolve, reject) => {
        try {
          const { data: { result } } = await api.getQiniuToken()
          resolve(result)
        } catch (err) {
          console.log(err)
          reject(err)
        }
      })
    },
    // 上传七牛云
    initUpload () {
      // require文件后，会在window对象挂在plupload
      const _this = this
      // const plupload = window.plupload
      const Qiniu = global.Qiniu
      // domain为七牛空间对应的域名，选择某个空间后，可通过 空间设置->基本设置->域名设置 查看获取
      // uploader为一个plupload对象，继承了所有plupload的方法
      this.uploader = Qiniu.uploader({
        runtimes: 'html5,flash,html4', // 上传模式，依次退化
        browse_button: this.buttonId, // 上传选择的点选按钮，必需
        uptoken: this.token, // uptoken是上传凭证
        get_new_uptoken: true, // 设置上传文件的时候是否每次都重新获取新的uptoken
        bucket_name: this.bucketName, // 空间名
        unique_names: false, // 默认false，true: upload会自定生成唯一的id值作为key=文件名上传; false：自定义文件名规则
        save_key: false, // 默认false。true： sdk生成随机哈希值; false: 自己自定义文件名规则
        domain: this.domain, // bucket domain
        // container: 'list', // 上传区域DOM ID，默认是browser_button的父元素
        max_file_size: this.maxSize, // 最大文件体积限制
        // dragdrop: false, // 开启可拖曳上传
        // drop_element: 'uploadList', // 拖曳上传区域元素的ID，
        chunk_size: this.chunkSize, // 分块上传时，每块的体积
        max_retries: this.maxRetries, // 上传失败最大重试次数
        auto_start: this.autoStart, // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
        multi_selection: this.multiSelection, // 是否可以在文件浏览对话框中选择多个文件，true为可以，false为不可以。
        filters: { mime_types: this.mimeTypes }, // 过滤文件名

        init: {
          // 自定义文件名
          Key: (up, files) => {
            // _this.fileKey = ''
            let fileKey = ''
            // 生成规则：0b78f4be-bd4c-459f-b10e-117f5566f7d4.jpg
            // 该配置必须要在unique_names: false，save_key: false时才生效
            const type = files.name
            const suffix = type.substring(type.lastIndexOf('.') + 1)
            fileKey =
              this.createChildUuid(8) +
              '-' +
              this.createChildUuid(4) +
              '-' +
              this.createChildUuid(4) +
              '-' +
              this.createChildUuid(4) +
              '-' +
              this.createChildUuid(12) +
              '.' +
              suffix
            return fileKey
          },

          // 添加队列成功后
          FilesAdded: (up, files) => {
            // console.log('uploader: FilesAdd', up, files)

            up.start() // 执行开始上传拿到 自定义 key 值
          },
          // 添加队列后，上传前
          BeforeUpload: (up, file) => {
            // console.log('uplodaer: before upload', up, file)
            const checker = typeof (this.beforeUploadChecker) === 'function' ? this.beforeUploadChecker : this.defaultChecker
            if (!checker(up.files)) {
              this.uploader.stop()
              this.uploader.splice(0, up.files.length)
              return
            }
            this.uploadList.push({
              name: file.name,
              percent: 0,
              id: file.id
            })
            /**
             * 准备上传，emit文件信息
             * @property {Object} file 当前文件
             * @property {Object} fileList 文件列表
             */
            this.$emit('on-upload', file, this.uploadList)
          },
          // 切片上传完成后
          // ChunkUploaded: (up, file, info) => {
          // },
          // 文件上传过程中 => 上传进度
          UploadProgress: (up, file) => {
            // console.log('uploader: UploadProgress', up, file)

            // 每个文件上传时，处理相关的事情
            // TODO单纯得循环没必要用find
            this.uploadList.find((item) => {
              if (item.name === file.name) {
                item.percent = file.percent
              }
            })

            /**
             * 上传中，emit上传进度
             * @property {Object} file
             * @property {Object} fileList 文件列表
             */
            this.$emit('on-progress', file, this.uploadList)
          },
          // 上传成功
          FileUploaded: (up, file, info) => {
            console.log('uploader: FileUploaded', up, file)
            // TODO try catch
            const { key } = JSON.parse(info.response)
            const url = `${_this.domain}/${key}`
            this.uploader.removeFile(file)

            /**
             * 上传成功，emit上传文件url
             * @property {Object} file 当前文件
             * @property {String} url  文件url
             * @property {Object} fileList  文件列表
             */
            this.$emit('on-success', file, url, this.uploadList)
          },
          // 上传错误
          Error: (uploader, err) => {
            // console.error('uploader:Error', uploader, err)
            // TODO 用switch比较清晰
            if (err.code === -600) {
              this.$message.error('上传文件大小不能超过' + this.maxSize + '!')
            } else if (err.code === -601) {
              console.log(this.uploadList)
              this.$message.error('上传文件只能是' + this.fileType + '格式!')
            } else if (err.code === -200) { // token失效
              this.uploadList = []
              this.$message.error('页面失效，请重新打开弹窗进行文件上传!')
            }

            /** 上传错误
             * @property {Object} uploader uploader对象
             * @property {Object} err 包含code、message
             */
            this.$emit('on-error', uploader, err)
          },
          // 所有文件上传完成
          UploadComplete: (uploader, files) => {
            // console.log(_this.uploadList)

            /** 上传完成
             * @property {Object} files 文件列表
            */
            this.$emit('on-complete', files)
          }
        }
      })
    },
    // 创建uuid子串
    createChildUuid (num) {
      let result = parseInt(Math.random() * 10 * Date.now(), 10).toString(16)
      if (result.length > num) {
        result = result.substring(result.length - num)
      } else if (result.length < num) {
        result = result.padStart(num, '0')
      }
      return result
    },
    // 删除文件
    handleFileRemove (file) {
      this.uploader.removeFile(file)
      const removeIndex = this.uploadList.findIndex(item => item.id === file.id)
      if (removeIndex !== -1) {
        this.uploadList.splice(removeIndex, 1)
      }
      /**
       * 移除文件
       * @property {Object} file  // 文件
       * @property {Object} fileList // 文件列表
       * */
      this.$emit('on-remove', file, this.uploadList)
    },
    // 上传文件移入移出
    setFocusing (type) {
      this.focusing = type
    },
    defaultChecker (files) {
      if (this.maxNum && (files.length > this.maxNum || this.uploadList.length + files.length > this.maxNum)) {
        this.$message.error(`最多上传${this.maxNum}个文件！`)
        return false
      }
      if (!this.uploadList.length) {
        return true
      }

      // const nameObj = {}
      // files.forEach(({ name }) => {
      //   nameObj[name] = true
      // })
      // const hasRepeatedFile = this.uploadList.some(({ name }) => nameObj[name])
      // hasRepeatedFile && this.$message.error(`存在同名文件`)
      // return hasRepeatedFile

      // const hasRepeatedFile = files.some(({ name }) => {
      //     return ~this.uploadList.findIndex(item => item.name === name)
      // })
      // hasRepeatedFile && this.$message.error(`存在同名文件`)
      // return hasRepeatedFile
        // TODO这个可以重写
      let hasRepeatedFile = false
      for (let i = 0; i < files.length && hasRepeatedFile === false; i++) {
        // TODO单纯得循环没必要用find
        this.uploadList.find(item => {
          if (item.name === files[i].name) {
            this.$message.error(`存在同名文件`)
            hasRepeatedFile = true
          }
        })
      }
      if (hasRepeatedFile) {
        return false
      }
      return true
    }
  }
}
</script>

<style scoped lang="scss">
.uploader-wrapper {
  width: 330px;
  .tip-text {
    color: #999;
    margin-left: 10px;
  }
  .file-name .el-icon-circle-check {
    position: absolute;
    right: 3px;
    top: 4px;
    color: #67c23a;
  }
  .upload-item-progress {
    width: 315px;
  }
}
</style>
