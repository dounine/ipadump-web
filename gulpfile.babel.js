const gulp = require('gulp')
const fs = require('fs')
const path = require('path')
const del = require('del')
const replace = require('gulp-replace')
const {fetch, refresh, upload} = require('qiniu-tool-v2')
const qiniuData = require('./.qiniu.json')

const key = qiniuData.key
const token = qiniuData.token


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
    console.log('upload', path, `${path.substring("dist/".length)}`)
    await upload({
        ak: key,
        sk: token,
        scope: 'ipadump',
        zone: 'qiniu.zone.Zone_z2', // 七牛空间（默认Zone_z1）
    }, path, `${path.substring("dist/".length)}`)
    console.log('upload success ', path, 'https://ipadump.com/' + `${path.substring("dist/".length)}`)
}

// 替换SDK内的变量
gulp.task('replacePath', () => {
    return gulp.src('./dist/index.html')
        .pipe(replace("/assets", `/assets`))
        // .pipe(replace("favicon.ico", `${pathPre}/favicon.ico`))
        .pipe(gulp.dest('./dist', {overwrite: true}))
})

// 上传资源文件
gulp.task('uploadResource', async cb => {
    let filesList = [];
    readFileList('./dist', filesList);
    return Promise.all(filesList.map(info => {
        return ossUpload(info.fullPath);
    }));
});
gulp.task('uploadStaticResource', async cb => {
    let filesList = [];
    readFileList('./src/assets/static/', filesList);
    return Promise.all(filesList.map(async info => {
        await upload({
            ak: key,
            sk: token,
            scope: 'ipadump',
            zone: 'qiniu.zone.Zone_z2', // 七牛空间（默认Zone_z1）
        }, info.fullPath, `static/${info.fullPath.substring("src/assets/static/".length)}`)
    }));
})
gulp.task('uploadCat', async cb => {
    await upload({
        ak: key,
        sk: token,
        scope: 'ipadump',
        zone: 'qiniu.zone.Zone_z2', // 七牛空间（默认Zone_z1）
    }, 'src/assets/pet.html', `pet/pet.html`)
    return new Promise(function (resolve, reject) {
        resolve();
    })
});
gulp.task('uploadDog', async cb => {
    await upload({
        ak: key,
        sk: token,
        scope: 'ipadump',
        zone: 'qiniu.zone.Zone_z2', // 七牛空间（默认Zone_z1）
    }, 'src/assets/dog.html', `pet/dog.html`)
    return new Promise(function (resolve, reject) {
        resolve();
    })
});
// 上传
gulp.task('upload', gulp.series(['replacePath', 'uploadStaticResource', 'uploadResource']));

