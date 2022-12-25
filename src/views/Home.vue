<template>
  <el-container>
    <el-header>
      <Header/>
    </el-header>
    <el-main>
      <div>
        <el-autocomplete
            style="width:100%"
            size="large"
            v-model="searchKey"
            :fetch-suggestions="querySearchAsync"
            @select="handleSelect"
            placeholder="请输入app名称"
            maxlength="20"
            class="input-with-select"
        >
          <template #prepend>
            <el-select size="large" v-model="position" placeholder="Select" style="width: 115px">
              <el-option label="中国区" value="cn"/>
              <el-option label="香港区" disabled value="hk"/>
              <el-option label="美国区" disabled value="us"/>
            </el-select>
          </template>
          <template #append>
            <el-button size="large" @click="searchFun" :disabled="!searchKey" :icon="Search"/>
          </template>
        </el-autocomplete>
      </div>
      <div class="rank-box">
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="tabClick">
          <el-tab-pane label="下载排行" name="download">
            <el-card v-loading="rankLoading">
              <template #header>
                <div class="card-header">
                  <span>下载排行榜</span>
                </div>
              </template>
              <div v-if="ranks.length>0" v-for="rank in ranks" :key="rank.appid" class="rank-row"
                   @click="chooseVersion(rank)">
                <div style="display: flex;">
                  <div
                      style="display: flex;flex-direction: row;min-width: 80px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
                    <div>
                      <img style="width:30px;height:30px;margin-top:14px;" :src="rank.icon"/>
                    </div>
                    <div style="margin-left:10px;font-weight: 500;">{{ rank.name }}</div>
                  </div>
                  <div style="flex:1;">
                    <div style="display: flex">
                      <div style="flex: 1;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;width: 190px;">
                        <span style="font-size: 14px">{{ rank.des }}</span>
                      </div>
                      <div>
                    <span style="font-size: 14px;margin-right:10px;">{{
                        rank.version
                      }} / {{ Common.sizeFormat(rank.size) }}</span>
                        <el-button type="primary" size="small" :icon="ArrowRightBold" @click="chooseVersion(rank)"
                                   circle/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else>
                <el-empty :image-size="40" description="没有数据"/>
              </div>
            </el-card>
          </el-tab-pane>
          <el-tab-pane label="搜索" :disabled="!search" name="search">
            <el-card v-loading="searchLoading">
              <template #header>
                <div class="card-header">
                  <span>搜索结果</span>
                </div>
              </template>
              <div v-if="searchs.length>0" v-for="rank in searchs" :key="rank.appid" class="rank-row"
                   @click="chooseVersion(rank)">
                <div style="display: flex;">
                  <div
                      style="display: flex;flex-direction: row;min-width: 80px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
                    <div>
                      <img style="width:30px;height:30px;margin-top:14px;" :src="rank.icon"/>
                    </div>
                    <div style="margin-left:10px;font-weight: 500;">{{ rank.name }}</div>
                  </div>
                  <div style="flex:1;">
                    <div style="display: flex">
                      <div style="flex: 1;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;width: 190px;">
                        <span style="font-size: 14px">{{ rank.des }}</span>
                      </div>
                      <div>
                    <span style="font-size: 14px;margin-right:10px;">{{
                        rank.version
                      }} / {{ Common.sizeFormat(rank.size) }}</span>
                        <el-button type="primary" size="small" :icon="ArrowRightBold" @click="chooseVersion(rank)"
                                   circle/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else>
                <el-empty :image-size="40" description="搜索无结果、可以申请在线砸壳"/>
              </div>
            </el-card>
          </el-tab-pane>
          <el-tab-pane label="在线砸壳" name="dump">
            <el-card>
              <el-form :model="dump" label-width="120px">
                <el-form-item label="应用名称">
                  <el-input v-model="dump.appid" maxlength="20" placeholder="请输入应用名称"/>
                </el-form-item>
                <el-form-item label="版本号">
                  <el-input v-model="dump.version" maxlength="20" placeholder="默认最新版本"/>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" :disabled="!dump.appid||!dump.version" @click="dumpSubmit">申请在线砸壳
                  </el-button>
                </el-form-item>
              </el-form>
            </el-card>
            <el-card style="margin-top:20px;">
              <template #header>
                <div class="card-header">
                  <span>在线砸壳列表</span>
                </div>
              </template>
              <div v-for="du in dumpList" :key="du.appid" class="rank-row">
                <div style="display: flex;">
                  <div style="flex:1;margin-left:10px;font-weight: 500;">{{ du.appid }}</div>
                  <div style="font-size: 14px;margin-right:10px;">{{
                      du.version
                    }} / {{ du.count }} / <strong>{{ dumpStatusFormat(du.status) }}</strong>
                  </div>
                </div>
              </div>
            </el-card>
          </el-tab-pane>
        </el-tabs>
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
import {getCurrentInstance, onBeforeMount, ref, reactive} from 'vue';
import {
  ArrowRightBold,
  Search,
  ArrowRight
} from '@element-plus/icons-vue'

