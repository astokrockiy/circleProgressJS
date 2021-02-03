  function linear(timeFraction){
    return timeFraction;
  }
  function end(result, d, w, twoSided, full, can, fixed, spanProcent, textFunction, replace, empty, halfCircle, shift, c, v, pow, posX, posY, width, progressWidth, color, progressColor){
    if(!empty){
      procent = v * pow;
      if(textFunction.length>0){
        spanProcent.innerHTML = eval(textFunction+"(\""+(procent.toFixed(fixed))+"\")");
      }
      else if(replace.length > 0){
        let tmp = procent.toFixed(fixed).toString();
        for(let i = 0;i < replace.length;i++){
          tmp = tmp.replaceAll(replace[i][0],replace[i][1]);
        }
        spanProcent.innerHTML = tmp;
      }else{
        spanProcent.innerHTML = procent.toFixed(fixed);
      }
    }
    c.clearRect( 0, 0, can.width, can.height );
    if(full){
      c.beginPath();
      if(halfCircle){
        let fullShift = 0;
        if(c.lineCap == "round"){
          fullShift += progressWidth/4;
        }
        if(twoSided){
          c.arc( posX, posY, d/2-w/2, (Math.PI/180) * (270 + result/2 + shift + fullShift), (Math.PI/180) * (270 + shift - result/2 - fullShift));
        }
        else{
          c.arc( posX, posY, d/2-w/2, (Math.PI/180) * (270 + result + shift + fullShift), (Math.PI/180) * (270 + shift - fullShift));
        }
      }
      else{
        c.arc( posX, posY, d/2-w/2, (Math.PI/180) * 270, (Math.PI/180) * (270 + 360) );
      }
      c.strokeStyle = color;
      c.lineWidth = width;
      c.stroke();
    }
    c.beginPath();
    c.strokeStyle = progressColor;
    c.lineWidth = progressWidth;
    if(twoSided){
      c.arc( posX, posY, d/2-w/2, (Math.PI/180) * (270 + shift - result/2), (Math.PI/180) * (270 + result/2 + shift) );
    }
    else{
      c.arc( posX, posY, d/2-w/2, (Math.PI/180) * (270 + shift), (Math.PI/180) * (270 + result + shift) );
    }
    c.stroke();
  }
  function circleProgressJS(wrap){
    let replace = "";
    let textFunction = "";
    let empty = false;
    let changeModeFull = false;
    let twoSided = false;
    let reverse = false;
    let halfCircle = false;
    let shift = 0;
    let animateColor = false;
    let animateProgressColor = false
    let endColor, endProgressColor;
    let animateWidth = false;
    let animateProgressWidth = false;
    let endWidth = 0;
    let endProgressWidth = 0;
    let fixed = 0;
    let pow = 1;
    let d = wrap.dataset.diameter;
    if (wrap.dataset.fixed != undefined){
      fixed = wrap.dataset.fixed;
    }
    if (wrap.dataset.power != undefined){
      pow = wrap.dataset.power;
    }
    if(wrap.dataset.reverse){
      reverse = true;
    }
    if(wrap.dataset.changeModeFull){
      changeModeFull = true;
    }
    if(wrap.dataset.twoSided){
      twoSided = true;
    }
    if(wrap.dataset.halfCircle){
      halfCircle = true;
    }
    if(wrap.dataset.empty){
      empty = true;
    }
    if(wrap.dataset.replace != undefined){
      replace = wrap.dataset.replace.split("];[");
      for(let i = 0;i < replace.length;i++){
        replace[i] = replace[i].replaceAll("[", "").replaceAll("]", "");
        replace[i] = replace[i].slice(1, replace[i].length-1).split("';'");
      }
    }
    if(wrap.dataset.textFunction != undefined){
      textFunction = wrap.dataset.textFunction;
    }
    let can = document.createElement('canvas');
    let spanProcent = document.createElement('span');
    can.width = d;
    can.height = d;
    spanProcent.style.display = "block";
    spanProcent.style.position = "absolute";
    spanProcent.style.left = "50%";
    spanProcent.style.top = "50%";
    spanProcent.style.transform = "translate(-50%, -50%)";
    wrap.append(can);
    wrap.append(spanProcent);
    let c = can.getContext('2d');
    let v = Number(wrap.dataset.value);
    let duration = wrap.dataset.time;
    let color;
    if(wrap.dataset.color != undefined){
      if(wrap.dataset.color.indexOf(";") == -1 && wrap.dataset.color.indexOf("gradient") == -1 && wrap.dataset.color.indexOf("image") == -1){
        color = wrap.dataset.color;
      }
      else if(wrap.dataset.color.indexOf("gradient") == -1 && wrap.dataset.color.indexOf("image") == -1){
        animateColor = true;
        let colorStr = wrap.dataset.color.split(';')[0].replaceAll(/\s/g, '');
        let endColorStr = wrap.dataset.color.split(';')[1].replaceAll(/\s/g, '');

        if(colorStr.indexOf("#") != -1){
          let r = parseInt([colorStr[1], colorStr[2]].join(""),16);
          let g = parseInt([colorStr[3], colorStr[4]].join(""),16);
          let b = parseInt([colorStr[5], colorStr[6]].join(""),16);
          let a = 1;
          color = [r,g,b,a];
        }
        else if(colorStr.indexOf("rgba") != -1){
          let r = parseInt(colorStr.split("rgba(")[1].split(")")[0].split(",")[0],10);
          let g = parseInt(colorStr.split("rgba(")[1].split(")")[0].split(",")[1],10);
          let b = parseInt(colorStr.split("rgba(")[1].split(")")[0].split(",")[2],10);
          let a = Number(colorStr.split("rgba(")[1].split(")")[0].split(",")[3]);
          color = [r,g,b,a];
        }
        else if(colorStr.indexOf("rgb") != -1){
          let r = parseInt(colorStr.split("rgb(")[1].split(")")[0].split(",")[0],10);
          let g = parseInt(colorStr.split("rgb(")[1].split(")")[0].split(",")[1],10);
          let b = parseInt(colorStr.split("rgb(")[1].split(")")[0].split(",")[2],10);
          let a = 1;
          color = [r,g,b,a];
        }


        if(endColorStr.indexOf("#") != -1){
          let r = parseInt([endColorStr[1], endColorStr[2]].join(""),16);
          let g = parseInt([endColorStr[3], endColorStr[4]].join(""),16);
          let b = parseInt([endColorStr[5], endColorStr[6]].join(""),16);
          let a = 1;
          endColor = [r,g,b,a];
        }
        else if(endColorStr.indexOf("rgba") != -1){
          let r = parseInt(endColorStr.split("rgba(")[1].split(")")[0].split(",")[0],10);
          let g = parseInt(endColorStr.split("rgba(")[1].split(")")[0].split(",")[1],10);
          let b = parseInt(endColorStr.split("rgba(")[1].split(")")[0].split(",")[2],10);
          let a = Number(endColorStr.split("rgba(")[1].split(")")[0].split(",")[3]);
          endColor = [r,g,b,a];
        }
        else if(endColorStr.indexOf("rgb") != -1){
          let r = parseInt(endColorStr.split("rgb(")[1].split(")")[0].split(",")[0],10);
          let g = parseInt(endColorStr.split("rgb(")[1].split(")")[0].split(",")[1],10);
          let b = parseInt(endColorStr.split("rgb(")[1].split(")")[0].split(",")[2],10);
          let a = 1;
          endColor = [r,g,b,a];
        }
      }
      else if(wrap.dataset.color.indexOf("image") == -1){
        let colorStr = wrap.dataset.color.replace("gradient","").replaceAll(" ","");
        colorStr = colorStr.slice(1,colorStr.length-1);
        let angle = colorStr.split(";",1);
        let x0 = d / 2 * (1 - Math.cos(angle*180/Math.PI));
        let y0 = d / 2 * (1 + Math.sin(angle*180/Math.PI));
        let x1 = d / 2 * (1 + Math.cos(angle*180/Math.PI));
        let y1 = d / 2 * (1 - Math.sin(angle*180/Math.PI));
        color = c.createLinearGradient(x0,y0,x1,y1);
        let steps = colorStr.replace(angle+";","");
        steps = steps.replace("[[","").replace("]]","").split("];[");
        for(let i = 0;i < steps.length;i++){
          steps[i] = steps[i].split(";");
          color.addColorStop(steps[i][1],steps[i][0]);
        }
      }
      else{
        let src = wrap.dataset.color.replace("image(","").replace(")","");
        let img = new Image();
        img.src = src;
        img.onload = function() {
          let canvas = document.createElement('canvas');
          let ctx = canvas.getContext('2d');
          canvas.width=d;
          canvas.height=d;
          ctx.drawImage(img, 0, 0, d, d); 
          color = c.createPattern(canvas, 'no-repeat');
        }
      }
    }
    let progressColor;
    if(wrap.dataset.progressColor != undefined){
      if(wrap.dataset.progressColor.indexOf(";") == -1 && wrap.dataset.progressColor.indexOf("gradient") == -1 && wrap.dataset.progressColor.indexOf("image") == -1){
        progressColor = wrap.dataset.progressColor;
      }
      else if(wrap.dataset.progressColor.indexOf("gradient") == -1 && wrap.dataset.progressColor.indexOf("image") == -1){
        animateProgressColor = true;
        let progressColorStr = wrap.dataset.progressColor.split(';')[0].replaceAll(/\s/g, '');
        let endProgressColorStr = wrap.dataset.progressColor.split(';')[1].replaceAll(/\s/g, '');

        if(progressColorStr.indexOf("#") != -1){
          let r = parseInt([progressColorStr[1], progressColorStr[2]].join(""),16);
          let g = parseInt([progressColorStr[3], progressColorStr[4]].join(""),16);
          let b = parseInt([progressColorStr[5], progressColorStr[6]].join(""),16);
          let a = 1;
          progressColor = [r,g,b,a];
        }
        else if(progressColorStr.indexOf("rgba") != -1){
          let r = parseInt(progressColorStr.split("rgba(")[1].split(")")[0].split(",")[0],10);
          let g = parseInt(progressColorStr.split("rgba(")[1].split(")")[0].split(",")[1],10);
          let b = parseInt(progressColorStr.split("rgba(")[1].split(")")[0].split(",")[2],10);
          let a = Number(progressColorStr.split("rgba(")[1].split(")")[0].split(",")[3]);
          progressColor = [r,g,b,a];
        }
        else if(progressColorStr.indexOf("rgb") != -1){
          let r = parseInt(progressColorStr.split("rgb(")[1].split(")")[0].split(",")[0],10);
          let g = parseInt(progressColorStr.split("rgb(")[1].split(")")[0].split(",")[1],10);
          let b = parseInt(progressColorStr.split("rgb(")[1].split(")")[0].split(",")[2],10);
          let a = 1;
          progressColor = [r,g,b,a];
        }


        if(endProgressColorStr.indexOf("#") != -1){
          let r = parseInt([endProgressColorStr[1], endProgressColorStr[2]].join(""),16);
          let g = parseInt([endProgressColorStr[3], endProgressColorStr[4]].join(""),16);
          let b = parseInt([endProgressColorStr[5], endProgressColorStr[6]].join(""),16);
          let a = 1;
          endProgressColor = [r,g,b,a];
        }
        else if(endProgressColorStr.indexOf("rgba") != -1){
          let r = parseInt(endProgressColorStr.split("rgba(")[1].split(")")[0].split(",")[0],10);
          let g = parseInt(endProgressColorStr.split("rgba(")[1].split(")")[0].split(",")[1],10);
          let b = parseInt(endProgressColorStr.split("rgba(")[1].split(")")[0].split(",")[2],10);
          let a = Number(endProgressColorStr.split("rgba(")[1].split(")")[0].split(",")[3]);
          endProgressColor = [r,g,b,a];
        }
        else if(endProgressColorStr.indexOf("rgb") != -1){
          let r = parseInt(endProgressColorStr.split("rgb(")[1].split(")")[0].split(",")[0],10);
          let g = parseInt(endProgressColorStr.split("rgb(")[1].split(")")[0].split(",")[1],10);
          let b = parseInt(endProgressColorStr.split("rgb(")[1].split(")")[0].split(",")[2],10);
          let a = 1;
          endProgressColor = [r,g,b,a];
        }
      }
      else if(wrap.dataset.progressColor.indexOf("image") == -1){
        let progressColorStr = wrap.dataset.progressColor.replace("gradient","").replaceAll(" ","");
        progressColorStr = progressColorStr.slice(1,progressColorStr.length-1);
        let angle = progressColorStr.split(";",1);
        let x0 = d / 2 * (1 - Math.cos(angle*180/Math.PI));
        let y0 = d / 2 * (1 + Math.sin(angle*180/Math.PI));
        let x1 = d / 2 * (1 + Math.cos(angle*180/Math.PI));
        let y1 = d / 2 * (1 - Math.sin(angle*180/Math.PI));
        progressColor = c.createLinearGradient(x0,y0,x1,y1);
        let steps = progressColorStr.replace(angle+";","");
        steps = steps.replace("[[","").replace("]]","").split("];[");
        for(let i = 0;i < steps.length;i++){
          steps[i] = steps[i].split(";");
          progressColor.addColorStop(steps[i][1],steps[i][0]);
        }
      }
      else{
        let src = wrap.dataset.progressColor.replace("image(","").replace(")","");
        let imgProgress = new Image();
        imgProgress.src = src;
        imgProgress.onload = function() {
          let canvas = document.createElement('canvas');
          let ctx = canvas.getContext('2d');
          canvas.width=d;
          canvas.height=d;
          ctx.drawImage(imgProgress, 0, 0, d, d); 
          progressColor = c.createPattern(canvas, 'no-repeat');
        }
      }
    }

    let width;
    let progressWidth;
    if(wrap.dataset.width != undefined){
      if(wrap.dataset.width.indexOf(";") == -1){
        width = Number(wrap.dataset.width);
      }
      else{
        animateWidth = true;
        width = Number(wrap.dataset.width.split(';')[0]);
        endWidth = Number(wrap.dataset.width.split(';')[1]);
      }
    }
    if(wrap.dataset.progressWidth != undefined){
      if(wrap.dataset.progressWidth.indexOf(";") == -1){
        progressWidth = Number(wrap.dataset.progressWidth);
      }
      else{
        animateProgressWidth = true;
        progressWidth = Number(wrap.dataset.progressWidth.split(';')[0]);
        endProgressWidth = Number(wrap.dataset.progressWidth.split(';')[1]);
      }
    }
    wrap.style.position = "relative";
    wrap.style.width = d+"px";
    wrap.style.height = d+"px";
    let w = Math.max(width, progressWidth, endWidth, endProgressWidth);
    let full = false;
    if(wrap.dataset.width != undefined && wrap.dataset.color != undefined){
      full = true;
    }
    if(wrap.dataset.shift != undefined){
      shift = Number(wrap.dataset.shift);
    }
    let posX = d / 2,
    posY = d / 2,
    procent = 0,
    result = 360 * v;
    if(wrap.dataset.round){
      c.lineCap = 'round';
    }
    arcMove();

    function arcMove(){
      let deegres;
      let startDeegres;
      let endDeegres = (v * 360).toFixed();
      if(wrap.dataset.startValue == undefined){
        if(reverse){
          startDeegres = 360;
        }
        else{
          startDeegres = 0;
        }
      }
      else{
        startDeegres = 360*Number(wrap.dataset.startValue);
      }
      if(changeModeFull){
        if(wrap.dataset.startValue == undefined){
          if(reverse){
            duration *= (1-v);
          }
          else{
            duration *= v;
          }
        }
        else{
          if(reverse){
            duration *= (wrap.dataset.startValue - v);
          }
          else{
            duration *= (v - wrap.dataset.startValue);
          }
        }
      }
      if(duration > 0){
        let start = performance.now();
        requestAnimationFrame(function animate() {
          let timeFraction = (performance.now() - start) / duration;
          if (timeFraction > 1) timeFraction = 1;
          let progress
          if(wrap.dataset.easing == undefined){
            progress = linear(timeFraction);
          }
          else{
            progress = eval(wrap.dataset.easing+"("+timeFraction+")");
          }
          draw(progress);
          if (timeFraction < 1) {
            requestAnimationFrame(animate);
          }

        });
        function draw(progress) {
          if (reverse){
            deegres = (startDeegres - (startDeegres - endDeegres)*progress);
          }
          else{
            deegres = ((endDeegres - startDeegres)*progress+startDeegres);
          }

          c.clearRect( 0, 0, can.width, can.height );
          if(!empty){
            procent = (deegres / 360) * pow;
            if(textFunction.length>0){
              spanProcent.innerHTML = eval(textFunction+"(\""+(procent.toFixed(fixed))+"\")");
            }
            else if(replace.length > 0){
              let tmp = procent.toFixed(fixed).toString();
              for(let i = 0;i < replace.length;i++){
                tmp = tmp.replaceAll(replace[i][0],replace[i][1]);
              }
              spanProcent.innerHTML = tmp;
            }
            else{
              spanProcent.innerHTML = procent.toFixed(fixed);
            }
          }
          if(full){
            c.beginPath();
            if(!animateColor){
              c.strokeStyle = color;
            }
            else{
              c.strokeStyle = "rgba("+((endColor[0]-color[0])*progress+color[0])+","+((endColor[1]-color[1])*progress+color[1])+","+((endColor[2]-color[2])*progress+color[2])+","+((endColor[3]-color[3])*progress+color[3])+")";
            }
            if(animateWidth){
              c.lineWidth = (endWidth-width)*progress+width;
            }
            else{
              c.lineWidth = width;
            }
            if(halfCircle){
              let fullShift = 0;
              if(c.lineCap == "round"){
                fullShift += progressWidth/4;
              }
              if(twoSided){
                c.arc( posX, posY, d/2-w/2, (Math.PI/180) * (270 + deegres/2 + shift + fullShift), (Math.PI/180) * (270 + shift - deegres/2 - fullShift) );
              }
              else{
                c.arc( posX, posY, d/2-w/2, (Math.PI/180) * (270 + deegres + shift + fullShift), (Math.PI/180) * (270 + shift - fullShift));
              }
            }
            else{
              c.arc( posX, posY, d/2-w/2, (Math.PI/180) * 270, (Math.PI/180) * (270 + 360) );
            }
            c.stroke();
          }
          c.beginPath();
          if(!animateProgressColor){
            c.strokeStyle = progressColor;
          }
          else{
            c.strokeStyle = "rgba("+((endProgressColor[0]-progressColor[0])*progress+progressColor[0])+","+((endProgressColor[1]-progressColor[1])*progress+progressColor[1])+","+((endProgressColor[2]-progressColor[2])*progress+progressColor[2])+","+((endProgressColor[3]-progressColor[3])*progress+progressColor[3])+")";
          }
          if(animateProgressWidth){
            c.lineWidth = (endProgressWidth-progressWidth)*progress+progressWidth;
          }
          else{
            c.lineWidth = progressWidth;
          }
          if(twoSided){
            c.arc( posX, posY, d/2-w/2, (Math.PI/180) * (270 + shift - deegres/2), (Math.PI/180) * (270 + deegres/2 + shift) );
          }
          else{
            c.arc( posX, posY, d/2-w/2, (Math.PI/180) * (270 + shift), (Math.PI/180) * (270 + deegres + shift) );
          }
          c.stroke();
        }
      }
      else{
        end(result, d, w, twoSided, full, can, fixed, spanProcent, textFunction, replace, empty, halfCircle, shift, c, v, pow, posX, posY, width, progressWidth, color, progressColor);
      }
    }
  }