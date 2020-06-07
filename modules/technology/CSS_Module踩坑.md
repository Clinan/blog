#开启CSS Module样式隔离后需要注意的坑
开启CSS Module样式隔离后，将不会直接在入口js中import样式文件，而是在使用的地方按需引入，即使是全局样式也是如此。

## 理论基础
使用CSS Module时有很多需要注意的地方，你需要一些Webpack的知识才能保证在使用时不出错，Webpack编译时每个编译单元都是一个Module，并且每一个Module分别处理。

###Webpack
Webpack是一个模块编译器，编译的单位就是一个个Module，并用一个URI标识它，相同的URI只会在第一次遇到时编译。同一个文件，如果URI不同，就会作为两个不同的Module编译

Webpack编译的入口由用户指定，从入口Module开始，根据`import`和`require`语句遍历所有Module，其编译的顺序类似于遍历时的深度优先算法，每次遇到`import`，总是先将`import`指向的URI对应的Module先编译完，再编译下一个`import`。

因此，对于整个项目中的多个JS与Vue文件，如果这些文件中都有样式的Module或对样式Module的引用，去除对相同Module的重复引用后，最终样式在页面上渲染的顺序就是Webpack编译Module的顺序。

###vue-loader
Webpack在编译Vue文件时，由vue-loader做第一层处理，vue-loader将Vue文件中的每一个标签作为一个Module编译，顺序为template/script/style。

在Vue文件中导入样式文件有两种方式，第一种是在`<style>`标签中通过src导入，第二种是在`<script>`标签中通过import导入。本地样式则可直接写在`<style>`标签中。

下面是在Vue项目中引入外部样式文件的示例：
1. 在Vue文件中基于`<style>`标签引入
   ```html
   <style module="$globalStyle" lang="scss" src="@metrics/index.scss"/>
   ```
   经过vue-loader处理后，将变成一个Module，并由如下的import语句引入
   ```ecmascript 6
   import './src/biz/metrics/index.scss?vue&type=style&index=0&module=%24globalStyle&lang=scss&'
   ```
   其中`import`后的部分就是该Module的URI，分析该URI

   1. `./src/biz/metrics/index.scss`代表该模块要编译的文件
   2. `vue`代表该模块由vue-loader处理生成
   3. `type=style`代表该模块是由Vue文件中的`<style>`标签产生的
   4. `index=0`代表在同一个Vue文件的一个或多个`<style>`标签中，该模块的`<style>`标签是第一个
   5. `module=%24globalStyle&lang=scss&`即`<style>`标签中的各个属性
2. 在JS代码（可以是Vue文件的`<script>`标签或JS文件）中引入
   ```ecmascript 6
   import './src/biz/metrics/index.scss?module'
   ```
   只需要一个`module`查询即可开启CSS Module功能

不论用哪种方式导入样式，不论是导入样式还是直接在`<style>`标签中写的样式，最终都会以`<style>`标签渲染在网页的`<header>`中，样式渲染顺序为Module导入的顺序。

因此，在同一个Vue文件中，样式最终在网页上渲染的顺序有如下规则
- `<script>`中导入的样式将始终早于`<style>`的样式
- `<script>`内部导入的多个样式的顺序即为import的顺序
- 多个`<style>`间的样式的顺序即为`<style>`在Vue文件中的顺序

###CSS
最后介绍CSS，当一个HTML元素有多个权重相同的样式同时生效时，后定义的样式优先级更高，因此`<style>`标签在页面中渲染的顺序也会影响样式的生效与否

在Vue文件中覆盖全局样式时，强烈建议用自定义类名+全局样式的选择器，使用与全局样式相同的选择器可以确保你自定义的样式仅在特定的场景下生效

比如HUI原生类`.h-btn`
操作员中心框架用皮肤覆盖一层`.lightblue .h-btn`
子系统的全局样式中我们用全局类名包裹覆盖一层`.metrics-wrapper .h-btn`
在Vue页面上用自定义类名覆盖一层`.custom-class .h-btn`

后面的三次覆盖的样式权重是完全相同的，均为0020，但由于操作员中心最先渲染，子系统全局样式第二渲染，Vue页面自定义样式最后渲染，所以最后生效的总是Vue页面上自定义的样式

##使用规则
综上所述，在Vue中使用CSS Module技术时，需要避免同一份样式被多次编译，还需要关注编译的顺序，确保样式覆盖的顺序不出错

引用样式文件时，应遵循vue-loader小节中的两种引用方式。

如果一个样式文件在多个文件中通过`<style>`标签被引用，则不仅要保证`<style>`标签内除`src`外其他属性全部相同，还要保证引用该文件的`<style>`标签在不同Vue文件中的index相同，即在一个Vue文件中引用目标样式文件的`<style>`标签是文件中全部`<style>`标签的第二个，则在其他Vue文件中也必须是第二个。

