# 大数据量导出

## 结果

  52w的数据  1g内存 ，143369ms，在导出时，没有触发JVM Full GC

```
[GC (Allocation Failure) [PSYoungGen: 319380K->14921K(327168K)] 479530K->175183K(1026560K), 0.0069491 secs] [Times: user=0.11 sys=0.00, real=0.01 secs] 
[GC (Allocation Failure) [PSYoungGen: 322121K->5146K(328192K)] 482383K->165546K(1027584K), 0.0045758 secs] [Times: user=0.00 sys=0.00, real=0.00 secs] 
[GC (Allocation Failure) [PSYoungGen: 312346K->6444K(329216K)] 472746K->166975K(1028608K), 0.0035289 secs] [Times: user=0.00 sys=0.00, real=0.00 secs] 
[GC (Allocation Failure) [PSYoungGen: 315180K->10535K(328704K)] 475711K->171196K(1028096K), 0.0048634 secs] [Times: user=0.13 sys=0.00, real=0.01 secs] 
[GC (Allocation Failure) [PSYoungGen: 319271K->15016K(327680K)] 479932K->175796K(1027072K), 0.0063843 secs] [Times: user=0.13 sys=0.00, real=0.01 secs] 
[GC (Allocation Failure) [PSYoungGen: 323240K->4058K(328704K)] 484020K->164984K(1028096K), 0.0028917 secs] [Times: user=0.00 sys=0.00, real=0.00 secs] 
[GC (Allocation Failure) [PSYoungGen: 312282K->5404K(329216K)] 473208K->166469K(1028608K), 0.0034874 secs] [Times: user=0.02 sys=0.00, real=0.00 secs] 
[GC (Allocation Failure) [PSYoungGen: 314140K->9661K(328704K)] 475205K->170864K(1028096K), 0.0048404 secs] [Times: user=0.00 sys=0.00, real=0.01 secs] 
[GC (Allocation Failure) [PSYoungGen: 318397K->13955K(328704K)] 479600K->175253K(1028096K), 0.0059009 secs] [Times: user=0.13 sys=0.00, real=0.01 secs] 
[GC (Allocation Failure) [PSYoungGen: 323203K->8861K(329216K)] 484501K->170305K(1028608K), 0.0084306 secs] [Times: user=0.00 sys=0.00, real=0.01 secs] 
[GC (Allocation Failure) [PSYoungGen: 318109K->4758K(330240K)] 479553K->166332K(1029632K), 0.0032841 secs] [Times: user=0.00 sys=0.00, real=0.00 secs] 
[GC (Allocation Failure) [PSYoungGen: 316054K->7950K(330240K)] 477628K->169647K(1029632K), 0.0041031 secs] [Times: user=0.00 sys=0.00, real=0.00 secs] 
[GC (Allocation Failure) [PSYoungGen: 319246K->11380K(330752K)] 480943K->173215K(1030144K), 0.0051382 secs] [Times: user=0.00 sys=0.00, real=0.00 secs] 
[GC (Allocation Failure) [PSYoungGen: 323700K->14986K(327680K)] 485535K->176932K(1027072K), 0.0068161 secs] [Times: user=0.13 sys=0.00, real=0.01 secs] 
[GC (Allocation Failure) [PSYoungGen: 327306K->8055K(330240K)] 489252K->170140K(1029632K), 0.0078266 secs] [Times: user=0.13 sys=0.00, real=0.01 secs] 
```



## SAX

