<template>
  <el-container>
    <el-header height="80">
      <Header/>
    </el-header>
    <el-main>
      <div class="max">
        <Introd/>
        <div class="searchBox">
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
            <template #default="{ item }">
              <div class="searchItem">
                <img style="width:30px;height:30px;" :src="item.icon"/>
                <p>{{ item.value }}</p>
              </div>
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
                <div v-if="ranks.length>0">
                  <div v-for="rank in ranks" :key="rank.appid" class="rank-row"
                       @click="chooseVersion(rank)">
                    <div style="display: flex;">
                      <div
                          style="display: flex;flex-direction: row;min-width: 80px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
                        <div>
                          <img style="width:30px;height:30px;margin-top:14px;"
                               :src="rank.icon || 'https://ipadump.com/static/image/ipa.png'"/>
                        </div>
                        <div style="margin-left:10px;font-weight: 500;">{{ rank.name }}</div>
                      </div>
                      <div style="flex:1;">
                        <div style="display: flex">
                          <div
                              style="flex: 1;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;width: 190px;text-align: center;">
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
                  <el-pagination
                      @current-change="rankPageChange"
                      v-model:current-page="rankCurrentRankPage"
                      :page-size="10"
                      :page-count="parseInt(rankTotal/10)"
                      style="float:right;" layout="prev, pager, next" :total="rankTotal"/>
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
                      <div style="display: flex;flex-grow: 1;text-align: center;">
                        <div
                            style="flex: 1;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;width: 190px;text-indent: 10px">
                          <span style="font-size: 14px">{{ rank.des }}</span>
                        </div>
                        <div>
                    <span style="font-size: 14px;margin-right:10px;color:#409eff;font-weight: 500;">
                      {{ rank.versionCount }}个版本可下载
                      <!--                      {{-->
                      <!--                        rank.version-->
                      <!--                      }} / {{ Common.sizeFormat(rank.size) }}-->
                    </span>
                          <el-button type="primary" size="small" :icon="ArrowRightBold" @click="chooseVersion(rank)"
                                     circle/>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else>
                  <el-empty :image-size="40" description="搜索无结果、可以提交在线砸壳"/>
                </div>
              </el-card>
            </el-tab-pane>
            <el-tab-pane label="在线砸壳" name="dump">
              <el-card>
                <el-form status-icon ref="ruleFormRef" :model="dump" :rules="dumpRules" label-width="120px">
                  <el-form-item label="应用名称" prop="appid">
                    <el-input v-model="dump.appid" maxlength="20" placeholder="请输入应用名称"/>
                  </el-form-item>
                  <el-form-item label="版本号" prop="version">
                    <el-input v-model="dump.version" maxlength="20" placeholder="请输入版本号，例如：10.1.1"/>
                  </el-form-item>
                  <el-form-item label="通知邮箱" prop="mail">
                    <el-input v-model="dump.mail" maxlength="20" placeholder="请输入接收通知的邮箱"/>
                  </el-form-item>
                  <el-form-item>
                    <img id="captcha" ref="captchaRef" @click="changeCaptcha" src="" :loading="captchaLoading"/>
                    <a href="javascript:void(0)" @click="changeCaptcha"
                       style="text-decoration: none;color:#9cf;margin-left:20px;">换一换</a>
                  </el-form-item>
                  <el-form-item label="验证码" prop="code">
                    <el-input v-model="dump.code" maxlength="20" placeholder="请输入验证码"/>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="dumpSubmit(ruleFormRef)">
                      提交在线砸壳
                    </el-button>
                    <p style="margin-left:20px;color:#999999;">当前平均ipa平均砸壳时间为30分钟</p>
                  </el-form-item>
                </el-form>
              </el-card>
              <el-card style="margin-top:20px;">
                <template #header>
                  <div class="card-header">
                    <span>当前砸壳应用</span>
                  </div>
                </template>
                <div v-for="du in dumpList" :key="du.appid" class="rank-row">
                  <div class="dumpBox" @click="dumpClick(du)">
                    <div class="dumpAppid">{{ du.appid }}</div>
                    <div class="dumpTime">
                      {{
                        timeFormat(new Date(du.time), 'M-D h:m:s')
                      }}
                    </div>
                    <div class="dumpVersion">{{ du.version }} / <strong
                        :style="{color:dumpStatusColor(du.status)}">{{ dumpStatusFormat(du.status) }}</strong>
                    </div>
                  </div>
                </div>
                <el-pagination
                    @current-change="dumpPageChange"
                    v-model:current-page="dumpCurrentRankPage"
                    :page-size="10"
                    :page-count="parseInt(dumpTotal/10)"
                    style="float:right;" layout="prev, pager, next" :total="dumpTotal"/>
              </el-card>
            </el-tab-pane>
            <el-tab-pane label="软件源" name="store">
              <div class="storeTxt">
                <span>支持：`轻松签`、`全能签`</span>
                <span style="display: block;">说明：复制在软件源上添加即可使用</span>
              </div>
              <div class="store">
                <div class="left">https://store.ipadump.com</div>
                <div class="right">
                  <el-button :icon="DocumentCopy" circle @click="storeCopy(1)"/>
                </div>
              </div>
              <div style="color:#888888;margin-top:20px;text-indent: 10px;">
                或者
              </div>
              <div class="store">
                <div class="left">source[5GHxhb1U7Lcvi4U8sWACZcW8akxVn7cEDfM=]</div>
                <div class="right">
                  <el-button :icon="DocumentCopy" circle @click="storeCopy(2)"/>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
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
import {getCurrentInstance, onBeforeMount, ref, reactive, nextTick} from 'vue';
import {
  ArrowRightBold,
  Search,
  ArrowRight,
  DocumentCopy
} from '@element-plus/icons-vue'
import {ElMessage} from "element-plus";

