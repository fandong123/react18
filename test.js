function fun(a, b) {
  console.log(a, b);
}

Function.prototype.myBind = function(target, ...res) {

  return (...rest) => {
    this.apply(target, [...res, ...rest])
  }
}

const f = fun.myBind(null, 1)

f()
f(3)