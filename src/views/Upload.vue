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
            action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
            :limit="1"
            :on-exceed="handleExceed"
            :auto-upload="false"
        >
          <template #trigger>
            <el-button type="primary">选择ipa</el-button>
          </template>
          <el-button class="ml-3" type="success" @click="submitUpload">
            上传
          </el-button>
          <template #tip>
            <div class="el-upload__tip text-red">
              限制上传单个文件，超出覆盖旧的
            </div>
          </template>
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
import {getCurrentInstance, onBeforeMount, ref} from 'vue';
import { genFileId } from 'element-plus'
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus'
const upload = ref<UploadInstance>()

const handleExceed: UploadProps['onExceed'] = (files) => {
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload.value!.handleStart(file)
}

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