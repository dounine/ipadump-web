const gulp = require('gulp')
const fs = require('fs')
const path = require('path')
const del = require('del')
const replace = require('gulp-replace')
const {fetch, refresh, upload} = require('qiniu-tool-v2')
const qiniuData = require('./.qiniu.json')

const key = qiniuData.key
const token = qiniuData.token
const config = {
    ak: key,
    sk: token,
    scope: 'ipadump',
    zone: 'qiniu.zone.Zone_z2', // 七牛空间（默认Zone_z1）
}

// 文件读取方法
const readFileList = (dir, filesList = []) => {
    const files = fs.readdirSync(dir);
    files.forEach((item, index) => {
        let fullPath = path.join(dir, item);
        let name = item;
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            readFileList(path.join(dir, item), filesList); //递归读取文件
        } else {
            filesList.push({dir, fullPath, name});
        }
    });
    return filesList;
}

// 清空build文件夹
gulp.task('clean', cb => {
    del.sync(['dist/*'], {dot: true});
    cb();
});

async function ossUpload(path) {
    await upload(config, path, `${path.substring("dist/".length)}`)
    console.log('upload success ', path, 'https://ipadump.com/' + `${path.substring("dist/".length)}`)
    await refresh(config, [`https://ipadump.com/${path}`])
}

// 替换SDK内的变量
gulp.task('replacePath', async () => {
    return gulp.src('./dist/index.html')
        .pipe(replace("/assets", `/assets`))
        // .pipe(replace("favicon.ico", `${pathPre}/favicon.ico`))
        .pipe(gulp.dest('./dist', {overwrite: true}))
})

// 上传资源文件
gulp.task('uploadResource', async cb => {
    let filesList = [];
    readFileList('./dist', filesList);
    await Promise.all(filesList.map(info => {
        return ossUpload(info.fullPath);
    }));
    return await refresh(config, [`https://ipadump.com`])
});
gulp.task('uploadStaticResource', async cb => {
    let filesList = [];
    readFileList('./src/assets/static/', filesList);
    return Promise.all(filesList.map(async info => {
        await upload(config, info.fullPath, `static/${info.fullPath.substring("src/assets/static/".length)}`)
    }));
})
// 上传
gulp.task('upload', gulp.series(['replacePath', 'uploadStaticResource', 'uploadResource']));

