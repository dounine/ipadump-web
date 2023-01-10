<template>
  <el-container>
    <Header/>
    <el-main style="padding: 4px;">
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
            <!--            <template #prepend>-->
            <!--              <el-select size="large" v-model="position" placeholder="Select" style="width: 115px">-->
            <!--                <el-option label="中国区" value="cn"/>-->
            <!--                <el-option label="香港区" disabled value="hk"/>-->
            <!--                <el-option label="美国区" disabled value="us"/>-->
            <!--              </el-select>-->
            <!--            </template>-->
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
                    <div
                        style="display: flex;">
                      <div style="display: flex;align-items:center;">
                        <img style="width:30px;height:30px;border-radius: 4px;"
                             :src="rank.icon || 'https://ipadump.com/static/image/ipa.png'"/>
                      </div>
                      <div
                          style="text-indent: 6px;white-space: nowrap;font-weight: 500;display: flex;align-items:center;">
                        {{ rank.name }}
                        <svg v-if="rank.official" t="1673316022939" class="icon" viewBox="0 0 1024 1024" version="1.1"
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
                    <div style="flex: 1;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
                      <div style="display: flex">
                        <div style="flex: 1;text-align: center;">
                            <span
                                style="font-size: 14px;">{{
                                rank.des
                              }}</span>
                        </div>
                        <div>
                    <span style="font-size: 14px;">{{
                        rank.version
                      }} / {{ Common.sizeFormat(rank.size) }}</span>
                        </div>
                        <div style="display: flex;align-items:center;justify-content: center;">
                          <el-icon color="#cccccc">
                            <ArrowRightBold/>
                          </el-icon>
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
                  <div
                      style="display: flex;">
                    <div style="display: flex;align-items:center;">
                      <img style="width:30px;height:30px;border-radius: 4px;"
                           :src="rank.icon || 'https://ipadump.com/static/image/ipa.png'"/>
                    </div>
                    <div
                        style="text-indent: 6px;white-space: nowrap;font-weight: 500;display: flex;align-items:center;">
                      {{ rank.name }}
                    </div>
                  </div>
                  <div style="flex: 1;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
                    <div style="display: flex">
                      <div style="flex: 1;text-align: center;">
                            <span
                                style="font-size: 14px;">{{
                                rank.des
                              }}</span>
                      </div>
                      <div>
                        <span style="font-size: 14px;color:#409eff;font-weight: 500;">{{
                            rank.versionCount
                          }}个版本可下载</span>
                      </div>
                      <div style="display: flex;align-items:center;justify-content: center;">
                        <el-icon color="#cccccc">
                          <ArrowRightBold/>
                        </el-icon>
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
                <el-form status-icon ref="ruleFormRef" :model="dump" :rules="dumpRules" label-width="90px">
                  <el-form-item label="应用名称" prop="appid">
                    <el-input v-model="dump.appid" maxlength="20" placeholder="请输入应用名称"/>
                  </el-form-item>
                  <el-form-item label="版本号" prop="version">
                    <div style="display: flex;width: 100%;">
                      <el-switch
                          v-model="latestVersion"
                          @change="latestVersionChange"
                          class="ml-2"
                          inline-prompt
                          width="80"
                          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #9cf"
                          active-text="最新版本"
                          inactive-text="指定版本"
                      />
                      <div v-if="!latestVersion" style="margin-left:10px;width:100%;">
                        <el-tooltip
                            class="box-item"
                            effect="dark"
                            content="旧版本不一定可以砸，建议提交最新版本"
                            placement="top"
                        >
                          <el-input v-model="dump.version" maxlength="20" placeholder="请输入版本号，例如：10.1.1"/>
                        </el-tooltip>
                      </div>
                    </div>
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
                    <el-input v-model="dump.code" maxlength="20" placeholder="请输入验证码，区分大小写"/>
                  </el-form-item>
                  <el-form-item>
                    <div style="display: flex;align-items: center;">
                      <el-icon color="#9cf">
                        <InfoFilled/>
                      </el-icon>
                      <p style="color:#999999;margin-left: 4px;">
                        当前平均ipa平均砸壳时间为30分钟
                      </p>
                    </div>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="dumpSubmit(ruleFormRef)">
                      提交在线砸壳
                    </el-button>
                  </el-form-item>
                </el-form>
              </el-card>
              <el-card style="margin-top:20px;">
                <template #header>
                  <div class="card-header">
                    <span>当前砸壳应用</span>
                  </div>
                </template>
                <div v-for="du in dumpList" @click="dumpClick(du)" :key="du.appid" class="rank-row">
                  <div class="dumpAppid">
                    {{ du.appid }}
                  </div>
                  <div
                      style="flex: 1;display: flex;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;justify-content: center;">
                    <div class="dumpTime">
                      {{
                        timeFormat(new Date(du.time), 'M-D h:m:s')
                      }}
                    </div>
                    <el-tooltip
                        class="box-item"
                        effect="dark"
                        :content="du.format.content"
                        placement="top"
                    >
                      <div class="dumpVersion">
                        {{ du.version }} / <strong
                          :style="{color:du.format.color}">{{
                          du.format.text
                        }}</strong>
                      </div>
                    </el-tooltip>
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
  DocumentCopy,
  InfoFilled,
} from '@element-plus/icons-vue'
import {ElMessage} from "element-plus";

