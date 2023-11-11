<template>
    <main class="footer">
        <div v-for="(item, index) in footerList" :key="index" class="footer-item">
            <a :href="item.href" target="_blank" rel="noopener noreferrer">
                <img v-if="item.icon" :src="item.icon" alt="icon" class="item-icon" />
                <span class="item-text">{{ item.label }}</span>
            </a>
        </div>
        <div class="copy-right">
           <span class="name">{{`${currentYear} 编程导航 &nbsp; |  &nbsp; `}} </span>
            <a :href="government.href" target="_blank" rel="noreferrer" >
              {{government.name}}
            </a>
        </div>
    </main>
</template>

<script>
export default {
    name: 'Footer',
    data () {
        return {
            footerList: [],
            government: {},
            currentYear : ''
        }
    },

  props: ['sidebarItems'],
  mounted() {
    this.footerList = this.$site.themeConfig.footer.friendLinks
    this.government = this.$site.themeConfig.footer.copyright
    this.currentYear =  new Date().getFullYear()
  }
}
</script>

<style lang="stylus">
@require '../styles/wrapper.styl'
//@media (max-width: $MQMobile)
//  .footer-item a
//    margin-right 0 !important
.footer
  padding 2rem 0
  display flex
  justify-content center
  background-color #f0f2f5
  flex-wrap wrap
.footer-item
  padding 0 1rem
.footer-item a
    display inline-flex
    justify-content center
    align-items center
    color #85858a

.item-icon
  width 1.4rem
  height 1.4rem
  margin-right 0.4rem
.copy-right
    width 100vw
    display flex
    justify-content center
    margin-top 1rem
    color #85858a
.copy-right .name
    margin-right 0.4rem
</style>
