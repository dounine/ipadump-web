<template>
  <el-main>
    <el-form :model="data" label-width="70px">
      <el-form-item label="应用图标">
        <img :src="data.app.icon" style="width:30px;height:30px;"/>
      </el-form-item>
      <el-form-item label="应用名称">
        <el-autocomplete style="width:100%;" @select="handleSelect" :fetch-suggestions="querySearchAsync"
                         v-model="data.app.name"/>
      </el-form-item>
      <el-form-item label="应用描述">
        <el-input v-model="data.app.des" type="textarea"/>
      </el-form-item>
      <el-divider content-position="left">版本信息</el-divider>
      <el-form-item label="应用版本">
        <el-select
            v-model="data.app.vnames"
            filterable
            multiple
            @change="versionSelect"
            allow-create
            default-first-option
            :reserve-keyword="false"
            placeholder="请选择或者输入版本"
        >
          <el-option
              v-for="item in data.app.versions"
              :key="item.name"
              :label="item.name"
              :value="item.name"
          />
        </el-select>
        <el-button @click="deleteVersion" :disabled="!data.app.vnames[0] || !data.app.name" :icon="Delete">删除
        </el-button>
      </el-form-item>
      <el-form-item label="ipa文件">
        <div style="width:100%;">
          <el-upload
              ref="uploadRef"
              class="upload-demo"
              :limit="1"
              :on-change="fileChange"
              :before-remove="fileRemove"
              :auto-upload="false"
          >
            <template #trigger>
              <el-button type="primary">选择ipa</el-button>
            </template>
            <el-button class="ml-3" type="success" @click="submitUpload" style="margin-left:20px;">
              上传
            </el-button>

          </el-upload>
          <el-progress :percentage="hashPercentage" color="#f56c6c">
            hash
          </el-progress>
          <el-progress style="width:100%;" :percentage="percentage">
            上传{{ percentage }}
          </el-progress>
        </div>
      </el-form-item>
      <el-form-item label="版本发布">
        <el-switch v-model="data.version.push"/>
      </el-form-item>
      <el-form-item label="是否解压">
        <el-switch :loading="unzipLoading" @change="switchUnzip" v-model="data.version.unzip"/>
        <el-button style="margin-left:20px;" v-if="data.version.unzip && !unzipLoading" @click="loadIpaImages" :loading="loadIpaLoading">
          加载ipa图片
        </el-button>
        <el-select v-model="data.app.icon" placeholder="使用icon" v-if="data.version.unzip && !unzipLoading">
          <el-option
              v-for="item in data.version.icons"
              :key="item.name"
              :label="item.name"
              :value="item.url"
          >
            <span style="float: left">{{ item.name }}</span>
            <span
                style="
          float: right;
          color: var(--el-text-color-secondary);
          font-size: 13px;
        "
            ><img style="width:30px;height:30px;" :src="item.url"/></span
            >
          </el-option>
        </el-select>

      </el-form-item>
      <el-form-item label="版本大小">
        <span>{{ Common.sizeFormat(data.version.size) }}</span>
      </el-form-item>
      <el-form-item label="下载次数">
        <span>{{ data.version.download }}</span>
      </el-form-item>
      <el-form-item label="文件地址">
        <a :href="data.version.file">{{ data.version.file }}</a>
      </el-form-item>
      <el-form-item label="版本描述">
        <el-input v-model="data.version.des" type="textarea"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Update</el-button>
        <el-button>Cancel</el-button>
      </el-form-item>
    </el-form>
  </el-main>
</template>

<script lang="ts" setup>
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
import Common from '../util/common'
import {getCurrentInstance, onBeforeMount, ref, watch, computed} from 'vue';
import {genFileId, ElMessageBox, ElMessage} from 'element-plus'
import type {UploadInstance, UploadProps, UploadRawFile} from 'element-plus'

