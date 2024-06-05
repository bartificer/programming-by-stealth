let x;

// implied else
x = 5;
if(x < 0){
	x += 10;  
}
console.log(x) // outputs 5

// equivalent explicit else
x = 5;
if(x < 0){
	x += 10;
}else{
  ; //explicitly do nothing
}
console.log(x) // outputs 5