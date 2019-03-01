<template>
	<div class="date-container">
		<header>
			<p class="date-title">
				<span class="left-arrow" @click="getDates(-1)"></span>
				<span v-text="`${year}年 ${month}月`"></span>
				<span class="right-arrow" @click="getDates(1)"></span>
			</p>
			<p class="week-title">
				<ul>
					<li>Mon</li>
					<li>Tue</li>
					<li>Wed</li>
					<li>Thu</li>
					<li>Fri</li>
					<li>Sat</li>
					<li>Sun</li>
				</ul>
			</p>
		</header>
		<div class="date-content">
			<ul  v-for=" week in dates.weeks" :key="week">
				<template >
					<li v-if="day.month === month" class="selectable" @click="returnDate(day.showDate)">{{ day.showDate }}</li>
					<li v-else>{{ day.showDate }}</li>
				</template>
			</ul>
		</div>
	</div>
</template>

<script>
	import datedata from'@/data.js';

	export default {
		name: 'Datepicker',
		data() {
			return {
				dates: [],
				month: undefined,
				year: undefined
			}
		},

		mounted() {
			this.dates = datedata.date();
			this.year = this.dates.year;
			this.month = this.dates.month;
		},

		methods: {
			getDates(n) {
				let year = this.year;
				let month = this.month - 1 + n;

				if (month < 0) {
					year--;
					month = 11;
				}
				if (month > 11){
					year++;
					month = 0;
				}

				this.dates = data.date(year, month);
				this.year = this.dates.year;
				this.month = this.dates.month;
			},

			returnDate(day) {
				let date = `${this.year}-${this.formatDate(this.month)}-${this.formatDate(day)}`;
				this.$emit('sendDate', date);
			},

			formatDate(val) {
				return (val < 10) ? '0' + val : val;
			}
		}
	}

</script>

<style scoped >
	#date-picker {
    position: absolute;
    right: 0;
    margin-top: .5rem;
}

.date-container {
    width: 15rem;
    height: 15rem;
    font-size: 0.5rem;
}

.date-container:before {
    display: block;
    width: 0;
    height: 0;
    margin: 0 auto;
    content: "";
    border-right: .5rem solid transparent;
    border-bottom: .5rem solid #f07600;
    border-left: .5rem solid transparent;
}

header {
    color: #fff;
    background-color: #f07600;
}

.date-title {
    display: flex;
    height: 3rem;
    margin: 0 1rem;
    font-size: 0.6rem;
    font-weight: 700;
    -ms-flex-pack: justify;
    justify-content: space-between;
    -ms-flex-align: center;
    align-items: center;
}

.date-title .left-arrow {
    border-right: .5rem solid #fff;
}

.date-title .left-arrow, .date-title .right-arrow {
    display: block;
    width: 0;
    height: 0;
    cursor: pointer;
    border-top: .5rem solid transparent;
    border-bottom: .5rem solid transparent;
}

.date-title .right-arrow {
    border-left: .5rem solid #fff;
}

.date-content ul, .week-title ul{
    display: flex;
	padding: 0;
}

.date-content li, .week-title li {
    text-align: center;
    flex: 1;
}

li {
    display: list-item;
}

ol, ul {
    list-style: none;
}

.date-content {
    border-right: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    border-left: 1px solid #ccc;
	height: 10rem;
}

.date-content ul {
    height: 2rem;
    line-height: 2rem;
    color: #ddd;
    border-bottom: 1px solid #eee;
    background-color: #fff;
}


.date-content li:not(:last-child) {
    border-right: 1px solid #eee;
}

.date-content li.selectable {
    cursor: pointer;
    color: #666;
}









</style>
