<template>
  <el-container>
    <el-header>
      <Header/>
    </el-header>
    <el-main>
      <div class="rank-box">
        <el-card>
          <template #header>
            <div class="card-header">
              <el-breadcrumb :separator-icon="ArrowRight">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>{{ app.info.name }}历史版本</el-breadcrumb-item>
              </el-breadcrumb>
            </div>
          </template>
          <div v-if="app.versions.length>0" v-for="version in app.versions" :key="version.name" class="rank-row">
            <div style="display: flex;">
              <div
                  style="display: flex;flex-direction: row;min-width: 80px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
                <div>
                  <img style="width:30px;height:30px;margin-top:14px;" :src="app.info.icon"/>
                </div>
                <div style="margin-left:10px;font-weight: 500;">{{ app.info.name }}</div>
              </div>
              <div style="flex:1;">
                <div style="display: flex">
                  <div style="flex: 1;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;width: 190px;">
                    <span style="font-size: 14px">{{ version.des }}</span>
                  </div>
                  <div>
                    <span style="font-size: 14px;margin-right:10px;">{{
                        version.name
                      }} / {{ Common.sizeFormat(version.size) }}</span>
                    <el-button type="primary" @click="downloadFun(version)" size="small" :icon="Download" circle/>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            <el-empty :image-size="100" description="没有数据"/>
          </div>
        </el-card>
      </div>
    </el-main>
    <el-footer>
      <Footer/>
    </el-footer>
  </el-container>
</template>

<script lang="ts" setup>
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
import Common from '../util/common'
import {getCurrentInstance, onBeforeMount, ref} from 'vue';
import {
  Download,
  ArrowRight
} from '@element-plus/icons-vue'

const app = ref({
  info: {
    name: ''
  },
  versions: []
})
const hh = ref('')
const version = ref([])
const {proxy} = getCurrentInstance()
let appid = proxy.$route.params["appid"]
const downloadFun = (version) => {
  window.location.href = version.file
}
onBeforeMount(() => {
  document.getElementById("loading").style = "display:none";
  proxy.$axios.get(`/version/infos/${appid}`).then(response => {
    app.value = response.data.data
  })
})
</script>

<style lang="scss" scoped>
.myfont {
  color: #323233;
}

.rank-box {
  margin-top: 20px;

  .rank-row {
    height: 60px;
    line-height: 60px;
    border-bottom: 1px dashed #cccccc;
  }

  .rank-row:hover {
    //cursor: pointer;
    opacity: 0.8;
    color: #409eff;
    //background-color: #cccccc;
  }
}
</style>