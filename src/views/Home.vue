<template>
  <div style="display: flex;justify-content: center;">
    <el-card style="max-width: 350px;">
      <img style="width:100%;border-radius: 10px;" :src="qrcode"/>
      <el-container>
        <el-aside width="40px">
          <div style="margin-top:28px;text-align: center;">
            <svg t="1655983247588" class="icon" viewBox="0 0 1024 1024" version="1.1"
                 xmlns="http://www.w3.org/2000/svg" p-id="2840" width="38" height="38">
              <path
                  d="M823.174 397.898h-2.431c-17.909 0-32.599 5.137-46.742 13.903-12.397-36.127-43.9-62.153-84.48-62.153-17.909 0-35.031 5.137-49.174 13.903-12.397-36.127-43.9-62.153-84.514-62.153-15.821 0-30.545 3.972-43.558 10.924v-92.972c0-50.646-38.319-91.67-89.308-91.67-50.99 0-92.355 41.058-92.355 91.67v355.931l-56.058-55.853c-36.059-35.819-99.889-30.717-130.606 0s-50.852 92.493-6.883 136.495l257.924 256.213c5.308 5.274 11.163 9.691 17.327 13.424 47.017 38.353 100.916 61.057 214.845 61.057 260.287 0 284.394-140.434 284.394-313.638v-183.376c-0.033-50.646-37.359-91.705-88.382-91.705M862.897 672.943c0 146.563-0.686 265.39-235.769 265.39-99.581 0-159.371-22.19-204.675-67.187l-244.158-242.549c-21.607-21.607-16.162-49.209 1.507-66.913 17.669-17.669 50.132-18.286 67.22-1.335 0 0 42.839 42.565 79.754 79.275 27.908 27.772 52.461 52.154 52.461 52.154v-462.77c0-23.97 19.587-43.421 43.763-43.421s40.682 19.451 40.682 43.421v294.359h0.479c-0.304 1.459-0.479 3.136-0.479 4.854 0 13.296 10.89 24.116 24.313 24.116s24.313-10.786 24.313-24.141c0-1.644-0.172-3.252-0.479-4.829h0.479v-120.641c0-23.971 17.465-43.421 41.641-43.421 0 0 42.804-0.581 42.804 43.421v159.233h0.479c-0.304 1.459-0.479 3.136-0.479 4.853 0 13.295 10.89 24.115 24.313 24.115s24.313-10.786 24.313-24.141c0-1.644-0.172-3.252-0.479-4.828h0.479v-110.983c0-23.97 17.19-43.421 41.366-43.421 0 0 43.695 2.739 43.695 43.421v139.954h0.479c-0.304 1.459-0.479 3.136-0.479 4.854 0 13.296 10.89 24.116 24.313 24.116s23.697-10.786 23.697-24.141c0-1.644-0.172-3.252-0.446-4.829h0.446v-95.54c0-23.971 18.013-43.421 42.189-43.421 0 0 42.359-1.713 42.359 43.421v177.554h-0.1M294.554 356.051v-81.055c-7.706-17.293-12.087-36.435-12.087-56.571 0-76.844 62.289-139.133 139.133-139.133s139.133 62.289 139.133 139.133c0 10.479-1.232 20.684-3.459 30.511 17.499 0.686 33.285 7.945 44.79 19.621 4.451-15.957 7.088-32.703 7.088-50.099 0-103.553-83.966-187.519-187.519-187.519s-187.519 83.966-187.519 187.519c-0.035 54.448 23.319 103.347 60.441 137.591M294.554 356.051z"
                  p-id="2841" fill="#8a8a8a"></path>
            </svg>
          </div>
        </el-aside>
        <el-main>
          <div v-if="isCat">
            <div style="color: #323233;font-size: 16px;font-family:'微软雅黑';">{{title}}群已超200人只能邀请加入</div>
            <div style="color: #323233;margin-top:6px;font-size: 16px;font-family:'微软雅黑';">长按识别添加、让群主邀请加入</div>
          </div>
          <div v-else>
            <div style="color: #323233;font-size: 16px;font-family:'微软雅黑';">长按识别二维码</div>
            <div style="color: #323233;margin-top:6px;font-size: 16px;font-family:'微软雅黑';">即可加入{{ title }}群一起铲屎</div>
          </div>
        </el-main>
      </el-container>
      <el-divider style="margin:0;"></el-divider>
      <el-container>
        <el-main>
            <span style="color:#969799;font-size: 16px;">
              如果无法扫码进群、可添加群主：wx-43210 为好友邀请进群
            </span>
        </el-main>
      </el-container>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import {getCurrentInstance, onBeforeMount, ref} from 'vue';
import {
  Plus
} from '@element-plus/icons-vue'

const qrcode = ref("");
const {proxy} = getCurrentInstance()
let type = proxy.$route.params["type"] || "cat"
const title = ref(type === 'cat' ? '喵喵' : '狗狗')
const isCat = ref(type === 'cat');
const convertImgToBase64 = ({url, callback}) => {
  let canvas = document.createElement('CANVAS'),
      ctx = canvas.getContext('2d'),
      img = new Image;
  img.crossOrigin = '*';
  img.onload = function () {
    canvas.height = img.height;
    canvas.width = img.width;
    ctx.drawImage(img, 0, 0);
    let dataURL = canvas.toDataURL('image/png');
    callback.call(this, dataURL);
    canvas = null;
  };
  img.src = url;
}

onBeforeMount(() => {
  let qrcodeData = localStorage.getItem(`${type}_qrcode`);
  if (qrcodeData) {
    qrcode.value = qrcodeData;
    document.getElementById("loading").style = "display:none";
  } else {
    convertImgToBase64({
      url: `https://pet-lake.skysriver.com/pet-qrcode/${type}.png`, callback: (base64Img) => {
        qrcode.value = base64Img;
        document.getElementById("loading").style = "display:none";
        localStorage.setItem(`${type}_qrcode`, base64Img);
      }
    });
  }
  proxy.$axios.get('/ip').then(response => {
    let data = response.data;
    console.log('ip address', data)
    let count = 1;
    let access = localStorage.getItem(`${type}_access`);
    if (!access) {
      localStorage.setItem(`${type}_access`, "1");
    } else {
      count = parseInt(access) + 1;
      localStorage.setItem(`${type}_access`, count.toString());
    }
    proxy.$axios.post('/msg', {
      "title": data.data.city + "用户访问" + (type === 'cat' ? '猫二维码' : '狗二维码'),
      "text": type + ':' + data.data.province + " > " + data.data.city + " > " + count + " > " + data.data.ip + (proxy.$route.query.code ? (" > 渠道：" + proxy.$route.query.code) : "")
    }).then(message => {
      console.log('message', message.data)
    })
  })
})
</script>

<style lang="scss" scoped>
.myfont {
  color: #323233;
}
</style>