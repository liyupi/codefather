## Java 的 synchronized 是怎么实现的？
> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)

## 回答重点

`synchronized` 实现原理依赖于 JVM 的 Monitor（监视器锁） 和 对象头（Object Header）。

当 `synchronized` 修饰在方法或代码块上时，会对特定的对象或类加锁，从而确保同一时刻只有一个线程能执行加锁的代码块。

- **synchronized 修饰方法**：会在方法的访问标志中增加一个 `ACC_SYNCHRONIZED` 标志。每当一个线程访问该方法时，JVM 会检查方法的访问标志。如果包含 `ACC_SYNCHRONIZED` 标志，线程必须先获得该方法对应的对象的监视器锁（即对象锁），然后才能执行该方法，从而保证方法的同步性。
- **synchronized 修饰代码块**：会在代码块的前后插入 `monitorenter` 和 `monitorexit` 字节码指令。可以把 `monitorenter` 理解为加锁，`monitorexit`理解为解锁。


## 扩展知识

### 对象头（Object Header）

在 JVM 中，每个对象的内存布局主要由两部分组成：
- Mark Word：用于存储对象的运行时数据，包括锁状态、哈希码、GC 分代信息等。
- Klass Pointer：指向对象的类型元数据，帮助 JVM 确定对象的类型信息。

Mark Word 是实现 synchronized 的关键，因为它会根据锁的状态保存不同的信息，具体包括：

- 未锁定状态：Mark Word 存储对象的哈希码和 GC 分代信息。
- 偏向锁状态：Mark Word 保存获取该锁的线程 ID 和一些偏向锁标志位。
- 轻量级锁状态：Mark Word 存储的是指向栈中锁记录的指针。
- 重量级锁状态：Mark Word 存储的是指向 Monitor 对象的指针。

### 锁的升级与优化

为了提高 synchronized 的性能，JVM 从 JDK 1.6 开始引入了锁的优化机制，包括**偏向锁、轻量级锁、重量级锁**，这些状态会根据线程的竞争情况进行动态升级或降级。

#### 偏向锁
在没有锁竞争的情况下，锁总是“偏向”于第一个获得它的线程。偏向锁通过减少不必要的 CAS 操作来提高性能。

- 加锁过程：当线程第一次请求锁时，JVM 会将该线程的 ID 记录在对象头的 Mark Word 中，表示锁偏向于该线程。后续该线程再进入该锁时，无需进行额外的同步操作。
- 撤销偏向锁：如果在偏向锁持有期间，另一个线程请求同一把锁，JVM 会撤销偏向锁，并升级为轻量级锁。


#### 轻量级锁

轻量级锁适用于多个线程短时间内争用同一锁的场景。

- 加锁过程：当线程进入同步块时，JVM 会在当前线程的栈帧中创建一个锁记录（Lock Record），并将对象头中的 Mark Word 拷贝到锁记录中。线程尝试使用 CAS 操作将对象头中的 Mark Word 更新为指向锁记录的指针。如果成功，则表示该线程获取了锁；如果失败，则表示其他线程已经持有该锁，此时锁会升级为重量级锁。
- 解锁过程：线程退出同步块时，JVM 会将对象头中的 Mark Word 恢复为原始值。

#### 重量级锁（Heavyweight Locking）
当锁竞争激烈时，JVM 会升级为重量级锁，重量级锁使用操作系统的**互斥量（Mutex）** 机制来实现线程的阻塞与唤醒。

- 加锁过程：如果线程无法通过轻量级锁获取锁，JVM 会将该锁升级为重量级锁，并将当前线程阻塞。
- 解锁过程：当线程释放重量级锁时，JVM 会唤醒所有阻塞的线程，允许它们再次尝试获取锁。

