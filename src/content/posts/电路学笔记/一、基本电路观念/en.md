<!-- ---
title: "基本电路观念"
description: ""
pubDate: "2026-09-14"
category: "Math & Coding"
tag: ["电路"]
postImage:
homepined: false
pinedOrder: 0
draft: false
--- -->

## Definitions of Circuit Variables
### Current

:::defi
 Current is the amount of charge passing a point per unit time.
$$
i = \frac{dq}{dt}
$$
:::



### Voltage
:::defi
 The change in work or energy per unit charge as it passes through a physical element.
$$
v = \frac{dw}{dq}
$$
:::

### Power
:::defi
Power is
$$
P = \frac{dW}{dt} = \frac{dW}{dQ} * \frac{dQ}{dt} = vi
$$
:::

### Energy
:::tip
 The integral of power P with respect to time t.
$$
W_{ab} = \int_{a}^{b} P(t)\,dt  
$$
$$
W(t)=\int_{-\infty}^t P(\tau)\,d\tau
$$
:::

---

## Component Models
### Resistor
:::defi[欧姆定律]
$$
V=Ri
$$
$$
i=\frac{1}{R}V=GV
$$
:::


### Capacitor
:::note
From
$$
Q = C*V  
$$
$$
\frac{dQ}{dt} = C \frac{dV(t)}{dt}
$$
That is:
$$
i(t) = C \frac{dV(t)}{dt}
$$
Then,
$$
\begin{aligned}
V(t) &= \int_{-\infty}^{t} \frac{i({\tau})}{C}\,d{\tau}
=\int_{-\infty}^0 \frac{i({\tau})}{C}\,d{\tau}+\int_0^{t} \frac{i({\tau})}{C}\,d{\tau}\\
&=V(0)+\frac1{C}\int_0^{t} i({\tau})\,d{\tau}
\end{aligned}
$$
:::

### Inductor
:::note
From
$$
LI=N\phi 
$$
$$
\frac{dN\phi}{dt} = L \frac{di(t)}{dt}
$$
That is:
$$
V(t) = L \frac{di(t)}{dt}
$$
Then,
$$
\begin{aligned}
i(t) &= \int_{-\infty}^{t} \frac{V({\tau})}{L}\,d{\tau}
=\int_{-\infty}^0 \frac{V({\tau})}{L}\,d{\tau}+\int_0^{t} \frac{V({\tau})}{L}\,d{\tau}\\
&=i(0)+\frac1{L}\int_0^{t} V({\tau})\,d{\tau}
\end{aligned}
$$
:::

---

## KCL and KVL
### Nodes, Elements, Loops, and Meshes
* Node数：  N(node)  
* 元件数：  B(branch)  
* Loop数：  L(loop)  
* Mesh数：  M(mesh)  

:::defi[Node(node)]
A node is a set of points in a circuit that are directly connected by ideal wires and have the same electric potential.  
A node is an electrically connected region of wire, not merely a small dot. If no component lies between points, the entire continuous wire is one node.
:::

:::defi[Loop(loop)]

:::

:::defi[Mesh(mesh)]
A mesh is a loop that cannot be divided into smaller loops.
:::

:::warning[注]
* 一个未知电路中若有B个元件，Then,有2B个电路变量($V_x$和$I_x$)
* 关系式：$M=B-(N-1)$
:::


### KCL
:::tip
The algebraic sum of currents leaving a node is zero (currents entering are negative).
$$
\sum_{K=1}^n I_K=0
$$
:::

### KVL
:::tip
The algebraic sum of voltage drops around a loop is zero (taking drops as positive).
$$
\sum_{K=1}^n V_K=0
$$
:::


---
## The 2B Method
* $N$个Node，可根据$KCL$得到$N-1$equations is
* $M$个Mesh，可根据$KVL$得到$M$equations is
* $B$个元件，可根据$component model$得到$B$equations is

:::tip

From the NMB relation, the total number of 

$N-1+M+B=2B$  

equations is
:::


---

## Quick Analysis of Simple Resistive Networks 
### Understanding Equivalent Resistance
:::caution
$$
R_{eq} = R_1+R_2+...+R_n=R_a\parallel R_b\parallel...\parallel R_z
$$
They are called `equivalent resistances` not because their numerical values are equal, but because in the `same circuit environment` they produce the same external `voltage` and `current`. Do not reverse this cause and effect.  

In particular, for a parallel circuit, the equivalent-resistance formula follows from:
$$
\frac{1}{R_{\mathrm{eq}}}=\sum_{i=1}^{n}\frac{1}{R_i}
$$
which yields:
$$ 
R_{\mathrm{eq}}=\frac{R_1R_2\cdots R_n}{\displaystyle\sum_{i=1}^{n}\left(\prod_{\substack{j=1\\j\ne i}}^{n}R_j\right)}
$$
For example:
Equivalent resistance of three parallel resistors
$$
R_{eq}=\frac{R_1R_2R_3}{R_2R_3+R_1R_3+R_1R_2}
$$
:::

### Voltage Division in Series Circuits



### Current Division in Parallel Circuits




### $\Delta$ 与 $Y$ Circuit Equivalence Transformations
:::note
$\Delta$ 转 $Y$
:::

:::note 
$Y$ 转 $\Delta$
:::