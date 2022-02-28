<template>
    <div>
      <nav-bar class="nav-bar">
        <template slot="center">User的用户名</template>
      </nav-bar>
      <user-info/>
      <list-view></list-view>
    </div>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar'
import UserInfo from './childComps/UserInfo'
import ListView from './childComps/ListView'
export default {
  name: 'Profile',
  components: {
    NavBar,
    UserInfo,
    ListView
  },

}
</script>

<style scoped>
.nav-bar {
    background: var(--color-tint);
    color: #fff;
    font-weight: bold;
}
</style>