const search = ref(false)
const searchKey = ref('')
const position = ref('cn')
const rankLoading = ref(true)
const searchLoading = ref(false)
const dump = reactive({
  version: '',
  appid: '',
})
const dumpList = ref([])
const ranks = ref([])
const searchs = ref([])
const {proxy} = getCurrentInstance()
searchKey.value = proxy.$route.params["searchKey"] || ''
search.value = searchKey.value !== ''
const activeName = ref(searchKey.value ? 'search' : 'download')
const tabClick = (tab) => {
  let tabName = tab.props.name
  if (tabName === 'download') {
    rankLoading.value = true
    proxy.$axios.get('/version/ranks').then(response => {
      ranks.value = response.data.data
      rankLoading.value = false
    })
  } else if (tabName === 'dump') {
    proxy.$axios.get('/dump/infos').then(response => {
      dumpList.value = response.data.data
    })
  }
}
const dumpStatusFormat = (status) => {
  if (status === 0) {
    return '申请中'
  } else if (status === 1) {
    return '砸壳中'
  } else if (status === 2) {
    return '不可砸壳'
  } else if (status === 3) {
    return '完成'
  }
  return '未知'
}
const chooseVersion = (rank) => {
  proxy.$router.push(`/versions/${rank.appid}`)
}
const noSearch = () => {
  search.value = false
  proxy.$axios.get('/version/ranks').then(response => {
    ranks.value = response.data.data
  })
}
const searchFun = () => {
  search.value = true
  proxy.$router.push(`/search/${searchKey.value}`)
  rankLoading.value = true
  activeName.value = 'search'
  proxy.$axios.get(`/version/search?key=${searchKey.value}`).then(response => {
    rankLoading.value = false
    searchs.value = response.data.data
    searchLoading.value = false
  })
}
const handleSelect = (item) => {
  rankLoading.value = true
  search.value = item.value
  proxy.$router.push(`/search/${item.value}`)
  activeName.value = 'search'
  proxy.$axios.get(`/version/search?key=${item.value}`).then(response => {
    rankLoading.value = false
    searchs.value = response.data.data
  })
}
const querySearchAsync = (queryString: string, cb: (arg: any) => void) => {
  proxy.$axios.get(`/app/keys?key=${queryString || ''}`).then(response => {
    cb(response.data.data.map(item => {
      return {
        value: item.name,
        link: item.name
      }
    }))
  })
}
const dumpSubmit = () => {
  if (dump.appid && dump.version) {
    proxy.$axios.post(`/dump/addOrUpdate`, dump).then(response => {
      proxy.$axios.get('/dump/infos').then(response => {
        dumpList.value = response.data.data
        dump.value = {
          appid: '',
          version: ''
        }
      })
    })
  }
}
onBeforeMount(() => {
  document.getElementById("loading").style = "display:none";
  if (search.value) {
    proxy.$axios.get(`/version/search?key=${searchKey.value}`).then(response => {
      rankLoading.value = false
      searchs.value = response.data.data
      searchLoading.value = false
    })
  } else {
    proxy.$axios.get('/version/ranks').then(response => {
      ranks.value = response.data.data
      rankLoading.value = false
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
    height: 60px;
    line-height: 60px;
    border-bottom: 1px dashed #cccccc;
  }

  .rank-row:hover {
    cursor: pointer;
    opacity: 0.8;
    color: #409eff;
    //background-color: #cccccc;
  }
}
</style>