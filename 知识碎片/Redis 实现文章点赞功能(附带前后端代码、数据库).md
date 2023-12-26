# Redis 实现文章点赞功能(附带前后端代码、数据库)

> 作者：[南侠](https://gitee.com/crzzx)，[编程导航星球](https://wx.zsxq.com/dweb2/index/group/51122858222824) 编号 29240

使用redis与mysql定期同步的方案实现点赞功能的相关逻辑设计和代码编写

## （1）前言及问题分析

点赞功能是很多社交平台和在线应用中常见的一个交互特性，它可以增强用户参与感、社交体验，并且有助于内容的推广。

### 关键特性：

1. **唯一性：** 每个用户对同一条内容只能点赞一次，确保用户不能多次重复点赞。
2. **即时性：** 点赞的反馈应该是即时的，用户点击点赞按钮后，系统应该迅速响应，不应有明显的延迟。
3. **可见性：** 点赞状态应该及时地反映在用户界面上，以便其他用户能够看到谁给某个内容点赞了。
4. **可撤销性：** 用户应该能够取消点赞，确保用户可以更改他们的喜好。
5. **计数和排名：** 点赞数量通常会被用于衡量内容受欢迎程度，所以需要对点赞数量进行实时的计数和排名。

## （2）功能方案图

![](https://pic.yupi.icu/5563/202312171829589.png)

## （3）功能点详情

### 1. 前端

在此方案中，前端涉及主要有以下几点：

1. 页面开发：每个组件库都有对应的组件可以使用，比如笔者使用的是Arco Design的卡片插槽，使用vue3集成，代码如下：

```vue
<template #actions>
        <span
          class="icon-hover"
          style="color: #f53f3f"
          @click="likeOrNot"
          v-if="likeState === true"
        >
          <IconHeartFill size="20"
        /></span>
        <span class="icon-hover" @click="likeOrNot" v-if="likeState === false">
          <IconHeart size="20" /></span
        ><span class="actionText">{{
          parseInt(solution.solutionLikes as any, 10) + 1
        }}</span>
</template>
```

1. 进入文章页面时，调用两个接口：1. 文章信息接口；2. 用户是否点赞状态查询接口
2. 用户点赞或取消点赞成功后：手动更新页面文章点赞数（因为redis和mysql同步并不实时，且点赞数是从相对滞后的mysql中查，所以，需要前端手动运算一下，确保给予用户正确的结果反馈，至于退出页面重新进入文章点赞数量不变的问题，其实无所谓，因为我们可以这么说：之所以没变，是因为其他人点赞补充了而已）
3. 承接3，同时，变更用户当前页面点赞状态，无需调用2中的点赞状态查询接口，这样可以提高一些效率

### 2. Redis

**点赞是一个频繁的操作。**

为什么使用Redis，那么首先是其必要性，以下是chatgpt给出的：

1. **快速读写：** Redis 是一个基于内存的高性能键值存储数据库，适合用于需要快速读写的场景，如点赞记录的存储和读取。
2. **计数器：** Redis 的原子性操作使其非常适合作为点赞计数器的后端存储，避免了并发操作导致的数据不一致问题。
3. **缓存：** Redis 可以用作缓存存储，可以缓解数据库负担，提高系统性能。例如，可以将点赞记录存储在 Redis 中，减轻对主数据库的访问压力。
4. **持久化：** Redis 支持数据持久化，可以在需要时将数据保存到磁盘，确保数据的可靠性。
5. **集合和排序集合：** Redis 的集合和排序集合数据结构非常适合用于存储用户点赞记录和计数。可以方便地进行添加、删除、查找等操作。
6. **分布式：** 在分布式系统中，Redis可以作为分布式锁的一部分，确保在高并发情况下点赞操作的一致性。

总的来说，使用 Redis 可以提高点赞功能的性能、可靠性和扩展性，使系统更加稳定和高效。

明确了必要性之后，本文方案主要使用了以下两个数据结构：

1. articleId-set：key=articleId，value=set（userId）
2. articleLike-hash：key=articleId，val=likesNum;

使用2主要是便于更快的查询当前文章的点赞数，提高效率，使1专注于点赞者的修改。

（相关代码在4（后端）中）

### 3. Mysql

涉及的表结构主要有两个：

1. 文章表（article）：articleId、likesNum。。。
2. 文章点赞表（article_like)：articleId、userId。。。

点赞信息稳定下来后，也是要持久化的，因此存到数据库是必要的。

参考代码：

```sql
/*
 Navicat Premium Data Transfer

 Source Server         : zzx
 Source Server Type    : MySQL
 Source Server Version : 80033 (8.0.33)
 Source Host           : localhost:3306
 Source Schema         : sspuoj_db_dev

 Target Server Type    : MySQL
 Target Server Version : 80033 (8.0.33)
 File Encoding         : 65001

 Date: 16/12/2023 18:24:31
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for question_solution
-- ----------------------------
DROP TABLE IF EXISTS `question_solution`;
CREATE TABLE `question_solution`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  `solutionLikes` bigint NULL DEFAULT 0 COMMENT '题解点赞数',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `isDelete` tinyint NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_id`(`id` ASC) USING BTREE,
  INDEX `idx_userId`(`userId` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 25 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

SET FOREIGN_KEY_CHECKS = 1;

-- ----------------------------
-- Table structure for article_likes
-- ----------------------------
DROP TABLE IF EXISTS `article_likes`;
CREATE TABLE `article_likes`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  `articleId` bigint NULL DEFAULT NULL COMMENT '文章id',
  `userId` bigint NULL DEFAULT NULL COMMENT '点赞人id',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `isDelete` tinyint NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

SET FOREIGN_KEY_CHECKS = 1;
```

### 4. 后端

主要服务有3个：

1. redis-mysql同步的定时任务
2. 查询用户是否点过赞
3. 用户点赞/取消点赞

下面我们结合代码来细说。

首先是2、3的service代码：

- 查询用户是否点过赞，只需根据articleId查到对应的set看里面有没有该用户
- 点赞和取消点赞，只需插入或删除set，增加或修改hash

```java
package sspu.zzx.sspuoj.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.SetOperations;
import org.springframework.stereotype.Service;
import sspu.zzx.sspuoj.mapper.ArticleLikesMapper;
import sspu.zzx.sspuoj.model.entity.ArticleLikes;
import sspu.zzx.sspuoj.service.ArticleLikesService;

import java.util.Collections;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

/**
 * @author ZZX
 * @description 针对表【article_likes】的数据库操作Service实现
 * @createDate 2023-12-12 15:14:24
 */
@Service
public class ArticleLikesServiceImpl extends ServiceImpl<ArticleLikesMapper, ArticleLikes> implements ArticleLikesService
{
    private final RedisTemplate<String, Object> redisTemplate;
    private final SetOperations<String, Object> setOperations;
    private final HashOperations<String, Object, Object> hashOperations;

    @Autowired
    public ArticleLikesServiceImpl(RedisTemplate<String, Object> redisTemplate)
    {
        this.redisTemplate = redisTemplate;
        this.setOperations = redisTemplate.opsForSet();
        this.hashOperations = redisTemplate.opsForHash();
    }

    // 添加用户到文章的点赞集合中，同时设置集合键永不过期
    public void addUserToLikeSet(Long articleId, Long userId)
    {
        Long add = setOperations.add(getArticleLikeSetKey(articleId), userId);
        // 设置集合键150年过期
        redisTemplate.expire(getArticleLikeSetKey(articleId), 365 * 150, TimeUnit.DAYS);
    }


    // 检查用户是否已经点赞
    public boolean isUserLiked(Long articleId, Long userId)
    {
        return Boolean.TRUE.equals(setOperations.isMember(getArticleLikeSetKey(articleId), userId));
    }

    // 设置文章的点赞数
    public void setArticleLikes(Long articleId, long likes)
    {
        hashOperations.put(getArticleLikesHashKey(), articleId, likes);
    }

    // 获取文章的点赞数
    public Long getArticleLikes(Long articleId)
    {
        Object likes = hashOperations.get(getArticleLikesHashKey(), articleId);
        return likes != null ? Long.parseLong(likes.toString()) : 0L;
    }

    // 获取文章点赞的用户ID集合
    public Set<Object> getArticleLikedUsers(Long articleId)
    {
        Set<Object> likedUsers = setOperations.members(getArticleLikeSetKey(articleId));
        return likedUsers != null ? likedUsers : Collections.emptySet();
    }


    // 移除用户从文章的点赞集合中
    public void removeUserFromLikeSet(Long articleId, Long userId)
    {
        setOperations.remove(getArticleLikeSetKey(articleId), userId);
    }

    // 获取文章的点赞集合的键
    private String getArticleLikeSetKey(Long articleId)
    {
        return "article:" + articleId + ":likes";
    }

    // 获取文章点赞数的哈希表键
    private String getArticleLikesHashKey()
    {
        return "article:likes";
    }

    // 点赞
    public void like(Long articleId, Long userId)
    {
        addUserToLikeSet(articleId, userId);
        Long likes = getArticleLikes(articleId);
        if (likes >= 0)
        {
            setArticleLikes(articleId, likes + 1);
        }
    }

    // 取消点赞
    public void cancelLike(Long articleId, Long userId)
    {
        if (isUserLiked(articleId, userId))
        {
            removeUserFromLikeSet(articleId, userId);
            Long likes = getArticleLikes(articleId);
            if (likes > 0)
            {
                setArticleLikes(articleId, likes - 1);
            }
        }
    }

    @Override
    public Boolean likeArticleOrNot(Long articleId, Long userId)
    {
        // 获得当前点赞文章的用户集合
        Set<Object> likeUsers = getArticleLikedUsers(articleId);
        // 如果存在该用户，就取消点赞
        if (likeUsers.size() > 0 && likeUsers.contains(userId))
        {
            cancelLike(articleId, userId);
            return false;
        }
        // 反之，点赞
        else
        {
            like(articleId, userId);
            return true;
        }
    }


    @Override
    public Boolean ifLiked(Long articleId, Long userId)
    {
        // 首先从redis检查，如果有，那么数据库里面最终也一定会有
        Set<Long> articleLikedUsers = getArticleLikedUsers(articleId).stream().map(e -> (Long) e).collect(Collectors.toSet());
        if (articleLikedUsers.contains(userId)) return true;
        /*
        这块感觉不用，保证实时性比较好，redis宕机后再同步就好了
        // 如果redis中没有，则从数据库中查，有则有，否则那确实是没有
        QueryWrapper<ArticleLikes> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("article_id", articleId);
        queryWrapper.eq("user_id", userId);
        List<ArticleLikes> list = this.list(queryWrapper);
        return !list.isEmpty();
         */
        return false;
    }
}
```

最后是，redis与mysql的同步代码（初版代码不是很优雅，但逻辑基本如此，仅供参考）

```java
package sspu.zzx.sspuoj.task;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import sspu.zzx.sspuoj.model.entity.ArticleLikes;
import sspu.zzx.sspuoj.model.entity.QuestionSolution;
import sspu.zzx.sspuoj.service.QuestionSolutionService;
import sspu.zzx.sspuoj.service.impl.ArticleLikesServiceImpl;

import java.util.*;
import java.util.stream.Collectors;

/**
 * @version 1.0
 * @Author ZZX
 * @Date 2023/12/12 16:54
 */
@Component
@Slf4j
public class ArticleLikesSynTask
{
    @Autowired
    private QuestionSolutionService questionSolutionService;
    @Autowired
    private ArticleLikesServiceImpl articleLikesService;

    /**
     * 定时同步文章点赞信息
     */
    @Scheduled(cron = "0 0 12 */1 * *") // 每1天
//    @Scheduled(cron = "0 */1 * * * *") // 每一分钟执行一次
    public void synArticleLikes()
    {
        log.info("定时同步文章点赞信息 - " + new Date());
        // 获取所有title不是【外部图文】的文章
        QueryWrapper<QuestionSolution> queryWrapper = new QueryWrapper<>();
        queryWrapper.ne("title", "外部图文");
        List<QuestionSolution> articles = questionSolutionService.list(queryWrapper);
        // 获取所有文章点赞集合
        List<ArticleLikes> articleLikes = articleLikesService.list();
        // 按文章id分组，Map的值为List<ArticleLikes>
        Map<Long, List<ArticleLikes>> idToArticleLikesMap = articleLikes.stream().collect(Collectors.groupingBy(ArticleLikes::getArticleId));
        // 定义要更新的question_solution
        List<QuestionSolution> toUpdateSolution = new ArrayList<>();
        // 定义最终要删除和添加的点赞记录
        List<ArticleLikes> toDeleteArticleLikes = new ArrayList<>();
        List<ArticleLikes> toAddArticleLikes = new ArrayList<>();
        for (QuestionSolution article : articles)
        {
            // 从redis中文章id对应的点赞数
            Long articleLikesFromRedis = articleLikesService.getArticleLikes(article.getId());
            // 从redis中文章id对应的具体点赞用户集合
            List<Long> articleLikedUserIds = articleLikesService.getArticleLikedUsers(article.getId()).stream().map(Object::toString) // 假设返回的元素是字符串类型，如果不是，可以根据实际情况调整
                    .map(Long::parseLong).collect(Collectors.toList());
            // 获得要删除的文章点赞记录
            List<ArticleLikes> articleLikesFromDB = idToArticleLikesMap.get(article.getId());
            if (articleLikesFromDB == null)
            {
                articleLikesFromDB = new ArrayList<>();
            }
            /*如果redis的点赞用户集合为空，则不执行删除和添加，
                这种情况我们认为redis宕机然后刚刚重启
                并将数据库中的对应数据同步至redis中
             */
            if (articleLikedUserIds.isEmpty())
            {
                for (ArticleLikes likes : articleLikesFromDB)
                {
                    articleLikesService.addUserToLikeSet(article.getId(), likes.getUserId());
                }
                articleLikesService.setArticleLikes(article.getId(), articleLikesFromDB.size());
                continue;
            }
            // 比较数目和结合的size，使其一致，以集合size为准，并更新article对应记录的点赞数
            long articleLikeListSize = Long.parseLong(articleLikesFromRedis.toString());
            if (articleLikesFromRedis.equals(articleLikeListSize))
            {
                articleLikesService.setArticleLikes(article.getId(), articleLikeListSize);
            }
            if (!article.getSolutionLikes().equals(articleLikeListSize))
            {
                article.setSolutionLikes(articleLikeListSize);
                toUpdateSolution.add(article);
            }
            Iterator<ArticleLikes> iterator = articleLikesFromDB.iterator();
            while (iterator.hasNext())
            {
                ArticleLikes likes = iterator.next();
                if (!articleLikedUserIds.contains(likes.getUserId()))
                {
                    toDeleteArticleLikes.add(likes);
                }
            }
            // 获得要添加的文章点赞记录
            List<Long> collectUserIdFromDB = articleLikesFromDB.stream().map(ArticleLikes::getUserId).collect(Collectors.toList());
            for (Long articleLikedUserId : articleLikedUserIds)
            {
                if (!collectUserIdFromDB.contains(articleLikedUserId))
                {
                    ArticleLikes articleLikes1 = new ArticleLikes();
                    articleLikes1.setArticleId(article.getId());
                    articleLikes1.setUserId(articleLikedUserId);
                    toAddArticleLikes.add(articleLikes1);
                }
            }
        }
        // 更新question_solution表
        if (toUpdateSolution.size() > 0)
        {
            questionSolutionService.updateBatchById(toUpdateSolution);
        }
        // 更新article_likes表中的字段（删除和添加）
        if (toDeleteArticleLikes.size() > 0)
        {
            articleLikesService.removeByIds(toDeleteArticleLikes.stream().map(ArticleLikes::getId).collect(Collectors.toList()));
        }
        if (toAddArticleLikes.size() > 0)
        {
            articleLikesService.saveBatch(toAddArticleLikes);
        }
    }
}
```

其中，考虑到**redis有可能宕机**（因为资源有限，redis没有集群，而且就算有集群，也有可能都挂）的问题，本方案是将redis中set不存在或为空，作为判别标志。在同步时，如果发现redis的set为空，则mysql向redis同步，否则就是redis向mysql同步。这种方案的好处是，判别方便，缺点就是，处理不了所有人对所有文章都不点赞的情况，但这种情况出现的概率比较少，且就算出现，也能容忍，于是采取该方案。

## （4）总结

下面是更新后的要点总结，包括处理Redis宕机的逻辑：

### 前端部分：

1. 页面开发：使用组件库中的组件，如Arco Design的卡片插槽，展示点赞按钮和点赞数量。
2. 进入文章页面时，调用两个接口：获取文章信息接口和查询用户是否点赞状态接口。
3. 用户点赞或取消点赞成功后，手动更新页面上的点赞数，并变更用户当前页面的点赞状态。

### Redis部分：

1. 使用Redis作为存储点赞信息的后端，考虑了快速读写、计数器、缓存、持久化、集合和排序集合等特性。
2. 使用两个主要的数据结构：set存储点赞用户，hash存储点赞数量。

### MySQL部分：

1. 设计了两张表：文章表（article）和文章点赞表（article_likes）。
2. 点赞信息需要持久化到数据库，确保数据的长久保存。

### 后端部分：

1. 提供了Redis与MySQL同步的定时任务，定期将数据从MySQL同步到Redis。
2. 实现了查询用户是否点过赞的接口、用户点赞/取消点赞的接口等服务。
3. 通过定时任务实现了文章点赞信息的同步，确保Redis中的数据与MySQL中的数据一致。
4. 处理了Redis宕机的情况，在同步任务中进行了检查，如果Redis不可用，将Mysql的数据同步至redis，保证系统的可用性。