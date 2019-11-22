<template>
  <el-container style="height: 870px ;border: 1px solid #eee">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-menu :default-openeds="['1', '3']">
        <el-submenu index="1">
          <template slot="title" @click="locate('#syno1')"><i class="el-icon-help"></i>同义词配置</template>
            <el-menu-item index="1-1" @click="locate('#syno1_1')">同义词说明</el-menu-item>
            <el-menu-item index="1-2" @click="locate('#syno1_2')">使用说明</el-menu-item>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title" @click="locate('#stop1')"><i class="el-icon-remove-outline"></i>停用词配置</template>
            <el-menu-item index="2-1" @click="locate('#stop1_1')">停用词说明</el-menu-item>
            <el-menu-item index="2-2" @click="locate('#stop1_2')">使用说明</el-menu-item>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title" @click="locate('#extend1')"><i class="el-icon-circle-plus-outline"></i>拓展词配置</template>
          <el-menu-item index="3-1" @click="locate('#extend1_1')">拓展词介绍</el-menu-item>
          <el-menu-item index="3-2" @click="locate('#extend1_2')">使用说明</el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header style="text-align: right; font-size: 12px">
        <el-dropdown>
          <i class="el-icon-warning-outline" style="margin-right: 15px"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>查看</el-dropdown-item>
            <el-dropdown-item>新增</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <span>帮助</span>
      </el-header>

      <el-main>

        <div id="helps">
          <h1 id="%E5%90%8C%E4%B9%89%E8%AF%8D%E9%85%8D%E7%BD%AE">同义词配置</h1>
          <h2 id="syno1_1">同义词说明</h2>
          <p>同义词最简单的表达形式是 逗号分隔：</p>
          <pre class="hljs"><code><div>&quot;jump, leap, hop&quot;
</div></code></pre>
          <p>如果遇到这些词项中的任何一项，则将其替换为所有列出的同义词。例如：</p>
          <pre class="hljs"><code><div>原始词项:        取代:
────────────────────────────────
jump            → (jump,leap,hop)
leap            → (jump,leap,hop)
hop             → (jump,leap,hop)
</div></code></pre>
          <p>或者, 使用 =&gt; 语法，可以指定一个词项列表（在左边），和一个或多个替换（右边）的列表：</p>
          <pre class="hljs"><code><div>&quot;u s a,united states,united states of america =&gt; usa&quot;
&quot;g b,gb,great britain =&gt; britain,england,scotland,wales&quot;
</div></code></pre>
          <pre class="hljs"><code><div>原始词项:        取代:
────────────────────────────────
u s a           → (usa)
united states   → (usa)
great britain   → (britain,england,scotland,wales)
</div></code></pre>
          <p>如果多个规则指定同一个同义词，它们将被合并在一起，且顺序无关，否则使用最长匹配。以下面的规则为例：</p>
          <pre class="hljs"><code><div>&quot;united states            =&gt; usa&quot;,
&quot;united states of america =&gt; usa&quot;
</div></code></pre>
          <p>如果这些规则相互冲突，Elasticsearch 会将 United States of America 转换为词项 (usa),(of),(america) 。否则，会使用最长的序列，即最终得到词项 (usa) 。</p>
          <h2 id="syno1_2">使用说明</h2>
          <ul>
            <li>
              <p>查找词项和添加词项</p>
              <p>左侧查找，右侧为添加。
                查找的时候，通用词表使用模糊匹配；特定同义词表则只对主词进行模糊匹配。
                添加时，可以同时进行查询，如果词项已经存在，则将已有的结果展示出来；如果没有存在，则将其添加到词表中。
                特定同义词表，一次添加将会加入所有的排列组合。如：</p>
              <pre class="hljs"><code><div>/a/b/c/ (格式必须为/a/b/c/) 则会加入：
