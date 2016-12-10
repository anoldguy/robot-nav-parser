var Robot = {
  max_power: 75,
  commands: [],
  _validate_power: function(power){
    if(power > this.max_power){
      return this.max_power;
    } else if (power < -this.max_power){
      return -this.max_power;
    } else {
      return power;
    }
  },
  drive: function(power, distance){
    this.commands.push({command: "DRIVE", arg1: this._validate_power(power), arg2: distance});
  },
  turn: function(direction, degrees, power){
    this.commands.push({command: direction.toUpperCase(), arg1: degrees, arg2: this._validate_power(power)});
  },
  turn_left: function(degrees, power){
    this.turn("left", degrees, power)
  },
  turn_right: function(degrees, power){
    this.turn("right", degrees, power)
  },
  pivot: function(direction, degrees, power){
    this.commands.push({command: direction.toUpperCase(), arg1: degrees, arg2: this._validate_power(power)});
  },
  output: function(){
    var output = "";
    this.commands.forEach(function(cmd){
      output += cmd.command + "\r";
      output += cmd.arg1 + "\r";
      output += cmd.arg2 + "\r";
      output += cmd.arg3 ? cmd.arg3 : 0 + "\r";
      output += cmd.arg4 ? cmd.arg4 : 0 + "\r";
    });
    output += "END\r";
    return output;
  },
  log: function(message){
    console.log(message);
  },
  read_program: function(element){
    this.commands = [];
    var raw = element.value;
    if(raw != ""){
      var lines = raw.split("\n");
      // This is tricky. If you don't give forEach a context to execute in;
      // it uses window, which is GLOBAL. Ugh.  See the next comment.
      lines.forEach(function(line, idx){
        var trimmed = line.trim();
        var lineNum = idx+1;
        if(trimmed != ""){
          if(!trimmed.match(/^\/\//)){
            try {
              eval("this."+trimmed);
            } catch(_) {
              this.log("No such command for line " + lineNum + ": '" + line + "'");
            }
          }
        }
      // Here's where we provide the context for the forEach call.
      }, this)
    }
  }
}