**锁升级总结**：  
- **偏向锁**：当一个线程第一次获取锁时，JVM 会将该线程标记为“偏向”状态，后续若该线程再获取该锁，几乎没有开销。
- **轻量级锁**：当另一个线程尝试获取已经被偏向的锁时，锁会升级为轻量级锁，使用 CAS 操作来减少锁竞争的开销。
- **重量级锁**：当 CAS 失败无法获取锁，锁会升级为重量级锁，线程会被挂起，直到锁被释放。

### Synchronized 的可重入性
`synchronized` 是可重入的，每获取一次锁，计数器加一，释放锁时，计数器减一，直到计数器为 0，锁才会真正释放。

### 锁消除和锁粗化
- **锁消除**：JVM 会通过逃逸分析判断对象是否只在当前线程使用，如果是，那么会消除不必要的加锁操作。
- **锁粗化**：当多个锁操作频繁出现时，JVM 会将这些锁操作合并，减少锁获取和释放的开销。

### 重量级锁的实现原理深入分析

Synchronized 关键字可以修饰代码块，实例方法和静态方法，**本质上都是作用于对象上**。

代码块作用于括号里面的对象，实例方法是当前的实例对象即 this ，而静态方法就是当前的类。

<img src="https://pic.code-nav.cn/mianshiya/question_picture/1783388929455529986/Ysi96CQe_image_mianshiya.png" alt="image.png" width="100%" />

这里有个概念叫**临界区**。

我们知道，之所以会有竞争是因为有共享资源的存在，多个线程都想要得到那个共享资源，所以就划分了一个区域，操作共享资源的代码就在区域内。

可以理解为想要进入到这个区域就必须持有锁，不然就无法进入，这个区域叫临界区。

#### 当用 Synchronized 修饰代码块时

此时编译得到的字节码会有 monitorenter 和 monitorexit 指令，我习惯按照临界区来理解，enter 就是要进入临界区了，exit 就是要退出临界区了，与之对应的就是获得锁和解锁。

实际上这两个指令还是和修饰代码块的那个对象相关的，也就是上文代码中的`lockObject`。

**每个对象都有一个 monitor 对象于之关联**，执行 monitorenter 指令的线程就是试图去获取 monitor 的所有权，抢到了就是成功获取锁了。

这个 monitor 下文会详细分析，我们先看下生成的字节码是怎样的。

图片上方是 lockObject 方法编译得到的字节码，下面就是 lockObject 方法，这样对着看比较容易理解。


<img src="https://pic.code-nav.cn/mianshiya/question_picture/1783388929455529986/wU5oBYfv_image_mianshiya.png" alt="image.png" width="656px" />

从截图来看，执行 System.out 之前执行了 monitorenter 执行，这里执行争锁动作，拿到锁即可进入临界区。

调用完之后有个 monitorexit 指令，表示释放锁，要出临界区了。

图中我还标了一个 monitorexit 指令时，**因为有异常的情况也需要解锁**，不然就死锁了。

从生成的字节码我们也可以得知，为什么 synchronized 不需要手动解锁？

是有人在替我们负重前行啊！**编译器生成的字节码都帮咱们做好了，异常的情况也考虑到了**。

#### 当用 synchronized 修饰方法时

修饰方法生成的字节码和修饰代码块的不太一样，但本质上是一样。

此时字节码中没有 monitorenter 和 monitorexit 指令，不过在**当前方法的访问标记**上做了手脚。

我这里用的是 idea 的插件来看字节码，所以展示的字面结果不太一样，不过 flag 标记是一样的：0x0021 ，是 ACC_PUBLIC 和 ACC_SYNCHRONIZED 的结合。


<img src="https://pic.code-nav.cn/mianshiya/question_picture/1783388929455529986/2l0qVCj6_image_mianshiya.png" alt="image.png" width="100%" />

原理就是修饰方法的时候在 flag 上标记 ACC_SYNCHRONIZED，在运行时常量池中通过 ACC_SYNCHRONIZED 标志来区分，这样 JVM 就知道这个方法是被 synchronized 标记的，于是在进入方法的时候就会进行执行争锁的操作，一样只有拿到锁才能继续执行。

