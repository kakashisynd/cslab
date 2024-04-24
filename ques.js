// Array of objects containing questions and their corresponding source codes
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
    },
	
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
    {
      question: "Aim: To find the karl pearsoncorrelation coefficient for the given data",
      code: `
  import numpy as np
# Input X and Y values
x = np.array(list(map(float, input("Enter X values: ").split())))
y = np.array(list(map(float, input("Enter Y values: ").split())))
# Calculate XY, X^2, Y^2
xy = x * y
x_squared = x ** 2
y_squared = y ** 2
# Calculate the sum of X, Y, XY, X^2, Y^2
sum_x = np.sum(x)
sum_y = np.sum(y)
sum_xy = np.sum(xy)
sum_x_squared = np.sum(x_squared)
sum_y_squared = np.sum(y_squared)
# Calculate the correlation coefficient
n = len(x)
correlation_coefficient = (n * sum_xy - sum_x * sum_y) / np.sqrt((n * sum_x_squared - sum_x ** 2) * (n * sum_y_squared - sum_y ** 2))
print("Correlation Coefficient:", correlation_coefficient)
      `
    },
    {
      question: "Aim: To find the Spearman’s correlation coefficient for the given data",
      code: `
  import pandas as pd
  import numpy as np
  from collections import Counter
  
  def modified_di(x, y):
      d1 = Counter(x)
      cf = 0
      d2 = Counter(y)
      for i in d1:
          if (d1[i] > 1):
              cf += d1[i] * (d1[i] * d1[i] - 1) / 12
      for i in d2:
          if (d2[i] > 1):
              cf += d2[i] * (d2[i] * d2[i] - 1) / 12
      return cf
  
  x = np.array(list(map(float, input("Enter X values: ").split())))
  y = np.array(list(map(float, input("Enter Y values: ").split())))
  n = len(x)
  df = pd.DataFrame(x)
  a = df.rank()
  rx = a[0].to_numpy()
  df2 = pd.DataFrame(y)
  a2 = df2.rank()
  ry = a2[0].to_numpy()
  D = rx - ry
  di2 = sum(D * D) + modified_di(x, y)
  res = pd.DataFrame({"X": x, "Y": y, "Rₓ": rx, "Rᵧ": ry, "D": D, "D²": D * D})
  res = res.to_string(index=False)
  print(res)
  cc = 1 - (6 * di2 / (n * (n * n - 1)))
  print("Spearman's Correlation Coefficient =", round(cc, 4))
      `
    },
    {
      question: "Aim: To write a Python program to classify the data based on One-way ANOVA.",
      code: `
  import pandas as pd
  import scipy.stats as se
  
  n = int(input("Enter no. of treatments: "))
  l = []
  N = 0
  for i in range(n):
      l.append(list(map(int, input("Enter treatment(s): ").split())))
  G = S = RSS = 0
  alpha = float(input("Enter Level of Significance: "))
  for i in l:
      G += sum(i)
      S += sum(i) * sum(i) / len(i)
  
  for i in l:
      for j in i:
          RSS += j * j
          N += 1
  
  CF = round(G * G / N, 2)
  SST = round(RSS - CF, 2)
  SStr = round(S - CF, 2)
  SSe = round(SST - SStr, 2)
  
  F = round((SStr / (n - 1)) / (SSe / (N - n)), 3)
  data = {
      "Source of Variation": ["Treatments", "Error", "Total"],
      'Sum of Squares': [SStr, SSe, SST],
      'DOF': [n - 1, N - n, N - 1],
      'Mean Sum of Squares': [round(SStr / (n - 1), 2), round(SSe / (N - n), 2), "-"],
      'Variance Ratio': ["-", F, "-"]
  }
  df = pd.DataFrame(data)
  df = df.to_string(index=False)
  print(df)
  
  if (F > 1):
      Ftab = round(se.f.ppf(q=1 - alpha, dfn=n - 1, dfd=N - n), 2)
  else:
      F = round(1 / F, 2)
      Ftab = round(se.f.ppf(q=1 - alpha, dfn=N - n, dfd=n - 1), 2)
  
  print("F calculated value =", F, "\nF table value =", Ftab)
  if (F < Ftab):
      print("Since Fcal.<Ftable value, We accept H₀.")
  else:
      print("Since Fcal.>Ftable value, We reject H₀.")
      `
    },
    {
      question: "Aim: To implement Python Program to calculate Multi-Linear Regression Model.",
      code: `
  import numpy as np
  import pandas as pd
  import scipy.stats as se
  
  alpha = float(input("Enter Level of Significance: "))
  y = np.array(list(map(int, input("Enter Dependent Variable Values(Y): ").split())))
  n = int(input("Enter num. of Independent Variables: "))
  N = len(y)
  x = []
  temp = []
  t = [1] * len(y)
  x.append(t)
  
  for i in range(n):
      u = list(map(int, input("Enter Independent Variables Values(X values): ").split()))
      x.append(u)
      temp.append(u)
  
  temp = np.array(temp)
  x = np.array(x)
  x = np.transpose(x)
  y = np.transpose(y)
  beta = np.dot(np.linalg.inv(np.dot(np.transpose(x), x)), np.dot(np.transpose(x), y))
  
  print("Y = ", end="", sep="")
  for i in range(len(beta)):
      if (i == len(beta) - 1):
          print(round(beta[i], 4), "X", i, end="\n", sep="")
      else:
          print(round(beta[i], 4), "X", i, " + ", end="", sep="")
  
  ycap = []
  for i in range(len(y)):
      ycap.append(beta[0] + temp[0][i] * beta[1] + temp[1][i] * beta[2])
  
  sigma = y - ycap
  SSe = SST = 0
  
  for i in range(len(sigma)):
      SSe += round(sigma[i] * sigma[i], 2)
      SST += round((y[i] - np.mean(y)) ** 2, 2)
  SSr = SST - SSe
  R2 = round(SSr / SST, 2)
  
  print("R² value is:", R2)
  if (R2 > 0.9):
      print("The Model is a Good Fit.")
  else:
      print("The Model is Not a Good Fit.")
  
  n = n + 1
  F = round((SSr / (n - 1)) / (SSe / (N - n)), 3)
  data = {
      "Source of Variation": ["Regression", "Error", "Total"],
      'Sum of Squares': [SSr, SSe, SST],
      'DOF': [n - 1, N - n, N - 1],
      'Mean Sum of Squares': [round(SSr / (n - 1), 2), round(SSe / (N - n), 2), "-"],
      'Variance Ratio': ["-", F, "-"]
  }
  df = pd.DataFrame(data).to_string(index=False)
  print(df)
  
  if (F > 1):
      Ftab = round(se.f.ppf(q=1 - alpha, dfn=n - 1, dfd=N - n), 2)
  else:
      F = round(1 / F, 2)
      Ftab = round(se.f.ppf(q=1 - alpha, dfn=N - n, dfd=n - 1), 2)
  
  print("F calculated value =", F, "\nF table value =", Ftab)
  if (F < Ftab):
      print("Since Fcal.<Ftable value, We accept H₀.")
  else:
      print("Since Fcal.>Ftable value, We reject H₀.")
      `
    },
    {
      question: "Aim: To implement Python Program to calculate Multi Variate Linear Regression.",
      code: `
  import numpy as np
  
  y = []
  x = []
  n1 = int(input("Enter num. of Dependent Variables(Y's): "))
  n2 = int(input("Enter num. of Independent Variables(X's): "))
  
  for i in range(n1):
      y.append(list(map(float, input("Y{}: ".format(i + 1)).split())))
  
  x.append([1] * len(y[0]))
  
  for i in range(n2):
      x.append(list(map(float, input("X{}: ".format(i + 1)).split())))
  
  x = np.array(x)
  x = np.transpose(x)
  y = np.array(y)
  y = np.transpose(y)
  
  beta = np.dot(np.linalg.inv(np.dot(np.transpose(x), x)), np.dot(np.transpose(x), y))
  beta = np.round(beta, decimals=2)
  shape = beta.shape
  
  y1_expression = "Y1 = "
  y2_expression = "Y2 = "
  
  for i in range(shape[0]):
      y1_expression += " {}X{} + ".format(beta[i][0], i + 1)
      y2_expression += " {}X{} + ".format(beta[i][1], i + 1)
  
  print(y1_expression)
  print(y2_expression)
      `
    },
    {
    question: "Aim: Two way anova.",
      code: `
      import pandas as pd
import scipy.stats as se
h=int(input("Enter no. of Blocks: "))
k=int(input("Enter no. of Treatments: "))
t=[]
for i in range(k):
	t.append(list(map(int,input("Enter treatment(s): ").split())))
Ti=Bj=G=RSS=N=0
alpha=float(input("Enter Level of Significance: "))
for i in t:
	Ti+=sum(i)*sum(i)
	G+=sum(i)
for i in range(len(t[0])):
	position_sum = sum(sublist[i] for sublist in t)
	Bj += position_sum ** 2
print("G =",G)
print("ΣTᵢ² =",Ti)
print("ΣBⱼ² =",Bj)
for i in t:
for j in i:
RSS+=j*j
N+=1
CF=round(G*G/N,2)
SST=round(RSS-CF,2)
SStr=round(Ti/h-CF,2)
SSb=round(Bj/k-CF,2)
SSe=round(SST-SStr-SSb,2)
print("1. RSS =",RSS)
print("2. CF =",CF)
print("3. SST =",SST)
print("4. SStr =",SStr)
print("4. SSb =",SSb)
print("6. SSe =",SSe)
Ftr=round((SStr/(k-1))/(SSe/((k-1)*(h-1))),3)
Fb=round((SSb/(h-1))/(SSe/((k-1)*(h-1))),3)
data={
"Source of Variation":["Treatments","Blocks","Error","Total"],
'Sum of Squares': [SStr,SSb,SSe,SST],
'DOF': [k-1,h-1,(h-1)*(k-1),k*h-1],
'Mean Sum of Squares' :[round(SStr/(k-1),2),round(SSb/(h-1),2),round(SSe/((k-1)*(h-1)),2),"-
"],
'Variance Ratio' :["-",Ftr,Fb,"-"]
}
df=pd.DataFrame(data)
df=df.to_string(index=False)
print(df)
if(Ftr>1):
	Ftabtr=round(se.f.ppf(q=1-alpha,dfn=k-1,dfd=(k-1)*(h-1)),2)
else:
	Ftr=round(1/Ftr,3)
	Ftabtr=round(se.f.ppf(q=1-alpha,dfn=(k-1)*(h-1),dfd=k-1),2)
print("\n---Inference related to Treatments---")
print("F calculated value =",Ftr,"\nF table value =",Ftabtr)
if(Ftr<Ftabtr):
	print("Since Fcal.<Ftable value, We accept H₀(tr).")
else:
	print("Since Fcal.>Ftable value, We reject H₀(tr).")
if(Fb>1):
	Ftabb=round(se.f.ppf(q=1-alpha,dfn=h-1,dfd=(k-1)*(h-1)),2)
else:
	Ftr=round(1/Fb,3)
	Ftabb=round(se.f.ppf(q=1-alpha,dfn=(k-1)*(h-1),dfd=h-1),2)
print("\n---Inference related to Blocks---")
print("F calculated value =",Fb,"\nF table value =",Ftabb)
if(Fb<Ftabb):
	print("Since Fcal.<Ftable value, We accept H₀(b).")
else:
	print("Since Fcal.>Ftable value, We reject H₀(b).")
      `
    },
    // Add more questions and source codes as needed
  ];
  
  // Function to generate question content with buttons to copy source code
  function generateQuestionContent() {
    const questionContainer = document.getElementById('questionContainer');
  
    questions.forEach((item, index) => {
      // Create question heading
      const questionHeading = document.createElement('h3');
      questionHeading.textContent = `Question ${index + 1}: ${item.question}`;
      questionContainer.appendChild(questionHeading);
  
      // Create code button
      const codeButton = document.createElement('button');
      codeButton.textContent = `Copy Source Code`;
      codeButton.addEventListener('click', () => {
        copyCode(item.code);
      });
      questionContainer.appendChild(codeButton);
      questionContainer.appendChild(document.createElement('br')); // Line break for spacing
    });
  }
  
  // Function to copy code to clipboard
  function copyCode(code) {
    navigator.clipboard.writeText(code)
      .then(() => {
      })
      .catch(err => {
        console.error('Unable to copy source code:', err);
      });
  }
  
  // Generate question content when the page loads
  document.addEventListener('DOMContentLoaded', generateQuestionContent);
  