此外，如果一个scss文件同时在Vue文件中基于`<style>`标签与JS代码（可以是Vue文件的`<script>`标签或JS文件）被引入，JS代码中`import`使用的URI应该与vue-loader生成的URI相同，即vue-loader小节中第一种方式`import`使用的URI，而非第二种方式的URI

如果一个样式文件仅在JS代码（可以是Vue文件的`<script>`标签或JS文件）被引入，建议使用vue-loader小节中第二种方式引入，当然这不是必须的。

同时，为了本地样式能正确地覆盖全局样式，应遵循vue-loader部分的说明，按合适的顺序编写样式相关的代码。

##举个例子
有main.js/A.vue/B.vue/1.scss/2.scss/3.scss/4.scss/5.scss/6.scss
main.js是编译入口，内容如下
```ecmascript 6
import '1.scss?module';
// noinspection ES6UnusedImports,NpmUsedModulesInstalled
import A from 'A.vue';
// noinspection ES6UnusedImports,NpmUsedModulesInstalled
import B from 'B.vue';
import '5.scss?module';
```
A.vue的内容如下
```vue
<script>
import style2 from '2.scss?module';

export default {
    created() {
        this.$style2 = style2;
    }
}
</script>

<!--suppress HtmlUnknownTarget -->
<style module="$globalStyle" lang="scss" src="3.scss"/>

<!--suppress HtmlUnknownTarget -->
<style module="$localSharedStyle" lang="scss" src="4.scss"/>

<style module lang="scss">
    // 本地自定义样式1
</style>
```
B.vue的内容如下
```vue
<script>
import style3 from '3.scss?vue&type=style&index=0&module=%24globalStyle&lang=scss&';

export default {
    methods:{
        method1(){
            this.className = style3['class-name'];
        }
    }
}
</script>

<!--suppress HtmlUnknownTarget -->
<style module="$localSharedStyle" lang="scss" src="4.scss"/>

<style module lang="scss">
    // 本地自定义样式2
</style>
```
3.scss的内容如下
```scss
// 省略3.scss自身的样式

//noinspection CssUnknownTarget
@import "6.scss";
```
经过编译后在网页中的渲染顺序为
```html
<style>/*1.scss来自main.js*/</style>
<style>/*2.scss来自A.vue*/</style>
<style>/*3.scss来自A.vue，并包含6.scss的内容*/</style>
<style>/*4.scss来自A.vue*/</style>
<style>/*本地自定义样式1来自A.vue*/</style>
<style>/*4.scss来自B.vue*/</style>
<style>/*本地自定义样式2来自B.vue*/</style>
<style>/*5.scss来自main.js*/</style>
```
可以看到，渲染顺序即为Webpack的编译顺序。3.scss虽然在A.vue与B.vue中同时被引用，但是由于B.vue引用时跟上了与A.vue中相同的URI，因此只被渲染一次。而4.scss由于在A.vue是第二个`<style>`标签，在B.vue中是第一个`<style>`标签，导致URI中index不同，而被重复渲染，此时如果本地自定义样式1中用后定义优先的规则去覆盖4.scss中的样式，就会无法生效。

这种index不同的情况在使用`<style>`标签引用样式文件时，很多时候是无法规避的。这里给出两种解决方案：
1. 不使用`<style>`标签引用外部样式文件，在`<script>`中通过`import`引入，再在`created`中绑定至`this`，如同例子中的2.scss。引用顺序可以通过`import`语句的先后顺序控制
2. 将局部样式文件通过`@import`指令导入至全局样式文件的末尾，再在引用的地方统一引用全局样式文件，如同例子中的6.scss。这种方法应避免在各个导入的scss样式间避免出现类名重复，避免不同scss间的样式互相影响。此外，在局部样式文件中包含`url()`时容易出问题，编译时将基于全局样式文件所在目录查找`url()`中指向的目标文件，很容易出现找不到的情况。典型的就是iconfont文件

结合使用上述两种方法，基本可以规避重复渲染导致的问题，确保每一段CSS样式只在页面上渲染一次。

##一种典型的使用方法
下述方法仅供参考

全局样式文件在需要的Vue文件中使用`<style>`标签引入，并且必须是第一个标签。可能会产生index问题的局部样式文件通过`@import`导入全局样式文件的末尾，由于包含`url()`导致无法导入且不会产生优先级问题的局部样式文件，通过纯JS方式用`import`导入

##总结
CSS Module的使用方式没有严格标准，应当根据实际需要进行调整，但始终围绕两个目标：无重复渲染、渲染顺序正确！
