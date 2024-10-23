# 伙伴匹配引入 GEO 实现搜索附近用户

伙伴匹配引入 Reids GEO 实现搜索附近用户功能

## 前言

鱼皮哥在直播中提出可以通过Redis GEO实现编辑距离和搜索附近用户功能，也算是是一个拓展点。这个项目我做完有一个多月了，最近在做其拓展功能顺便也把这个功能实现一波，整体的实现并不困难，学完 Redis 再看会更轻松（未学过也没事）。话不多说直接开始撸代码吧。

### 设计思路和流程

1. 在 User（用户）表中添加两个字段 longitude（经度）和 dimension（维度），用以存储用户的经纬度坐标。因为Redis GEO 通过每个用户的经纬度坐标计算用户间的距离，同时其 Redis 数据类型为ZSET，ZSET 是一个有序的 List 类似 Java 的 SortedSet。在此场景 value 就是用户id，score 是经纬度信息（ ZSET 根据 score值升序排序）。

![](https://pic.yupi.icu/5563/202402221848343.png)

```sql
create table hjj.user
(
    username     varchar(256)                       null comment '用户昵称',
    id           bigint auto_increment comment 'id'
        primary key,
    userAccount  varchar(256)                       null comment '账户',
    avatarUrl    varchar(1024)                      null comment '用户头像',
    gender       tinyint                            null comment '用户性别',
    profile      varchar(512)                       null comment '个人简介',
    userPassword varchar(512)                       not null comment '用户密码',
    phone        varchar(128)                       null comment '电话',
    email        varchar(512)                       null comment '邮箱',
    userStatus   int      default 0                 not null comment '状态 0 - 正常',
    createTime   datetime default CURRENT_TIMESTAMP null comment '创建时间',
    updateTime   datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP comment '更新时间',
    isDelete     tinyint  default 0                 not null comment '是否删除',
    userRole     int      default 0                 not null comment '用户角色 0 - 普通用户 1 - 管理员',
    planetCode   varchar(512)                       null comment '编程导航编号',
    tags         varchar(1024)                      null comment '标签列表(json)',
    longitude    decimal(10, 6)                     null comment '经度',
    dimension    decimal(10, 6)                     null comment '纬度'
)
    comment '用户';
```

1. 在 UserVO 类中添加distance字段，用以向前端返回每个用户与自己之间的距离，类型为Double。

```java
/**
 * 用户信息封装类
 */
@Data
public class UserVO {
    /**
     * id
     */
    private long id;

    /**
     * 用户昵称
     */
    private String username;

    /**
     * 账户
     */
    private String userAccount;

    /**
     * 用户头像
     */
    private String avatarUrl;

    /**
     * 用户性别
     */
    private Integer gender;
    /**
     * 用户简介
     */
    private String profile;

    /**
     * 电话
     */
    private String phone;

    /**
     * 邮箱
     */
    private String email;

    /**
     * 状态 0 - 正常
     */
    private Integer userStatus;

    /**
     * 创建时间
     */
    private Date createTime;

    /**
     * 更新时间
     */
    private Date updateTime;

    /**
     * 用户角色 0 - 普通用户 1 - 管理员
     */
    private Integer userRole;

    /**
     * 编程导航编号
     */
    private String planetCode;
    /**
     * 标签列表 json
     */
    private String tags;

    /**
     * 用户距离
     */
    private Double distance;

    private static final long serialVersionUID = 1L;
}
```

## 基本业务实现

### 导入各个用户经纬度数据

编写测试类导入各个用户的经纬度信息并且写入Redis中，Redis GEO会根据它计算出一个 score值。进行 Redis GEO 相关操作时可以使用 Spring Data Redis 提供现成的操作 Redis 的模板——StringRedisTemplate，注意其 Key/Value 都是String类型。

stringRedisTemplate.opsForGeo().add() 支持一次一次地传入经纬度信息，可以通过List和Map集合类型传入用户经纬度信息，这里我们用List集合。第一个参数为Redis的key，这不用过多介绍。第二个参数为List类型，泛型为RedisGeoCommands.GeoLocation，其参数为用户id和Point（Point可以理解为是一个圆的一个点吧，经纬度就是x/y坐标）。

stringRedisTemplate.opsForGeo().add()传入的参数：

![](https://pic.yupi.icu/5563/202402221848351.png)

```java
    @Test
    public void importUserGEOByRedis() {
        List<User> userList = userService.list(); // 查询所有用户
        String key = RedisConstant.USER_GEO_KEY; // Redis的key
        List<RedisGeoCommands.GeoLocation<String>> locationList = new ArrayList<>(userList.size()); // 初始化地址（经纬度）List
        for (User user : userList) {
            locationList.add(new RedisGeoCommands.GeoLocation<>(String.valueOf(user.getId()), new Point(user.getLongitude(),
                    user.getDimension()))); // 往locationList添加每个用户的经纬度数据
        }
        stringRedisTemplate.opsForGeo().add(key, locationList); // 将每个用户的经纬度信息写入Redis中
    }
```

结果：

![](https://pic.yupi.icu/5563/202402221848324.png)

### 获取用户 id = 1 与其他用户的距离

编写一个测试类计算用户 id = 1 与其他用户之间的距离。利用stringRedisTemplate.opsForGeo().distance()方法，其主要参数为member1和member2，Metric是计算距离的单位类型。从名称就可以知道member1和member2其实就是用户1和用户2的信息，因为我们在上面用 locationList.add() 添加用户id和用户的经度坐标，所以这两个member就是用户id咯。

所以写个循环就可以算出用户 id = 1 与其他用户的距离

```java
    @Test
    public void getUserGeo() {
        String key = RedisConstant.USER_GEO_KEY;
        List<User> userList = userService.list();

        // 计算每个用户与登录用户的距离
        for (User user : userList) {
            Distance distance = stringRedisTemplate.opsForGeo().distance(key,
                    "1", String.valueOf(user.getId()), RedisGeoCommands.DistanceUnit.KILOMETERS);
            System.out.println("User: " + user.getId() + ", Distance: " +
                    distance.getValue() + " " + distance.getUnit());
        }
    }
```

结果：

![](https://pic.yupi.icu/5563/202402221848332.png)

### 搜索附近用户

利用现成的 stringRedisTemplate.opsForGeo().radius 方法，第一个参数依然是Redis的key，第二个参数是Circle，看代码和名称就知道其是一个圆（传入Point即圆心和圆的半径）。想象搜索附近的用户就是搜索以你为圆心，半径为搜索距离的圆内的用户。理解这些代码就能顺理成章的撸出来了，是不是不算难。

```java
    @Test
    public void searchUserByGeo() {
        User loginUser = userService.getById(1);
        Distance geoRadius = new Distance(1500, RedisGeoCommands.DistanceUnit.KILOMETERS);
        Circle circle  = new Circle(new Point(loginUser.getLongitude(), loginUser.getDimension()), geoRadius);
        RedisGeoCommands.GeoRadiusCommandArgs geoRadiusCommandArgs = RedisGeoCommands.GeoRadiusCommandArgs
                .newGeoRadiusArgs().includeCoordinates();
        GeoResults<RedisGeoCommands.GeoLocation<String>> results = stringRedisTemplate.opsForGeo().radius(RedisConstant.USER_GEO_KEY, circle, geoRadiusCommandArgs);
        for (GeoResult<RedisGeoCommands.GeoLocation<String>> result : results) {
            if (!result.getContent().getName().equals("1")) {
                System.out.println(result.getContent().getName()); // 打印1500km内的用户id
            }
        }
    }
```

注意：搜索附近的用户会搜索到自己，所以可以加一个判断以排除自己。

结果：

![](https://pic.yupi.icu/5563/202402221848356.png)

## 应用至伙伴匹配项目

### 改写用户推荐接口

我的recommend接口未从Redis缓存中读取数据，而是直接走数据库读取数据，有能力的可以自己实现，我后续也会实现的。同时注意返回类型是UserVO不是User，因为我的前端展示了推荐用户和自己之间的距离。

UserController.recommendUsers:

```java
    @GetMapping("/recommend")
    public BaseResponse<List<UserVO>> recommendUsers(long pageSize, long pageNum, HttpServletRequest request){
        User loginUser = userService.getLoginUser(request);
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.ne("id", loginUser.getId());
        IPage<User> page = new Page<>(pageNum, pageSize);
        IPage<User> userIPage = userService.page(page, queryWrapper);

        String redisUserGeoKey = RedisConstant.USER_GEO_KEY;
        // 将User转换为UserVO
        List<UserVO> userVOList = userIPage.getRecords().stream()
                .map(user -> {
                    // 查询距离
                    Distance distance = stringRedisTemplate.opsForGeo().distance(redisUserGeoKey,
                            String.valueOf(loginUser.getId()), String.valueOf(user.getId()),
                            RedisGeoCommands.DistanceUnit.KILOMETERS);
                    double value = distance.getValue();

                    // 创建UserVO对象并设置属性
                    UserVO userVO = new UserVO();
                    // 这里可以用BeanUtils.copyProperties()，就没必要重复set了
                    userVO.setId(user.getId());
                    userVO.setUsername(user.getUsername());
                    userVO.setUserAccount(user.getUserAccount());
                    userVO.setAvatarUrl(user.getAvatarUrl());
                    userVO.setGender(user.getGender());
                    userVO.setProfile(user.getProfile());
                    userVO.setPhone(user.getPhone());
                    userVO.setEmail(user.getEmail());
                    userVO.setUserStatus(user.getUserStatus());
                    userVO.setCreateTime(user.getCreateTime());
                    userVO.setUpdateTime(user.getUpdateTime());
                    userVO.setUserRole(user.getUserRole());
                    userVO.setPlanetCode(user.getPlanetCode());
                    userVO.setTags(user.getTags());
                    userVO.setDistance(value); // 设置距离值
                    return userVO;
                })
                .collect(Collectors.toList());
        System.out.println(userVOList);
        return ResultUtils.success(userVOList);
    }
```

### 改写匹配用户接口

UserServiceImpl.matchUsers:

```java
    /**
     * 推荐最匹配的用户
     * @return
     */
    @GetMapping("/match")
    public BaseResponse<List<UserVO>> matchUsers(long num, HttpServletRequest request){
        if (num <=0 || num > 20) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        User loginUser = userService.getLoginUser(request);
        return ResultUtils.success(userService.matchUsers(num ,loginUser));
    }
```

UserServiceImpl.matchUsers:

```java
    @Override
    public List<UserVO> matchUsers(long num, User loginUser) {
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.isNotNull("tags");
        queryWrapper.ne("id", loginUser.getId());
        queryWrapper.select("id","tags");
        List<User> userList = this.list(queryWrapper);

        String tags = loginUser.getTags();
        Gson gson = new Gson();
        List<String> tagList = gson.fromJson(tags, new TypeToken<List<String>>() {
        }.getType());
        // 用户列表的下表 => 相似度'
        List<Pair<User,Long>> list = new ArrayList<>();
        // 依次计算当前用户和所有用户的相似度
        for (int i = 0; i <userList.size(); i++) {
            User user = userList.get(i);
            String userTags = user.getTags();
            //无标签的 或当前用户为自己
            if (StringUtils.isBlank(userTags) || user.getId() == loginUser.getId()){
                continue;
            }
            List<String> userTagList = gson.fromJson(userTags, new TypeToken<List<String>>() {
            }.getType());
            //计算分数
            long distance = AlgorithmUtils.minDistance(tagList, userTagList);
            list.add(new Pair<>(user,distance));
        }
        //按编辑距离有小到大排序
        List<Pair<User, Long>> topUserPairList = list.stream()
                .sorted((a, b) -> (int) (a.getValue() - b.getValue()))
                .limit(num)
                .collect(Collectors.toList());
        //有顺序的userID列表
        List<Long> userListVo = topUserPairList.stream().map(pari -> pari.getKey().getId()).collect(Collectors.toList());

        //根据id查询user完整信息
        QueryWrapper<User> userQueryWrapper = new QueryWrapper<>();
        userQueryWrapper.in("id",userListVo);
        Map<Long, List<User>> userIdUserListMap = this.list(userQueryWrapper).stream()
                .map(user -> getSafetyUser(user))
                .collect(Collectors.groupingBy(User::getId));

        List<User> finalUserList = new ArrayList<>();
        for (Long userId : userListVo){
            finalUserList.add(userIdUserListMap.get(userId).get(0));
        }

        String redisUserGeoKey = RedisConstant.USER_GEO_KEY;
        List<UserVO> finalUserVOList = finalUserList.stream().map(user -> {
            Distance distance = stringRedisTemplate.opsForGeo().distance(redisUserGeoKey, String.valueOf(loginUser.getId()),
                    String.valueOf(user.getId()), RedisGeoCommands.DistanceUnit.KILOMETERS);


            UserVO userVO = new UserVO();
            userVO.setId(user.getId());
            // 这里可以用BeanUtils.copyProperties()，就没必要重复set了
            userVO.setUsername(user.getUsername());
            userVO.setUserAccount(user.getUserAccount());
            userVO.setAvatarUrl(user.getAvatarUrl());
            userVO.setGender(user.getGender());
            userVO.setProfile(user.getProfile());
            userVO.setPhone(user.getPhone());
            userVO.setEmail(user.getEmail());
            userVO.setUserStatus(user.getUserStatus());
            userVO.setCreateTime(user.getCreateTime());
            userVO.setUpdateTime(user.getUpdateTime());
            userVO.setUserRole(user.getUserRole());
            userVO.setPlanetCode(user.getPlanetCode());
            userVO.setTags(user.getTags());
            userVO.setDistance(distance.getValue());
            return userVO;
        }).collect(Collectors.toList());
        return finalUserVOList;
    }
```

### 添加搜索附近用户接口

UserController.searchNearby:

```java
/**
     * 搜索附近用户
     */
    @GetMapping("/searchNearby")
    public BaseResponse<List<UserVO>> searchNearby(int radius, HttpServletRequest request) {
        if (radius <= 0 || radius > 10000) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        User user = userService.getLoginUser(request);
        User loginUser = userService.getById(user.getId());
        List<UserVO> userVOList = userService.searchNearby(radius, loginUser);
        return ResultUtils.success(userVOList);
    }
```

UserServiceImpl.searchNearby:

```java
    @Override
    public List<UserVO> searchNearby(int radius, User loginUser) {
        String geoKey = RedisConstant.USER_GEO_KEY;
        String userId = String.valueOf(loginUser.getId());
        Double longitude = loginUser.getLongitude();
        Double dimension = loginUser.getDimension();
        if (longitude == null || dimension == null) {
            throw new BusinessException(ErrorCode.NULL_ERROR, "登录用户经纬度参数为空");
        }
        Distance geoRadius = new Distance(radius, RedisGeoCommands.DistanceUnit.KILOMETERS);
        Circle circle = new Circle(new Point(longitude, dimension), geoRadius);
        GeoResults<RedisGeoCommands.GeoLocation<String>> results = stringRedisTemplate.opsForGeo()
                .radius(geoKey, circle);
        List<Long> userIdList = new ArrayList<>();
        for (GeoResult<RedisGeoCommands.GeoLocation<String>> result : results) {
            String id = result.getContent().getName();
            if (!userId.equals(id)) {
                userIdList.add(Long.parseLong(id));
            }
        }
        List<UserVO> userVOList = userIdList.stream().map(
                id -> {
                    UserVO userVO = new UserVO();
                    User user = this.getById(id);
                    BeanUtils.copyProperties(user, userVO);
                    Distance distance = stringRedisTemplate.opsForGeo().distance(geoKey, userId, String.valueOf(id),
                            RedisGeoCommands.DistanceUnit.KILOMETERS);
                    userVO.setDistance(distance.getValue());
                    return userVO;
                }
        ).collect(Collectors.toList());
        return userVOList;
    }
```

## 前端改动

Index.vue:

```js
<template>
  <van-search v-model="searchText" placeholder="搜索附近用户" @search="onSearch(searchText)"/>
  <van-cell center title="心动模式">
    <template #right-icon>
      <van-switch v-model="isMatchMode" size="24" />
    </template>
  </van-cell>
  <user-card-list :user-list="userList" :loading="loading"/>
  <van-empty v-if="!userList || userList.length < 1" description="数据为空" />
</template>

<script setup lang="ts">
import {ref, watchEffect} from "vue";
import {useRoute} from "vue-router";

import myAxios from "../plugins/myAxios.ts";
import UserCardList from "../components/UserCardList.vue";
import {UserType} from "../models/user"
import {showToast} from "vant";

const route = useRoute();
const { tags } = route.query;
const searchText = ref('');
const userList = ref([]);
const isMatchMode = ref<boolean>(false);
const loading = ref(true);

/**
 * 加载数据
 */
const loadData = async () => {
  let userListData;
  loading.value = true;
  //心动模式
  if (isMatchMode.value){
    const num = 10;
    userListData = await myAxios.get('user/match',{
      params: {
        num,
      },
    })
        .then(function (response) {
          console.log('/user/match succeed',response);
          return response?.data;
        })
        .catch(function (error) {
          console.log('/user/match error',error);
        });
  }else {
    //普通用户使用分页查询
    userListData = await myAxios.get('/user/recommend',{
      params: {
        pageSize: 8,
        pageNum: 1,
      },
    })
        .then(function (response) {
          console.log('/user/recommend succeed', response);
          return response?.data;
        })
        .catch(function (error) {
          console.log('/user/recommends error',error);
        });

  }
  if (userListData){
    userListData.forEach((user: UserType) =>{
      if (user.tags){
        user.tags = JSON.parse(user.tags);
      }
    })
    userList.value = userListData;
  }
  loading.value = false;
}

watchEffect(() =>{
  loadData();
})

const onSearch = async (searchText) => {
  let userListData;
  loading.value = true;
  const res = await myAxios.get('/user/searchNearby', {
    params: {
      radius: searchText
    }
  })
  if (res?.code === 0) {
    userListData = res?.data;
    if (userListData){
      userListData.forEach((user: UserType) =>{
        if (user.tags){
          user.tags = JSON.parse(user.tags);
        }
      })
      userList.value = userListData;
    }
    loading.value = false;
  } else {
    showToast('搜索失败');
  }
  loading.value = false;
};

</script>

<style scoped>

</style>
```

user.d.ts:

```js
    export type UserType = {
        id: number;
        username: string;
        userAccount: string;
        avatarUrl?: string;
        gender:number;
        profile?: string;
        phone: string;
        email: string;
        userStatus: number;
        userRole: number;
        planetCode: string;
        createTime: Date;
        tags: string;
        distance: number;
    };
```

UserCardList.vue:

```js
  <template>
  <van-skeleton title avatar :row="3" :loading="loading" v-for="user in userList">
  <van-card
      :desc="user.profile"
      :title="`${user.username}(${user.planetCode})`"
      :price="`${user.distance} km`"
      currency=""
      :thumb="user.avatarUrl"
  >
    <template #tags>
      <van-tag plain type="danger" v-for="tag in user.tags" style="margin-right: 8px; margin-top: 8px">
        {{ tag }}
      </van-tag>
    </template>
    <template #footer>
      <van-button size="mini" @click="toIntroUser(user)">联系我</van-button>
    </template>
  </van-card>
  </van-skeleton>

</template>

  <script setup lang="ts">
  import {UserType} from "../models/user";
  import {useRouter} from "vue-router";

  const router = useRouter();

  interface UserCardListProps{
    loading: boolean
    userList: UserType[];
  }
  withDefaults(defineProps<UserCardListProps>(), {
    loading: true,
  })

  const toIntroUser = (user: UserType) => {
    router.push({
      path: '/user/intro',
      query: {
        userInfoParam: JSON.stringify(user)
      }
    });
  }

  </script>

  <style scoped>

  </style>
```

如果有些的不对的地方，还请各位及时指正。