a =&gt; b, c
b =&gt; a, c
c =&gt; a, b
</div></code></pre>
              <p><img src="http://tva1.sinaimg.cn/large/007X8olVly1g715d0mllmj31hc0q1te4.jpg" alt="在这里插入图片描述"></p>
            </li>
            <li>
              <p>编辑词项</p>
              <ul>
                <li>(更新：将停用/恢复放在了一个按钮上)</li>
                <li>编辑 ： 对词项进行修改，有格式要求</li>
                <li>停用 ： 暂停使用，会从词表中删除，但仍留在数据库中</li>
                <li>恢复 ： 恢复使用，添加到词表中</li>
                <li>删除 ： 完全删除
                  <img src="http://tva1.sinaimg.cn/large/007X8olVly1g715d0wto0j31hc0q143u.jpg" alt="在这里插入图片描述">
                </li>
              </ul>
            </li>
            <li>
              <p>排序
                默认为按照id降序排序。可以按照编辑次数、编辑时间和查询到的次数进行排序。
                点击一次按照上述的内容降序排列，再次点击，按照默认排序规则——id降序排序。
                <img src="http://tva1.sinaimg.cn/large/007X8olVly1g715d11ru0j31hc0q1wju.jpg" alt="在这里插入图片描述">
              </p>
            </li>
          </ul>
          <h1 id="%E5%81%9C%E7%94%A8%E8%AF%8D%E9%85%8D%E7%BD%AE">停用词配置</h1>
          <h2 id="stop1_1">停用词说明</h2>
          <p>停用词可以减小索引量，并且可以在一定程度上增加查询的准确性，一般对文档中的词项按照频率作如下划分:</p>
          <ul>
            <li>低频词（Low-frequency terms）
              在文档集合中相对出现较少的词，因为它们稀少，所以它们的权重值更高。</li>
            <li>高频词（High-frequency terms）
              在索引下的文档集合中出现较多的常用词，例如 <code>the</code>、<code>and</code>、和<code>is</code>。 这些词的权重小，对相关度评分影响不大。</li>
          </ul>
          <blockquote>
            <p>频率实际上是个可以衡量的标尺而不是非高即低的标签。我们可以在标尺的任何位置选取一个标准，低于这个标准的属于低频词，高于它的属于高频词。</p>
          </blockquote>
          <p>词项到底是低频或是高频取决于它们所处的文档。单词 and 如果在所有都是中文的文档里可能是个低频词。在关于数据库的文档集合里，单词 database 可能是一个高频词项，它对搜索这个特定集合毫无帮助。</p>
          <p>每种语言都存在一些非常常见的单词，它们对搜索没有太大价值。在 Elasticsearch 中，英语默认的停用词为:</p>
          <pre class="hljs"><code><div>a, an, and, are, as, at, be, but, by, for, if, in, into, is, it,
no, not, of, on, or, such, that, the, their, then, there, these,
they, this, to, was, will, with
</div></code></pre>
          <p>这些 停用词 通常在索引前就可以被过滤掉，同时对检索的负面影响不大。</p>
          <ul>
            <li>优点：节约内存空间</li>
            <li>缺点：对部分类型的查询可能会造成影响：如上述的英文词汇停用之后，无法查询出名句：to be or not to be; 无法区分 happy和not happy等。</li>
          </ul>
          <h2 id="stop1_2">使用说明</h2>
          <ul>
            <li>
              <p>编辑词项</p>
              <ul>
                <li>(更新：将生效/失效放在了一个按钮上)</li>
                <li>生效
                  对应同义词的  恢复</li>
                <li>失效
                  对应同义词的 停用</li>
                <li>删除
                  因为每个词都只有一项，所以未设置编辑选项，错了直接删除就行。</li>
                <li>更新
                  更新同义词表，为了防止同义词和停用词之间产生冲突，而导致索引异常停止。
                  <img src="http://tva1.sinaimg.cn/large/007X8olVly1g715d18fd5j31hc0q1q6u.jpg" alt="在这里插入图片描述">
                </li>
              </ul>
            </li>
            <li>
              <p>批量更新与同步</p>
              <ul>
                <li>全部更新：主要是在刚开始导入停用词表的时候使用，与同义词进行比对，删除重复的词项。</li>
                <li>同步： 每次编辑完成之后，都需要进行一次同步，将更新了的数据写入停用词表(stopwords.dic)中。</li>
              </ul>
              <p>
                <img src="http://tva1.sinaimg.cn/large/007X8olVly1g715d1tigqj31hc0q10wp.jpg" alt="在这里插入图片描述">
              </p>
            </li>
          </ul>
          <h1 id="%E6%8B%93%E5%B1%95%E8%AF%8D%E9%85%8D%E7%BD%AE">拓展词配置</h1>
          <h2 id="extend1_1">拓展词介绍</h2>
          <p>拓展词是analyzer-ik分词器提供的功能。拓展词的配置是为了丰富ik分词器的词库。让我们能够得到更精确的分词结果。如：人民公园。 未配置拓展词的话，会分词为：‘人民’，‘公园’； 配置之后，分词为：‘人民公园’。</p>
          <h2 id="extend1_2">使用说明</h2>
          <p>基本与同义词配置一致，不可编辑，直接删除就行。</p>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'helper',
  data () {
    const item = {
      date: '2016-05-02',
      name: '帮助文档',
      address: '上海市普陀区金沙江路 1518 弄'
    }
    return {
      tableData: Array(20).fill(item)
    }
  },
  methods: {
    locate (place) {
      location.href = place
    }
  }
}
</script>