const upload = ref<UploadInstance>()
const FILE_BATCH_SIZE = 200 * 1024

const submitUpload = () => {
  upload.value!.submit()
}
import {
  Download,
  ArrowRight,
  Refresh,
  Delete
} from '@element-plus/icons-vue'

const {proxy} = getCurrentInstance()
let appid = proxy.$route.params["appid"]
import {reactive} from 'vue'

const uploadRef = ref(null)
const unzipLoading = ref(false)
const loadIpaLoading = ref(false)
const percentage = ref(0)
const hashPercentage = ref(0)
const chunkData = ref([])
const container = reactive({
  uploaded: false,
  file: null,
  hash: '',
  worker: null,
  interval: null
})

const data = reactive({
  app: {
    name: '',
    des: '',
    icon: '',
    versions: [],
    vnames: [],
  },
  version: {
    appid: '',
    name: '',
    push: false,
    des: '',
    download: 0,
    size: 0,
    file: '',
    time: '',
    unzip: false,
    icons: []
  }
})
const versionSelect = (version) => {
  let findVersion = data.app.versions.find(item => {
    return item.name === version[0]
  })
  if (findVersion) {
    data.version = {
      ...findVersion,
      push: findVersion.push === 1
    }
  } else {
    data.version = {
      appid: '',
      name: '',
      push: false,
      des: '',
      download: 0,
      size: 0,
      file: '',
      time: '',
      icons: []
    }
  }
}
const parseQueryString = url => {
  let json = {}
  let arr = url.substring(url.indexOf('?') + 1).split('&')
  arr.forEach(item => {
    let tmp = item.split('=')
    json[tmp[0]] = tmp[1]
  })
  return json
}
const loadIpaImages = () => {
  loadIpaLoading.value = true
  let fileJson = parseQueryString(data.version.file)
  if (fileJson.fileId) {
    proxy.$axios.get(`/file/ipa/images?fileId=${fileJson.fileId}`).then(response => {
      data.version.icons = response.data.data
      loadIpaLoading.value = false
    })
  } else {
    ElMessage({
      message: '文件地址找不到fileId，无法加载ipa图片',
      type: 'error',
    })
  }
}
const switchUnzip = (e) => {
  unzipLoading.value = true
  let fileJson = parseQueryString(data.version.file)
  if (fileJson.fileId) {
    proxy.$axios.post(`/file/ipa/unzip`, {
      value: e,
      fileId: fileJson.fileId
    }).then(response => {
      let type = '解压'
      if (!e) {
        type = '删除解压包'
      }
      ElMessage({
        message: response.data.code === 0 ? `${type}成功` : `${type}失败`,
        type: response.data.code === 0 ? 'success' : 'warning',
      })
      unzipLoading.value = false
    })
  } else {
    ElMessage({
      message: '文件地址不包含fileId，不支持解压',
      type: 'error',
    })
  }
}
const onSubmit = () => {
  let versionData = {
    ...data.version,
    name: data.app.vnames[0] || '',
    appid: data.app.name,
    push: data.version.push ? 1 : 0
  }
  delete versionData['time']
  proxy.$axios.post(`/version/addOrUpdate`, {
    app: data.app,
    version: versionData
  }).then(response => {
    if (response.data.code === 0) {
      ElMessage({
        message: '成功处理',
        type: 'success',
      })
    }
  })
}
const deleteVersion = () => {
  if (data.app.vnames[0] && data.app.name) {
    ElMessageBox.alert(`是否要删除${data.app.vnames[0]}版本`, '提示', {
      confirmButtonText: '确定',
      callback: (action) => {
        if (action === 'confirm') {
          proxy.$axios.post(`/version/delete`, {
            appid: data.app.name,
            name: data.app.vnames[0]
          }).then(response => {
            ElMessage({
              message: '成功处理',
              type: 'success',
            })
            setTimeout(() => {
              location.reload()
            }, 1000)
          })
        }
      },
    })
  }
}
const handleSelect = (item) => {
  proxy.$router.push(`/upload/${item.value}`)
  proxy.$axios.get(`/version/nameinfo?name=${item.value}`).then(response => {
    const appInfo = response.data.data.info;
    const appVersions = response.data.data.versions;
    data.app.icon = appInfo.icon
    data.app.name = appInfo.name
    data.app.versions = appVersions
  })
}
const querySearchAsync = (queryString: string, cb: (arg: any) => void) => {
  if (!queryString) {
    cb([])
    return
  }
  proxy.$axios.get(`/app/keys?key=${queryString || appid}`).then(response => {
    cb(response.data.data.map(item => {
      return {
        value: item.name,
        link: item.name
      }
    }))
  })
}
const request = ({
                   url,
                   method = 'post',
                   data,
                   headers = {},
                   onProgress = (e) => e,
                   requestList,
                 }) => {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest()
    // xhr.timeout = 100000
    xhr.upload.onprogress = onProgress
    xhr.open(method, url)
    Object.keys(headers).forEach((key) =>
        xhr.setRequestHeader(key, headers[key])
    )
    xhr.ontimeout = (e) => {
      console.log('请求超时')
    }
    xhr.send(data)
    // XMLHttpRequest请求成功完成时触发；
    xhr.onload = (e) => {
      // 将请求成功的 xhr 从列表中删除
      if (requestList) {
        const xhrIndex = requestList.findIndex((item) => item === xhr)
        requestList.splice(xhrIndex, 1)
      }
      resolve({
        data: e.target.response,
      })
    }
    // 当请求结束时触发, 无论请求成功(load)还是失败(abort 或 error)。也可以使用 onloadend 属性。
    xhr.onloadend = (e) => e
    // 暴露当前 xhr 给外部
    requestList?.push(xhr)
  })
}
const fileRemove = async (data) => {
  if (container.file.name) {
    await deleteBigFile(container.file.name, container.hash)
    container.uploaded = false
  }
  container.file = null;
  container.hash = '';
  container.worker = null;
  container.interval = null;
  percentage.value = 0;
  hashPercentage.value = 0;
  chunkData.value = [];
}
const uploadPercentage = () => {
  if (!container.file || !chunkData.value.length) {
    return 0
  }
  const loaded = chunkData.value
      .filter(({percentage}) => percentage !== undefined)
      .map((item) => {
        return item.size * item.percentage
      })
      .reduce((acc, cur) => {
        return acc + cur
      })
  return parseInt((loaded / container.file.size).toFixed(2))
}


