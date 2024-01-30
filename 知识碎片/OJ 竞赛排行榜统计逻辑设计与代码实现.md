# OJ 竞赛排行榜统计逻辑设计与代码实现

> 作者：[南侠](https://gitee.com/crzzx)，[编程导航星球](https://wx.zsxq.com/dweb2/index/group/51122858222824) 编号 29240

介绍实现竞赛排行榜功能的设计思路和代码实现，包括数据库表设计和代码逻辑设计（Java）

## 引言

排行榜功能在各类竞赛中都扮演着至关重要的角色，特别是在在线评测（OJ）竞赛中，其不可或缺的存在使得竞赛更具有活力和竞争性。排行榜以直观的方式呈现了参赛者的表现，为竞赛举办方提供了全面而清晰的数据，有助于深入了解参与者的水平、策略和表现。 通过排行榜功能，竞赛主办方能够迅速准确地了解每位参赛选手的最优答题情况。这不仅有助于评估个体的实力和技能水平，还为组织者提供了一个全景视图，使其能够比较各参赛者之间的相对表现。这样的比较不仅有助于确认竞赛结果，还能为颁奖和奖励制度的制定提供有力的参考依据。 排行榜功能的扩展进一步增强了竞赛的可视化和分析性质。通过引入更多的数据维度，如解答速度、正确率、题目难度等，排行榜不仅呈现了参赛者的总体排名，还提供了更为详细和深入的分析。这样的深度分析有助于识别优秀选手在特定方面的优势，为奖励制度的个性化设计提供了基础。 此外，排行榜功能也为参赛者提供了实时的竞技体验。他们可以随时了解自己在比赛中的排名，并与其他选手进行比较。这种实时性的反馈不仅能够激发竞争激情，还有助于参赛者更好地调整策略，迅速适应竞技环境，提高个人表现。 总体而言，排行榜功能的扩展不仅为竞赛主办方提供了更全面的参赛者数据，也为参赛者带来了更加激烈和有趣的竞技体验。这种功能的不断升级和优化将进一步推动竞赛的发展，为广大参与者和组织者带来更为丰富和满足的竞技体验。

## 分析

根据引言部分，我们可以分析出排行榜功能设计时要注意的关键点：

1. **尽可能实时**：**尽可能**实时而不是说**完全**实时，是因为用户答题数据的提交、更新统计不是实时的（答题者很多，我们要对提交的答案做异步处理，以提升用户体验，而异步就意味着不一定实时）
2. 展示参赛者**最优**答题情况：要维护竞赛下各用户每个题目的**最优答题情况**，作为题目的最好成绩
3. 排行榜排名标准一般是：总分->总耗时->总耗用空间：这个顺序并不绝对，但要固定
4. 排行榜数据仅在竞赛开始后可见：即竞赛前：不可见；竞赛中：动态变化；竞赛后：可见但不变（可由不能提交题目控制）

## 设计思路

影响排行榜数据的主要包含：答题模块和统计模块，答题模块重在更新，统计模块重在统计和返回形式的转换。 ![](https://pic.yupi.icu/5563/202401161913578.png)

## 数据库设计

### 概览

竞赛模块，一共可设计三张表：

1. game：竞赛表，包含竞赛的基本信息
2. user_game：用户-竞赛关联表，绑定每个竞赛下的用户
3. game_question：竞赛-题目关联表，维护每个竞赛下的题目
4. game_rank：竞赛-排名表，记录每个竞赛中每个用户的总分、总耗时、总空间和各题目的最优答题情况集合（json字符串存储）

### game_rank

#### 结构：

![](https://pic.yupi.icu/5563/202401161913283.png) 虽然总分、总耗时和总耗用空间可以根据最优答题情况（gameDetail）动态生成，但每次都要变动，尤其竟赛结束后还要动态计算时间是有点浪费了点，于是用一点空间换时间，况且，维护也不麻烦。 另外，竞赛详情（gameDetail）的对象结构如下： ![](https://pic.yupi.icu/5563/202401161913561.png)

1. gameId和userId作为竞赛和排行模块重要的参数，记录一下有利于后续的排行榜数据统计和未来可能的功能拓展。
2. submitDetail用map方式存储，再合适不过

#### sql代码：

```sql
-- ----------------------------
-- Table structure for game_rank
-- ----------------------------
DROP TABLE IF EXISTS `game_rank`;
CREATE TABLE `game_rank`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  `gameId` bigint NULL DEFAULT NULL COMMENT '竞赛id',
  `userId` bigint NULL DEFAULT NULL COMMENT '用户id',
  `userName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '用户昵称',
  `totalMemory` int NULL DEFAULT NULL COMMENT '总空间（kb）',
  `totalTime` int NULL DEFAULT NULL COMMENT '总用时（ms）',
  `totalScore` int NULL DEFAULT NULL COMMENT '总得分',
  `gameDetail` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '竞赛详情',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `isDelete` tinyint NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_gameId`(`gameId` ASC) USING BTREE,
  INDEX `idx_userId`(`userId` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 19 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;
```

## 代码设计与实现

### 实体类设计

在排行榜模块中，涉及的实体类及其关系图如下：

1. GameRank
2. GameDetail
3. GameDetailUnit
4. GameRankDetail

![](https://pic.yupi.icu/5563/202401161913873.png)

实体代码如下：

1. **GameRank**

```java
package sspu.zzx.sspuoj.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

/**
 * @author ZZX
 * @TableName game_rank
 */
@TableName(value = "game_rank")
@Data
public class GameRank implements Serializable
{
    /**
     * id
     */
    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 竞赛id
     */
    private Long gameId;

    /**
     * 用户id
     */
    private Long userId;

    /**
     * 用户昵称
     */
    private String userName;

    /**
     * 提交总空间消耗
     */
    private Integer totalMemory;

    /**
     * 提交总耗时
     */
    private Integer totalTime;

    /**
     * 竞赛总得分
     */
    private Integer totalScore;

    /**
     * 竞赛详情
     */
    private String gameDetail;

    /**
     * 创建时间
     */
    @TableField(fill = FieldFill.INSERT)
    private Date createTime;

    /**
     * 更新时间
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Date updateTime;

    /**
     * 是否删除
     */
    private Integer isDelete;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}
```

1. **GameDetail**

```java
package sspu.zzx.sspuoj.model.dto.game;

import lombok.Data;

import java.io.Serializable;
import java.util.Map;

/**
 * @version 1.0
 * @Author ZZX
 * @Date 2024/1/10 16:01
 */
@Data
public class GameDetail implements Serializable
{
    /**
     * 竞赛id
     */
    private Long gameId;

    /**
     * 用户id
     */
    private Long userId;

    /**
     * 题目提交详情
     * key：题目id
     * val：最优答题情况
     */
    private Map<Long, GameDetailUnit> submitDetail;

    private static final long serialVersionUID = 1L;
}
```

1. **GameDetailUnit**

```java
package sspu.zzx.sspuoj.model.dto.game;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * @version 1.0
 * @Author ZZX
 * @Date 2024/1/10 10:47
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class GameDetailUnit implements Serializable
{
    /**
     * 单题id
     */
    private Long id;

    /**
     * 单题名称
     */
    private String name;

    /**
     * 单题得分
     */
    private Integer score;

    /**
     * 单题耗时
     */
    private Integer timeCost;

    /**
     * 单题耗内存
     */
    private Integer memoryCost;

    /**
     * 比较是否比另一个好
     *
     * @param other
     * @return
     */
    public boolean isBetter(GameDetailUnit other)
    {
        // 首先比较分数是否更大
        if (this.score > other.getScore())
        {
            return true;
        }
        if (this.score < other.getScore())
        {
            return false;
        }
        // 其次比较耗时是否更少
        if (this.timeCost < other.getTimeCost())
        {
            return true;
        }
        if (this.timeCost > other.getTimeCost())
        {
            return false;
        }
        // 最后比较耗费空间是否更少
        if (this.memoryCost < other.getMemoryCost())
        {
            return true;
        }
        return false;
    }

    private static final long serialVersionUID = 1L;
}
```

1. **GameRankDetail**

```java
package sspu.zzx.sspuoj.model.vo.game;

import lombok.Data;
import sspu.zzx.sspuoj.model.dto.game.GameDetailUnit;

import java.io.Serializable;
import java.util.List;

/**
 * @version 1.0
 * @Author ZZX
 * @Date 2024/1/10 16:06
 */
@Data
public class GameRankDetail implements Serializable
{
    /**
     * 名次
     */
    private Integer rankOrder;

    /**
     * 答题者id
     */
    private Long userId;

    /**
     * 答题者昵称
     */
    private String userName;

    /**
     * 总分
     */
    private Integer totalScore;

    /**
     * 总耗时
     */
    private Integer totalTime;

    /**
     * 总耗用内存
     */
    private Integer totalMemory;

    /**
     * 最优答题情况集合
     */
    private List<GameDetailUnit> questionDetails;

    private static final long serialVersionUID = 1L;
}
```

### 判题模块

这块在答题模块有用到，因为要等待异步的判题结果：

```java
    /**
     * 提交题目
     *
     * @param questionSubmitAddRequest
     * @param loginUser
     * @return
     */
    @Override
    public long doQuestionSubmit(QuestionSubmitAddRequest questionSubmitAddRequest, User loginUser)
    {
        // 校验编程语言是否合法
        String language = questionSubmitAddRequest.getLanguage();
        QuestionSubmitLanguageEnum languageEnum = QuestionSubmitLanguageEnum.getEnumByValue(language);
        if (languageEnum == null)
        {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "编程语言错误");
        }
        long questionId = questionSubmitAddRequest.getQuestionId();
        // 判断实体是否存在，根据类别获取实体
        Question question = questionService.getById(questionId);
        if (question == null)
        {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR);
        }
        // 是否已提交题目
        long userId = loginUser.getId();
        // 检查是否存在该用户提交该题目但正在判题的记录
        QueryWrapper<QuestionSubmit> wrapper = new QueryWrapper<>();
        wrapper.eq("userId", userId);
        wrapper.eq("questionId", questionId);
        wrapper.eq("status", QuestionSubmitStatusEnum.WAITING.getValue());
        QuestionSubmit waitingQuestionSubmit = this.getOne(wrapper);
        if (waitingQuestionSubmit != null)
        {
            throw new BusinessException(ErrorCode.API_REQUEST_ERROR, "题目正在判题中，请勿重复提交！");
        }
        // 每个用户串行提交题目
        QuestionSubmit questionSubmit = new QuestionSubmit();
        questionSubmit.setUserId(userId);
        questionSubmit.setQuestionId(questionId);
        questionSubmit.setCode(questionSubmitAddRequest.getCode());
        questionSubmit.setLanguage(language);
        // 设置初始状态
        questionSubmit.setStatus(QuestionSubmitStatusEnum.WAITING.getValue());
        questionSubmit.setJudgeInfo("{}");
        boolean save = this.save(questionSubmit);
        if (!save)
        {
            throw new BusinessException(ErrorCode.SYSTEM_ERROR, "数据插入失败");
        }
        Long questionSubmitId = questionSubmit.getId();
        // 异步执行判题服务
        CompletableFuture.runAsync(() ->
        {
            judgeService.doJudge(questionSubmitId);
            // 同时更新题目的通过数和通过总数
            question.setSubmitNum(question.getSubmitNum() + 1);
            QuestionSubmit resQuestionSubmit = this.getById(questionSubmitId);
            String judgeInfo = resQuestionSubmit.getJudgeInfo();
            JSONObject jsonObject = JSON.parseObject(judgeInfo);
            if (JudgeInfoMessageEnum.ACCEPTED.getValue().equals(jsonObject.getString("message")))
            {
                question.setAcceptedNum(question.getAcceptedNum() + 1);
            }
            this.questionService.updateById(question);
        });
        return questionSubmitId;
    }
package sspu.zzx.sspuoj.model.judge.model;

import lombok.Data;

/**
 * 判题信息
 */
@Data
public class JudgeInfo {

    /**
     * 程序执行信息
     */
    private String message;

    /**
     * 消耗内存
     */
    private Long memory;

    /**
     * 消耗时间（KB）
     */
    private Long time;
}
```

### 答题模块

![](https://pic.yupi.icu/5563/202401161913586.png) 处理提交题目的代码如下（逻辑看注释)

```java
 @Override
    public Long questionSubmit(GameQuestionSubmitRequest gameQuestionSubmitRequest)
    {
        QuestionSubmitAddRequest questionSubmitAddRequest = gameQuestionSubmitRequest.getQuestionSubmitAddRequest();
        Long gameId = gameQuestionSubmitRequest.getGameId();
        if (questionSubmitAddRequest == null || gameId == null)
        {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        Game game = gameMapper.selectById(gameId);
        if (game == null)
        {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR, "竞赛不存在");
        }
        Date startTime = game.getStartTime();
        Date endTime = game.getEndTime();
        // 判断竞赛是否已经开始
        Date currentDate = new Date();
        if (startTime.after(currentDate))
        {
            throw new BusinessException(ErrorCode.OPERATION_ERROR, "竞赛未开始");
        }
        // 判断竞赛是否已经结束
        if (endTime.before(currentDate))
        {
            throw new BusinessException(ErrorCode.OPERATION_ERROR, "竞赛已结束");
        }
        final User loginUser = userService.getLoginUser(null);
        long submitId = questionSubmitService.doQuestionSubmit(questionSubmitAddRequest, loginUser);
        // 同时异步更新排行榜信息
        CompletableFuture.runAsync(() ->
        {
            // 更新用户提交成绩信息
            QuestionSubmit nowSubmit = questionSubmitService.getById(submitId);
            // 获得该竞赛各题目的满分
            QueryWrapper<GameQuestion> gameQuestionQueryWrapper = new QueryWrapper<>();
            gameQuestionQueryWrapper.eq("gameId", gameId);
            List<GameQuestion> gameQuestionList = gameQuestionMapper.selectList(gameQuestionQueryWrapper);
            Map<Long, Integer> questionIdToFullScore = gameQuestionList.stream().collect(Collectors.toMap(GameQuestion::getQuestionId, GameQuestion::getFullScore));
            // 获得当前用户在当前竞赛中的提交信息
            QueryWrapper<GameRank> gameRankQueryWrapper = new QueryWrapper<>();
            gameRankQueryWrapper.eq("userId", loginUser.getId()).eq("gameId", gameId);
            GameRank gameRank = gameRankMapper.selectOne(gameRankQueryWrapper);
            // 为空新建一个gameRank记录并将当前答题情况插入更新（因为第一次统计时，还没新建这个记录）
            if (gameRank == null)
            {
                gameRank = new GameRank();
                gameRank.setUserId(loginUser.getId());
                gameRank.setUserName(loginUser.getUserName());
                gameRank.setGameId(gameId);
                GameDetail gameDetail = new GameDetail();
                gameDetail.setGameId(gameId);
                gameDetail.setUserId(loginUser.getId());
                Map<Long, GameDetailUnit> gameDetailUnitMap = new HashMap<>();
                GameDetailUnit gameDetailUnit = getGameDetailUnit(nowSubmit, questionIdToFullScore);
                gameDetailUnitMap.put(nowSubmit.getQuestionId(), gameDetailUnit);
                gameDetail.setSubmitDetail(gameDetailUnitMap);
                gameRank.setGameDetail(JSONUtil.toJsonStr(gameDetail));
                gameRank.setTotalScore(gameDetailUnit.getScore());
                gameRank.setTotalMemory(gameDetailUnit.getMemoryCost());
                gameRank.setTotalTime(gameDetailUnit.getTimeCost());
                gameRankMapper.insert(gameRank);
            }
            // gameDetail()为空时，则将当前答题情况插入更新
            else if (StringUtils.isBlank(gameRank.getGameDetail()))
            {
                GameDetail gameDetail = new GameDetail();
                gameDetail.setGameId(gameId);
                gameDetail.setUserId(loginUser.getId());
                Map<Long, GameDetailUnit> gameDetailUnitMap = new HashMap<>();
                GameDetailUnit gameDetailUnit = getGameDetailUnit(nowSubmit, questionIdToFullScore);
                gameDetailUnitMap.put(nowSubmit.getQuestionId(), gameDetailUnit);
                gameDetail.setSubmitDetail(gameDetailUnitMap);
                gameRank.setGameDetail(JSONUtil.toJsonStr(gameDetail));
                gameRank.setTotalScore(gameDetailUnit.getScore());
                gameRank.setTotalMemory(gameDetailUnit.getMemoryCost());
                gameRank.setTotalTime(gameDetailUnit.getTimeCost());
                gameRankMapper.updateById(gameRank);
            } else
            {
                // 对比两个版本的当前题目提交信息，保留最优的
                GameDetail dbGameDetail = JSONUtil.toBean(gameRank.getGameDetail(), GameDetail.class);
                Map<Long, GameDetailUnit> dbSubmitDetail = dbGameDetail.getSubmitDetail();
                // 获得数据库已有的该题目提交信息
                GameDetailUnit dbGameDetailUnit = dbSubmitDetail.get(nowSubmit.getQuestionId());
                // 组装当前的该题目提交信息
                GameDetailUnit gameDetailUnit = getGameDetailUnit(nowSubmit, questionIdToFullScore);
                if (dbGameDetailUnit == null)
                {
                    dbSubmitDetail.put(nowSubmit.getQuestionId(), gameDetailUnit);
                    dbGameDetail.setSubmitDetail(dbSubmitDetail);
                    gameRank.setGameDetail(JSONUtil.toJsonStr(dbGameDetail));
                    gameRank.setTotalScore(gameRank.getTotalScore() + gameDetailUnit.getScore());
                    gameRank.setTotalMemory(gameRank.getTotalMemory() + gameDetailUnit.getMemoryCost());
                    gameRank.setTotalTime(gameRank.getTotalTime() + gameDetailUnit.getTimeCost());
                    gameRankMapper.updateById(gameRank);
                } else
                {
                    // 如果新的优于目前的
                    if (gameDetailUnit.isBetter(dbGameDetailUnit))
                    {
                        dbSubmitDetail.put(nowSubmit.getQuestionId(), gameDetailUnit);
                        dbGameDetail.setSubmitDetail(dbSubmitDetail);
                        gameRank.setGameDetail(JSONUtil.toJsonStr(dbGameDetail));
                        gameRank.setTotalScore(gameRank.getTotalScore() - dbGameDetailUnit.getScore() + gameDetailUnit.getScore());
                        gameRank.setTotalMemory(gameRank.getTotalMemory() - dbGameDetailUnit.getMemoryCost() + gameDetailUnit.getMemoryCost());
                        gameRank.setTotalTime(gameRank.getTotalTime() - dbGameDetailUnit.getTimeCost() + gameDetailUnit.getTimeCost());
                        gameRankMapper.updateById(gameRank);
                    }
                }
            }
        });
        return submitId;
    }
    public GameDetailUnit getGameDetailUnit(QuestionSubmit nowSubmit, Map<Long, Integer> questionIdToFullScore)
    {
        GameDetailUnit gameDetailUnit = new GameDetailUnit();
        gameDetailUnit.setId(nowSubmit.getQuestionId());
        Question question = questionService.getById(nowSubmit.getQuestionId());
        gameDetailUnit.setName(question.getTitle());
        if (StringUtils.isBlank(nowSubmit.getJudgeInfo()) || "{}".equals(nowSubmit.getJudgeInfo()))
        {
            try
            {
                // todo 有死循环隐患，因为可能这块依赖于答题结果是否在异步处理后获得答题情况值，后续再优化
                while (StringUtils.isBlank(nowSubmit.getJudgeInfo()) || "{}".equals(nowSubmit.getJudgeInfo()))
                {
                    TimeUnit.SECONDS.sleep(5);
                    nowSubmit = questionSubmitService.getById(nowSubmit.getId());
                }
            } catch (InterruptedException e)
            {
                e.printStackTrace();
            }
        }
        JudgeInfo judgeInfo = JSONUtil.toBean(nowSubmit.getJudgeInfo(), JudgeInfo.class);
        gameDetailUnit.setTimeCost(Math.toIntExact(judgeInfo.getTime()));
        gameDetailUnit.setMemoryCost(Math.toIntExact(judgeInfo.getMemory()));
        String judgeInfoMessage = judgeInfo.getMessage();
        // todo 打分逻辑后续可以再完善，等判题机写完后
        if (JudgeInfoMessageEnum.ACCEPTED.getValue().equals(judgeInfoMessage))
        {
            // 如果ACCEPTED则打满分
            gameDetailUnit.setScore(questionIdToFullScore.get(nowSubmit.getQuestionId()));
        } else
        {
            gameDetailUnit.setScore(0);
        }
        return gameDetailUnit;
    }
```

### 统计模块

![](https://pic.yupi.icu/5563/202401161913378.png) 处理排行榜数据和排序的代码如下（逻辑看注释)

```java
    @Override
    public List<GameRankDetail> getRankByGameId(long gameId)
    {
        // 获得竞赛的题目id
        QueryWrapper<GameQuestion> gameQuestionQueryWrapper = new QueryWrapper<>();
        gameQuestionQueryWrapper.eq("gameId", gameId);
        List<GameQuestion> gameQuestions = gameQuestionMapper.selectList(gameQuestionQueryWrapper);
        List<Long> gameQuestionIds = gameQuestions.stream().map(GameQuestion::getQuestionId).collect(Collectors.toList());
        // 获得参加竞赛的所有用户
        QueryWrapper<UserGame> userGameQueryWrapper = new QueryWrapper<>();
        userGameQueryWrapper.eq("gameId", gameId);
        List<UserGame> userGames = userGameMapper.selectList(userGameQueryWrapper);
        List<Long> userIds = userGames.stream().map(UserGame::getUserId).collect(Collectors.toList());
        // 计算用户最优答题集合
        List<GameRankDetail> gameRankDetails = new ArrayList<>(userGames.size());
        for (Long userId : userIds)
        {
            // 获得排名记录
            QueryWrapper<GameRank> gameRankQueryWrapper = new QueryWrapper<>();
            gameRankQueryWrapper.eq("userId", userId).eq("gameId", gameId);
            GameRank gameRank = gameRankMapper.selectOne(gameRankQueryWrapper);
            // 无排名记录则新建
            User user = userService.getById(userId);
            GameRankDetail gameRankDetail = new GameRankDetail();
            gameRankDetail.setUserId(userId);
            gameRankDetail.setUserName(user.getUserName());
            gameRankDetail.setTotalScore(0);
            gameRankDetail.setTotalMemory(0);
            gameRankDetail.setTotalTime(0);
            // 无排名记录则新建
            if (gameRank == null)
            {
                gameRank = new GameRank();
                gameRank.setGameId(gameId);
                gameRank.setUserId(userId);
                gameRank.setUserName(user.getUserName());
                gameRank.setTotalScore(0);
                gameRank.setTotalMemory(0);
                gameRank.setTotalTime(0);
                gameRankMapper.insert(gameRank);
                gameRankDetail.setQuestionDetails(getQuestionDetails(gameQuestionIds, null));
            } else
            {
                // 有排名记录但无这道题则新建
                if (StringUtils.isBlank(gameRank.getGameDetail()))
                {
                    gameRankDetail.setQuestionDetails(getQuestionDetails(gameQuestionIds, null));
                } else
                {
                    GameDetail gameDetail = JSONUtil.toBean(gameRank.getGameDetail(), GameDetail.class);
                    // 统计总分、总耗时和总好空间
                    calcGameDetailConfig(gameDetail, gameRankDetail);
                    // 更新题目详情
                    gameRankDetail.setQuestionDetails(getQuestionDetails(gameQuestionIds, gameDetail));
                }
            }
            gameRankDetails.add(gameRankDetail);
        }
        // 排序
        List<GameRankDetail> orderGameRankDetails = gameRankDetails.stream().sorted(Comparator.comparing(GameRankDetail::getTotalScore).reversed().thenComparing(GameRankDetail::getTotalTime).thenComparing(GameRankDetail::getTotalMemory)).collect(Collectors.toList());
        // 安排名次
        for (int i = 0; i < orderGameRankDetails.size(); i++)
        {
            orderGameRankDetails.get(i).setRankOrder(i + 1);
        }
        // 返回
        return orderGameRankDetails;
    }
```

## 效果展示

最终展示效果如下，可以达到尽可能显示的效果： 竞赛开始后，未答题前获取排行榜数据会设置初始值，类似下图： ![](https://pic.yupi.icu/5563/202401161913556.png) 有用户答题后会更新排行榜数据，类似下图： ![](https://pic.yupi.icu/5563/202401161913561.png)