<style scoped>
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }

  .el-aside {
    color: #333;
  }
</style>

<style>
  /*---------------------------------------------------------------------------------------------
   *  Copyright (c) Microsoft Corporation. All rights reserved.
   *  Licensed under the MIT License. See License.txt in the project root for license information.
   *--------------------------------------------------------------------------------------------*/

  body {
    font-family: "Segoe WPC", "Segoe UI", "SFUIText-Light", "HelveticaNeue-Light", sans-serif, "Droid Sans Fallback";
    font-size: 14px;
    line-height: 22px;
    word-wrap: break-word;
  }

  #code-csp-warning {
    position: fixed;
    top: 0;
    right: 0;
    color: white;
    margin: 16px;
    text-align: center;
    font-size: 12px;
    font-family: sans-serif;
    background-color:#444444;
    cursor: pointer;
    padding: 6px;
    box-shadow: 1px 1px 1px rgba(0,0,0,.25);
  }

  #code-csp-warning:hover {
    text-decoration: none;
    background-color:#007acc;
    box-shadow: 2px 2px 2px rgba(0,0,0,.25);
  }

  body.scrollBeyondLastLine {
    margin-bottom: calc(100vh - 22px);
  }

  body.showEditorSelection .code-line {
    position: relative;
  }

  body.showEditorSelection .code-active-line:before,
  body.showEditorSelection .code-line:hover:before {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    left: -12px;
    height: 100%;
  }

  body.showEditorSelection li.code-active-line:before,
  body.showEditorSelection li.code-line:hover:before {
    left: -30px;
  }

  .vscode-light.showEditorSelection .code-active-line:before {
    border-left: 3px solid rgba(0, 0, 0, 0.15);
  }

  .vscode-light.showEditorSelection .code-line:hover:before {
    border-left: 3px solid rgba(0, 0, 0, 0.40);
  }

  .vscode-dark.showEditorSelection .code-active-line:before {
    border-left: 3px solid rgba(255, 255, 255, 0.4);
  }

  .vscode-dark.showEditorSelection .code-line:hover:before {
    border-left: 3px solid rgba(255, 255, 255, 0.60);
  }

  .vscode-high-contrast.showEditorSelection .code-active-line:before {
    border-left: 3px solid rgba(255, 160, 0, 0.7);
  }

  .vscode-high-contrast.showEditorSelection .code-line:hover:before {
    border-left: 3px solid rgba(255, 160, 0, 1);
  }

  img {
    max-width: 100%;
    max-height: 100%;
  }

  a {
    color: #4080D0;
    text-decoration: none;
  }

  a:focus,
  input:focus,
  select:focus,
  textarea:focus {
    outline: 1px solid -webkit-focus-ring-color;
    outline-offset: -1px;
  }

  hr {
    border: 0;
    height: 2px;
    border-bottom: 2px solid;
  }

  h1 {
    padding-bottom: 0.3em;
    line-height: 1.2;
    border-bottom-width: 1px;
    border-bottom-style: solid;
  }

  h1, h2, h3 {
    font-weight: normal;
  }

  h1 code,
  h2 code,
  h3 code,
  h4 code,
  h5 code,
  h6 code {
    font-size: inherit;
    line-height: auto;
  }

  a:hover {
    color: #4080D0;
    text-decoration: underline;
  }

  table {
    border-collapse: collapse;
  }

  table > thead > tr > th {
    text-align: left;
    border-bottom: 1px solid;
  }

  table > thead > tr > th,
  table > thead > tr > td,
  table > tbody > tr > th,
  table > tbody > tr > td {
    padding: 5px 10px;
  }

  table > tbody > tr + tr > td {
    border-top: 1px solid;
  }

  blockquote {
    margin: 0 7px 0 5px;
    padding: 0 16px 0 10px;
    border-left: 5px solid;
  }

  code {
    font-family: Menlo, Monaco, Consolas, "Droid Sans Mono", "Courier New", monospace, "Droid Sans Fallback";
    font-size: 14px;
    line-height: 19px;
  }

  body.wordWrap pre {
    white-space: pre-wrap;
  }

  .mac code {
    font-size: 12px;
    line-height: 18px;
  }

  pre:not(.hljs),
  pre.hljs code > div {
    padding: 16px;
    border-radius: 3px;
    overflow: auto;
  }

  /** Theming */

  .vscode-light,
  .vscode-light pre code {
    color: rgb(30, 30, 30);
  }

  .vscode-dark,
  .vscode-dark pre code {
    color: #DDD;
  }

  .vscode-high-contrast,
  .vscode-high-contrast pre code {
    color: white;
  }

  .vscode-light code {
    color: #A31515;
  }

  .vscode-dark code {
    color: #D7BA7D;
  }

  .vscode-light pre:not(.hljs),
  .vscode-light code > div {
    background-color: rgba(220, 220, 220, 0.4);
  }

  .vscode-dark pre:not(.hljs),
  .vscode-dark code > div {
    background-color: rgba(10, 10, 10, 0.4);
  }

  .vscode-high-contrast pre:not(.hljs),
  .vscode-high-contrast code > div {
    background-color: rgb(0, 0, 0);
  }

  .vscode-high-contrast h1 {
    border-color: rgb(0, 0, 0);
  }

  .vscode-light table > thead > tr > th {
    border-color: rgba(0, 0, 0, 0.69);
  }

  .vscode-dark table > thead > tr > th {
    border-color: rgba(255, 255, 255, 0.69);
  }

  .vscode-light h1,
  .vscode-light hr,
  .vscode-light table > tbody > tr + tr > td {
    border-color: rgba(0, 0, 0, 0.18);
  }

  .vscode-dark h1,
  .vscode-dark hr,
  .vscode-dark table > tbody > tr + tr > td {
    border-color: rgba(255, 255, 255, 0.18);
  }

  .vscode-light blockquote,
  .vscode-dark blockquote {
    background: rgba(127, 127, 127, 0.1);
    border-color: rgba(0, 122, 204, 0.5);
  }

  .vscode-high-contrast blockquote {
    background: transparent;
    border-color: #fff;
  }
