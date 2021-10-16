#!/usr/bin/env node

import moment from "moment";

const now = moment();
if(now.date() === 25 && now.month() === 11){
	// it's Christmas!
	console.log("No more sleeps — it's Christmas 😀🎄🎁")
}else{
	const xmas = moment(now.startOf('day')).date(25).month(11);
	if(now.isAfter(xmas)) xmas.year(now.year() + 1);
	const numDays = Math.abs(now.startOf('day').diff(xmas, 'days'));
	console.log(`${numDays} sleeps 😴 till Christmas 🎄`);
}
