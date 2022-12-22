<template>
  <el-main>
    <el-form :model="data" label-width="70px">
      <el-form-item label="应用id">
        <el-col :span="4">
          <el-input v-model="data.appid"/>
        </el-col>
        <el-col :span="11">
          <el-button :icon="Refresh">生成</el-button>
        </el-col>
      </el-form-item>
      <el-form-item label="应用名称">
        <el-input v-model="data.name"/>
      </el-form-item>
      <el-form-item label="应用版本">
        <el-col :span="4">
          <el-select
              v-model="data.version"
              multiple
              filterable
              allow-create
              default-first-option
              :reserve-keyword="false"
              placeholder="请选择或者输入版本"
          >
            <el-option
                v-for="item in data.versions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="11">
          <el-button :icon="Delete">数据库删除此版本</el-button>
        </el-col>
      </el-form-item>
      <el-form-item label="ipa文件">
        <el-upload
            ref="upload"
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
          <el-progress :percentage="hashPercentage" color="#f56c6c">
            hash
          </el-progress>
          <el-progress :percentage="percentage">
            上传
          </el-progress>
        </el-upload>
      </el-form-item>
      <el-form-item label="版本发布">
        <el-switch v-model="data.delivery"/>
      </el-form-item>
      <el-form-item label="版本描述">
        <el-input v-model="data.desc" type="textarea"/>
      </el-form-item>
      <el-form-item label="应用描述">
        <el-input v-model="data.desc" type="textarea"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Create</el-button>
        <el-button>Cancel</el-button>
      </el-form-item>
    </el-form>
  </el-main>
</template>

<script lang="ts" setup>
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
import {getCurrentInstance, onBeforeMount, ref, watch, computed} from 'vue';
import {genFileId} from 'element-plus'
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

const percentage = ref(0)
const hashPercentage = ref(0)
const chunkData = ref([])
const container = reactive({
  file: null,
  hash: '',
  worker: null,
  interval: null
})

const data = reactive({
  appid: '',
  name: '',
  region: '',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: '',
  version: '',
  versions: []
})

const onSubmit = () => {
  console.log('submit!')
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
const grouped = (array, subGroupLength) => {
  let index = 0;
  let newArray = [];
  while (index < array.length) {
    newArray.push(array.slice(index, index += subGroupLength));
  }
  return newArray;
}
const fileChange = async (data) => {
  container.file = data.raw
  const fileChunkList = createFileChunk(data.raw)
  container.hash = await createChunkListHash(fileChunkList)
  const {shouldUpload, uploadedList} = await verifyFile(container.file.name, container.hash)
  if (!shouldUpload) {
    console.log('服务器已有上传文件，秒传成功')
    percentage.value = 100
    return
  }
  const uploadChunks = fileChunkList.map(({file}, index) => ({
    fileHash: container.hash,
    index,
    hash: `${container.hash}-${index}`,
    chunk: file,
    size: file.size,
    percentage: uploadedList.includes(index) ? 100 : 0,
  }))
  chunkData.value = uploadChunks

  container.interval = setInterval(() => {
    percentage.value = uploadPercentage()
    if (percentage.value >= 100) {
      clearInterval(container.interval)
    }
  }, 1000)

  //过滤已经上传的切片
  const requestList = uploadChunks
      .filter(({hash}) => !uploadedList.includes(hash))
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

  if (uploadedList.length + requestList.length === uploadChunks.length) {
    console.log('文件合并')
    await mergeBigFile(container.file.name, container.hash, FILE_BATCH_SIZE)
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
  return new Promise((resolve, reject) => {
    proxy.$axios.post('/file/verify/bigfile', {
      filename,
      fileHash
    }).then(response => {
      resolve(response.data.data)
    })
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