</style>

<style>
  /* Tomorrow Theme */
  /* http://jmblog.github.com/color-themes-for-google-code-highlightjs */
  /* Original theme - https://github.com/chriskempson/tomorrow-theme */

  /* Tomorrow Comment */
  .hljs-comment,
  .hljs-quote {
    color: #8e908c;
  }

  /* Tomorrow Red */
  .hljs-variable,
  .hljs-template-variable,
  .hljs-tag,
  .hljs-name,
  .hljs-selector-id,
  .hljs-selector-class,
  .hljs-regexp,
  .hljs-deletion {
    color: #c82829;
  }

  /* Tomorrow Orange */
  .hljs-number,
  .hljs-built_in,
  .hljs-builtin-name,
  .hljs-literal,
  .hljs-type,
  .hljs-params,
  .hljs-meta,
  .hljs-link {
    color: #f5871f;
  }

  /* Tomorrow Yellow */
  .hljs-attribute {
    color: #eab700;
  }

  /* Tomorrow Green */
  .hljs-string,
  .hljs-symbol,
  .hljs-bullet,
  .hljs-addition {
    color: #718c00;
  }

  /* Tomorrow Blue */
  .hljs-title,
  .hljs-section {
    color: #4271ae;
  }

  /* Tomorrow Purple */
  .hljs-keyword,
  .hljs-selector-tag {
    color: #8959a8;
  }

  .hljs {
    display: block;
    overflow-x: auto;
    color: #4d4d4c;
    padding: 0.5em;
  }

  .hljs-emphasis {
    font-style: italic;
  }

  .hljs-strong {
    font-weight: bold;
  }
</style>

<style>
  /*
   * Markdown PDF CSS
   */

  body {
    font-family:  "Meiryo", "Segoe WPC", "Segoe UI", "SFUIText-Light", "HelveticaNeue-Light", sans-serif, "Droid Sans Fallback";
  }

  pre {
    background-color: #f8f8f8;
    border: 1px solid #cccccc;
    border-radius: 3px;
    overflow-x: auto;
    white-space: pre-wrap;
    overflow-wrap: break-word;
  }

  pre:not(.hljs) {
    padding: 23px;
    line-height: 19px;
  }

  blockquote {
    background: rgba(127, 127, 127, 0.1);
    border-color: rgba(0, 122, 204, 0.5);
  }

  .emoji {
    height: 1.4em;
  }

  /* for inline code */
  :not(pre):not(.hljs) > code {
    color: #C9AE75; /* Change the old color so it seems less like an error */
    font-size: inherit;
  }

  /* Page Break : use <div class="page"/> to insert page break
  -------------------------------------------------------- */
  .page {
    page-break-after: always;
  }

</style>