const createProgressHandler = (index, item) => {
  return (e) => {
    if (e.lengthComputable) {
      item.percentage = parseInt(String((e.loaded / e.total) * 100))
    }
  }
}
// const grouped = (array, subGroupLength) => {
//   let index = 0;
//   let newArray = [];
//   while (index < array.length) {
//     newArray.push(array.slice(index, index += subGroupLength));
//   }
//   return newArray;
// }
const fileChange = async (mdata) => {
  container.file = mdata.raw
  if (!/\d+.\d+.\d+/.exec(mdata.raw.name)) {
    ElMessageBox.alert('上传的ipa必需带版本号', '错误', {
      confirmButtonText: 'OK',
      callback: (action) => {
      },
    })
    return
  }
  const fileChunkList = createFileChunk(mdata.raw)
  container.hash = await createChunkListHash(fileChunkList)
  const verifyData = await verifyFile(container.file.name, container.hash)
  if (!verifyData.shouldUpload) {
    console.log('服务器已有上传文件，秒传成功', verifyData)
    percentage.value = 100
    data.version = {
      ...data.version,
      file: verifyData.file.url,
      size: verifyData.file.size
    }
    container.uploaded = true
    return
  }
  const uploadChunks = fileChunkList.map(({file}, index) => ({
    fileHash: container.hash,
    index,
    hash: `${container.hash}-${index}`,
    chunk: file,
    size: file.size,
    percentage: verifyData.uploadedList.includes(index) ? 100 : 0,
  }))
  chunkData.value = uploadChunks

  container.interval = setInterval(() => {
    percentage.value = uploadPercentage()
    if (percentage.value >= 100) {
      clearInterval(container.interval)
    }
  }, 200)

  //过滤已经上传的切片
  const requestList = uploadChunks
      .filter(({hash}) => !verifyData.uploadedList.includes(hash))
      .map(({chunk, hash, index}) => {
        const formData = new FormData()
        // 切片文件
        formData.append('chunk', chunk)
        // 切片文件hash
        formData.append('hash', hash)
        // 大文件的文件名
        formData.append('filename', container.file.name)
        // 大文件hash
        formData.append('fileHash', container.hash)
        return {formData, index}
      })
      .map(({formData, index}) => {
        return request({
          url: `${import.meta.env.VITE_API_HOST}/file/upload/bigfile`,
          data: formData,
          onProgress: createProgressHandler(index, uploadChunks[index]),
          requestList: [],
        })
      })

  await Promise.all(requestList)

  if (verifyData.uploadedList.length + requestList.length === uploadChunks.length) {
    console.log('文件合并')
    mergeBigFile(container.file.name, container.hash, FILE_BATCH_SIZE)
        .then(result => {
          container.uploaded = true
          data.version.file = result.url
          data.version.size = result.size
        })
    // setTimeout(async () => {
    //   await deleteBigFile(container.file.name, container.hash)
    // }, 1000)
  }
}
const hashHref = new URL('../assets/static/js/hash.js', import.meta.url).href
const createChunkListHash = (fileChunkList) => {
  return new Promise((resolve) => {
    container.worker = new Worker(hashHref)
    container.worker.postMessage({fileChunkList})
    container.worker.onmessage = (e) => {
      const {percentage, hash} = e.data
      hashPercentage.value = parseInt(percentage.toFixed(2))
      if (hash) {
        resolve(hash)
      }
    }
  })
}
const mergeBigFile = (filename, fileHash, size) => {
  return new Promise((resolve, reject) => {
    return proxy.$axios.post('/file/merge/bigfile', {
      filename,
      fileHash,
      size
    })
        .then(response => {
          resolve(response.data.data)
        })
  })
}
const deleteBigFile = (filename, fileHash) => {
  return new Promise((resolve, reject) => {
    return proxy.$axios.post('/file/delete/bigfile', {
      filename,
      fileHash
    })
        .then(response => {
          resolve(response.data.data)
        })
  })
}
const verifyFile = (filename, fileHash) => {
  return proxy.$axios.post('/file/verify/bigfile', {
    filename,
    fileHash
  })
      .then(result => {
        return result.data.data
      })
}
//生成文件切片
const createFileChunk = (file, size = FILE_BATCH_SIZE) => {
  const fileChunkList = []
  let cur = 0
  while (cur < file.size) {
    fileChunkList.push({
      file: file.slice(cur, cur + size),
    })
    cur += size
  }
  return fileChunkList
}
onBeforeMount(() => {
  document.getElementById("loading").style = "display:none";
  if (appid) {
    proxy.$axios.get(`/app/keys?key=${appid}`).then(response => {
      if (response.data.data.length > 0) {
        let name = response.data.data[0].name
        proxy.$axios.get(`/version/nameinfo?name=${name}`).then(response => {
          const appInfo = response.data.data.info;
          const appVersions = response.data.data.versions;
          data.app.icon = appInfo.icon
          data.app.name = appInfo.name
          data.app.versions = appVersions
        })
      }
    })
  }
})
</script>

<style lang="scss" scoped>
.myfont {
  color: #323233;
}

.rank-box {
  margin-top: 20px;

  .rank-row {
  }
}
</style>