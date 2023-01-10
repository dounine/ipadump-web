<template>
  <el-header style="height: 80px">
    <div class="header">
      <div class="max">
        <el-menu
            default-active="1"
            class="el-menu-demo"
            mode="horizontal"
            :ellipsis="false"
            style="border-bottom: 0;"
        >
          <el-menu-item index="0" style="height: 80px;opacity:1;cursor:default;" disabled>
            <a href="/"><img alt="ipa软件下载,ipa在线砸壳,ios应用砸壳,ios应用提取,ipa砸壳,ipa提取"
                             style="height:50px;margin-top:15px;" src="../assets/static/img/logo.png"/></a>
          </el-menu-item>
          <div class="flex-grow"/>
          <el-menu-item index="1" style="height: 80px;line-height: 80px">资源</el-menu-item>
        </el-menu>
      </div>
    </div>
  </el-header>
</template>

<style lang="scss" scoped>
.header {
  height: 80px;
  border-bottom: 1px solid #e6e6e6;

  .max {
    max-width: 1140px;
    margin: 0 auto;
  }

}

.flex-grow {
  flex-grow: 1;
}


</style>