然后不论是正常退出还是异常退出，都会进行解锁的操作，所以本质还是一样的。

#### 我们再来继续深入 synchronized 

从上文我们已经知道 synchronized 是作用于对象身上的，但是没细说，我们接下来剖析一波。

在 Java 中，对象结构分为对象头、实例数据和对齐填充。

而对象头又分为：MarkWord 、 klass pointer、数组长度(只有数组才有)，我们的重点是锁，所以关注点只放在 MarkWord 上。


<img src="https://pic.code-nav.cn/mianshiya/question_picture/1783388929455529986/Tjxo6SFB_image_mianshiya.png" alt="image.png" width="628px" />

我再画一下 64 位时 MarkWord 在不同状态下的内存布局


<img src="https://pic.code-nav.cn/mianshiya/question_picture/1783388929455529986/6v5xDiuq_image_mianshiya.png" alt="image.png" width="100%" />

MarkWord 结构之所以搞得这么复杂，是因为需要**节省内存**，让同一个内存区域在不同阶段有不同的用处。

记住这个图啊，各种锁操作都和这个 MarkWord 有很强的联系。

从图中可以看到，在重量级锁时，对象头的锁标记位为 10，并且会有一个指针指向这个 monitor 对象，所以锁对象和 monitor 两者就是这样关联的。


<img src="https://pic.code-nav.cn/mianshiya/question_picture/1783388929455529986/cQtIkJjK_image_mianshiya.png" alt="image.png" width="539px" />

而这个 monitor 在 HotSpot 中是 c++ 实现的，叫 ObjectMonitor，它是管程的实现，也有叫监视器的。

它长这样，重点字段我都注释了含义，还专门截了个头文件的注释：


<img src="https://pic.code-nav.cn/mianshiya/question_picture/1783388929455529986/2tieAEtm_image_mianshiya.png" alt="image.png" width="100%" />

暂时记忆一下，等下源码和这几个字段关联很大。

#### synchronized 底层原理

先来一张图，结合上面 monitor 的注释，先看看，看不懂没关系，有个大致流转的印象即可：


<img src="https://pic.code-nav.cn/mianshiya/question_picture/1783388929455529986/R9YYMISh_image_mianshiya.png" alt="image.png" width="100%" />

好，我们继续。

前面我们提到了 monitorenter 这个指令，这个指令会执行下面的代码：


<img src="https://pic.code-nav.cn/mianshiya/question_picture/1783388929455529986/eCVjqRA4_image_mianshiya.png" alt="image.png" width="100%" />

我们现在分析的是重量级锁，所以不关心偏向的代码，而 slow_enter 方法文章一开始的截图就是了，最终会执行到 `ObjectMonitor::enter` 这个方法中。


<img src="https://pic.code-nav.cn/mianshiya/question_picture/1783388929455529986/7gIUeNQI_image_mianshiya.png" alt="image.png" width="651px" />

可以看到重点就是通过 CAS 把 ObjectMonitor 中的 _ owner 设置为当前线程，**设置成功就表示获取锁成功**。

然后通过 recursions 的自增来表示重入。

如果 CAS 失败的话，会执行下面的一个循环：


<img src="https://pic.code-nav.cn/mianshiya/question_picture/1783388929455529986/9zDTd1R3_image_mianshiya.png" alt="image.png" width="579px" />

EnterI 的代码其实上面也已经截图了，这里再来一次，我把重要的入队操作加上，并且删除了一些不重要的代码：


<img src="https://pic.code-nav.cn/mianshiya/question_picture/1783388929455529986/EoxrnQRf_image_mianshiya.png" alt="image.png" width="100%" />

先再尝试一下获取锁，不行的话就自适应自旋，还不行就包装成 ObjectWaiter 对象加入到 _ cxq 这个单向链表之中，挣扎一下还是没抢到锁的话，那么就要阻塞了，所以下面还有个阻塞的方法。


