<template>
  <el-container>
    <Header/>
    <el-main style="padding: 4px;">
      <div class="max">
        <div>
          <el-dialog v-model="dialogVisible" title="下载提示" width="80%" center>
    <span style="text-align: center;display: flex;justify-content: center;">
      不支持QQ或微信内置浏览器下载，请复制链接到Safari浏览器或者其它浏览器上下载。
    </span>
            <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogVisible = false">
          确定
        </el-button>
      </span>
            </template>
          </el-dialog>
        </div>
        <introd/>
        <div class="rank-box">
          <el-card v-loading="loading">
            <template #header>
              <div class="card-header" style="display: flex;">
                <div style="display: flex;align-items:center;">
                  <img style="width:30px;height:30px;border-radius: 4px;"
                       :src="app.info.icon || 'https://ipadump.com/static/image/ipa.png'"/>
                </div>
                <div
                    style="text-indent: 6px;white-space: nowrap;font-weight: 500;display: flex;align-items:center;">
                  {{ app.info.name }}
                </div>
                <div style="display: flex;align-items:center;color:#cccccc;padding:0 10px;">
                  /
                </div>
                <div style="display: flex;align-items:center;">
                  <span style="color:#888888;">{{ app.info.des }}</span>
                </div>
              </div>
            </template>
            <div v-if="app.versions.length>0">
              <div @click="downloadFun(v)" v-for="v in app.versions" :key="v.name"
                   :class="'rank-row'+(version===v.name?' version-select':'')">
                <div
                    style="display: flex;">
                  <div style="display: flex;align-items:center;">
                    <svg t="1673322712104" class="icon" viewBox="0 0 1024 1024" version="1.1"
                         xmlns="http://www.w3.org/2000/svg" p-id="13648" width="20" height="20">
                      <path
                          d="M287.7 958.6c-61.7 0-111.8-50.2-111.8-111.8v-671c0-61.7 50.2-111.8 111.8-111.8h261c20.6 0 37.3 16.7 37.3 37.3s-16.7 37.3-37.3 37.3h-261c-20.6 0-37.3 16.7-37.3 37.3v671c0 20.5 16.7 37.3 37.3 37.3 20.6 0 37.3 16.7 37.3 37.3 0 20.4-16.7 37.1-37.3 37.1M735.1 958.6H436.8c-20.6 0-37.3-16.7-37.3-37.3 0-20.6 16.7-37.3 37.3-37.3h298.3c20.6 0 37.3-16.7 37.3-37.3V362.1c0-20.6 16.7-37.3 37.3-37.3 20.6 0 37.3 16.7 37.3 37.3v484.6c-0.1 61.7-50.3 111.9-111.9 111.9"
                          fill="#8a8a8a" p-id="13649"></path>
                      <path
                          d="M809.6 399.4H623.2c-61.7 0-111.8-50.1-111.8-111.8V101.1c0-15.1 9.1-28.7 23-34.4 14-5.7 30-2.6 40.6 8.1l261 261c10.7 10.7 13.9 26.7 8.1 40.6-5.8 13.9-19.4 23-34.5 23M586 191.1v96.4c0 20.5 16.7 37.3 37.3 37.3h96.4L586 191.1zM623.2 697.6c0 20.6-16.7 37.3-37.3 37.3H362.3c-20.6 0-37.3-16.7-37.3-37.3 0-20.6 16.7-37.3 37.3-37.3H586c20.5 0 37.2 16.7 37.2 37.3M697.8 548.5c0 20.6-16.7 37.3-37.3 37.3H362.3c-20.6 0-37.3-16.7-37.3-37.3 0-20.6 16.7-37.3 37.3-37.3h298.2c20.6 0 37.3 16.7 37.3 37.3"
                          fill="#8a8a8a" p-id="13650"></path>
                    </svg>
                  </div>
                  <div
                      style="text-indent: 6px;white-space: nowrap;font-weight: 500;display: flex;align-items:center;">
                    版本 {{ v.name }}
                    <svg v-if="v.official" t="1673316022939" class="icon" viewBox="0 0 1024 1024" version="1.1"
                         xmlns="http://www.w3.org/2000/svg" p-id="6685" width="16" height="16">
                      <path
                          d="M512 63.2L160.8 226.4v244.8c0 226.4 149.6 437.6 351.2 489.6 201.6-51.2 351.2-263.2 351.2-489.6V226.4L512 63.2z m-8 574.4l-45.6 45.6-45.6-45.6-90.4-90.4 45.6-45.6L458.4 592l204-204 45.6 45.6L504 637.6z"
                          p-id="6686" fill="#1afa29"></path>
                    </svg>
                    <svg v-else t="1673321595392" class="icon" viewBox="0 0 1024 1024" version="1.1"
                         xmlns="http://www.w3.org/2000/svg" p-id="9487" width="16" height="16">
                      <path
                          d="M865.004 167.069c-10.794-9.687-24.91-15.085-39.579-15.085-1.383 0-2.629 0-4.013 0.139-0.831 0.139-10.102 0.692-24.771 0.692-24.218 0-71.408-1.522-116.107-12.178-57.708-13.7-124.411-77.083-143.785-89.675-9.687-6.227-21.034-9.41-32.244-9.41-11.21 0-22.42 3.182-32.244 9.41-2.353 1.522-72.1 73.484-140.324 89.675-44.699 10.655-92.72 12.178-116.938 12.178-14.53 0-23.941-0.554-24.771-0.692-1.246-0.139-2.629-0.139-3.875-0.139-14.67 0-28.924 5.396-39.717 15.085-11.763 10.655-18.405 25.325-18.405 40.825v140.048c0 517.846 351.089 584.411 366.034 587.040 3.46 0.554 6.782 0.831 10.241 0.831 3.46 0 6.918-0.276 10.241-0.831 14.946-2.629 368.663-69.33 368.663-587.040v-139.911c0.139-15.5-6.642-30.446-18.405-40.962v0zM825.425 348.080c0 476.883-320.783 531.961-320.783 531.961s-318.291-55.078-318.291-531.961v-140.048c0 0 10.933 0.831 28.785 0.831 30.446 0 81.648-2.214 130.777-13.839 80.403-19.098 158.731-97.564 158.731-97.564s81.787 78.466 162.19 97.564c49.129 11.625 99.501 13.839 129.946 13.839 17.714 0 28.785-0.831 28.785-0.831l-0.139 140.048zM463.405 491.173z"
                          p-id="9488" fill="#9cf"></path>
                      <path
                          d="M349.925 603.958l66.841-15.085c10.102 54.663 40.962 81.925 92.72 81.925 57.43-1.383 87.045-29.476 88.429-84.14 0-50.373-35.289-75.421-105.728-75.421-17.299 0-30.998 0-40.962 0v-51.757c10.102 0 20.757 0 32.382 0 66.149 0 99.916-25.187 101.3-75.421-1.383-45.945-26.571-69.747-75.421-71.132-48.85 0-77.635 26.571-86.215 79.85l-64.766-15.085c18.683-76.252 70.438-114.308 155.27-114.308 87.738 2.906 134.373 40.962 140.187 114.308-1.383 53.279-30.998 87.738-88.429 103.514 63.244 13.008 97.009 49.542 101.3 110.019-4.29 81.925-56.878 124.411-157.486 127.316-87.461 1.246-140.739-36.811-159.422-114.585z"
                          p-id="9489" fill="#9cf"></path>
                    </svg>
                  </div>
                </div>
                <div style="flex:1;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
                  <div style="display: flex">
                    <div
                        style="flex: 1;text-align: center;">
                      <span style="font-size: 14px">{{ v.des }}</span>
                    </div>

                    <div>
                      <span style="font-size: 14px;">{{ Common.sizeFormat(v.size) }}</span>
                    </div>
                    <div style="display: flex;align-items:center;justify-content: center;margin-left:4px;">
                      <el-icon :color="version===v.name?'#67c23a':'black'">
                        <Download/>
                      </el-icon>
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
import Common from '../util/common';
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
const currentRankPage = ref(1)
const loading = ref(true)
const {proxy} = getCurrentInstance()
const dialogVisible = ref(false)
let {appid} = proxy.$route.params
let {version} = proxy.$route.query
const downloadFun = (v) => {
  let userAgent = window.navigator.userAgent;
  let inWeChat = userAgent.indexOf('MicroMessenger');
  let iosBrowser = userAgent.indexOf('QBWebView');
  let netType = userAgent.indexOf('netType');
  let isIosQQ = (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent) && /sQQ/i.test(navigator.userAgent));
  if (inWeChat > -1 || isIosQQ || iosBrowser > -1 || netType > -1) {
    dialogVisible.value = true
    return false
  }
  window.location.href = v.file
}
const pageChange = (offset) => {
  loading.value = true
  proxy.$axios.get(`/version/infos/${appid}`, {
    params: {
      offset: (offset - 1) * 10,
      limit: 10
    }
  }).then(response => {
    loading.value = false
    app.value = response.data.data
  })
}
const access = () => {
  let count = localStorage.getItem('access') || '1'
  proxy.$axios.get(`/user/access`, {
    params: {
      count,
      tag: localStorage.getItem('tag') || ''
    }
  }).then(res => {
    localStorage.setItem('access', (parseInt(count) + 1) + '')
    console.log('access', res.data)
  })
}
onBeforeMount(() => {
  document.getElementById("loading").style = "display:none";
  pageChange(1)
  access()
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
    display: flex;
    align-items: center;
    cursor: pointer;
    //line-height: 60px;
    border-bottom: 1px dashed #cccccc;
  }

  .rank-row:hover {
    //cursor: pointer;
    opacity: 0.8;
    color: #409eff;
    //background-color: #cccccc;
  }
}

.version-select {
  color: #67c23a;
}
</style>