# 算法



## 计算器问题

思路 使用栈，如果有括号，则左括号入栈，遇到右括号就出栈。



# 算法导论

## 排序

### 插入排序

### 归并排序

### 堆排序

### 快速排序

采用分治的方法，和归并排序的不同在于有主元，时间复杂度为


$$
O(nlgn)
$$


```java

    @ParameterizedTest
    @ValueSource(strings = {"1,-232,42,52,2,52,1321,21,32,1,2,3", "9,53,632,2,53,53,3,22,2",})
    public void qsMain(@ConvertWith(ArrayConverter.class) int[] nums) {
        System.out.println(Arrays.toString(nums));
        // 随机数快排
        quicksortRandom(nums, 0, nums.length - 1);
        System.out.println(Arrays.toString(nums));
        // 主元选最后一个元素的快排
        quicksort(nums, 0, nums.length - 1);
        System.out.println(Arrays.toString(nums));
    }

    public void quicksortRandom(int[] nums, int start, int end) {
        if (start < end) {
            int pivotLocate = partitionRandom(nums, start, end);
            quicksort(nums, start, pivotLocate - 1);
            quicksort(nums, pivotLocate + 1, end);
        }
    }

    public int partitionRandom(int[] nums, int start, int end) {
        int pivotIndex = (int) ((Math.random() * 1000) % (end - start + 1));
        int pivot = nums[pivotIndex];
        int current = start;
        for (int i = start; i < end; i++) {
            if (nums[i] <= pivot) {
                int tmp = nums[i];
                nums[i] = nums[current];
                nums[current] = tmp;
                current++;
            }
        }
        return current - 1;
    }

    public void quicksort(int[] nums, int start, int end) {
        if (start < end) {
            int pivotIndex = partition(nums, start, end);
            quicksort(nums, start, pivotIndex - 1);
            quicksort(nums, pivotIndex + 1, end);
        }
    }

    private int partition(int[] nums, int start, int end) {
        // 选择最后一个元素为主元
        int pivot = nums[end];
        int ii = start;
        // 不循环最后一个的元素 因为那是主元
        for (int i = start; i <= end - 1; i++) {
            if (nums[i] <= pivot) {
                int tmp = nums[i];
                nums[i] = nums[ii];
                nums[ii] = tmp;
                ii++;
            }
        }
        int tmp = nums[end];
        nums[end] = nums[ii];
        nums[ii] = tmp;
        return ii;
    }

```





### 线性时间排序

下面的排序算法时间复杂度都是O(n)，但是相比上面的排序会使用到额外的空间。

#### 计数排序

#### 基数排序

#### 拓展：基于二进制的基数排序（每次技术排序使用计数排序法）

#### 桶排序

### 中位数和顺序统计量

#### 获得数组中排在第k个的数字

只取一半的快速排序算法（k所在的那一部分）



## 数据结构

### Hash表

### BST二叉搜索树

### AVL树

### 红黑树

### 数据结构的扩张

#### 顺序统计树



## 高级设计和分析技术

### 动态规划

1. 动态规划通常用来解决**最优化问题**，在这类问题中，我们通过一组**选择**来达到最优解
2. 在做出每个选择的同时，通常会生成与原问题实现相同的子问题、
3. **当多于一个选择子集都生成相同的子问题时，动态规划技术通常很有效。**
4. **通过组合子问题的解来求解原问题**

**设计动态规划算法的步骤**

1. 刻画一个最优解的结构特征
2. 递归地定义**最优解**的值
3. 计算最优解的值，通常采用**自底向上**的方法
4. 利用计算出的信息构造一个最优解



#### 算法应用原理

##### 最优子结构

1. **最优解的第一个组成部分是做出一个选择**，例如选择钢条的切割位置，选择矩阵链的划分位置。**做出这次选择会产生一个或多个待解的子问题**

##### 重叠子问题

##### 重构最优解

- 备忘

#### 钢条切割问题

#### 实例：绳子分隔问题, n为绳子长度。