<img src="https://pic.code-nav.cn/mianshiya/question_picture/1783388929455529986/hEh00UF1_image_mianshiya.png" alt="image.png" width="600px" />

可以看到不论哪个分支都会执行 `Self->_ParkEvent->park()`，这个就是上文提到的调用 `pthread_mutex_lock`。

至此争抢锁的流程已经很清晰了，我再画个图来理一理。


<img src="https://pic.code-nav.cn/mianshiya/question_picture/1783388929455529986/kcPYidUM_image_mianshiya.png" alt="image.png" width="100%" />

> 接下来再看看解锁的方法

`ObjectMonitor::exit` 就是解锁时会调用的方法。


<img src="https://pic.code-nav.cn/mianshiya/question_picture/1783388929455529986/6fv4aybq_image_mianshiya.png" alt="image.png" width="532px" />

可重入锁就是根据 _ recursions 来判断的，重入一次 _ recursions++，解锁一次 _ recursions--，如果减到 0 说明需要释放锁了。

然后**此时解锁的线程还会唤醒之前等待的线程**，这里有好几种模式，我们来看看。

如果 `QMode == 2 && _cxq != NULL`的时候：


<img src="https://pic.code-nav.cn/mianshiya/question_picture/1783388929455529986/4KbigMiX_image_mianshiya.png" alt="image.png" width="661px" />

如果`QMode == 3 && _cxq != NULL`的时候，我就截取了一部分代码：


<img src="https://pic.code-nav.cn/mianshiya/question_picture/1783388929455529986/6tf6LNDS_image_mianshiya.png" alt="image.png" width="100%" />

如果 `QMode == 4 && _cxq != NULL`的时候：


<img src="https://pic.code-nav.cn/mianshiya/question_picture/1783388929455529986/yucX0re1_image_mianshiya.png" alt="image.png" width="100%" />

如果 QMode 不是 2 的话，最终会执行：


<img src="https://pic.code-nav.cn/mianshiya/question_picture/1783388929455529986/Gv4nKv2Q_image_mianshiya.png" alt="image.png" width="545px" />

至此，解锁的流程就完毕了！我再画一波流程图：


<img src="https://pic.code-nav.cn/mianshiya/question_picture/1783388929455529986/agGWmNBl_image_mianshiya.png" alt="image.png" width="529px" />

> 接下来再看看调用 wait 的方法

没啥花头，就是将当前线程加入到 _ waitSet 这个双向链表中，然后再执行 `ObjectMonitor::exit` 方法来释放锁。


<img src="https://pic.code-nav.cn/mianshiya/question_picture/1783388929455529986/1lVwqtKz_image_mianshiya.png" alt="image.png" width="100%" />

> 接下来再看看调用 notify 的方法

也没啥花头，就是从 _ waitSet 头部拿节点，然后根据策略选择是放在 cxq 还是 EntryList 的头部或者尾部，并且进行唤醒。


<img src="https://pic.code-nav.cn/mianshiya/question_picture/1783388929455529986/YAwGyNOX_image_mianshiya.png" alt="image.png" width="100%" />

至于 notifyAll 我就不分析了，一样的，无非就是做了个循环，全部唤醒。

至此 synchronized 的几个操作都齐活了，出去可以说自己深入研究过  synchronized 了。

现在再来看下这个图，应该心里很有数了。


<img src="https://pic.code-nav.cn/mianshiya/question_picture/1783388929455529986/r1ZdnaZP_image_mianshiya.png" alt="image.png" width="100%" />

> 为什么会有_cxq 和 _EntryList 两个列表来放线程？

因为会有多个线程会同时竞争锁，所以搞了个 _ cxq 这个单向链表基于 CAS 来 hold 住这些并发，然后另外搞一个 _ EntryList 这个双向链表，来在每次唤醒的时候搬迁一些线程节点，降低 _ cxq 的尾部竞争。

> 引入自旋

synchronized 的原理大致应该都清晰了，我们也知道了底层会用到系统调用，会有较大的开销，那思考一下该如何优化？

