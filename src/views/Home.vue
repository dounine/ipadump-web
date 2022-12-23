<template>
  <el-container>
    <el-header>
      <Header/>
    </el-header>
    <el-main>
      <div>
        <el-input
            v-model="searchKey"
            placeholder="请输入app名称"
            maxlength="20"
            autofocus
            class="input-with-select"
        >
          <template #prepend>
            <el-select v-model="position" placeholder="Select" style="width: 115px">
              <el-option label="中国区" value="cn"/>
              <el-option label="香港区" disabled value="hk"/>
              <el-option label="美国区" disabled value="us"/>
            </el-select>
          </template>
          <template #append>
            <el-button @click="searchFun" :disabled="!searchKey" :icon="Search"/>
          </template>
        </el-input>
      </div>
      <div class="rank-box" v-loading="searching">
        <el-card>
          <template #header>
            <div class="card-header">
              <span v-if="!search">下载排行榜</span>
              <el-breadcrumb v-else :separator-icon="ArrowRight">
                <el-breadcrumb-item :to="{path:'/'}" @click="noSearch">首页</el-breadcrumb-item>
                <el-breadcrumb-item>搜索结果</el-breadcrumb-item>
              </el-breadcrumb>
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
                    <span style="font-size: 14px;margin-right:10px;">{{ rank.version }} / {{ Common.sizeFormat(rank.size) }}</span>
                    <el-button type="primary" size="small" :icon="ArrowRightBold" @click="chooseVersion(rank)" circle/>
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
  ArrowRightBold,
  Search,
  ArrowRight
} from '@element-plus/icons-vue'

const search = ref(false)
const searchKey = ref('')
const position = ref('cn')
const searching = ref(true)
const ranks = ref([])
const {proxy} = getCurrentInstance()
searchKey.value = proxy.$route.params["searchKey"] || ''
search.value = searchKey.value !== ''
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
  searching.value = true
  proxy.$axios.get(`/version/search?key=${searchKey.value}`).then(response => {
    searching.value = false
    ranks.value = response.data.data
  })
}

onBeforeMount(() => {
  document.getElementById("loading").style = "display:none";
  if (search.value) {
    proxy.$axios.get(`/version/search?key=${searchKey.value}`).then(response => {
      searching.value = false
      ranks.value = response.data.data
    })
  } else {
    proxy.$axios.get('/version/ranks').then(response => {
      console.log(response.data)
      ranks.value = response.data.data
      searching.value = false
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