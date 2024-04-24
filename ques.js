const questions = [
	{
      question: "Aim: To fit a straight line for the given data",
      code: `
  import numpy as np
from sympy import symbols,Eq,solve
import matplotlib.pyplot as plt
a,b=symbols('a,b')
x=list(map(float,input("Enter the X values : ").split()))
x=np.array(x)
y=list(map(float,input("Enter the Y values : ").split()))
y=np.array(y)
xy=sum(np.array(x*y))
x2=sum(np.array(x**2))
sy=sum(np.array(y))
sx=sum(np.array(x))
n=len(x)
eq1=Eq((n*a+b*sx),sy)
eq2=Eq((sx*a+x2*b),xy)
d=solve((eq1,eq2),(a,b))
print("Y =",round(d[a],2),"+",round(d[b],2),"X")
plt.scatter(x,y)
plt.show()
      `
    }, // Remove this extra curly brace
	{
      question: "Aim: To fit a parabola for the given data",
      code: `
  import numpy as np
  import matplotlib.pyplot as plt
  from sympy import symbols, Eq, solve
  
  a, b, c = symbols('a, b, c')
  x = np.array([int(i) for i in input("Enter the x data: ").split()])
  y = np.array([int(i) for i in input("Enter the y data: ").split()])
  n = len(x)
  sx = np.sum(x)
  sy = np.sum(y)
  sx2 = np.sum(x * x)
  sxy = np.sum(x * y)
  sx3 = np.sum(x * x * x)
  sx4 = np.sum(x ** 4)
  sx2y = np.sum(x * x * y)
  
  eq1 = Eq((n * a + sx * b + sx2 * c), sy)
  eq2 = Eq((a * sx + sx2 * b + sx3 * c), sxy)
  eq3 = Eq((a * sx2 + sx3 * b + sx4 * c), sx2y)
  
  d = solve((eq1, eq2, eq3), (a, b, c))
  
  print("The equation of parabola is y = {} + {}X + {}X²".format(d[a], d[b], d[c]))
  plt.scatter(x, y)
  plt.show()
      `
    },
    // More code objects here...
];
