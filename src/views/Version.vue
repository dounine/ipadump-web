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
            <el-row :gutter="20">
              <el-col :span="6">
                <div class="grid-content ep-bg-purple"/>
                <div style="display: flex;flex-direction: row;">
                  <div>
                    <img style="width:30px;height:30px;" :src="app.info.icon"/>
                  </div>
                  <div style="line-height: 30px;height: 30px;margin-left:10px;font-weight: 500;">{{
                      app.info.name
                    }}
                  </div>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="grid-content ep-bg-purple">
                  <span style="font-size: 14px">{{ version.des }}</span>
                </div>
              </el-col>
              <el-col :span="10">
                <div class="grid-content ep-bg-purple">
                  <span style="font-size: 14px">{{ version.name }} / {{ version.size }}</span>
                </div>
              </el-col>
              <el-col :span="2">
                <div class="grid-content ep-bg-purple">
                  <el-button type="primary" :icon="Download" circle/>
                </div>
              </el-col>
            </el-row>
            <el-divider border-style="dashed"/>
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
const version = ref([])
const {proxy} = getCurrentInstance()
let appid = proxy.$route.params["appid"]
onBeforeMount(() => {
  document.getElementById("loading").style = "display:none";
  proxy.$axios.get(`/versions/${appid}`).then(response => {
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
  }
}
</style>