从小标题就已经知道了，方案就是自旋，文章开头就已经说了，这里再提一提。

自旋其实就是空转 CPU，执行一些无意义的指令，**目的就是不让出 CPU 等待锁的释放**。

正常情况下锁获取失败就应该阻塞入队，但是有时候可能刚一阻塞，别的线程就释放锁了，然后再唤醒刚刚阻塞的线程，这就没必要了。

所以在线程竞争不是很激烈的时候，稍微自旋一会儿，指不定不需要阻塞线程就能直接获取锁，这样就避免了不必要的开销，提高了锁的性能。

但是**自旋的次数又是一个难点**，在竞争很激烈的情况，自旋就是在浪费 CPU，因为结果肯定是自旋一会让之后阻塞。

所以 Java 引入的是自适应自旋，根据上次自旋次数，来动态调整自旋的次数，**这就叫结合历史经验做事**。

**注意这是重量级锁的步骤，别忘了文章开头说的~**。

> 至此，synchronized 重量级锁的原理应该就很清晰了吧? 小结一下

synchronized 底层是利用 monitor 对象，CAS 和 mutex 互斥锁来实现的，内部会有等待队列(cxq 和 EntryList)和条件等待队列(waitSet)来存放相应阻塞的线程。

未竞争到锁的线程存储到等待队列中，获得锁的线程调用 wait 后便存放在条件等待队列中，解锁和 notify 都会唤醒相应队列中的等待线程来争抢锁。

然后由于阻塞和唤醒依赖于底层的操作系统实现，系统调用存在用户态与内核态之间的切换，所以有较高的开销，因此称之为重量级锁。

所以又引入了自适应自旋机制，来提高锁的性能。

### 引入轻量级锁

我们再思考一下，是否有这样的场景：**多个线程都是在不同的时间段来请求同一把锁**，此时根本就用不需要阻塞线程，连 monitor 对象都不需要，所以就引入了轻量级锁这个概念，避免了系统调用，减少了开销。

在锁竞争不激烈的情况下，这种场景还是很常见的，可能是常态，所以轻量级锁的引入很有必要。

在介绍轻量级锁的原理之前，再看看之前 MarkWord 图。


<img src="https://pic.code-nav.cn/mianshiya/question_picture/1783388929455529986/RgFq6FVw_image_mianshiya.png" alt="image.png" width="100%" />

轻量级锁操作的就是对象头的 MarkWord 。

如果判断当前处于无锁状态，会在当前线程栈的当前栈帧中划出一块叫 LockRecord 的区域，然后把锁对象的 MarkWord 拷贝一份到 LockRecord 中称之为 dhw(就是那个set_displaced_header 方法执行的)里。

然后通过 CAS 把锁对象头指向这个 LockRecord 。

轻量级锁的加锁过程：


<img src="https://pic.code-nav.cn/mianshiya/question_picture/1783388929455529986/dhI1dsdp_image_mianshiya.png" alt="image.png" width="100%" />

如果当前是有锁状态，并且是当前线程持有的，则将 null 放到 dhw 中，这是重入锁的逻辑。


<img src="https://pic.code-nav.cn/mianshiya/question_picture/1783388929455529986/W2pFUrO6_image_mianshiya.png" alt="image.png" width="640px" />

我们再看下轻量级锁解锁的逻辑：


<img src="https://pic.code-nav.cn/mianshiya/question_picture/1783388929455529986/02ikizuD_image_mianshiya.png" alt="image.png" width="100%" />

逻辑还是很简单的，就是要把当前栈帧中 LockRecord 存储的 markword （dhw）通过 CAS 换回到对象头中。

如果获取到的 dhw 是 null 说明此时是重入的，所以直接返回即可，否则就是利用 CAS 换，如果 CAS 失败说明此时有竞争，那么就膨胀！


<img src="https://pic.code-nav.cn/mianshiya/question_picture/1783388929455529986/GSfzWZKa_image_mianshiya.png" alt="image.png" width="490px" />