const search = ref(false)
const searchKey = ref('')
const position = ref('cn')
const rankLoading = ref(true)
const searchLoading = ref(false)
const ruleFormRef = ref()
const dump = reactive({
  version: '',
  appid: '',
  mail: '',
  token: '',
  code: ''
})
const dumpRules = reactive({
  appid: [{
    required: true, message: '请输入应用名称'
  }, {
    min: 2, max: 20, message: '长度在2~20之间', trigger: 'blur'
  }],
  mail: [{
    required: true, message: '请输入邮箱'
  }, {
    validator: (rule, value, callback) => {
      let reg = /^[a-zA-Z0-9]+([-_.][A-Za-zd]+)*@([a-zA-Z0-9]+[-.])+[A-Za-zd]+$/
      if (reg.test(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的邮箱'))
      }
    }
  }],
  code: [{
    required: true, message: '请输入验证码'
  }, {
    validator: (rule, value, callback) => {
      if (value.length === 4) {
        proxy.$axios.post('/dump/captcha/valid', {
          token: dump.token,
          code: value
        }).then(response => {
          if (response.data.data) {
            callback()
          } else {
            callback(new Error('验证码错误'))
          }
        })
      } else {
        callback(new Error('请输入正确的验证码'))
      }
    },
    trigger: 'change'
  }
  ],
  version: [
    {
      required: true, message: '请输入版本号'
    },
    {
      validator: (rule, value, callback) => {
        let va = /^\d+(.\d+)+$/.test(value)
        if (va) {
          callback()
        } else {
          callback(new Error('请输入正确的版本号'))
        }
      },
      trigger: 'change'
    }
  ]
})
const dumpList = ref([])
const ranks = ref([])
const rankCurrentRankPage = ref(1)
const rankTotal = ref(0)
const dumpCurrentRankPage = ref(1)
const dumpTotal = ref(0)
const captchaLoading = ref(false)
const captchaRef = ref()
const searchs = ref([])
const {proxy} = getCurrentInstance()
const that = getCurrentInstance()
searchKey.value = proxy.$route.params["searchKey"] || ''
search.value = searchKey.value !== ''
const activeName = ref(searchKey.value ? 'search' : 'download')
const changeCaptcha = () => {
  captchaLoading.value = true
  proxy.$axios.get('/dump/captcha', {
    responseType: 'blob'
  }).then(response => {
    dump.token = response.headers['token']
    that.refs.captchaRef.src = URL.createObjectURL(response.data);
    captchaLoading.value = false
  })
}
const timeFormat = (time, format = "Y-M-D h:m:s") => {
  const formatNumber = n => `0${n}`.slice(-2);
  const date = new Date(time);
  const formatList = ["Y", "M", "D", "h", "m", "s"];
  const resultList = [];
  resultList.push(date.getFullYear().toString());
  resultList.push(formatNumber(date.getMonth() + 1));
  resultList.push(formatNumber(date.getDate()));
  resultList.push(formatNumber(date.getHours()));
  resultList.push(formatNumber(date.getMinutes()));
  resultList.push(formatNumber(date.getSeconds()));
  for (let i = 0; i < resultList.length; i++) {
    format = format.replace(formatList[i], resultList[i]);
  }
  return format;
}
const rankPageChange = (offset) => {
  rankLoading.value = true
  proxy.$axios.get('/version/ranks', {
    params: {
      offset: (offset - 1) * 10,
      limit: 10
    }
  }).then(response => {
    ranks.value = response.data.data.list
    rankTotal.value = response.data.data.total
    rankLoading.value = false
  })
}
const dumpPageChange = (offset) => {
  proxy.$axios.get('/dump/infos', {
    params: {
      offset: (offset - 1) * 10,
      limit: 10
    }
  }).then(response => {
    dumpList.value = response.data.data.list
    dumpTotal.value = response.data.data.total
  })
}
const tabClick = (tab) => {
  let tabName = tab.props.name
  if (tabName === 'download') {
    rankLoading.value = true
    proxy.$axios.get('/version/ranks').then(response => {
      ranks.value = response.data.data.list
      rankTotal.value = response.data.data.total
      rankLoading.value = false
    })
  } else if (tabName === 'dump') {
    changeCaptcha()
    proxy.$axios.get('/dump/infos').then(response => {
      dumpList.value = response.data.data.list
      dumpTotal.value = response.data.data.total
    })
  }
}
const storeCopy = (type) => {
  const save = function (e) {
    e.clipboardData.setData('text/plain', type === 1 ? 'https://store.ipadump.com' : 'source[5GHxhb1U7Lcvi4U8sWACZcW8akxVn7cEDfM=]')
    e.preventDefault() // 阻止默认行为
  }
  document.addEventListener('copy', save) // 添加一个copy事件
  document.execCommand('copy') // 执行copy方法
  ElMessage({
    message: '复制成功',
    type: 'success',
  })
}
const dumpStatusColor = (status) => {
  if (status === 1) {
    return 'green'
  } else if (status === 2) {
    return '#ccc'
  } else if (status === 3) {
    return 'red'
  }
  return 'black'
}
const dumpStatusFormat = (status) => {
  if (status === 0) {
    return '处理中'
  } else if (status === 1) {
    return '砸壳中'
  } else if (status === 2) {
    return '完成'
  } else if (status === 3) {
    return '不可砸'
  }
  return '未知'
}
const dumpClick = (du) => {
  if (du.status === 2) {
    proxy.$router.push({
      path: `/versions/${du.appid}`
      , query: {
        version: du.version
      }
    })
  }
}
const chooseVersion = (rank) => {
  proxy.$router.push({
    path: `/versions/${rank.appid}`, query: {
      version: rank.version
    }
  })
}
const searchFun = () => {
  search.value = true
  proxy.$router.push(`/search/${searchKey.value}`)
  rankLoading.value = true
  activeName.value = 'search'
  proxy.$axios.get(`/version/search`, {
    params: {
      key: searchKey.value
    }
  }).then(response => {
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
  proxy.$axios.get(`/version/search`, {
    params: {
      key: item.value
    }
  }).then(response => {
    rankLoading.value = false
    searchs.value = response.data.data
  })
}
const querySearchAsync = (queryString: string, cb: (arg: any) => void) => {
  proxy.$axios.get(`/app/keys`, {
    params: {
      key: queryString || ''
    }
  }).then(response => {
    cb(response.data.data.map(item => {
      return {
        value: item.name,
        icon: item.icon || 'https://ipadump.com/static/image/ipa.png'
      }
    }))
  })
}
const dumpSubmit = (form) => {
  form.validate((valid, fields) => {
    if (valid) {
      proxy.$axios.get(`/version/info`, {
        params: {
          appid: dump.appid,
          version: dump.version
        }
      }).then(versionResponse => {
        if (versionResponse.data.data) {
          ElMessage({
            message: '您需要砸壳的应用版本已存在，3秒后跳转到下载页面',
            type: 'warning',
          })
          setTimeout(() => {
            proxy.$router.push({
              path: `/versions/${dump.appid}`, query: {
                version: dump.version
              }
            })
          }, 3000)
        } else {
          proxy.$axios.post(`/dump/addOrUpdate`, dump).then(response => {
            proxy.$axios.get('/dump/infos').then(response => {
              if (response.data.code === 0) {
                ElMessage({
                  message: '提交成功、请等待砸壳',
                  type: 'success',
                })
                dumpList.value = response.data.data
                dump.appid = ''
                dump.version = ''
                dump.token = ''
                dump.code = ''
                dump.mail = ''
                changeCaptcha()
              } else {
                ElMessage({
                  message: response.data.msg,
                  type: 'warning',
                })
              }
            })
          })
        }
      })

    } else {
      ElMessage({
        message: '请检查参数',
        type: 'warning',
      })
    }
  })
}
const getBase64 = (url, callback) => {
  let Img = new Image(),
      dataURL = '';
  Img.src = url
  Img.setAttribute('crossOrigin', 'Anonymous');
  Img.onload = function () {
    var canvas = document.createElement('canvas'),
        width = Img.width,
        height = Img.height;
    canvas.width = width;
    canvas.height = height;
    canvas.getContext('2d').drawImage(Img, 0, 0, width, height);
    dataURL = canvas.toDataURL('image/jpeg');
    return callback ? callback(dataURL) : null;
  };
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
  access()
  if (search.value) {
    proxy.$axios.get(`/version/search`, {
      params: {
        key: searchKey.value
      }
    }).then(response => {
      rankLoading.value = false
      searchs.value = response.data.data
      searchLoading.value = false
    })
  } else {
    proxy.$axios.get('/version/ranks').then(response => {
      ranks.value = response.data.data.list
      rankTotal.value = response.data.data.total
      rankLoading.value = false
    })
  }
})
</script>

<style lang="scss" scoped>
.searchItem {
  display: flex;
  padding-top: 6px;

  p {
    text-indent: 10px;
  }
}

.max {
  max-width: 1140px;
  margin: 0 auto;
}

.searchBox {
  margin: 30px 0;
}

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

.storeTxt {
  font-size: 14px;
  color: #42b983;
  text-indent: 10px;
  padding: 10px 0;
}

.store {
  margin-top: 20px;
  border-radius: 6px;
  height: 50px;
  line-height: 50px;
  text-indent: 10px;
  background-color: rgba(245, 247, 249, 1.00);
  color: rgba(130, 80, 223, 1.00);
  display: flex;

  .left {
    flex: 1;
  }

  .right {
    margin-right: 10px;
  }
}

.dumpBox {
  display: flex;

  .dumpAppid {
    margin-left: 10px;
    font-weight: 500;
  }

  .dumpTime {
    flex-grow: 1;
    text-align: center;
    font-size: 14px;
    color: #888888;
  }

  .dumpVersion {
    font-size: 14px;
    margin-right: 10px;
  }
}
</style>