SAX（simple API for XML）是一种[XML](https://baike.baidu.com/item/XML/86251)解析的替代方法。相比于[DOM](https://baike.baidu.com/item/DOM/50288)，SAX是一种速度更快，更有效的方法。它[逐行扫描](https://baike.baidu.com/item/逐行扫描/1528535)文档，一边扫描一边解析。而且相比于DOM，SAX可以在解析文档的任意时刻停止[解析](https://baike.baidu.com/item/解析/13016039)，但任何事物都有其相反的一面，对于SAX来说就是操作复杂。

SAX，它既是一个接口，也是一个软件包.但作为接口，SAX是[事件驱动](https://baike.baidu.com/item/事件驱动)型XML解析的一个标准接口不会改变 SAX的工作原理简单地说就是对文档进行顺序扫描，当扫描到文档（document）开始与结束、元素（element）开始与结束、文档（document）结束等地方时通知事件处理函数，由事件处理函数做相应动作，然后继续同样的扫描，直至文档结束。

### POI对SAX的实现

https://poi.apache.org/components/spreadsheet/how-to.html

## 注意内存的回收

## 代码

```java

// 大数据量导出测试 SXSSF + 避免innodb回表查询
public class SaxExportTester extends MockTester {
    private final Logger logger = LoggerFactory.getLogger(this.getClass());
    // 由于查询条件复杂，先插入正确数据的ID,最后再走ID索引查询数据，导出到文件
    private static final int MAX_ID_LENGTH = 52 * 10000;
    // 每次从数据库查询并插入，插入多少条数据，内存大的话，可以加大，提升效率
    private static final int ID_PARTITION = 1000;
    // 100是sxssf流窗口大小，可以根据可用内存适当增大 keep 100 rows in memory, exceeding rows will be flushed to disk
    private static final int SXSSF_WINDOW_SIZE = 100;

    @Test
    public void export() throws Exception {
        // JVM 参数 -XX:+PrintGCDetails -Xms1024M -Xmx1024M
        //order_info数据量 1 3463 9344  字段有96个
        long start = System.currentTimeMillis();
        DruidDataSource druid = properties.getProperties().get(1).getDruid();
        DruidPooledConnection connection = druid.getConnection();
        SqlRunner sqlRunner = new SqlRunner(connection);
        // 由于订单的查询涉及到
        String sql = new SQL() {{
            // 不一定是查询订单表，也可以查询订单的子表，只要能够拿到订单ID的都可以，所以支持面很广
            SELECT("order_id").FROM("oms.order_info")
                .WHERE(" create_time >'2018-01-01 00:00:00'")
                    // 这里不能很多，因为id驻留在内存，多的话，可以考虑分块持久化后，再按需查询
                    .LIMIT(MAX_ID_LENGTH);
        }}.toString();
        logger.info(sql);
        List<Map<String, Object>> maps = sqlRunner.selectAll(sql);
        List<Integer> idList = maps.stream().map(x -> Integer.valueOf(x.get("ORDER_ID")
                .toString())).collect(Collectors.toList());
        maps = null;
        List<List<Integer>> partition = Lists.partition(idList, ID_PARTITION);
        // 回收内存
        idList = null;
        // 使用sxssf  https://poi.apache.org/components/spreadsheet/how-to.html
        SXSSFWorkbook workbook = new SXSSFWorkbook(SXSSF_WINDOW_SIZE);
        Sheet sheet = workbook.createSheet("order_info");
        Integer rowIndex = 0;
        for (List<Integer> ids : partition) {
            rowIndex = toExcelWithSelect(ids, sqlRunner, sheet, rowIndex);
            logger.info("导出进度：{}%", (rowIndex * 100 / MAX_ID_LENGTH));
        }
        File file = new File("D:\\export.xlsx");
        FileOutputStream out = new FileOutputStream(file);
        workbook.write(out);
        out.close();
        workbook.dispose();
        logger.info("耗时：{}ms", System.currentTimeMillis() - start);
    }

    private Integer toExcelWithSelect(List<Integer> integers, SqlRunner sqlRunner, Sheet sheet, Integer rowIndex) throws Exception {
        String sql = "select * from oms.order_info where order_id in (" + integers.stream().map(String::valueOf)
                .collect(Collectors.joining(",")) + ")";
        List<Map<String, Object>> maps = sqlRunner.selectAll(sql);
        return toExcel(maps, sheet, rowIndex);
    }

    private Integer toExcel(List<Map<String, Object>> maps, Sheet sheet, Integer rowIndex) {
        if (CollectionUtils.isEmpty(maps)) {
            return rowIndex;
        }
        Map<String, Object> firstRow = maps.get(0);
        String[] headers = firstRow.keySet().toArray(new String[0]);
        if (rowIndex == 0) {
            Row row = sheet.createRow(0);
            for (int i = 0; i < headers.length; i++) {
                Cell cell = row.createCell(i);
                cell.setCellValue(headers[i]);
            }
            rowIndex++;
        }
        for (int j = 0, mapsSize = maps.size(); j < mapsSize; j++) {
            Map<String, Object> map = maps.get(j);
            Row row = sheet.createRow(rowIndex++);
            for (int i = 0; i < headers.length; i++) {
                Cell cell = row.createCell(i);
                Object val = map.get(headers[i]);
                if (val == null) {
                    cell.setCellValue("");
                } else if (val instanceof Date) {
                    cell.setCellValue((Date) val);
                } else {
                    cell.setCellValue(val.toString());
                }
            }
            // 用完这条数据，就把数据清空
            maps.set(j, null);
        }
        // 用完这条数据，就把数据清空
        maps = null;
        return rowIndex;
    }
}
```

