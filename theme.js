const path = require('path');
const { generateTheme } = require('antd-theme-generator');

const options = {
    antDir: path.join(__dirname, './node_modules/antd-mobile'),
    stylesDir: path.join(__dirname, './src/base/style/antd-mobile'),
    varFile: path.join(__dirname, './src/base/style/antd-mobile/index.less'),
    mainLessFile: path.join(__dirname, './src/base/style/antd-mobile/index.less'),
    indexFileName: 'index.html',
    outputFilePath: path.join(__dirname, './public/theme.less'),
}

generateTheme(options).then(less => {
    console.log('Theme generated successfully');
}).catch(error => {
    console.log('Error', error);
});