const search = ref(false)
const searchKey = ref('')
const position = ref('cn')
const rankLoading = ref(true)
const searchLoading = ref(false)
const ruleFormRef = ref()
const latestVersion = ref(true)
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
// const activeName = 'dump'//ref(searchKey.value ? 'search' : 'download')

const dump = reactive({
  version: '',
  appid: '',
  mail: '',
  token: '',
  code: ''
})
const latestVersionChange = (value) => {
  if (value) {
    dump.version = 'latest'
    that.refs.ruleFormRef.resetFields('version')
  }
}
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
      validator: (rule, value, callback) => {
        let va = /^\d+(.\d+)+$/.test(value)
        if (latestVersion.value || va) {
          callback()
        } else {
          callback(new Error('请输入正确的版本号'))
        }
      },
      trigger: 'change'
    }
  ]
})
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
    dumpList.value = response.data.data.list.map(item => {
      return {
        ...item,
        format: dumpStatusFormat(item.status)
      }
    })
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
      dumpList.value = response.data.data.list.map(item => {
        return {
          ...item,
          format: dumpStatusFormat(item.status)
        }
      })
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
const dumpStatusFormat = (status) => {
  if (status === 0) {
    return {
      text: '处理中',
      content: '砸壳已经提交，请等待',
      color: 'black'
    }
  } else if (status === 1) {
    return {
      text: '砸壳中',
      content: '正在砸壳与上传',
      color: 'green'
    }
  } else if (status === 2) {
    return {
      text: '完成',
      content: '砸壳已经完成，点击即可下载',
      color: '#ccc'
    }
  } else if (status === 3) {
    return {
      text: '不可砸',
      content: '程序无法砸壳',
      color: 'red'
    }
  } else if (status === 4) {
    return {
      text: '越狱屏蔽',
      content: '此程序有越狱环境检测，无法砸壳',
      color: 'red'
    }
  } else if (status === 5) {
    return {
      text: '国区不存在',
      content: '此应用在国区内无法搜索到，请检查',
      color: 'red'
    }
  } else if (status === 6) {
    return {
      text: '版本过旧',
      content: '请提交最新版本，旧版本不一定都可以砸',
      color: 'red'
    }
  }
  return {
    text: '错误',
    content: '请进群联系管理员',
    color: 'red'
  }
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
        that.refs.ruleFormRef.resetFields()
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
                dumpList.value = response.data.data.map(item => {
                  return {
                    ...item,
                    format: dumpStatusFormat(item.status)
                  }
                })
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
    display: flex;
    align-items: center;
    height: 60px;
    //line-height: 60px;
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
  position: relative;

  .left {
    flex: 1;
  }

  .right {
    position: absolute;
    right: 10px;
  }
}

.dumpAppid {
  font-weight: 500;
}

.dumpTime {
  flex: 1;
  justify-content: center;
  display: flex;
  font-size: 14px;
  color: #888888;
}

.dumpVersion {
  font-size: 14px;
}
</style>