```java
public int cut(int n) {
    int[] dp = new int[n + 1];
    dp[1] = 1;
    dp[2] = 2;
    dp[3] = 3;
    for (int i = 4; i <= n; i++) {
        for (int j = 1; j < i; j++) {
            dp[i] = Math.max(dp[i], dp[j] * dp[i - j]);
        }
    }
    return dp[n];
}
```

#### 矩阵链乘法顺序

```java
public static void main(String[] args) {
        matrix(new int[]{10, 100, 50, 30, 40, 5000});
}
    
public static void matrix(int[] p) {
    int n = p.length;
    int[][] m = new int[n][n];
    for (int w = 1; w < n; w++) {
        for (int i = 0; i < n - w + 1; i++) {
            int j = i + w - 1;
            m[i][j] = Integer.MAX_VALUE;
            for (int k = i; k < j; k++) {
                System.out.printf("%s,%s%n", i, j);
                int c = m[i][k] + m[k + 1][j] + 1;
                if (c < m[i][j]) {
                    m[i][j] = c;
                }
            }
            System.out.println("====");
        }
    }
}

//        1,2
//        ====
//        2,3
//        ====
//        3,4
//        ====
//        4,5
//        ====
//        1,3
//        1,3
//        ====
//        2,4
//        2,4
//        ====
//        3,5
//        3,5
//        ====
//        1,4
//        1,4
//        1,4
//        ====
//        2,5
//        2,5
//        2,5
//        ====
//        1,5
//        1,5
//        1,5
//        1,5
//        ====
```

**逻辑图**

![](https://cdn.clinan.xyz/dp.svg)



#### 回文字串问题



### MIT 计算过程

1. define subproblems。判断子问题是前缀，还是后缀。或者是子串。
2. Guess (part of solution),  尝试所有可能的选择，并选取最好的。choices for guess。 the least subproblem what is?
3. relate subproblem solutions。recurrent(重复的做，递归)
4. recurse & memoize, or build Dp table bottom-up
5. solve original problem

例如`LaTex` 英文排版换行，一个单词不能被隔断。

1. subproblems: `words[i]`
2. guess: `words[k,n-k]`, 第二行
3. relate: words[i]+badness[i,j]





### 贪心算法

1. 每一步都追求局部最优



## 图

### 基本的图算法

**稀疏图**（邻接链表）

E：边的条数，V：顶点个数


$$
|E|<<|V|^2
$$
**稠密图**(邻接矩阵)


$$
|E|接近于|V|^2
$$

#### BFS（广度优先搜索）

在概念上，将每个节点涂上白色，遍历过就涂上灰色或黑色。初始化所有节点为白色。

一般用栈来遍历

#### DFS

一般使用递归进行遍历。

### 最小生成树



### 最短路径（Dijkstra算法）





# 做题经验

## 双指针

如果最后要输出不重复的数组，则需要对原数组进行`Arrays.sort(nums)`。

### 四数之和

- 集合版本

    ```java
    public List<List<Integer>> fourSum(int[] nums, int target) {
        List<List<Integer>> res = new ArrayList<>();
        if (nums.length < 4) {
            return res;
        }
        Arrays.sort(nums);
        HashSet<String> set = new HashSet<>();
        for (int ii = 0; ii < nums.length; ii++) {
            for (int iii = ii + 1; iii < nums.length; iii++) {
                int i = iii + 1, j = nums.length - 1;
                while (i < j) {
                    int sum = nums[ii] + nums[iii] + nums[i] + nums[j];
                    if (sum == target) {
                        String s = String.format("%s,%s,%s,%s", nums[ii], nums[iii], nums[i], nums[j]);
                        if (set.add(s)) {
                            List<Integer> a = new ArrayList<>();
                            a.add(nums[ii]);
                            a.add(nums[iii]);
                            a.add(nums[i]);
                            a.add(nums[j]);
                            res.add(a);
                        }
                        // 这个很重要
                        i++;
                        j--;
                        continue;
                    }
                    // 一定要重起一个if, 最好这样处理，不要else if
                    if (sum < target) {
                        i++;
                    } else {
                        j--;
                    }
                }
            }
        }
        return res;
    }
    ```

