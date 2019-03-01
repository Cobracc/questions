<template>
    <div>
      <headercc class="header"></headercc>
      <newlist class="newlist">
      </newlist>
    </div>
</template>

<script>
import headercc from '@/components/header.vue';
import newlist from '@/components/newlist.vue';
import { setCookie,getCookie,delCookie } from '@/assets/js/cookie.js'
export default {
    data() {
		return {
			
		}
  },
 
	methods: {
		
	},
	components: {
    headercc,
    newlist,
    
  }
}
</script>


<style   scoped>
*{
  background-color: #efefef;
}


</style>