> 关于这个轻量级加锁我再多说几句。

每次加锁肯定是在一个方法调用中，而方法调用就是有栈帧入栈，如果是轻量级锁重入的话那么此时入栈的栈帧里面的 dhw 就是 null，否则就是锁对象的 markword。

这样在解锁的时候就能通过 dhw 的值来判断此时是否是重入的。

### 引入偏向锁

我们再思考一下，是否有这样的场景：一开始一直只有一个线程持有这个锁，也不会有其他线程来竞争，此时频繁的 CAS 是没有必要的，CAS 也是有开销的。

所以 JVM 研究者们就搞了个偏向锁，就是偏向一个线程，那么这个线程就可以直接获得锁。

我们再看看这个图，偏向锁在第二行。


<img src="https://pic.code-nav.cn/mianshiya/question_picture/1783388929455529986/LKhjnxU3_image_mianshiya.png" alt="image.png" width="100%" />

原理也不难，如果当前锁对象支持偏向锁，那么就会通过 CAS 操作：将当前线程的地址(也当做唯一ID)记录到 markword 中，并且将标记字段的最后三位设置为 101。

之后有线程请求这把锁，只需要判断 markword 最后三位是否为 101，是否指向的是当前线程的地址。

还有一个可能很多文章会漏的点，就是还需要判断 epoch 值是否和锁对象的**类**中的 epoch 值相同。

如果都满足，那么说明当前线程持有该偏向锁，就可以直接返回。

> 这 epoch 干啥用的？


<img src="https://pic.code-nav.cn/mianshiya/question_picture/1783388929455529986/QcU6W8gW_image_mianshiya.png" alt="image.png" width="496px" />

可以理解为是第几代偏向锁。

偏向锁在有竞争的时候是要执行撤销操作的，其实就是要升级成轻量级锁。

而当一类对象撤销的次数过多，比如有个 Yes 类的对象作为偏向锁，经常被撤销，次数到了一定阈值(XX:BiasedLockingBulkRebiasThreshold，默认为 20 )就会把当代的偏向锁废弃，把类的 epoch 加一。

所以当类对象和锁对象的 epoch 值不等的时候，当前线程可以将该锁重偏向至自己，因为前一代偏向锁已经废弃了。

不过**为保证正在执行的持有锁的线程不能因为这个而丢失了锁**，偏向锁撤销需要所有线程处于安全点，然后遍历所有线程的 Java 栈，**找出该类已加锁的实例**，并且将它们标记字段中的 epoch 值加 1。

当撤销次数超过另一个阈值(XX:BiasedLockingBulkRevokeThreshold，默认值为 40)，则废弃此类的偏向功能，也就是说这个类都无法偏向了。

>  注意：JDK 15 版本偏向锁被废弃了，因为随着多核 CPU 和高并发应用的普及，偏向锁的性能优势逐渐变得不明显。**在多线程竞争严重的情况下，偏向锁会引发较多的撤销和重偏向操作，反而对性能产生负面影响**。

至此整个 Synchronized 的流程应该都比较清楚了。

我是反着来讲锁升级的过程的，因为事实上是先有的重量级锁，然后根据实际分析优化得到的偏向锁和轻量级锁。


<img src="https://pic.code-nav.cn/mianshiya/question_picture/1783388929455529986/LcXnFbBF_image_mianshiya.png" alt="image.png" width="638px" />

包括期间的一些细节应该也较为清楚了，我觉得对于 Synchronized 了解到这份上差不多了。

我再搞了张 openjdk wiki 上的图，看看是不是很清晰了：


<img src="https://pic.code-nav.cn/mianshiya/question_picture/1783388929455529986/N9LHOkAp_image_mianshiya.png" alt="image.png" width="100%" />


  





> 八股文一网打尽，更多面试题请看[程序员面试刷题神器 - 面试鸭](https://www.mianshiya.com/)