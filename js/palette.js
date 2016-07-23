/*
  cobj绘制对象  
  canvas 标签
*/

function palette(cobj,canvas,copy){
	this.o=cobj;
	this.canvas=canvas;
	this.copy=copy;
	this.width=canvas.width;
	this.height=canvas.height;
	this.style='fill';//默认填充   stroke|fill
	this.type='polystar';//类型 画线条   line|rect矩形|circle圆|triangle三角形| pencil
	this.lineWidth=1;//线条宽度
	this.num=5;
	this.lineWidth='1';
	this.strokeStyle='#000000';
	this.fillStyle='#000000';

    this.status=[];
}
//初始化

palette.prototype.init=function(){
    this.o.lineWidth=this.lineWidth;
    this.o.strokeStyle=this.strokeStyle;
    this.o.fillStyle=this.fillStyle;
}
palette.prototype.draw=function(){
	var that=this;
	this.copy.onmousedown=function(e){
		var dx=e.offsetX;
		var dy=e.offsetY;
		that.init();
		document.onmousemove=function(e){
			that.o.clearRect(0,0,that.width,that.height);
			if(that.status.length>0){
			that.o.putImageData(that.status[that.status.length-1],0,0,0,0,that.width,that.height);}
			var ox=e.offsetX;
			var oy=e.offsetY;
            that[that.type](dx,dy,ox,oy);
			document.onmouseup=function(){
				that.status.push(that.o.getImageData(0,0,that.width,that.height));
				document.onmousemove=null;
				document.onmouseup=null;
			}
		}
	}
}
palette.prototype.pencil=function(){
	var that=this;
	that.copy.onmousedown=function(e){
		that.init();
		that.o.beginPath();
		document.onmousemove=function(e){
			that.o.clearRect(0,0,that.width,that.height);
			if(that.status.length>0){
			that.o.putImageData(that.status[that.status.length-1],0,0,0,0,that.width,that.height);}
			var mx=e.offsetX;
			var my=e.offsetY;
			that.o.lineTo(mx,my);
			that.o.stroke();
			document.onmouseup=function(e){
				that.o.closePath();
				that.status.push(that.o.getImageData(0,0,that.width,that.height));
				document.onmousemove=null;
				document.onmouseup=null;
			}
		}
	}
	
}

palette.prototype.earser=function(){
	var that=this;
	var w=30;
	this.copy.onmousedown=function(e){
             var dx=e.offsetX;
			var dy=e.offsetY;
			var a=document.createElement("div");
			a.style.cssText="width:"+w+"px;height:"+w+"px;border:1px solid red;	position: absolute";
		document.onmousemove=function(e){
			var mx=e.offsetX;
			var my=e.offsetY;
			that.o.clearRect(mx-w/2,my-w/2,w,w);
			that.copy.parentNode.appendChild(a);
			a.style.left=mx-w/2+"px";
			a.style.top=my-w/2+"px";
		}
		document.onmouseup=function(){
			that.status.push(that.o.getImageData(0,0,that.width,that.height));
			that.copy.parentNode.removeChild(a);
			document.onmousemove=null;
			document.onmouseup=null;
		}
	}
}
palette.prototype.line=function(x1,y1,x2,y2){
    this.o.beginPath();
    this.o.lineTo(x1,y1);
    this.o.lineTo(x2,y2);
    this.o.closePath();
    this.o.stroke();
}
palette.prototype.rect=function(x1,y1,x2,y2){
	var w=x2-x1;
	var h=y2-y1;
	this.o.beginPath();
	this.o.rect(x1-.5,y1-.5,w,h);
	this.o.closePath();
	this.o[this.style]();
}
palette.prototype.triangle=function(x1,y1,x2,y2){
	var w=x2-x1;
	this.o.beginPath();
	this.o.lineTo(x1,y1);
	this.o.lineTo(x2,y2);
	this.o.lineTo(x1-w,y2)
	this.o.closePath();
	this.o[this.style]();
}
palette.prototype.circle=function(x1,y1,x2,y2){
	var w=x2-x1;
	var h=y2-y1;
	var r=Math.sqrt(Math.pow(w,2)+Math.pow(h,2));
	this.o.beginPath();
	this.o.arc(x1-.5,y1-.5,r,0,Math.PI*2);
	this.o.closePath();
	this.o[this.style]();
}
palette.prototype._r=function(x1,y1,x2,y2){
	var w=x2-x1;
	var h=y2-y1;
	return (Math.sqrt(Math.pow(w,2)+Math.pow(h,2)));
}
palette.prototype.poly=function(x1,y1,x2,y2){
	var r=this._r(x1,y1,x2,y2);
	var ang=360/this.num;
	var n=this.num;
	this.o.beginPath();
	for(var i=0;i<n;i++){
		this.o.lineTo(x1+Math.cos(ang*Math.PI/180*i)*r,y1+Math.sin(ang*Math.PI/180*i)*r);
	}
	this.o.closePath();
	this.o[this.style]();
}
palette.prototype.polystar=function(x1,y1,x2,y2){
	var r=this._r(x1,y1,x2,y2);
	var r2=r*0.3;
	var ang=360/this.num/2;
	var n=this.num*2;
	this.o.beginPath();
	for(var i=0;i<n;i++){
		if(i%2==1){
		this.o.lineTo(x1+Math.cos(ang*Math.PI/180*i)*r,y1+Math.sin(ang*Math.PI/180*i)*r);
	    }else if(i%2==0){
        this.o.lineTo(x1+Math.cos(ang*Math.PI/180*i)*r2,y1+Math.sin(ang*Math.PI/180*i)*r2);
	    }
	}
	this.o.closePath();
	this.o[this.style]();
}