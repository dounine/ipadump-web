<template>
  <el-container>
    <el-header height="80">
      <Header/>
    </el-header>
    <el-main>
      <div class="max">
        <introd/>
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
            <div v-if="app.versions.length>0">
              <div v-for="version in app.versions" :key="version.name" class="rank-row">
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
                      <div
                          style="flex: 1;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;width: 190px;text-align: center;">
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
              <el-pagination
                  @current-change="pageChange"
                  v-model:current-page="currentRankPage"
                  :page-size="10"
                  :page-count="parseInt(app.total/10)"
                  style="float:right;" layout="prev, pager, next" :total="app.total"/>

            </div>
            <div v-else>
              <el-empty :image-size="100" description="没有数据"/>
            </div>
          </el-card>
        </div>
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
import Introd from '../components/Introd.vue';
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
  versions: [],
  total: 0
})
const version = ref([])
const currentRankPage = ref(1)
const {proxy} = getCurrentInstance()
let appid = proxy.$route.params["appid"]
const downloadFun = (version) => {
  window.location.href = version.file
}
const pageChange = (offset) => {
  proxy.$axios.get(`/version/infos/${appid}`, {
    params: {
      offset: (offset - 1) * 10,
      limit: 10
    }
  }).then(response => {
    app.value = response.data.data
  })
  proxy.$axios.get('/version/ranks', {
    params: {
      offset: (offset - 1) * 10,
      limit: 10
    }
  }).then(response => {
    app.value = response.data.data
  })
}
onBeforeMount(() => {
  document.getElementById("loading").style = "display:none";
  proxy.$axios.get(`/version/infos/${appid}`, {
    params: {
      offset: 0,
      limit: 10
    }
  }).then(response => {
    app.value = response.data.data
  })
})
</script>

<style lang="scss" scoped>
.myfont {
  color: #323233;
}

.max {
  max-width: 1140px;
  margin: 0 auto;
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